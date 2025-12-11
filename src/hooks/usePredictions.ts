import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { PredictionHistoryItem } from '../types';

export function usePredictions() {
  const [predictions, setPredictions] = useState<PredictionHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPredictions = async () => {
    try {
      setLoading(true);
      const data = await api.get('/predictions?limit=20');
      
      // Transform backend data to frontend format
      const transformed: PredictionHistoryItem[] = data.map((p: any) => ({
        id: p.id,
        date: formatDate(p.created_at),
        location: p.location_name,
        predicted: {
          temp: p.predicted_temp,
          condition: p.predicted_condition,
        },
        actual: p.actual_temp ? {
          temp: p.actual_temp,
          condition: p.actual_condition,
        } : undefined,
        score: p.score,
        status: p.status,
      }));
      
      setPredictions(transformed);
    } catch (err) {
      console.error('Error loading predictions:', err);
      setError(err instanceof Error ? err.message : 'Failed to load predictions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPredictions();
  }, []);

  const createPrediction = async (data: {
    locationName: string;
    locationLat: number;
    locationLng: number;
    locationCountry: string;
    predictedTemp: number;
    predictedCondition: string;
    targetDate: string;
  }) => {
    const prediction = await api.post('/predictions', data);
    await loadPredictions();
    return prediction;
  };

  return {
    predictions,
    loading,
    error,
    createPrediction,
    refreshPredictions: loadPredictions,
  };
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  
  return date.toLocaleDateString();
}
