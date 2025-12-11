import { sdk } from '@farcaster/miniapp-sdk';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:8787/api';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8787';

export const api = {
  async authenticatedFetch(endpoint: string, options: RequestInit = {}) {
    return sdk.quickAuth.fetch(`${API_BASE_URL}${endpoint}`, options);
  },
  
  async get(endpoint: string) {
    const response = await this.authenticatedFetch(endpoint);
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `API error: ${response.statusText}`);
    }
    return response.json();
  },
  
  async post(endpoint: string, data: any) {
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
  },
};

export const weatherApi = axios.create({
  baseURL: `${BACKEND_URL}/api/weather`,
});

// Helper to check if backend is available
export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${BACKEND_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
};
