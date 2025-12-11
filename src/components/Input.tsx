import React from 'react';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  onChange: (value: number) => void;
  icon?: React.ReactNode;
  step?: number;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  value,
  min,
  max,
  unit,
  onChange,
  icon,
  step = 1
}) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-slate-300 font-medium">
          {icon}
          <span>{label}</span>
        </div>
        <div className="flex items-center bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-1">
          <input
            type="number"
            value={value}
            onChange={(e) => {
              const val = Math.min(Math.max(Number(e.target.value), min), max);
              onChange(val);
            }}
            className="w-12 bg-transparent text-right font-mono text-white focus:outline-none"
          />
          <span className="text-slate-500 ml-1 text-sm">{unit}</span>
        </div>
      </div>
      
      <div className="relative h-6 flex items-center group">
        <div className="absolute w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 transition-all duration-150"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute w-full h-full opacity-0 cursor-pointer z-10"
        />
        <div 
          className="w-4 h-4 bg-white rounded-full shadow-lg border-2 border-indigo-500 absolute pointer-events-none transition-all duration-150 group-hover:scale-110"
          style={{ left: `calc(${percentage}% - 8px)` }}
        />
      </div>
      
      <div className="flex justify-between text-xs text-slate-500 font-medium px-1">
        <span>{min}{unit}</span>
        <span>{Math.floor((max + min) / 2)}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
};

export const SearchInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className, ...props }) => (
  <input
    className={`
      w-full bg-slate-900/60 border border-slate-700 
      text-slate-200 placeholder-slate-500
      rounded-xl px-4 py-3 outline-none
      focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50
      transition-all duration-200
      ${className}
    `}
    {...props}
  />
);