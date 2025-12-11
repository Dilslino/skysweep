import axios from 'axios';
import { env } from '../config/env.js';
import { WeatherCondition, WeatherData } from '../types/index.js';

const WEATHER_API_BASE_URL = 'https://api.weatherapi.com/v1';

export class WeatherService {
  private apiKey: string;

  constructor() {
    this.apiKey = env.weather.apiKey;
  }

  private mapConditionToEnum(conditionText: string, conditionCode: number): WeatherCondition {
    const text = conditionText.toLowerCase();
    
    if (conditionCode >= 1273 || text.includes('thunder') || text.includes('storm')) {
      return WeatherCondition.STORMY;
    }
    
    if (conditionCode >= 1210 && conditionCode <= 1264) {
      return WeatherCondition.SNOWY;
    }
    
    if (conditionCode >= 1180 && conditionCode <= 1201) {
      return WeatherCondition.RAINY;
    }
    
    if (text.includes('fog') || text.includes('mist')) {
      return WeatherCondition.FOGGY;
    }
    
    if (text.includes('wind') || conditionCode === 1087) {
      return WeatherCondition.WINDY;
    }
    
    if (text.includes('cloud') || text.includes('overcast')) {
      return WeatherCondition.CLOUDY;
    }
    
    return WeatherCondition.SUNNY;
  }

  async getCurrentWeather(location: string): Promise<WeatherData> {
    try {
      const response = await axios.get(`${WEATHER_API_BASE_URL}/current.json`, {
        params: {
          key: this.apiKey,
          q: location,
          aqi: 'no',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching current weather:', error);
      throw new Error('Failed to fetch weather data');
    }
  }

  async getForecast(location: string, days: number = 7): Promise<WeatherData> {
    try {
      const response = await axios.get(`${WEATHER_API_BASE_URL}/forecast.json`, {
        params: {
          key: this.apiKey,
          q: location,
          days: Math.min(days, 10),
          aqi: 'no',
          alerts: 'no',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching forecast:', error);
      throw new Error('Failed to fetch forecast data');
    }
  }

  async getHistoricalWeather(location: string, date: string): Promise<WeatherData> {
    try {
      const response = await axios.get(`${WEATHER_API_BASE_URL}/history.json`, {
        params: {
          key: this.apiKey,
          q: location,
          dt: date,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching historical weather:', error);
      throw new Error('Failed to fetch historical weather data');
    }
  }

  async searchLocations(query: string) {
    try {
      const response = await axios.get(`${WEATHER_API_BASE_URL}/search.json`, {
        params: {
          key: this.apiKey,
          q: query,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error searching locations:', error);
      throw new Error('Failed to search locations');
    }
  }

  calculatePredictionScore(
    predictedTemp: number,
    actualTemp: number,
    predictedCondition: WeatherCondition,
    actualCondition: WeatherCondition
  ): number {
    let score = 0;
    
    const tempDiff = Math.abs(predictedTemp - actualTemp);
    if (tempDiff === 0) {
      score += 50;
    } else if (tempDiff <= 1) {
      score += 45;
    } else if (tempDiff <= 2) {
      score += 40;
    } else if (tempDiff <= 3) {
      score += 35;
    } else if (tempDiff <= 5) {
      score += 25;
    } else if (tempDiff <= 7) {
      score += 15;
    } else if (tempDiff <= 10) {
      score += 5;
    }
    
    if (predictedCondition === actualCondition) {
      score += 50;
    } else {
      const similarConditions: Record<string, string[]> = {
        [WeatherCondition.RAINY]: [WeatherCondition.STORMY, WeatherCondition.CLOUDY],
        [WeatherCondition.STORMY]: [WeatherCondition.RAINY, WeatherCondition.WINDY],
        [WeatherCondition.CLOUDY]: [WeatherCondition.RAINY, WeatherCondition.FOGGY],
        [WeatherCondition.SUNNY]: [WeatherCondition.CLOUDY],
        [WeatherCondition.SNOWY]: [WeatherCondition.CLOUDY, WeatherCondition.FOGGY],
        [WeatherCondition.WINDY]: [WeatherCondition.STORMY, WeatherCondition.CLOUDY],
        [WeatherCondition.FOGGY]: [WeatherCondition.CLOUDY],
      };
      
      if (similarConditions[predictedCondition]?.includes(actualCondition)) {
        score += 25;
      }
    }
    
    return Math.max(0, Math.min(100, score));
  }

  getWeatherCondition(conditionText: string, conditionCode: number): WeatherCondition {
    return this.mapConditionToEnum(conditionText, conditionCode);
  }
}

export const weatherService = new WeatherService();
