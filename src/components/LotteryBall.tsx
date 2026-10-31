import React, { useState } from 'react';

// Official Wingo 3D Lottery Ball assets (0-9) - Transparent PNGs
export const BALL_IMAGES: Record<number, string> = {
  0: '/assets/reference/img0.png',
  1: '/assets/reference/img1.png',
  2: '/assets/reference/img2.png',
  3: '/assets/reference/img3.png',
  4: '/assets/reference/img4.png',
  5: '/assets/reference/img5.png',
  6: '/assets/reference/img6.png',
  7: '/assets/reference/img7.png',
  8: '/assets/reference/img8.png',
  9: '/assets/reference/img9.png',
};

// Local transparent fallback paths
export const BALL_FALLBACK_IMAGES: Record<number, string> = {
  0: '/images/balls/ball_0.png',
  1: '/images/balls/ball_1.png',
  2: '/images/balls/ball_2.png',
  3: '/images/balls/ball_3.png',
  4: '/images/balls/ball_4.png',
  5: '/images/balls/ball_5.png',
  6: '/images/balls/ball_6.png',
  7: '/images/balls/ball_7.png',
  8: '/images/balls/ball_8.png',
  9: '/images/balls/ball_9.png',
};

interface LotteryBallProps {
  num: number | string | undefined | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  glow?: boolean;
  className?: string;
  highlight?: boolean;
}

const SIZE_CLASSES = {
  xs: 'w-5 h-5 text-[10px]',
  sm: 'w-6 h-6 text-xs',
  md: 'w-8 h-8 text-sm',
  lg: 'w-10 h-10 text-base',
  xl: 'w-12 h-12 text-lg',
};

// Official Wingo Ball color schemes for fallback SVG rendering
const BALL_THEMES: Record<number, { bgGradient: string; glow: string; text: string }> = {
  0: { bgGradient: 'from-[#FF3864] via-[#E000FF] to-[#A855F7]', glow: 'rgba(168,85,247,0.7)', text: '#FFFFFF' },
  1: { bgGradient: 'from-[#00FF88] to-[#00A855]', glow: 'rgba(0,255,136,0.6)', text: '#FFFFFF' },
  2: { bgGradient: 'from-[#FF3864] to-[#C81E43]', glow: 'rgba(255,56,100,0.6)', text: '#FFFFFF' },
  3: { bgGradient: 'from-[#00FF88] to-[#00A855]', glow: 'rgba(0,255,136,0.6)', text: '#FFFFFF' },
  4: { bgGradient: 'from-[#FF3864] to-[#C81E43]', glow: 'rgba(255,56,100,0.6)', text: '#FFFFFF' },
  5: { bgGradient: 'from-[#00FF88] via-[#E000FF] to-[#A855F7]', glow: 'rgba(168,85,247,0.7)', text: '#FFFFFF' },
  6: { bgGradient: 'from-[#FF3864] to-[#C81E43]', glow: 'rgba(255,56,100,0.6)', text: '#FFFFFF' },
  7: { bgGradient: 'from-[#00FF88] to-[#00A855]', glow: 'rgba(0,255,136,0.6)', text: '#FFFFFF' },
  8: { bgGradient: 'from-[#FF3864] to-[#C81E43]', glow: 'rgba(255,56,100,0.6)', text: '#FFFFFF' },
  9: { bgGradient: 'from-[#00FF88] to-[#00A855]', glow: 'rgba(0,255,136,0.6)', text: '#FFFFFF' },
};

export const LotteryBall: React.FC<LotteryBallProps> = ({
  num,
  size = 'md',
  glow = false,
  className = '',
  highlight = false,
}) => {
  const [loadErrorCount, setLoadErrorCount] = useState(0);

  const numericVal = typeof num === 'number' ? num : parseInt(String(num), 10);
  const isValidNum = !isNaN(numericVal) && numericVal >= 0 && numericVal <= 9;

  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;

  if (!isValidNum) {
    return (
      <div
        className={`inline-flex items-center justify-center rounded-full bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)] text-[#94A3B8] font-mono font-bold ${sizeClass} ${className}`}
      >
        -
      </div>
    );
  }

  const isGreen = [1, 3, 7, 9].includes(numericVal);
  const isRed = [2, 4, 6, 8].includes(numericVal);
  const glowShadow = glow || highlight
    ? isGreen
      ? 'shadow-[0_0_12px_rgba(0,255,136,0.65)]'
      : isRed
      ? 'shadow-[0_0_12px_rgba(255,56,100,0.65)]'
      : 'shadow-[0_0_12px_rgba(168,85,247,0.75)]'
    : '';

  // If local PNG and fallback PNG fail, render SVG sphere
  if (loadErrorCount >= 2) {
    const theme = BALL_THEMES[numericVal] || BALL_THEMES[0];
    return (
      <div
        className={`relative inline-flex items-center justify-center flex-shrink-0 rounded-full font-bold select-none bg-gradient-to-br ${theme.bgGradient} ${
          highlight ? 'scale-110 ring-2 ring-[#00E5FF] ring-offset-1 ring-offset-[#050510]' : ''
        } ${glowShadow} ${sizeClass} ${className}`}
        title={`Ball ${numericVal}`}
      >
        <span className="font-mono font-black drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] text-white">
          {numericVal}
        </span>
      </div>
    );
  }

  const ballSrc = loadErrorCount === 0 
    ? (BALL_IMAGES[numericVal] || BALL_FALLBACK_IMAGES[numericVal])
    : (BALL_FALLBACK_IMAGES[numericVal] || `/images/n${numericVal}.png`);

  return (
    <div
      className={`relative inline-flex items-center justify-center flex-shrink-0 rounded-full transition-transform duration-200 select-none bg-transparent ${
        highlight ? 'scale-110 ring-2 ring-[#00E5FF] ring-offset-1 ring-offset-[#050510]' : ''
      } ${glowShadow} ${sizeClass} ${className}`}
      title={`Ball ${numericVal}`}
    >
      <img
        src={ballSrc}
        alt={`Ball ${numericVal}`}
        className="w-full h-full object-contain pointer-events-none select-none bg-transparent"
        loading="eager"
        onError={() => {
          setLoadErrorCount((prev) => prev + 1);
        }}
      />
    </div>
  );
};

