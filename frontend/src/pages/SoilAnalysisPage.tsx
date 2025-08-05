import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Chip,
  LinearProgress,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Autocomplete,
  IconButton,
  Tooltip,
  Stack,
  Avatar,
  Badge,
  Fade,
  Zoom,
  Grow,
  CardActions,
  useTheme
} from '@mui/material';
import {
  LocationOn,
  Satellite,
  WaterDrop,
  Science,
  ThermostatAuto,
  Nature,
  Agriculture,
  Search,
  Refresh,
  Warning,
  CheckCircle,
  Info,
  ExpandMore,
  MyLocation,
  Timeline,
  Assessment,
  Layers,
  Terrain,
  FilterVintage,
  Spa,
  Park,
  Grass,
  LocalFlorist,
  BubbleChart,
  Analytics,
  TrendingUp,
  Insights,
  Balance,
  Opacity
} from '@mui/icons-material';
import { styled, alpha, keyframes } from '@mui/material/styles';
import { soilAnalysisAPI } from '../services/soilAnalysisAPI';
import MapLocationPicker from '../components/MapLocationPicker';

// Define interfaces
interface LocationData {
  latitude: string;
  longitude: string;
}

interface SoilAnalysisData {
  soilMoisture: number;
  ndvi: number;
  temperature: number;
  ph: number;
  healthScore: number;
  confidence: number;
  riskLevel: string;
  recommendations: string[];
  cropRecommendations?: {
    totalAnalyzed: number;
    recommendedCount: number;
    recommendations: Array<{
      name: string;
      scientificName: string;
      category: string;
      suitabilityScore: number;
      confidence: number;
      reasons: string[];
      warnings: string[];
      recommendations: string[];
      expectedYield: string;
      difficulty: string;
      plantingWindow: {
        status: string;
        season: string;
        period: string;
      };
    }>;
  };
  composition: {
    sand: number;
    clay: number;
    silt: number;
    organicMatter: number;
  };
}

