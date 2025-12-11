import React, { useEffect, useState } from 'react';
import { ACCURACY_HISTORY, WEATHER_CONDITIONS } from '../constants';
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip, YAxis, CartesianGrid } from 'recharts';
import { BadgeCheck, Flame, Star, Settings, Calendar, MapPin, TrendingUp, Share2, Cloud, Target } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';
import { Heatmap } from './Heatmap';
import { AuthUser } from '../hooks/useAuth';
import { api } from '../lib/api';

interface ProfileProps {
  user: AuthUser | null;
}

interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  tier: string;
  unlocked_at?: string;
}

interface PredictionHistory {
  id: string;
  date: string;
  location: string;
  predicted: { temp: number; condition: string };
  actual?: { temp: number; condition: string };
  score: number | null;
  status: string;
}

export const Profile: React.FC<ProfileProps> = ({ user }) => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [recentPredictions, setRecentPredictions] = useState<PredictionHistory[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, scored: 0, averageScore: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfileData() {
      if (!user) return;
      
      try {
        const [profileData, predictionsData] = await Promise.all([
          api.get('/users/profile'),
          api.get('/predictions?limit=5')
        ]);

        setBadges(profileData.badges || []);
        setStats(profileData.stats || { total: 0, pending: 0, scored: 0, averageScore: 0 });
        
        // Transform predictions
        const transformed = predictionsData.map((p: any) => ({
          id: p.id,
          date: formatDate(p.created_at),
          location: p.location_name,
          predicted: { temp: p.predicted_temp, condition: p.predicted_condition },
          actual: p.actual_temp ? { temp: p.actual_temp, condition: p.actual_condition } : undefined,
          score: p.score,
          status: p.status,
        }));
        setRecentPredictions(transformed);
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProfileData();
  }, [user]);

  if (!user) {
    return <div className="text-center text-slate-400 py-8">Please log in to view your profile</div>;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-24">
      {/* Profile Header */}
      <div className="relative">
        <div className="h-32 bg-gradient-to-r from-indigo-900 to-slate-900 rounded-t-3xl opacity-80" />
        <div className="absolute top-4 right-4 flex gap-2">
          <button className="p-2 bg-black/20 backdrop-blur-sm rounded-full text-white hover:bg-black/40 transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
          <button className="p-2 bg-black/20 backdrop-blur-sm rounded-full text-white hover:bg-black/40 transition-colors">
            <Settings className="w-4 h-4" />
          </button>
        </div>
        
        <div className="px-6 pb-6 -mt-12 flex flex-col md:flex-row items-start md:items-end gap-4 relative z-10">
          <div className="relative">
             <img 
              src={user.avatarUrl} 
              alt={user.username} 
              className="w-24 h-24 rounded-2xl border-4 border-slate-950 shadow-xl object-cover"
            />
            <div className="absolute -bottom-2 -right-2 bg-indigo-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-lg border border-slate-900">
              Rank #{user.rank}
            </div>
          </div>
          
          <div className="flex-1 pt-2 md:pt-0">
            <h1 className="text-2xl font-bold text-white">{user.displayName || user.username}</h1>
            <div className="flex flex-wrap gap-y-1 gap-x-4 text-sm text-slate-400 mt-1">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {user.bestLocation || 'Unknown'}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> FID: {user.fid}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 px-1">
        <Card padding="sm" className="bg-slate-800/30">
          <div className="flex flex-col items-center text-center">
            <div className="p-2 bg-orange-500/10 rounded-full mb-2">
              <Flame className="w-5 h-5 text-orange-500" />
            </div>
            <div className="text-2xl font-bold text-white">{user.streak}</div>
            <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Day Streak</div>
          </div>
        </Card>
        <Card padding="sm" className="bg-slate-800/30">
          <div className="flex flex-col items-center text-center">
            <div className="p-2 bg-yellow-500/10 rounded-full mb-2">
              <Star className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="text-2xl font-bold text-white">{(user.points / 1000).toFixed(1)}k</div>
            <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Total Points</div>
          </div>
        </Card>
        <Card padding="sm" className="bg-slate-800/30">
          <div className="flex flex-col items-center text-center">
            <div className="p-2 bg-green-500/10 rounded-full mb-2">
              <Target className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-white">{user.accuracy.toFixed(1)}%</div>
            <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Avg Accuracy</div>
          </div>
        </Card>
        <Card padding="sm" className="bg-slate-800/30">
          <div className="flex flex-col items-center text-center">
            <div className="p-2 bg-indigo-500/10 rounded-full mb-2">
              <BadgeCheck className="w-5 h-5 text-indigo-500" />
            </div>
            <div className="text-2xl font-bold text-white">{badges.length}</div>
            <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Badges</div>
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Charts */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-400" /> Performance Trend
              </h3>
              <select className="bg-slate-800 border-none text-xs rounded-lg px-2 py-1 text-slate-300 outline-none">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ACCURACY_HISTORY}>
                  <defs>
                    <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    domain={[0, 100]}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    itemStyle={{ color: '#e2e8f0' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="accuracy" 
                    stroke="#6366f1" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorAccuracy)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Heatmap />
          
          <div className="space-y-4">
            <h3 className="font-semibold text-white px-1">Recent Predictions</h3>
            <div className="space-y-3">
              {recentPredictions.length > 0 ? (
                recentPredictions.map((item) => {
                  const ConditionIcon = WEATHER_CONDITIONS.find(c => c.type === item.predicted.condition)?.icon || Cloud;
                  return (
                    <Card key={item.id} hover padding="sm" className="flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className={`
                          w-12 h-12 rounded-xl flex flex-col items-center justify-center text-xs font-bold
                          ${item.score && item.score >= 90 ? 'bg-green-500/10 text-green-400' : 'bg-slate-800 text-slate-400'}
                        `}>
                          <span>{item.score || '--'}</span>
                          <span className="text-[9px] uppercase font-normal opacity-70">Pts</span>
                        </div>
                        <div>
                          <div className="font-medium text-white">{item.location}</div>
                          <div className="text-xs text-slate-500 flex items-center gap-2">
                            <span>{item.date}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <ConditionIcon className="w-3 h-3" /> {item.predicted.temp}°C
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <span className={`
                          px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide
                          ${item.status === 'scored' ? 'bg-slate-800 text-slate-400' : 'bg-indigo-500/20 text-indigo-300'}
                        `}>
                          {item.status}
                        </span>
                      </div>
                    </Card>
                  );
                })
              ) : (
                <Card className="text-center py-8 text-slate-400">
                  No predictions yet. Start forecasting!
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Badges & Info */}
        <div className="space-y-6">
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-white">Latest Badges</h3>
              <span className="text-xs text-indigo-400 cursor-pointer hover:underline">View All</span>
            </div>
            <div className="space-y-4">
              {badges.length > 0 ? (
                badges.slice(0, 5).map((badge) => (
                  <div key={badge.id} className="flex items-center gap-3 group">
                    <div className={`
                      w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-slate-800 border border-slate-700
                      ${badge.tier === 'gold' ? 'shadow-[0_0_10px_rgba(234,179,8,0.2)] border-yellow-500/30' : ''}
                    `}>
                      {badge.icon}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">
                        {badge.name}
                      </div>
                      <div className="text-xs text-slate-500">
                        {badge.unlocked_at ? formatDate(badge.unlocked_at) : 'Recently'}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-slate-400 text-sm py-4">
                  No badges yet. Keep forecasting!
                </div>
              )}
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-900/50 to-slate-900 border-indigo-500/20">
             <h3 className="font-semibold text-white mb-2">Statistics</h3>
             <div className="space-y-2 text-sm">
               <div className="flex justify-between">
                 <span className="text-slate-400">Total Predictions</span>
                 <span className="text-white font-bold">{stats.total}</span>
               </div>
               <div className="flex justify-between">
                 <span className="text-slate-400">Pending</span>
                 <span className="text-white font-bold">{stats.pending}</span>
               </div>
               <div className="flex justify-between">
                 <span className="text-slate-400">Scored</span>
                 <span className="text-white font-bold">{stats.scored}</span>
               </div>
               <div className="flex justify-between">
                 <span className="text-slate-400">Avg Score</span>
                 <span className="text-white font-bold">{stats.averageScore.toFixed(1)}</span>
               </div>
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  
  return date.toLocaleDateString();
}
