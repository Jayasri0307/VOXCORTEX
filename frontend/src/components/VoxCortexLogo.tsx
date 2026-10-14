import React from 'react';

interface VoxCortexLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const VoxCortexLogo: React.FC<VoxCortexLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-14 h-14',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* High-tech Icon Emblem */}
      <div className={`relative ${iconSizes[size]} rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-500 p-[1.5px] shadow-md shadow-violet-500/20 group`}>
        <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center overflow-hidden relative">
          {/* Ambient luminous glow */}
          <div className="absolute inset-0 bg-radial from-cyan-500/20 via-violet-600/10 to-transparent blur-xs pointer-events-none" />
          
          <svg
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-4/5 h-4/5 relative z-10"
          >
            <defs>
              <linearGradient id="cortexGrad" x1="2" y1="4" x2="16" y2="28" gradientUnits="userSpaceOnUse">
                <stop stopColor="#A855F7" />
                <stop offset="0.6" stopColor="#6366F1" />
                <stop offset="1" stopColor="#38BDF8" />
              </linearGradient>
              <linearGradient id="waveGrad" x1="16" y1="6" x2="30" y2="26" gradientUnits="userSpaceOnUse">
                <stop stopColor="#38BDF8" />
                <stop offset="0.5" stopColor="#06B6D4" />
                <stop offset="1" stopColor="#22D3EE" />
              </linearGradient>
            </defs>

            {/* Neural Brain Cortex Lobes (Left) */}
            <path
              d="M14 6C11 6 8.5 7.5 7.5 10C6 11 5 12.8 5 15C5 17 6 18.5 7.2 19.5C6.8 21 7.2 22.8 8.5 24C10 25.5 12 26 14 26"
              stroke="url(#cortexGrad)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Inner Neural Synapse Circuit Tracks */}
            <path
              d="M13 11C11 11.5 9.5 13 9.5 15C9.5 16.5 10.5 17.5 12 18"
              stroke="#C084FC"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <circle cx="13" cy="11" r="1.2" fill="#E879F9" />
            <circle cx="12" cy="18" r="1.2" fill="#67E8F9" />
            <circle cx="9.5" cy="15" r="1" fill="#C084FC" />
            <path
              d="M13 22C11 22 10.5 20.5 11 19.5"
              stroke="#A855F7"
              strokeWidth="1.5"
              strokeLinecap="round"
            />

            {/* Soundwave Frequency Nodes (Right) */}
            <path
              d="M15 16H17L18.5 8L21 24L23.5 11L25.5 20L27 14L28.5 16H30"
              stroke="url(#waveGrad)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span className={`font-black tracking-tight text-slate-900 ${textSizes[size]}`}>
              VOX<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 font-extrabold">CORTEX</span>
            </span>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-gradient-to-r from-violet-500/10 to-cyan-500/10 text-violet-700 border border-violet-200/60 uppercase tracking-widest">
              AI
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium tracking-wide mt-0.5">
            Voice Intelligence & Memory Cortex
          </span>
        </div>
      )}
    </div>
  );
};
