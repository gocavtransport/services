import React from 'react';
import { useFontSize, FontSizeLevel } from '../context/FontSizeContext';
import { Eye, ZoomIn, Check } from 'lucide-react';

interface FontSizeToggleProps {
  className?: string;
  variant?: 'compact' | 'full' | 'floating';
}

export const FontSizeToggle: React.FC<FontSizeToggleProps> = ({
  className = '',
  variant = 'compact',
}) => {
  const { fontSize, setFontSize, cycleFontSize } = useFontSize();

  const labels: Record<FontSizeLevel, string> = {
    normal: 'Standard (18px)',
    large: 'Large (21px)',
    xlarge: 'Extra Large (24px)',
  };

  const tooltips: Record<FontSizeLevel, string> = {
    normal: 'Standard text (18px). Click to enlarge font for easier reading.',
    large: 'Large text (21px) active. Click for extra-large text.',
    xlarge: 'Extra-large font (24px) active. Click to return to standard text.',
  };

  if (variant === 'floating') {
    return (
      <button
        type="button"
        onClick={cycleFontSize}
        title={tooltips[fontSize]}
        aria-label="Adjust font size for eyesight reading"
        className={`group fixed bottom-20 md:bottom-6 right-4 z-40 flex items-center gap-2 px-3 py-2.5 rounded-full border shadow-2xl transition active:scale-95 ${
          fontSize !== 'normal'
            ? 'bg-gradient-to-r from-[#d4af37] to-[#f5d77f] text-black border-white/40 ring-4 ring-[#d4af37]/30'
            : 'bg-[#181a26]/95 backdrop-blur-md text-[#f5d77f] border-[#d4af37]/50 hover:bg-[#202334]'
        } ${className}`}
      >
        <div className={`p-1 rounded-full ${fontSize !== 'normal' ? 'bg-black/10' : 'bg-[#d4af37]/10'}`}>
          <Eye className="w-4 h-4 shrink-0" />
        </div>
        <div className="flex flex-col text-left leading-tight pr-1">
          <span className="text-xs font-black tracking-wide">
            {fontSize === 'normal' ? 'Text Aa' : fontSize === 'large' ? 'Text Aa+' : 'Text Aa++'}
          </span>
          <span className={`text-[10px] font-semibold ${fontSize !== 'normal' ? 'text-black/80' : 'text-slate-300'}`}>
            {fontSize === 'normal' ? 'Enlarge font' : fontSize === 'large' ? 'Large Mode' : 'Max Legibility'}
          </span>
        </div>
      </button>
    );
  }

  if (variant === 'full') {
    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        <div className="flex items-center justify-between text-sm text-slate-200 font-semibold">
          <span className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#f5d77f]" />
            <span>Reading Font Size (Eye Comfort):</span>
          </span>
          <span className="text-[#f5d77f] font-bold">{labels[fontSize]}</span>
        </div>
        <div className="grid grid-cols-3 gap-2 p-1.5 bg-black/50 rounded-xl border border-white/10">
          {(['normal', 'large', 'xlarge'] as const).map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => setFontSize(lvl)}
              className={`py-2 px-2.5 rounded-lg font-bold transition flex flex-col items-center justify-center gap-0.5 text-center ${
                fontSize === lvl
                  ? 'bg-gradient-to-r from-[#f5d77f] to-[#d4af37] text-black shadow-lg ring-2 ring-white/20'
                  : 'text-slate-200 hover:text-white hover:bg-white/10 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-1">
                <span className="text-sm md:text-base font-extrabold">
                  {lvl === 'normal' ? 'Aa' : lvl === 'large' ? 'Aa+' : 'Aa++'}
                </span>
                {fontSize === lvl && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
              <span className="text-xs font-semibold">
                {lvl === 'normal' ? 'Standard' : lvl === 'large' ? 'Large' : 'Extra Large'}
              </span>
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Select larger text size for high contrast, comfortable reading, and less eye strain.
        </p>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={cycleFontSize}
      title={tooltips[fontSize]}
      aria-label="Toggle readable font size for eyesight reading"
      className={`group flex items-center gap-2 px-3 py-1.5 rounded-xl border transition text-xs font-semibold ${
        fontSize !== 'normal'
          ? 'bg-[#d4af37]/25 border-[#d4af37] text-[#fdf4b8] shadow-md shadow-[#d4af37]/20 ring-1 ring-[#d4af37]/40'
          : 'bg-[#181a24] border-[#2e3244] text-slate-200 hover:border-[#d4af37]/50 hover:text-white'
      } ${className}`}
    >
      <Eye className={`w-4 h-4 ${fontSize !== 'normal' ? 'text-[#f5d77f]' : 'text-amber-400 group-hover:text-[#f5d77f]'}`} />
      <span className="font-extrabold text-xs sm:text-sm">
        {fontSize === 'normal' ? 'Aa Font' : fontSize === 'large' ? 'Aa+ Large' : 'Aa++ XL'}
      </span>
      <span className="hidden lg:inline text-xs text-slate-300 font-medium">
        ({fontSize === 'normal' ? 'Enlarge' : fontSize === 'large' ? '21px' : '24px'})
      </span>
      {fontSize !== 'normal' && (
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/50" />
      )}
    </button>
  );
};
