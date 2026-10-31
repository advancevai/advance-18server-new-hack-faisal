import { useState, useEffect, useRef, useCallback } from 'react';
import { Engine, HistoryItem, Mode, ModeState, EngineHistoryItem } from '../types';
import { fetchModeHistory } from '../lib/api';
import { calculateAllPredictions, isBigOrSmall } from '../lib/logic';

const STORAGE_PREFIX = 'lah_react_';

export function createInitialEngines(): Engine[] {
  return Array.from({ length: 17 }, (_, i) => ({
    id: i + 1,
    name: `Logic ${i + 1}`,
    wins: 0,
    losses: 0,
    currentPrediction: null,
    history: [],
    consecutiveWins: 0,
    maxConsecutiveWins: 0,
  }));
}

function loadInitialModeState(mode: Mode): ModeState {
  const defaultState: ModeState = {
    engines: createInitialEngines(),
    history: [],
    lastProcessedPeriod: null,
    accumulatedHistory: [],
  };

  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + mode);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.engines)) {
        parsed.engines.forEach((stored: Partial<Engine>) => {
          const match = defaultState.engines.find((e) => e.id === stored.id);
          if (match) {
            match.wins = stored.wins || 0;
            match.losses = stored.losses || 0;
            match.history = stored.history || [];
            match.consecutiveWins = stored.consecutiveWins || 0;
            match.maxConsecutiveWins = stored.maxConsecutiveWins || 0;
          }
        });
      }
      defaultState.lastProcessedPeriod = parsed.lastProcessedPeriod || null;
      defaultState.accumulatedHistory = parsed.accumulatedHistory || [];
    }
  } catch {
    // Ignore storage parse errors
  }

  return defaultState;
}

function persistModeState(mode: Mode, state: ModeState) {
  try {
    const payload = {
      engines: state.engines.map((e) => ({
        id: e.id,
        wins: e.wins,
        losses: e.losses,
        history: e.history.slice(0, 100),
        consecutiveWins: e.consecutiveWins,
        maxConsecutiveWins: e.maxConsecutiveWins,
      })),
      lastProcessedPeriod: state.lastProcessedPeriod,
      accumulatedHistory: state.accumulatedHistory.slice(0, 50),
    };
    localStorage.setItem(STORAGE_PREFIX + mode, JSON.stringify(payload));
  } catch {
    // Ignore storage save errors
  }
}

