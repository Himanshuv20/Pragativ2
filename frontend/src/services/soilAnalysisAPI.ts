import axios from 'axios';
import {
  Location,
  SatelliteData,
  ApiError,
  SoilAnalysisRequest,
  SoilAnalysisResponse,
  SoilAnalysisResult
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance with default configuration (same as main API)
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor for logging (same as main API)
apiClient.interceptors.request.use(
  (config) => {
    console.log(`Soil API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling (same as main API)
apiClient.interceptors.response.use(
  (response) => {
    console.log(`Soil API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    const apiError: ApiError = {
      success: false,
      error: error.response?.data?.error || error.code || 'UNKNOWN_ERROR',
      message: error.response?.data?.message || error.message || 'Unknown error occurred',
      details: error.response?.data?.details,
    };
    console.error('Soil API Error:', apiError);
    return Promise.reject(apiError);
  }
);

// Soil Analysis API functions (following main API pattern)
export const soilAnalysisAPI = {
  /**
   * Analyze soil conditions using satellite data
   */
  async analyzeSoil(params: SoilAnalysisRequest): Promise<SoilAnalysisResponse> {
    try {
      const response = await apiClient.get('/api/soil/analysis', {
        params: {
          lat: params.latitude,
          lon: params.longitude,
          date: params.date
        }
      });
      return response.data;
    } catch (error) {
      console.error('Soil analysis failed:', error);
      throw error;
    }
  },

  /**
   * Search locations with autocomplete
   */
  async searchLocations(query: string): Promise<any> {
    try {
      const response = await apiClient.get('/api/locations/search', {
        params: { query }
      });
      return response.data;
    } catch (error) {
      console.error('Location search failed:', error);
      throw error;
    }
  },

  /**
   * Geocode city name to coordinates
   */
  async geocodeLocation(city: string): Promise<any> {
    try {
      const response = await apiClient.get('/api/soil/location', {
        params: { city }
      });
      return response.data;
    } catch (error) {
      console.error('Geocoding failed:', error);
      throw error;
    }
  },

  /**
   * Reverse geocode coordinates to location name
   */
  async reverseGeocode(params: { lat: number; lon: number }): Promise<any> {
    try {
      const response = await apiClient.get('/api/locations/reverse', {
        params
      });
      return response.data;
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      throw error;
    }
  },

  /**
   * Get raw Sentinel-2 satellite data
   */
  async getSentinelData(params: { lat: number; lon: number; start?: string; end?: string }): Promise<any> {
    try {
      const response = await apiClient.get('/api/sentinel/data', {
        params
      });
      return response.data;
    } catch (error) {
      console.error('Sentinel data fetch failed:', error);
      throw error;
    }
  },

  /**
   * Get service health status
   */
  async getHealthStatus(): Promise<any> {
    try {
      const response = await apiClient.get('/api/soil/health');
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  },

  /**
   * Get configuration and system status
   */
  async getConfigStatus(): Promise<any> {
    try {
      const response = await apiClient.get('/api/soil/config/status');
      return response.data;
    } catch (error) {
      console.error('Config status failed:', error);
      throw error;
    }
  }
};

export default soilAnalysisAPI;
