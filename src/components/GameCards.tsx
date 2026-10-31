import React, { useState } from 'react';
import { Mode } from '../types';
import { APP_ICONS } from '../lib/constants';

interface GameCardsProps {
  wingoExpanded: boolean;
  setWingoExpanded: (expanded: boolean) => void;
  onSelectMode: (mode: Mode) => void;
  onExploreVIP?: () => void;
}

const WINGO_SUBMODES: Array<{
  mode: Mode;
  icon: string;
  name: string;
  desc: string;
  badge: string;
  neonColor: string;
}> = [
  {
    mode: '30s',
    icon: '⚡',
    name: 'Wingo 30 Second',
    desc: 'Ultra high-frequency AI',
    badge: '30S',
    neonColor: 'from-[#00E5FF]/20 to-[#2563EB]/10 border-[#00E5FF]/30 text-[#00E5FF]',
  },
  {
    mode: '1m',
    icon: '⏱️',
    name: 'Wingo 1 Minute',
    desc: 'Standard pattern cycle',
    badge: '1M',
    neonColor: 'from-[#2563EB]/20 to-[#A855F7]/10 border-[#2563EB]/30 text-[#60A5FA]',
  },
  {
    mode: '3m',
    icon: '⏳',
    name: 'Wingo 3 Minute',
    desc: 'Balanced neural signal',
    badge: '3M',
    neonColor: 'from-[#A855F7]/20 to-[#E000FF]/10 border-[#A855F7]/30 text-[#C084FC]',
  },
  {
    mode: '5m',
    icon: '🕐',
    name: 'Wingo 5 Minute',
    desc: 'Deep trend accuracy',
    badge: '5M',
    neonColor: 'from-[#FFD700]/20 to-[#FF6B00]/10 border-[#FFD700]/30 text-[#FFD700]',
  },
];

