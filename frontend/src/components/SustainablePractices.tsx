import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
  LinearProgress
} from '@mui/material';
import {
  EcoIcon,
  WaterIcon,
  EnergyIcon,
  NatureIcon,
  TrendingUpIcon,
  CheckIcon,
  InfoIcon,
  CloseIcon,
  ExpandMoreIcon,
  AgricultureIcon,
  TimelineIcon,
  MoneyIcon
} from './icons/AppIcons';
import { CropCalendarAPI } from '../services/api';
import { SustainablePractice, SustainablePracticesResponse, Location } from '../types';

interface SustainablePracticesProps {
  location?: Location;
  landSize?: number;
  cropTypes?: string[];
  onPracticeSelect?: (practice: SustainablePractice) => void;
}

const SustainablePractices: React.FC<SustainablePracticesProps> = ({
  location = { latitude: 40.7128, longitude: -74.0060 }, // Default to NYC
  landSize = 10,
  cropTypes = [],
  onPracticeSelect
}) => {
  const [practicesResponse, setPracticesResponse] = useState<SustainablePracticesResponse | null>(null);
  const [selectedPractice, setSelectedPractice] = useState<SustainablePractice | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPractices, setSelectedPractices] = useState<string[]>([]);

  const loadSustainablePractices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await CropCalendarAPI.getSustainablePracticeRecommendations(
        location,
        landSize,
        cropTypes,
        undefined, // budget
        [] // currentPractices - could be enhanced to track user's current practices
      );
      
      // Handle both AI response format and legacy format
      if (response) {
        setPracticesResponse(response);
      } else {
        throw new Error('No recommendations found');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load sustainable practices');
      console.error('Error loading sustainable practices:', err);
    } finally {
      setLoading(false);
    }
  }, [location, landSize, cropTypes]);

  useEffect(() => {
    loadSustainablePractices();
  }, [loadSustainablePractices]);

  // Helper functions to handle both AI and legacy response formats
  const getPractices = (): SustainablePractice[] => {
    if (!practicesResponse) return [];
    return practicesResponse.recommendations || practicesResponse.recommendedPractices || [];
  };

  const getClimateZone = (): string => {
    if (!practicesResponse) return 'Unknown';
    return practicesResponse.location?.climateZone || 'Climate Zone Unknown';
  };

  const getSoilType = (): string => {
    if (!practicesResponse) return 'Unknown';
    return practicesResponse.location?.soilType || 'Soil Type Unknown';
  };

  const getPotentialWaterSavings = (): string => {
    if (!practicesResponse) return 'Unknown';
    return practicesResponse.summary?.potentialWaterSavings || 'To be determined';
  };

  const getPotentialEnergySavings = (): string => {
    if (!practicesResponse) return 'Unknown';
    return practicesResponse.summary?.potentialEnergySavings || 'To be determined';
  };

  const getCarbonReductionPotential = (): string => {
    if (!practicesResponse) return 'Unknown';
    return practicesResponse.summary?.carbonReductionPotential || 'To be determined';
  };

  const getBiodiversityImpact = (): string => {
    if (!practicesResponse) return 'Unknown';
    return practicesResponse.summary?.biodiversityImpact || 'To be determined';
  };

  const isAIGenerated = (): boolean => {
    return practicesResponse?.aiGenerated || false;
  };

  const practices = getPractices();

  const handlePracticeClick = async (practice: SustainablePractice) => {
    try {
      const detailedPractice = await CropCalendarAPI.getSustainablePracticeDetails(practice.id);
      setSelectedPractice(detailedPractice);
      setDetailsOpen(true);
      if (onPracticeSelect) {
        onPracticeSelect(detailedPractice);
      }
    } catch (err: any) {
      console.error('Error loading practice details:', err);
      setSelectedPractice(practice);
      setDetailsOpen(true);
    }
  };

  const togglePracticeSelection = (practiceId: string) => {
    setSelectedPractices(prev => 
      prev.includes(practiceId) 
        ? prev.filter(id => id !== practiceId)
        : [...prev, practiceId]
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'high': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const getImpactColor = (impact: string) => {
    if (impact.includes('very high') || impact.includes('very positive')) return '#2E7D32';
    if (impact.includes('high') || impact.includes('positive')) return '#4CAF50';
    if (impact.includes('medium')) return '#FF9800';
    return '#9E9E9E';
  };

  const formatCurrency = (amount: number, currencyInfo?: any) => {
    // Use currency from the practices response if available
    const currency = currencyInfo || practicesResponse?.currency;
    
    if (currency && currency.code && currency.locale) {
      return new Intl.NumberFormat(currency.locale, {
        style: 'currency',
        currency: currency.code,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    }
    
    // Fallback to INR formatting for Indian context
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 6 }}>
        <CircularProgress size={60} sx={{ color: '#4CAF50', mb: 2 }} />
        <Typography variant="h6">Loading Sustainable Practices...</Typography>
        <Typography variant="body2" color="text.secondary">
          Analyzing your farm conditions and generating personalized recommendations
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        <Typography variant="h6">Error Loading Practices</Typography>
        {error}
        <Button onClick={loadSustainablePractices} sx={{ mt: 1 }}>
          Try Again
        </Button>
      </Alert>
    );
  }

  if (!practicesResponse) {
    return null;
  }

  return (
    <Box>
      {/* Header with Farm Assessment */}
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #E8F5E8 0%, #F1F8E9 100%)' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <EcoIcon sx={{ fontSize: 40, color: '#4CAF50' }} />
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600, color: 'primary.dark' }}>
                🌱 Sustainable Agriculture Practices
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Personalized recommendations for your {landSize}-acre farm
              </Typography>
            </Box>
          </Box>

          {/* Farm Summary */}
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: '1fr 1fr', md: '1fr 1fr 1fr 1fr' },
            gap: 2,
            mt: 3
          }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#4CAF50' }}>
                {getClimateZone()}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Climate Zone
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#4CAF50' }}>
                {getSoilType()}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Soil Type
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#4CAF50' }}>
                {practices.length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Recommended Practices
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#4CAF50' }}>
                {getPotentialWaterSavings()}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Potential Water Savings
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Impact Summary */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingUpIcon sx={{ color: '#4CAF50' }} />
            Potential Environmental Impact
          </Typography>
          
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' },
            gap: 3,
            mt: 2
          }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <WaterIcon sx={{ color: '#2196F3', fontSize: 20 }} />
                <Typography variant="subtitle2">Water Conservation</Typography>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 600, color: '#2196F3' }}>
                {getPotentialWaterSavings()}
              </Typography>
            </Box>

            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <EnergyIcon sx={{ color: '#FF9800', fontSize: 20 }} />
                <Typography variant="subtitle2">Energy Efficiency</Typography>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 600, color: '#FF9800' }}>
                {getPotentialEnergySavings()}
              </Typography>
            </Box>

            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <EcoIcon sx={{ color: '#4CAF50', fontSize: 20 }} />
                <Typography variant="subtitle2">Carbon Reduction</Typography>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 600, color: '#4CAF50' }}>
                {getCarbonReductionPotential()}
              </Typography>
            </Box>

            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <NatureIcon sx={{ color: '#8BC34A', fontSize: 20 }} />
                <Typography variant="subtitle2">Biodiversity</Typography>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 600, color: '#8BC34A' }}>
                {getBiodiversityImpact()}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Practices Grid */}
      <Typography variant="h6" gutterBottom sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        mb: 3 
      }}>
        <AgricultureIcon sx={{ color: '#4CAF50' }} />
        Recommended Practices ({practices.length})
        {isAIGenerated() && (
          <Chip 
            label="AI Powered" 
            size="small" 
            sx={{ 
              bgcolor: '#E3F2FD', 
              color: '#1976D2',
              fontWeight: 'bold'
            }} 
          />
        )}
      </Typography>

      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        gap: 3
      }}>
        {practices.map((practice) => (
          <Card
            key={practice.id}
            sx={{
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              border: selectedPractices.includes(practice.id) 
                ? '2px solid #4CAF50' 
                : '1px solid #E0E0E0',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 25px rgba(76, 175, 80, 0.2)',
                border: '2px solid #4CAF50'
              }
            }}
            onClick={() => handlePracticeClick(practice)}
          >
            <CardContent>
              {/* Practice Header */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.dark', flex: 1 }}>
                  {practice.name}
                </Typography>
                <Tooltip title={`Difficulty: ${practice.implementation.difficulty}`}>
                  <Chip
                    size="small"
                    label={practice.implementation.difficulty}
                    sx={{
                      bgcolor: getDifficultyColor(practice.implementation.difficulty),
                      color: 'white',
                      fontWeight: 600,
                      ml: 1
                    }}
                  />
                </Tooltip>
              </Box>

              <Typography variant="body2" color="text.secondary" paragraph>
                {practice.description}
              </Typography>

              {/* Key Metrics */}
              <Box sx={{ 
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 1,
                mb: 2
              }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Water Savings
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#2196F3' }}>
                    {practice.environmentalImpact.waterSavings}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Implementation Time
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {practice.implementation.timeframe}
                  </Typography>
                </Box>
              </Box>

              {/* Cost Estimate */}
              <Box sx={{ 
                bgcolor: '#F5F5F5', 
                p: 2, 
                borderRadius: 2, 
                mb: 2 
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <MoneyIcon sx={{ fontSize: 16, color: '#666' }} />
                  <Typography variant="caption" color="text.secondary">
                    Estimated Cost for {landSize} acres
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#4CAF50' }}>
                  {practice.estimatedImplementationCost 
                    ? `${formatCurrency(practice.estimatedImplementationCost.min, practice.estimatedImplementationCost.currency)} - ${formatCurrency(practice.estimatedImplementationCost.max, practice.estimatedImplementationCost.currency)}`
                    : `${formatCurrency(practice.implementation.estimatedCost.min * landSize)} - ${formatCurrency(practice.implementation.estimatedCost.max * landSize)}`
                  }
                </Typography>
              </Box>

              {/* Benefits */}
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Key Benefits:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                  {practice.benefits.slice(0, 3).map((benefit, index) => (
                    <Chip
                      key={index}
                      label={benefit}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.7rem' }}
                    />
                  ))}
                </Box>
              </Box>

              {/* Score */}
              {practice.score && (
                <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #E0E0E0' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      Suitability Score
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#4CAF50' }}>
                      {practice.score}/10
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(practice.score / 10) * 100}
                    sx={{
                      mt: 1,
                      height: 6,
                      borderRadius: 3,
                      bgcolor: '#E0E0E0',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: '#4CAF50',
                        borderRadius: 3
                      }
                    }}
                  />
                </Box>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Practice Details Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        {selectedPractice && (
          <>
            <DialogTitle sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              bgcolor: '#F1F8E9',
              color: 'primary.dark'
            }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {selectedPractice.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedPractice.category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Typography>
              </Box>
              <IconButton onClick={() => setDetailsOpen(false)}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 3 }}>
              <Typography variant="body1" paragraph>
                {selectedPractice.description}
              </Typography>

              {/* Implementation Steps */}
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TimelineIcon sx={{ color: '#4CAF50' }} />
                    <Typography variant="h6">Implementation Steps</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    {selectedPractice.implementation.steps.map((step, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <CheckIcon sx={{ color: '#4CAF50' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={`${index + 1}. ${step}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                  
                  <Box sx={{ mt: 2, p: 2, bgcolor: '#F5F5F5', borderRadius: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Implementation Details:
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Timeframe
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {selectedPractice.implementation.timeframe}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Difficulty
                        </Typography>
                        <Chip
                          size="small"
                          label={selectedPractice.implementation.difficulty}
                          sx={{
                            bgcolor: getDifficultyColor(selectedPractice.implementation.difficulty),
                            color: 'white',
                            fontWeight: 600
                          }}
                        />
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Cost Range
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          ₹{selectedPractice.implementation.estimatedCost.min}-{selectedPractice.implementation.estimatedCost.max} {selectedPractice.implementation.estimatedCost.unit}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </AccordionDetails>
              </Accordion>

              {/* Environmental Impact */}
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EcoIcon sx={{ color: '#4CAF50' }} />
                    <Typography variant="h6">Environmental Impact</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ 
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    gap: 2
                  }}>
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        💧 Water Savings
                      </Typography>
                      <Typography variant="h6" sx={{ 
                        color: getImpactColor(selectedPractice.environmentalImpact.waterSavings)
                      }}>
                        {selectedPractice.environmentalImpact.waterSavings}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        ⚡ Energy Savings
                      </Typography>
                      <Typography variant="h6" sx={{ 
                        color: getImpactColor(selectedPractice.environmentalImpact.energySavings)
                      }}>
                        {selectedPractice.environmentalImpact.energySavings}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        🌍 Carbon Reduction
                      </Typography>
                      <Typography variant="h6" sx={{ 
                        color: getImpactColor(selectedPractice.environmentalImpact.carbonReduction)
                      }}>
                        {selectedPractice.environmentalImpact.carbonReduction}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        🦋 Biodiversity Impact
                      </Typography>
                      <Typography variant="h6" sx={{ 
                        color: getImpactColor(selectedPractice.environmentalImpact.biodiversityImpact)
                      }}>
                        {selectedPractice.environmentalImpact.biodiversityImpact}
                      </Typography>
                    </Box>
                  </Box>
                </AccordionDetails>
              </Accordion>

              {/* Benefits */}
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrendingUpIcon sx={{ color: '#4CAF50' }} />
                    <Typography variant="h6">Benefits</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    {selectedPractice.benefits.map((benefit, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <CheckIcon sx={{ color: '#4CAF50' }} />
                        </ListItemIcon>
                        <ListItemText primary={benefit} />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 0 }}>
              <Button 
                onClick={() => setDetailsOpen(false)}
                variant="outlined"
              >
                Close
              </Button>
              <Button
                variant="contained"
                onClick={() => togglePracticeSelection(selectedPractice.id)}
                sx={{ bgcolor: '#4CAF50' }}
              >
                {selectedPractices.includes(selectedPractice.id) ? 'Remove from Plan' : 'Add to Plan'}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default SustainablePractices;
