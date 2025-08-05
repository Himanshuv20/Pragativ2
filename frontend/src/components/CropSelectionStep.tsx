import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Chip, 
  Paper,
  Stack,
  Fade,
  Grow
} from '@mui/material';
import { 
  CheckCircle, 
  WbSunny, 
  AccessTime,
} from '@mui/icons-material';
import { SupportedCrop } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface CropSelectionStepProps {
  crops: SupportedCrop[];
  selectedCrop?: string;
  onCropSelect?: (crop: SupportedCrop) => void;
}

const CropSelectionStep: React.FC<CropSelectionStepProps> = ({ 
  crops, 
  selectedCrop, 
  onCropSelect 
}) => {
  const { t } = useLanguage();
  const [hoveredCrop, setHoveredCrop] = useState<string | null>(null);

  // Get crop data from translations and API
  const getCropData = (crop: SupportedCrop) => {
    const cropKey = crop.name.toLowerCase();
    return {
      emoji: crop.emoji || t(`crops.${cropKey}.emoji`, '🌱'),
      description: t(`crops.${cropKey}.description`, crop.description || 'Premium crop variety with excellent yield potential'),
      growthPeriod: t(`crops.${cropKey}.growthPeriod`, '90-120 days'),
      season: t(`crops.${cropKey}.season`, 'All seasons'),
      characteristics: [
        t(`crops.${cropKey}.char1`, ''),
        t(`crops.${cropKey}.char2`, ''),
        t(`crops.${cropKey}.char3`, '')
      ].filter(char => char !== '')
    };
  };

  return (
    <Box sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography 
          variant="h3" 
          component="h2" 
          gutterBottom 
          sx={{ 
            color: 'primary.dark',
            fontWeight: 700,
            mb: 2
          }}
        >
          🌱 {t('cropSelection.title')}
        </Typography>
        <Typography 
          variant="h6" 
          color="text.secondary" 
          sx={{ 
            maxWidth: '600px',
            mx: 'auto',
            lineHeight: 1.6
          }}
        >
          {t('cropSelection.subtitle')}
        </Typography>
      </Box>

      <Box 
        sx={{ 
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)'
          },
          gap: { xs: 2, sm: 3, md: 4 },
          mt: 4
        }}
      >
        {crops.map((crop, index) => {
          const cropInfo = getCropData(crop);
          const isSelected = selectedCrop === crop.name;
          const isHovered = hoveredCrop === crop.name;

          return (
            <Grow
              in={true}
              timeout={300 + index * 100}
              key={crop.name}
            >
              <Card
                sx={{
                  cursor: 'pointer',
                  position: 'relative',
                  background: isSelected 
                    ? 'linear-gradient(135deg, #E8F5E8 0%, #F1F8E9 100%)'
                    : 'linear-gradient(135deg, #FFFFFF 0%, #FAFAFA 100%)',
                  border: isSelected 
                    ? '3px solid #4CAF50' 
                    : '2px solid transparent',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
                  boxShadow: isSelected
                    ? '0 12px 40px rgba(76,175,80,0.3)'
                    : isHovered
                    ? '0 8px 32px rgba(0,0,0,0.15)'
                    : '0 4px 16px rgba(0,0,0,0.1)',
                  overflow: 'hidden',
                  minHeight: 320
                }}
                onMouseEnter={() => setHoveredCrop(crop.name)}
                onMouseLeave={() => setHoveredCrop(null)}
                onClick={() => onCropSelect?.(crop)}
              >
                {isSelected && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      zIndex: 10,
                      bgcolor: 'success.main',
                      borderRadius: '50%',
                      p: 0.5
                    }}
                  >
                    <CheckCircle sx={{ color: 'white', fontSize: 24 }} />
                  </Box>
                )}

                <Box
                  sx={{
                    height: 160,
                    background: `linear-gradient(45deg, ${cropInfo?.emoji ? '#F8FFF8' : '#F5F5F5'} 0%, ${cropInfo?.emoji ? '#E8F5E8' : '#EEEEEE'} 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: -20,
                      right: -20,
                      width: 60,
                      height: 60,
                      background: 'radial-gradient(circle, rgba(76,175,80,0.1) 0%, transparent 70%)',
                      borderRadius: '50%'
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -10,
                      left: -10,
                      width: 40,
                      height: 40,
                      background: 'radial-gradient(circle, rgba(76,175,80,0.05) 0%, transparent 70%)',
                      borderRadius: '50%'
                    }
                  }}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '120px',
                        height: '120px',
                        background: `radial-gradient(circle, ${isSelected ? 'rgba(76,175,80,0.1)' : 'rgba(0,0,0,0.02)'} 0%, transparent 60%)`,
                        borderRadius: '50%',
                        zIndex: 0
                      }
                    }}
                  >
                    <Typography 
                      sx={{ 
                        fontSize: '4.5rem',
                        filter: 'drop-shadow(2px 2px 8px rgba(0,0,0,0.15))',
                        transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        transform: isHovered ? 'scale(1.15) rotate(8deg)' : isSelected ? 'scale(1.05)' : 'scale(1) rotate(0deg)',
                        position: 'relative',
                        zIndex: 1,
                        textShadow: '0 0 20px rgba(255,255,255,0.8)',
                        '&:hover': {
                          animation: 'bounce 0.6s ease-in-out'
                        },
                        '@keyframes bounce': {
                          '0%, 20%, 60%, 100%': {
                            transform: isHovered ? 'scale(1.15) translateY(0) rotate(8deg)' : 'scale(1) translateY(0) rotate(0deg)'
                          },
                          '40%': {
                            transform: isHovered ? 'scale(1.15) translateY(-10px) rotate(8deg)' : 'scale(1) translateY(-5px) rotate(2deg)'
                          },
                          '80%': {
                            transform: isHovered ? 'scale(1.15) translateY(-5px) rotate(8deg)' : 'scale(1) translateY(-2px) rotate(-1deg)'
                          }
                        }
                      }}
                    >
                      {cropInfo?.emoji || '🌱'}
                    </Typography>
                  </Box>
                </Box>

                <CardContent sx={{ p: 3 }}>
                  <Typography 
                    variant="h5" 
                    component="h3" 
                    gutterBottom
                    sx={{ 
                      fontWeight: 700,
                      color: 'primary.dark',
                      mb: 1,
                      textTransform: 'capitalize'
                    }}
                  >
                    {crop.name}
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ mb: 2, lineHeight: 1.5 }}
                  >
                    {cropInfo?.description || 'Premium crop variety with excellent yield potential'}
                  </Typography>

                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        <strong>{t('cropSelection.growth')}:</strong> {cropInfo?.growthPeriod || '90-120 days'}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <WbSunny sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        <strong>{t('cropSelection.season')}:</strong> {cropInfo?.season || 'All seasons'}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                      {cropInfo?.characteristics?.map((char, idx) => (
                        <Chip
                          key={idx}
                          label={char}
                          size="small"
                          sx={{
                            bgcolor: isSelected ? 'success.light' : 'grey.100',
                            color: isSelected ? 'success.dark' : 'text.secondary',
                            fontSize: '0.75rem',
                            height: 24
                          }}
                        />
                      ))}
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grow>
          );
        })}
      </Box>

      {selectedCrop && (
        <Fade in={true} timeout={500}>
          <Paper 
            sx={{ 
              mt: 4, 
              p: 4, 
              background: 'linear-gradient(135deg, #E8F5E8 0%, #F1F8E9 100%)',
              border: '2px solid #4CAF50',
              borderRadius: 3
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <CheckCircle sx={{ color: 'success.main', fontSize: 28 }} />
              <Typography variant="h5" sx={{ fontWeight: 600, color: 'primary.dark' }}>
                {t('cropSelection.greatChoice')} {selectedCrop} {t('cropSelection.selected')}
              </Typography>
            </Box>
            <Typography variant="body1" color="text.secondary">
              {t('cropSelection.successMessage').replace('{{crop}}', selectedCrop)}
            </Typography>
          </Paper>
        </Fade>
      )}
    </Box>
  );
};

export default CropSelectionStep;
