import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Sweep } from './components/Sweep';
import { Leaderboard } from './components/Leaderboard';
import { Profile } from './components/Profile';
import { StormWatch } from './components/StormWatch';
import { HowItWorks } from './components/HowItWorks';
import { useAuth } from './hooks/useAuth';

const App: React.FC = () => {
  const { user, loading, error } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading SkySweep...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-white mb-2">Connection Error</h2>
          <p className="text-slate-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout user={user} />}>
          <Route index element={<Sweep user={user} />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="profile" element={<Profile user={user} />} />
          <Route path="storm-watch" element={<StormWatch />} />
          <Route path="faq" element={<HowItWorks />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;