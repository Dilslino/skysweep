import React from 'react';
import { Card } from './Card';

interface HeatmapDay {
  date: string;
  accuracy: number;
  status: 'missed' | 'predicted' | 'pending';
}

export const Heatmap: React.FC = () => {
  // Generate mock data for the last 28 days (4 weeks)
  const days: HeatmapDay[] = Array.from({ length: 28 }, (_, i) => {
    const accuracy = Math.random() > 0.2 ? Math.floor(Math.random() * 40) + 60 : 0;
    const status = accuracy > 0 ? 'predicted' : Math.random() > 0.5 ? 'missed' : 'pending';
    return {
      date: `Day ${i + 1}`,
      accuracy: status === 'predicted' ? accuracy : 0,
      status
    };
  });

  const getColor = (day: HeatmapDay) => {
    if (day.status === 'missed') return 'bg-slate-800/50';
    if (day.status === 'pending') return 'bg-slate-700/50';
    if (day.accuracy >= 90) return 'bg-green-400';
    if (day.accuracy >= 75) return 'bg-green-500/70';
    if (day.accuracy >= 60) return 'bg-green-600/50';
    return 'bg-yellow-500/50';
  };

  return (
    <Card className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-white">Activity Heatmap</h3>
        <div className="flex gap-2 text-[10px] text-slate-500 items-center">
          <span>Less</span>
          <div className="w-2 h-2 rounded-sm bg-slate-800/50" />
          <div className="w-2 h-2 rounded-sm bg-green-600/50" />
          <div className="w-2 h-2 rounded-sm bg-green-400" />
          <span>More</span>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1.5 md:gap-2">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
          <div key={i} className="text-center text-xs text-slate-500 mb-1">{d}</div>
        ))}
        {days.map((day, i) => (
          <div
            key={i}
            className={`
              aspect-square rounded-md transition-all hover:scale-110 cursor-pointer group relative
              ${getColor(day)}
            `}
          >
            <div className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-xs rounded whitespace-nowrap z-10 pointer-events-none shadow-lg border border-white/10">
              {day.status === 'predicted' ? `${day.accuracy}% Accuracy` : day.status}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};