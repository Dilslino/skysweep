import { useState, useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
import { api } from '../lib/api';

export interface AuthUser {
  id: string;
  fid: number;
  username: string;
  displayName: string;
  avatarUrl: string;
  points: number;
  streak: number;
  rank: number;
  accuracy: number;
  primaryAddress?: string;
  bestLocation?: string;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const userData = await api.get('/auth/me');
        setUser(userData);
        sdk.actions.ready();
      } catch (err) {
        console.error('Auth error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load user');
      } finally {
        setLoading(false);
      }
    }
    
    loadUser();
  }, []);

  const refreshUser = async () => {
    try {
      const userData = await api.get('/auth/me');
      setUser(userData);
    } catch (err) {
      console.error('Refresh error:', err);
    }
  };

  return { user, loading, error, refreshUser };
}
