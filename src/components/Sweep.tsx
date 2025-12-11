import React, { useState, useEffect } from 'react';
import { WEATHER_CONDITIONS, MOCK_LOCATIONS, HOURLY_FORECAST_DATA } from '../constants';
import { WeatherCondition, Location } from '../types';
import { Button } from './Button';
import { Card } from './Card';
import { Slider } from './Input';
import { 
  Wind, Thermometer, MapPin, Clock, ArrowRight, Droplets, CloudRain, 
  Search, ChevronDown, CheckCircle2, Flame, Star, Target, Gauge,
  Sun, Cloud
} from 'lucide-react';
import { AuthUser } from '../hooks/useAuth';
import { usePredictions } from '../hooks/usePredictions';
import { useWeather } from '../hooks/useWeather';

interface SweepProps {
  user: AuthUser | null;
}

export const Sweep: React.FC<SweepProps> = ({ user }) => {
  // State
  const [selectedLocation, setSelectedLocation] = useState<Location>(MOCK_LOCATIONS[0]);
  const [showLocationSelect, setShowLocationSelect] = useState(false);
  const [isExpandingPrediction, setIsExpandingPrediction] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Location[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Prediction Inputs
  const [selectedCondition, setSelectedCondition] = useState<WeatherCondition | null>(null);
  const [temperature, setTemperature] = useState<number>(23);
  const [windSpeed, setWindSpeed] = useState<number>(12);
  const [timeLeft, setTimeLeft] = useState('');

  // Hooks
  const { createPrediction, refreshPredictions } = usePredictions();
  const { weather, loading: weatherLoading } = useWeather(selectedLocation.name);

  // Search locations
  useEffect(() => {
    const searchLocations = async () => {
      if (!searchQuery || searchQuery.length < 2) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const WEATHER_API_KEY = 'af5c0bc3529e4ed2955165603251112';
        const response = await fetch(
          `https://api.weatherapi.com/v1/search.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(searchQuery)}`
        );
        
        if (response.ok) {
          const data = await response.json();
          const locations: Location[] = data.map((item: any, index: number) => ({
            id: `search-${index}`,
            name: item.name,
            country: item.country,
            lat: item.lat,
            lng: item.lon,
          }));
          setSearchResults(locations);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(searchLocations, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  // Countdown timer
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      const diff = endOfDay.getTime() - now.getTime();
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      setTimeLeft(`${hours}h ${minutes}m`);
    };
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000);
    return () => clearInterval(timer);
  }, []);

  // Check if user already made prediction today
  useEffect(() => {
    const checkTodayPrediction = async () => {
      const today = new Date().toISOString().split('T')[0];
      // You can check predictions here if needed
      // For now, reset submitted state on mount
      setIsSubmitted(false);
    };
    checkTodayPrediction();
  }, []);

  const handleSubmit = async () => {
    if (!selectedCondition || !user) return;
    
    setIsSubmitting(true);
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const targetDate = tomorrow.toISOString().split('T')[0];

      await createPrediction({
        locationName: selectedLocation.name,
        locationLat: selectedLocation.lat,
        locationLng: selectedLocation.lng,
        locationCountry: selectedLocation.country,
        predictedTemp: temperature,
        predictedCondition: selectedCondition,
        targetDate,
      });

      setIsSubmitted(true);
      setIsExpandingPrediction(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      await refreshPredictions();
    } catch (error) {
      console.error('Error submitting prediction:', error);
      alert('Failed to submit prediction. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get current weather data
  console.log('🔍 Current weather object:', weather);
  const currentTemp = weather?.current?.temp_c || 23;
  const currentCondition = weather?.current?.condition?.text || 'Clear';
  const feelsLike = weather?.current?.feelslike_c || currentTemp + 2;
  const humidity = weather?.current?.humidity || 65;
  const currentWind = weather?.current?.wind_kph || 12;
  const pressure = weather?.current?.pressure_mb || 1012;
  console.log('📊 Display values - Temp:', currentTemp, 'Humidity:', humidity, 'Wind:', currentWind);

  // Get hourly forecast
  const hourlyData = weather?.forecast?.forecastday[0]?.hour || [];
  const currentHour = new Date().getHours();
  const nextHours = hourlyData.slice(currentHour, currentHour + 8);

  return (
    <div className="space-y-6 pb-24">
      
      {/* 1. Header & Location Selector */}
      <header className="flex items-center justify-between">
        <div className="relative z-30">
          <button 
            onClick={() => setShowLocationSelect(!showLocationSelect)}
            className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity"
          >
            <div className="p-2 bg-slate-800 rounded-full text-indigo-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Location</p>
              <div className="flex items-center gap-1 font-bold text-lg">
                {selectedLocation.name}
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${showLocationSelect ? 'rotate-180' : ''}`} />
              </div>
            </div>
          </button>

          {/* Dropdown */}
          {showLocationSelect && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden animate-fade-in">
              <div className="p-3 border-b border-slate-800">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input 
                    type="text" 
                    placeholder="Search city..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-950 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500" 
                  />
                </div>
              </div>
              <div className="max-h-48 overflow-y-auto">
                {isSearching && (
                  <div className="p-4 text-center text-slate-500 text-sm">
                    Searching...
                  </div>
                )}
                {!isSearching && searchQuery && searchResults.length === 0 && (
                  <div className="p-4 text-center text-slate-500 text-sm">
                    No results found
                  </div>
                )}
                {(searchQuery ? searchResults : MOCK_LOCATIONS).map(loc => (
                  <button
                    key={loc.id}
                    onClick={() => {
                      setSelectedLocation(loc);
                      setShowLocationSelect(false);
                      setSearchQuery('');
                    }}
                    className={`w-full flex items-center justify-between p-3 text-sm hover:bg-slate-800 ${selectedLocation.id === loc.id ? 'text-indigo-400 bg-slate-800/50' : 'text-slate-300'}`}
                  >
                    <span>{loc.name}, {loc.country}</span>
                    {selectedLocation.id === loc.id && <CheckCircle2 className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {user && (
            <>
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-white">{user.username}</p>
                <p className="text-xs text-indigo-400">Rank #{user.rank}</p>
              </div>
              <img 
                src={user.avatarUrl} 
                alt="Profile" 
                className="w-10 h-10 rounded-full border-2 border-slate-700"
              />
            </>
          )}
        </div>
      </header>

      {/* 2. Current Weather Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-500 to-cyan-600 shadow-xl shadow-cyan-900/20 group">
        
        {/* Animated Weather Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-yellow-300/20 rounded-full blur-3xl animate-pulse" />
          <Sun className="absolute top-8 right-8 w-32 h-32 text-yellow-100/20 animate-spin-slow" />
          
          <div className="absolute top-1/3 left-1/4 w-8 h-8 rounded-full bg-white/10 blur-xl animate-float" style={{ animationDelay: '0s' }} />
          <div className="absolute top-2/3 right-1/4 w-12 h-12 rounded-full bg-white/10 blur-xl animate-float" style={{ animationDelay: '2s' }} />
          
          <Cloud className="absolute top-20 left-10 w-16 h-16 text-white/10 animate-float" style={{ animationDelay: '1s', animationDuration: '8s' }} />
        </div>

        <div className="absolute top-0 right-0 p-4 z-20">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-xs font-bold text-white animate-pulse">
            <span className="w-2 h-2 rounded-full bg-green-400" /> LIVE
          </span>
        </div>

        <div className="relative p-6 sm:p-8 text-white z-10">
          {weatherLoading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-bold tracking-tighter drop-shadow-sm">{Math.round(currentTemp)}°</span>
                  <span className="text-2xl opacity-90 font-medium">{currentCondition}</span>
                </div>
                <p className="text-sky-100 mt-1 font-medium">
                  Feels like {Math.round(feelsLike)}° • {selectedLocation.name}
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 min-w-[140px] shadow-lg">
                 <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/10">
                   <span className="text-xs text-sky-100 flex items-center gap-1"><Droplets className="w-3 h-3" /> Humidity</span>
                   <span className="font-bold">{humidity}%</span>
                 </div>
                 <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/10">
                   <span className="text-xs text-sky-100 flex items-center gap-1"><Wind className="w-3 h-3" /> Wind</span>
                   <span className="font-bold">{Math.round(currentWind)}km</span>
                 </div>
                 <div className="flex items-center justify-between">
                   <span className="text-xs text-sky-100 flex items-center gap-1"><Gauge className="w-3 h-3" /> Pressure</span>
                   <span className="font-bold">{pressure}</span>
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. User Stats Bar */}
      {user && (
        <div className="grid grid-cols-3 gap-3">
          <Card padding="sm" className="bg-slate-800/30 border-slate-700/50">
            <div className="flex flex-col items-center justify-center text-center">
              <Flame className="w-5 h-5 text-orange-500 mb-1" />
              <span className="text-lg font-bold text-white">{user.streak}</span>
              <span className="text-[10px] text-slate-500 uppercase font-bold">Streak</span>
            </div>
          </Card>
          <Card padding="sm" className="bg-slate-800/30 border-slate-700/50">
            <div className="flex flex-col items-center justify-center text-center">
              <Star className="w-5 h-5 text-yellow-500 mb-1" />
              <span className="text-lg font-bold text-white">{(user.points / 1000).toFixed(1)}k</span>
              <span className="text-[10px] text-slate-500 uppercase font-bold">Points</span>
            </div>
          </Card>
          <Card padding="sm" className="bg-slate-800/30 border-slate-700/50">
            <div className="flex flex-col items-center justify-center text-center">
              <Target className="w-5 h-5 text-green-500 mb-1" />
              <span className="text-lg font-bold text-white">{user.accuracy.toFixed(1)}%</span>
              <span className="text-[10px] text-slate-500 uppercase font-bold">Accuracy</span>
            </div>
          </Card>
        </div>
      )}

      {/* 4. Prediction Status / Action Card */}
      {!isSubmitted ? (
        <Card className={`relative overflow-hidden transition-all duration-500 ${isExpandingPrediction ? 'ring-2 ring-indigo-500 bg-slate-800' : 'bg-slate-900'}`}>
          {!isExpandingPrediction ? (
            // Collapsed State: CTA
            <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsExpandingPrediction(true)}>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Daily Prediction</h3>
                <div className="flex items-center gap-2 text-indigo-400 text-sm font-medium">
                  <Clock className="w-4 h-4" />
                  <span>Closes in {timeLeft}</span>
                </div>
              </div>
              <button className="bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-xl transition-colors shadow-lg shadow-indigo-900/40">
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          ) : (
            // Expanded State: Form
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <h3 className="text-lg font-bold text-white">Make Prediction</h3>
                <button 
                  onClick={() => setIsExpandingPrediction(false)}
                  className="text-slate-400 text-sm hover:text-white"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
              </div>

              {/* Conditions */}
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 block">Condition</label>
                <div className="grid grid-cols-4 gap-2">
                  {WEATHER_CONDITIONS.slice(0, 4).map((cond) => {
                    const Icon = cond.icon;
                    const isSelected = selectedCondition === cond.type;
                    return (
                      <button
                        key={cond.type}
                        onClick={() => setSelectedCondition(cond.type)}
                        disabled={isSubmitting}
                        className={`flex flex-col items-center p-2 rounded-xl border transition-all disabled:opacity-50 ${
                          isSelected ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                        }`}
                      >
                        <Icon className="w-6 h-6 mb-1" />
                        <span className="text-[10px] font-medium truncate w-full text-center">{cond.type}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sliders */}
              <div className="space-y-6">
                <Slider
                  label="Temperature"
                  value={temperature}
                  min={-10}
                  max={40}
                  unit="°C"
                  icon={<Thermometer className="w-4 h-4 text-red-400" />}
                  onChange={setTemperature}
                  disabled={isSubmitting}
                />
                <Slider
                  label="Wind Speed"
                  value={windSpeed}
                  min={0}
                  max={100}
                  unit="km/h"
                  icon={<Wind className="w-4 h-4 text-teal-400" />}
                  onChange={setWindSpeed}
                  disabled={isSubmitting}
                />
              </div>

              <Button 
                fullWidth 
                size="lg" 
                onClick={handleSubmit}
                disabled={!selectedCondition || isSubmitting}
                className="mt-4"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Forecast'}
              </Button>
            </div>
          )}
        </Card>
      ) : (
        // Submitted State: Summary
        <Card className="bg-gradient-to-r from-slate-900 to-slate-800 border-green-500/30">
          <div className="flex items-start justify-between">
            <div>
               <div className="flex items-center gap-2 mb-1">
                 <CheckCircle2 className="w-5 h-5 text-green-400" />
                 <h3 className="text-lg font-bold text-white">Forecast Locked</h3>
               </div>
               <p className="text-sm text-slate-400">Results available in {timeLeft}</p>
            </div>
            <div className="text-right">
              <span className="block text-2xl font-bold text-amber-400">100</span>
              <span className="text-[10px] text-amber-400/70 uppercase font-bold">Potential Pts</span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div className="bg-slate-950/50 rounded-lg p-2">
              <span className="text-[10px] text-slate-500 block">Temp</span>
              <span className="text-sm font-bold text-white">{temperature}°C</span>
            </div>
            <div className="bg-slate-950/50 rounded-lg p-2">
              <span className="text-[10px] text-slate-500 block">Wind</span>
              <span className="text-sm font-bold text-white">{windSpeed}km</span>
            </div>
            <div className="bg-slate-950/50 rounded-lg p-2">
              <span className="text-[10px] text-slate-500 block">Cond</span>
              <span className="text-sm font-bold text-white truncate">{selectedCondition}</span>
            </div>
          </div>
          <Button variant="secondary" size="sm" fullWidth className="mt-4" onClick={() => setIsSubmitted(false)}>
            View Predictions
          </Button>
        </Card>
      )}

      {/* 5. Hourly Forecast */}
      {nextHours.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-4 px-1">
            <h3 className="font-semibold text-white">Hourly Forecast</h3>
            <span className="text-xs text-indigo-400">Next 24h</span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide snap-x">
            {nextHours.map((hour, i) => {
              const time = new Date(hour.time).getHours();
              const Icon = Sun; // You can map condition code to icon
              return (
                <div 
                  key={i} 
                  className={`
                    flex flex-col items-center justify-center min-w-[70px] p-3 rounded-2xl border snap-center
                    ${i === 0 ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-900/40' : 'bg-slate-800/50 border-slate-700/50 text-slate-300'}
                  `}
                >
                  <span className="text-xs font-medium mb-2">{time}:00</span>
                  <Icon className={`w-6 h-6 mb-2 ${i === 0 ? 'text-white' : 'text-slate-400'}`} />
                  <span className="text-sm font-bold">{Math.round(hour.temp_c)}°</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
