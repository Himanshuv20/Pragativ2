import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  LocationOn as LocationIcon,
  Agriculture as AgricultureIcon,
  Park as EcoIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import SustainablePractices from '../components/SustainablePractices';
import { CropCalendarAPI } from '../services/api';
import { Location, SustainabilityAssessment } from '../types';

const SustainablePracticesPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [farmData, setFarmData] = useState({
    location: { latitude: 0, longitude: 0 } as Location,
    landSize: 10,
    cropTypes: [] as string[],
    budget: undefined as number | undefined
  });
  const [assessment, setAssessment] = useState<SustainabilityAssessment | null>(null);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  const steps = ['Farm Details', 'Sustainability Assessment', 'Practice Recommendations'];

  const cropOptions = [
    { name: 'wheat', emoji: '🌾', category: 'Grains' },
    { name: 'rice', emoji: '🍚', category: 'Grains' },
    { name: 'corn', emoji: '🌽', category: 'Grains' },
    { name: 'soybeans', emoji: '🫘', category: 'Legumes' },
    { name: 'tomatoes', emoji: '🍅', category: 'Vegetables' },
    { name: 'potatoes', emoji: '🥔', category: 'Vegetables' },
    { name: 'cotton', emoji: '☁️', category: 'Fiber' },
    { name: 'sunflower', emoji: '🌻', category: 'Oilseeds' },
    { name: 'barley', emoji: '🍺', category: 'Grains' },
    { name: 'vegetables', emoji: '🥬', category: 'Vegetables' },
    { name: 'fruits', emoji: '🍎', category: 'Fruits' },
    { name: 'legumes', emoji: '🌱', category: 'Legumes' }
  ];

  useEffect(() => {
    // Get user location on component mount
    getUserLocation();
  }, []);

  const getUserLocation = () => {
    setLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFarmData(prev => ({
            ...prev,
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            }
          }));
          setLocationLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Default to a sample location if geolocation fails
          setFarmData(prev => ({
            ...prev,
            location: { latitude: 40.7128, longitude: -74.0060 }
          }));
          setLocationLoading(false);
        }
      );
    } else {
      setLocationLoading(false);
    }
  };

  const handleNext = async () => {
    if (activeStep === 0) {
      // Moving to assessment step
      await generateAssessment();
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const generateAssessment = async () => {
    if (!farmData.location.latitude || !farmData.landSize) return;

    setLoading(true);
    try {
      const assessmentResult = await CropCalendarAPI.getQuickSustainabilityAssessment(
        farmData,
        [] // No current practices initially
      );
      setAssessment(assessmentResult);
    } catch (error) {
      console.error('Error generating assessment:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              mb: 3 
            }}>
              <AgricultureIcon sx={{ color: '#4CAF50' }} />
              Farm Information
            </Typography>

            {/* Location */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                  📍 Farm Location
                </Typography>
                
                {locationLoading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2 }}>
                    <CircularProgress size={20} />
                    <Typography variant="body2">Getting your location...</Typography>
                  </Box>
                ) : (
                  <Box sx={{ 
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    gap: 2,
                    mt: 2
                  }}>
                    <TextField
                      fullWidth
                      label="Latitude"
                      type="number"
                      value={farmData.location.latitude || ''}
                      onChange={(e) => setFarmData(prev => ({
                        ...prev,
                        location: { ...prev.location, latitude: parseFloat(e.target.value) || 0 }
                      }))}
                      inputProps={{ step: 0.000001 }}
                    />
                    <TextField
                      fullWidth
                      label="Longitude"
                      type="number"
                      value={farmData.location.longitude || ''}
                      onChange={(e) => setFarmData(prev => ({
                        ...prev,
                        location: { ...prev.location, longitude: parseFloat(e.target.value) || 0 }
                      }))}
                      inputProps={{ step: 0.000001 }}
                    />
                  </Box>
                )}
                
                <Button 
                  onClick={getUserLocation}
                  startIcon={<LocationIcon />}
                  variant="outlined"
                  sx={{ mt: 2 }}
                  disabled={locationLoading}
                >
                  {locationLoading ? 'Getting Location...' : 'Use Current Location'}
                </Button>
              </CardContent>
            </Card>

            {/* Farm Size */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                  🏞️ Farm Size
                </Typography>
                <TextField
                  fullWidth
                  label="Land Size (acres)"
                  type="number"
                  value={farmData.landSize}
                  onChange={(e) => setFarmData(prev => ({
                    ...prev,
                    landSize: parseFloat(e.target.value) || 0
                  }))}
                  inputProps={{ min: 0.1, step: 0.1 }}
                  sx={{ mt: 2 }}
                />
              </CardContent>
            </Card>

            {/* Crop Types */}
            <Card sx={{ 
              mb: 3,
              background: 'linear-gradient(135deg, #F8FFF8 0%, #F1F8E9 100%)',
              border: '2px solid #E8F5E8',
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(76,175,80,0.1)'
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography 
                  variant="h6" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 700,
                    color: '#2E7D32',
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  🌾 Select Your Crops
                  <Chip 
                    label="Optional" 
                    size="small" 
                    sx={{ 
                      bgcolor: '#E8F5E8', 
                      color: '#2E7D32',
                      fontWeight: 500
                    }} 
                  />
                </Typography>
                
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ mb: 3, lineHeight: 1.6 }}
                >
                  Choose the crops you grow to get tailored sustainable farming recommendations.
                </Typography>

                {/* Crop Selection Grid */}
                <Box 
                  sx={{ 
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: 'repeat(2, 1fr)',
                      sm: 'repeat(3, 1fr)',
                      md: 'repeat(4, 1fr)',
                      lg: 'repeat(6, 1fr)'
                    },
                    gap: 1.5,
                    mb: 3
                  }}
                >
                  {cropOptions.map((crop) => {
                    const isSelected = farmData.cropTypes.includes(crop.name);
                    return (
                      <Card
                        key={crop.name}
                        onClick={() => {
                          setFarmData(prev => ({
                            ...prev,
                            cropTypes: isSelected 
                              ? prev.cropTypes.filter(c => c !== crop.name)
                              : [...prev.cropTypes, crop.name]
                          }));
                        }}
                        sx={{
                          cursor: 'pointer',
                          position: 'relative',
                          minHeight: 90,
                          background: isSelected 
                            ? 'linear-gradient(135deg, #E8F5E8 0%, #C8E6C8 100%)'
                            : 'linear-gradient(135deg, #FFFFFF 0%, #FAFAFA 100%)',
                          border: isSelected 
                            ? '2px solid #4CAF50' 
                            : '2px solid #E0E0E0',
                          borderRadius: 2,
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                          boxShadow: isSelected
                            ? '0 4px 16px rgba(76,175,80,0.25)'
                            : '0 2px 8px rgba(0,0,0,0.08)',
                          '&:hover': {
                            transform: 'scale(1.05)',
                            boxShadow: isSelected
                              ? '0 6px 20px rgba(76,175,80,0.3)'
                              : '0 4px 12px rgba(0,0,0,0.15)',
                            borderColor: isSelected ? '#4CAF50' : '#BDBDBD'
                          }
                        }}
                      >
                        <CardContent 
                          sx={{ 
                            p: 1.5, 
                            textAlign: 'center',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            '&:last-child': { pb: 1.5 }
                          }}
                        >
                          <Typography 
                            sx={{ 
                              fontSize: '2rem',
                              mb: 0.5,
                              filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.1))',
                              transition: 'all 0.3s ease',
                              transform: isSelected ? 'scale(1.1)' : 'scale(1)'
                            }}
                          >
                            {crop.emoji}
                          </Typography>
                          
                          <Typography 
                            variant="caption"
                            sx={{ 
                              fontWeight: isSelected ? 600 : 500,
                              color: isSelected ? '#2E7D32' : 'text.primary',
                              fontSize: '0.75rem',
                              textAlign: 'center',
                              lineHeight: 1.2,
                              textTransform: 'capitalize'
                            }}
                          >
                            {crop.name}
                          </Typography>

                          <Typography 
                            variant="caption"
                            sx={{ 
                              color: 'text.secondary',
                              fontSize: '0.65rem',
                              mt: 0.25
                            }}
                          >
                            {crop.category}
                          </Typography>
                        </CardContent>
                      </Card>
                    );
                  })}
                </Box>

                {/* Selected Crops Display */}
                {farmData.cropTypes.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#2E7D32', 
                        fontWeight: 600, 
                        mb: 1 
                      }}
                    >
                      Selected Crops ({farmData.cropTypes.length}):
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {farmData.cropTypes.map((cropName) => {
                        const cropInfo = cropOptions.find(c => c.name === cropName);
                        return (
                          <Chip
                            key={cropName}
                            label={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <span>{cropInfo?.emoji}</span>
                                <span style={{ textTransform: 'capitalize' }}>{cropName}</span>
                              </Box>
                            }
                            onDelete={() => setFarmData(prev => ({
                              ...prev,
                              cropTypes: prev.cropTypes.filter(c => c !== cropName)
                            }))}
                            sx={{
                              bgcolor: '#E8F5E8',
                              color: '#2E7D32',
                              fontWeight: 500,
                              '& .MuiChip-deleteIcon': {
                                color: '#2E7D32'
                              }
                            }}
                          />
                        );
                      })}
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* Budget */}
            <Card>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                  💰 Budget (Optional)
                </Typography>
                <TextField
                  fullWidth
                  label="Available Budget (Local Currency)"
                  type="number"
                  value={farmData.budget || ''}
                  onChange={(e) => setFarmData(prev => ({
                    ...prev,
                    budget: parseFloat(e.target.value) || undefined
                  }))}
                  inputProps={{ min: 0 }}
                  sx={{ mt: 2 }}
                  helperText="Enter your available budget for implementing sustainable practices (amounts will be shown in your local currency)"
                />
              </CardContent>
            </Card>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              mb: 3 
            }}>
              <AssessmentIcon sx={{ color: '#4CAF50' }} />
              Sustainability Assessment
            </Typography>

            {loading ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 6 }}>
                <CircularProgress size={60} sx={{ color: '#4CAF50', mb: 2 }} />
                <Typography variant="h6">Generating Assessment...</Typography>
                <Typography variant="body2" color="text.secondary">
                  Analyzing your farm and generating sustainability recommendations
                </Typography>
              </Box>
            ) : assessment ? (
              <Box>
                {/* Sustainability Score */}
                <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #E8F5E8 0%, #F1F8E9 100%)' }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" sx={{ fontWeight: 600, color: '#4CAF50', mb: 2 }}>
                      {assessment.sustainabilityScore}%
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                      Current Sustainability Score
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Based on your farm characteristics and available practices
                    </Typography>
                  </CardContent>
                </Card>

                {/* Quick Wins */}
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      🎯 Quick Wins
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Easy-to-implement practices with immediate benefits:
                    </Typography>
                    <Box sx={{ 
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' },
                      gap: 2
                    }}>
                      {assessment.quickWins.map((practice) => (
                        <Card key={practice.id} variant="outlined">
                          <CardContent sx={{ p: 2 }}>
                            <Typography variant="subtitle2" gutterBottom>
                              {practice.name}
                            </Typography>
                            <Chip
                              size="small"
                              label={practice.implementation.difficulty}
                              sx={{ bgcolor: '#4CAF50', color: 'white', mb: 1 }}
                            />
                            <Typography variant="caption" display="block">
                              ₹{practice.implementation.estimatedCost.min}-{practice.implementation.estimatedCost.max} {practice.implementation.estimatedCost.unit}
                            </Typography>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  </CardContent>
                </Card>

                {/* Improvement Areas */}
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      📈 Key Improvement Areas
                    </Typography>
                    <Box sx={{ 
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' },
                      gap: 2
                    }}>
                      {assessment.improvementAreas.map((area, index) => (
                        <Box key={index} sx={{ textAlign: 'center' }}>
                          <Chip
                            label={area.priority.toUpperCase()}
                            size="small"
                            sx={{
                              bgcolor: area.priority === 'high' ? '#F44336' : 
                                      area.priority === 'medium' ? '#FF9800' : '#4CAF50',
                              color: 'white',
                              mb: 1
                            }}
                          />
                          <Typography variant="subtitle2" gutterBottom>
                            {area.area}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {area.opportunityCount} opportunities
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>

                {/* Potential Impact */}
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      🌍 Potential Environmental Impact
                    </Typography>
                    <Box sx={{ 
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr 1fr 1fr' },
                      gap: 2,
                      mt: 2
                    }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h5" sx={{ fontWeight: 600, color: '#2196F3' }}>
                          {assessment.potentialImpact.potentialWaterSavings}
                        </Typography>
                        <Typography variant="caption">Water Savings</Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h5" sx={{ fontWeight: 600, color: '#FF9800' }}>
                          {assessment.potentialImpact.potentialEnergySavings}
                        </Typography>
                        <Typography variant="caption">Energy Savings</Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h5" sx={{ fontWeight: 600, color: '#4CAF50' }}>
                          {assessment.potentialImpact.carbonReductionPotential}
                        </Typography>
                        <Typography variant="caption">Carbon Reduction</Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h5" sx={{ fontWeight: 600, color: '#8BC34A' }}>
                          {assessment.potentialImpact.biodiversityImpact}
                        </Typography>
                        <Typography variant="caption">Biodiversity</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            ) : (
              <Alert severity="info">
                Click "Next" to generate your sustainability assessment
              </Alert>
            )}
          </Box>
        );

      case 2:
        return (
          <SustainablePractices
            location={farmData.location}
            landSize={farmData.landSize}
            cropTypes={farmData.cropTypes}
          />
        );

      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Back to Home
        </Button>
        
        <Paper sx={{ p: 3, bgcolor: '#F1F8E9', border: '2px solid #4CAF50' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <EcoIcon sx={{ fontSize: 40, color: '#4CAF50' }} />
            <Box>
              <Typography variant="h4" sx={{ color: '#4CAF50', fontWeight: 600 }}>
                🌱 Sustainable Agricultural Practices
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Discover and implement eco-friendly farming practices tailored to your farm
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Stepper */}
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Content */}
      <Card>
        <CardContent sx={{ p: 4 }}>
          {renderStepContent()}
          
          {/* Navigation Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Back
            </Button>
            
            <Box>
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={() => navigate('/')}
                  sx={{ bgcolor: '#4CAF50' }}
                >
                  Return to Home
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={
                    !farmData.location.latitude || 
                    !farmData.location.longitude || 
                    !farmData.landSize ||
                    loading
                  }
                  sx={{ bgcolor: '#4CAF50' }}
                >
                  {loading ? 'Generating...' : 'Next'}
                </Button>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default SustainablePracticesPage;
