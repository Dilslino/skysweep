import { supabaseAdmin } from '../config/supabase.js';
import { User, Badge, UserBadge } from '../types/index.js';

export class UserService {
  async getUserById(userId: string): Promise<User | null> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }

    return data;
  }

  async getUserByFid(fid: number): Promise<User | null> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('fid', fid)
      .single();

    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }

    return data;
  }

  async updateUserPoints(userId: string, pointsToAdd: number): Promise<void> {
    const { error } = await supabaseAdmin.rpc('increment_user_points', {
      user_id: userId,
      points: pointsToAdd,
    });

    if (error) {
      const { data: user } = await supabaseAdmin
        .from('users')
        .select('points')
        .eq('id', userId)
        .single();

      await supabaseAdmin
        .from('users')
        .update({ points: (user?.points || 0) + pointsToAdd })
        .eq('id', userId);
    }
  }

  async updateUserStreak(userId: string): Promise<void> {
    const { data: predictions } = await supabaseAdmin
      .from('predictions')
      .select('created_at, status')
      .eq('user_id', userId)
      .eq('status', 'scored')
      .order('created_at', { ascending: false })
      .limit(30);

    if (!predictions || predictions.length === 0) {
      return;
    }

    let streak = 1;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 1; i < predictions.length; i++) {
      const currentDate = new Date(predictions[i].created_at);
      const previousDate = new Date(predictions[i - 1].created_at);
      
      currentDate.setHours(0, 0, 0, 0);
      previousDate.setHours(0, 0, 0, 0);

      const diffDays = Math.floor(
        (previousDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 1) {
        streak++;
      } else if (diffDays > 1) {
        break;
      }
    }

    await supabaseAdmin
      .from('users')
      .update({ streak })
      .eq('id', userId);
  }

  async updateUserAccuracy(userId: string): Promise<void> {
    const { data: predictions } = await supabaseAdmin
      .from('predictions')
      .select('score')
      .eq('user_id', userId)
      .eq('status', 'scored')
      .not('score', 'is', null);

    if (!predictions || predictions.length === 0) {
      return;
    }

    const totalScore = predictions.reduce((sum, p) => sum + (p.score || 0), 0);
    const accuracy = totalScore / predictions.length;

    await supabaseAdmin
      .from('users')
      .update({ accuracy: Math.round(accuracy * 100) / 100 })
      .eq('id', userId);
  }

  async getUserBadges(userId: string): Promise<Badge[]> {
    const { data, error } = await supabaseAdmin
      .from('user_badges')
      .select(`
        badge_id,
        unlocked_at,
        badges (*)
      `)
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching user badges:', error);
      return [];
    }

    return data.map((ub: any) => ({
      ...ub.badges,
      unlocked_at: ub.unlocked_at,
    }));
  }

  async checkAndAwardBadges(userId: string): Promise<Badge[]> {
    const user = await this.getUserById(userId);
    if (!user) return [];

    const { data: allBadges } = await supabaseAdmin
      .from('badges')
      .select('*');

    if (!allBadges) return [];

    const { data: userBadges } = await supabaseAdmin
      .from('user_badges')
      .select('badge_id')
      .eq('user_id', userId);

    const userBadgeIds = new Set(userBadges?.map(ub => ub.badge_id) || []);
    const newBadges: Badge[] = [];

    const { data: predictionCount } = await supabaseAdmin
      .from('predictions')
      .select('id', { count: 'exact' })
      .eq('user_id', userId);

    const totalPredictions = predictionCount?.length || 0;

    for (const badge of allBadges) {
      if (userBadgeIds.has(badge.id)) continue;

      let shouldAward = false;

      switch (badge.requirement_type) {
        case 'predictions':
          shouldAward = totalPredictions >= badge.requirement_value;
          break;
        case 'points':
          shouldAward = user.points >= badge.requirement_value;
          break;
        case 'streak':
          shouldAward = user.streak >= badge.requirement_value;
          break;
        case 'accuracy':
          shouldAward = user.accuracy >= badge.requirement_value;
          break;
      }

      if (shouldAward) {
        const { error } = await supabaseAdmin
          .from('user_badges')
          .insert({
            user_id: userId,
            badge_id: badge.id,
          });

        if (!error) {
          newBadges.push(badge);
        }
      }
    }

    return newBadges;
  }

  async updateUserRanks(): Promise<void> {
    await supabaseAdmin.rpc('update_user_ranks');
  }
}

export const userService = new UserService();
