import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = false,
  padding = 'md'
}) => {
  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-6'
  };

  return (
    <div className={`
      relative overflow-hidden
      bg-slate-900/40 backdrop-blur-md 
      border border-white/5 
      rounded-2xl 
      shadow-xl shadow-black/20
      ${hover ? 'transition-all duration-300 hover:bg-slate-800/50 hover:border-white/10 hover:shadow-indigo-500/10 hover:-translate-y-0.5' : ''}
      ${paddings[padding]} 
      ${className}
    `}>
      {children}
    </div>
  );
};