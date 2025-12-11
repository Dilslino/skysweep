import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:8787/api';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8787';

// DISABLE demo mode - always try real backend
const isDemoMode = false;

// Helper to check if backend is available
export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${BACKEND_URL}/health`, { signal: AbortSignal.timeout(3000) });
    return response.ok;
  } catch {
    return false;
  }
};

// Mock authenticated fetch for demo mode
const mockAuthenticatedFetch = async (endpoint: string, options: RequestInit = {}) => {
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
  
  // Mock responses based on endpoint
  if (endpoint.includes('/auth/me')) {
    return new Response(JSON.stringify({
      id: 'demo-user-1',
      fid: 123456,
      username: 'demo_user',
      displayName: 'Demo User',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
      points: 1250,
      streak: 5,
      rank: 42,
      accuracy: 85.5,
      bestLocation: 'Demo City',
    }), { status: 200 });
  }
  
  throw new Error('Demo mode: Backend not available. Deploy backend to enable full functionality.');
};

export const api = {
  async authenticatedFetch(endpoint: string, options: RequestInit = {}) {
    if (isDemoMode) {
      return mockAuthenticatedFetch(endpoint, options);
    }
    
    // Use regular fetch for now (Farcaster SDK disabled for testing)
    const token = localStorage.getItem('farcaster_token');
    return fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });
  },
  
  async get(endpoint: string) {
    try {
      const response = await this.authenticatedFetch(endpoint);
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.error || `API error: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('API GET error:', error);
      throw error;
    }
  },
  
  async post(endpoint: string, data: any) {
    try {
      const response = await this.authenticatedFetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.error || `API error: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('API POST error:', error);
      throw error;
    }
  },
};

export const weatherApi = axios.create({
  baseURL: `${BACKEND_URL}/api/weather`,
  timeout: 5000,
});
