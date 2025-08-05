import axios from 'axios';
import { Farmer } from '../context/AuthContext';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const authClient = axios.create({
  baseURL: `${API_BASE_URL}/api/auth`,
  timeout: 10000,
});

// Add auth token to requests
authClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  farmLocation: {
    state: string;
    district: string;
    village: string;
    latitude?: number;
    longitude?: number;
  };
  farmDetails: {
    farmSize: number;
    farmSizeUnit: 'acres' | 'hectares';
    soilType: string;
    irrigationType: string;
    mainCrops: string[];
  };
  experience: number;
  preferredLanguage: string;
}

export interface AuthResponse {
  token: string;
  farmer: Farmer;
  message: string;
}

export const authAPI = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await authClient.post('/login', credentials);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  async register(farmerData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await authClient.post('/register', farmerData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },

  async validateToken(token: string): Promise<Farmer> {
    try {
      const response = await authClient.get('/validate', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.farmer;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Token validation failed');
    }
  },

  async updateProfile(updates: Partial<Farmer>): Promise<Farmer> {
    try {
      const response = await authClient.put('/profile', updates);
      return response.data.farmer;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Profile update failed');
    }
  },

  async resetPassword(email: string): Promise<{ message: string }> {
    try {
      const response = await authClient.post('/reset-password', { email });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Password reset failed');
    }
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    try {
      const response = await authClient.post('/forgot-password', { email });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Password reset request failed');
    }
  },
};
