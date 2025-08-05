// Soil Testing Centers API Service
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export interface TestingCenter {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  latitude: number;
  longitude: number;
  type: 'Government' | 'University' | 'Private';
  facilities: string[];
  timings: string;
  cost: {
    basic?: number;
    comprehensive?: number;
    nutrient?: number;
    ph?: number;
    [key: string]: number | undefined;
  };
  rating: number;
  accreditation: string;
  distance?: number;
}

export interface TestingCentersResponse {
  success: boolean;
  data: {
    centers: TestingCenter[];
    total: number;
    filters: {
      state: string | null;
      city: string | null;
      coordinates: { latitude: number; longitude: number } | null;
      radius: number | null;
    };
  };
  error?: string;
}

class SoilTestingCentersAPI {
  /**
   * Get testing centers based on filters
   */
  async getTestingCenters(filters: {
    state?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
    radius?: number;
  } = {}): Promise<TestingCentersResponse> {
    try {
      const params = new URLSearchParams();
      
      if (filters.state) params.append('state', filters.state);
      if (filters.city) params.append('city', filters.city);
      if (filters.latitude !== undefined) params.append('lat', filters.latitude.toString());
      if (filters.longitude !== undefined) params.append('lon', filters.longitude.toString());
      if (filters.radius) params.append('radius', filters.radius.toString());

      const response = await fetch(`${API_BASE_URL}/soil/testing-centers?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching testing centers:', error);
      throw new Error(`Failed to fetch testing centers: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get specific testing center by ID
   */
  async getTestingCenter(id: string): Promise<{ success: boolean; data: TestingCenter; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/soil/testing-centers/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching testing center:', error);
      throw new Error(`Failed to fetch testing center: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get list of available states
   */
  async getStates(): Promise<{ success: boolean; data: string[]; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/soil/states`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching states:', error);
      throw new Error(`Failed to fetch states: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get list of cities for a specific state
   */
  async getCities(state: string): Promise<{ success: boolean; data: string[]; error?: string }> {
    try {
      const params = new URLSearchParams({ state });
      const response = await fetch(`${API_BASE_URL}/soil/cities?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching cities:', error);
      throw new Error(`Failed to fetch cities: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get user's current location
   */
  async getCurrentLocation(): Promise<{ latitude: number; longitude: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          reject(new Error(`Geolocation error: ${error.message}`));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }

  /**
   * Calculate distance between two points
   */
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
}

export const soilTestingCentersAPI = new SoilTestingCentersAPI();
export default soilTestingCentersAPI;
