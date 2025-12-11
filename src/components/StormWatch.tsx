import React, { useState } from 'react';
import { STORM_EVENTS } from '../constants';
import { CreateEventFormData } from '../types';
import { AlertTriangle, Clock, MapPin, Zap, Wind, Users, ArrowUpRight, BarChart3, X, Plus, Trophy } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';
import { CreateEventModal } from './CreateEventModal';

export const StormWatch: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const activeEvent = STORM_EVENTS.find(e => e.id === selectedEvent);

  const handleCreateEvent = (data: CreateEventFormData) => {
    // In a real app, this would make an API call or smart contract transaction
    console.log('Creating event:', data);
    setShowCreateModal(false);
    // Could add a toast notification here
  };

  return (
    <div className="space-y-8 pb-24 relative min-h-screen">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <Zap className="text-amber-400 fill-current" /> StormWatch
        </h1>
        <p className="text-slate-400">High-stakes predictions for extreme weather events.</p>
      </div>

      {/* Events Grid */}
      <div className="grid gap-6">
        {STORM_EVENTS.map((event) => (
          <div key={event.id} className="relative group rounded-3xl overflow-hidden shadow-2xl transition-transform hover:-translate-y-1">
            {/* Background Image & Overlay */}
            <div className="absolute inset-0 z-0">
               <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-900/40 z-10" />
               <img 
                src="https://images.unsplash.com/photo-1590552515252-3a5a1bce71e3?q=80&w=1000&auto=format&fit=crop" 
                alt="Storm"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 grayscale group-hover:grayscale-0"
               />
            </div>

            {/* Content Container */}
            <div className="relative z-20 p-6 md:p-8 flex flex-col h-full min-h-[320px]">
               {/* Badges */}
               <div className="flex justify-between items-start mb-auto">
                 <div className="flex gap-2">
                   <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-white/10 ${
                     event.severity >= 4 ? 'bg-red-500/80 text-white' : 'bg-orange-500/80 text-white'
                   }`}>
                     Severity {event.severity}
                   </span>
                   <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-900/60 text-slate-300 backdrop-blur-md border border-white/10">
                     {event.type}
                   </span>
                 </div>
                 <div className="bg-slate-900/80 backdrop-blur-md rounded-lg px-3 py-1.5 flex items-center gap-2 text-xs font-medium text-amber-400 border border-amber-500/20">
                    <Zap className="w-3 h-3 fill-current" />
                    +{event.bonusPoints} pts
                 </div>
               </div>

               {/* Title Area */}
               <div className="space-y-4">
                 <div>
                   <h3 className="text-3xl font-bold text-white mb-2">{event.title}</h3>
                   <div className="flex items-center text-slate-300 text-sm gap-4">
                     <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-slate-400" /> {event.location}</span>
                     <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-slate-400" /> {event.participants.toLocaleString()} joined</span>
                   </div>
                 </div>

                 {/* Metrics Grid */}
                 <div className="grid grid-cols-2 gap-3">
                   <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-3 border border-white/5">
                      <div className="text-xs text-slate-400 mb-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Ends In
                      </div>
                      <div className="font-mono text-lg text-white font-medium">{event.endsIn}</div>
                   </div>
                   <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-3 border border-white/5">
                      <div className="text-xs text-slate-400 mb-1 flex items-center gap-1">
                        <Wind className="w-3 h-3" /> Focus
                      </div>
                      <div className="text-sm text-white">Peak Gusts & Rainfall</div>
                   </div>
                 </div>

                 <Button 
                   fullWidth 
                   variant="primary" 
                   size="lg" 
                   className="mt-2 group-hover:shadow-lg group-hover:shadow-indigo-500/30"
                   onClick={() => setSelectedEvent(event.id)}
                 >
                   Join Event <ArrowUpRight className="w-4 h-4 ml-2" />
                 </Button>
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Action Button for Creating Event */}
      <div className="fixed bottom-24 right-4 z-40 md:absolute md:bottom-8 md:right-0">
        <button
          onClick={() => setShowCreateModal(true)}
          className="group relative flex items-center justify-center w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-lg shadow-purple-900/40 hover:scale-110 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300"
        >
          <Plus className="w-8 h-8 text-white" />
          <span className="absolute right-full mr-4 bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10 pointer-events-none">
            Create Event
          </span>
        </button>
      </div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <CreateEventModal 
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateEvent}
        />
      )}

      {/* Detail Modal Overlay */}
      {activeEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setSelectedEvent(null)} />
          <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-3xl relative z-10 shadow-2xl animate-fade-in overflow-hidden">
            <div className="relative h-32 bg-indigo-900/30">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
              <button 
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 p-2 bg-black/20 rounded-full text-white hover:bg-black/40 transition-colors z-20"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-6">
                <h2 className="text-2xl font-bold text-white">{activeEvent.title}</h2>
                <div className="text-slate-400 text-sm">{activeEvent.location} • {activeEvent.type}</div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              
              {/* Rewards Section (New) */}
              <div className="bg-gradient-to-r from-indigo-900/40 to-slate-900 border border-indigo-500/20 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  <h3 className="text-sm font-bold text-white">Victory Rewards</h3>
                </div>
                
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/50">
                    <span className="text-xs text-slate-300">Base Points</span>
                    <span className="text-sm font-bold text-amber-400">+{activeEvent.bonusPoints}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                    <div className="flex items-center gap-2">
                      <Zap className="w-3 h-3 text-green-400" />
                      <span className="text-xs font-semibold text-green-400">Winner Bonus</span>
                    </div>
                    <span className="text-sm font-bold text-green-400">+500</span>
                  </div>

                  {activeEvent.reward && (
                    <div className="flex items-center justify-between p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 mt-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-purple-300">Prize Pool</span>
                      </div>
                      <span className="text-sm font-bold text-purple-300">
                        {activeEvent.reward.tokenAmount} {activeEvent.reward.tokenSymbol}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" /> Expert Consensus
                </h3>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Wind Speed Range</span>
                      <span className="text-white">120 - 140 km/h</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden flex">
                      <div className="w-[20%] bg-transparent" />
                      <div className="w-[40%] bg-indigo-500/50" />
                      <div className="w-[40%] bg-transparent" />
                    </div>
                  </div>
                   <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Rainfall</span>
                      <span className="text-white">40 - 60 mm</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden flex">
                      <div className="w-[10%] bg-transparent" />
                      <div className="w-[60%] bg-blue-500/50" />
                      <div className="w-[30%] bg-transparent" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                <div className="flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-amber-400">High Risk Event</h4>
                    <p className="text-xs text-amber-200/70 mt-1">
                      Historical data suggests forecasts for this region are 20% harder to predict. Double check barometric pressure trends.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button fullWidth variant="secondary" onClick={() => setSelectedEvent(null)}>
                  Cancel
                </Button>
                <Button fullWidth variant="primary">
                  Submit Prediction
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};