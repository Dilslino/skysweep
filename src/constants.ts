import { Badge, FaqItem, LeaderboardEntry, Location, PredictionHistoryItem, StormEvent, User, WeatherCondition } from './types';
import { Cloud, CloudFog, CloudLightning, CloudRain, CloudSnow, Sun, Wind } from 'lucide-react';

export const APP_NAME = "SkySweep";

export const MOCK_USER: User = {
  id: 'u1',
  username: 'storm_chaser',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
  points: 12450,
  streak: 14,
  rank: 42,
  accuracy: 87.5,
  bestLocation: "New York, USA",
  badges: [
    { id: 'b1', name: 'Early Bird', icon: '🌅', description: 'Submitted 10 predictions before 8 AM', tier: 'bronze', unlockedAt: '2023-10-01' },
    { id: 'b2', name: 'Exact Match', icon: '🎯', description: 'Predicted temperature exactly correct', tier: 'gold', unlockedAt: '2023-10-15' },
    { id: 'b3', name: 'Storm Watcher', icon: '⚡', description: 'Participated in a StormWatch event', tier: 'silver', unlockedAt: '2023-11-02' },
  ]
};

export const MOCK_LOCATIONS: Location[] = [
  { id: 'nyc', name: 'New York', country: 'USA', lat: 40.7128, lng: -74.0060 },
  { id: 'ldn', name: 'London', country: 'UK', lat: 51.5074, lng: -0.1278 },
  { id: 'tok', name: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503 },
  { id: 'syd', name: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093 },
  { id: 'sgp', name: 'Singapore', country: 'SG', lat: 1.3521, lng: 103.8198 },
];

export const MOCK_HISTORY: PredictionHistoryItem[] = [
  { id: 'h1', date: 'Yesterday', location: 'New York, USA', predicted: { temp: 22, condition: WeatherCondition.CLOUDY }, actual: { temp: 21, condition: WeatherCondition.CLOUDY }, score: 95, status: 'scored' },
  { id: 'h2', date: '2 days ago', location: 'New York, USA', predicted: { temp: 25, condition: WeatherCondition.SUNNY }, actual: { temp: 23, condition: WeatherCondition.CLOUDY }, score: 60, status: 'scored' },
  { id: 'h3', date: '3 days ago', location: 'London, UK', predicted: { temp: 15, condition: WeatherCondition.RAINY }, actual: { temp: 14, condition: WeatherCondition.RAINY }, score: 100, status: 'scored' },
];

export const HOURLY_FORECAST_DATA = [
  { time: 'Now', temp: 23, icon: Sun },
  { time: '14:00', temp: 24, icon: Sun },
  { time: '15:00', temp: 24, icon: Cloud },
  { time: '16:00', temp: 23, icon: Cloud },
  { time: '17:00', temp: 22, icon: CloudRain },
  { time: '18:00', temp: 21, icon: CloudRain },
  { time: '19:00', temp: 20, icon: CloudLightning },
  { time: '20:00', temp: 19, icon: Cloud },
];

export const LEADERBOARD_DATA: LeaderboardEntry[] = [
  { id: '1', user: { ...MOCK_USER, username: 'weather_wizard', rank: 1, avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop' }, score: 2500, change: 0, accuracy: 94.2 },
  { id: '2', user: { ...MOCK_USER, username: 'cloud_ninja', rank: 2, avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' }, score: 2350, change: 1, accuracy: 91.5 },
  { id: '3', user: { ...MOCK_USER, username: 'rain_man', rank: 3, avatarUrl: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop' }, score: 2200, change: -1, accuracy: 89.8 },
  { id: '4', user: { ...MOCK_USER, username: 'sunny_d', rank: 4, avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop' }, score: 2100, change: 2, accuracy: 88.1 },
  { id: '5', user: { ...MOCK_USER, username: 'windy_city', rank: 5, avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' }, score: 1950, change: 0, accuracy: 86.4 },
];

export const STORM_EVENTS: StormEvent[] = [
  { id: 's1', title: 'Typhoon Koinu', location: 'Taipei, TW', type: 'Typhoon', severity: 4, endsIn: '12h 30m', bonusPoints: 500, participants: 1240 },
  { id: 's2', title: 'Nor\'easter', location: 'Boston, USA', type: 'Blizzard', severity: 5, endsIn: '04h 15m', bonusPoints: 1000, participants: 856 },
  { id: 's3', title: 'Sahara Heatwave', location: 'Cairo, EG', type: 'Heatwave', severity: 3, endsIn: '18h 00m', bonusPoints: 300, participants: 420 },
];

export const WEATHER_CONDITIONS = [
  { type: WeatherCondition.SUNNY, icon: Sun, color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20' },
  { type: WeatherCondition.CLOUDY, icon: Cloud, color: 'text-slate-400', bg: 'bg-slate-400/10', border: 'border-slate-400/20' },
  { type: WeatherCondition.RAINY, icon: CloudRain, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' },
  { type: WeatherCondition.STORMY, icon: CloudLightning, color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20' },
  { type: WeatherCondition.SNOWY, icon: CloudSnow, color: 'text-cyan-200', bg: 'bg-cyan-200/10', border: 'border-cyan-200/20' },
  { type: WeatherCondition.WINDY, icon: Wind, color: 'text-teal-300', bg: 'bg-teal-300/10', border: 'border-teal-300/20' },
  { type: WeatherCondition.FOGGY, icon: CloudFog, color: 'text-gray-400', bg: 'bg-gray-400/10', border: 'border-gray-400/20' },
];

export const ACCURACY_HISTORY = [
  { day: 'Mon', accuracy: 65, avg: 60 },
  { day: 'Tue', accuracy: 78, avg: 62 },
  { day: 'Wed', accuracy: 45, avg: 65 },
  { day: 'Thu', accuracy: 90, avg: 63 },
  { day: 'Fri', accuracy: 85, avg: 68 },
  { day: 'Sat', accuracy: 92, avg: 70 },
  { day: 'Sun', accuracy: 88, avg: 72 },
];

export const FAQS: FaqItem[] = [
  { id: '1', category: 'Gameplay', question: 'How are points calculated?', answer: 'Points are awarded based on precision. Temperature accuracy within 1°C earns 25pts. Exact condition matches earn 25pts. Wind speed accuracy can add up to 25pts.' },
  { id: '2', category: 'Gameplay', question: 'Can I change my location?', answer: 'Yes! You can predict for any available city in the location selector. You can predict for up to 3 locations per day.' },
  { id: '3', category: 'Account', question: 'What is a "Streak"?', answer: 'A Streak is the number of consecutive days you have submitted a prediction. Maintaining a streak gives you a point multiplier (up to 5x).' },
  { id: '4', category: 'Events', question: 'What is StormWatch?', answer: 'StormWatch events are special high-stakes challenges for extreme weather events globally. They offer double points and unique badges.' },
  { id: '5', category: 'Technical', question: 'When do predictions lock?', answer: 'Predictions lock at 11:59 PM local time for the selected location.' },
];