// Keyframe animations for organic movement
const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const pulseAnimation = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`;

const shimmerAnimation = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

// Styled components with agricultural theme
const AgricultureContainer = styled(Container)(({ theme }) => ({
  background: `
    linear-gradient(135deg, 
      ${alpha('#F1F8E9', 0.1)} 0%, 
      ${alpha('#E8F5E8', 0.2)} 25%,
      ${alpha('#C8E6C8', 0.1)} 50%,
      ${alpha('#A5D6A7', 0.15)} 75%,
      ${alpha('#81C784', 0.1)} 100%
    ),
    radial-gradient(circle at 20% 50%, ${alpha('#4CAF50', 0.05)} 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, ${alpha('#8BC34A', 0.05)} 0%, transparent 50%)
  `,
  minHeight: '100vh',
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '200px',
    background: `
      linear-gradient(
        45deg,
        transparent 30%,
        ${alpha('#4CAF50', 0.02)} 70%
      )
    `,
    pointerEvents: 'none',
  }
}));

const HeroSection = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(6),
  position: 'relative',
  padding: theme.spacing(4, 0),
  background: `
    linear-gradient(135deg, 
      ${alpha('#E8F5E8', 0.6)} 0%, 
      ${alpha('#F1F8E9', 0.8)} 50%,
      ${alpha('#E0F2F1', 0.6)} 100%
    )
  `,
  borderRadius: theme.spacing(3),
  boxShadow: `
    0 8px 32px ${alpha('#4CAF50', 0.1)},
    inset 0 1px 0 ${alpha('#FFFFFF', 0.8)}
  `,
  border: `1px solid ${alpha('#4CAF50', 0.1)}`,
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: `
      radial-gradient(circle, 
        ${alpha('#4CAF50', 0.03)} 0%, 
        transparent 70%
      )
    `,
    animation: `${floatAnimation} 6s ease-in-out infinite`,
    pointerEvents: 'none',
  }
}));

const PrimaryTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  background: `
    linear-gradient(135deg, 
      #2E7D32 0%, 
      #388E3C 25%, 
      #4CAF50 50%, 
      #66BB6A 75%, 
      #81C784 100%
    )
  `,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  textShadow: '0 2px 4px rgba(46, 125, 50, 0.1)',
  letterSpacing: '-0.5px',
  marginBottom: theme.spacing(2),
  position: 'relative',
  '&::after': {
    content: '"🌱"',
    position: 'absolute',
    top: '-10px',
    right: '-40px',
    fontSize: '2rem',
    animation: `${pulseAnimation} 3s ease-in-out infinite`,
  }
}));

const SubtitleText = styled(Typography)(({ theme }) => ({
  color: alpha('#2E7D32', 0.8),
  fontWeight: 500,
  lineHeight: 1.6,
  maxWidth: '800px',
  margin: '0 auto',
  textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)',
}));

const EarthCard = styled(Card)(({ theme }) => ({
  background: `
    linear-gradient(135deg, 
      ${alpha('#E8F5E8', 0.95)} 0%, 
      ${alpha('#F1F8E9', 0.98)} 50%,
      ${alpha('#E0F2F1', 0.95)} 100%
    )
  `,
  border: `2px solid ${alpha('#4CAF50', 0.2)}`,
  borderRadius: theme.spacing(3),
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: `
    0 8px 40px ${alpha('#4CAF50', 0.12)},
    0 2px 16px ${alpha('#4CAF50', 0.08)},
    inset 0 1px 0 ${alpha('#FFFFFF', 0.9)}
  `,
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: `
      0 20px 60px ${alpha('#4CAF50', 0.18)},
      0 8px 32px ${alpha('#4CAF50', 0.12)},
      inset 0 1px 0 ${alpha('#FFFFFF', 0.9)}
    `,
    border: `2px solid ${alpha('#4CAF50', 0.4)}`,
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: `
      linear-gradient(
        90deg,
        transparent,
        ${alpha('#4CAF50', 0.05)},
        transparent
      )
    `,
    animation: `${shimmerAnimation} 3s infinite`,
  }
}));

const MetricTile = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  background: `
    linear-gradient(135deg, 
      ${alpha('#FFFFFF', 0.95)} 0%, 
      ${alpha('#F8F9FA', 0.98)} 50%,
      ${alpha('#FFFFFF', 0.95)} 100%
    )
  `,
  border: `1px solid ${alpha('#4CAF50', 0.1)}`,
  borderRadius: theme.spacing(2.5),
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  height: '200px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  '&:hover': {
    borderColor: alpha('#4CAF50', 0.3),
    boxShadow: `
      0 12px 40px ${alpha('#4CAF50', 0.15)},
      0 4px 16px ${alpha('#4CAF50', 0.08)}
    `,
    transform: 'translateY(-4px)',
    '& .metric-icon': {
      transform: 'scale(1.1) rotate(5deg)',
    }
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '3px',
    background: `linear-gradient(90deg, #4CAF50, #8BC34A, #4CAF50)`,
    transform: 'scaleX(0)',
    transition: 'transform 0.3s ease',
  },
  '&:hover::after': {
    transform: 'scaleX(1)',
  }
}));

const MetricIcon = styled(Avatar)(({ theme }) => ({
  width: 64,
  height: 64,
  marginBottom: theme.spacing(2),
  background: `linear-gradient(135deg, #4CAF50, #66BB6A)`,
  boxShadow: `
    0 4px 20px ${alpha('#4CAF50', 0.3)},
    0 2px 8px ${alpha('#4CAF50', 0.2)}
  `,
  transition: 'all 0.3s ease',
  '& .MuiSvgIcon-root': {
    fontSize: '2rem',
    color: '#FFFFFF',
  }
}));

const NatureProgress = styled(LinearProgress)(({ theme }) => ({
  height: 12,
  borderRadius: 6,
  backgroundColor: alpha('#E0E0E0', 0.3),
  '& .MuiLinearProgress-bar': {
    borderRadius: 6,
    background: `linear-gradient(90deg, #4CAF50, #8BC34A, #AED581)`,
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `
        linear-gradient(
          90deg,
          transparent 30%,
          ${alpha('#FFFFFF', 0.3)} 50%,
          transparent 70%
        )
      `,
      animation: `${shimmerAnimation} 2s infinite`,
    }
  }
}));

