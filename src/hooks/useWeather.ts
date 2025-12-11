import { useState, useEffect } from 'react';
import { weatherApi } from '../lib/api';

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
    pressure_mb?: number;
    feelslike_c?: number;
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
      hour: Array<{
        time: string;
        temp_c: number;
        condition: {
          text: string;
          icon: string;
          code: number;
        };
      }>;
    }>;
  };
}

export function useWeather(location: string) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadWeather() {
      console.log('🌤️ Loading weather for:', location);
      try {
        setLoading(true);
        setError(null);
        const url = `/forecast?location=${encodeURIComponent(location)}&days=7`;
        console.log('🌐 Fetching:', weatherApi.defaults.baseURL + url);
        const response = await weatherApi.get(url);
        console.log('✅ Weather data received:', response.data);
        setWeather(response.data);
      } catch (err) {
        console.error('❌ Error loading weather:', err);
        setError('Failed to load weather data');
      } finally {
        setLoading(false);
      }
    }

    if (location) {
      loadWeather();
    }
  }, [location]);

  return { weather, loading, error };
}

export async function searchLocations(query: string) {
  try {
    const response = await weatherApi.get('/search', {
      params: { q: query }
    });
    return response.data;
  } catch (err) {
    console.error('Error searching locations:', err);
    return [];
  }
}
