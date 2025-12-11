import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Search } from 'lucide-react';
import { FAQS } from '../constants';
import { Card } from './Card';
import { SearchInput } from './Input';

export const HowItWorks: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);

  const filteredFaqs = FAQS.filter(f => 
    f.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-24">
      <div className="text-center space-y-4 py-8">
        <div className="inline-flex p-3 bg-indigo-500/10 rounded-2xl mb-2">
          <HelpCircle className="w-8 h-8 text-indigo-400" />
        </div>
        <h1 className="text-3xl font-bold text-white">How can we help?</h1>
        <div className="max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <SearchInput 
              placeholder="Search for answers..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 bg-slate-800/50 border-slate-700/50 focus:bg-slate-800"
            />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Game Mechanics</h2>
          <div className="space-y-3">
             <Card padding="sm" className="bg-slate-800/30">
                <div className="flex gap-4 p-2">
                   <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold flex-shrink-0">1</div>
                   <div>
                     <h3 className="font-bold text-white">Predict</h3>
                     <p className="text-sm text-slate-400 mt-1">Select location and forecast weather conditions before midnight.</p>
                   </div>
                </div>
             </Card>
             <Card padding="sm" className="bg-slate-800/30">
                <div className="flex gap-4 p-2">
                   <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold flex-shrink-0">2</div>
                   <div>
                     <h3 className="font-bold text-white">Score</h3>
                     <p className="text-sm text-slate-400 mt-1">Earn points based on how close your prediction was to reality.</p>
                   </div>
                </div>
             </Card>
             <Card padding="sm" className="bg-slate-800/30">
                <div className="flex gap-4 p-2">
                   <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold flex-shrink-0">3</div>
                   <div>
                     <h3 className="font-bold text-white">Rank Up</h3>
                     <p className="text-sm text-slate-400 mt-1">Climb leaderboards and unlock badges to become a Weather Master.</p>
                   </div>
                </div>
             </Card>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {filteredFaqs.map((item) => (
              <div 
                key={item.id} 
                className={`bg-slate-800/40 border border-slate-700/50 rounded-xl overflow-hidden transition-all ${openId === item.id ? 'bg-slate-800' : 'hover:bg-slate-800/60'}`}
              >
                <button 
                  onClick={() => setOpenId(openId === item.id ? null : item.id)}
                  className="w-full flex justify-between items-center p-4 text-left"
                >
                  <span className="font-medium text-slate-200 text-sm">{item.question}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${openId === item.id ? 'rotate-180' : ''}`} />
                </button>
                {openId === item.id && (
                  <div className="px-4 pb-4 text-sm text-slate-400 animate-fade-in leading-relaxed">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
            {filteredFaqs.length === 0 && (
              <div className="text-center p-8 text-slate-500">
                No results found for "{searchTerm}"
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};