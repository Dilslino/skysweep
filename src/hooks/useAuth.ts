import { useState, useEffect } from 'react';
import { api, checkBackendHealth } from '../lib/api';

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
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        // Check if backend is available
        const backendAvailable = await checkBackendHealth();
        
        if (!backendAvailable) {
          console.warn('Backend not available, running in demo mode');
          setIsDemoMode(true);
        }

        const userData = await api.get('/auth/me');
        setUser(userData);
        
        // Try to notify Farcaster SDK if available
        try {
          const { sdk } = await import('@farcaster/miniapp-sdk');
          sdk.actions.ready();
        } catch (e) {
          // SDK not available, continue without it
          console.info('Running without Farcaster SDK');
        }
      } catch (err) {
        console.error('Auth error:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load user';
        
        // If it's demo mode error, show friendly message
        if (errorMessage.includes('Demo mode') || errorMessage.includes('Backend not available')) {
          setError('Demo mode: Deploy backend to enable full functionality');
          setIsDemoMode(true);
        } else {
          setError(errorMessage);
        }
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

  return { user, loading, error, refreshUser, isDemoMode };
}
