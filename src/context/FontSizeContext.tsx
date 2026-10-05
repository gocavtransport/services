import React, { createContext, useContext, useEffect, useState } from 'react';

export type FontSizeLevel = 'normal' | 'large' | 'xlarge';

interface FontSizeContextType {
  fontSize: FontSizeLevel;
  setFontSize: (size: FontSizeLevel) => void;
  cycleFontSize: () => void;
}

const FontSizeContext = createContext<FontSizeContextType | undefined>(undefined);

export const FontSizeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fontSize, setFontSizeState] = useState<FontSizeLevel>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gocav_font_size') as FontSizeLevel | null;
      if (saved && ['normal', 'large', 'xlarge'].includes(saved)) {
        return saved;
      }
    }
    return 'normal';
  });

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.classList.remove('font-scale-normal', 'font-scale-large', 'font-scale-xlarge');
      root.classList.add(`font-scale-${fontSize}`);
      try {
        localStorage.setItem('gocav_font_size', fontSize);
      } catch {}
    }
  }, [fontSize]);

  const setFontSize = (size: FontSizeLevel) => {
    setFontSizeState(size);
  };

  const cycleFontSize = () => {
    setFontSizeState((prev) => {
      if (prev === 'normal') return 'large';
      if (prev === 'large') return 'xlarge';
      return 'normal';
    });
  };

  return (
    <FontSizeContext.Provider value={{ fontSize, setFontSize, cycleFontSize }}>
      {children}
    </FontSizeContext.Provider>
  );
};

export const useFontSize = (): FontSizeContextType => {
  const context = useContext(FontSizeContext);
  if (!context) {
    throw new Error('useFontSize must be used within a FontSizeProvider');
  }
  return context;
};
