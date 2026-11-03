import React from 'react';
import logoImg from '../../assets/logo.png';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
}

export const Logo: React.FC<LogoProps> = ({ className = '', variant = 'light' }) => {
  return (
    <div className={`flex items-center select-none ${className}`}>
      <img
        src={logoImg}
        alt="Baby Panda"
        className="h-9 sm:h-10 md:h-12 w-auto object-contain transition-transform group-hover:scale-105 duration-200"
      />
    </div>
  );
};
