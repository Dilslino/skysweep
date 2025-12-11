import React from 'react';
import { NavLink } from 'react-router-dom';
import { CloudHail, Trophy, User, Zap, HelpCircle } from 'lucide-react';
import { AuthUser } from '../hooks/useAuth';

interface NavigationProps {
  user: AuthUser | null;
}

export const Navigation: React.FC<NavigationProps> = ({ user }) => {
  const navItems = [
    { name: 'Sweep', path: '/', icon: CloudHail },
    { name: 'Ranks', path: '/leaderboard', icon: Trophy },
    { name: 'Storm', path: '/storm-watch', icon: Zap },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Help', path: '/faq', icon: HelpCircle },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:top-0 md:bottom-auto">
      {/* Mobile Glass Background */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-lg border-t border-white/10 md:hidden" />
      
      {/* Desktop Header Background */}
      <div className="absolute inset-0 hidden md:block bg-slate-950/50 backdrop-blur-md border-b border-white/5" />

      <div className="relative max-w-3xl mx-auto px-4">
        <div className="flex justify-between md:justify-start md:gap-8 h-20 md:h-16 items-center">
          <div className="hidden md:flex items-center text-indigo-400 font-bold text-xl mr-8 tracking-tight">
            <span className="text-white">Sky</span>Sweep
          </div>
          
          <div className="flex w-full md:w-auto justify-between md:gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex flex-col md:flex-row items-center justify-center p-2 md:px-4 rounded-xl transition-all duration-300 group ${
                    isActive 
                      ? 'text-indigo-400' 
                      : 'text-slate-500 hover:text-slate-300'
                  }`
                }
              >
                <div className={({ isActive }: { isActive: boolean }) => `
                  p-1.5 rounded-xl mb-1 md:mb-0 md:mr-2 transition-all
                  ${isActive ? 'bg-indigo-500/10' : 'group-hover:bg-white/5'}
                `}>
                  <item.icon className={`w-6 h-6 md:w-5 md:h-5`} />
                </div>
                <span className={`text-[10px] md:text-sm font-medium ${
                  ({ isActive }: { isActive: boolean }) => isActive ? 'font-semibold' : ''
                }`}>{item.name}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};