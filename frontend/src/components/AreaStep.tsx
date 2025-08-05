import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  TextField,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Chip,
  Divider,
  InputAdornment,
  Paper,
  Stack,
  Tooltip,
  IconButton
} from '@mui/material';
import {
  Agriculture,
  Info,
  CropFree,
  TrendingUp
} from '@mui/icons-material';
import { useCropCalendar } from '../context/CropCalendarContext';
import { useLanguage } from '../context/LanguageContext';

interface AreaUnit {
  value: string;
  label: string;
  symbol: string;
  conversionToHectares: number;
  description: string;
}

const AreaStep: React.FC = () => {
  const { formData, updateFormData } = useCropCalendar();
  const { t } = useLanguage();
  const [area, setArea] = useState<string>(formData.area > 0 ? formData.area.toString() : '');
  const [unit, setUnit] = useState<string>('hectares');
  const [error, setError] = useState<string>('');

  // Area unit options
  const areaUnits: AreaUnit[] = [
    {
      value: 'hectares',
      label: 'Hectares',
      symbol: 'ha',
      conversionToHectares: 1,
      description: 'Standard metric unit (10,000 sq meters)'
    },
    {
      value: 'acres',
      label: 'Acres',
      symbol: 'ac',
      conversionToHectares: 0.404686,
      description: 'Common in US agriculture (43,560 sq feet)'
    },
    {
      value: 'sqmeters',
      label: 'Square Meters',
      symbol: 'm²',
      conversionToHectares: 0.0001,
      description: 'Basic metric unit'
    },
    {
      value: 'sqfeet',
      label: 'Square Feet',
      symbol: 'ft²',
      conversionToHectares: 0.0000092903,
      description: 'Imperial measurement'
    },
    {
      value: 'sqkilometers',
      label: 'Square Kilometers',
      symbol: 'km²',
      conversionToHectares: 100,
      description: 'Large scale farming (100 hectares)'
    }
  ];

  // Common farm sizes for reference
  const farmSizeReferences = [
    { size: 0.1, unit: 'ha', description: 'Small garden plot' },
    { size: 0.5, unit: 'ha', description: 'Large home garden' },
    { size: 1, unit: 'ha', description: 'Small farm field' },
    { size: 5, unit: 'ha', description: 'Medium farm field' },
    { size: 10, unit: 'ha', description: 'Large farm field' },
    { size: 50, unit: 'ha', description: 'Small commercial farm' },
    { size: 100, unit: 'ha', description: 'Medium commercial farm' }
  ];

  const selectedUnit = areaUnits.find(u => u.value === unit) || areaUnits[0];

  // Convert area to hectares for storage
  const convertToHectares = (value: number, fromUnit: string): number => {
    const unitData = areaUnits.find(u => u.value === fromUnit);
    return value * (unitData?.conversionToHectares || 1);
  };

  // Handle area input change
  const handleAreaChange = (value: string) => {
    setArea(value);
    setError('');

    const numericValue = parseFloat(value);
    if (!isNaN(numericValue) && numericValue > 0) {
      const hectares = convertToHectares(numericValue, unit);
      updateFormData({ area: hectares });
    } else if (value === '') {
      updateFormData({ area: 0 });
    }
  };

  // Handle unit change
  const handleUnitChange = (newUnit: string) => {
    setUnit(newUnit);
    if (area && !isNaN(parseFloat(area))) {
      const hectares = convertToHectares(parseFloat(area), newUnit);
      updateFormData({ area: hectares });
    }
  };

  // Validate area input
  const validateArea = useCallback(() => {
    const numericValue = parseFloat(area);
    
    if (!area || area.trim() === '') {
      setError('Please enter the farming area');
      return false;
    }
    
    if (isNaN(numericValue)) {
      setError('Please enter a valid number');
      return false;
    }
    
    if (numericValue <= 0) {
      setError('Area must be greater than zero');
      return false;
    }

    // Unit-specific validations
    const hectares = convertToHectares(numericValue, unit);
    if (hectares > 10000) {
      setError('Area seems unusually large. Please verify the measurement.');
      return false;
    }

    if (hectares < 0.001) {
      setError('Area seems too small for agricultural purposes');
      return false;
    }

    setError('');
    return true;
  }, [area, unit]);

  // Quick area selection
  const handleQuickSelect = (size: number) => {
    setArea(size.toString());
    setUnit('hectares');
    const hectares = convertToHectares(size, 'hectares');
    updateFormData({ area: hectares });
  };

  // Area calculation helpers
  const getAreaInOtherUnits = () => {
    const numericArea = parseFloat(area);
    if (isNaN(numericArea)) return [];

    return areaUnits
      .filter(u => u.value !== unit)
      .map(u => ({
        unit: u.symbol,
        value: (numericArea / selectedUnit.conversionToHectares * u.conversionToHectares).toFixed(4)
      }));
  };

  // Effect to validate on mount
  useEffect(() => {
    if (area) {
      validateArea();
    }
  }, [area, unit]);

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
        📐 {t('areaStep.title')}
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
        {t('areaStep.subtitle')}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Main Input Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Agriculture color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6" color="primary">
              {t('areaStep.farmAreaInput')}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
            <Box sx={{ flex: 2 }}>
              <TextField
                fullWidth
                label={t('areaStep.farmArea')}
                value={area}
                onChange={(e) => handleAreaChange(e.target.value)}
                placeholder={t('areaStep.enterAreaSize')}
                type="number"
                inputProps={{ min: 0, step: 0.1 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Typography variant="body2" color="text.secondary">
                        {selectedUnit.symbol}
                      </Typography>
                    </InputAdornment>
                  ),
                }}
                helperText={`${t('areaStep.enterAreaIn')} ${selectedUnit.label.toLowerCase()}`}
                error={!!error}
              />
            </Box>

            <Box sx={{ flex: 1, minWidth: 200 }}>
              <FormControl fullWidth>
                <InputLabel>{t('areaStep.unit')}</InputLabel>
                <Select
                  value={unit}
                  label={t('areaStep.unit')}
                  onChange={(e) => handleUnitChange(e.target.value)}
                >
                  {areaUnits.map((unitOption) => (
                    <MenuItem key={unitOption.value} value={unitOption.value}>
                      <Box>
                        <Typography variant="body1">
                          {unitOption.label} ({unitOption.symbol})
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {unitOption.description}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* Area Conversion Display */}
          {area && !isNaN(parseFloat(area)) && (
            <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                {t('areaStep.areaConversions')}:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {getAreaInOtherUnits().map((conversion, index) => (
                  <Chip
                    key={index}
                    label={`${conversion.value} ${conversion.unit}`}
                    variant="outlined"
                    size="small"
                  />
                ))}
              </Stack>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Quick Selection */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CropFree color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6" color="primary">
              {t('areaStep.quickSizeSelection')}
            </Typography>
            <Tooltip title={t('areaStep.quickSelectionTooltip')}>
              <IconButton size="small" sx={{ ml: 1 }}>
                <Info fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t('areaStep.selectCommonSize')}
          </Typography>

          <Stack direction="row" spacing={1} flexWrap="wrap">
            {farmSizeReferences.map((ref, index) => (
              <Chip
                key={index}
                label={`${ref.size} ${ref.unit} - ${ref.description}`}
                onClick={() => handleQuickSelect(ref.size)}
                clickable
                variant="outlined"
                sx={{ mb: 1 }}
              />
            ))}
          </Stack>
        </CardContent>
      </Card>

      {/* Area Information */}
      {area && !isNaN(parseFloat(area)) && !error && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TrendingUp color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" color="primary">
                {t('areaStep.areaSummary')}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Paper sx={{ p: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                  <Typography variant="h4" gutterBottom>
                    {area} {selectedUnit.symbol}
                  </Typography>
                  <Typography variant="body2">
                    {t('areaStep.selectedFarmArea')}
                  </Typography>
                </Paper>
              </Box>

              <Box sx={{ flex: 1 }}>
                <Paper sx={{ p: 2, bgcolor: 'success.light', color: 'success.contrastText' }}>
                  <Typography variant="h4" gutterBottom>
                    {convertToHectares(parseFloat(area), unit).toFixed(2)} ha
                  </Typography>
                  <Typography variant="body2">
                    Area in Hectares
                  </Typography>
                </Paper>
              </Box>
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                💡 <strong>Good to know:</strong> This area will be used to calculate planting schedules, 
                seed requirements, fertilizer amounts, and expected yield estimates for your selected crop.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}

      <Divider sx={{ my: 3 }} />
      
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          📏 <strong>Tip:</strong> Accurate area measurement helps provide precise agricultural 
          recommendations. You can always adjust this later if needed.
        </Typography>
      </Box>
    </Box>
  );
};

export default AreaStep;
