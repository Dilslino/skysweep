import { WeatherCondition } from '../types/index.js';

export function isValidLatitude(lat: number): boolean {
  return lat >= -90 && lat <= 90;
}

export function isValidLongitude(lng: number): boolean {
  return lng >= -180 && lng <= 180;
}

export function isValidTemperature(temp: number): boolean {
  return temp >= -100 && temp <= 60;
}

export function isValidWeatherCondition(condition: string): boolean {
  return Object.values(WeatherCondition).includes(condition as WeatherCondition);
}

export function isValidDateString(dateString: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;
  
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

export function validatePredictionInput(data: {
  locationName: string;
  locationLat: number;
  locationLng: number;
  locationCountry: string;
  predictedTemp: number;
  predictedCondition: string;
  targetDate: string;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data.locationName || data.locationName.trim().length === 0) {
    errors.push('Location name is required');
  }
  
  if (!isValidLatitude(data.locationLat)) {
    errors.push('Invalid latitude');
  }
  
  if (!isValidLongitude(data.locationLng)) {
    errors.push('Invalid longitude');
  }
  
  if (!data.locationCountry || data.locationCountry.trim().length === 0) {
    errors.push('Country is required');
  }
  
  if (!isValidTemperature(data.predictedTemp)) {
    errors.push('Invalid temperature');
  }
  
  if (!isValidWeatherCondition(data.predictedCondition)) {
    errors.push('Invalid weather condition');
  }
  
  if (!isValidDateString(data.targetDate)) {
    errors.push('Invalid date format');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}
