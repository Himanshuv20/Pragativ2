import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Stack,
  Fade,
  Zoom,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  Divider,
  Rating,
  LinearProgress
} from '@mui/material';
import {
  Agriculture,
  LocationOn,
  CalendarToday,
  Person,
  Phone,
  Email,
  Science,
  Assignment,
  CheckCircle,
  Schedule,
  Payment,
  Receipt,
  Layers,
  MyLocation,
  Notifications,
  Download,
  Print,
  Share,
  WhatsApp,
  Call,
  Star,
  DirectionsWalk,
  Business,
  School,
  AccountBalance
} from '@mui/icons-material';
import { styled, alpha, keyframes } from '@mui/material/styles';
import soilTestingCentersAPI, { TestingCenter } from '../services/soilTestingCentersAPI';
import MapLocationPicker from '../components/MapLocationPicker';

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

const PrimaryButton = styled(Button)(({ theme }) => ({
  background: `
    linear-gradient(135deg, 
      #4CAF50 0%, 
      #66BB6A 50%, 
      #81C784 100%
    )
  `,
  color: '#FFFFFF',
  fontWeight: 600,
  padding: theme.spacing(1.5, 4),
  borderRadius: theme.spacing(3),
  textTransform: 'none',
  fontSize: '1.1rem',
  boxShadow: `
    0 8px 25px ${alpha('#4CAF50', 0.3)},
    0 3px 10px ${alpha('#4CAF50', 0.2)}
  `,
  border: 'none',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    background: `
      linear-gradient(135deg, 
        #388E3C 0%, 
        #4CAF50 50%, 
        #66BB6A 100%
      )
    `,
    transform: 'translateY(-3px)',
    boxShadow: `
      0 12px 35px ${alpha('#4CAF50', 0.4)},
      0 6px 15px ${alpha('#4CAF50', 0.25)}
    `,
  },
  '&:active': {
    transform: 'translateY(-1px)',
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
    transition: 'left 0.5s',
  },
  '&:hover::before': {
    left: '100%',
  }
}));

const StyledStepper = styled(Stepper)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  padding: theme.spacing(3),
  background: `
    linear-gradient(135deg, 
      ${alpha('#FFFFFF', 0.9)} 0%, 
      ${alpha('#F8F9FA', 0.95)} 100%
    )
  `,
  borderRadius: theme.spacing(2),
  border: `1px solid ${alpha('#4CAF50', 0.1)}`,
  '& .MuiStepIcon-root': {
    color: alpha('#4CAF50', 0.3),
    '&.Mui-active': {
      color: '#4CAF50',
    },
    '&.Mui-completed': {
      color: '#2E7D32',
    }
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(2),
    background: alpha('#FFFFFF', 0.8),
    transition: 'all 0.3s ease',
    '& fieldset': {
      borderColor: alpha('#4CAF50', 0.3),
    },
    '&:hover fieldset': {
      borderColor: alpha('#4CAF50', 0.5),
    },
    '&.Mui-focused fieldset': {
      borderColor: '#4CAF50',
      borderWidth: 2,
    },
  },
  '& .MuiInputLabel-root': {
    color: alpha('#2E7D32', 0.8),
    '&.Mui-focused': {
      color: '#2E7D32',
    }
  }
}));

interface BookingData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  testingCenter: string;
  testType: string;
  farmSize: string;
  cropType: string;
  preferredDate: string;
  timeSlot: string;
  additionalNotes: string;
}

