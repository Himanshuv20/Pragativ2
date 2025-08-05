import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useCropCalendar } from '../context/CropCalendarContext';
import { useLanguage } from '../context/LanguageContext';
import CropCalendarAPI from '../services/api';
import { SupportedCrop } from '../types';

// Import step components (will create these next)
import LocationStep from '../components/LocationStep';
import CropSelectionStep from '../components/CropSelectionStep';
import AreaStep from '../components/AreaStep';
import CalendarResults from '../components/CalendarResults';

const CropCalendarPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const { t } = useLanguage();
  
  const steps = [
    t('cropCalendar.steps.location', 'Select Location'), 
    t('cropCalendar.steps.crop', 'Choose Crop'), 
    t('cropCalendar.steps.area', 'Enter Area'), 
    t('cropCalendar.steps.calendar', 'View Calendar')
  ];
  
  const {
    formData,
    updateFormData,
    isLoading,
    error,
    cropCalendar,
    supportedCrops,
    setSupportedCrops,
    setIsLoading,
    setError,
    setCropCalendar,
    clearError,
  } = useCropCalendar();

  // Handle crop selection
  const handleCropSelect = (crop: SupportedCrop) => {
    updateFormData({ cropType: crop.name });
  };

  // Load supported crops on component mount
  useEffect(() => {
    const loadSupportedCrops = async () => {
      try {
        setIsLoading(true);
        const response = await CropCalendarAPI.getSupportedCrops();
        if (response.success && response.data) {
          setSupportedCrops(response.data);
        } else {
          setError(response.error || 'Failed to load supported crops');
        }
      } catch (err) {
        setError('Network error: Unable to load crops');
      } finally {
        setIsLoading(false);
      }
    };

    if (supportedCrops.length === 0) {
      loadSupportedCrops();
    }
  }, [supportedCrops.length, setSupportedCrops, setIsLoading, setError]);

  const handleNext = () => {
    clearError();
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    clearError();
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setCropCalendar(null);
    clearError();
  };

  const generateCropCalendar = async () => {
    if (!formData.location || !formData.cropType || !formData.area) {
      setError('Please complete all required fields');
      return;
    }

    try {
      setIsLoading(true);
      clearError();

      const requestData = {
        location: formData.location,
        area: formData.area,
        cropType: formData.cropType,
      };
      
      console.log('📤 Sending request data:', JSON.stringify(requestData, null, 2));

      const response = await CropCalendarAPI.generateCropCalendar(requestData);

      if (response.success && response.data) {
        setCropCalendar(response.data.cropCalendar);
        handleNext();
      } else {
        setError(response.error || response.message || 'Failed to generate crop calendar');
      }
    } catch (err: any) {
      setError(`Network error: ${err.message || 'Unable to generate calendar'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const isStepComplete = (step: number) => {
    switch (step) {
      case 0:
        return formData.location !== null;
      case 1:
        return formData.cropType !== '';
      case 2:
        return formData.area > 0;
      case 3:
        return cropCalendar !== null;
      default:
        return false;
    }
  };

  const canProceed = () => {
    return isStepComplete(activeStep);
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <LocationStep />;
      case 1:
        return (
          <CropSelectionStep 
            crops={supportedCrops} 
            selectedCrop={formData.cropType}
            onCropSelect={handleCropSelect}
          />
        );
      case 2:
        return <AreaStep />;
      case 3:
        return <CalendarResults />;
      default:
        return <div>Unknown step</div>;
    }
  };

  const isLastStep = activeStep === steps.length - 1;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ color: 'primary.dark' }}>
          {t('cropCalendar.title', 'Generate Your Crop Calendar')}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {t('cropCalendar.subtitle', 'Get personalized farming recommendations based on real-time satellite data')}
        </Typography>
      </Box>

      {/* Error Display */}
      {error && (
        <Box sx={{ mb: 3 }}>
          <Alert severity="error" onClose={clearError}>
            {error}
          </Alert>
        </Box>
      )}

      {/* Progress Stepper */}
      <Box sx={{ mb: 4 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={label} completed={isStepComplete(index)}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* Step Content */}
      <Box sx={{ minHeight: '400px', mb: 4 }}>
        {renderStepContent(activeStep)}
      </Box>

      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          variant="outlined"
          size="large"
        >
          {t('cropCalendar.buttons.back', 'Back')}
        </Button>

        <Box sx={{ display: 'flex', gap: 2 }}>
          {isLastStep ? (
            <Button onClick={handleReset} variant="outlined" size="large">
              {t('cropCalendar.buttons.tryAgain', 'Start Over')}
            </Button>
          ) : activeStep === steps.length - 2 ? (
            <Button
              onClick={generateCropCalendar}
              variant="contained"
              size="large"
              disabled={!canProceed() || isLoading}
              startIcon={isLoading ? <CircularProgress size={20} /> : null}
            >
              {isLoading ? t('cropCalendar.generating', 'Generating...') : t('cropCalendar.buttons.generate', 'Generate Calendar')}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              variant="contained"
              size="large"
              disabled={!canProceed()}
            >
              {t('cropCalendar.buttons.next', 'Next')}
            </Button>
          )}
        </Box>
      </Box>

      {/* Loading Overlay */}
      {isLoading && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Processing satellite data...
            </Typography>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default CropCalendarPage;
