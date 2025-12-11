export enum WeatherCondition {
  SUNNY = 'Sunny',
  CLOUDY = 'Cloudy',
  RAINY = 'Rainy',
  STORMY = 'Stormy',
  SNOWY = 'Snowy',
  WINDY = 'Windy',
  FOGGY = 'Foggy'
}

export interface User {
  id: string;
  fid: number;
  username: string;
  avatar_url: string;
  display_name: string;
  points: number;
  streak: number;
  rank: number;
  accuracy: number;
  best_location: string | null;
  primary_address: string | null;
  created_at: string;
  updated_at: string;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  requirement_type: string;
  requirement_value: number;
  created_at: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  unlocked_at: string;
}

export interface Prediction {
  id: string;
  user_id: string;
  location_name: string;
  location_lat: number;
  location_lng: number;
  location_country: string;
  predicted_temp: number;
  predicted_condition: WeatherCondition;
  prediction_date: string;
  target_date: string;
  actual_temp: number | null;
  actual_condition: WeatherCondition | null;
  score: number | null;
  status: 'pending' | 'scored';
  created_at: string;
  scored_at: string | null;
}

export interface LeaderboardEntry {
  fid: number;
  username: string;
  avatar_url: string;
  points: number;
  accuracy: number;
  streak: number;
  rank: number;
  change: number;
}

export interface WeatherData {
  location: {
    name: string;
    country: string;
    lat: number;
    lon: number;
  };
  current: {
    temp_c: number;
    temp_f: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    humidity: number;
    wind_kph: number;
    wind_mph: number;
  };
  forecast?: {
    forecastday: Array<{
      date: string;
      day: {
        maxtemp_c: number;
        mintemp_c: number;
        avgtemp_c: number;
        condition: {
          text: string;
          icon: string;
          code: number;
        };
      };
    }>;
  };
}