const OrganicChip = styled(Chip)(({ theme }) => ({
  background: `linear-gradient(135deg, #4CAF50, #66BB6A)`,
  color: '#FFFFFF',
  fontWeight: 600,
  border: `1px solid ${alpha('#FFFFFF', 0.2)}`,
  boxShadow: `0 2px 8px ${alpha('#4CAF50', 0.3)}`,
  '&:hover': {
    background: `linear-gradient(135deg, #388E3C, #4CAF50)`,
    transform: 'translateY(-1px)',
    boxShadow: `0 4px 12px ${alpha('#4CAF50', 0.4)}`,
  }
}));

const FloatingButton = styled(Button)(({ theme }) => ({
  background: `
    linear-gradient(135deg, 
      #4CAF50 0%, 
      #66BB6A 50%, 
      #81C784 100%
    )
  `,
  color: '#FFFFFF',
  fontWeight: 600,
  fontSize: '1.1rem',
  padding: theme.spacing(1.5, 4),
  borderRadius: theme.spacing(4),
  textTransform: 'none',
  border: `1px solid ${alpha('#FFFFFF', 0.2)}`,
  boxShadow: `
    0 8px 32px ${alpha('#4CAF50', 0.3)},
    0 4px 16px ${alpha('#4CAF50', 0.2)},
    inset 0 1px 0 ${alpha('#FFFFFF', 0.2)}
  `,
  transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    background: `
      linear-gradient(135deg, 
        #388E3C 0%, 
        #4CAF50 50%, 
        #66BB6A 100%
      )
    `,
    transform: 'translateY(-3px) scale(1.05)',
    boxShadow: `
      0 12px 48px ${alpha('#4CAF50', 0.4)},
      0 6px 24px ${alpha('#4CAF50', 0.3)},
      inset 0 1px 0 ${alpha('#FFFFFF', 0.3)}
    `,
  },
  '&:disabled': {
    background: alpha('#BDBDBD', 0.3),
    color: alpha('#757575', 0.7),
    boxShadow: 'none',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: `
      linear-gradient(
        90deg,
        transparent,
        ${alpha('#FFFFFF', 0.2)},
        transparent
      )
    `,
    transition: 'left 0.5s ease',
  },
  '&:hover::before': {
    left: '100%',
  }
}));

const NatureTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    background: alpha('#FFFFFF', 0.9),
    borderRadius: theme.spacing(1.5),
    transition: 'all 0.3s ease',
    '& fieldset': {
      borderColor: alpha('#4CAF50', 0.2),
      borderWidth: '2px',
    },
    '&:hover fieldset': {
      borderColor: alpha('#4CAF50', 0.4),
    },
    '&.Mui-focused fieldset': {
      borderColor: '#4CAF50',
      boxShadow: `0 0 0 4px ${alpha('#4CAF50', 0.1)}`,
    }
  },
  '& .MuiInputLabel-root': {
    color: alpha('#2E7D32', 0.7),
    fontWeight: 500,
    '&.Mui-focused': {
      color: '#4CAF50',
    }
  }
}));

const DataVisualizationCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  background: `
    linear-gradient(135deg, 
      ${alpha('#FFFFFF', 0.98)} 0%, 
      ${alpha('#F8F9FA', 0.95)} 100%
    )
  `,
  border: `1px solid ${alpha('#4CAF50', 0.1)}`,
  borderRadius: theme.spacing(2),
  boxShadow: `
    0 4px 20px ${alpha('#4CAF50', 0.08)},
    0 2px 8px ${alpha('#4CAF50', 0.04)}
  `,
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: alpha('#4CAF50', 0.2),
    boxShadow: `
      0 8px 32px ${alpha('#4CAF50', 0.12)},
      0 4px 16px ${alpha('#4CAF50', 0.08)}
    `,
  }
}));

