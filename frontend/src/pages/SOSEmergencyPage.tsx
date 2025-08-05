import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Stepper,
  Step,
  StepLabel,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  AlertTitle,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Paper,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Emergency as EmergencyIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  ExpandMore as ExpandMoreIcon,
  Assignment as AssignmentIcon,
  ContactPhone as ContactPhoneIcon,
  LocalHospital as HospitalIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { CropCalendarAPI } from '../services/api';
import { SOSEmergencyRequest, SOSResponse, EmergencyRecommendations, EmergencyResourcesResponse } from '../types';

const SOSEmergencyPage: React.FC = () => {
  const { emergencyId } = useParams<{ emergencyId?: string }>();
  const navigate = useNavigate();
  
  const [activeStep, setActiveStep] = useState(0);
  const [emergencyData, setEmergencyData] = useState<Partial<SOSEmergencyRequest>>({
    emergencyType: undefined,
    severity: 'medium',
    description: '',
    contactInfo: {},
    location: { latitude: 0, longitude: 0 }
  });
  const [sosResponse, setSOSResponse] = useState<SOSResponse | null>(null);
  const [recommendations, setRecommendations] = useState<EmergencyRecommendations | null>(null);
  const [nearbyResources, setNearbyResources] = useState<EmergencyResourcesResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const steps = ['Emergency Details', 'Contact Information', 'Submit & Response'];

  const emergencyTypes = [
    { value: 'pest_disease', label: 'Pest & Disease Outbreak', icon: '🐛' },
    { value: 'weather_damage', label: 'Weather Damage', icon: '🌪️' },
    { value: 'equipment_failure', label: 'Equipment Failure', icon: '⚙️' },
    { value: 'soil_issues', label: 'Soil Problems', icon: '🌱' },
    { value: 'irrigation_problems', label: 'Irrigation Issues', icon: '💧' },
    { value: 'livestock_emergency', label: 'Livestock Emergency', icon: '🐄' },
    { value: 'other', label: 'Other Emergency', icon: '⚠️' }
  ];

  const severityLevels = [
    { value: 'low', label: 'Low', color: '#4CAF50', description: 'Minor issue, not urgent' },
    { value: 'medium', label: 'Medium', color: '#FF9800', description: 'Moderate concern, needs attention' },
    { value: 'high', label: 'High', color: '#F44336', description: 'Serious issue, urgent response needed' },
    { value: 'critical', label: 'Critical', color: '#D32F2F', description: 'Emergency situation, immediate action required' }
  ];

  // Get user location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          setLocation(userLocation);
          setEmergencyData(prev => ({ ...prev, location: userLocation }));
        },
        (error) => {
          console.error('Error getting location:', error);
          // Default to a sample location if geolocation fails
          const defaultLocation = { latitude: 40.7128, longitude: -74.0060 };
          setLocation(defaultLocation);
          setEmergencyData(prev => ({ ...prev, location: defaultLocation }));
        }
      );
    }
  }, []);

  // If emergencyId is provided, load existing emergency
  useEffect(() => {
    if (emergencyId) {
      loadEmergencyDetails(emergencyId);
    }
  }, [emergencyId]);

  const loadEmergencyDetails = async (id: string) => {
    try {
      const status = await CropCalendarAPI.getEmergencyStatus(id);
      // Set the emergency data based on loaded status
      setActiveStep(2); // Jump to response step
    } catch (error) {
      console.error('Failed to load emergency details:', error);
    }
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmitEmergency = async () => {
    if (!emergencyData.emergencyType || !emergencyData.description || !location) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const requestData: SOSEmergencyRequest = {
        location: location,
        emergencyType: emergencyData.emergencyType as any,
        severity: emergencyData.severity as any,
        description: emergencyData.description,
        contactInfo: emergencyData.contactInfo || {},
        cropType: emergencyData.cropType,
        farmSize: emergencyData.farmSize
      };

      const response = await CropCalendarAPI.submitSOSEmergency(requestData);
      setSOSResponse(response);

      // Get recommendations
      const recs = await CropCalendarAPI.getEmergencyRecommendations({
        emergencyType: emergencyData.emergencyType!,
        severity: emergencyData.severity!,
        location: location,
        cropType: emergencyData.cropType,
        description: emergencyData.description!
      });
      setRecommendations(recs);

      // Get nearby resources
      const resources = await CropCalendarAPI.getNearbyResources(location);
      setNearbyResources(resources);

      handleNext();
    } catch (error) {
      console.error('Failed to submit emergency:', error);
      alert('Failed to submit emergency request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Emergency Details
            </Typography>
            
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Emergency Type</InputLabel>
              <Select
                value={emergencyData.emergencyType}
                label="Emergency Type"
                onChange={(e) => setEmergencyData(prev => ({ ...prev, emergencyType: e.target.value }))}
              >
                {emergencyTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span>{type.icon}</span>
                      {type.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Severity Level</InputLabel>
              <Select
                value={emergencyData.severity}
                label="Severity Level"
                onChange={(e) => setEmergencyData(prev => ({ ...prev, severity: e.target.value }))}
              >
                {severityLevels.map((level) => (
                  <MenuItem key={level.value} value={level.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip 
                        size="small" 
                        label={level.label}
                        sx={{ bgcolor: level.color, color: 'white', minWidth: 60 }}
                      />
                      <Typography variant="body2">{level.description}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Describe the Emergency"
              placeholder="Please provide detailed information about the emergency situation, including what happened, when it started, and any actions you've already taken..."
              value={emergencyData.description}
              onChange={(e) => setEmergencyData(prev => ({ ...prev, description: e.target.value }))}
              sx={{ mb: 3 }}
            />

            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 2
            }}>
              <TextField
                fullWidth
                label="Crop Type (Optional)"
                value={emergencyData.cropType || ''}
                onChange={(e) => setEmergencyData(prev => ({ ...prev, cropType: e.target.value }))}
              />
              <TextField
                fullWidth
                type="number"
                label="Farm Size (acres)"
                value={emergencyData.farmSize || ''}
                onChange={(e) => setEmergencyData(prev => ({ ...prev, farmSize: parseFloat(e.target.value) }))}
              />
            </Box>

            {location && (
              <Alert severity="info" sx={{ mt: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationIcon />
                  <Typography variant="body2">
                    Location detected: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                  </Typography>
                </Box>
              </Alert>
            )}
          </Box>
        );

      case 1:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Contact Information
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="Your Name"
                value={emergencyData.contactInfo?.name || ''}
                onChange={(e) => setEmergencyData(prev => ({ 
                  ...prev, 
                  contactInfo: { ...prev.contactInfo, name: e.target.value }
                }))}
              />
            </Box>
            
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 2
            }}>
              <TextField
                fullWidth
                label="Phone Number"
                type="tel"
                value={emergencyData.contactInfo?.phone || ''}
                onChange={(e) => setEmergencyData(prev => ({ 
                  ...prev, 
                  contactInfo: { ...prev.contactInfo, phone: e.target.value }
                }))}
              />
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={emergencyData.contactInfo?.email || ''}
                onChange={(e) => setEmergencyData(prev => ({ 
                  ...prev, 
                  contactInfo: { ...prev.contactInfo, email: e.target.value }
                }))}
              />
            </Box>

            <Alert severity="warning" sx={{ mt: 3 }}>
              <AlertTitle>Emergency Contact Information</AlertTitle>
              Your contact information will be shared with emergency responders and agricultural experts to provide immediate assistance.
            </Alert>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ mt: 3 }}>
            {isSubmitting ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
                <CircularProgress size={60} sx={{ color: '#D32F2F', mb: 3 }} />
                <Typography variant="h6">Submitting Emergency Request...</Typography>
                <Typography variant="body2" color="text.secondary">
                  Please wait while we process your emergency request
                </Typography>
              </Box>
            ) : sosResponse ? (
              <Box>
                <Alert severity="success" sx={{ mb: 3 }}>
                  <AlertTitle>Emergency Request Submitted Successfully!</AlertTitle>
                  Ticket #{sosResponse.ticketNumber} - Response time: {sosResponse.estimatedResponseTime}
                </Alert>

                {/* Immediate Actions */}
                <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <WarningIcon sx={{ color: '#FF9800' }} />
                      <Typography variant="h6">Immediate Actions Required</Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List>
                      {sosResponse.immediateActions.map((action, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <CheckIcon sx={{ color: '#4CAF50' }} />
                          </ListItemIcon>
                          <ListItemText primary={action} />
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>

                {/* Emergency Contacts */}
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ContactPhoneIcon sx={{ color: '#2196F3' }} />
                      <Typography variant="h6">Emergency Contacts</Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List>
                      {sosResponse.emergencyContacts.map((contact, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <PhoneIcon sx={{ color: '#4CAF50' }} />
                          </ListItemIcon>
                          <ListItemText 
                            primary={contact.type}
                            secondary={`${contact.phone} - Available: ${contact.available}`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>

                {/* Detailed Recommendations */}
                {recommendations && (
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AssignmentIcon sx={{ color: '#8BC34A' }} />
                        <Typography variant="h6">Detailed Recommendations</Typography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                          Short-term Actions:
                        </Typography>
                        <List dense>
                          {recommendations.shortTerm.map((action, index) => (
                            <ListItem key={index}>
                              <ListItemText primary={`• ${action}`} />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                          Estimated Recovery: {recommendations.timeframe}
                        </Typography>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                          Estimated Costs: {recommendations.estimatedCosts.range}
                        </Typography>
                        <Chip 
                          label={`Risk Level: ${recommendations.riskLevel.toUpperCase()}`}
                          color={recommendations.riskLevel === 'high' ? 'error' : recommendations.riskLevel === 'medium' ? 'warning' : 'success'}
                        />
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                )}

                {/* Nearby Resources */}
                {nearbyResources && nearbyResources.resources.length > 0 && (
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <HospitalIcon sx={{ color: '#F44336' }} />
                        <Typography variant="h6">Nearby Resources ({nearbyResources.totalFound})</Typography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List>
                        {nearbyResources.resources.slice(0, 5).map((resource, index) => (
                          <ListItem key={index}>
                            <ListItemIcon>
                              <LocationIcon sx={{ color: '#2196F3' }} />
                            </ListItemIcon>
                            <ListItemText 
                              primary={resource.name}
                              secondary={`${resource.distance}km away - ${resource.phone} - ETA: ${resource.estimatedArrival}`}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                )}
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Ready to Submit Emergency Request
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Review your information and click submit to send your emergency request to our response team.
                </Typography>
              </Box>
            )}
          </Box>
        );

      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Back
        </Button>
        
        <Paper sx={{ p: 3, bgcolor: '#FFEBEE', border: '2px solid #F44336' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <EmergencyIcon sx={{ fontSize: 40, color: '#D32F2F' }} />
            <Box>
              <Typography variant="h4" sx={{ color: '#D32F2F', fontWeight: 600 }}>
                🚨 Agricultural Emergency Response
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Get immediate assistance for farm emergencies
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
              disabled={activeStep === 0 || isSubmitting}
              onClick={handleBack}
            >
              Back
            </Button>
            
            <Box>
              {activeStep === steps.length - 1 ? (
                sosResponse ? (
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
                    onClick={handleSubmitEmergency}
                    disabled={isSubmitting || !emergencyData.emergencyType || !emergencyData.description}
                    sx={{ bgcolor: '#D32F2F' }}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Emergency Request'}
                  </Button>
                )
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={
                    (activeStep === 0 && (!emergencyData.emergencyType || !emergencyData.description)) ||
                    isSubmitting
                  }
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default SOSEmergencyPage;
