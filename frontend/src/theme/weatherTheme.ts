import { createTheme } from '@mui/material/styles';
import { agriculturalTheme, designTokens } from './theme';

// Weather-specific theme that extends the base agricultural theme
export const weatherTheme = createTheme({
  ...agriculturalTheme,
  
  palette: {
    ...agriculturalTheme.palette,
    primary: {
      light: designTokens.colors.weather[200],
      main: designTokens.colors.weather[500],
      dark: designTokens.colors.weather[600],
      contrastText: '#ffffff',
    },
    background: {
      default: '#FAFBFE', // Ultra light blue-tinted white
      paper: '#FFFFFF',
    },
    // Add bright secondary colors
    secondary: {
      light: designTokens.colors.weather[100],
      main: designTokens.colors.weather[300],
      dark: designTokens.colors.weather[400],
      contrastText: '#1F2937',
    },
  },
  
  components: {
    ...agriculturalTheme.components,
    
    // Weather Card Styling - Light and Bright
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: designTokens.borderRadius.xl,
          background: '#FFFFFF',
          border: `1px solid ${designTokens.colors.weather[100]}`,
          boxShadow: `0 2px 8px rgba(14, 165, 233, 0.04)`, // Much lighter shadow
          transition: 'all 0.2s ease-in-out',
          overflow: 'hidden',
          '&:hover': {
            boxShadow: `0 4px 16px rgba(14, 165, 233, 0.08)`, // Subtle hover shadow
            transform: 'translateY(-1px)', // Reduced movement
            borderColor: designTokens.colors.weather[200],
          },
          // Weather data card specific styling
          '&.weather-data-card': {
            background: `linear-gradient(135deg, #FFFFFF 0%, ${designTokens.colors.weather[50]} 100%)`,
            borderColor: designTokens.colors.weather[100],
          },
          // Forecast card styling
          '&.forecast-card': {
            background: '#FFFFFF',
            borderColor: designTokens.colors.weather[100],
            boxShadow: `0 1px 4px rgba(14, 165, 233, 0.06)`,
          },
        },
      },
    },
    
    // Weather Paper Components - Light and Airy
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: designTokens.borderRadius.lg,
          backgroundColor: '#FFFFFF',
          boxShadow: `0 1px 3px rgba(14, 165, 233, 0.05)`, // Much lighter shadow
          // Weather overview paper
          '&.weather-overview': {
            background: `linear-gradient(135deg, ${designTokens.colors.weather[400]} 0%, ${designTokens.colors.weather[500]} 100%)`,
            color: '#ffffff',
            borderRadius: designTokens.borderRadius.xl,
            padding: designTokens.spacing[6],
            boxShadow: `0 4px 20px rgba(14, 165, 233, 0.15)`, // Lighter shadow
          },
          // Current weather display
          '&.current-weather': {
            background: `linear-gradient(135deg, ${designTokens.colors.weather[300]} 0%, ${designTokens.colors.weather[400]} 100%)`, // Brighter gradient
            color: '#ffffff',
            textAlign: 'center',
            padding: designTokens.spacing[8],
            borderRadius: designTokens.borderRadius.xl,
            boxShadow: `0 6px 24px rgba(14, 165, 233, 0.12)`, // Lighter shadow
          },
        },
      },
    },
    
    // Weather Buttons - Light and Bright
    MuiButton: {
      styleOverrides: {
        root: {
          // Weather action buttons
          '&.weather-action': {
            background: `linear-gradient(135deg, ${designTokens.colors.weather[400]} 0%, ${designTokens.colors.weather[500]} 100%)`,
            color: '#ffffff',
            borderRadius: designTokens.borderRadius.lg,
            padding: `${designTokens.spacing[3]} ${designTokens.spacing[6]}`,
            boxShadow: `0 2px 8px rgba(14, 165, 233, 0.2)`, // Lighter shadow
            border: 'none',
            fontWeight: '600',
            '&:hover': {
              background: `linear-gradient(135deg, ${designTokens.colors.weather[500]} 0%, ${designTokens.colors.weather[600]} 100%)`,
              boxShadow: `0 4px 12px rgba(14, 165, 233, 0.25)`,
              transform: 'translateY(-1px)', // Reduced movement
            },
          },
          // Location button
          '&.location-button': {
            background: `linear-gradient(135deg, ${designTokens.colors.weather[300]} 0%, ${designTokens.colors.weather[400]} 100%)`,
            color: '#ffffff',
            borderRadius: designTokens.borderRadius.full,
            minWidth: '48px',
            minHeight: '48px',
            boxShadow: `0 2px 8px rgba(14, 165, 233, 0.15)`,
          },
        },
      },
    },
    
    // Weather Chips - Light and Clean
    MuiChip: {
      styleOverrides: {
        root: {
          // Weather condition chips
          '&.weather-chip': {
            background: designTokens.colors.weather[50],
            color: designTokens.colors.weather[700],
            fontWeight: designTokens.typography.fontWeight.medium,
            border: `1px solid ${designTokens.colors.weather[200]}`,
            borderRadius: designTokens.borderRadius.full,
          },
          // Temperature chips
          '&.temperature-chip': {
            background: `linear-gradient(135deg, ${designTokens.colors.weather[400]} 0%, ${designTokens.colors.weather[500]} 100%)`,
            color: '#ffffff',
            fontWeight: designTokens.typography.fontWeight.semibold,
            fontSize: designTokens.typography.fontSize.lg,
            height: '36px',
            padding: `0 ${designTokens.spacing[4]}`,
            border: 'none',
            borderRadius: designTokens.borderRadius.lg,
          },
        },
      },
    },
    
    // Weather Typography - Light and Modern
    MuiTypography: {
      styleOverrides: {
        root: {
          // Weather titles
          '&.weather-title': {
            color: designTokens.colors.weather[600],
            fontWeight: designTokens.typography.fontWeight.semibold,
          },
          // Weather values (temperature, humidity, etc.)
          '&.weather-value': {
            color: designTokens.colors.weather[700],
            fontWeight: designTokens.typography.fontWeight.semibold,
            fontSize: designTokens.typography.fontSize.xl,
          },
          // Weather descriptions
          '&.weather-description': {
            color: '#6B7280', // Neutral gray
            fontWeight: designTokens.typography.fontWeight.normal,
          },
          // Current weather text on dark background
          '&.weather-current-text': {
            color: '#ffffff',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)', // Lighter text shadow
          },
        },
      },
    },
    
    // Weather Tabs - Light and Clean
    MuiTabs: {
      styleOverrides: {
        root: {
          '&.weather-tabs': {
            backgroundColor: designTokens.colors.weather[50],
            borderRadius: designTokens.borderRadius.lg,
            padding: designTokens.spacing[1],
            border: `1px solid ${designTokens.colors.weather[100]}`,
          },
        },
        indicator: {
          backgroundColor: 'transparent',
        },
      },
    },
    
    MuiTab: {
      styleOverrides: {
        root: {
          '&.weather-tab': {
            borderRadius: designTokens.borderRadius.md,
            color: designTokens.colors.weather[500],
            fontWeight: '500',
            '&.Mui-selected': {
              backgroundColor: designTokens.colors.weather[400],
              color: '#ffffff',
              fontWeight: '600',
              boxShadow: `0 2px 4px rgba(14, 165, 233, 0.2)`,
            },
            '&:hover': {
              backgroundColor: designTokens.colors.weather[100],
              color: designTokens.colors.weather[600],
            },
          },
        },
      },
    },
    
    // Weather Icons
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          '&.weather-icon': {
            color: designTokens.colors.weather[600],
            filter: 'drop-shadow(0 2px 4px rgba(33, 150, 243, 0.2))',
          },
          '&.weather-icon-large': {
            fontSize: '4rem',
            color: designTokens.colors.weather[500],
            filter: 'drop-shadow(0 4px 8px rgba(33, 150, 243, 0.3))',
          },
          '&.weather-icon-white': {
            color: '#ffffff',
            filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
          },
        },
      },
    },
    
    // Weather Floating Action Button
    MuiFab: {
      styleOverrides: {
        root: {
          '&.weather-fab': {
            background: `linear-gradient(135deg, ${designTokens.colors.weather[400]} 0%, ${designTokens.colors.weather[500]} 100%)`,
            color: '#ffffff',
            boxShadow: `0 4px 16px rgba(14, 165, 233, 0.2)`, // Lighter shadow
            '&:hover': {
              background: `linear-gradient(135deg, ${designTokens.colors.weather[500]} 0%, ${designTokens.colors.weather[600]} 100%)`,
              boxShadow: `0 6px 20px rgba(14, 165, 233, 0.25)`,
              transform: 'scale(1.05)', // Subtle scale instead of heavy shadow
            },
          },
        },
      },
    },
  },
});

