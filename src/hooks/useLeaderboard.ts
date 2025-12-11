import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { LeaderboardEntry } from '../types';

export function useLeaderboard(limit: number = 100) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        const data = await api.get(`/leaderboard?limit=${limit}`);
        
        // Transform backend data to frontend format
        const transformed: LeaderboardEntry[] = data.map((entry: any) => ({
          id: entry.fid.toString(),
          user: {
            id: entry.fid.toString(),
            fid: entry.fid,
            username: entry.username,
            avatarUrl: entry.avatar_url,
            points: entry.points,
            streak: entry.streak,
            rank: entry.rank,
            accuracy: entry.accuracy,
            badges: [],
          },
          score: entry.points,
          change: entry.change || 0,
          accuracy: entry.accuracy,
        }));
        
        setLeaderboard(transformed);
      } catch (err) {
        console.error('Error loading leaderboard:', err);
        setError(err instanceof Error ? err.message : 'Failed to load leaderboard');
      } finally {
        setLoading(false);
      }
    }

    loadLeaderboard();
  }, [limit]);

  return { leaderboard, loading, error };
}
