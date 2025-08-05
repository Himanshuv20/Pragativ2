import React, { useState, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Card,
  CardContent,
  Chip,
  Alert,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  PhotoCamera as CameraIcon,
  Visibility as ViewIcon,
  BugReport as BugIcon,
  LocalFlorist as PlantIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Info as InfoIcon,
  ArrowBack as BackIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { designTokens } from '../theme/theme';
import { PestDiseaseIcon } from '../components/icons/AppIcons_clean';
import { useLanguage } from '../context/LanguageContext';

interface AnalysisResult {
  disease: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high';
  description: string;
  treatments: string[];
  prevention: string[];
}

const PestDiseaseAnalysis: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();
  
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string>('');

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError(t('pestDisease.errors.fileSizeLimit'));
        return;
      }
      
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setError(t('pestDisease.errors.invalidFormat'));
        return;
      }

      setSelectedImage(file);
      setError('');
      setAnalysisResult(null);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setError('');

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('image', selectedImage);

      // Call the backend API for pest/disease analysis
      const response = await fetch('http://localhost:5000/api/pest-disease/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(t('pestDisease.errors.analysisFailedUpload'));
      }

      const result = await response.json();
      
      // Check if the response is successful and has the expected structure
      if (result.success && result.result) {
        setAnalysisResult(result.result);
      } else {
        throw new Error(result.message || t('pestDisease.errors.analysisFailedGeneral'));
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setError(`${t('pestDisease.errors.analysisFailedGeneral')}: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'error';
      default: return 'info';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'low': return <CheckIcon />;
      case 'medium': return <InfoIcon />;
      case 'high': return <WarningIcon />;
      default: return <InfoIcon />;
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <IconButton 
              onClick={() => navigate('/')} 
              sx={{ mr: 1, color: designTokens.colors.primary[600] }}
            >
              <BackIcon />
            </IconButton>
            <PestDiseaseIcon sx={{ fontSize: 40, color: designTokens.colors.secondary[500], mr: 2 }} />
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: designTokens.colors.primary[800] }}>
                {t('pestDisease.pageTitle')}
              </Typography>
              <Typography variant="subtitle1" sx={{ color: designTokens.colors.neutral[600] }}>
                {t('pestDisease.pageSubtitle')}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Main Content */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          {/* Upload Section */}
          <Box sx={{ flex: 1 }}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <UploadIcon sx={{ mr: 1 }} />
                {t('pestDisease.uploadSection.title')}
              </Typography>
              
              <Box
                sx={{
                  border: '2px dashed',
                  borderColor: selectedImage ? designTokens.colors.primary[300] : designTokens.colors.neutral[300],
                  borderRadius: 2,
                  p: 3,
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: selectedImage ? designTokens.colors.primary[50] : 'transparent',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: designTokens.colors.primary[400],
                    backgroundColor: designTokens.colors.primary[50]
                  }
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                
                {imagePreview ? (
                  <Box>
                    <img
                      src={imagePreview}
                      alt="Plant preview"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '300px',
                        borderRadius: '8px',
                        objectFit: 'contain'
                      }}
                    />
                    <Typography variant="body2" sx={{ mt: 1, color: designTokens.colors.primary[600] }}>
                      {t('pestDisease.uploadSection.imageReady')}
                    </Typography>
                  </Box>
                ) : (
                  <Box>
                    <CameraIcon sx={{ fontSize: 48, color: designTokens.colors.neutral[400], mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      {t('pestDisease.uploadSection.clickToUpload')}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {t('pestDisease.uploadSection.supportedFormats')}
                    </Typography>
                  </Box>
                )}
              </Box>

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}

              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleAnalyze}
                  disabled={!selectedImage || isAnalyzing}
                  startIcon={isAnalyzing ? <CircularProgress size={20} /> : <ViewIcon />}
                  sx={{
                    backgroundColor: designTokens.colors.secondary[500],
                    '&:hover': {
                      backgroundColor: designTokens.colors.secondary[600]
                    }
                  }}
                >
                  {isAnalyzing ? t('pestDisease.uploadSection.analyzing') : t('pestDisease.uploadSection.analyzeButton')}
                </Button>
              </Box>
            </Paper>
          </Box>

          {/* Results Section */}
          <Box sx={{ flex: 1 }}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <BugIcon sx={{ mr: 1 }} />
                {t('pestDisease.resultsSection.title')}
              </Typography>

              {!analysisResult ? (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <PlantIcon sx={{ fontSize: 64, color: designTokens.colors.neutral[300], mb: 2 }} />
                  <Typography variant="body1" color="textSecondary">
                    {t('pestDisease.resultsSection.noResults')}
                  </Typography>
                </Box>
              ) : (
                <Box>
                  {/* Disease Identification */}
                  <Card sx={{ mb: 3, backgroundColor: designTokens.colors.secondary[50] }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h6" sx={{ color: designTokens.colors.secondary[800] }}>
                          {analysisResult.disease}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Chip
                            icon={getSeverityIcon(analysisResult.severity)}
                            label={t(`pestDisease.resultsSection.severity.${analysisResult.severity}`).toUpperCase()}
                            color={getSeverityColor(analysisResult.severity) as any}
                            size="small"
                          />
                          <Chip
                            label={`${analysisResult.confidence}% ${t('pestDisease.resultsSection.confidence')}`}
                            color="info"
                            size="small"
                          />
                        </Box>
                      </Box>
                      <Typography variant="body2" sx={{ color: designTokens.colors.neutral[700] }}>
                        {analysisResult.description}
                      </Typography>
                    </CardContent>
                  </Card>

                  {/* Treatment Recommendations */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: '#F44336' }}>
                      {t('pestDisease.resultsSection.treatments')}
                    </Typography>
                    <List dense>
                      {analysisResult.treatments.map((treatment, index) => (
                        <ListItem key={index} sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <Box
                              sx={{
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                backgroundColor: '#F44336'
                              }}
                            />
                          </ListItemIcon>
                          <ListItemText 
                            primary={treatment}
                            primaryTypographyProps={{ variant: 'body2' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Prevention Tips */}
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: designTokens.colors.primary[700] }}>
                      {t('pestDisease.resultsSection.prevention')}
                    </Typography>
                    <List dense>
                      {analysisResult.prevention.map((tip, index) => (
                        <ListItem key={index} sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <Box
                              sx={{
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                backgroundColor: designTokens.colors.primary[500]
                              }}
                            />
                          </ListItemIcon>
                          <ListItemText 
                            primary={tip}
                            primaryTypographyProps={{ variant: 'body2' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </Box>
              )}
            </Paper>
          </Box>
        </Box>

        {/* Tips Section */}
        <Paper sx={{ mt: 3, p: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t('pestDisease.tips.title')}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            <Box sx={{ textAlign: 'center', minWidth: 200, flex: 1 }}>
              <CameraIcon sx={{ fontSize: 32, color: designTokens.colors.accent[500], mb: 1 }} />
              <Typography variant="subtitle2" gutterBottom>{t('pestDisease.tips.goodLighting.title')}</Typography>
              <Typography variant="body2" color="textSecondary">
                {t('pestDisease.tips.goodLighting.description')}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center', minWidth: 200, flex: 1 }}>
              <ViewIcon sx={{ fontSize: 32, color: designTokens.colors.accent[500], mb: 1 }} />
              <Typography variant="subtitle2" gutterBottom>{t('pestDisease.tips.clearFocus.title')}</Typography>
              <Typography variant="body2" color="textSecondary">
                {t('pestDisease.tips.clearFocus.description')}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center', minWidth: 200, flex: 1 }}>
              <PlantIcon sx={{ fontSize: 32, color: designTokens.colors.accent[500], mb: 1 }} />
              <Typography variant="subtitle2" gutterBottom>{t('pestDisease.tips.closeUpShots.title')}</Typography>
              <Typography variant="body2" color="textSecondary">
                {t('pestDisease.tips.closeUpShots.description')}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center', minWidth: 200, flex: 1 }}>
              <InfoIcon sx={{ fontSize: 32, color: designTokens.colors.accent[500], mb: 1 }} />
              <Typography variant="subtitle2" gutterBottom>{t('pestDisease.tips.multipleAngles.title')}</Typography>
              <Typography variant="body2" color="textSecondary">
                {t('pestDisease.tips.multipleAngles.description')}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default PestDiseaseAnalysis;