const SoilTestBookingPage: React.FC = () => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState<BookingData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    testingCenter: '',
    testType: '',
    farmSize: '',
    cropType: '',
    preferredDate: '',
    timeSlot: '',
    additionalNotes: ''
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [testingCenters, setTestingCenters] = useState<TestingCenter[]>([]);
  const [loadingCenters, setLoadingCenters] = useState(false);
  const [centerError, setCenterError] = useState<string | null>(null);
  const [showLocationMap, setShowLocationMap] = useState(false);

  const steps = [
    'Personal Information',
    'Location Details',
    'Test Preferences',
    'Schedule & Confirmation'
  ];

  const testTypes = [
    'Basic Soil Analysis',
    'Comprehensive Soil Test',
    'Nutrient Analysis',
    'pH Level Testing',
    'Organic Matter Assessment',
    'Heavy Metal Screening'
  ];

  const timeSlots = [
    '9:00 AM - 11:00 AM',
    '11:00 AM - 1:00 PM',
    '2:00 PM - 4:00 PM',
    '4:00 PM - 6:00 PM'
  ];

  const states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  const handleInputChange = (field: keyof BookingData, value: string) => {
    setBookingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle map location selection
  const handleMapLocationSelect = (lat: number, lng: number) => {
    const address = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    handleInputChange('address', address);
    // Auto-close map after selection
    setTimeout(() => {
      setShowLocationMap(false);
    }, 2000);
  };

  const fetchTestingCenters = async (state: string, city?: string) => {
    if (!state) return;
    
    setLoadingCenters(true);
    setCenterError(null);
    
    try {
      const response = await soilTestingCentersAPI.getTestingCenters({
        state,
        city: city || undefined
      });
      
      if (response.success) {
        setTestingCenters(response.data.centers);
      } else {
        setCenterError(response.error || 'Failed to load testing centers');
      }
    } catch (error) {
      setCenterError(error instanceof Error ? error.message : 'Failed to load testing centers');
    } finally {
      setLoadingCenters(false);
    }
  };

  // Effect to fetch testing centers when state or city changes
  useEffect(() => {
    if (bookingData.state) {
      fetchTestingCenters(bookingData.state, bookingData.city);
    }
  }, [bookingData.state, bookingData.city]);

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newBookingId = `STB${Date.now().toString().slice(-6)}`;
    setBookingId(newBookingId);
    setShowConfirmation(true);
    setLoading(false);
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={3}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
              <StyledTextField
                fullWidth
                label="Full Name"
                value={bookingData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                InputProps={{
                  startAdornment: <Person sx={{ mr: 1, color: '#4CAF50' }} />
                }}
              />
              <StyledTextField
                fullWidth
                label="Email Address"
                type="email"
                value={bookingData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                InputProps={{
                  startAdornment: <Email sx={{ mr: 1, color: '#4CAF50' }} />
                }}
              />
            </Stack>
            <Box sx={{ maxWidth: { xs: '100%', md: '50%' } }}>
              <StyledTextField
                fullWidth
                label="Phone Number"
                value={bookingData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                InputProps={{
                  startAdornment: <Phone sx={{ mr: 1, color: '#4CAF50' }} />
                }}
              />
            </Box>
          </Stack>
        );

      case 1:
        return (
          <Stack spacing={3}>
            <StyledTextField
              fullWidth
              label="Farm Address"
              multiline
              rows={3}
              value={bookingData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              InputProps={{
                startAdornment: <LocationOn sx={{ mr: 1, color: '#4CAF50', alignSelf: 'flex-start', mt: 1 }} />
              }}
            />
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
              <StyledTextField
                fullWidth
                label="City"
                value={bookingData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
              />
              <FormControl fullWidth>
                <InputLabel>State</InputLabel>
                <Select
                  value={bookingData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  sx={{
                    borderRadius: 2,
                    background: alpha('#FFFFFF', 0.8),
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: alpha('#4CAF50', 0.3),
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: alpha('#4CAF50', 0.5),
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#4CAF50',
                    }
                  }}
                >
                  {states.map((state) => (
                    <MenuItem key={state} value={state}>{state}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <StyledTextField
                fullWidth
                label="PIN Code"
                value={bookingData.pincode}
                onChange={(e) => handleInputChange('pincode', e.target.value)}
              />
            </Stack>

            {/* Map Location Picker */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Typography variant="h6" sx={{ color: '#2E7D32', fontWeight: 600 }}>
                  📍 Location on Map (Optional)
                </Typography>
                <Button
                  variant={showLocationMap ? "contained" : "outlined"}
                  color="primary"
                  size="small"
                  onClick={() => setShowLocationMap(!showLocationMap)}
                  startIcon={<LocationOn />}
                  sx={{ borderRadius: 2 }}
                >
                  {showLocationMap ? 'Hide Map' : 'Show Map'}
                </Button>
              </Box>
              
              {showLocationMap && (
                <Fade in timeout={500}>
                  <Box>
                    <Alert severity="info" sx={{ mb: 2 }}>
                      <Typography variant="body2">
                        <strong>📍 Mark your farm location:</strong>
                        <br />
                        • Use "Get Location" button for current position
                        <br />
                        • Or click on the map to mark your farm location
                        <br />
                        • This helps us find the nearest testing centers
                      </Typography>
                    </Alert>
                    
                    <MapLocationPicker
                      onLocationSelect={handleMapLocationSelect}
                      height={350}
                      showCurrentLocation={true}
                    />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        💡 Your exact farm location helps us recommend the best testing centers
                      </Typography>
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => setShowLocationMap(false)}
                        sx={{ minWidth: 'auto' }}
                      >
                        Close Map
                      </Button>
                    </Box>
                  </Box>
                </Fade>
              )}
            </Box>

            {/* Testing Centers Section */}
            {bookingData.state && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2, color: '#2E7D32', fontWeight: 600 }}>
                  Select Testing Center
                </Typography>
                
                {loadingCenters && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <CircularProgress size={20} />
                    <Typography variant="body2" color="text.secondary">
                      Loading testing centers...
                    </Typography>
                  </Box>
                )}

                {centerError && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {centerError}
                  </Alert>
                )}

                {!loadingCenters && testingCenters.length === 0 && bookingData.state && (
                  <Alert severity="info" sx={{ mb: 2 }}>
                    No testing centers found for {bookingData.city ? `${bookingData.city}, ` : ''}{bookingData.state}
                  </Alert>
                )}

                {testingCenters.length > 0 && (
                  <Stack spacing={2}>
                    {testingCenters.map((center) => (
                      <Card
                        key={center.id}
                        onClick={() => handleInputChange('testingCenter', center.id)}
                        sx={{
                          cursor: 'pointer',
                          border: bookingData.testingCenter === center.id ? '2px solid #4CAF50' : '1px solid #e0e0e0',
                          background: bookingData.testingCenter === center.id ? alpha('#4CAF50', 0.05) : '#ffffff',
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            borderColor: '#4CAF50',
                            boxShadow: '0 4px 12px rgba(76, 175, 80, 0.15)',
                            transform: 'translateY(-2px)'
                          }
                        }}
                      >
                        <CardContent sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#2E7D32' }}>
                              {center.name}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {center.type === 'Government' && <AccountBalance sx={{ color: '#1976d2', fontSize: 20 }} />}
                              {center.type === 'University' && <School sx={{ color: '#9c27b0', fontSize: 20 }} />}
                              {center.type === 'Private' && <Business sx={{ color: '#ff9800', fontSize: 20 }} />}
                              <Chip 
                                label={center.type} 
                                size="small" 
                                color={center.type === 'Government' ? 'primary' : center.type === 'University' ? 'secondary' : 'default'}
                              />
                            </Box>
                          </Box>
                          
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {center.address}, {center.city}, {center.state} - {center.pincode}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Rating value={center.rating} readOnly size="small" />
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {center.rating}
                              </Typography>
                            </Box>
                            <Chip label={center.accreditation} size="small" variant="outlined" />
                            {center.distance && (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <DirectionsWalk sx={{ fontSize: 16, color: '#666' }} />
                                <Typography variant="body2" color="text.secondary">
                                  {center.distance.toFixed(1)} km
                                </Typography>
                              </Box>
                            )}
                          </Box>

                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            <strong>Timings:</strong> {center.timings}
                          </Typography>

                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                            {center.facilities.slice(0, 3).map((facility, index) => (
                              <Chip key={index} label={facility} size="small" variant="outlined" />
                            ))}
                            {center.facilities.length > 3 && (
                              <Chip label={`+${center.facilities.length - 3} more`} size="small" variant="outlined" />
                            )}
                          </Box>

                          <Typography variant="body2" sx={{ color: '#2E7D32', fontWeight: 500 }}>
                            Basic Test: ₹{center.cost.basic} | Comprehensive: ₹{center.cost.comprehensive}
                          </Typography>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                )}
              </Box>
            )}
          </Stack>
        );

      case 2:
        return (
          <Stack spacing={3}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
              <FormControl fullWidth>
                <InputLabel>Test Type</InputLabel>
                <Select
                  value={bookingData.testType}
                  onChange={(e) => handleInputChange('testType', e.target.value)}
                  sx={{
                    borderRadius: 2,
                    background: alpha('#FFFFFF', 0.8),
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: alpha('#4CAF50', 0.3),
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: alpha('#4CAF50', 0.5),
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#4CAF50',
                    }
                  }}
                >
                  {testTypes.map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <StyledTextField
                fullWidth
                label="Farm Size (in acres)"
                value={bookingData.farmSize}
                onChange={(e) => handleInputChange('farmSize', e.target.value)}
                InputProps={{
                  startAdornment: <Agriculture sx={{ mr: 1, color: '#4CAF50' }} />
                }}
              />
            </Stack>
            <Box sx={{ maxWidth: { xs: '100%', md: '50%' } }}>
              <StyledTextField
                fullWidth
                label="Primary Crop Type"
                value={bookingData.cropType}
                onChange={(e) => handleInputChange('cropType', e.target.value)}
              />
            </Box>
            <StyledTextField
              fullWidth
              label="Additional Notes"
              multiline
              rows={3}
              value={bookingData.additionalNotes}
              onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
              placeholder="Any specific requirements or concerns about your soil..."
            />
          </Stack>
        );

      case 3:
        return (
          <Stack spacing={3}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
              <StyledTextField
                fullWidth
                label="Preferred Date"
                type="date"
                value={bookingData.preferredDate}
                onChange={(e) => handleInputChange('preferredDate', e.target.value)}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: <CalendarToday sx={{ mr: 1, color: '#4CAF50' }} />
                }}
              />
              <FormControl fullWidth>
                <InputLabel>Time Slot</InputLabel>
                <Select
                  value={bookingData.timeSlot}
                  onChange={(e) => handleInputChange('timeSlot', e.target.value)}
                  sx={{
                    borderRadius: 2,
                    background: alpha('#FFFFFF', 0.8),
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: alpha('#4CAF50', 0.3),
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: alpha('#4CAF50', 0.5),
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#4CAF50',
                    }
                  }}
                >
                  {timeSlots.map((slot) => (
                    <MenuItem key={slot} value={slot}>{slot}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
            <EarthCard>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: '#2E7D32', fontWeight: 600 }}>
                  Booking Summary
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><Person sx={{ color: '#4CAF50' }} /></ListItemIcon>
                    <ListItemText primary={bookingData.name} secondary="Farmer Name" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><LocationOn sx={{ color: '#4CAF50' }} /></ListItemIcon>
                    <ListItemText primary={`${bookingData.city}, ${bookingData.state}`} secondary="Location" />
                  </ListItem>
                  {bookingData.testingCenter && (
                    <ListItem>
                      <ListItemIcon><Business sx={{ color: '#4CAF50' }} /></ListItemIcon>
                      <ListItemText 
                        primary={testingCenters.find(c => c.id === bookingData.testingCenter)?.name || 'Selected Center'} 
                        secondary="Testing Center" 
                      />
                    </ListItem>
                  )}
                  <ListItem>
                    <ListItemIcon><Science sx={{ color: '#4CAF50' }} /></ListItemIcon>
                    <ListItemText primary={bookingData.testType} secondary="Test Type" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><Schedule sx={{ color: '#4CAF50' }} /></ListItemIcon>
                    <ListItemText primary={`${bookingData.preferredDate} at ${bookingData.timeSlot}`} secondary="Scheduled Time" />
                  </ListItem>
                </List>
              </CardContent>
            </EarthCard>
          </Stack>
        );

      default:
        return null;
    }
  };

  return (
    <AgricultureContainer maxWidth="lg">
      <Fade in timeout={800}>
        <HeroSection>
          <PrimaryTitle variant="h3">
            Soil Test Booking
          </PrimaryTitle>
          <SubtitleText variant="h6">
            Schedule professional soil analysis to optimize your crop yield and soil health
          </SubtitleText>
        </HeroSection>
      </Fade>

      <EarthCard sx={{ mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <StyledStepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </StyledStepper>

          <Box sx={{ mt: 4 }}>
            {renderStepContent(activeStep)}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{
                color: '#4CAF50',
                borderColor: '#4CAF50',
                '&:hover': {
                  borderColor: '#2E7D32',
                  backgroundColor: alpha('#4CAF50', 0.1)
                }
              }}
              variant="outlined"
            >
              Back
            </Button>
            
            <PrimaryButton
              onClick={handleNext}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: 'white' }} />
              ) : activeStep === steps.length - 1 ? (
                'Book Test'
              ) : (
                'Next'
              )}
            </PrimaryButton>
          </Box>
        </CardContent>
      </EarthCard>

      {/* Confirmation Dialog */}
      <Dialog 
        open={showConfirmation} 
        onClose={() => setShowConfirmation(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ 
          textAlign: 'center', 
          color: '#2E7D32',
          fontWeight: 600,
          pb: 2
        }}>
          <CheckCircle sx={{ fontSize: 60, color: '#4CAF50', mb: 2 }} />
          <Typography variant="h5">Booking Confirmed!</Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', pb: 2 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Your soil test has been successfully booked.
          </Typography>
          <Chip 
            label={`Booking ID: ${bookingId}`}
            sx={{ 
              backgroundColor: alpha('#4CAF50', 0.1),
              color: '#2E7D32',
              fontWeight: 600,
              fontSize: '1rem',
              mb: 3
            }}
          />
          <Typography variant="body2" color="text.secondary">
            You will receive a confirmation email with further details shortly.
            Our team will contact you before the scheduled visit.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Stack direction="row" spacing={2}>
            <Button
              startIcon={<Download />}
              sx={{ color: '#4CAF50' }}
            >
              Download Receipt
            </Button>
            <Button
              startIcon={<WhatsApp />}
              sx={{ color: '#4CAF50' }}
            >
              Share on WhatsApp
            </Button>
            <PrimaryButton onClick={() => setShowConfirmation(false)}>
              Done
            </PrimaryButton>
          </Stack>
        </DialogActions>
      </Dialog>
    </AgricultureContainer>
  );
};

export default SoilTestBookingPage;
