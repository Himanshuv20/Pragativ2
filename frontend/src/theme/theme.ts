import { createTheme } from '@mui/material/styles';

// Agricultural Design Tokens
const designTokens = {
  // Color Palette
  colors: {
    primary: {
      50: '#E8F5E8',
      100: '#C8E6C9',
      200: '#A5D6A7',
      300: '#81C784',
      400: '#66BB6A',
      500: '#4CAF50',  // Main green
      600: '#43A047',
      700: '#388E3C',
      800: '#2E7D32',
      900: '#1B5E20',
    },
    secondary: {
      50: '#FFF3E0',
      100: '#FFE0B2',
      200: '#FFCC80',
      300: '#FFB74D',
      400: '#FFA726',
      500: '#FF9800',  // Agricultural orange
      600: '#FB8C00',
      700: '#F57C00',
      800: '#EF6C00',
      900: '#E65100',
    },
    accent: {
      50: '#E3F2FD',
      100: '#BBDEFB',
      200: '#90CAF9',
      300: '#64B5F6',
      400: '#42A5F5',
      500: '#2196F3',  // Sky blue
      600: '#1E88E5',
      700: '#1976D2',
      800: '#1565C0',
      900: '#0D47A1',
    },
    neutral: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#9E9E9E',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
    earth: {
      50: '#FBF8F3',
      100: '#F4EDE1',
      200: '#E8D5B7',
      300: '#D7B899',
      400: '#C49A6C',
      500: '#8D6E63',  // Earth brown
      600: '#795548',
      700: '#6D4C41',
      800: '#5D4037',
      900: '#3E2723',
    },
    
    // Weather-specific bright light theme
    weather: {
      50: '#F0F9FF',   // Ultra light sky blue
      100: '#E0F2FE',  // Very light sky blue
      200: '#BAE6FD',  // Light cyan blue
      300: '#7DD3FC',  // Bright cyan
      400: '#38BDF8',  // Sky cyan
      500: '#0EA5E9',  // Primary bright blue
      600: '#0284C7',  // Medium bright blue
      700: '#0369A1',  // Darker blue (but still bright)
      800: '#075985',  // Deep blue
      900: '#0C4A6E',  // Darkest blue
    },
    
    // Weather condition colors - bright and light
    weatherConditions: {
      sunny: {
        primary: '#FBBF24',    // Bright yellow-orange
        secondary: '#FCD34D',  // Golden yellow
        background: '#FFFBEB', // Very light cream
        gradient: 'linear-gradient(135deg, #FEF3C7 0%, #FBBF24 100%)',
      },
      cloudy: {
        primary: '#94A3B8',    // Light slate blue
        secondary: '#CBD5E1',  // Very light slate
        background: '#F8FAFC', // Off white
        gradient: 'linear-gradient(135deg, #F1F5F9 0%, #94A3B8 100%)',
      },
      rainy: {
        primary: '#3B82F6',    // Bright blue
        secondary: '#60A5FA',  // Light bright blue
        background: '#EFF6FF', // Very light blue
        gradient: 'linear-gradient(135deg, #DBEAFE 0%, #3B82F6 100%)',
      },
      stormy: {
        primary: '#6366F1',    // Bright indigo
        secondary: '#8B5CF6',  // Light purple
        background: '#F0F9FF', // Very light blue
        gradient: 'linear-gradient(135deg, #E0E7FF 0%, #6366F1 100%)',
      },
      snowy: {
        primary: '#06B6D4',    // Bright cyan
        secondary: '#67E8F9',  // Light cyan
        background: '#F0FDFF', // Very light cyan
        gradient: 'linear-gradient(135deg, #CFFAFE 0%, #06B6D4 100%)',
      },
    }
  },
  
  // Typography Scale
  typography: {
    fontFamily: {
      primary: '"Inter", "Roboto", "Helvetica Neue", Arial, sans-serif',
      display: '"Poppins", "Inter", sans-serif',
      mono: '"JetBrains Mono", "Consolas", monospace'
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    }
  },
  
  // Spacing System (8px base)
  spacing: {
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
    24: '6rem',     // 96px
  },
  
  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.25rem',    // 4px
    base: '0.5rem',   // 8px
    md: '0.75rem',    // 12px
    lg: '1rem',       // 16px
    xl: '1.5rem',     // 24px
    '2xl': '2rem',    // 32px
    full: '9999px',
  },
  
  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },
  
  // Tile System
  tiles: {
    size: {
      sm: '120px',
      md: '160px',
      lg: '200px',
      xl: '240px',
    },
    aspectRatio: '1:1', // Square tiles
    gap: '1rem',        // 16px gap between tiles
  },
  
  // Breakpoints
  breakpoints: {
    xs: '0px',
    sm: '600px',
    md: '900px',
    lg: '1200px',
    xl: '1536px',
  }
};

