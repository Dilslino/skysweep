export enum WeatherCondition {
  SUNNY = 'Sunny',
  CLOUDY = 'Cloudy',
  RAINY = 'Rainy',
  STORMY = 'Stormy',
  SNOWY = 'Snowy',
  WINDY = 'Windy',
  FOGGY = 'Foggy'
}

export interface Location {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
}

export interface User {
  id: string;
  username: string;
  avatarUrl: string;
  points: number;
  streak: number;
  rank: number;
  badges: Badge[];
  accuracy: number;
  bestLocation: string;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  unlockedAt?: string;
}

export interface LeaderboardEntry {
  id: string;
  user: User;
  score: number;
  change: number;
  accuracy: number;
}

export interface PredictionHistoryItem {
  id: string;
  date: string;
  location: string;
  predicted: {
    temp: number;
    condition: WeatherCondition;
  };
  actual?: {
    temp: number;
    condition: WeatherCondition;
  };
  score?: number;
  status: 'pending' | 'scored';
}

export interface StormEvent {
  id: string;
  title: string;
  location: string;
  type: 'Hurricane' | 'Blizzard' | 'Heatwave' | 'Typhoon' | 'Tornado' | 'Flood' | 'Wildfire' | 'Other';
  severity: 1 | 2 | 3 | 4 | 5;
  endsIn: string;
  bonusPoints: number;
  participants: number;
  reward?: {
    tokenSymbol: string;
    tokenAmount: number;
    usdValue: number;
  };
}

export interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export interface TokenInfo {
  address: string;
  name: string;
  symbol: string;
  priceUsd: string;
  logoURI?: string;
}

export interface CreateEventFormData {
  // Step 1: Basic Info
  title: string;
  location: string;
  type: StormEvent['type'];
  severity: number;
  description: string;
  
  // Step 2: Prediction Settings
  parameters: string[];
  startDate: string;
  endDate: string;
  deadlineType: string;
  
  // Step 3: Rewards
  rewardType: 'fixed' | 'pool' | 'custom';
  selectedToken: TokenInfo | null;
  tokenAmount: string;
}
