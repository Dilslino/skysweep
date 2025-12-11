import React, { useState } from 'react';
import { Trophy, TrendingUp, TrendingDown, Minus, Target, Users } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';
import { useLeaderboard } from '../hooks/useLeaderboard';

export const Leaderboard: React.FC = () => {
  const [filter, setFilter] = useState<'global' | 'friends'>('global');
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'all'>('weekly');
  const { leaderboard, loading } = useLeaderboard(100);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      <div className="flex flex-col space-y-1">
        <h1 className="text-2xl font-bold text-white">Rankings</h1>
        <p className="text-slate-400 text-sm">Compare your forecasting skills.</p>
      </div>

      <Card padding="sm" className="flex p-1 gap-1">
        <button
          onClick={() => setFilter('global')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
            filter === 'global' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Trophy className="w-4 h-4" /> Global
        </button>
        <button
          onClick={() => setFilter('friends')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
            filter === 'friends' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" /> Friends
        </button>
      </Card>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {['Daily', 'Weekly', 'Monthly', 'All Time'].map((t) => {
          const val = t.toLowerCase().split(' ')[0] as any;
          return (
            <Button
              key={t}
              size="sm"
              variant={timeframe === val ? 'primary' : 'secondary'}
              onClick={() => setTimeframe(val)}
              className="whitespace-nowrap rounded-full px-4"
            >
              {t}
            </Button>
          );
        })}
      </div>

      <div className="space-y-3">
        {/* Header Row */}
        <div className="flex items-center px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <div className="w-8 text-center">#</div>
          <div className="flex-1 ml-4">User</div>
          <div className="w-20 text-right hidden md:block">Accuracy</div>
          <div className="w-20 text-right">Points</div>
        </div>

        {leaderboard.length > 0 ? (
          leaderboard.map((entry, index) => {
            const isTop3 = index < 3;
            const rankColors = ['text-yellow-400', 'text-slate-300', 'text-amber-600'];
            
            return (
              <Card 
                key={entry.id}
                hover
                padding="none"
                className={`flex items-center p-3 md:p-4 ${isTop3 ? 'bg-gradient-to-r from-slate-900/60 to-slate-800/40 border-t border-white/5' : ''}`}
              >
                <div className={`font-bold text-lg w-8 text-center flex flex-col items-center justify-center ${index < 3 ? rankColors[index] : 'text-slate-500'}`}>
                  {entry.user.rank}
                  <div className="mt-1">
                     {entry.change > 0 ? (
                      <div className="flex items-center text-[10px] text-green-500 font-medium bg-green-500/10 px-1 rounded">
                        <TrendingUp className="w-2.5 h-2.5 mr-0.5" /> {entry.change}
                      </div>
                    ) : entry.change < 0 ? (
                      <div className="flex items-center text-[10px] text-red-500 font-medium bg-red-500/10 px-1 rounded">
                        <TrendingDown className="w-2.5 h-2.5 mr-0.5" /> {Math.abs(entry.change)}
                      </div>
                    ) : (
                      <Minus className="w-3 h-3 text-slate-700" />
                    )}
                  </div>
                </div>
                
                <div className="relative mx-4 flex-shrink-0">
                  <img 
                    src={entry.user.avatarUrl} 
                    alt={entry.user.username} 
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-full border-2 object-cover ${index === 0 ? 'border-yellow-400' : 'border-slate-700'}`}
                  />
                  {index === 0 && (
                    <div className="absolute -top-1 -right-1 bg-yellow-400 text-slate-900 p-0.5 rounded-full">
                      <Trophy className="w-3 h-3" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0 mr-2">
                  <h3 className="font-semibold text-white truncate text-sm md:text-base">{entry.user.username}</h3>
                  <div className="flex items-center text-xs text-slate-400 mt-0.5">
                    <span className="bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded text-[10px] font-medium mr-2">
                      {entry.user.streak}🔥
                    </span>
                    <span>{entry.accuracy.toFixed(1)}% accuracy</span>
                  </div>
                </div>

                <div className="w-20 text-right hidden md:block">
                  <div className="flex items-center justify-end gap-1 text-slate-300 font-medium">
                    <Target className="w-3 h-3 text-slate-500" />
                    {entry.accuracy.toFixed(1)}%
                  </div>
                </div>

                <div className="w-20 text-right">
                  <div className="font-bold text-white tabular-nums">{entry.score.toLocaleString()}</div>
                  <div className="text-[10px] text-slate-500">pts</div>
                </div>
              </Card>
            );
          })
        ) : (
          <Card className="text-center py-8 text-slate-400">
            No leaderboard data available
          </Card>
        )}
      </div>
      
      {leaderboard.length >= 100 && (
        <div className="text-center p-4">
          <Button variant="ghost" size="sm">Load More</Button>
        </div>
      )}
    </div>
  );
};
