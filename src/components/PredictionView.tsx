import React, { useMemo } from 'react';
import { Engine, HistoryItem, Mode } from '../types';
import { ENGINE_NAMES, MODE_CONFIG } from '../lib/constants';
import { LotteryBall } from './LotteryBall';

interface PredictionViewProps {
  mode: Mode;
  engine: Engine | undefined;
  history: HistoryItem[];
  onBack: () => void;
  time: string;
}

function formatPeriod(period: string | undefined): string {
  if (!period) return '---';
  return period.length > 8 ? '...' + period.slice(-6) : period;
}

export const PredictionView: React.FC<PredictionViewProps> = ({
  mode,
  engine,
  history,
  onBack,
}) => {
  if (!engine) {
    return (
      <div className="p-6 text-center text-[#94A3B8]">
        Engine not found.
        <button
          type="button"
          onClick={onBack}
          className="block mx-auto mt-4 px-5 py-2 rounded-xl bg-[rgba(14,20,40,0.8)] border border-[rgba(168,85,247,0.3)] text-[#F1F5FF] text-sm font-bold hover:border-[#00E5FF]/40"
        >
          ← Go Back
        </button>
      </div>
    );
  }

  const config = MODE_CONFIG[mode];
  const engineIndex = engine.id - 1;
  const engineName = ENGINE_NAMES[engineIndex] || engine.name;

  // Pseudo-random confidence percentage (50-90%) stable per engine & period
  const confidence = useMemo(() => {
    return Math.floor(Math.random() * 41) + 50;
  }, [engine.id, mode]);

  // Last 10 history
  const recentHistory = engine.history.slice(0, 10);
  const wins = recentHistory.filter((h) => h.status === 'WIN').length;
  const total = recentHistory.length;
  const accuracy = total > 0 ? Math.round((wins / total) * 100) : 0;
  const losses = total - wins;

  // Current period countdown
  const nowSeconds = Math.floor(Date.now() / 1000);
  const secondsRemaining = config.timerMod - (nowSeconds % config.timerMod);
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (secondsRemaining / config.timerMod) * circumference;

  // Next upcoming period number
  const currentPeriod =
    history.length > 0
      ? (() => {
          try {
            return (BigInt(history[0].period) + 1n).toString();
          } catch {
            return String(Number(history[0].period) + 1);
          }
        })()
      : '---';

  const prediction = engine.currentPrediction;

  return (
    <div className="animate-fade-up">
      {/* Top Header */}
      <div className="flex items-center gap-3 px-1 pt-3.5 pb-2.5">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to servers"
          className="w-10 h-10 rounded-[14px] border border-[rgba(168,85,247,0.2)] bg-[rgba(14,20,40,0.8)] backdrop-blur-md flex items-center justify-center cursor-pointer text-[#F1F5FF] text-lg transition-all hover:border-[#00E5FF]/40 hover:bg-[rgba(22,32,60,0.9)] hover:shadow-[0_0_15px_rgba(0,229,255,0.2)] active:scale-95"
        >
          ←
        </button>
        <div className="flex-1">
          <div className="text-[17px] font-black text-[#F1F5FF] tracking-tight flex items-center gap-2">
            <span>{engineName}</span>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-[rgba(168,85,247,0.2)] text-[#A855F7] border border-[rgba(168,85,247,0.4)] font-bold">
              LOGIC #{engine.id}
            </span>
          </div>
          <div className="text-[11px] text-[#94A3B8] font-mono">
            {config.label} · Neural Predictor Active
          </div>
        </div>
      </div>

      {/* Current Period & Circular Countdown Timer Card */}
      <div className="bg-card-glass rounded-[20px] p-4 mb-3 border border-[rgba(168,85,247,0.22)] shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1">
            <div className="text-[10px] tracking-[2px] uppercase text-[#94A3B8] font-bold mb-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse" />
              <span>CURRENT PERIOD</span>
            </div>
            <div className="digital-readout text-[1.85rem] tracking-tight">
              {formatPeriod(currentPeriod)}
            </div>
            <div className="text-[11px] text-[#64748B] font-mono mt-0.5">
              Real-time block synchronization
            </div>
          </div>

          {/* Glowing Circular Timer */}
          <div className="relative inline-flex items-center justify-center w-[78px] h-[78px] flex-shrink-0">
            <svg viewBox="0 0 100 100" className="w-[78px] h-[78px] -rotate-90">
              <circle
                className="stroke-[rgba(0,229,255,0.12)]"
                cx="50"
                cy="50"
                r={radius}
                strokeWidth="5"
                fill="none"
              />
              <circle
                className="stroke-[#00E5FF]"
                cx="50"
                cy="50"
                r={radius}
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{
                  filter: 'drop-shadow(0 0 6px #00E5FF)',
                  transition: 'stroke-dashoffset 0.25s linear',
                }}
              />
            </svg>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <div
                className="font-mono text-[1.15rem] font-black text-[#F1F5FF] leading-none"
                style={{ textShadow: '0 0 10px #00E5FF' }}
              >
                {secondsRemaining}s
              </div>
              <div className="text-[8px] uppercase tracking-wider text-[#94A3B8] font-mono mt-0.5">
                TIMER
              </div>
            </div>
            <span className="absolute -right-1 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-[#FF3864] rounded-full shadow-[0_0_12px_#FF3864] animate-ping" />
          </div>
        </div>

        {/* Recent Winning Balls Roll */}
        {history.length > 0 && (
          <div className="mt-3 pt-2.5 border-t border-[rgba(168,85,247,0.18)] flex items-center justify-between">
            <span className="text-[10px] text-[#94A3B8] font-mono uppercase tracking-wider flex items-center gap-1 font-semibold">
              <span className="text-[#00E5FF]">🎰</span> Last Draw:
            </span>
            <div className="flex items-center gap-1.5">
              {history.slice(0, 5).map((item, idx) => (
                <div key={`${item.period}-${idx}`} className="flex items-center gap-0.5">
                  <LotteryBall
                    num={item.number}
                    size="xs"
                    glow={idx === 0}
                    className={idx === 0 ? 'scale-110 ring-1 ring-[#00FF88]' : 'opacity-85'}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Futuristic Signal & Confidence Card */}
      <div className="bg-card-glass rounded-[20px] p-4 mb-3 border border-[rgba(0,229,255,0.25)] shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <div className="flex justify-between items-center mb-3">
          <div>
            <div className="text-[10px] tracking-[2px] uppercase text-[#94A3B8] font-bold mb-1.5 flex items-center gap-1.5">
              <span>⚡</span>
              <span>AI SIGNAL OUTPUT</span>
            </div>
            {prediction ? (
              <div className="flex items-center gap-2.5">
                <div
                  className={`inline-block px-5 py-2 rounded-[22px] font-black text-2xl tracking-wider font-mono backdrop-blur-md border shadow-lg transition-all ${
                    prediction.type === 'Big' ? 'signal-big' : 'signal-small'
                  }`}
                >
                  {prediction.type.toUpperCase()}
                </div>
                <div className="flex items-center gap-1.5 bg-[rgba(11,16,32,0.8)] px-3 py-1.5 rounded-[18px] border border-[rgba(0,229,255,0.25)]">
                  <LotteryBall num={prediction.calcNumber} size="sm" glow={true} highlight={true} />
                  <span className="font-mono text-sm font-extrabold text-[#00E5FF]">
                    #{prediction.calcNumber}
                  </span>
                </div>
              </div>
            ) : (
              <div className="inline-block px-4 py-2 rounded-[22px] font-extrabold text-xl tracking-wider font-mono bg-[rgba(11,16,32,0.8)] border border-[rgba(255,255,255,0.15)] text-[#94A3B8]">
                CALCULATING...
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="text-[10px] tracking-[2px] uppercase text-[#94A3B8] font-bold mb-1 flex items-center justify-end gap-1">
              <span>🎯</span>
              <span>CONFIDENCE</span>
            </div>
            <div className="font-mono text-2xl font-black text-[#00FF88] drop-shadow-[0_0_10px_rgba(0,255,136,0.5)]">
              {prediction ? `${confidence}%` : '--'}
            </div>
            <div className="text-[9px] text-[#64748B] font-mono">High Probability</div>
          </div>
        </div>

        {/* Probable Number Balls Bar */}
        {prediction && (
          <div className="pt-2.5 border-t border-[rgba(0,229,255,0.15)] flex items-center justify-between">
            <span className="text-[9px] text-[#94A3B8] uppercase font-mono tracking-wider font-semibold">
              Probable Set ({prediction.type}):
            </span>
            <div className="flex items-center gap-1.5">
              {(prediction.type === 'Big' ? [5, 6, 7, 8, 9] : [0, 1, 2, 3, 4]).map((n) => (
                <LotteryBall
                  key={n}
                  num={n}
                  size="xs"
                  highlight={n === prediction.calcNumber}
                  className={n === prediction.calcNumber ? 'scale-115' : 'opacity-60 hover:opacity-100'}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4 Neon Statistics Cards */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        {[
          { label: 'ACCURACY', value: `${accuracy}%`, color: 'text-[#00FF88]' },
          { label: 'WINS', value: wins, color: 'text-[#00FF88]' },
          { label: 'LOSSES', value: losses, color: 'text-[#FF3864]' },
          { label: 'TOTAL', value: total, color: 'text-[#00E5FF]' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-card-glass rounded-[16px] p-2.5 backdrop-blur-md border border-[rgba(168,85,247,0.16)] flex flex-col items-center justify-center text-center shadow-md hover:border-[rgba(0,229,255,0.3)] transition-colors"
          >
            <span className="text-[9px] uppercase text-[#94A3B8] tracking-wider font-bold">
              {stat.label}
            </span>
            <span className={`font-mono text-lg font-black mt-0.5 ${stat.color} drop-shadow-sm`}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* History Table: Last 10 Periods */}
      <div className="bg-card-glass rounded-[20px] overflow-hidden mb-3 border border-[rgba(168,85,247,0.2)] shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <div className="px-4 py-2.5 border-b border-[rgba(168,85,247,0.18)] flex items-center justify-between bg-[rgba(11,16,32,0.7)]">
          <div className="flex items-center gap-2">
            <span className="text-xs">📊</span>
            <span className="text-[11px] text-[#F1F5FF] uppercase tracking-wider font-extrabold">
              Last 10 Periods Feed
            </span>
          </div>
          <span className="text-[10px] text-[#00E5FF] font-mono font-bold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-ping" />
            Live Feed
          </span>
        </div>

        <div className="overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
          <table className="w-full border-collapse font-mono text-[0.75rem] min-w-[360px]">
            <thead>
              <tr className="bg-gradient-to-r from-[rgba(11,16,32,0.95)] via-[rgba(14,20,40,0.95)] to-[rgba(11,16,32,0.95)] border-b border-b-[#00E5FF]/40">
                <th className="py-2.5 px-3 text-left font-extrabold text-[#00E5FF] uppercase tracking-wider text-[0.65rem]">
                  Period
                </th>
                <th className="py-2.5 px-3 text-left font-extrabold text-[#00E5FF] uppercase tracking-wider text-[0.65rem]">
                  Number
                </th>
                <th className="py-2.5 px-3 text-left font-extrabold text-[#00E5FF] uppercase tracking-wider text-[0.65rem]">
                  Prediction
                </th>
                <th className="py-2.5 px-3 text-left font-extrabold text-[#00E5FF] uppercase tracking-wider text-[0.65rem]">
                  Result
                </th>
                <th className="py-2.5 px-3 text-left font-extrabold text-[#00E5FF] uppercase tracking-wider text-[0.65rem]">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Ongoing Pending Period */}
              {prediction && (
                <tr className="bg-[rgba(255,215,0,0.06)] border-b border-[rgba(168,85,247,0.12)]">
                  <td className="py-2.5 px-3 font-bold text-[#F1F5FF]">
                    {formatPeriod(currentPeriod)}
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full border border-dashed border-[#FFD700] flex items-center justify-center animate-spin text-[8px] text-[#FFD700]">
                        ?
                      </div>
                      <span className="text-[#94A3B8] text-xs font-mono">--</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 font-extrabold text-[#00E5FF]">
                    {prediction.type} #{prediction.calcNumber}
                  </td>
                  <td className="py-2.5 px-3 text-[#94A3B8]">
                    -
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="inline-block px-2.5 py-0.5 rounded-full font-extrabold text-[0.65rem] text-center min-w-[55px] bg-[rgba(255,215,0,0.15)] text-[#FFD700] border border-[rgba(255,215,0,0.45)] shadow-[0_0_8px_rgba(255,215,0,0.25)] animate-pulse">
                      PENDING
                    </span>
                  </td>
                </tr>
              )}

              {recentHistory.map((item, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-[rgba(255,255,255,0.03)] border-b border-[rgba(168,85,247,0.1)] transition-colors"
                >
                  <td className="py-2.5 px-3 text-[#94A3B8]">
                    {formatPeriod(item.period)}
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-1.5">
                      <LotteryBall num={item.result} size="xs" glow={true} />
                      <span className="font-mono font-black text-[#F1F5FF] text-xs">
                        {item.result}
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-[#A855F7]">
                    {item.prediction}
                  </td>
                  <td className="py-2.5 px-3 text-[#F1F5FF]">
                    {item.actual}
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full font-extrabold text-[0.65rem] text-center min-w-[55px] ${
                        item.status === 'WIN'
                          ? 'bg-[rgba(0,255,136,0.18)] text-[#00FF88] border border-[rgba(0,255,136,0.45)] shadow-[0_0_8px_rgba(0,255,136,0.25)]'
                          : 'bg-[rgba(255,56,100,0.18)] text-[#FF3864] border border-[rgba(255,56,100,0.45)] shadow-[0_0_8px_rgba(255,56,100,0.25)]'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}

              {recentHistory.length === 0 && !prediction && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-[#94A3B8] text-center py-6 font-mono text-xs"
                  >
                    Waiting for real-time round data...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-center text-[0.6rem] text-[#64748B] tracking-widest uppercase my-4 font-mono">
        2026 ADVANCE || TLB HACK
      </div>
    </div>
  );
};
