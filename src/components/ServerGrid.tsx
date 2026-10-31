import React from 'react';
import { Engine, Mode } from '../types';
import {
  ENGINE_GRADIENTS,
  ENGINE_ICONS,
  ENGINE_NAMES,
  MODE_CONFIG,
} from '../lib/constants';

interface ServerGridProps {
  mode: Mode;
  engines: Engine[];
  time: string;
  onBack: () => void;
  onSelectEngine: (id: number) => void;
}

const getRankBadgeClass = (rank: number): string => {
  if (rank === 0)
    return 'bg-gradient-to-r from-[rgba(255,215,0,0.22)] to-[rgba(255,107,0,0.18)] text-[#FFD700] border border-[rgba(255,215,0,0.45)] shadow-[0_0_10px_rgba(255,215,0,0.3)] animate-pulse';
  if (rank === 1)
    return 'bg-gradient-to-r from-[rgba(0,229,255,0.2)] to-[rgba(37,99,235,0.18)] text-[#00E5FF] border border-[rgba(0,229,255,0.4)] shadow-[0_0_8px_rgba(0,229,255,0.25)]';
  if (rank === 2)
    return 'bg-gradient-to-r from-[rgba(205,127,50,0.2)] to-[rgba(168,85,247,0.18)] text-[#FF9E4A] border border-[rgba(205,127,50,0.4)] shadow-[0_0_8px_rgba(205,127,50,0.2)]';
  return '';
};

const getRankLabel = (rank: number): string => {
  if (rank === 0) return '🏆 TOP 1ST';
  if (rank === 1) return '🥈 2ND';
  if (rank === 2) return '🥉 3RD';
  return '';
};

