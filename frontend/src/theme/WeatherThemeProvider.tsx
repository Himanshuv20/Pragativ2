import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { weatherTheme } from './weatherTheme';

// Weather Theme Provider Component
interface WeatherThemeProviderProps {
  children: React.ReactNode;
}

export const WeatherThemeProvider: React.FC<WeatherThemeProviderProps> = ({ children }) => {
  return (
    <ThemeProvider theme={weatherTheme}>
      {children}
    </ThemeProvider>
  );
};