export function useLottery() {
  const [modeStates, setModeStates] = useState<Record<Mode, ModeState>>(() => ({
    '30s': loadInitialModeState('30s'),
    '1m': loadInitialModeState('1m'),
    '3m': loadInitialModeState('3m'),
    '5m': loadInitialModeState('5m'),
  }));

  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const stateRef = useRef(modeStates);
  stateRef.current = modeStates;

  // Process a mode with fresh data
  const processMode = useCallback(async (mode: Mode) => {
    const freshHistory = await fetchModeHistory(mode);
    if (!freshHistory || freshHistory.length === 0) return;

    setIsOnline(true);

    setModeStates((prev) => {
      const currentModeState = prev[mode];
      const nextState: ModeState = {
        ...currentModeState,
        engines: currentModeState.engines.map((e) => ({
          ...e,
          history: [...e.history],
        })),
        history: [...freshHistory],
        accumulatedHistory: [...currentModeState.accumulatedHistory],
      };

      // Merge new unique periods into accumulated history
      const existingPeriods = new Set(
        nextState.accumulatedHistory.map((item) => item.period)
      );
      const newItems = freshHistory.filter(
        (item) => !existingPeriods.has(item.period)
      );

      if (newItems.length > 0) {
        nextState.accumulatedHistory = [...newItems, ...nextState.accumulatedHistory]
          .sort((a, b) => {
            try {
              return BigInt(b.period) > BigInt(a.period)
                ? 1
                : BigInt(b.period) < BigInt(a.period)
                ? -1
                : 0;
            } catch {
              return b.period.localeCompare(a.period);
            }
          })
          .slice(0, 50);
      }

      // Check which periods haven't been scored in engine histories yet
      const processedPeriods = new Set(
        nextState.engines[0]?.history.map((h) => h.period) || []
      );
      const unverifiedItems = freshHistory.filter(
        (item) => !processedPeriods.has(item.period)
      );

      if (unverifiedItems.length > 0) {
        // Process chronologically (oldest to newest)
        const ascendingQueue = [...unverifiedItems].reverse();

        for (const item of ascendingQueue) {
          // Find historical items strictly before this period to evaluate predictions
          const priorHistory = nextState.accumulatedHistory.filter((h) => {
            try {
              return BigInt(h.period) < BigInt(item.period);
            } catch {
              return h.period < item.period;
            }
          });

          if (priorHistory.length < 3) continue;

          const predictions = calculateAllPredictions(priorHistory, item.period);
          const actualOutcome = isBigOrSmall(item.number);

          nextState.engines.forEach((engine, idx) => {
            const pred = predictions[idx];
            if (!pred) return;

            const isWin = pred.type === actualOutcome;
            const status: 'WIN' | 'LOSS' = isWin ? 'WIN' : 'LOSS';

            const historyEntry: EngineHistoryItem = {
              period: item.period,
              prediction: pred.type,
              actual: actualOutcome,
              result: item.number,
              status,
            };

            engine.history = [historyEntry, ...engine.history].slice(0, 100);

            if (isWin) {
              engine.wins++;
              engine.consecutiveWins++;
              if (engine.consecutiveWins > engine.maxConsecutiveWins) {
                engine.maxConsecutiveWins = engine.consecutiveWins;
              }
            } else {
              engine.losses++;
              engine.consecutiveWins = 0;
            }
          });

          nextState.lastProcessedPeriod = item.period;
        }
      }

      // Compute prediction for the next upcoming period
      if (nextState.accumulatedHistory.length > 0) {
        const latestPeriod = nextState.accumulatedHistory[0].period;
        let upcomingPeriod: string;
        try {
          upcomingPeriod = (BigInt(latestPeriod) + 1n).toString();
        } catch {
          upcomingPeriod = String(Number(latestPeriod) + 1);
        }

        const nextPredictions = calculateAllPredictions(
          nextState.accumulatedHistory,
          upcomingPeriod
        );

        nextState.engines.forEach((engine, idx) => {
          engine.currentPrediction = nextPredictions[idx];
        });
      }

      persistModeState(mode, nextState);
      return {
        ...prev,
        [mode]: nextState,
      };
    });
  }, []);

  // Poll each mode continuously
  useEffect(() => {
    const modes: Mode[] = ['30s', '1m', '3m', '5m'];
    modes.forEach((m) => processMode(m));

    const interval = setInterval(() => {
      modes.forEach((m) => processMode(m));
    }, 4000);

    return () => clearInterval(interval);
  }, [processMode]);

  // Live clock tick
  useEffect(() => {
    const clockTimer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(clockTimer);
  }, []);

  // Helper: Get top engines by win-rate in last 10 periods
  const getTopEngines = useCallback(
    (mode: Mode, count = 5): Engine[] => {
      const modeData = modeStates[mode];
      return [...modeData.engines]
        .map((engine) => {
          const recent = engine.history.slice(0, 10);
          const wins = recent.filter((h) => h.status === 'WIN').length;
          const total = recent.length;
          const winRate = total > 0 ? (wins / total) * 100 : 0;
          return {
            ...engine,
            winRate,
          };
        })
        .sort(
          (a, b) =>
            (b.winRate || 0) - (a.winRate || 0) ||
            b.consecutiveWins - a.consecutiveWins
        )
        .slice(0, count);
    },
    [modeStates]
  );

  // Helper: Find hot streak engine
  const getHotStreakEngine = useCallback(
    (mode: Mode): Engine | null => {
      const modeData = modeStates[mode];
      let bestEngine = modeData.engines[0];
      modeData.engines.forEach((engine) => {
        if (engine.consecutiveWins > bestEngine.consecutiveWins) {
          bestEngine = engine;
        }
      });
      return bestEngine.consecutiveWins > 0 ? bestEngine : null;
    },
    [modeStates]
  );

  return {
    modeStates,
    isOnline,
    currentTime,
    processMode,
    getTopEngines,
    getHotStreakEngine,
  };
}
