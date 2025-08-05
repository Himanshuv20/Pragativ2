import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  CropCalendar,
  SupportedCrop,
  Location
} from '../types';

interface CropCalendarContextType {
  // State
  cropCalendar: CropCalendar | null;
  supportedCrops: SupportedCrop[];
  isLoading: boolean;
  error: string | null;
  
  // Current form data
  formData: {
    location: Location | null;
    area: number;
    cropType: string;
  };
  
  // Actions
  setCropCalendar: (calendar: CropCalendar | null) => void;
  setSupportedCrops: (crops: SupportedCrop[]) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateFormData: (data: Partial<CropCalendarContextType['formData']>) => void;
  resetFormData: () => void;
  clearError: () => void;
}

const CropCalendarContext = createContext<CropCalendarContextType | undefined>(undefined);

const initialFormData: {
  location: Location | null;
  area: number;
  cropType: string;
} = {
  location: null,
  area: 1,
  cropType: '',
};

export const CropCalendarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cropCalendar, setCropCalendar] = useState<CropCalendar | null>(null);
  const [supportedCrops, setSupportedCrops] = useState<SupportedCrop[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState(initialFormData);

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const resetFormData = () => {
    setFormData(initialFormData);
  };

  const clearError = () => {
    setError(null);
  };

  const contextValue: CropCalendarContextType = {
    // State
    cropCalendar,
    supportedCrops,
    isLoading,
    error,
    formData,
    
    // Actions
    setCropCalendar,
    setSupportedCrops,
    setIsLoading,
    setError,
    updateFormData,
    resetFormData,
    clearError,
  };

  return (
    <CropCalendarContext.Provider value={contextValue}>
      {children}
    </CropCalendarContext.Provider>
  );
};

export const useCropCalendar = (): CropCalendarContextType => {
  const context = useContext(CropCalendarContext);
  if (!context) {
    throw new Error('useCropCalendar must be used within a CropCalendarProvider');
  }
  return context;
};
