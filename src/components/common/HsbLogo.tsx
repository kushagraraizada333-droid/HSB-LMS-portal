import React from 'react';

interface HsbLogoProps {
  variant?: 'white' | 'blue' | 'emblem' | 'emblem-white';
  className?: string;
  height?: number | string;
  showSubtitle?: boolean;
}

export const HsbLogo: React.FC<HsbLogoProps> = ({
  variant = 'white',
  className = '',
  height = 36,
  showSubtitle = false,
}) => {
  // If emblem-only is requested (compact icon representation of HSB's interlocking letterforms)
  if (variant === 'emblem' || variant === 'emblem-white') {
    const isWhite = variant === 'emblem-white';
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <div
          className={`flex items-center justify-center rounded-xl p-2 font-bold tracking-tighter ${
            isWhite
              ? 'bg-white/10 text-white ring-1 ring-white/20'
              : 'bg-[#1955a6] text-white shadow-sm ring-1 ring-[#1955a6]/30'
          }`}
          style={{ width: typeof height === 'number' ? height : 40, height: typeof height === 'number' ? height : 40 }}
        >
          {/* SVG representation of the official HSB monogram mark */}
          <svg
            viewBox="0 0 780 322"
            className="w-full h-full fill-current"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M733.29,160.22c18.17-15.32,30.22-37.2,30.26-61.78c0.06-46.89-43.36-88.92-90.36-88.92h-133.4l-0.17,123.63 H434.69c-14.25,0-25.8,11.56-25.8,25.82l-0.14,65.94c0,25.59-14.15,35.41-37.94,35.41c-19.15,0-87.52,0-87.52,0v60.43 c0,0,65.07,0,101.97,0c52.54,0,84.38-36.72,85.08-78.73l0.14-49.95h69.05l-0.16,114.7c-0.01,7.5,6.46,13.96,13.99,13.96 l127.57-0.04c50.02,0,92.75-36.18,92.81-84.87C773.79,204.23,758.17,175.59,733.29,160.22z M601.29,68.24l66.61-0.03 c21.88,0,33.38,15.03,33.07,32.64c-0.32,17.99-11.98,32.29-33.13,32.29l-66.64-0.05L601.29,68.24z M672.69,261.89l-71.66-0.05 l0.1-69.82l71.63-0.03c30.66,0,39.45,18.31,39.45,34.96C712.2,243,700.97,261.89,672.69,261.89z" />
            <path d="M470.3,9.61v60.43c0,0-68.38,0-87.52,0c-23.79,0-37.94,9.82-37.94,35.41v63.67c0,14.25-11.55,25.82-25.8,25.82 H214.75V320.7h-52.22c-5.18,0-9.37-4.2-9.37-9.37V194.96H61.59v116.37c0,5.18-4.2,9.37-9.37,9.37H0V9.52h52.22 c5.18,0,9.37,4.2,9.37,9.37v117.13h91.57V18.89c0-5.18,4.2-9.37,9.37-9.37h52.22v126.52h68.49V88.35 c0.69-42.01,32.54-78.73,85.08-78.73C405.23,9.61,470.3,9.61,470.3,9.61z" />
          </svg>
        </div>
        {showSubtitle && (
          <div className="flex flex-col text-left">
            <span className={`text-xs font-extrabold tracking-wider uppercase font-serif ${isWhite ? 'text-white' : 'text-[#1955a6]'}`}>
              HSB
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              Jaipur Campus
            </span>
          </div>
        )}
      </div>
    );
  }

  // Full official HSB Logo
  const logoSrc = variant === 'blue' ? '/hsb-logo-blue.svg' : '/hsb-logo.svg';

  return (
    <div className={`inline-flex flex-col ${className}`}>
      <img
        src={logoSrc}
        alt="Hari Shankar Singhania School of Business (HSB), Jaipur"
        style={{ height }}
        className="w-auto object-contain max-w-full"
      />
      {showSubtitle && (
        <span
          className={`text-[10px] uppercase tracking-wider font-semibold mt-1 ${
            variant === 'blue' ? 'text-slate-500' : 'text-blue-200/80'
          }`}
        >
          School of Business • Jaipur
        </span>
      )}
    </div>
  );
};