// Weather-specific design utilities
export const weatherStyles = {
  // Background gradients for different weather conditions
  backgroundGradients: {
    sunny: designTokens.colors.weatherConditions.sunny.gradient,
    cloudy: designTokens.colors.weatherConditions.cloudy.gradient,
    rainy: designTokens.colors.weatherConditions.rainy.gradient,
    stormy: designTokens.colors.weatherConditions.stormy.gradient,
    snowy: designTokens.colors.weatherConditions.snowy.gradient,
    default: `linear-gradient(135deg, ${designTokens.colors.weather[500]} 0%, ${designTokens.colors.weather[700]} 100%)`,
  },
  
  // Text colors for optimal contrast
  textColors: {
    onDarkBlue: '#ffffff',
    onLightBlue: designTokens.colors.weather[800],
    onWeatherBg: designTokens.colors.weather[900],
    primary: designTokens.colors.weather[700],
    secondary: designTokens.colors.weather[600],
  },
  
  // Box shadows for weather elements - Lighter and more subtle
  shadows: {
    weatherCard: `0 2px 8px rgba(14, 165, 233, 0.06)`,
    weatherCardHover: `0 4px 16px rgba(14, 165, 233, 0.1)`,
    currentWeather: `0 6px 24px rgba(14, 165, 233, 0.15)`,
    weatherButton: `0 2px 8px rgba(14, 165, 233, 0.2)`,
  },
};
