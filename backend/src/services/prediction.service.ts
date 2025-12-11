import { supabaseAdmin } from '../config/supabase.js';
import { Prediction, WeatherCondition } from '../types/index.js';
import { weatherService } from './weather.service.js';
import { userService } from './user.service.js';

export class PredictionService {
  async createPrediction(
    userId: string,
    locationName: string,
    locationLat: number,
    locationLng: number,
    locationCountry: string,
    predictedTemp: number,
    predictedCondition: WeatherCondition,
    targetDate: string
  ): Promise<Prediction> {
    const { data, error } = await supabaseAdmin
      .from('predictions')
      .insert({
        user_id: userId,
        location_name: locationName,
        location_lat: locationLat,
        location_lng: locationLng,
        location_country: locationCountry,
        predicted_temp: predictedTemp,
        predicted_condition: predictedCondition,
        prediction_date: new Date().toISOString().split('T')[0],
        target_date: targetDate,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create prediction: ${error.message}`);
    }

    return data;
  }

  async getUserPredictions(userId: string, limit: number = 20): Promise<Prediction[]> {
    const { data, error } = await supabaseAdmin
      .from('predictions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching predictions:', error);
      return [];
    }

    return data;
  }

  async getPredictionById(predictionId: string): Promise<Prediction | null> {
    const { data, error } = await supabaseAdmin
      .from('predictions')
      .select('*')
      .eq('id', predictionId)
      .single();

    if (error) {
      console.error('Error fetching prediction:', error);
      return null;
    }

    return data;
  }

  async scorePendingPredictions(): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];

    const { data: pendingPredictions, error } = await supabaseAdmin
      .from('predictions')
      .select('*')
      .eq('status', 'pending')
      .lte('target_date', todayStr);

    if (error || !pendingPredictions) {
      console.error('Error fetching pending predictions:', error);
      return 0;
    }

    let scoredCount = 0;

    for (const prediction of pendingPredictions) {
      try {
        const location = `${prediction.location_lat},${prediction.location_lng}`;
        const weatherData = await weatherService.getHistoricalWeather(
          location,
          prediction.target_date
        );

        const actualTemp = weatherData.forecast?.forecastday[0]?.day.avgtemp_c || 
                          weatherData.current.temp_c;
        const actualCondition = weatherService.getWeatherCondition(
          weatherData.forecast?.forecastday[0]?.day.condition.text || 
          weatherData.current.condition.text,
          weatherData.forecast?.forecastday[0]?.day.condition.code || 
          weatherData.current.condition.code
        );

        const score = weatherService.calculatePredictionScore(
          prediction.predicted_temp,
          actualTemp,
          prediction.predicted_condition as WeatherCondition,
          actualCondition
        );

        await supabaseAdmin
          .from('predictions')
          .update({
            actual_temp: actualTemp,
            actual_condition: actualCondition,
            score,
            status: 'scored',
            scored_at: new Date().toISOString(),
          })
          .eq('id', prediction.id);

        await userService.updateUserPoints(prediction.user_id, score);
        await userService.updateUserStreak(prediction.user_id);
        await userService.updateUserAccuracy(prediction.user_id);
        await userService.checkAndAwardBadges(prediction.user_id);

        scoredCount++;
      } catch (error) {
        console.error(`Error scoring prediction ${prediction.id}:`, error);
      }
    }

    if (scoredCount > 0) {
      await userService.updateUserRanks();
    }

    return scoredCount;
  }

  async getPredictionStats(userId: string) {
    const { data: predictions } = await supabaseAdmin
      .from('predictions')
      .select('status, score')
      .eq('user_id', userId);

    if (!predictions) {
      return {
        total: 0,
        pending: 0,
        scored: 0,
        averageScore: 0,
      };
    }

    const total = predictions.length;
    const pending = predictions.filter(p => p.status === 'pending').length;
    const scored = predictions.filter(p => p.status === 'scored').length;
    const scoredPredictions = predictions.filter(p => p.score !== null);
    const averageScore = scoredPredictions.length > 0
      ? scoredPredictions.reduce((sum, p) => sum + (p.score || 0), 0) / scoredPredictions.length
      : 0;

    return {
      total,
      pending,
      scored,
      averageScore: Math.round(averageScore * 100) / 100,
    };
  }
}

export const predictionService = new PredictionService();