export const GameCards: React.FC<GameCardsProps> = ({
  wingoExpanded,
  setWingoExpanded,
  onSelectMode,
  onExploreVIP,
}) => {
  const [activatingMode, setActivatingMode] = useState<Mode | null>(null);

  const handleSelectSubmode = (mode: Mode) => {
    setActivatingMode(mode);
    setTimeout(() => {
      onSelectMode(mode);
      setActivatingMode(null);
    }, 240);
  };

  return (
    <>
      {/* Wingo Main Card with Neon Glassmorphism */}
      <div
        className={`bg-card-glass rounded-2xl p-4 mb-3.5 transition-all duration-300 border ${
          wingoExpanded
            ? 'border-[#00FF88]/40 shadow-[0_8px_30px_rgba(0,255,136,0.18)]'
            : 'border-[rgba(0,229,255,0.18)] hover:border-[#00E5FF]/40 hover:shadow-[0_8px_30px_rgba(0,229,255,0.12)]'
        } relative overflow-hidden`}
      >
        <div
          className="flex items-center gap-3.5 cursor-pointer select-none"
          onClick={() => setWingoExpanded(!wingoExpanded)}
        >
          <div className="w-[58px] h-[58px] rounded-2xl bg-gradient-to-br from-[rgba(0,255,136,0.15)] to-[rgba(0,229,255,0.1)] border border-[rgba(0,255,136,0.3)] flex items-center justify-center flex-shrink-0 relative overflow-hidden shadow-[0_0_15px_rgba(0,255,136,0.2)]">
            <img
              src={APP_ICONS.wingo}
              alt="Wingo"
              className="w-12 h-12 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (!target.src.includes('wingo-icon.png')) {
                  target.src = '/images/wingo-icon.png';
                }
              }}
            />
            {wingoExpanded ? (
              <span className="absolute -bottom-0.5 -right-0.5 w-[18px] h-[18px] rounded-full bg-[#00FF88] flex items-center justify-center border-2 border-[#050510] shadow-[0_0_10px_#00FF88] animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-[#050510]" />
              </span>
            ) : (
              <span className="absolute -bottom-0.5 -right-0.5 w-[18px] h-[18px] rounded-full bg-[#64748B] flex items-center justify-center border-2 border-[#050510]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#050510]" />
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-[16px] font-extrabold flex items-center gap-2 text-[#F1F5FF] tracking-tight">
              Wingo Neural Hub
              {wingoExpanded ? (
                <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-[rgba(0,255,136,0.18)] text-[#00FF88] border border-[rgba(0,255,136,0.4)] shadow-[0_0_10px_rgba(0,255,136,0.3)] tracking-wider uppercase flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88] animate-pulse-dot" />
                  Active
                </span>
              ) : (
                <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-[rgba(255,215,0,0.12)] text-[#FFD700] border border-[rgba(255,215,0,0.3)] tracking-wider uppercase flex items-center gap-1.5 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFD700]" />
                  Standby
                </span>
              )}
            </div>
            <div className="text-xs text-[#94A3B8] mt-0.5">
              Dual-Signal Color & Size Prediction · Multi-Cycle
            </div>
            <div className="mt-1.5 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#00E5FF]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] shadow-[0_0_8px_#00E5FF] animate-pulse-dot" />
                <span>AI NEURAL ENGINE</span>
              </div>
              <div className="text-[11px] flex items-center gap-1.5 font-semibold text-[#00FF88]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88] animate-pulse-dot" />
                {wingoExpanded ? 'Feeds Connected' : 'Ready'}
              </div>
            </div>
          </div>

          <div
            className="text-[#00E5FF] text-xl transition-transform duration-300 px-1 drop-shadow-[0_0_6px_rgba(0,229,255,0.4)] ml-auto"
            style={{ transform: wingoExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            ▾
          </div>
        </div>

        {/* Wingo 4 Submodes Accordion */}
        {wingoExpanded && (
          <div className="grid grid-cols-2 gap-2.5 mt-4 pt-3.5 border-t border-[rgba(168,85,247,0.15)] animate-fade-up">
            {WINGO_SUBMODES.map((sub) => {
              const isActivating = activatingMode === sub.mode;
              return (
                <div
                  key={sub.mode}
                  className={`bg-gradient-to-br ${sub.neonColor} rounded-xl p-3 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(0,229,255,0.25)] active:scale-[0.97] border ${
                    isActivating
                      ? 'border-[#00FF88] shadow-[0_0_25px_rgba(0,255,136,0.5)] scale-[1.02]'
                      : ''
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectSubmode(sub.mode);
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-[rgba(15,22,45,0.85)] flex items-center justify-center text-base border border-[rgba(255,255,255,0.1)] shadow-inner">
                      {sub.icon}
                    </div>
                    <span className="font-mono text-[10px] font-black px-2 py-0.5 rounded-md bg-[rgba(15,22,45,0.85)] border border-[rgba(255,255,255,0.15)]">
                      {sub.badge}
                    </span>
                  </div>
                  <div className="text-[13px] font-extrabold text-[#F1F5FF] tracking-tight">
                    {sub.name}
                  </div>
                  <div className="text-[10px] text-[#94A3B8] mt-0.5">
                    {sub.desc}
                  </div>
                  <div className="text-[10px] mt-2 flex items-center justify-between">
                    {isActivating ? (
                      <span className="flex items-center gap-1.5 text-[#00E5FF] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-ping" />
                        CONNECTING...
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-[#00FF88] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88] animate-pulse-dot" />
                        ONLINE
                      </span>
                    )}
                    <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-[rgba(255,255,255,0.06)] text-[#94A3B8] border border-[rgba(255,255,255,0.1)]">
                      START ›
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* K3 Card */}
      <div className="bg-card-glass rounded-2xl p-4 mb-3.5 flex items-center gap-3.5 border border-[rgba(255,215,0,0.16)] transition-all duration-300 hover:border-[#FFD700]/35 hover:shadow-[0_4px_24px_rgba(255,215,0,0.12)]">
        <div className="w-[58px] h-[58px] rounded-2xl bg-[rgba(255,215,0,0.08)] border border-[rgba(255,215,0,0.22)] flex items-center justify-center flex-shrink-0 overflow-hidden shadow-[0_0_15px_rgba(255,215,0,0.15)]">
          <img
            src={APP_ICONS.k3}
            alt="K3"
            className="w-12 h-12 object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (!target.src.includes('k3-icon.png')) {
                target.src = '/images/k3-icon.png';
              }
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[16px] font-extrabold flex items-center gap-2 text-[#F1F5FF]">
            K3 Dice AI
          </div>
          <div className="text-xs text-[#94A3B8] mt-0.5">Triple Dice Probability Model</div>
          <div className="text-[11px] mt-1 font-bold animate-text-glow text-[#FFD700] tracking-wider">
            🔒 COMING SOON
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-[9px] text-[#64748B] uppercase tracking-wider font-mono">Status</div>
          <div className="text-[12px] font-bold text-[#FFD700] font-mono px-2 py-0.5 rounded bg-[rgba(255,215,0,0.1)] border border-[rgba(255,215,0,0.2)]">
            v2.0 DEV
          </div>
        </div>
      </div>

      {/* TRX Wingo Card */}
      <div className="bg-card-glass rounded-2xl p-4 mb-3.5 flex items-center gap-3.5 border border-[rgba(168,85,247,0.16)] transition-all duration-300 hover:border-[#A855F7]/35 hover:shadow-[0_4px_24px_rgba(168,85,247,0.15)]">
        <div className="w-[58px] h-[58px] rounded-2xl bg-[rgba(168,85,247,0.08)] border border-[rgba(168,85,247,0.22)] flex items-center justify-center flex-shrink-0 overflow-hidden shadow-[0_0_15px_rgba(168,85,247,0.15)]">
          <img
            src={APP_ICONS.trx}
            alt="TRX Wingo"
            className="w-12 h-12 object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (!target.src.includes('trx-wingo-icon.png')) {
                target.src = '/images/trx-wingo-icon.png';
              }
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[16px] font-extrabold flex items-center gap-2 text-[#F1F5FF]">
            TRX Hash Terminal
          </div>
          <div className="text-xs text-[#94A3B8] mt-0.5">Blockchain Block Hash Decoder</div>
          <div className="text-[11px] mt-1 font-bold animate-text-glow text-[#FFD700] tracking-wider">
            🔒 COMING SOON
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-[9px] text-[#64748B] uppercase tracking-wider font-mono">Status</div>
          <div className="text-[12px] font-bold text-[#A855F7] font-mono px-2 py-0.5 rounded bg-[rgba(168,85,247,0.1)] border border-[rgba(168,85,247,0.2)]">
            SMART DEV
          </div>
        </div>
      </div>

      {/* Pro Traders VIP Card with Golden Cyberpunk Glow */}
      <div className="bg-card-glass rounded-2xl p-4 mb-4 border border-[rgba(255,215,0,0.3)] relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_20px_rgba(255,215,0,0.12)] animate-vip-breathe">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,215,0,0.12),transparent_65%)] pointer-events-none" />
        
        <div className="relative">
          <div className="flex items-center gap-3.5 mb-3">
            <div className="w-14 h-14 rounded-2xl gradient-gold flex items-center justify-center text-[28px] relative shadow-[0_0_25px_rgba(255,215,0,0.45)]">
              <span className="animate-float">👑</span>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#FFD700] flex items-center justify-center text-[10px] text-black font-black border-2 border-[#050510] shadow-[0_0_8px_#FFD700]">
                ★
              </span>
            </div>

            <div className="flex-1">
              <div className="text-[16px] font-black flex items-center gap-2 text-[#F1F5FF] tracking-tight">
                Pro Traders Syndicate
                <span className="text-[9px] bg-gradient-to-r from-[#FFD700] to-[#E000FF] text-black px-2 py-0.5 rounded-full font-black uppercase tracking-wider shadow-[0_0_10px_rgba(255,215,0,0.5)]">
                  VIP 17
                </span>
              </div>
              <div className="text-xs text-[#94A3B8]">
                17 Multi-Engine AI Algorithms & Markov Chains
              </div>
              <div className="text-[11px] text-[#00FF88] flex items-center gap-1.5 mt-0.5 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88] animate-pulse-dot" />
                Ultra-Precision Signal Feed
              </div>
            </div>

            <div className="text-2xl text-[#FFD700] ml-auto animate-glow-pulse">
              ⚡
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[rgba(255,255,255,0.08)]">
            <div className="flex items-center gap-1.5">
              {['🐯', '🐉', '⭐', '🔥', '🐎'].map((icon, idx) => (
                <span
                  key={idx}
                  className="w-7 h-7 rounded-xl flex items-center justify-center text-xs border border-[rgba(255,215,0,0.25)] bg-[rgba(255,215,0,0.08)] shadow-[0_0_8px_rgba(255,215,0,0.1)] transition-transform hover:scale-110"
                >
                  {icon}
                </span>
              ))}
              <span className="text-xs text-[#94A3B8] font-mono ml-1 font-semibold">
                +12 more
              </span>
            </div>

            <button
              type="button"
              onClick={onExploreVIP}
              className="font-mono text-[11px] text-[#FFD700] bg-gradient-to-r from-[rgba(255,215,0,0.18)] to-[rgba(224,0,255,0.18)] border border-[rgba(255,215,0,0.4)] px-4 py-2 rounded-full flex items-center gap-1.5 font-black cursor-pointer hover:bg-[rgba(255,215,0,0.28)] transition-all shadow-[0_0_15px_rgba(255,215,0,0.2)] active:scale-95"
            >
              EXPLORE ›
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
