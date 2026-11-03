import React from 'react';
import logoImg from '../../assets/logo.png';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
}

export const Logo: React.FC<LogoProps> = ({ className = '', variant = 'dark' }) => {
  const isLight = variant === 'light';

  return (
    <div className={`flex items-center select-none ${className}`}>
      <img
        src={logoImg}
        alt="Baby Panda"
        className={`h-10 sm:h-12 md:h-14 w-auto object-contain transition-transform group-hover:scale-105 duration-200 ${
          isLight ? 'brightness-110 drop-shadow-[0_2px_12px_rgba(255,255,255,0.25)]' : 'drop-shadow-xs'
        }`}
      />
    </div>
  );
};