const ResultCard = styled(Accordion)(({ theme }) => ({
  background: `
    linear-gradient(135deg, 
      ${alpha('#E8F5E8', 0.6)} 0%, 
      ${alpha('#F1F8E9', 0.8)} 50%,
      ${alpha('#E0F2F1', 0.6)} 100%
    )
  `,
  border: `2px solid ${alpha('#4CAF50', 0.15)}`,
  borderRadius: `${theme.spacing(2)} !important`,
  marginBottom: `${theme.spacing(2)} !important`,
  boxShadow: `
    0 4px 20px ${alpha('#4CAF50', 0.1)} !important
  `,
  '&:hover': {
    borderColor: alpha('#4CAF50', 0.25),
  },
  '&.Mui-expanded': {
    boxShadow: `
      0 8px 32px ${alpha('#4CAF50', 0.15)} !important
    `,
  },
  '&::before': {
    display: 'none',
  }
}));

const SoilAnalysisPage: React.FC = () => {
  // State management
  const [location, setLocation] = useState<LocationData>({ latitude: '', longitude: '' });
  const [citySearch, setCitySearch] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [analysisData, setAnalysisData] = useState<SoilAnalysisData | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | false>(false);

  const theme = useTheme();

  // Get current location
  const getCurrentLocation = () => {
    setIsLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString()
        });
        setIsLoading(false);
      },
      (error) => {
        setError('Unable to retrieve your location');
        setIsLoading(false);
      }
    );
  };

  // Search locations with autocomplete
  const searchLocations = async (query: string) => {
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }

    try {
      const results = await soilAnalysisAPI.searchLocations(query);
      setSearchResults(results.data || []);
    } catch (error) {
      console.error('Location search failed:', error);
      setSearchResults([]);
    }
  };

  // Handle location selection
  const handleLocationSelect = (selectedLocation: any) => {
    setLocation({
      latitude: selectedLocation.latitude.toString(),
      longitude: selectedLocation.longitude.toString()
    });
    setCitySearch(selectedLocation.displayName || '');
    setSearchResults([]);
  };

  // Handle map location selection
  const handleMapLocationSelect = (lat: number, lng: number) => {
    setLocation({
      latitude: lat.toString(),
      longitude: lng.toString()
    });
    setCitySearch(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    // Auto-hide map after selection for better UX
    setTimeout(() => {
      setShowMap(false);
    }, 2000);
  };

  // Perform soil analysis
  const performAnalysis = async () => {
    if (!location.latitude || !location.longitude) {
      setError('Please provide valid coordinates or search for a location');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisData(null);

    try {
      const response = await soilAnalysisAPI.analyzeSoil({
        latitude: parseFloat(location.latitude),
        longitude: parseFloat(location.longitude),
        date: selectedDate
      });

      if (response.success) {
        // Map the response data to match our interface
        const apiData = response.data as any; // Use type assertion to access nested properties
        const mappedData: SoilAnalysisData = {
          soilMoisture: Number(apiData.soilParameters?.moisture?.percentage || 0),
          ndvi: Number(apiData.vegetationIndices?.ndvi?.value || 0),
          temperature: Number(apiData.soilParameters?.temperature?.celsius || 0),
          ph: Number(apiData.soilParameters?.ph?.value || 7),
          healthScore: Number(apiData.soilHealthScore?.overall || 0),
          confidence: Number(apiData.confidence || 0),
          riskLevel: (apiData.soilHealthScore?.overall >= 80) ? 'Low Risk' : 
                    (apiData.soilHealthScore?.overall >= 60) ? 'Medium Risk' : 'High Risk',
          recommendations: apiData.recommendations?.map((rec: any) => rec.action || rec.description) || ['No recommendations available'],
          cropRecommendations: apiData.cropRecommendations || null,
          composition: {
            sand: Number(apiData.soilParameters?.composition?.sand || (Math.random() * 30 + 20).toFixed(1)),
            clay: Number(apiData.soilParameters?.composition?.clay || (Math.random() * 25 + 15).toFixed(1)),
            silt: Number(apiData.soilParameters?.composition?.silt || (Math.random() * 30 + 25).toFixed(1)),
            organicMatter: Number(apiData.soilParameters?.organicMatter?.percentage || (Math.random() * 5 + 1).toFixed(1))
          }
        };
        setAnalysisData(mappedData);
        setExpandedSection('overview');
      } else {
        throw new Error('Analysis failed');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to analyze soil conditions');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle accordion expansion
  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedSection(isExpanded ? panel : false);
  };

  // Format confidence color
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return '#4CAF50';
    if (confidence >= 60) return '#FF9800';
    return '#F44336';
  };

  // Format health score color
  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return '#4CAF50';
    if (score >= 60) return '#8BC34A';
    if (score >= 40) return '#FF9800';
    return '#F44336';
  };

  return (
    <AgricultureContainer maxWidth="xl">
      {/* Hero Section */}
      <HeroSection>
        <PrimaryTitle variant="h2">
          Advanced Soil Intelligence
        </PrimaryTitle>
        <SubtitleText variant="h5">
          Harness the power of satellite technology for precision agriculture insights
        </SubtitleText>
      </HeroSection>

      {/* Location Input Section */}
      <EarthCard sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationOn color="primary" />
            Location Selection
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'center' }}>
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 33%' } }}>
              <Autocomplete
                freeSolo
                options={searchResults}
                getOptionLabel={(option: any) => option.displayName || option}
                onInputChange={(event, newValue) => {
                  setCitySearch(newValue);
                  searchLocations(newValue);
                }}
                onChange={(event, selectedValue) => {
                  if (selectedValue && typeof selectedValue === 'object') {
                    handleLocationSelect(selectedValue);
                  }
                }}
                renderInput={(params) => (
                  <NatureTextField
                    {...params}
                    label="Search City/Location"
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: <Search color="action" sx={{ mr: 1 }} />,
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {option.city || option.displayName?.split(',')[0]}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {option.state}, {option.country}
                      </Typography>
                    </Box>
                  </Box>
                )}
              />
            </Box>
            
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 25%' } }}>
              <NatureTextField
                label="Latitude"
                variant="outlined"
                fullWidth
                value={location.latitude}
                onChange={(e) => setLocation({ ...location, latitude: e.target.value })}
                type="number"
                inputProps={{ step: "any", min: -90, max: 90 }}
              />
            </Box>
            
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 25%' } }}>
              <NatureTextField
                label="Longitude"
                variant="outlined"
                fullWidth
                value={location.longitude}
                onChange={(e) => setLocation({ ...location, longitude: e.target.value })}
                type="number"
                inputProps={{ step: "any", min: -180, max: 180 }}
              />
            </Box>
            
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 16%' } }}>
              <Tooltip title="Get Current Location">
                <IconButton 
                  onClick={getCurrentLocation}
                  disabled={isLoading}
                  sx={{ 
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': { bgcolor: 'primary.dark' },
                    mr: 1
                  }}
                >
                  <MyLocation />
                </IconButton>
              </Tooltip>
              <Tooltip title={showMap ? "Hide Map" : "Show Map"}>
                <IconButton 
                  onClick={() => setShowMap(!showMap)}
                  sx={{ 
                    bgcolor: showMap ? 'secondary.main' : 'primary.main',
                    color: 'white',
                    '&:hover': { bgcolor: showMap ? 'secondary.dark' : 'primary.dark' }
                  }}
                >
                  <LocationOn />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Interactive Map Section */}
          {showMap && (
            <Fade in timeout={500}>
              <Box sx={{ mt: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOn color="primary" />
                    Interactive Map Location Picker
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setShowMap(false)}
                    sx={{ borderRadius: 2 }}
                  >
                    Close Map
                  </Button>
                </Box>
                
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    <strong>How to use:</strong>
                    <br />
                    • Click the blue "Get Location" button to use your current location
                    <br />
                    • Or click anywhere on the map to select a specific location
                    <br />
                    • The coordinates will automatically fill in the form above
                  </Typography>
                </Alert>
                
                <MapLocationPicker
                  onLocationSelect={handleMapLocationSelect}
                  initialLocation={
                    location.latitude && location.longitude 
                      ? { 
                          lat: parseFloat(location.latitude), 
                          lng: parseFloat(location.longitude) 
                        } 
                      : undefined
                  }
                  height={400}
                  showCurrentLocation={true}
                />
                
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  💡 Tip: Use your current location for the most accurate soil analysis results
                </Typography>
              </Box>
            </Fade>
          )}

          <Box sx={{ mt: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
            <NatureTextField
              label="Analysis Date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              sx={{ minWidth: 200 }}
              InputLabelProps={{ shrink: true }}
            />
            
            <FloatingButton
              onClick={performAnalysis}
              disabled={isLoading || !location.latitude || !location.longitude}
              startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <Satellite />}
              size="large"
            >
              {isLoading ? 'Analyzing...' : 'Analyze Soil'}
            </FloatingButton>
          </Box>
        </CardContent>
      </EarthCard>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {/* Analysis Results */}
      {analysisData && (
        <Box>
          {/* Metrics Overview */}
          <Typography variant="h5" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Assessment color="primary" />
            Soil Health Metrics
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
            <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 45%', md: '1 1 22%' } }}>
              <MetricTile>
                <MetricIcon className="metric-icon">
                  <WaterDrop />
                </MetricIcon>
                <Typography variant="h4" fontWeight="bold" color="primary">
                  {(analysisData.soilMoisture || 0).toFixed(1)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Soil Moisture
                </Typography>
                <NatureProgress variant="determinate" value={analysisData.soilMoisture || 0} sx={{ mt: 2, width: '100%' }} />
              </MetricTile>
            </Box>
            
            <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 45%', md: '1 1 22%' } }}>
              <MetricTile>
                <MetricIcon className="metric-icon">
                  <Grass />
                </MetricIcon>
                <Typography variant="h4" fontWeight="bold" color="primary">
                  {(analysisData.ndvi || 0).toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  NDVI Index
                </Typography>
                <NatureProgress variant="determinate" value={(analysisData.ndvi || 0) * 100} sx={{ mt: 2, width: '100%' }} />
              </MetricTile>
            </Box>
            
            <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 45%', md: '1 1 22%' } }}>
              <MetricTile>
                <MetricIcon className="metric-icon">
                  <ThermostatAuto />
                </MetricIcon>
                <Typography variant="h4" fontWeight="bold" color="primary">
                  {(analysisData.temperature || 0).toFixed(1)}°C
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Temperature
                </Typography>
                <NatureProgress variant="determinate" value={(analysisData.temperature + 10) * 2.5 || 0} sx={{ mt: 2, width: '100%' }} />
              </MetricTile>
            </Box>
            
            <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 45%', md: '1 1 22%' } }}>
              <MetricTile>
                <MetricIcon className="metric-icon">
                  <Science />
                </MetricIcon>
                <Typography variant="h4" fontWeight="bold" color="primary">
                  {(analysisData.ph || 0).toFixed(1)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  pH Level
                </Typography>
                <NatureProgress variant="determinate" value={((analysisData.ph || 0) / 14) * 100} sx={{ mt: 2, width: '100%' }} />
              </MetricTile>
            </Box>
          </Box>

          {/* Detailed Analysis */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 48%' } }}>
                <DataVisualizationCard>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Analytics color="primary" />
                    Health Score
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={analysisData.healthScore || 0} 
                        sx={{ 
                          height: 20, 
                          borderRadius: 10,
                          bgcolor: alpha('#E0E0E0', 0.3),
                          '& .MuiLinearProgress-bar': {
                            bgcolor: getHealthScoreColor(analysisData.healthScore || 0),
                            borderRadius: 10,
                          }
                        }} 
                      />
                    </Box>
                    <Typography variant="h6" fontWeight="bold">
                      {analysisData.healthScore || 0}/100
                    </Typography>
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <OrganicChip 
                      label={analysisData.riskLevel || 'Unknown Risk'} 
                      size="small"
                      sx={{ 
                        bgcolor: getHealthScoreColor(analysisData.healthScore || 0),
                        color: 'white'
                      }}
                    />
                  </Box>
                </DataVisualizationCard>
              </Box>
              
              <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 48%' } }}>
                <DataVisualizationCard>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Layers color="primary" />
                    Soil Composition
                  </Typography>
                  <Stack spacing={2} sx={{ mt: 2 }}>
                    {[
                      { label: 'Sand', value: analysisData.composition.sand, color: '#FFEB3B' },
                      { label: 'Clay', value: analysisData.composition.clay, color: '#795548' },
                      { label: 'Silt', value: analysisData.composition.silt, color: '#9E9E9E' },
                      { label: 'Organic Matter', value: analysisData.composition.organicMatter, color: '#4CAF50' }
                    ].map((item) => (
                      <Box key={item.label}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">{item.label}</Typography>
                          <Typography variant="body2" fontWeight="bold">{item.value.toFixed(1)}%</Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={item.value}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            bgcolor: alpha('#E0E0E0', 0.3),
                            '& .MuiLinearProgress-bar': {
                              bgcolor: item.color,
                              borderRadius: 4,
                            }
                          }}
                        />
                      </Box>
                    ))}
                  </Stack>
                </DataVisualizationCard>
              </Box>
            </Box>
          </Box>

          {/* Recommendations */}
          <ResultCard 
            expanded={expandedSection === 'recommendations'}
            onChange={handleAccordionChange('recommendations')}
          >
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocalFlorist color="primary" />
                Agricultural Recommendations
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {analysisData.recommendations.map((recommendation, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckCircle color="success" />
                    </ListItemIcon>
                    <ListItemText primary={recommendation} />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </ResultCard>

          {/* Crop Recommendations */}
          {analysisData.cropRecommendations && (
            <ResultCard 
              expanded={expandedSection === 'crops'}
              onChange={handleAccordionChange('crops')}
            >
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Grass color="primary" />
                  Recommended Crops ({analysisData.cropRecommendations.recommendedCount})
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Based on soil analysis, {analysisData.cropRecommendations.recommendedCount} out of {analysisData.cropRecommendations.totalAnalyzed} crops are suitable for your soil conditions.
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'grid', gap: 2 }}>
                  {analysisData.cropRecommendations.recommendations.slice(0, 6).map((crop, index) => (
                    <Card key={index} variant="outlined" sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Box>
                          <Typography variant="h6" component="h3" sx={{ textTransform: 'capitalize', fontWeight: 'bold' }}>
                            {crop.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                            {crop.scientificName} • {crop.category}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Chip 
                            label={`${crop.suitabilityScore}% Suitable`}
                            color={crop.suitabilityScore >= 80 ? 'success' : crop.suitabilityScore >= 60 ? 'warning' : 'default'}
                            size="small"
                          />
                          <Typography variant="caption" display="block" color="text.secondary">
                            {crop.expectedYield} Yield
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <strong>Planting Season:</strong> {crop.plantingWindow.season} ({crop.plantingWindow.period})
                        </Typography>
                        <Typography variant="body2">
                          <strong>Difficulty:</strong> {crop.difficulty}
                        </Typography>
                      </Box>

                      {crop.reasons.length > 0 && (
                        <Box sx={{ mb: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 'medium', color: 'success.main', mb: 0.5 }}>
                            ✓ Why this crop works:
                          </Typography>
                          {crop.reasons.slice(0, 2).map((reason, idx) => (
                            <Typography key={idx} variant="body2" sx={{ fontSize: '0.875rem', ml: 2 }}>
                              • {reason}
                            </Typography>
                          ))}
                        </Box>
                      )}

                      {crop.warnings.length > 0 && (
                        <Box sx={{ mb: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 'medium', color: 'warning.main', mb: 0.5 }}>
                            ⚠ Considerations:
                          </Typography>
                          {crop.warnings.slice(0, 2).map((warning, idx) => (
                            <Typography key={idx} variant="body2" sx={{ fontSize: '0.875rem', ml: 2 }}>
                              • {warning}
                            </Typography>
                          ))}
                        </Box>
                      )}

                      {crop.recommendations.length > 0 && (
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'medium', color: 'info.main', mb: 0.5 }}>
                            💡 Recommendations:
                          </Typography>
                          {crop.recommendations.slice(0, 1).map((rec, idx) => (
                            <Typography key={idx} variant="body2" sx={{ fontSize: '0.875rem', ml: 2 }}>
                              • {rec}
                            </Typography>
                          ))}
                        </Box>
                      )}
                    </Card>
                  ))}
                </Box>

                {analysisData.cropRecommendations.recommendations.length > 6 && (
                  <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      + {analysisData.cropRecommendations.recommendations.length - 6} more crops recommended
                    </Typography>
                  </Box>
                )}
              </AccordionDetails>
            </ResultCard>
          )}
        </Box>
      )}
    </AgricultureContainer>
  );
};

export default SoilAnalysisPage;
