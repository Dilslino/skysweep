import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Search, Check, AlertCircle, Calendar, DollarSign, Wallet, Zap, Sun, CloudRain, CloudLightning, Cloud } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';
import { SearchInput, Slider } from './Input';
import { CreateEventFormData, TokenInfo } from '../types';

interface CreateEventModalProps {
  onClose: () => void;
  onSubmit: (data: CreateEventFormData) => void;
}

const INITIAL_DATA: CreateEventFormData = {
  title: '',
  location: '',
  type: 'Hurricane',
  severity: 3,
  description: '',
  parameters: ['temperature', 'wind_speed'],
  startDate: '',
  endDate: '',
  deadlineType: '1 hour before',
  rewardType: 'fixed',
  selectedToken: null,
  tokenAmount: ''
};

export const CreateEventModal: React.FC<CreateEventModalProps> = ({ onClose, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<CreateEventFormData>(INITIAL_DATA);
  const [tokenSearchQuery, setTokenSearchQuery] = useState('');
  const [tokenSearchResults, setTokenSearchResults] = useState<TokenInfo[]>([]);
  const [isSearchingToken, setIsSearchingToken] = useState(false);
  const [previewPrice, setPreviewPrice] = useState<number>(0);

  const steps = ['Basic Info', 'Settings', 'Rewards', 'Review'];

  // DexScreener Integration
  useEffect(() => {
    const searchTokens = async () => {
      if (!tokenSearchQuery || tokenSearchQuery.length < 2) {
        setTokenSearchResults([]);
        return;
      }

      setIsSearchingToken(true);
      try {
        const response = await fetch(`https://api.dexscreener.com/latest/dex/search?q=${tokenSearchQuery}`);
        const data = await response.json();
        
        // Filter and map relevant pairs to unique tokens
        if (data.pairs) {
          const uniqueTokens = new Map();
          data.pairs.forEach((pair: any) => {
            if (pair.baseToken && !uniqueTokens.has(pair.baseToken.address)) {
              uniqueTokens.set(pair.baseToken.address, {
                address: pair.baseToken.address,
                name: pair.baseToken.name,
                symbol: pair.baseToken.symbol,
                priceUsd: pair.priceUsd
              });
            }
          });
          setTokenSearchResults(Array.from(uniqueTokens.values()).slice(0, 5));
        }
      } catch (error) {
        console.error('Failed to fetch tokens', error);
      } finally {
        setIsSearchingToken(false);
      }
    };

    const timeoutId = setTimeout(searchTokens, 500);
    return () => clearTimeout(timeoutId);
  }, [tokenSearchQuery]);

  const updateField = (field: keyof CreateEventFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleParameter = (param: string) => {
    const current = formData.parameters;
    if (current.includes(param)) {
      updateField('parameters', current.filter(p => p !== param));
    } else {
      updateField('parameters', [...current, param]);
    }
  };

  const renderWeatherEffects = (type: string) => {
    // Sun Animation (Matahari)
    if (['Heatwave', 'Wildfire', 'Other'].includes(type)) {
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-40px] right-[-40px] w-48 h-48 bg-orange-500/20 rounded-full blur-3xl animate-pulse" />
          <Sun className="absolute top-6 right-6 w-20 h-20 text-orange-400/30 animate-[spin_12s_linear_infinite]" />
          <div className="absolute top-1/4 right-1/4 w-4 h-4 bg-yellow-400/20 rounded-full blur-md animate-float" />
        </div>
      );
    }

    // Rain Animation (Hujan)
    if (['Flood', 'Rain', 'Monsoon'].includes(type)) {
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-blue-900/10" />
          {/* Rain drops */}
          {[...Array(6)].map((_, i) => (
             <div 
               key={i}
               className="absolute w-0.5 h-6 bg-blue-400/40 rounded-full animate-rain"
               style={{ 
                 left: `${10 + Math.random() * 80}%`, 
                 top: `-${Math.random() * 20}%`,
                 animationDelay: `${Math.random()}s`,
                 animationDuration: `${0.8 + Math.random() * 0.5}s`
               }}
             />
          ))}
          <CloudRain className="absolute top-6 right-6 w-20 h-20 text-blue-300/30 animate-float" />
        </div>
      );
    }

    // Storm/Lightning Animation (Berawan Petir)
    // Default for Hurricane, Typhoon, Tornado, Blizzard, etc.
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-slate-900/30" />
        <div className="absolute inset-0 bg-white/5 animate-flash z-0" /> {/* Lightning Flash */}
        
        <CloudLightning className="absolute top-6 right-6 w-20 h-20 text-yellow-400/30 animate-pulse z-10" />
        <Cloud className="absolute top-12 right-20 w-16 h-16 text-slate-400/20 animate-float z-0" style={{ animationDelay: '1s' }} />
        
        {/* Storm Rain */}
        {[...Array(4)].map((_, i) => (
             <div 
               key={i}
               className="absolute w-0.5 h-8 bg-slate-300/30 rounded-full animate-rain origin-top -rotate-12"
               style={{ 
                 left: `${30 + Math.random() * 60}%`, 
                 animationDelay: `${Math.random()}s`
               }}
             />
          ))}
      </div>
    );
  };

  const renderStep1 = () => (
    <div className="space-y-4 animate-fade-in">
      <div>
        <label className="block text-sm font-medium text-slate-400 mb-1">Event Name</label>
        <input 
          type="text"
          value={formData.title}
          onChange={(e) => updateField('title', e.target.value)}
          placeholder="e.g., Hurricane Alert 2024"
          className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-400 mb-1">Location</label>
        <div className="relative">
          <input 
            type="text"
            value={formData.location}
            onChange={(e) => updateField('location', e.target.value)}
            placeholder="Search city..."
            className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Type</label>
          <select 
            value={formData.type}
            onChange={(e) => updateField('type', e.target.value)}
            className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 appearance-none"
          >
            {['Hurricane', 'Typhoon', 'Blizzard', 'Heatwave', 'Tornado', 'Flood', 'Wildfire', 'Other'].map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
           <label className="block text-sm font-medium text-slate-400 mb-1">Severity (1-5)</label>
           <div className="h-[46px] flex items-center px-2">
             <input 
               type="range" 
               min="1" 
               max="5" 
               value={formData.severity}
               onChange={(e) => updateField('severity', parseInt(e.target.value))}
               className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
             />
             <span className="ml-3 font-mono font-bold text-indigo-400">{formData.severity}</span>
           </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
        <textarea 
          value={formData.description}
          onChange={(e) => updateField('description', e.target.value)}
          placeholder="Describe the event rules..."
          className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 min-h-[100px]"
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6 animate-fade-in">
      <div>
        <label className="block text-sm font-medium text-slate-400 mb-3">Prediction Parameters</label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: 'temperature', label: 'Temperature' },
            { id: 'wind_speed', label: 'Wind Speed' },
            { id: 'rainfall', label: 'Rainfall' },
            { id: 'pressure', label: 'Pressure' },
            { id: 'humidity', label: 'Humidity' },
            { id: 'snowfall', label: 'Snowfall' }
          ].map((param) => (
            <div 
              key={param.id}
              onClick={() => toggleParameter(param.id)}
              className={`
                flex items-center p-3 rounded-xl border cursor-pointer transition-all
                ${formData.parameters.includes(param.id) 
                  ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-200' 
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'}
              `}
            >
              <div className={`
                w-5 h-5 rounded-md border flex items-center justify-center mr-3
                ${formData.parameters.includes(param.id) ? 'bg-indigo-500 border-indigo-500' : 'border-slate-600'}
              `}>
                {formData.parameters.includes(param.id) && <Check className="w-3 h-3 text-white" />}
              </div>
              <span className="text-sm font-medium">{param.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Start Time</label>
          <div className="relative">
            <input 
              type="datetime-local"
              value={formData.startDate}
              onChange={(e) => updateField('startDate', e.target.value)}
              className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">End Time</label>
          <div className="relative">
            <input 
              type="datetime-local"
              value={formData.endDate}
              onChange={(e) => updateField('endDate', e.target.value)}
              className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
            />
             <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-400 mb-1">Prediction Deadline</label>
        <select 
          value={formData.deadlineType}
          onChange={(e) => updateField('deadlineType', e.target.value)}
          className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
        >
          <option>1 hour before event</option>
          <option>3 hours before event</option>
          <option>6 hours before event</option>
          <option>12 hours before event</option>
          <option>24 hours before event</option>
        </select>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-700">
        {[
          { id: 'fixed', label: 'Fixed Amount' },
          { id: 'pool', label: 'Prize Pool' },
          { id: 'custom', label: 'Custom Token' }
        ].map(type => (
          <button
            key={type.id}
            onClick={() => updateField('rewardType', type.id)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              formData.rewardType === type.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Select Token</label>
          <div className="relative">
             <input 
              type="text"
              value={tokenSearchQuery}
              onChange={(e) => setTokenSearchQuery(e.target.value)}
              placeholder="Search by name or address (e.g. USDC, 0x...)"
              className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
            />
            {isSearchingToken ? (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-slate-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            )}
            
            {tokenSearchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-xl z-20 max-h-60 overflow-y-auto">
                {tokenSearchResults.map(token => (
                  <button
                    key={token.address}
                    onClick={() => {
                      updateField('selectedToken', token);
                      setTokenSearchQuery(token.symbol);
                      setTokenSearchResults([]);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-slate-800 border-b border-slate-800 last:border-0 flex justify-between items-center"
                  >
                    <div>
                      <span className="font-bold text-white">{token.symbol}</span>
                      <span className="text-slate-400 text-sm ml-2">{token.name}</span>
                    </div>
                    <span className="text-green-400 text-sm font-mono">${parseFloat(token.priceUsd).toFixed(4)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {formData.selectedToken && (
          <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white">
                {formData.selectedToken.symbol[0]}
              </div>
              <div>
                <div className="font-bold text-white">{formData.selectedToken.symbol}</div>
                <div className="text-xs text-indigo-300">on Ethereum</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-400">Current Price</div>
              <div className="font-mono text-white">${parseFloat(formData.selectedToken.priceUsd).toFixed(4)}</div>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Reward Amount</label>
          <div className="relative">
            <input 
              type="number"
              value={formData.tokenAmount}
              onChange={(e) => updateField('tokenAmount', e.target.value)}
              placeholder="0.00"
              className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">
              {formData.selectedToken?.symbol || 'TOKENS'}
            </div>
          </div>
          {formData.selectedToken && formData.tokenAmount && (
            <div className="mt-2 text-sm text-green-400 flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              Est. Value: ${(parseFloat(formData.tokenAmount) * parseFloat(formData.selectedToken.priceUsd)).toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-br from-indigo-900/50 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 relative overflow-hidden">
        {/* Dynamic Weather Animations */}
        {renderWeatherEffects(formData.type)}
        
        <div className="absolute top-0 right-0 p-3 bg-indigo-500/20 rounded-bl-xl border-b border-l border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase z-20 backdrop-blur-sm">
          Preview
        </div>
        
        <div className="relative z-10">
          <h3 className="text-2xl font-bold text-white mb-2">{formData.title || 'Untitled Event'}</h3>
          <div className="flex items-center gap-4 text-sm text-slate-300 mb-6">
            <span className="flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {formData.type}</span>
            <span className="w-1 h-1 bg-slate-600 rounded-full" />
            <span>Severity {formData.severity}</span>
            <span className="w-1 h-1 bg-slate-600 rounded-full" />
            <span>{formData.location || 'Unknown Location'}</span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-950/60 backdrop-blur-sm rounded-xl p-3 border border-white/5">
              <div className="text-xs text-slate-500 mb-1">Reward Pool</div>
              <div className="font-bold text-xl text-green-400">
                 {formData.tokenAmount || '0'} {formData.selectedToken?.symbol}
              </div>
              {formData.selectedToken && (
                 <div className="text-xs text-slate-400">
                   ≈ ${(parseFloat(formData.tokenAmount || '0') * parseFloat(formData.selectedToken.priceUsd)).toFixed(2)}
                 </div>
              )}
               <div className="text-xs text-indigo-400 mt-2 flex items-center gap-1 border-t border-slate-800 pt-1">
                 <Zap className="w-3 h-3" /> +500 Pts Bonus included
               </div>
            </div>
            <div className="bg-slate-950/60 backdrop-blur-sm rounded-xl p-3 border border-white/5">
               <div className="text-xs text-slate-500 mb-1">Deadline</div>
               <div className="font-medium text-white">{formData.deadlineType}</div>
            </div>
          </div>

          <div className="text-sm text-slate-300 line-clamp-3 bg-slate-950/30 p-3 rounded-lg backdrop-blur-sm border border-white/5">
            {formData.description || 'No description provided.'}
          </div>
        </div>
      </div>

      <div className="flex items-start gap-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
        <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-slate-300">
          <span className="font-bold text-yellow-500 block mb-1">Wallet Connection Required</span>
          To create this event, you will need to sign a transaction to approve the reward tokens. Ensure your wallet is connected on the next step.
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-3xl relative z-10 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">Create Storm Event</h2>
            <div className="text-sm text-slate-500 mt-1">Step {step} of {steps.length}: {steps[step-1]}</div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-1">
          <div 
            className="h-full bg-indigo-500 transition-all duration-300"
            style={{ width: `${(step / steps.length) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 flex justify-between gap-4 bg-slate-900 rounded-b-3xl">
          <Button 
            variant="ghost" 
            onClick={() => step > 1 ? setStep(step - 1) : onClose()}
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </Button>
          
          <Button 
            variant="primary"
            onClick={() => step < 4 ? setStep(step + 1) : onSubmit(formData)}
            className="min-w-[120px]"
          >
            {step === 4 ? (
              <span className="flex items-center gap-2"><Wallet className="w-4 h-4" /> Create</span>
            ) : (
              <span className="flex items-center gap-2">Next <ChevronRight className="w-4 h-4" /></span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};