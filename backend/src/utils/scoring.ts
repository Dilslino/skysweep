import { WeatherCondition } from '../types/index.js';

export const POINTS_CONFIG = {
  PERFECT_TEMP: 50,
  TEMP_DIFF_1: 45,
  TEMP_DIFF_2: 40,
  TEMP_DIFF_3: 35,
  TEMP_DIFF_5: 25,
  TEMP_DIFF_7: 15,
  TEMP_DIFF_10: 5,
  
  EXACT_CONDITION: 50,
  SIMILAR_CONDITION: 25,
};

export const BADGE_ICONS: Record<string, string> = {
  'First Forecast': '🌤️',
  'Weather Watcher': '👀',
  'Storm Chaser': '⛈️',
  'Climate Expert': '🌍',
  'Weather Master': '🏆',
  'Point Collector': '⭐',
  'Point Hoarder': '💰',
  'Point Legend': '👑',
  'Streak Starter': '🔥',
  'Streak Builder': '⚡',
  'Streak Master': '💫',
  'Accuracy Pro': '🎯',
  'Accuracy Legend': '🏅',
  'Perfect Predictor': '💎',
};

export const WEATHER_CONDITION_GROUPS: Record<WeatherCondition, WeatherCondition[]> = {
  [WeatherCondition.RAINY]: [WeatherCondition.STORMY, WeatherCondition.CLOUDY],
  [WeatherCondition.STORMY]: [WeatherCondition.RAINY, WeatherCondition.WINDY],
  [WeatherCondition.CLOUDY]: [WeatherCondition.RAINY, WeatherCondition.FOGGY, WeatherCondition.SUNNY],
  [WeatherCondition.SUNNY]: [WeatherCondition.CLOUDY],
  [WeatherCondition.SNOWY]: [WeatherCondition.CLOUDY, WeatherCondition.FOGGY],
  [WeatherCondition.WINDY]: [WeatherCondition.STORMY, WeatherCondition.CLOUDY],
  [WeatherCondition.FOGGY]: [WeatherCondition.CLOUDY],
};

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function calculateDaysDifference(date1: Date, date2: Date): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);
  
  return Math.floor((d1.getTime() - d2.getTime()) / (1000 * 60 * 60 * 24));
}

export function isToday(date: Date): boolean {
  const today = new Date();
  return formatDate(date) === formatDate(today);
}

export function isFutureDate(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);
  
  return targetDate > today;
}
