import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  FormControlLabel,
  Checkbox,
  Alert,
  CircularProgress,
  Divider,
  Chip,
  Autocomplete,
  Stack,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useAuth } from '../context/AuthContext';
import { RegisterRequest } from '../services/authAPI';
import { useNavigate } from 'react-router-dom';

const StyledPaper = styled(Paper)(({ theme }) => ({
  maxWidth: 800,
  margin: '0 auto',
  padding: theme.spacing(4),
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  borderRadius: theme.spacing(2),
  boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
}));

const StepContent = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
  minHeight: '400px',
}));

const FormSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const FormRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
}));

const steps = ['Personal Details', 'Location & Contact', 'Farm Details', 'Experience & Preferences'];

// Indian states for dropdown
const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

const SOIL_TYPES = [
  'Alluvial', 'Black (Regur)', 'Red & Yellow', 'Laterite', 'Arid', 'Saline', 'Peaty', 'Forest'
];

const IRRIGATION_TYPES = [
  'Rain-fed', 'Canal', 'Tube well', 'Well', 'Tank', 'Sprinkler', 'Drip', 'Mixed'
];

const COMMON_CROPS = [
  'Rice', 'Wheat', 'Maize', 'Barley', 'Millet', 'Sorghum', 'Cotton', 'Sugarcane',
  'Groundnut', 'Soybean', 'Mustard', 'Sunflower', 'Gram', 'Arhar', 'Masur',
  'Onion', 'Potato', 'Tomato', 'Brinjal', 'Okra', 'Chilli', 'Turmeric'
];

const LANGUAGES = [
  'Hindi', 'English', 'Bengali', 'Telugu', 'Marathi', 'Tamil', 'Gujarati',
  'Urdu', 'Kannada', 'Odia', 'Malayalam', 'Punjabi', 'Assamese'
];

