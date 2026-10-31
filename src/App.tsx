/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mode } from './types';
import { useLottery } from './hooks/useLottery';
import { useUnlock } from './hooks/useUnlock';
import { Header } from './components/Header';
import { StatusBar, SectionDivider } from './components/StatusBar';
import { GameCards } from './components/GameCards';
import { LeaderboardCard } from './components/LeaderboardCard';
import { ServerGrid } from './components/ServerGrid';
import { LockModal } from './components/LockModal';
import { PredictionView } from './components/PredictionView';
import { APP_CONFIG, ENGINE_NAMES, MODE_CONFIG } from './lib/constants';

type Screen = 'home' | 'grid' | 'locked' | 'prediction';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [selectedMode, setSelectedMode] = useState<Mode>('30s');
  const [selectedEngineId, setSelectedEngineId] = useState<number>(1);
  const [wingoExpanded, setWingoExpanded] = useState<boolean>(false);

  const {
    modeStates,
    isOnline,
    currentTime,
    getTopEngines,
    getHotStreakEngine,
  } = useLottery();

  const { isUnlocked, unlockWithPassGate } = useUnlock();

  const formattedTime = currentTime.toLocaleTimeString();

  // Navigation handlers
  const handleOpenGrid = (mode: Mode) => {
    setSelectedMode(mode);
    setScreen('grid');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectEngine = (engineId: number) => {
    setSelectedEngineId(engineId);
    if (isUnlocked) {
      setScreen('prediction');
    } else {
      setScreen('locked');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUnlockAttempt = async (
    password: string
  ): Promise<{ success: boolean; message: string }> => {
    const res = await unlockWithPassGate(password);
    if (res.success) {
      setScreen('prediction');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    return res;
  };

  const handleBackToHome = () => {
    setScreen('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToGrid = () => {
    setScreen('grid');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeModeState = modeStates[selectedMode];
  const activeEngine = activeModeState.engines.find(
    (e) => e.id === selectedEngineId
  );
  const modesList: Mode[] = ['30s', '1m', '3m', '5m'];

  return (
    <div className="min-h-screen bg-transparent text-[#F1F5FF] relative selection:bg-cyan-500/25">
      <div className="max-w-[480px] mx-auto relative z-[1] px-3 pb-8">
        {screen === 'home' && (
          <div className="animate-fade-up">
            <Header />
            <StatusBar isOnline={isOnline} time={formattedTime} />

            <SectionDivider icon="✨" title="Prediction Games" />
            <GameCards
              wingoExpanded={wingoExpanded}
              setWingoExpanded={setWingoExpanded}
              onSelectMode={handleOpenGrid}
              onExploreVIP={() => handleOpenGrid('30s')}
            />

            <SectionDivider icon="🏆" title="Live Leaderboard" />
            {modesList.map((mode) => {
              const cfg = MODE_CONFIG[mode];
              const top = getTopEngines(mode, 3);
              const streak = getHotStreakEngine(mode);

              return (
                <LeaderboardCard
                  key={mode}
                  mode={mode}
                  label={cfg.label}
                  badge={cfg.badge}
                  topEngines={top}
                  hotStreakEngine={streak}
                  onClick={() => handleOpenGrid(mode)}
                />
              );
            })}

            <div className="text-center text-[0.6rem] text-tertiary tracking-widest uppercase mt-6 pb-4 font-mono animate-text-glow">
              2026 {APP_CONFIG.name} || TLB TEAM HACK
            </div>
          </div>
        )}

        {screen === 'grid' && (
          <ServerGrid
            mode={selectedMode}
            engines={activeModeState.engines}
            time={formattedTime}
            onBack={handleBackToHome}
            onSelectEngine={handleSelectEngine}
          />
        )}

        {screen === 'locked' && (
          <LockModal
            serverName={`SERVER #${selectedEngineId} · ${
              ENGINE_NAMES[selectedEngineId - 1] || 'Engine'
            }`}
            onUnlock={handleUnlockAttempt}
            onBack={handleBackToGrid}
            adminTelegram={APP_CONFIG.telegram}
            channelTelegram={APP_CONFIG.telegram}
          />
        )}

        {screen === 'prediction' && (
          <PredictionView
            mode={selectedMode}
            engine={activeEngine}
            history={activeModeState.accumulatedHistory}
            time={formattedTime}
            onBack={handleBackToGrid}
          />
        )}
      </div>
    </div>
  );
}
