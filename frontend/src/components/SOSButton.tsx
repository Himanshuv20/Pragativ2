import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Card,
  CardContent,
  IconButton,
  Chip,
  Alert,
  AlertTitle,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Fab,
  Tooltip
} from '@mui/material';
import {
  WeatherCloudyIcon,
  EmergencyIcon,
  PhoneIcon,
  CloseIcon,
  WarningIcon,
  AgricultureIcon,
  BuildIcon,
  WaterIcon,
  BugIcon,
  PetsIcon
} from './icons/AppIcons';

interface SOSButtonProps {
  onEmergencySubmit?: (emergencyData: any) => void;
}

const SOSButton: React.FC<SOSButtonProps> = ({ onEmergencySubmit }) => {
  const [open, setOpen] = useState(false);
  const [selectedEmergency, setSelectedEmergency] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const emergencyTypes = [
    {
      type: 'pest_disease',
      title: 'Pest & Disease',
      icon: <BugIcon />,
      color: '#FF5722',
      description: 'Crop infestations, plant diseases, fungal infections',
      urgency: 'High'
    },
    {
      type: 'weather_damage',
      title: 'Weather Damage',
      icon: <WeatherCloudyIcon />,
      color: '#2196F3',
      description: 'Storm damage, hail, drought, flooding',
      urgency: 'Critical'
    },
    {
      type: 'equipment_failure',
      title: 'Equipment Failure',
      icon: <BuildIcon />,
      color: '#FF9800',
      description: 'Machinery breakdown, irrigation system failure',
      urgency: 'Medium'
    },
    {
      type: 'soil_issues',
      title: 'Soil Problems',
      icon: <AgricultureIcon />,
      color: '#795548',
      description: 'Soil contamination, erosion, pH issues',
      urgency: 'Medium'
    },
    {
      type: 'irrigation_problems',
      title: 'Water Issues',
      icon: <WaterIcon />,
      color: '#00BCD4',
      description: 'Water shortage, pump failure, pipe burst',
      urgency: 'High'
    },
    {
      type: 'livestock_emergency',
      title: 'Livestock Emergency',
      icon: <PetsIcon />,
      color: '#8BC34A',
      description: 'Animal health issues, livestock accidents',
      urgency: 'Critical'
    }
  ];

  const handleEmergencySelect = (emergencyType: string) => {
    setSelectedEmergency(emergencyType);
    // In a real implementation, this would open a detailed form
    // For now, we'll simulate the submission
    handleEmergencySubmit(emergencyType);
  };

  const handleEmergencySubmit = async (emergencyType: string) => {
    setIsSubmitting(true);
    
    // Simulate getting location
    const location = { latitude: 40.7128, longitude: -74.0060 }; // Mock location
    
    const emergencyData = {
      location,
      emergencyType,
      severity: 'high',
      description: `Emergency assistance needed for ${emergencyTypes.find(e => e.type === emergencyType)?.title}`,
      contactInfo: {
        phone: '+1-555-0123', // Mock contact
        name: 'Farm Manager'
      },
      cropType: 'wheat', // Mock crop
      farmSize: 100 // Mock farm size
    };

    try {
      // Call the parent callback if provided
      if (onEmergencySubmit) {
        await onEmergencySubmit(emergencyData);
      }
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setOpen(false);
      setSelectedEmergency(null);
    } catch (error) {
      console.error('Failed to submit emergency:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'Critical': return '#F44336';
      case 'High': return '#FF9800';
      case 'Medium': return '#FFC107';
      default: return '#4CAF50';
    }
  };

  return (
    <>
      {/* SOS FAB - Fixed Position Bottom Right */}
      <Tooltip title="Emergency SOS" placement="left" arrow>
        <Fab
          color="error"
          onClick={() => setOpen(true)}
          sx={{
            position: 'fixed',
            bottom: { xs: 16, sm: 24 },
            right: { xs: 16, sm: 24 },
            width: { xs: 56, sm: 64 },
            height: { xs: 56, sm: 64 },
            bgcolor: '#D32F2F',
            color: 'white',
            fontSize: { xs: '1.5rem', sm: '1.75rem' },
            zIndex: 1000,
            boxShadow: '0 6px 20px rgba(211, 47, 47, 0.4)',
            border: '2px solid rgba(255, 255, 255, 0.1)',
            '&:hover': {
              bgcolor: '#B71C1C',
              transform: 'scale(1.1)',
              boxShadow: '0 8px 25px rgba(211, 47, 47, 0.6)',
            },
            animation: 'pulse 2s infinite',
            '@keyframes pulse': {
              '0%': { 
                boxShadow: '0 6px 20px rgba(211, 47, 47, 0.4)'
              },
              '50%': { 
                boxShadow: '0 6px 20px rgba(211, 47, 47, 0.8), 0 0 0 4px rgba(211, 47, 47, 0.3)'
              },
              '100%': { 
                boxShadow: '0 6px 20px rgba(211, 47, 47, 0.4)'
              }
            }
          }}
        >
          <EmergencyIcon sx={{ fontSize: { xs: 28, sm: 32 } }} />
        </Fab>
      </Tooltip>

      {/* Emergency Selection Dialog */}
      <Dialog
        open={open}
        onClose={() => !isSubmitting && setOpen(false)}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : 3,
            maxHeight: '90vh'
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          bgcolor: '#D32F2F',
          color: 'white',
          py: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EmergencyIcon />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              🚨 Emergency Assistance
            </Typography>
          </Box>
          {!isSubmitting && (
            <IconButton 
              onClick={() => setOpen(false)}
              sx={{ color: 'white' }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>

        <DialogContent sx={{ p: { xs: 2, md: 3 } }}>
          {isSubmitting ? (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              py: 6,
              gap: 3
            }}>
              <CircularProgress size={60} sx={{ color: '#D32F2F' }} />
              <Typography variant="h6" textAlign="center">
                Submitting Emergency Request...
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                Your emergency request is being processed. Emergency responders will be notified shortly.
              </Typography>
            </Box>
          ) : (
            <>
              <Alert severity="warning" sx={{ mb: 3 }}>
                <AlertTitle sx={{ fontWeight: 600 }}>Emergency Response System</AlertTitle>
                Select the type of agricultural emergency you're experiencing. 
                Emergency responders will be notified immediately.
              </Alert>

              <Typography variant="h6" gutterBottom sx={{ 
                mb: 3, 
                color: 'primary.dark',
                fontWeight: 600
              }}>
                🎯 Select Emergency Type:
              </Typography>

              <Box sx={{ 
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 2
              }}>
                {emergencyTypes.map((emergency) => (
                  <Card
                    key={emergency.type}
                    sx={{
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      border: selectedEmergency === emergency.type 
                        ? `3px solid ${emergency.color}` 
                        : '2px solid transparent',
                      transform: selectedEmergency === emergency.type 
                        ? 'scale(1.02)' 
                        : 'scale(1)',
                      '&:hover': {
                        transform: 'scale(1.02)',
                        boxShadow: `0 8px 25px ${emergency.color}40`,
                        border: `2px solid ${emergency.color}80`
                      }
                    }}
                    onClick={() => handleEmergencySelect(emergency.type)}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'flex-start', 
                        gap: 2,
                        mb: 2
                      }}>
                        <Box sx={{ 
                          color: emergency.color, 
                          fontSize: '2rem',
                          minWidth: 'auto'
                        }}>
                          {emergency.icon}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" sx={{ 
                            fontWeight: 600,
                            color: 'primary.dark',
                            mb: 0.5
                          }}>
                            {emergency.title}
                          </Typography>
                          <Chip 
                            label={emergency.urgency}
                            size="small"
                            sx={{
                              bgcolor: getUrgencyColor(emergency.urgency),
                              color: 'white',
                              fontWeight: 600,
                              fontSize: '0.75rem'
                            }}
                          />
                        </Box>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {emergency.description}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>

              <Box sx={{ mt: 4, p: 3, bgcolor: '#FFF3E0', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <WarningIcon sx={{ color: '#FF9800' }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#E65100' }}>
                    Emergency Response Information
                  </Typography>
                </Box>
                <Typography variant="body2" paragraph>
                  • Emergency responders will be notified within 15 minutes
                </Typography>
                <Typography variant="body2" paragraph>
                  • Your location and contact information will be shared
                </Typography>
                <Typography variant="body2" paragraph>
                  • You'll receive immediate guidance and resource contacts
                </Typography>
                <Typography variant="body2">
                  • For life-threatening emergencies, call 911 immediately
                </Typography>
              </Box>
            </>
          )}
        </DialogContent>

        {!isSubmitting && (
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button onClick={() => setOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                setOpen(false);
                navigate('/sos-emergency');
              }}
              sx={{ mr: 1 }}
            >
              Detailed Form
            </Button>
            <Button
              variant="contained"
              startIcon={<PhoneIcon />}
              sx={{ 
                bgcolor: '#D32F2F',
                '&:hover': { bgcolor: '#B71C1C' }
              }}
              href="tel:911"
            >
              Call 911
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </>
  );
};

export default SOSButton;
