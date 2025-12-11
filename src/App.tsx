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

  // Allow browsing without authentication

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