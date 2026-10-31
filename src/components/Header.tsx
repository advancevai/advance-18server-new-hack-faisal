import React from 'react';
import { APP_CONFIG } from '../lib/constants';

interface HeaderProps {
  announcement?: string;
  showAnnouncement?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  announcement,
  showAnnouncement,
}) => {
  return (
    <>
      {showAnnouncement && announcement && (
        <div className="mb-3 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[rgba(255,215,0,0.14)] via-[rgba(224,0,255,0.12)] to-[rgba(0,229,255,0.1)] border border-[rgba(255,215,0,0.3)] flex items-center justify-between text-[11px] text-[#FFD700] font-medium shadow-[0_0_15px_rgba(255,215,0,0.15)] animate-fade-up">
          <div className="flex items-center gap-2 truncate">
            <span className="text-sm">📢</span>
            <span className="truncate tracking-wide">{announcement}</span>
          </div>
          <span className="text-[9px] font-mono font-extrabold px-2 py-0.5 rounded-full bg-[rgba(255,215,0,0.22)] border border-[rgba(255,215,0,0.4)] ml-2 flex-shrink-0 uppercase tracking-widest text-[#FFD700] shadow-[0_0_8px_rgba(255,215,0,0.3)]">
            VIP ALERT
          </span>
        </div>
      )}

      <header className="flex items-center justify-between px-1 pt-3 pb-3.5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center relative bg-[rgba(15,22,45,0.85)] border border-[rgba(0,229,255,0.35)] shadow-[0_0_16px_rgba(0,229,255,0.25)] overflow-hidden transition-all duration-300 hover:shadow-[0_0_24px_rgba(168,85,247,0.4)] hover:border-[rgba(168,85,247,0.5)]">
            <img
              src={APP_CONFIG.profileImage}
              alt={APP_CONFIG.name}
              className="w-full h-full object-cover rounded-2xl pointer-events-none"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (!target.src.includes('advance-profile.jpg')) {
                  target.src = '/images/advance-profile.jpg';
                }
              }}
            />
            {/* Pulsing neon status dot on avatar */}
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#00FF88] border-2 border-[#050510] shadow-[0_0_10px_#00FF88] animate-pulse-dot" />
          </div>

          <div>
            <div className="text-[19px] font-black tracking-tight text-[#F1F5FF] flex items-center gap-1.5 leading-tight">
              <span className="bg-gradient-to-r from-[#FFFFFF] via-[#A5F3FC] to-[#00E5FF] bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(0,229,255,0.4)]">
                {APP_CONFIG.name}
              </span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-[rgba(168,85,247,0.18)] text-[#A855F7] border border-[rgba(168,85,247,0.35)]">
                PRO
              </span>
            </div>
            <div className="text-[11px] text-[#94A3B8] font-mono tracking-widest uppercase flex items-center gap-1.5 mt-0.5">
              <span className="text-[#00E5FF]">◎</span> AI Signal Terminal
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* AI Powered Badge with futuristic neon aura */}
          <div className="font-mono text-[11px] text-[#00E5FF] border border-[rgba(0,229,255,0.35)] px-3 py-1.5 rounded-full bg-gradient-to-r from-[rgba(0,229,255,0.12)] to-[rgba(168,85,247,0.12)] flex items-center gap-2 whitespace-nowrap shadow-[0_0_14px_rgba(0,229,255,0.22)] backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E5FF] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00E5FF] shadow-[0_0_8px_#00E5FF]" />
            </span>
            <span className="font-bold tracking-wider">AI Powered</span>
          </div>
        </div>
      </header>
    </>
  );
};
