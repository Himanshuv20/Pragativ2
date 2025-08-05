import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Tab,
  Tabs,
  IconButton,
  Divider,
  Stack,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  Fab,
  useTheme,
  useMediaQuery,
  Skeleton,
  Badge,
  LinearProgress,
  Tooltip
} from '@mui/material';
import {
  CalendarToday,
  TrendingUp,
  ArrowUpward,
  ArrowDownward,
  MyLocation,
  Edit,
  WbTwilight,
  Cloud,
  WbSunny,
  Grain,
  Air,
  Thermostat,
  Opacity,
  Visibility,
  Compress,
  Navigation,
  Brightness6,
  Schedule,
  FlashOn,
  WaterDrop
} from '@mui/icons-material';
import { CropCalendarAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { WeatherThemeProvider } from '../theme/WeatherThemeProvider';
import {
  WeatherSunnyIcon,
  WeatherCloudyIcon,
  WeatherRainyIcon,
  WeatherStormyIcon,
  WeatherSnowyIcon,
  LocationIcon,
  RefreshIcon,
  TemperatureIcon,
  HumidityIcon,
  WindIcon,
  VisibilityIcon,
  SearchIcon
} from '../components/icons/AppIcons';

interface WeatherData {
  current?: any;
  forecast?: any;
  metadata?: any;
}

interface LocationData {
  latitude: number;
  longitude: number;
  name?: string;
  country?: string;
  state?: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Popular cities for quick selection
const POPULAR_CITIES = [
  { name: 'Delhi', country: 'India', latitude: 28.6139, longitude: 77.2090 },
  { name: 'Mumbai', country: 'India', latitude: 19.0760, longitude: 72.8777 },
  { name: 'Bangalore', country: 'India', latitude: 12.9716, longitude: 77.5946 },
  { name: 'Chennai', country: 'India', latitude: 13.0827, longitude: 80.2707 },
  { name: 'Kolkata', country: 'India', latitude: 22.5726, longitude: 88.3639 },
  { name: 'Hyderabad', country: 'India', latitude: 17.3850, longitude: 78.4867 },
  { name: 'Pune', country: 'India', latitude: 18.5204, longitude: 73.8567 },
  { name: 'Ahmedabad', country: 'India', latitude: 23.0225, longitude: 72.5714 }
];

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`weather-tabpanel-${index}`}
      aria-labelledby={`weather-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const WeatherPage: React.FC = () => {
  // Translation hook
  const { t } = useLanguage();
  
  // Responsive design hooks
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [weatherData, setWeatherData] = useState<WeatherData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [location, setLocation] = useState<LocationData>({ 
    latitude: 28.6139, 
    longitude: 77.2090, 
    name: 'Delhi',
    country: 'India'
  });
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [customLatitude, setCustomLatitude] = useState('');
  const [customLongitude, setCustomLongitude] = useState('');
  const [selectedCity, setSelectedCity] = useState<any>(null);

  useEffect(() => {
    // Try to get user's current location on component mount
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (location.latitude && location.longitude) {
      fetchWeatherData();
    }
  }, [location]);

  const getCurrentLocation = () => {
    setGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({
            latitude,
            longitude,
            name: 'Current Location',
            country: ''
          });
          setGettingLocation(false);
        },
        (error) => {
          console.warn('❌ Geolocation error:', error.message);
          setGettingLocation(false);
          // Keep default location (Delhi) if geolocation fails
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    } else {
      console.warn('❌ Geolocation not supported');
      setGettingLocation(false);
    }
  };

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await CropCalendarAPI.getComprehensiveWeatherData(
        location.latitude,
        location.longitude,
        15 // Get 15-day forecast
      );
      
      setWeatherData(response);
      
    } catch (err: any) {
      console.error('Error fetching weather data:', err);
      setError(err.message || 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleLocationDialogOpen = () => {
    setLocationDialogOpen(true);
    setCustomLatitude(location.latitude.toString());
    setCustomLongitude(location.longitude.toString());
    setSelectedCity(POPULAR_CITIES.find(city => 
      Math.abs(city.latitude - location.latitude) < 0.1 && 
      Math.abs(city.longitude - location.longitude) < 0.1
    ) || null);
  };

  const handleLocationDialogClose = () => {
    setLocationDialogOpen(false);
    setCustomLatitude('');
    setCustomLongitude('');
    setSelectedCity(null);
  };

  const handleCitySelect = (city: any) => {
    if (city) {
      setLocation({
        latitude: city.latitude,
        longitude: city.longitude,
        name: city.name,
        country: city.country
      });
      setLocationDialogOpen(false);
    }
  };

  const handleCustomLocationSet = () => {
    const lat = parseFloat(customLatitude);
    const lon = parseFloat(customLongitude);
    
    if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      alert('Please enter valid coordinates (Latitude: -90 to 90, Longitude: -180 to 180)');
      return;
    }
    
    setLocation({
      latitude: lat,
      longitude: lon,
      name: 'Custom Location',
      country: ''
    });
    setLocationDialogOpen(false);
  };

  const getWeatherIcon = (iconCode: string, size: 'small' | 'medium' | 'large' = 'medium') => {
    const iconSize = size === 'small' ? 24 : size === 'medium' ? 32 : 48;
    const iconProps = { 
      sx: { 
        fontSize: iconSize,
        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
        transition: 'all 0.3s ease',
        animation: 'float 3s ease-in-out infinite',
        '@keyframes float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-4px)' }
        }
      } 
    };
    
    switch (iconCode?.slice(0, 2)) {
      case '01': return (
        <Box sx={{ position: 'relative', display: 'inline-block' }}>
          <WbSunny {...iconProps} sx={{
            ...iconProps.sx,
            color: '#FFB74D',
            animation: 'sunshine 4s ease-in-out infinite',
            '@keyframes sunshine': {
              '0%, 100%': { transform: 'rotate(0deg) scale(1)', filter: 'drop-shadow(0 0 10px rgba(255, 183, 77, 0.6))' },
              '50%': { transform: 'rotate(180deg) scale(1.1)', filter: 'drop-shadow(0 0 20px rgba(255, 183, 77, 0.8))' }
            }
          }} />
        </Box>
      );
      case '02': return <WeatherCloudyIcon {...iconProps} sx={{ ...iconProps.sx, color: '#90A4AE' }} />;
      case '03':
      case '04': return <Cloud {...iconProps} sx={{ ...iconProps.sx, color: '#78909C' }} />;
      case '09':
      case '10': return (
        <Box sx={{ position: 'relative', display: 'inline-block' }}>
          <WeatherRainyIcon {...iconProps} sx={{ ...iconProps.sx, color: '#42A5F5' }} />
          <Box sx={{
            position: 'absolute',
            top: '60%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 2,
            height: 8,
            background: 'linear-gradient(180deg, transparent 0%, #42A5F5 50%, transparent 100%)',
            animation: 'rain 1.5s ease-in-out infinite',
            '@keyframes rain': {
              '0%': { opacity: 0, transform: 'translateX(-50%) translateY(-10px)' },
              '50%': { opacity: 1, transform: 'translateX(-50%) translateY(0px)' },
              '100%': { opacity: 0, transform: 'translateX(-50%) translateY(10px)' }
            }
          }} />
          <Box sx={{
            position: 'absolute',
            top: '60%',
            left: '30%',
            transform: 'translateX(-50%)',
            width: 1.5,
            height: 6,
            background: 'linear-gradient(180deg, transparent 0%, #42A5F5 50%, transparent 100%)',
            animation: 'rain 1.5s ease-in-out infinite 0.2s',
            '@keyframes rain': {
              '0%': { opacity: 0, transform: 'translateX(-50%) translateY(-8px)' },
              '50%': { opacity: 1, transform: 'translateX(-50%) translateY(0px)' },
              '100%': { opacity: 0, transform: 'translateX(-50%) translateY(8px)' }
            }
          }} />
          <Box sx={{
            position: 'absolute',
            top: '60%',
            left: '70%',
            transform: 'translateX(-50%)',
            width: 1.5,
            height: 6,
            background: 'linear-gradient(180deg, transparent 0%, #42A5F5 50%, transparent 100%)',
            animation: 'rain 1.5s ease-in-out infinite 0.4s',
            '@keyframes rain': {
              '0%': { opacity: 0, transform: 'translateX(-50%) translateY(-8px)' },
              '50%': { opacity: 1, transform: 'translateX(-50%) translateY(0px)' },
              '100%': { opacity: 0, transform: 'translateX(-50%) translateY(8px)' }
            }
          }} />
        </Box>
      );
      case '11': return (
        <Box sx={{ position: 'relative', display: 'inline-block' }}>
          <WeatherStormyIcon {...iconProps} sx={{
            ...iconProps.sx,
            color: '#5C6BC0',
            animation: 'storm 2s ease-in-out infinite',
            '@keyframes storm': {
              '0%, 100%': { transform: 'scale(1)', filter: 'drop-shadow(0 0 5px rgba(92, 107, 192, 0.5))' },
              '50%': { transform: 'scale(1.05)', filter: 'drop-shadow(0 0 15px rgba(92, 107, 192, 0.8))' }
            }
          }} />
          <FlashOn sx={{
            position: 'absolute',
            top: '20%',
            right: '10%',
            fontSize: size === 'large' ? 16 : size === 'medium' ? 12 : 8,
            color: '#FFF176',
            animation: 'lightning 3s ease-in-out infinite',
            '@keyframes lightning': {
              '0%, 90%, 100%': { opacity: 0 },
              '5%, 15%': { opacity: 1 }
            }
          }} />
        </Box>
      );
      case '13': return <WeatherSnowyIcon {...iconProps} sx={{ ...iconProps.sx, color: '#E1F5FE' }} />;
      default: return <WeatherSunnyIcon {...iconProps} sx={{ ...iconProps.sx, color: '#FFB74D' }} />;
    }
  };

  const formatTemperature = (temp: number) => `${Math.round(temp)}°C`;

  const getCurrentWeatherCard = () => {
    if (!weatherData.current) {
      return (
        <Card sx={{ 
          background: `linear-gradient(135deg, rgba(227, 242, 253, 0.95) 0%, rgba(187, 222, 251, 0.98) 100%)`,
          mb: 4,
          borderRadius: 4,
          border: '1px solid rgba(144, 202, 249, 0.3)',
          boxShadow: '0 8px 32px rgba(144, 202, 249, 0.2)',
          backdropFilter: 'blur(20px)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Box sx={{ position: 'relative' }}>
              <CircularProgress 
                size={60} 
                thickness={4}
                sx={{ 
                  color: '#42A5F5',
                  animation: 'pulse 2s ease-in-out infinite',
                  '@keyframes pulse': {
                    '0%': { opacity: 1 },
                    '50%': { opacity: 0.4 },
                    '100%': { opacity: 1 }
                  }
                }} 
              />
              <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(66, 165, 245, 0.1), rgba(144, 202, 249, 0.05))',
                animation: 'ripple 2s ease-in-out infinite',
                '@keyframes ripple': {
                  '0%': { transform: 'translate(-50%, -50%) scale(0.8)', opacity: 1 },
                  '100%': { transform: 'translate(-50%, -50%) scale(1.4)', opacity: 0 }
                }
              }} />
            </Box>
            <Typography variant="h6" sx={{ 
              mt: 3, 
              background: 'linear-gradient(135deg, #1565C0 0%, #42A5F5 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 600
            }}>
              Loading weather data...
            </Typography>
            <Typography variant="body2" sx={{ 
              color: 'rgba(21, 101, 192, 0.7)',
              mt: 1,
              fontWeight: 500
            }}>
              Fetching latest atmospheric conditions
            </Typography>
          </CardContent>
        </Card>
      );
    }

    const current = weatherData.current;
    const isDay = current.weather?.icon?.includes('d');
    
    return (
      <Card sx={{ 
        background: `linear-gradient(135deg, 
          ${isDay 
            ? 'rgba(144, 202, 249, 0.95) 0%, rgba(100, 181, 246, 0.98) 50%, rgba(66, 165, 245, 1) 100%'
            : 'rgba(63, 81, 181, 0.95) 0%, rgba(48, 63, 159, 0.98) 50%, rgba(26, 35, 126, 1) 100%'
          })`,
        color: '#ffffff',
        mb: 4,
        borderRadius: 4,
        boxShadow: `0 16px 48px ${isDay ? 'rgba(66, 165, 245, 0.25)' : 'rgba(26, 35, 126, 0.3)'}`,
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: isDay 
            ? 'radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(255, 235, 59, 0.1) 0%, transparent 50%)'
            : 'radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.08) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(63, 81, 181, 0.3) 0%, transparent 50%)',
          pointerEvents: 'none',
          animation: 'atmosphericFlow 8s ease-in-out infinite',
          '@keyframes atmosphericFlow': {
            '0%, 100%': { transform: 'translateX(0) scale(1)' },
            '50%': { transform: 'translateX(10px) scale(1.02)' }
          }
        }
      }}>
        <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
          {/* Enhanced Header Section */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between', 
            alignItems: { xs: 'flex-start', sm: 'center' }, 
            mb: 4,
            gap: 2
          }}>
            <Box sx={{ flex: 1 }}>
              {/* Location Display with Enhanced Animation */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5, 
                mb: 2,
                flexWrap: 'wrap'
              }}>
                <LocationIcon sx={{ 
                  fontSize: 28, 
                  opacity: 0.95,
                  animation: 'locationPulse 3s ease-in-out infinite',
                  '@keyframes locationPulse': {
                    '0%, 100%': { transform: 'scale(1)', filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.3))' },
                    '50%': { transform: 'scale(1.1)', filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.5))' }
                  }
                }} />
                <Typography variant="h4" sx={{ 
                  fontWeight: 800,
                  textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  letterSpacing: '-0.01em',
                  background: 'linear-gradient(135deg, #ffffff 0%, #e3f2fd 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  {current.location?.name || location.name || 'Unknown Location'}
                </Typography>
                {current.location?.country && (
                  <Chip 
                    label={current.location.country}
                    size="medium"
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.25)',
                      color: 'white',
                      fontWeight: 700,
                      backdropFilter: 'blur(15px)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.35)',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 6px 16px rgba(0,0,0,0.15)'
                      }
                    }}
                  />
                )}
              </Box>
              
              {/* Coordinates and Last Updated */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ 
                  opacity: 0.85, 
                  mb: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  fontWeight: 500
                }}>
                  <Navigation sx={{ fontSize: 16 }} />
                  {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                </Typography>
                
                <Typography variant="body2" sx={{ 
                  opacity: 0.85,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  fontWeight: 500
                }}>
                  <Schedule sx={{ fontSize: 16 }} />
                  Updated: {new Date(current.lastUpdated || Date.now()).toLocaleTimeString()}
                </Typography>
              </Box>
              
              {/* Main Weather Display with Enhanced Animation */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 4, 
                mb: 4
              }}>
                <Box sx={{ 
                  position: 'relative',
                  '& .weather-icon': {
                    filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))',
                    transform: 'scale(1.3)'
                  }
                }}>
                  {getWeatherIcon(current.weather?.icon || '01d', 'large')}
                </Box>
                <Box>
                  <Typography variant="h1" sx={{ 
                    fontWeight: 900, 
                    lineHeight: 0.9,
                    textShadow: '0 6px 12px rgba(0,0,0,0.4)',
                    background: 'linear-gradient(135deg, #ffffff 0%, #e8f4fd 50%, #bbdefb 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontSize: { xs: '3.5rem', sm: '4.5rem', md: '5.5rem' },
                    animation: 'temperatureGlow 4s ease-in-out infinite',
                    '@keyframes temperatureGlow': {
                      '0%, 100%': { textShadow: '0 6px 12px rgba(0,0,0,0.4)' },
                      '50%': { textShadow: '0 8px 20px rgba(255,255,255,0.3), 0 6px 12px rgba(0,0,0,0.4)' }
                    }
                  }}>
                    {formatTemperature(current.current?.temperature || 0)}
                  </Typography>
                  <Typography variant="h5" sx={{ 
                    opacity: 0.95, 
                    textTransform: 'capitalize',
                    fontWeight: 600,
                    textShadow: '0 2px 6px rgba(0,0,0,0.3)',
                    mt: 1
                  }}>
                    {current.weather?.description || current.weather?.main || 'Loading...'}
                  </Typography>
                </Box>
              </Box>
            </Box>
            
            {/* Enhanced Refresh Button */}
            <IconButton 
              onClick={fetchWeatherData} 
              disabled={loading}
              sx={{ 
                color: 'white', 
                bgcolor: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.3)',
                width: 56,
                height: 56,
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.3)',
                  transform: 'scale(1.1) translateY(-2px)',
                  boxShadow: '0 12px 32px rgba(0,0,0,0.2)'
                },
                '&:active': {
                  transform: 'scale(1.05)'
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <RefreshIcon sx={{ 
                fontSize: 24,
                animation: loading ? 'spin 1s linear infinite' : 'none',
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' }
                }
              }} />
            </IconButton>
          </Box>

          {/* Enhanced Weather Stats Grid */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }, 
            gap: 2.5 
          }}>
            <Box sx={{ 
              textAlign: 'center',
              p: 2.5,
              borderRadius: 3,
              bgcolor: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.25)',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                transition: 'left 0.5s',
              },
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.25)',
                transform: 'translateY(-4px) scale(1.02)',
                boxShadow: '0 12px 32px rgba(0,0,0,0.2)',
                '&::before': {
                  left: '100%'
                }
              }
            }}>
              <Thermostat sx={{ 
                fontSize: 32, 
                mb: 1.5, 
                opacity: 0.95, 
                color: '#FF8A65',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
              }} />
              <Typography variant="body2" sx={{ 
                opacity: 0.85, 
                fontSize: '0.75rem', 
                textTransform: 'uppercase', 
                fontWeight: 700,
                letterSpacing: '0.5px',
                mb: 1
              }}>
                {t('weather.feelsLike')}
              </Typography>
              <Typography variant="h5" sx={{ 
                fontWeight: 800,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}>
                {formatTemperature(current.current?.feelsLike || 0)}
              </Typography>
            </Box>
            
            <Box sx={{ 
              textAlign: 'center',
              p: 2.5,
              borderRadius: 3,
              bgcolor: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.25)',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                transition: 'left 0.5s',
              },
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.25)',
                transform: 'translateY(-4px) scale(1.02)',
                boxShadow: '0 12px 32px rgba(0,0,0,0.2)',
                '&::before': {
                  left: '100%'
                }
              }
            }}>
              <Opacity sx={{ 
                fontSize: 32, 
                mb: 1.5, 
                opacity: 0.95, 
                color: '#64B5F6',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
              }} />
              <Typography variant="body2" sx={{ 
                opacity: 0.85, 
                fontSize: '0.75rem', 
                textTransform: 'uppercase', 
                fontWeight: 700,
                letterSpacing: '0.5px',
                mb: 1
              }}>
                {t('weather.humidity')}
              </Typography>
              <Typography variant="h5" sx={{ 
                fontWeight: 800,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}>
                {current.current?.humidity || 0}%
              </Typography>
            </Box>
            
            <Box sx={{ 
              textAlign: 'center',
              p: 2.5,
              borderRadius: 3,
              bgcolor: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.25)',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                transition: 'left 0.5s',
              },
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.25)',
                transform: 'translateY(-4px) scale(1.02)',
                boxShadow: '0 12px 32px rgba(0,0,0,0.2)',
                '&::before': {
                  left: '100%'
                }
              }
            }}>
              <Air sx={{ 
                fontSize: 32, 
                mb: 1.5, 
                opacity: 0.95, 
                color: '#81C784',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
              }} />
              <Typography variant="body2" sx={{ 
                opacity: 0.85, 
                fontSize: '0.75rem', 
                textTransform: 'uppercase', 
                fontWeight: 700,
                letterSpacing: '0.5px',
                mb: 1
              }}>
                {t('weather.windSpeed')}
              </Typography>
              <Typography variant="h5" sx={{ 
                fontWeight: 800,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}>
                {current.wind?.speed || 0} km/h
              </Typography>
            </Box>
            
            <Box sx={{ 
              textAlign: 'center',
              p: 2.5,
              borderRadius: 3,
              bgcolor: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.25)',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                transition: 'left 0.5s',
              },
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.25)',
                transform: 'translateY(-4px) scale(1.02)',
                boxShadow: '0 12px 32px rgba(0,0,0,0.2)',
                '&::before': {
                  left: '100%'
                }
              }
            }}>
              <Visibility sx={{ 
                fontSize: 32, 
                mb: 1.5, 
                opacity: 0.95, 
                color: '#BA68C8',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
              }} />
              <Typography variant="body2" sx={{ 
                opacity: 0.85, 
                fontSize: '0.75rem', 
                textTransform: 'uppercase', 
                fontWeight: 700,
                letterSpacing: '0.5px',
                mb: 1
              }}>
                {t('weather.visibility')}
              </Typography>
              <Typography variant="h5" sx={{ 
                fontWeight: 800,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}>
                {current.current?.visibility || 0} km
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  };

  const getForecastCards = (days: number) => {
    if (!weatherData.forecast?.forecast) {
      return (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Box sx={{ 
            display: 'flex',
            justifyContent: 'center',
            gap: 1,
            mb: 3
          }}>
            {[1, 2, 3].map((index) => (
              <Box
                key={index}
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: '#90CAF9',
                  animation: `loadingPulse ${1.5 + index * 0.2}s ease-in-out infinite`,
                  '@keyframes loadingPulse': {
                    '0%, 100%': { transform: 'scale(0.8)', opacity: 0.5 },
                    '50%': { transform: 'scale(1.2)', opacity: 1 }
                  }
                }}
              />
            ))}
          </Box>
          <Typography variant="h6" sx={{ 
            background: 'linear-gradient(135deg, #1565C0 0%, #42A5F5 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 600,
            mb: 2
          }}>
            Loading forecast data...
          </Typography>
          <Typography variant="body2" sx={{ 
            color: 'rgba(21, 101, 192, 0.7)',
            fontWeight: 500
          }}>
            Analyzing weather patterns for the coming days
          </Typography>
        </Box>
      );
    }

    const forecastData = weatherData.forecast.forecast.slice(0, days);

    return (
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { 
          xs: '1fr', 
          sm: 'repeat(auto-fit, minmax(280px, 1fr))'
        }, 
        gap: 2.5,
        '@media (min-width: 900px)': {
          gridTemplateColumns: `repeat(${Math.min(days, 5)}, 1fr)`
        }
      }}>
        {forecastData.map((day: any, index: number) => {
          const isToday = index === 0;
          const hasRain = day.precipitation > 0;
          const isHot = day.temperature?.max > 30;
          
          return (
            <Card 
              key={day.date || index} 
              sx={{ 
                height: '100%',
                minHeight: 320,
                borderRadius: 3,
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                background: isToday
                  ? 'linear-gradient(135deg, rgba(66, 165, 245, 0.15) 0%, rgba(144, 202, 249, 0.08) 50%, rgba(227, 242, 253, 0.95) 100%)'
                  : 'linear-gradient(135deg, rgba(248, 249, 250, 0.95) 0%, rgba(255, 255, 255, 0.98) 50%, rgba(227, 242, 253, 0.9) 100%)',
                border: isToday 
                  ? '2px solid rgba(66, 165, 245, 0.4)'
                  : '1px solid rgba(144, 202, 249, 0.2)',
                boxShadow: isToday 
                  ? '0 12px 40px rgba(66, 165, 245, 0.2), 0 0 0 1px rgba(66, 165, 245, 0.1)'
                  : '0 4px 20px rgba(144, 202, 249, 0.1)',
                position: 'relative',
                overflow: 'hidden',
                backdropFilter: 'blur(20px)',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: isToday 
                    ? 'linear-gradient(90deg, #42A5F5, #1E88E5, #1565C0)'
                    : 'linear-gradient(90deg, rgba(144, 202, 249, 0.5), rgba(100, 181, 246, 0.3))',
                  opacity: isToday ? 1 : 0,
                  transition: 'opacity 0.3s ease'
                },
                '&:hover': {
                  transform: 'translateY(-6px) scale(1.02)',
                  boxShadow: '0 20px 60px rgba(66, 165, 245, 0.25)',
                  borderColor: 'rgba(66, 165, 245, 0.5)',
                  '&::before': {
                    opacity: 1
                  }
                }
              }}
            >
              <CardContent sx={{ 
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative'
              }}>
                {/* Enhanced Date Header */}
                <Box sx={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2.5
                }}>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 700, 
                    color: isToday ? '#1565C0' : 'rgba(21, 101, 192, 0.8)',
                    fontSize: '1rem',
                    letterSpacing: '0.5px'
                  }}>
                    {isToday ? 'TODAY' : new Date(day.date).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    }).toUpperCase()}
                  </Typography>
                  {isToday && (
                    <Chip 
                      label="CURRENT"
                      size="small"
                      sx={{
                        background: 'linear-gradient(135deg, #42A5F5, #1E88E5)',
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '0.7rem',
                        height: 24,
                        animation: 'currentPulse 2s ease-in-out infinite',
                        '@keyframes currentPulse': {
                          '0%, 100%': { boxShadow: '0 0 0 0 rgba(66, 165, 245, 0.4)' },
                          '50%': { boxShadow: '0 0 0 8px rgba(66, 165, 245, 0)' }
                        }
                      }}
                    />
                  )}
                </Box>
                
                {/* Enhanced Weather Icon with Animation */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  mb: 3,
                  position: 'relative'
                }}>
                  <Box sx={{
                    position: 'relative',
                    transform: 'scale(1.2)',
                    filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))'
                  }}>
                    {getWeatherIcon(day.weather?.icon || '01d', 'large')}
                  </Box>
                  
                  {/* Weather condition indicator */}
                  {hasRain && (
                    <Box sx={{
                      position: 'absolute',
                      bottom: -10,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      display: 'flex',
                      gap: 0.5
                    }}>
                      {[1, 2, 3].map((i) => (
                        <WaterDrop
                          key={i}
                          sx={{
                            fontSize: 8,
                            color: '#42A5F5',
                            animation: `rainDrop ${1 + i * 0.2}s ease-in-out infinite`,
                            '@keyframes rainDrop': {
                              '0%, 100%': { opacity: 0.3, transform: 'translateY(0)' },
                              '50%': { opacity: 1, transform: 'translateY(3px)' }
                            }
                          }}
                        />
                      ))}
                    </Box>
                  )}
                </Box>
                
                {/* Weather Description */}
                <Typography variant="body2" sx={{ 
                  textAlign: 'center', 
                  mb: 3, 
                  textTransform: 'capitalize',
                  color: 'rgba(21, 101, 192, 0.8)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  lineHeight: 1.4,
                  minHeight: 36
                }}>
                  {day.weather?.description || 'Clear skies'}
                </Typography>
                
                {/* Enhanced Temperature Display */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  mb: 3,
                  p: 2,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, rgba(66, 165, 245, 0.08) 0%, rgba(227, 242, 253, 0.5) 100%)',
                  border: '1px solid rgba(66, 165, 245, 0.15)'
                }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="caption" sx={{ 
                      color: 'rgba(21, 101, 192, 0.7)',
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      High
                    </Typography>
                    <Typography variant="h5" sx={{ 
                      fontWeight: 800, 
                      color: isHot ? '#FF5722' : '#1976D2',
                      fontSize: '1.5rem',
                      lineHeight: 1,
                      textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                      {formatTemperature(day.temperature?.max || 0)}
                    </Typography>
                  </Box>
                  
                  <Box sx={{
                    width: 1,
                    height: 40,
                    background: 'linear-gradient(180deg, rgba(66, 165, 245, 0.3), rgba(66, 165, 245, 0.1))',
                    borderRadius: 0.5
                  }} />
                  
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="caption" sx={{ 
                      color: 'rgba(21, 101, 192, 0.7)',
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Low
                    </Typography>
                    <Typography variant="h6" sx={{ 
                      color: 'rgba(21, 101, 192, 0.9)',
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      lineHeight: 1
                    }}>
                      {formatTemperature(day.temperature?.min || 0)}
                    </Typography>
                  </Box>
                </Box>
                
                {/* Enhanced Weather Details */}
                <Stack spacing={1.5} sx={{ flex: 1 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    p: 1.5,
                    borderRadius: 2,
                    background: 'rgba(66, 165, 245, 0.05)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'rgba(66, 165, 245, 0.1)',
                      transform: 'translateX(4px)'
                    }
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Opacity sx={{ fontSize: 16, color: '#42A5F5' }} />
                      <Typography variant="caption" sx={{ 
                        color: 'rgba(21, 101, 192, 0.8)',
                        fontWeight: 600,
                        fontSize: '0.75rem'
                      }}>
                        Humidity
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ 
                      fontWeight: 700,
                      color: '#1565C0'
                    }}>
                      {day.humidity || 0}%
                    </Typography>
                  </Box>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    p: 1.5,
                    borderRadius: 2,
                    background: 'rgba(66, 165, 245, 0.05)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'rgba(66, 165, 245, 0.1)',
                      transform: 'translateX(4px)'
                    }
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Air sx={{ fontSize: 16, color: '#81C784' }} />
                      <Typography variant="caption" sx={{ 
                        color: 'rgba(21, 101, 192, 0.8)',
                        fontWeight: 600,
                        fontSize: '0.75rem'
                      }}>
                        Wind
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ 
                      fontWeight: 700,
                      color: '#1565C0'
                    }}>
                      {day.windSpeed || 0} km/h
                    </Typography>
                  </Box>
                  
                  {hasRain && (
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      p: 1.5,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, rgba(66, 165, 245, 0.1), rgba(30, 136, 229, 0.05))',
                      border: '1px solid rgba(66, 165, 245, 0.2)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'linear-gradient(135deg, rgba(66, 165, 245, 0.15), rgba(30, 136, 229, 0.08))',
                        transform: 'translateX(4px)'
                      }
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <WaterDrop sx={{ fontSize: 16, color: '#42A5F5' }} />
                        <Typography variant="caption" sx={{ 
                          color: 'rgba(21, 101, 192, 0.8)',
                          fontWeight: 600,
                          fontSize: '0.75rem'
                        }}>
                          Precipitation
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ 
                        fontWeight: 700,
                        color: '#1976D2'
                      }}>
                        {day.precipitation} mm
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    );
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
          <CircularProgress size={60} sx={{ color: '#1976D2', mb: 3 }} />
          <Typography variant="h6" sx={{ mb: 1, color: '#1565C0' }}>
            {t('weather.loadingWeatherData')}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {t('weather.gettingLatestInfo')}
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <WeatherThemeProvider>
      <Container maxWidth="xl" sx={{ 
        py: 4,
        px: 3,
        minHeight: '100vh',
        background: `linear-gradient(135deg, 
          rgba(240, 248, 255, 0.95) 0%, 
          rgba(227, 242, 253, 0.9) 20%,
          rgba(187, 222, 251, 0.8) 40%, 
          rgba(144, 202, 249, 0.7) 60%,
          rgba(100, 181, 246, 0.8) 80%,
          rgba(66, 165, 245, 0.9) 100%)`,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.3) 0%, transparent 30%),
            radial-gradient(circle at 80% 70%, rgba(144, 202, 249, 0.4) 0%, transparent 40%),
            radial-gradient(circle at 50% 50%, rgba(187, 222, 251, 0.2) 0%, transparent 50%)
          `,
          opacity: 0.6,
          pointerEvents: 'none',
          zIndex: 0,
          animation: 'cloudFloat 20s ease-in-out infinite',
          '@keyframes cloudFloat': {
            '0%, 100%': { transform: 'translateX(0) translateY(0)' },
            '25%': { transform: 'translateX(10px) translateY(-5px)' },
            '50%': { transform: 'translateX(-5px) translateY(10px)' },
            '75%': { transform: 'translateX(-10px) translateY(-5px)' }
          }
        },
        '&::after': {
          content: '""',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%2390CAF9" fill-opacity="0.03"%3E%3Ccircle cx="20" cy="20" r="2"/%3E%3Ccircle cx="80" cy="80" r="2"/%3E%3Ccircle cx="50" cy="30" r="1.5"/%3E%3Ccircle cx="30" cy="70" r="1.5"/%3E%3Ccircle cx="70" cy="50" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.4,
          pointerEvents: 'none',
          zIndex: 0,
          animation: 'sparkle 8s ease-in-out infinite',
          '@keyframes sparkle': {
            '0%, 100%': { opacity: 0.4 },
            '50%': { opacity: 0.7 }
          }
        }
      }}>
        {/* Enhanced Hero Header */}
        <Box sx={{ 
          textAlign: 'center', 
          mb: 6,
          position: 'relative',
          zIndex: 1
        }}>
          <Box sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3,
            position: 'relative'
          }}>
            <Badge 
              badgeContent="LIVE"
              color="primary"
              sx={{
                '& .MuiBadge-badge': {
                  background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '0.65rem',
                  height: 18,
                  minWidth: 18,
                  borderRadius: 2,
                  animation: 'livePulse 2s ease-in-out infinite',
                  boxShadow: '0 2px 8px rgba(25, 118, 210, 0.4)'
                },
                '@keyframes livePulse': {
                  '0%, 100%': { transform: 'scale(1)' },
                  '50%': { transform: 'scale(1.1)' }
                }
              }}
            >
              <Box sx={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(66, 165, 245, 0.15) 0%, rgba(144, 202, 249, 0.1) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 12px 40px rgba(66, 165, 245, 0.2)',
                border: '2px solid rgba(66, 165, 245, 0.2)',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: -4,
                  left: -4,
                  right: -4,
                  bottom: -4,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(66, 165, 245, 0.3), rgba(144, 202, 249, 0.1))',
                  opacity: 0,
                  animation: 'weatherPulse 3s ease-in-out infinite',
                  '@keyframes weatherPulse': {
                    '0%, 100%': { opacity: 0, transform: 'scale(1)' },
                    '50%': { opacity: 1, transform: 'scale(1.1)' }
                  }
                },
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 20px 60px rgba(66, 165, 245, 0.3)'
                },
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
              }}>
                <WbSunny sx={{ 
                  fontSize: 48, 
                  background: 'linear-gradient(135deg, #FFB74D 0%, #FFA726 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 4px 8px rgba(255, 183, 77, 0.3))',
                  animation: 'iconFloat 4s ease-in-out infinite',
                  '@keyframes iconFloat': {
                    '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
                    '50%': { transform: 'translateY(-8px) rotate(180deg)' }
                  }
                }} />
              </Box>
            </Badge>
          </Box>
          
          <Typography variant={isMobile ? 'h3' : 'h1'} sx={{ 
            fontWeight: 900,
            background: `linear-gradient(135deg, #0D47A1 0%, #1565C0 25%, #1976D2 50%, #42A5F5 75%, #90CAF9 100%)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2,
            textShadow: '0 8px 16px rgba(66, 165, 245, 0.3)',
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem', lg: '5.5rem' },
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -10,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '60%',
              height: 4,
              background: 'linear-gradient(90deg, transparent, rgba(66, 165, 245, 0.3), transparent)',
              borderRadius: 2
            }
          }}>
            Weather Insights
          </Typography>
          
          <Typography variant="h5" sx={{ 
            color: 'rgba(13, 71, 161, 0.8)',
            fontWeight: 500,
            maxWidth: 800,
            mx: 'auto',
            opacity: 0.9,
            lineHeight: 1.6,
            px: 2,
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(227, 242, 253, 0.6) 100%)',
            borderRadius: 3,
            py: 2,
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(66, 165, 245, 0.1)',
            boxShadow: '0 4px 20px rgba(66, 165, 245, 0.1)',
            '& .highlight': {
              background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700
            }
          }}>
            <span className="highlight">Real-time atmospheric data</span> and intelligent forecasts to optimize your agricultural planning and decision-making
          </Typography>
        </Box>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 4, 
              borderRadius: 3,
              backgroundColor: 'rgba(244, 67, 54, 0.08)',
              border: '1px solid rgba(244, 67, 54, 0.2)',
              position: 'relative',
              zIndex: 1,
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 20px rgba(244, 67, 54, 0.1)'
            }}
          >
            {error}
          </Alert>
        )}

        {/* Current Weather Card */}
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          {getCurrentWeatherCard()}
        </Box>

        {/* Enhanced Navigation Tabs */}
        <Box sx={{ 
          borderBottom: 1, 
          borderColor: 'rgba(66, 165, 245, 0.15)', 
          mb: 4,
          position: 'sticky',
          top: 0,
          bgcolor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(30px)',
          zIndex: 10,
          borderRadius: '20px 20px 0 0',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(66, 165, 245, 0.15)',
          border: '1px solid rgba(66, 165, 245, 0.1)'
        }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            variant={isMobile ? "scrollable" : "fullWidth"}
            scrollButtons={isMobile ? "auto" : false}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.95rem',
                minHeight: 72,
                py: 2.5,
                px: 4,
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                color: 'rgba(13, 71, 161, 0.7)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, rgba(66, 165, 245, 0.08) 0%, rgba(144, 202, 249, 0.04) 100%)',
                  opacity: 0,
                  transition: 'opacity 0.3s ease'
                },
                '&:hover': {
                  color: '#1976d2',
                  transform: 'translateY(-2px)',
                  '&::before': {
                    opacity: 1
                  }
                },
                '&.Mui-selected': {
                  color: '#0D47A1',
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, rgba(66, 165, 245, 0.12) 0%, rgba(144, 202, 249, 0.06) 100%)',
                  '&::before': {
                    opacity: 1
                  }
                }
              },
              '& .MuiTabs-indicator': {
                height: 4,
                borderRadius: '4px 4px 0 0',
                background: `linear-gradient(90deg, #0D47A1 0%, #1565C0 25%, #1976D2 50%, #42A5F5 75%, #90CAF9 100%)`,
                boxShadow: '0 4px 12px rgba(66, 165, 245, 0.4)',
                transition: 'all 0.3s ease'
              },
              '& .MuiSvgIcon-root': {
                fontSize: 22,
                margin: '0 8px'
              }
            }}
          >
            <Tab 
              label="3-Day Forecast" 
              icon={<CalendarToday />} 
              iconPosition="start"
            />
            <Tab 
              label="7-Day Outlook" 
              icon={<TrendingUp />} 
              iconPosition="start"
            />
            <Tab 
              label="15-Day Extended" 
              icon={<Brightness6 />} 
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {/* Tab Panels */}
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <TabPanel value={tabValue} index={0}>
            <Typography variant="h4" sx={{ 
              mb: 4, 
              fontWeight: 800,
              background: 'linear-gradient(135deg, #0D47A1 0%, #1976D2 50%, #42A5F5 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              textShadow: '0 4px 8px rgba(66, 165, 245, 0.3)'
            }}>
              <CalendarToday sx={{ fontSize: 32, color: '#1976D2' }} />
              3-Day Forecast
            </Typography>
            {getForecastCards(3)}
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Typography variant="h4" sx={{ 
              mb: 4, 
              fontWeight: 800,
              background: 'linear-gradient(135deg, #0D47A1 0%, #1976D2 50%, #42A5F5 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              textShadow: '0 4px 8px rgba(66, 165, 245, 0.3)'
            }}>
              <TrendingUp sx={{ fontSize: 32, color: '#1976D2' }} />
              7-Day Outlook
            </Typography>
            {getForecastCards(7)}
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Typography variant="h4" sx={{ 
              mb: 4, 
              fontWeight: 800,
              background: 'linear-gradient(135deg, #0D47A1 0%, #1976D2 50%, #42A5F5 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              textShadow: '0 4px 8px rgba(66, 165, 245, 0.3)'
            }}>
              <Brightness6 sx={{ fontSize: 32, color: '#1976D2' }} />
              15-Day Extended Forecast
            </Typography>
            {getForecastCards(15)}
          </TabPanel>
        </Box>

        {/* Enhanced Location Selection Dialog */}
        <Dialog 
          open={locationDialogOpen} 
          onClose={handleLocationDialogClose}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 4,
              background: `linear-gradient(135deg, rgba(240, 248, 255, 0.98) 0%, rgba(255, 255, 255, 0.95) 100%)`,
              backdropFilter: 'blur(40px)',
              border: '1px solid rgba(66, 165, 245, 0.2)',
              boxShadow: '0 24px 80px rgba(66, 165, 245, 0.2)',
              overflow: 'hidden',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background: 'linear-gradient(90deg, #42A5F5, #1E88E5, #1565C0)',
              }
            }
          }}
        >
          <DialogTitle sx={{ 
            textAlign: 'center', 
            pb: 2,
            pt: 4,
            background: `linear-gradient(135deg, #0D47A1 0%, #1976D2 100%)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 800,
            fontSize: '1.5rem',
            position: 'relative'
          }}>
            <LocationIcon sx={{ 
              fontSize: 32, 
              color: '#1976D2', 
              mr: 1,
              animation: 'locationBounce 2s ease-in-out infinite',
              '@keyframes locationBounce': {
                '0%, 100%': { transform: 'translateY(0)' },
                '50%': { transform: 'translateY(-4px)' }
              }
            }} />
            Choose Your Location
          </DialogTitle>
          <DialogContent sx={{ pt: 3, pb: 2 }}>
            <Stack spacing={4}>
              {/* Popular Cities */}
              <Box>
                <Typography variant="h6" sx={{ 
                  fontWeight: 700, 
                  mb: 2.5, 
                  color: '#1565C0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <WbSunny sx={{ fontSize: 24, color: '#FFB74D' }} />
                  Popular Cities
                </Typography>
                <Autocomplete
                  options={POPULAR_CITIES}
                  getOptionLabel={(option) => `${option.name}, ${option.country}`}
                  value={selectedCity}
                  onChange={(event, value) => {
                    setSelectedCity(value);
                    if (value) handleCitySelect(value);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search Cities"
                      variant="outlined"
                      placeholder="Type to search..."
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          background: 'rgba(255, 255, 255, 0.8)',
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#42A5F5'
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#1976D2',
                            borderWidth: 2
                          }
                        }
                      }}
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: <SearchIcon sx={{ mr: 1, color: '#1976D2' }} />
                      }}
                    />
                  )}
                />
              </Box>

              <Divider sx={{ 
                borderColor: 'rgba(66, 165, 245, 0.2)',
                '&::before, &::after': {
                  borderColor: 'rgba(66, 165, 245, 0.2)'
                }
              }} />

              {/* Custom Coordinates */}
              <Box>
                <Typography variant="h6" sx={{ 
                  fontWeight: 700, 
                  mb: 2.5, 
                  color: '#1565C0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <Navigation sx={{ fontSize: 24, color: '#42A5F5' }} />
                  Custom Coordinates
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
                  <TextField
                    label="Latitude"
                    type="number"
                    value={customLatitude}
                    onChange={(e) => setCustomLatitude(e.target.value)}
                    placeholder="e.g., 28.6139"
                    inputProps={{ step: 0.0001, min: -90, max: 90 }}
                    helperText="Range: -90 to 90"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        background: 'rgba(255, 255, 255, 0.8)'
                      }
                    }}
                  />
                  <TextField
                    label="Longitude"
                    type="number"
                    value={customLongitude}
                    onChange={(e) => setCustomLongitude(e.target.value)}
                    placeholder="e.g., 77.2090"
                    inputProps={{ step: 0.0001, min: -180, max: 180 }}
                    helperText="Range: -180 to 180"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        background: 'rgba(255, 255, 255, 0.8)'
                      }
                    }}
                  />
                </Box>
                <Button
                  onClick={handleCustomLocationSet}
                  variant="outlined"
                  startIcon={<SearchIcon />}
                  fullWidth
                  disabled={!customLatitude || !customLongitude}
                  sx={{
                    borderRadius: 3,
                    py: 1.5,
                    borderColor: '#42A5F5',
                    color: '#1976D2',
                    fontWeight: 600,
                    background: 'rgba(66, 165, 245, 0.04)',
                    '&:hover': {
                      borderColor: '#1976D2',
                      bgcolor: 'rgba(66, 165, 245, 0.08)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(66, 165, 245, 0.2)'
                    },
                    '&:disabled': {
                      borderColor: 'rgba(0, 0, 0, 0.12)',
                      color: 'rgba(0, 0, 0, 0.26)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Use Custom Coordinates
                </Button>
              </Box>

              <Divider sx={{ 
                borderColor: 'rgba(66, 165, 245, 0.2)',
                '&::before, &::after': {
                  borderColor: 'rgba(66, 165, 245, 0.2)'
                }
              }} />

              {/* Current Location Option */}
              <Box>
                <Typography variant="h6" sx={{ 
                  fontWeight: 700, 
                  mb: 2.5, 
                  color: '#1565C0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <MyLocation sx={{ fontSize: 24, color: '#66BB6A' }} />
                  Device Location
                </Typography>
                <Button
                  onClick={() => {
                    getCurrentLocation();
                    setLocationDialogOpen(false);
                  }}
                  variant="contained"
                  startIcon={gettingLocation ? <CircularProgress size={16} color="inherit" /> : <MyLocation />}
                  fullWidth
                  disabled={gettingLocation}
                  sx={{ 
                    borderRadius: 3,
                    py: 1.5,
                    background: 'linear-gradient(135deg, #42A5F5 0%, #1E88E5 100%)',
                    fontWeight: 600,
                    boxShadow: '0 4px 16px rgba(66, 165, 245, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1E88E5 0%, #1565C0 100%)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 6px 20px rgba(66, 165, 245, 0.4)'
                    },
                    '&:disabled': {
                      background: 'rgba(0, 0, 0, 0.12)',
                      color: 'rgba(0, 0, 0, 0.26)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  {gettingLocation ? 'Getting Your Location...' : 'Use My Current Location'}
                </Button>
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button 
              onClick={handleLocationDialogClose} 
              color="inherit"
              sx={{
                borderRadius: 3,
                px: 4,
                py: 1,
                fontWeight: 600,
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.04)',
                  transform: 'translateY(-1px)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        {/* Enhanced Floating Action Button */}
        <Fab
          onClick={handleLocationDialogOpen}
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            width: 72,
            height: 72,
            background: `linear-gradient(135deg, #42A5F5 0%, #1E88E5 100%)`,
            color: 'white',
            boxShadow: '0 12px 32px rgba(66, 165, 245, 0.4)',
            border: '3px solid rgba(255, 255, 255, 0.2)',
            '&:hover': {
              background: `linear-gradient(135deg, #1E88E5 0%, #1565C0 100%)`,
              transform: 'scale(1.1) translateY(-4px)',
              boxShadow: '0 20px 48px rgba(66, 165, 245, 0.5)'
            },
            '&:active': {
              transform: 'scale(1.05) translateY(-2px)'
            },
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: 1000,
            animation: 'fabFloat 4s ease-in-out infinite',
            '@keyframes fabFloat': {
              '0%, 100%': { transform: 'translateY(0) scale(1)' },
              '50%': { transform: 'translateY(-8px) scale(1.02)' }
            }
          }}
        >
          <LocationIcon sx={{ fontSize: 32 }} />
        </Fab>
      </Container>
    </WeatherThemeProvider>
  );
};

export default WeatherPage;
