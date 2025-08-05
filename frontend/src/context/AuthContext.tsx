import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../services/authAPI';

export interface Farmer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
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
  profilePicture?: string;
  isVerified: boolean;
  registrationDate: string;
}

interface AuthContextType {
  farmer: Farmer | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (farmerData: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<Farmer>) => Promise<void>;
}

export interface RegisterData {
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [farmer, setFarmer] = useState<Farmer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = farmer !== null;

  useEffect(() => {
    // Check for existing authentication on app load
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          const farmerData = await authAPI.validateToken(token);
          setFarmer(farmerData);
        }
      } catch (error) {
        console.error('Auth validation failed:', error);
        localStorage.removeItem('authToken');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authAPI.login({ email, password });
      localStorage.setItem('authToken', response.token);
      setFarmer(response.farmer);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (farmerData: RegisterData) => {
    try {
      setIsLoading(true);
      const response = await authAPI.register(farmerData);
      localStorage.setItem('authToken', response.token);
      setFarmer(response.farmer);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setFarmer(null);
  };

  const updateProfile = async (updates: Partial<Farmer>) => {
    try {
      setIsLoading(true);
      const updatedFarmer = await authAPI.updateProfile(updates);
      setFarmer(updatedFarmer);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    farmer,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
