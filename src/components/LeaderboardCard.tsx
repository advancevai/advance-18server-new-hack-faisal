import React from 'react';
import { Engine, Mode } from '../types';
import {
  BADGE_STYLES,
  ENGINE_ICONS,
  ENGINE_NAMES,
  RANK_MEDALS,
} from '../lib/constants';

interface LeaderboardCardProps {
  mode: Mode;
  label: string;
  badge: string;
  topEngines: Engine[];
  hotStreakEngine: Engine | null;
  onClick: () => void;
}

export const LeaderboardCard: React.FC<LeaderboardCardProps> = ({
  label,
  badge,
  topEngines,
  hotStreakEngine,
  onClick,
}) => {
  const topEngine = topEngines.length > 0 ? topEngines[0] : null;

  return (
    <div
      className="bg-card-glass rounded-[18px] p-4 mb-3.5 cursor-pointer transition-all hover:bg-card-hover-state hover:border-glow select-none active:scale-[0.99] group shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
      onClick={onClick}
    >
      {/* Header with Mode & Badge */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <span className="text-xl drop-shadow-[0_0_8px_rgba(255,215,0,0.6)]">🏆</span>
          <span className="text-sm font-extrabold text-[#F1F5FF] tracking-wide">
            {label}
          </span>
        </div>
        <span
          className={`font-mono text-[11px] px-2.5 py-1 rounded-lg font-extrabold border shadow-sm ${
            BADGE_STYLES[badge] || BADGE_STYLES['30S']
          }`}
        >
          {badge}
        </span>
      </div>

      {/* Top 3 Server Rankings */}
      <div className="space-y-2">
        {topEngines.slice(0, 3).map((engine, rankIndex) => {
          const recent = (engine.history || []).slice(0, 10);
          const wins = recent.filter((h) => h.status === 'WIN').length;
          const total = recent.length;
          const losses = total - wins;
          const winRatePercent =
            total > 0 ? Math.round((wins / total) * 100) : 0;
          const isTop1 = topEngine && engine.id === topEngine.id;

          return (
            <div
              key={engine.id}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-[14px] transition-all duration-200 ${
                isTop1
                  ? 'bg-gradient-to-r from-[rgba(255,215,0,0.12)] to-[rgba(168,85,247,0.08)] border border-[rgba(255,215,0,0.35)] shadow-[0_0_15px_rgba(255,215,0,0.08)]'
                  : 'bg-[rgba(11,16,32,0.65)] border border-[rgba(168,85,247,0.12)] hover:border-[rgba(0,229,255,0.25)]'
              }`}
            >
              {/* Rank Medal */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-extrabold flex-shrink-0 ${
                  rankIndex === 0
                    ? 'bg-gradient-to-br from-[rgba(255,215,0,0.25)] to-[rgba(255,107,0,0.2)] border border-[rgba(255,215,0,0.45)] shadow-[0_0_12px_rgba(255,215,0,0.3)]'
                    : rankIndex === 1
                    ? 'bg-[rgba(0,229,255,0.12)] border border-[rgba(0,229,255,0.3)] shadow-[0_0_8px_rgba(0,229,255,0.18)]'
                    : 'bg-[rgba(205,127,50,0.12)] border border-[rgba(205,127,50,0.3)]'
                }`}
              >
                {RANK_MEDALS[rankIndex]}
              </div>

              {/* Server Icon */}
              <span className="text-base flex-shrink-0">
                {ENGINE_ICONS[engine.id - 1]}
              </span>

              {/* Server Name & Record */}
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-extrabold text-[#F1F5FF] truncate flex items-center gap-1.5">
                  <span className="truncate">{ENGINE_NAMES[engine.id - 1]}</span>
                  {isTop1 && (
                    <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded-full bg-[rgba(255,215,0,0.2)] text-[#FFD700] border border-[rgba(255,215,0,0.4)] shadow-[0_0_8px_rgba(255,215,0,0.3)] animate-pulse">
                      VIP
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-[#94A3B8] font-mono flex items-center gap-1.5 mt-0.5">
                  <span className="text-[#00FF88] font-bold">{wins}W</span>
                  <span className="text-[rgba(255,255,255,0.2)]">·</span>
                  <span className="text-[#FF3864] font-bold">{losses}L</span>
                  <span className="text-[rgba(255,255,255,0.2)]">·</span>
                  <span className="text-[#00E5FF] font-medium">
                    🔥 Max {engine.maxConsecutiveWins}
                  </span>
                </div>
              </div>

              {/* Win Rate */}
              <div className="text-right flex-shrink-0">
                <span className="font-mono text-[15px] font-black text-[#00FF88] drop-shadow-[0_0_8px_rgba(0,255,136,0.4)]">
                  {winRatePercent}%
                </span>
              </div>
            </div>
          );
        })}

        {/* Hot Streak Banner */}
        {hotStreakEngine && hotStreakEngine.consecutiveWins > 0 && (
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-[14px] bg-gradient-to-r from-[rgba(255,215,0,0.12)] via-[rgba(255,107,0,0.08)] to-[rgba(168,85,247,0.08)] border border-[rgba(255,215,0,0.3)] shadow-[0_0_15px_rgba(255,215,0,0.1)]">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm bg-[rgba(255,215,0,0.2)] border border-[rgba(255,215,0,0.4)] shadow-[0_0_10px_rgba(255,215,0,0.25)] animate-pulse">
              🔥
            </div>
            <span className="text-base flex-shrink-0">
              {ENGINE_ICONS[hotStreakEngine.id - 1]}
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-[9px] font-extrabold text-[#FFD700] uppercase tracking-wider flex items-center gap-1">
                <span>HOT STREAK</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFD700] animate-ping" />
              </div>
              <div className="text-[12px] font-extrabold text-[#F1F5FF] truncate">
                {ENGINE_NAMES[hotStreakEngine.id - 1]}
              </div>
            </div>
            <span className="font-mono text-[12px] font-black text-[#FFD700] bg-[rgba(255,215,0,0.16)] border border-[rgba(255,215,0,0.35)] px-2.5 py-1 rounded-lg shadow-[0_0_8px_rgba(255,215,0,0.2)]">
              {hotStreakEngine.consecutiveWins} Wins
            </span>
          </div>
        )}

        {topEngines.length === 0 && (
          <div className="text-center text-xs text-[#94A3B8] py-4 font-mono">
            Synchronizing neural predictions...
          </div>
        )}
      </div>
    </div>
  );
};