export const RegistrationPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agreements, setAgreements] = useState({
    terms: false,
    dataSharing: false,
    notifications: true,
  });

  const [formData, setFormData] = useState<RegisterRequest>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    farmLocation: {
      state: '',
      district: '',
      village: '',
      latitude: undefined,
      longitude: undefined,
    },
    farmDetails: {
      farmSize: 0,
      farmSizeUnit: 'acres',
      soilType: '',
      irrigationType: '',
      mainCrops: [],
    },
    experience: 0,
    preferredLanguage: 'Hindi',
  });

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setError(null);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setError(null);
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0:
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
          setError('Please fill all required fields');
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return false;
        }
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters');
          return false;
        }
        break;
      case 1:
        if (!formData.phoneNumber || !formData.farmLocation.state || !formData.farmLocation.district) {
          setError('Please fill all required location fields');
          return false;
        }
        break;
      case 2:
        if (!formData.farmDetails.farmSize || !formData.farmDetails.soilType || !formData.farmDetails.irrigationType) {
          setError('Please fill all required farm details');
          return false;
        }
        if (formData.farmDetails.mainCrops.length === 0) {
          setError('Please select at least one main crop');
          return false;
        }
        break;
      case 3:
        if (!agreements.terms || !agreements.dataSharing) {
          setError('Please accept the terms and conditions and data sharing agreement');
          return false;
        }
        break;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setLoading(true);
    setError(null);

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => {
      const keys = field.split('.');
      if (keys.length === 1) {
        return { ...prev, [field]: value };
      } else if (keys.length === 2) {
        const parentKey = keys[0] as keyof RegisterRequest;
        const parentValue = prev[parentKey];
        if (typeof parentValue === 'object' && parentValue !== null) {
          return {
            ...prev,
            [parentKey]: {
              ...parentValue,
              [keys[1]]: value,
            },
          };
        }
      }
      return prev;
    });
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <FormSection>
            <Typography variant="h6" gutterBottom>Personal Information</Typography>
            <FormRow>
              <TextField
                required
                fullWidth
                label="First Name"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
              />
              <TextField
                required
                fullWidth
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
              />
            </FormRow>
            <FormRow>
              <TextField
                required
                fullWidth
                type="email"
                label="Email Address"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </FormRow>
            <FormRow>
              <TextField
                required
                fullWidth
                type="password"
                label="Password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                helperText="Minimum 6 characters"
              />
              <TextField
                required
                fullWidth
                type="password"
                label="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              />
            </FormRow>
          </FormSection>
        );

      case 1:
        return (
          <FormSection>
            <Typography variant="h6" gutterBottom>Location & Contact</Typography>
            <FormRow>
              <TextField
                required
                fullWidth
                label="Phone Number"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                placeholder="+91 XXXXX XXXXX"
              />
              <TextField
                required
                select
                fullWidth
                label="State"
                value={formData.farmLocation.state}
                onChange={(e) => handleInputChange('farmLocation.state', e.target.value)}
              >
                {INDIAN_STATES.map((state) => (
                  <MenuItem key={state} value={state}>
                    {state}
                  </MenuItem>
                ))}
              </TextField>
            </FormRow>
            <FormRow>
              <TextField
                required
                fullWidth
                label="District"
                value={formData.farmLocation.district}
                onChange={(e) => handleInputChange('farmLocation.district', e.target.value)}
              />
              <TextField
                fullWidth
                label="Village/Town"
                value={formData.farmLocation.village}
                onChange={(e) => handleInputChange('farmLocation.village', e.target.value)}
              />
            </FormRow>
            <FormRow>
              <TextField
                fullWidth
                type="number"
                label="Latitude (Optional)"
                value={formData.farmLocation.latitude || ''}
                onChange={(e) => handleInputChange('farmLocation.latitude', parseFloat(e.target.value))}
                inputProps={{ step: 0.000001 }}
              />
              <TextField
                fullWidth
                type="number"
                label="Longitude (Optional)"
                value={formData.farmLocation.longitude || ''}
                onChange={(e) => handleInputChange('farmLocation.longitude', parseFloat(e.target.value))}
                inputProps={{ step: 0.000001 }}
              />
            </FormRow>
          </FormSection>
        );

      case 2:
        return (
          <FormSection>
            <Typography variant="h6" gutterBottom>Farm Details</Typography>
            <FormRow>
              <TextField
                required
                fullWidth
                type="number"
                label="Farm Size"
                value={formData.farmDetails.farmSize}
                onChange={(e) => handleInputChange('farmDetails.farmSize', parseFloat(e.target.value))}
                inputProps={{ min: 0, step: 0.1 }}
              />
              <TextField
                required
                select
                fullWidth
                label="Unit"
                value={formData.farmDetails.farmSizeUnit}
                onChange={(e) => handleInputChange('farmDetails.farmSizeUnit', e.target.value)}
              >
                <MenuItem value="acres">Acres</MenuItem>
                <MenuItem value="hectares">Hectares</MenuItem>
              </TextField>
            </FormRow>
            <FormRow>
              <TextField
                required
                select
                fullWidth
                label="Soil Type"
                value={formData.farmDetails.soilType}
                onChange={(e) => handleInputChange('farmDetails.soilType', e.target.value)}
              >
                {SOIL_TYPES.map((soil) => (
                  <MenuItem key={soil} value={soil}>
                    {soil}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                required
                select
                fullWidth
                label="Irrigation Type"
                value={formData.farmDetails.irrigationType}
                onChange={(e) => handleInputChange('farmDetails.irrigationType', e.target.value)}
              >
                {IRRIGATION_TYPES.map((irrigation) => (
                  <MenuItem key={irrigation} value={irrigation}>
                    {irrigation}
                  </MenuItem>
                ))}
              </TextField>
            </FormRow>
            <FormRow>
              <Autocomplete
                multiple
                fullWidth
                options={COMMON_CROPS}
                value={formData.farmDetails.mainCrops}
                onChange={(_, newValue) => handleInputChange('farmDetails.mainCrops', newValue)}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip variant="outlined" label={option} {...getTagProps({ index })} key={option} />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    label="Main Crops"
                    placeholder="Select crops you grow"
                  />
                )}
              />
            </FormRow>
          </FormSection>
        );

      case 3:
        return (
          <FormSection>
            <Typography variant="h6" gutterBottom>Experience & Preferences</Typography>
            <FormRow>
              <TextField
                required
                fullWidth
                type="number"
                label="Years of Farming Experience"
                value={formData.experience}
                onChange={(e) => handleInputChange('experience', parseInt(e.target.value))}
                inputProps={{ min: 0, max: 100 }}
              />
              <TextField
                select
                fullWidth
                label="Preferred Language"
                value={formData.preferredLanguage}
                onChange={(e) => handleInputChange('preferredLanguage', e.target.value)}
              >
                {LANGUAGES.map((language) => (
                  <MenuItem key={language} value={language}>
                    {language}
                  </MenuItem>
                ))}
              </TextField>
            </FormRow>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>Agreements</Typography>
            <Stack spacing={1}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={agreements.terms}
                    onChange={(e) => setAgreements(prev => ({ ...prev, terms: e.target.checked }))}
                    required
                  />
                }
                label="I agree to the Terms and Conditions *"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={agreements.dataSharing}
                    onChange={(e) => setAgreements(prev => ({ ...prev, dataSharing: e.target.checked }))}
                    required
                  />
                }
                label="I consent to data sharing for agricultural insights *"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={agreements.notifications}
                    onChange={(e) => setAgreements(prev => ({ ...prev, notifications: e.target.checked }))}
                  />
                }
                label="I want to receive notifications about weather alerts and farming tips"
              />
            </Stack>
          </FormSection>
        );

      default:
        return <Typography>Unknown step</Typography>;
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', py: 4 }}>
      <StyledPaper>
        <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
          Farmer Registration
        </Typography>
        <Typography variant="subtitle1" align="center" color="textSecondary" gutterBottom>
          Join our agricultural advisory platform for personalized farming insights
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mt: 4, mb: 2 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <StepContent>
          {renderStepContent(activeStep)}
        </StepContent>

        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
          <Button
            color="inherit"
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? 'Creating Account...' : 'Complete Registration'}
            </Button>
          ) : (
            <Button variant="contained" onClick={handleNext}>
              Next
            </Button>
          )}
        </Box>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="textSecondary">
            Already have an account?{' '}
            <Button color="primary" onClick={() => navigate('/login')}>
              Sign In
            </Button>
          </Typography>
        </Box>
      </StyledPaper>
    </Box>
  );
};
