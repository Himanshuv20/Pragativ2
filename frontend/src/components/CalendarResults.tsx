import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Divider,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Stack,
  Tabs,
  Tab,
  Tooltip,
  Button,
  Collapse
} from '@mui/material';
import {
  Agriculture as AgricultureIcon,
  LocationOn as LocationIcon,
  WaterDrop as WaterIcon,
  Schedule as ScheduleIcon,
  Check as CheckIcon,
  Info as InfoIcon,
  Landscape as LandscapeIcon,
  CalendarMonth as CalendarIcon,
  LocalFlorist as PlantIcon,
  Grass as GrassIcon,
  Spa as SpaIcon,
  Nature as NatureIcon,
  FilterVintage as EcoIcon,
  ViewTimeline as TimelineIcon,
  CalendarToday as CalendarViewIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';
import { useCropCalendar } from '../context/CropCalendarContext';
import { useLanguage } from '../context/LanguageContext';

const CalendarResults: React.FC = () => {
  const { cropCalendar } = useCropCalendar();
  const { t } = useLanguage();
  const [timelineView, setTimelineView] = useState<'timeline' | 'calendar'>('timeline');
  const [irrigationExpanded, setIrrigationExpanded] = useState(false);

  if (!cropCalendar) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography variant="h6" color="text.secondary">
          {t('cropCalendar.results.noDataAvailable', 'No calendar data available')}
        </Typography>
      </Box>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  const getStatusColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const getStageIcon = (stageName: string) => {
    const name = stageName.toLowerCase();
    if (name.includes('germination') || name.includes('seed') || name.includes('emergence')) return { icon: <SpaIcon />, color: '#8BC34A' };
    if (name.includes('vegetative') || name.includes('growth') || name.includes('tillering')) return { icon: <GrassIcon />, color: '#4CAF50' };
    if (name.includes('flowering') || name.includes('bloom') || name.includes('bud')) return { icon: <PlantIcon />, color: '#FF9800' };
    if (name.includes('fruit') || name.includes('development') || name.includes('pod') || name.includes('boll')) return { icon: <NatureIcon />, color: '#FF5722' };
    if (name.includes('maturity') || name.includes('harvest') || name.includes('ripening')) return { icon: <AgricultureIcon />, color: '#795548' };
    if (name.includes('transplanting') || name.includes('nursery')) return { icon: <EcoIcon />, color: '#00BCD4' };
    if (name.includes('heading') || name.includes('panicle') || name.includes('tasseling') || name.includes('silking')) return { icon: <PlantIcon />, color: '#FFC107' };
    return { icon: <PlantIcon />, color: '#4CAF50' };
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch {
      return dateString;
    }
  };

  // Calendar view helper functions
  const getMonthsInRange = () => {
    const startDate = new Date(cropCalendar.plantingWindow.earliestStart);
    const endDate = new Date(cropCalendar.harvestingWindow.latestDate);
    const months = [];
    
    let currentDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    while (currentDate <= endDate) {
      months.push(new Date(currentDate));
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    return months;
  };

  const getStageForDate = (date: Date) => {
    return cropCalendar.growthStages.find(stage => {
      const stageStart = new Date(stage.startDate);
      const stageEnd = new Date(stage.endDate);
      return date >= stageStart && date <= stageEnd;
    });
  };

  const renderCalendarMonth = (monthDate: Date) => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return (
      <Box key={`${year}-${month}`} sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, textAlign: 'center', fontWeight: 'bold' }}>
          {monthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </Typography>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(7, 1fr)', 
          border: '1px solid #e0e0e0', 
          borderRadius: 1 
        }}>
                    {/* Day headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <Box key={day} sx={{ 
              textAlign: 'center', 
              p: 1.5, 
              borderBottom: '2px solid #e0e0e0', 
              bgcolor: 'primary.light',
              color: 'primary.contrastText',
              fontWeight: 'bold',
              fontSize: '0.85rem'
            }}>
              {day}
            </Box>
          ))}
          
          {/* Calendar days */}
          {days.map((date, index) => {
            if (!date) {
              return (
                <Box key={index} sx={{ 
                  height: 60, 
                  border: '1px solid #f0f0f0' 
                }} />
              );
            }
            
            const stage = getStageForDate(date);
            const isToday = date.toDateString() === new Date().toDateString();
            
            return (
              <Tooltip key={date.toISOString()} title={stage ? `${stage.stage}: ${stage.description}` : ''} arrow>
                <Box sx={{ 
                  height: 60, 
                  border: '1px solid #e0e0e0', 
                  borderRadius: 1,
                  position: 'relative',
                  bgcolor: stage ? getStageIcon(stage.stage).color + '15' : 'transparent',
                  borderLeft: stage ? `4px solid ${getStageIcon(stage.stage).color}` : 'none',
                  '&:hover': stage ? { 
                    bgcolor: getStageIcon(stage.stage).color + '25',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  } : { bgcolor: 'grey.50' },
                  cursor: stage ? 'pointer' : 'default',
                  transition: 'all 0.2s ease-in-out'
                }}>
                  {/* Date number */}
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      position: 'absolute',
                      top: 2,
                      right: 4,
                      fontSize: '11px',
                      fontWeight: isToday ? 'bold' : 'normal',
                      color: isToday ? 'primary.main' : 'text.secondary',
                      bgcolor: isToday ? 'primary.light' : 'transparent',
                      borderRadius: isToday ? '50%' : 0,
                      width: isToday ? 16 : 'auto',
                      height: isToday ? 16 : 'auto',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {date.getDate()}
                  </Typography>
                  
                  {/* Stage icon */}
                  {stage && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 2,
                        left: 4,
                        '& svg': {
                          fontSize: '14px',
                          color: getStageIcon(stage.stage).color
                        }
                      }}
                    >
                      {getStageIcon(stage.stage).icon}
                    </Box>
                  )}
                  
                  {/* Stage name (truncated) */}
                  {stage && (
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        position: 'absolute',
                        bottom: 2,
                        left: 4,
                        right: 4,
                        fontSize: '9px', 
                        color: getStageIcon(stage.stage).color,
                        fontWeight: 'bold',
                        lineHeight: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {stage.stage.length > 8 ? stage.stage.substring(0, 8) + '...' : stage.stage}
                    </Typography>
                  )}
                </Box>
              </Tooltip>
            );
          })}
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
      {/* Header Section */}
      <Paper elevation={3} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)', color: 'white' }}>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
            <AgricultureIcon fontSize="large" />
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight="bold">
              {cropCalendar.cropInfo.name} Calendar
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              {cropCalendar.cropInfo.scientificName} • {cropCalendar.cropInfo.category}
            </Typography>
          </Box>
        </Box>
        
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <LocationIcon />
            <Typography variant="body2">
              {cropCalendar.location.latitude.toFixed(4)}°, {cropCalendar.location.longitude.toFixed(4)}°
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <LandscapeIcon />
            <Typography variant="body2">
              {cropCalendar.area} hectares
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <ScheduleIcon />
            <Typography variant="body2">
              {cropCalendar.cropInfo.growingPeriod} {t('cropCalendar.results.daysCycle', 'days cycle')}
            </Typography>
          </Box>
        </Stack>
      </Paper>

      <Stack spacing={3}>
        {/* Top row - Satellite Data and Planting Window */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
          {/* Satellite Data Summary */}
          <Card elevation={2} sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
                <EcoIcon color="primary" />
                {t('cropCalendar.results.satelliteAssessment', 'Satellite Data Assessment')}
              </Typography>
              
              <Stack spacing={2}>
                <Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="body2">{t('cropCalendar.results.vegetationHealth', 'Vegetation Health')}</Typography>
                    <Chip 
                      label={`${cropCalendar.satelliteDataSummary.vegetationHealth.score}%`}
                      color={getStatusColor(cropCalendar.satelliteDataSummary.vegetationHealth.score)}
                      size="small"
                    />
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={cropCalendar.satelliteDataSummary.vegetationHealth.score}
                    color={getStatusColor(cropCalendar.satelliteDataSummary.vegetationHealth.score)}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {cropCalendar.satelliteDataSummary.vegetationHealth.description}
                  </Typography>
                </Box>

                <Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="body2">{t('cropCalendar.results.soilCondition', 'Soil Condition')}</Typography>
                    <Chip 
                      label={`${cropCalendar.satelliteDataSummary.soilCondition.score}%`}
                      color={getStatusColor(cropCalendar.satelliteDataSummary.soilCondition.score)}
                      size="small"
                    />
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={cropCalendar.satelliteDataSummary.soilCondition.score}
                    color={getStatusColor(cropCalendar.satelliteDataSummary.soilCondition.score)}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {cropCalendar.satelliteDataSummary.soilCondition.description}
                  </Typography>
                </Box>

                <Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="body2">Weather Suitability</Typography>
                    <Chip 
                      label={`${cropCalendar.satelliteDataSummary.weatherSuitability.score}%`}
                      color={getStatusColor(cropCalendar.satelliteDataSummary.weatherSuitability.score)}
                      size="small"
                    />
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={cropCalendar.satelliteDataSummary.weatherSuitability.score}
                    color={getStatusColor(cropCalendar.satelliteDataSummary.weatherSuitability.score)}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {cropCalendar.satelliteDataSummary.weatherSuitability.description}
                  </Typography>
                </Box>

                <Divider />

                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle1" fontWeight="bold">{t('cropCalendar.results.overallReadiness', 'Overall Readiness')}</Typography>
                  <Chip 
                    label={`${cropCalendar.satelliteDataSummary.overallReadiness.score}%`}
                    color={getStatusColor(cropCalendar.satelliteDataSummary.overallReadiness.score)}
                    sx={{ fontWeight: 'bold' }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {cropCalendar.satelliteDataSummary.overallReadiness.description}
                </Typography>
              </Stack>
            </CardContent>
          </Card>

          {/* Planting Window */}
          <Card elevation={2} sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
                <CalendarIcon color="primary" />
                {t('cropCalendar.results.plantingWindow', 'Planting Window')}
              </Typography>
              
              <Stack spacing={2}>
                <Box>
                  <Typography variant="body2" color="text.secondary">{t('cropCalendar.results.optimalPlantingDate', 'Optimal Planting Date')}</Typography>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    {formatDate(cropCalendar.plantingWindow.optimalStart)}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">{t('cropCalendar.results.plantingWindow', 'Planting Window')}</Typography>
                  <Typography variant="body1">
                    {formatDate(cropCalendar.plantingWindow.earliestStart)} - {formatDate(cropCalendar.plantingWindow.optimalEnd)}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">{t('cropCalendar.results.riskFactors', 'Risk Factors')}</Typography>
                  <Stack direction="row" flexWrap="wrap" gap={0.5}>
                    {cropCalendar.plantingWindow.riskFactors.map((risk, index) => (
                      <Chip key={index} label={risk} size="small" color="warning" />
                    ))}
                  </Stack>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">Recommendations</Typography>
                  <List dense>
                    {cropCalendar.plantingWindow.recommendations.map((rec, index) => (
                      <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <CheckIcon color="success" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={rec} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Stack>

        {/* Growth Stages */}
        <Card elevation={2}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="h6" display="flex" alignItems="center" gap={1}>
                <NatureIcon color="primary" />
                {t('cropCalendar.results.growthTimeline', 'Growth Stages Timeline')}
              </Typography>
              
              <Tabs 
                value={timelineView} 
                onChange={(e, newValue) => setTimelineView(newValue)}
              >
                <Tab 
                  icon={<TimelineIcon />} 
                  label={t('cropCalendar.results.timeline', 'Timeline')}
                  value="timeline"
                  iconPosition="start"
                />
                <Tab 
                  icon={<CalendarViewIcon />} 
                  label={t('cropCalendar.results.calendar', 'Calendar')}
                  value="calendar"
                  iconPosition="start"
                />
              </Tabs>
            </Box>
            
            {timelineView === 'timeline' ? (
              <Stack spacing={3}>
                {cropCalendar.growthStages.map((stage, index) => (
                  <Box key={index}>
                    <Box display="flex" alignItems="flex-start" gap={2} mb={2}>
                      <Avatar 
                        sx={{ 
                          bgcolor: getStageIcon(stage.stage).color, 
                          width: 48, 
                          height: 48,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                          '& svg': { fontSize: '20px' }
                        }}
                      >
                        {getStageIcon(stage.stage).icon}
                      </Avatar>
                      <Box flex={1}>
                        <Typography variant="h6" fontWeight="bold" color="primary.dark">
                          {stage.stage}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          📅 {formatDate(stage.startDate)} - {formatDate(stage.endDate)} ({stage.duration} days)
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.6 }}>
                          {stage.description}
                        </Typography>
                        
                        {stage.keyActivities.length > 0 && (
                          <Box>
                            <Typography variant="subtitle2" color="primary.main" fontWeight="bold" sx={{ mb: 1 }}>
                              🎯 Key Activities
                            </Typography>
                            <Stack direction="row" flexWrap="wrap" gap={1}>
                              {stage.keyActivities.map((activity, idx) => (
                                <Chip 
                                  key={idx} 
                                  label={activity} 
                                  size="small" 
                                  variant="outlined"
                                  sx={{ 
                                    bgcolor: getStageIcon(stage.stage).color + '10',
                                    borderColor: getStageIcon(stage.stage).color + '40',
                                    '& .MuiChip-label': { 
                                      color: getStageIcon(stage.stage).color,
                                      fontWeight: 'medium',
                                      fontSize: '0.75rem'
                                    }
                                  }}
                                />
                              ))}
                            </Stack>
                          </Box>
                        )}
                      </Box>
                    </Box>
                    
                    {/* Progress bar for stage duration */}
                    <Box sx={{ ml: 7, mb: 2 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="caption" color="text.secondary">
                          Stage Progress
                        </Typography>
                        <Typography variant="caption" color="primary.main" fontWeight="bold">
                          {stage.duration} days
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={100} 
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          bgcolor: getStageIcon(stage.stage).color + '20',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: getStageIcon(stage.stage).color,
                            borderRadius: 3
                          }
                        }}
                      />
                    </Box>
                    
                    {index < cropCalendar.growthStages.length - 1 && (
                      <Divider sx={{ ml: 7, opacity: 0.3 }} />
                    )}
                  </Box>
                ))}
              </Stack>
            ) : (
              <Box>
                {/* Calendar Legend */}
                <Box mb={3}>
                  <Typography variant="subtitle2" gutterBottom>Growth Stage Legend:</Typography>
                  <Stack direction="row" flexWrap="wrap" gap={1}>
                    {cropCalendar.growthStages.map((stage, index) => (
                      <Chip 
                        key={index}
                        label={stage.stage}
                        size="small"
                        sx={{ 
                          bgcolor: getStageIcon(stage.stage).color + '20',
                          borderLeft: `3px solid ${getStageIcon(stage.stage).color}`,
                          '& .MuiChip-label': { 
                            color: getStageIcon(stage.stage).color,
                            fontWeight: 'bold'
                          }
                        }}
                      />
                    ))}
                  </Stack>
                </Box>

                {/* Calendar Grid */}
                <Box sx={{ maxHeight: '600px', overflowY: 'auto' }}>
                  {getMonthsInRange().map(monthDate => renderCalendarMonth(monthDate))}
                </Box>

                {/* Key Information */}
                <Box mt={3} p={2} bgcolor="grey.50" borderRadius={1}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>How to read the calendar:</strong> Each colored day shows when a growth stage is active. 
                    Hover over colored dates to see stage details. The colored bar on the left indicates the specific growth stage.
                  </Typography>
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Bottom row - Maintenance and Harvesting */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
          {/* Maintenance Schedule */}
          <Card elevation={2} sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
                <WaterIcon color="primary" />
                {t('cropCalendar.results.maintenanceSchedule', 'Maintenance Schedule')}
              </Typography>
              
              <Stack spacing={3}>
                <Box>
                  <Typography variant="subtitle2" gutterBottom color="primary">{t('cropCalendar.results.fertilization', 'Fertilization')}</Typography>
                  <List dense>
                    {cropCalendar.maintenanceSchedule.fertilization.map((fert, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <CheckIcon color="success" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary={`${fert.type} - ${fert.totalAmount} ${fert.unit}`}
                          secondary={`${formatDate(fert.date)} • ${fert.method}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>

                <Box>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                    <Typography variant="subtitle2" color="primary">
                      {t('cropCalendar.results.irrigation', 'Irrigation Schedule')} ({cropCalendar.maintenanceSchedule.irrigation.length} events)
                    </Typography>
                    {cropCalendar.maintenanceSchedule.irrigation.length > 3 && (
                      <Button
                        size="small"
                        startIcon={irrigationExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        onClick={() => setIrrigationExpanded(!irrigationExpanded)}
                        sx={{ 
                          textTransform: 'none',
                          fontSize: '0.75rem',
                          minWidth: 'auto',
                          py: 0.5,
                          px: 1
                        }}
                      >
                        {irrigationExpanded ? t('cropCalendar.results.showLess', 'Show Less') : t('cropCalendar.results.viewAll', 'View All')}
                      </Button>
                    )}
                  </Box>
                  
                  <List dense>
                    {/* Always show first 3 items */}
                    {cropCalendar.maintenanceSchedule.irrigation.slice(0, 3).map((irr, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <WaterIcon color="info" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary={`${irr.amount} ${irr.unit} - ${irr.duration} min`}
                          secondary={`${formatDate(irr.date)} • ${irr.timing}`}
                        />
                      </ListItem>
                    ))}
                    
                    {/* Collapsible section for remaining items */}
                    {cropCalendar.maintenanceSchedule.irrigation.length > 3 && (
                      <Collapse in={irrigationExpanded}>
                        {cropCalendar.maintenanceSchedule.irrigation.slice(3).map((irr, index) => (
                          <ListItem key={index + 3} sx={{ px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              <WaterIcon color="info" fontSize="small" />
                            </ListItemIcon>
                            <ListItemText
                              primary={`${irr.amount} ${irr.unit} - ${irr.duration} min`}
                              secondary={`${formatDate(irr.date)} • ${irr.timing}`}
                            />
                          </ListItem>
                        ))}
                      </Collapse>
                    )}
                    
                    {/* Show summary when collapsed */}
                    {!irrigationExpanded && cropCalendar.maintenanceSchedule.irrigation.length > 3 && (
                      <ListItem sx={{ px: 0, py: 0.5 }}>
                        <ListItemText
                          primary={
                            <Typography variant="caption" color="text.secondary" fontStyle="italic">
                              ... and {cropCalendar.maintenanceSchedule.irrigation.length - 3} more irrigation events
                            </Typography>
                          }
                        />
                      </ListItem>
                    )}
                  </List>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          {/* Harvesting Window */}
          <Card elevation={2} sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
                <AgricultureIcon color="primary" />
                {t('cropCalendar.results.harvestingInfo', 'Harvesting Information')}
              </Typography>
              
              <Stack spacing={2}>
                <Box>
                  <Typography variant="body2" color="text.secondary">{t('cropCalendar.results.optimalHarvestDate', 'Optimal Harvest Date')}</Typography>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    {formatDate(cropCalendar.harvestingWindow.optimalDate)}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">{t('cropCalendar.results.harvestWindow', 'Harvest Window')}</Typography>
                  <Typography variant="body1">
                    {formatDate(cropCalendar.harvestingWindow.earliestDate)} - {formatDate(cropCalendar.harvestingWindow.latestDate)}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">{t('cropCalendar.results.expectedYield', 'Expected Yield')}</Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {cropCalendar.harvestingWindow.estimatedYield.amount} {cropCalendar.harvestingWindow.estimatedYield.unit}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t('cropCalendar.results.confidence', 'Confidence')}: {cropCalendar.harvestingWindow.estimatedYield.confidence}%
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">{t('cropCalendar.results.harvestingMethod', 'Harvesting Method')}</Typography>
                  <Typography variant="body2">
                    {cropCalendar.harvestingWindow.harvestingMethod}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">{t('cropCalendar.results.postHarvestCare', 'Post-Harvest Care')}</Typography>
                  <Typography variant="body2">
                    {cropCalendar.harvestingWindow.postHarvestCare}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Stack>

        {/* Recommendations */}
        <Card elevation={2}>
          <CardContent>
            <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
              <InfoIcon color="primary" />
              {t('cropCalendar.results.recommendations', 'Recommendations')}
            </Typography>
            
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              {cropCalendar.recommendations.map((rec, index) => (
                <Alert 
                  key={index}
                  severity={getPriorityColor(rec.priority) as any}
                  sx={{ flex: 1 }}
                >
                  <Typography variant="subtitle2" fontWeight="bold">
                    {rec.title}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {rec.description}
                  </Typography>
                  {rec.actions && rec.actions.length > 0 && (
                    <Box>
                      <Typography variant="caption" fontWeight="bold">Actions:</Typography>
                      <List dense sx={{ pt: 0 }}>
                        {rec.actions.map((action, actionIndex) => (
                          <ListItem key={actionIndex} sx={{ px: 0, py: 0.5 }}>
                            <ListItemIcon sx={{ minWidth: 20 }}>
                              <CheckIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary={action} sx={{ m: 0 }} />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}
                </Alert>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      {/* Footer */}
      <Paper elevation={1} sx={{ mt: 3, p: 2, bgcolor: 'grey.50' }}>
        <Typography variant="caption" color="text.secondary" display="flex" alignItems="center" gap={1}>
          <ScheduleIcon fontSize="small" />
          {t('cropCalendar.results.generatedOn', 'Generated on')} {formatDate(cropCalendar.generatedAt)}
        </Typography>
      </Paper>
    </Box>
  );
};

export default CalendarResults;
