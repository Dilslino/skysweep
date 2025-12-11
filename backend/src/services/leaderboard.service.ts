import { supabaseAdmin } from '../config/supabase.js';
import { LeaderboardEntry } from '../types/index.js';

export class LeaderboardService {
  async getLeaderboard(limit: number = 100, offset: number = 0): Promise<LeaderboardEntry[]> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('fid, username, display_name, avatar_url, points, accuracy, streak, rank')
      .order('points', { ascending: false })
      .order('accuracy', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching leaderboard:', error);
      return [];
    }

    return data.map((user, index) => ({
      fid: user.fid,
      username: user.username,
      avatar_url: user.avatar_url,
      points: user.points,
      accuracy: user.accuracy,
      streak: user.streak,
      rank: offset + index + 1,
      change: 0,
    }));
  }

  async getUserRank(userId: string): Promise<number> {
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('rank')
      .eq('id', userId)
      .single();

    return user?.rank || 0;
  }

  async getTopUsers(limit: number = 10): Promise<LeaderboardEntry[]> {
    return this.getLeaderboard(limit, 0);
  }

  async refreshLeaderboard(): Promise<void> {
    await supabaseAdmin.rpc('refresh_leaderboard');
  }
}

export const leaderboardService = new LeaderboardService();
