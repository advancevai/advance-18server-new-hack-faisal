import { Mode } from '../types';

export const ENGINE_NAMES = [
  'Tiger Pro',
  'Dragon King',
  'Phoenix VIP',
  'Eagle Eye',
  'Lion Heart',
  'Thunder Bolt',
  'Shadow X',
  'Cobra Strike',
  'Wolf Pack',
  'Blaze Pro',
  'Viper Gold',
  'Rocket Star',
  'Storm Chaser',
  'Ninja Master',
  'VIP Prediction',
  'Apex Titan',
  'Dark Horse',
];

export const ENGINE_ICONS = [
  '🐯',
  '🐉',
  '🔥',
  '🦅',
  '🦁',
  '⚡',
  '🌀',
  '🐍',
  '🐺',
  '💥',
  '🐍',
  '🚀',
  '🌪️',
  '🥷',
  '👑',
  '⛰️',
  '🐎',
];

export const ENGINE_GRADIENTS = [
  'gradient-cyan-blue',
  'gradient-red',
  'gradient-gold',
  'gradient-electric',
  'gradient-gold',
  'gradient-cyan-blue',
  'gradient-purple',
  'gradient-teal',
  'gradient-cyan-blue',
  'gradient-magenta',
  'gradient-gold',
  'gradient-electric',
  'gradient-teal',
  'gradient-purple',
  'gradient-cyber-sunset',
  'gradient-electric',
  'gradient-magenta',
];

export const MODE_CONFIG: Record<
  Mode,
  { apiPath: string; timerMod: number; label: string; badge: string }
> = {
  '30s': {
    apiPath: 'WinGo_30S',
    timerMod: 30,
    label: 'Wingo 30 Second',
    badge: '30S',
  },
  '1m': {
    apiPath: 'WinGo_1M',
    timerMod: 60,
    label: 'Wingo 1 Minute',
    badge: '1M',
  },
  '3m': {
    apiPath: 'WinGo_3M',
    timerMod: 180,
    label: 'Wingo 3 Minute',
    badge: '3M',
  },
  '5m': {
    apiPath: 'WinGo_5M',
    timerMod: 300,
    label: 'Wingo 5 Minute',
    badge: '5M',
  },
};

export const APP_CONFIG = {
  name: 'ADVANCE',
  telegram: 'https://t.me/+WIKRSTgIhx5kNDRl',
  profileImage:
    'https://cdn.phototourl.com/member/2026-10-06-8bd2c666-f684-4065-9545-e6ed40bd7661.jpg',
};

export const ADMIN_TELEGRAM = APP_CONFIG.telegram;
export const CHANNEL_TELEGRAM = APP_CONFIG.telegram;

export const APP_ICONS = {
  logo: APP_CONFIG.profileImage,
  wingo: '/images/wingo-icon.png',
  k3: '/images/k3-icon.png',
  trx: '/images/trx-wingo-icon.png',
};

export const BADGE_STYLES: Record<string, string> = {
  '30S': 'bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]/30 shadow-[0_0_12px_rgba(0,229,255,0.25)]',
  '1M': 'bg-[#2563EB]/15 text-[#60A5FA] border-[#2563EB]/35 shadow-[0_0_12px_rgba(37,99,235,0.25)]',
  '3M': 'bg-[#A855F7]/15 text-[#C084FC] border-[#A855F7]/35 shadow-[0_0_12px_rgba(168,85,247,0.25)]',
  '5M': 'bg-[#FFD700]/15 text-[#FFD700] border-[#FFD700]/35 shadow-[0_0_12px_rgba(255,215,0,0.25)]',
};

export const RANK_MEDALS = ['👑', '🥈', '🥉'];