// Enhanced Agricultural Theme with comprehensive design system
export const agriculturalTheme = createTheme({
  palette: {
    primary: {
      light: designTokens.colors.primary[300],
      main: designTokens.colors.primary[500],
      dark: designTokens.colors.primary[700],
      contrastText: '#ffffff',
    },
    secondary: {
      light: designTokens.colors.secondary[300],
      main: designTokens.colors.secondary[500],
      dark: designTokens.colors.secondary[700],
      contrastText: '#ffffff',
    },
    info: {
      light: designTokens.colors.accent[300],
      main: designTokens.colors.accent[500],
      dark: designTokens.colors.accent[700],
      contrastText: '#ffffff',
    },
    success: {
      light: designTokens.colors.primary[400],
      main: designTokens.colors.primary[600],
      dark: designTokens.colors.primary[800],
      contrastText: '#ffffff',
    },
    warning: {
      light: designTokens.colors.secondary[400],
      main: designTokens.colors.secondary[600],
      dark: designTokens.colors.secondary[800],
      contrastText: '#ffffff',
    },
    error: {
      main: '#F44336',
      light: '#E57373',
      dark: '#D32F2F',
      contrastText: '#ffffff',
    },
    grey: {
      50: designTokens.colors.neutral[50],
      100: designTokens.colors.neutral[100],
      200: designTokens.colors.neutral[200],
      300: designTokens.colors.neutral[300],
      400: designTokens.colors.neutral[400],
      500: designTokens.colors.neutral[500],
      600: designTokens.colors.neutral[600],
      700: designTokens.colors.neutral[700],
      800: designTokens.colors.neutral[800],
      900: designTokens.colors.neutral[900],
    },
    background: {
      default: designTokens.colors.neutral[50],
      paper: '#ffffff',
    },
    text: {
      primary: designTokens.colors.neutral[900],
      secondary: designTokens.colors.neutral[600],
    },
  },
  
  typography: {
    fontFamily: designTokens.typography.fontFamily.primary,
    h1: {
      fontFamily: designTokens.typography.fontFamily.display,
      fontSize: designTokens.typography.fontSize['5xl'],
      fontWeight: designTokens.typography.fontWeight.bold,
      lineHeight: designTokens.typography.lineHeight.tight,
      letterSpacing: '-0.025em',
      color: designTokens.colors.primary[800],
    },
    h2: {
      fontFamily: designTokens.typography.fontFamily.display,
      fontSize: designTokens.typography.fontSize['4xl'],
      fontWeight: designTokens.typography.fontWeight.bold,
      lineHeight: designTokens.typography.lineHeight.tight,
      letterSpacing: '-0.025em',
      color: designTokens.colors.primary[700],
    },
    h3: {
      fontFamily: designTokens.typography.fontFamily.display,
      fontSize: designTokens.typography.fontSize['3xl'],
      fontWeight: designTokens.typography.fontWeight.semibold,
      lineHeight: designTokens.typography.lineHeight.tight,
      color: designTokens.colors.primary[700],
    },
    h4: {
      fontFamily: designTokens.typography.fontFamily.display,
      fontSize: designTokens.typography.fontSize['2xl'],
      fontWeight: designTokens.typography.fontWeight.semibold,
      lineHeight: designTokens.typography.lineHeight.normal,
      color: designTokens.colors.primary[700],
    },
    h5: {
      fontSize: designTokens.typography.fontSize.xl,
      fontWeight: designTokens.typography.fontWeight.semibold,
      lineHeight: designTokens.typography.lineHeight.normal,
      color: designTokens.colors.primary[700],
    },
    h6: {
      fontSize: designTokens.typography.fontSize.lg,
      fontWeight: designTokens.typography.fontWeight.semibold,
      lineHeight: designTokens.typography.lineHeight.normal,
      color: designTokens.colors.primary[700],
    },
    body1: {
      fontSize: designTokens.typography.fontSize.base,
      lineHeight: designTokens.typography.lineHeight.relaxed,
    },
    body2: {
      fontSize: designTokens.typography.fontSize.sm,
      lineHeight: designTokens.typography.lineHeight.normal,
    },
    button: {
      fontWeight: designTokens.typography.fontWeight.semibold,
      textTransform: 'none' as const,
      letterSpacing: '0.025em',
    },
    caption: {
      fontSize: designTokens.typography.fontSize.xs,
      lineHeight: designTokens.typography.lineHeight.normal,
    },
  },
  
  spacing: 8, // 8px base unit
  
  shape: {
    borderRadius: 12, // Default border radius
  },
  
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  
  components: {
    // Global styles
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          boxSizing: 'border-box',
        },
        html: {
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          height: '100%',
        },
        body: {
          backgroundColor: designTokens.colors.neutral[50],
          fontFamily: designTokens.typography.fontFamily.primary,
          height: '100%',
          margin: 0,
        },
        '#root': {
          height: '100%',
        },
      },
    },
    
    // Button enhancements
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: designTokens.borderRadius.md,
          fontSize: designTokens.typography.fontSize.base,
          fontWeight: designTokens.typography.fontWeight.semibold,
          textTransform: 'none',
          boxShadow: designTokens.shadows.sm,
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          minHeight: '44px', // Touch-friendly minimum height
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: designTokens.shadows.md,
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        sizeLarge: {
          padding: `${designTokens.spacing[4]} ${designTokens.spacing[8]}`,
          fontSize: designTokens.typography.fontSize.lg,
          minHeight: '52px',
        },
        sizeSmall: {
          padding: `${designTokens.spacing[2]} ${designTokens.spacing[4]}`,
          fontSize: designTokens.typography.fontSize.sm,
          minHeight: '36px',
        },
        contained: {
          boxShadow: designTokens.shadows.base,
          '&:hover': {
            boxShadow: designTokens.shadows.lg,
          },
        },
      },
    },
    
    // Card enhancements
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: designTokens.borderRadius.lg,
          boxShadow: designTokens.shadows.base,
          border: `1px solid ${designTokens.colors.neutral[200]}`,
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'hidden',
          '&:hover': {
            boxShadow: designTokens.shadows.lg,
            transform: 'translateY(-2px)',
            borderColor: designTokens.colors.primary[200],
          },
        },
      },
    },
    
    // TextField enhancements
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: designTokens.borderRadius.md,
            minHeight: '44px', // Touch-friendly
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: designTokens.colors.primary[400],
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: designTokens.colors.primary[500],
              borderWidth: '2px',
            },
          },
          '& .MuiInputLabel-root': {
            fontWeight: designTokens.typography.fontWeight.medium,
          },
        },
      },
    },
    
    // Paper enhancements
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: designTokens.borderRadius.lg,
          backgroundColor: '#ffffff',
        },
        elevation1: {
          boxShadow: designTokens.shadows.sm,
        },
        elevation2: {
          boxShadow: designTokens.shadows.base,
        },
        elevation3: {
          boxShadow: designTokens.shadows.md,
        },
        elevation4: {
          boxShadow: designTokens.shadows.lg,
        },
      },
    },
    
    // Chip enhancements
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: designTokens.borderRadius.full,
          fontWeight: designTokens.typography.fontWeight.medium,
          height: '32px',
        },
      },
    },
    
    // IconButton enhancements
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: designTokens.borderRadius.md,
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          minWidth: '44px', // Touch-friendly
          minHeight: '44px',
          '&:hover': {
            transform: 'scale(1.05)',
            backgroundColor: designTokens.colors.primary[50],
          },
        },
      },
    },
    
    // Fab enhancements
    MuiFab: {
      styleOverrides: {
        root: {
          boxShadow: designTokens.shadows.lg,
          width: '56px',
          height: '56px',
          '&:hover': {
            boxShadow: designTokens.shadows.xl,
            transform: 'scale(1.05)',
          },
        },
      },
    },
    
    // AppBar enhancements
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: designTokens.shadows.sm,
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(76, 175, 80, 0.95)',
        },
      },
    },
    
    // Dialog enhancements
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: designTokens.borderRadius.xl,
          padding: designTokens.spacing[4],
        },
      },
    },
    
    // Tab enhancements
    MuiTabs: {
      styleOverrides: {
        root: {
          borderRadius: designTokens.borderRadius.md,
          backgroundColor: designTokens.colors.neutral[100],
          padding: designTokens.spacing[1],
        },
        indicator: {
          backgroundColor: 'transparent',
        },
      },
    },
    
    MuiTab: {
      styleOverrides: {
        root: {
          borderRadius: designTokens.borderRadius.base,
          margin: `0 ${designTokens.spacing[1]}`,
          minHeight: '44px',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&.Mui-selected': {
            backgroundColor: '#ffffff',
            boxShadow: designTokens.shadows.sm,
            color: designTokens.colors.primary[700],
          },
        },
      },
    },
  },
});

// Export design tokens for use in components
export { designTokens };
