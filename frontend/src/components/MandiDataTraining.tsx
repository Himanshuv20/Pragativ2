import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
  Grid,
  Chip,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Paper
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Agriculture as AgricultureIcon,
  TrendingUp as TrendingUpIcon,
  Storage as StorageIcon,
  Psychology as PsychologyIcon,
  LocationOn as LocationIcon,
  Timer as TimerIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import axios from 'axios';

interface TrainingStats {
  totalCrops: number;
  totalDataPoints: number;
  successfulCrops: number;
  failedCrops: number;
  maharashtraData: number;
  andhraData: number;
  trainingResults: any;
}

interface TrainingResult {
  success: boolean;
  stats: TrainingStats;
  duration: number;
  message: string;
  error?: string;
}

interface TrainingStatus {
  dataCollected: number;
  minimumRequired: number;
  modelTrained: boolean;
  lastModelTraining: string | null;
  modelPerformance: any;
  dataCollectionInterval: number;
  supportedCommodities: string[];
  supportedStates: string[];
}

const MandiDataTraining: React.FC = () => {
  const [isTraining, setIsTraining] = useState(false);
  const [trainingResult, setTrainingResult] = useState<TrainingResult | null>(null);
  const [trainingStatus, setTrainingStatus] = useState<TrainingStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  // Fetch current training status
  const fetchTrainingStatus = async () => {
    try {
      const response = await axios.get('/api/mandi-data/ml/training-status');
      if (response.data.success) {
        setTrainingStatus(response.data.data);
      }
    } catch (err: any) {
      console.error('Error fetching training status:', err);
    }
  };

  useEffect(() => {
    fetchTrainingStatus();
  }, []);

  // Start comprehensive training
  const startTraining = async () => {
    setIsTraining(true);
    setError(null);
    setTrainingResult(null);
    setProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 1, 95));
    }, 2000);

    try {
      const response = await axios.post('/api/mandi-data/ml/train-comprehensive', {}, {
        timeout: 600000 // 10 minutes
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (response.data.success) {
        setTrainingResult(response.data.data);
        await fetchTrainingStatus(); // Refresh status
      } else {
        setError(response.data.message || 'Training failed');
      }
    } catch (err: any) {
      clearInterval(progressInterval);
      setError(err.response?.data?.message || err.message || 'Training failed');
    } finally {
      setIsTraining(false);
    }
  };

  const cropCategories = [
    { name: 'Cereals & Grains', count: 7, color: '#4CAF50' },
    { name: 'Pulses', count: 8, color: '#FF9800' },
    { name: 'Oilseeds', count: 8, color: '#9C27B0' },
    { name: 'Cash Crops', count: 4, color: '#F44336' },
    { name: 'Vegetables', count: 20, color: '#2196F3' },
    { name: 'Fruits', count: 13, color: '#FF5722' },
    { name: 'Spices', count: 12, color: '#795548' },
    { name: 'Flowers', count: 4, color: '#E91E63' }
  ];

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <PsychologyIcon color="primary" sx={{ fontSize: 40 }} />
        Comprehensive Mandi Data Training
      </Typography>

      <Typography variant="body1" color="text.secondary" paragraph>
        Train machine learning model with latest market data for all crops from Maharashtra and Andhra Pradesh
      </Typography>

      {/* Current Status Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <StorageIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Current Training Status
          </Typography>
          
          {trainingStatus ? (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              <Box sx={{ minWidth: 200 }}>
                <Typography variant="body2" color="text.secondary">Data Collected</Typography>
                <Typography variant="h6">{trainingStatus.dataCollected} points</Typography>
              </Box>
              <Box sx={{ minWidth: 200 }}>
                <Typography variant="body2" color="text.secondary">Model Status</Typography>
                <Chip
                  label={trainingStatus.modelTrained ? 'Trained' : 'Not Trained'}
                  color={trainingStatus.modelTrained ? 'success' : 'warning'}
                  icon={trainingStatus.modelTrained ? <CheckCircleIcon /> : <ErrorIcon />}
                />
              </Box>
              <Box sx={{ minWidth: 200 }}>
                <Typography variant="body2" color="text.secondary">Supported Crops</Typography>
                <Typography variant="h6">{trainingStatus.supportedCommodities.length}</Typography>
              </Box>
              <Box sx={{ minWidth: 200 }}>
                <Typography variant="body2" color="text.secondary">Last Training</Typography>
                <Typography variant="body1">
                  {trainingStatus.lastModelTraining 
                    ? new Date(trainingStatus.lastModelTraining).toLocaleString()
                    : 'Never'
                  }
                </Typography>
              </Box>
            </Box>
          ) : (
            <CircularProgress size={24} />
          )}
        </CardContent>
      </Card>

      {/* Training Configuration */}
      <Accordion sx={{ mb: 3 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">
            <AgricultureIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Training Configuration
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            <Paper sx={{ p: 2, flex: 1, minWidth: 300 }}>
              <Typography variant="subtitle1" gutterBottom>
                <LocationIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Target States
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon><LocationIcon color="primary" /></ListItemIcon>
                  <ListItemText primary="Maharashtra" secondary="Complete market coverage" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><LocationIcon color="secondary" /></ListItemIcon>
                  <ListItemText primary="Andhra Pradesh" secondary="Complete market coverage" />
                </ListItem>
              </List>
            </Paper>
            
            <Paper sx={{ p: 2, flex: 1, minWidth: 300 }}>
              <Typography variant="subtitle1" gutterBottom>
                <AgricultureIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Crop Categories
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {cropCategories.map((category, index) => (
                  <Chip
                    key={index}
                    label={`${category.name} (${category.count})`}
                    size="small"
                    sx={{
                      backgroundColor: category.color,
                      color: 'white',
                      fontSize: '0.75rem'
                    }}
                  />
                ))}
              </Box>
            </Paper>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Training Controls */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              <TrendingUpIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Start Comprehensive Training
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={startTraining}
              disabled={isTraining}
              startIcon={isTraining ? <CircularProgress size={20} /> : <PsychologyIcon />}
              size="large"
            >
              {isTraining ? 'Training in Progress...' : 'Start Training'}
            </Button>
          </Box>

          {isTraining && (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <TimerIcon color="primary" />
                <Typography variant="body2">
                  Training Progress: {progress}%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={progress} 
                sx={{ height: 8, borderRadius: 4 }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                This process may take 10-15 minutes. Collecting data from 60+ crop varieties...
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Training Results */}
      {trainingResult && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <CheckCircleIcon color="success" sx={{ mr: 1, verticalAlign: 'middle' }} />
              Training Results
            </Typography>
            
            <Alert severity="success" sx={{ mb: 2 }}>
              {trainingResult.message}
            </Alert>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'space-around' }}>
              <Box textAlign="center" sx={{ minWidth: 150 }}>
                <Typography variant="h4" color="primary">
                  {trainingResult.stats.totalDataPoints}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Data Points
                </Typography>
              </Box>
              <Box textAlign="center" sx={{ minWidth: 150 }}>
                <Typography variant="h4" color="success.main">
                  {trainingResult.stats.successfulCrops}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Successful Crops
                </Typography>
              </Box>
              <Box textAlign="center" sx={{ minWidth: 150 }}>
                <Typography variant="h4" color="info.main">
                  {trainingResult.stats.maharashtraData}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Maharashtra Points
                </Typography>
              </Box>
              <Box textAlign="center" sx={{ minWidth: 150 }}>
                <Typography variant="h4" color="secondary.main">
                  {trainingResult.stats.andhraData}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Andhra Pradesh Points
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Training Duration: {Math.round(trainingResult.duration / 60)} minutes
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="subtitle1">Training Failed</Typography>
          <Typography variant="body2">{error}</Typography>
        </Alert>
      )}

      {/* Info Card */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            📋 What This Training Does
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText 
                primary="Comprehensive Data Collection"
                secondary="Collects latest market data for 60+ crop varieties from Maharashtra and Andhra Pradesh"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Machine Learning Model Training"
                secondary="Trains prediction model with temporal, categorical, and price features"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Real-time API Integration"
                secondary="Uses Data.gov.in and other government APIs for authentic market data"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Price Prediction Capability"
                secondary="Enables accurate price forecasting and market trend analysis"
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default MandiDataTraining;
