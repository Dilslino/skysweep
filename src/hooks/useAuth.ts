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
          console.warn('Backend not available');
          setIsDemoMode(true);
          setLoading(false);
          return;
        }

        // Try to load user if token exists
        const token = localStorage.getItem('farcaster_token');
        if (token) {
          try {
            const userData = await api.get('/auth/me');
            setUser(userData);
          } catch (err) {
            console.warn('Token invalid or expired');
            localStorage.removeItem('farcaster_token');
          }
        }
        
        // Farcaster SDK disabled for testing
        console.info('Running without Farcaster SDK - testing mode');
      } catch (err) {
        console.error('Auth error:', err);
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
