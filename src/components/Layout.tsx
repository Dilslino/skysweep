import React from 'react';
import { Navigation } from './Navigation';
import { Outlet } from 'react-router-dom';
import { AuthUser } from '../hooks/useAuth';

interface LayoutProps {
  user: AuthUser | null;
}

export const Layout: React.FC<LayoutProps> = ({ user }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Enhanced Background Gradient Mesh */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#020617]">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-900/10 rounded-full blur-[100px] mix-blend-screen" />
        <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] bg-sky-900/10 rounded-full blur-[80px] mix-blend-screen" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto min-h-screen flex flex-col">
        <Navigation user={user} />
        
        {/* Main Content Area */}
        <main className="flex-1 px-4 py-6 md:px-0 md:py-8 mt-0 md:mt-16">
           <Outlet context={{ user }} />
        </main>
      </div>
    </div>
  );
};