export const ServerGrid: React.FC<ServerGridProps> = ({
  mode,
  engines,
  time,
  onBack,
  onSelectEngine,
}) => {
  const config = MODE_CONFIG[mode];

  // Rank engines by last 10 win rate, then last 10 wins
  const rankedEngines = [...engines]
    .map((engine, originalIndex) => {
      const recent = (engine.history || []).slice(0, 10);
      const wins = recent.filter((h) => h.status === 'WIN').length;
      const total = recent.length;
      const rate = total > 0 ? wins / total : 0;
      return {
        ...engine,
        originalIndex,
        last10Rate: rate,
        last10Wins: wins,
        last10Total: total,
      };
    })
    .sort(
      (a, b) =>
        (b.last10Rate || 0) - (a.last10Rate || 0) ||
        (b.last10Wins || 0) - (a.last10Wins || 0)
    );

  const totalWins = engines.reduce((acc, e) => acc + e.wins, 0);
  const totalGames = engines.reduce((acc, e) => acc + e.wins + e.losses, 0);
  const overallWinRate =
    totalGames > 0 ? Math.round((totalWins / totalGames) * 100) : 0;

  return (
    <div className="animate-fade-up">
      {/* Top Bar with back button, Mode title & Overall Win Rate */}
      <div className="flex items-center gap-3 px-1 pt-3.5 pb-2.5">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to home"
          className="w-10 h-10 rounded-[14px] border border-[rgba(168,85,247,0.2)] bg-[rgba(14,20,40,0.8)] backdrop-blur-md flex items-center justify-center cursor-pointer text-[#F1F5FF] text-lg transition-all hover:border-[#00E5FF]/40 hover:bg-[rgba(22,32,60,0.9)] hover:shadow-[0_0_15px_rgba(0,229,255,0.2)] active:scale-95"
        >
          ←
        </button>
        <div className="flex-1">
          <div className="text-[18px] font-black text-[#F1F5FF] tracking-tight flex items-center gap-2">
            <span>{config.label}</span>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-[rgba(0,229,255,0.12)] text-[#00E5FF] border border-[rgba(0,229,255,0.3)] font-bold">
              AI ENGINE
            </span>
          </div>
          <div className="font-mono text-xs text-[#94A3B8]">{time}</div>
        </div>
        <div className="text-right bg-[rgba(14,20,40,0.6)] px-3 py-1.5 rounded-[12px] border border-[rgba(0,255,136,0.25)] shadow-[0_0_12px_rgba(0,255,136,0.1)]">
          <div className="text-[9px] text-[#94A3B8] uppercase tracking-wider font-semibold">
            Win Rate
          </div>
          <div className="text-base font-black font-mono text-[#00FF88] drop-shadow-[0_0_6px_rgba(0,255,136,0.4)]">
            {overallWinRate}%
          </div>
        </div>
      </div>

      {/* Connection Indicator Bar */}
      <div className="flex items-center justify-between px-2 py-2 mb-3 bg-[rgba(11,16,32,0.6)] rounded-[14px] border border-[rgba(168,85,247,0.14)]">
        <div className="flex items-center gap-2 text-[11px] font-bold">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF88] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00FF88] shadow-[0_0_10px_#00FF88]" />
          </span>
          <span className="text-[#00E5FF] tracking-wider font-mono">CONNECTED</span>
          <span className="text-[10px] text-[#94A3B8] font-mono">· Low Latency</span>
        </div>
        <div className="text-[11px] text-[#94A3B8] font-mono font-medium">
          <span className="text-[#F1F5FF] font-bold">{engines.length}</span> Active Servers
        </div>
      </div>

      {/* 2-Column Responsive Grid of 17 AI Logic Engines */}
      <div className="grid grid-cols-2 gap-2.5 pb-6">
        {rankedEngines.map((engine, rankIndex) => {
          const winRatePercent =
            (engine.last10Total || 0) > 0
              ? Math.round((engine.last10Rate || 0) * 100)
              : 0;
          const origIdx = engine.originalIndex ?? engine.id - 1;
          const isTop3 = rankIndex < 3;

          return (
            <div
              key={engine.id}
              className={`bg-card-glass rounded-[18px] p-3 cursor-pointer transition-all hover:border-[#00E5FF]/45 hover:bg-card-hover-state hover:shadow-[0_0_20px_rgba(0,229,255,0.2)] flex flex-col justify-between select-none active:scale-[0.98] relative overflow-hidden group ${
                isTop3
                  ? 'border-[rgba(255,215,0,0.25)]'
                  : 'border-[rgba(168,85,247,0.16)]'
              }`}
              onClick={() => onSelectEngine(engine.id)}
            >
              {/* Subtle neon gradient corner glow */}
              <div
                className={`absolute -top-10 -right-10 w-20 h-20 rounded-full blur-2xl opacity-20 pointer-events-none ${
                  ENGINE_GRADIENTS[origIdx % ENGINE_GRADIENTS.length]
                }`}
              />

              {/* Card Header: Icon + Rank Badge */}
              <div className="flex items-start justify-between gap-1.5 mb-2 relative z-[1]">
                <div
                  className={`w-9 h-9 rounded-[12px] flex items-center justify-center text-lg flex-shrink-0 shadow-md ${
                    ENGINE_GRADIENTS[origIdx % ENGINE_GRADIENTS.length]
                  }`}
                >
                  {ENGINE_ICONS[origIdx]}
                </div>

                {isTop3 ? (
                  <span
                    className={`text-[8px] px-1.5 py-0.5 rounded-md font-extrabold whitespace-nowrap ${getRankBadgeClass(
                      rankIndex
                    )}`}
                  >
                    {getRankLabel(rankIndex)}
                  </span>
                ) : (
                  <span className="text-[9px] font-mono font-bold text-[#64748B] bg-[rgba(255,255,255,0.04)] px-1.5 py-0.5 rounded">
                    #{engine.id}
                  </span>
                )}
              </div>

              {/* Card Body: Name + Info */}
              <div className="relative z-[1] min-w-0">
                <div className="text-[13px] font-extrabold text-[#F1F5FF] truncate tracking-tight group-hover:text-[#00E5FF] transition-colors">
                  {ENGINE_NAMES[origIdx]}
                </div>
                <div className="text-[10px] text-[#94A3B8] font-mono mt-0.5 flex items-center justify-between">
                  <span className="text-[#64748B] text-[9px]">SRV {engine.id}</span>
                  <span className="text-[#00FF88] font-bold">
                    {winRatePercent}% WIN
                  </span>
                </div>
              </div>

              {/* Card Footer: Micro bar indicator */}
              <div className="mt-2 pt-2 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-[9px] text-[#94A3B8] font-mono">
                <span className="text-[#00E5FF] flex items-center gap-1 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]" />
                  Online
                </span>
                <span className="text-[#64748B] group-hover:text-[#00E5FF] transition-colors group-hover:translate-x-0.5 transform duration-150">
                  Select ›
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
