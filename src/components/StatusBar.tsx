import React from 'react';

interface StatusBarProps {
  isOnline: boolean;
  time: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({ isOnline, time }) => {
  return (
    <div className="flex items-center justify-between px-4 py-2.5 rounded-xl mb-4 bg-card-glass border border-[rgba(168,85,247,0.2)] shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
      <div className="flex items-center gap-2 text-xs font-bold tracking-wide">
        <span
          className={`w-2 h-2 rounded-full ${
            isOnline
              ? 'bg-[#00FF88] shadow-[0_0_10px_#00FF88] animate-heartbeat'
              : 'bg-[#FF3864] shadow-[0_0_10px_#FF3864] animate-pulse-dot'
          }`}
        />
        <span
          className={
            isOnline
              ? 'text-[#00FF88] drop-shadow-[0_0_8px_rgba(0,255,136,0.4)]'
              : 'text-[#FF3864] drop-shadow-[0_0_8px_rgba(255,56,100,0.4)]'
          }
        >
          {isOnline ? 'SYSTEM ONLINE' : 'DISCONNECTED'}
        </span>
        <span className="text-[10px] text-[#64748B] font-mono">|</span>
        <span className="text-[10px] text-[#00E5FF] font-mono tracking-wider">
          PING 18ms
        </span>
      </div>
      <div className="text-[11px] text-[#94A3B8] font-mono font-semibold tracking-wider flex items-center gap-1.5">
        <span className="text-[#A855F7]">⏱</span>
        <span>{time}</span>
      </div>
    </div>
  );
};

export const SectionDivider: React.FC<{ icon: string; title: string }> = ({
  icon,
  title,
}) => {
  return (
    <div className="flex items-center gap-2.5 my-4 px-1">
      <span className="text-xs font-extrabold tracking-[1.8px] uppercase text-[#94A3B8] flex items-center gap-1.5">
        <span className="text-sm drop-shadow-[0_0_6px_rgba(0,229,255,0.4)]">{icon}</span>
        <span className="bg-gradient-to-r from-[#F1F5FF] via-[#A5F3FC] to-[#94A3B8] bg-clip-text text-transparent">
          {title}
        </span>
      </span>
      <div className="flex-1 h-px bg-gradient-to-r from-[rgba(0,229,255,0.35)] via-[rgba(168,85,247,0.2)] to-transparent" />
    </div>
  );
};
