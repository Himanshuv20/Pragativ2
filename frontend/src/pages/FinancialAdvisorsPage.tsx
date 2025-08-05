import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Avatar,
  Rating,
  CircularProgress,
  Alert,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Phone,
  Email,
  LocationOn,
  AccessTime,
  Star,
  Schedule,
  VideoCall,
  Person,
  Home,
  FilterList,
  BookOnline
} from '@mui/icons-material';
import axios from 'axios';

interface FinancialAdvisor {
  id: string;
  name: string;
  specialization: string;
  expertise: string[];
  experience: string;
  rating: number;
  reviewCount: number;
  consultationFee: number;
  phone: string;
  email: string;
  address: string;
  state: string;
  city: string;
  district: string;
  languages: string[];
  consultationTypes: string[];
  workingHours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
  isOnline: boolean;
  todaySlots: string[];
  profileImage?: string;
}

interface AdvisorFilters {
  state: string;
  city: string;
  specialization: string;
  maxFee: string;
  language: string;
}

const FinancialAdvisorsPage: React.FC = () => {
  const [advisors, setAdvisors] = useState<FinancialAdvisor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAdvisor, setSelectedAdvisor] = useState<FinancialAdvisor | null>(null);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  
  const [filters, setFilters] = useState<AdvisorFilters>({
    state: 'Maharashtra',
    city: 'Pune',
    specialization: '',
    maxFee: '',
    language: ''
  });

  const [showFilters, setShowFilters] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

  const fetchAdvisors = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      if (filters.state) params.append('state', filters.state);
      if (filters.city) params.append('city', filters.city);
      if (filters.specialization) params.append('specialization', filters.specialization);
      if (filters.maxFee) params.append('maxFee', filters.maxFee);
      if (filters.language) params.append('language', filters.language);

      const response = await axios.get(`${API_BASE_URL}/debt-counseling/advisors?${params.toString()}`);
      
      if (response.data.success) {
        setAdvisors(response.data.data.advisors);
      } else {
        setError('Failed to fetch advisors');
      }
    } catch (err) {
      console.error('Error fetching advisors:', err);
      setError('Unable to connect to server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvisors();
  }, [filters]);

  const handleFilterChange = (field: keyof AdvisorFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBookConsultation = (advisor: FinancialAdvisor) => {
    setSelectedAdvisor(advisor);
    setBookingDialogOpen(true);
  };

  const getConsultationIcon = (type: string) => {
    switch (type) {
      case 'Video Call': return <VideoCall />;
      case 'Phone Call': return <Phone />;
      case 'Home Visit': return <Home />;
      default: return <Person />;
    }
  };

  const getStatusColor = (isOnline: boolean) => {
    return isOnline ? '#4caf50' : '#ff9800';
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
          💰 Financial Advisors
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
          Connect with certified financial experts for debt counseling and agricultural loan guidance
        </Typography>
        
        {/* Filter Toggle */}
        <Button
          startIcon={<FilterList />}
          onClick={() => setShowFilters(!showFilters)}
          variant="outlined"
          sx={{ mb: 2 }}
        >
          Filters
        </Button>
      </Box>

      {/* Filters Section */}
      {showFilters && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Search Filters</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ minWidth: 200, flex: 1 }}>
                <FormControl fullWidth>
                  <InputLabel>State</InputLabel>
                  <Select
                    value={filters.state}
                    label="State"
                    onChange={(e) => handleFilterChange('state', e.target.value)}
                  >
                    <MenuItem value="Maharashtra">Maharashtra</MenuItem>
                    <MenuItem value="Andhra Pradesh">Andhra Pradesh</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              
              <Box sx={{ minWidth: 200, flex: 1 }}>
                <FormControl fullWidth>
                  <InputLabel>City</InputLabel>
                  <Select
                    value={filters.city}
                    label="City"
                    onChange={(e) => handleFilterChange('city', e.target.value)}
                  >
                    {filters.state === 'Maharashtra' && (
                      <>
                        <MenuItem value="Pune">Pune</MenuItem>
                        <MenuItem value="Mumbai">Mumbai</MenuItem>
                        <MenuItem value="Nashik">Nashik</MenuItem>
                      </>
                    )}
                    {filters.state === 'Andhra Pradesh' && (
                      <>
                        <MenuItem value="Hyderabad">Hyderabad</MenuItem>
                        <MenuItem value="Visakhapatnam">Visakhapatnam</MenuItem>
                        <MenuItem value="Vijayawada">Vijayawada</MenuItem>
                      </>
                    )}
                  </Select>
                </FormControl>
              </Box>
              
              <Box sx={{ minWidth: 150, flex: 1 }}>
                <TextField
                  fullWidth
                  label="Specialization"
                  value={filters.specialization}
                  onChange={(e) => handleFilterChange('specialization', e.target.value)}
                  placeholder="e.g., debt, loans"
                />
              </Box>
              
              <Box sx={{ minWidth: 150, flex: 1 }}>
                <TextField
                  fullWidth
                  label="Max Fee (₹)"
                  type="number"
                  value={filters.maxFee}
                  onChange={(e) => handleFilterChange('maxFee', e.target.value)}
                />
              </Box>
              
              <Box sx={{ minWidth: 150, flex: 1 }}>
                <TextField
                  fullWidth
                  label="Language"
                  value={filters.language}
                  onChange={(e) => handleFilterChange('language', e.target.value)}
                  placeholder="e.g., Hindi, English"
                />
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Advisors Grid */}
      {!loading && !error && (
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
          gap: 3 
        }}>
          {advisors.map((advisor) => (
            <Card 
              key={advisor.id}
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                {/* Header with Avatar and Status */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar 
                    sx={{ 
                      width: 60, 
                      height: 60, 
                      mr: 2,
                      bgcolor: '#2e7d32'
                    }}
                  >
                    {advisor.name.split(' ').map(n => n[0]).join('')}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
                      {advisor.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box 
                        sx={{ 
                          width: 8, 
                          height: 8, 
                          borderRadius: '50%', 
                          bgcolor: getStatusColor(advisor.isOnline) 
                        }} 
                      />
                      <Typography variant="caption" color="text.secondary">
                        {advisor.isOnline ? 'Online' : 'Offline'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Rating and Experience */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Rating value={advisor.rating} readOnly size="small" />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    {advisor.rating} ({advisor.reviewCount} reviews)
                  </Typography>
                </Box>

                {/* Specialization */}
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  {advisor.specialization}
                </Typography>

                {/* Experience */}
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  📊 {advisor.experience}
                </Typography>

                {/* Expertise Tags */}
                <Box sx={{ mb: 2 }}>
                  {advisor.expertise.slice(0, 3).map((skill, index) => (
                    <Chip 
                      key={index}
                      label={skill}
                      size="small"
                      sx={{ mr: 0.5, mb: 0.5, fontSize: '0.75rem' }}
                    />
                  ))}
                </Box>

                {/* Location */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationOn sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {advisor.city}, {advisor.state}
                  </Typography>
                </Box>

                {/* Consultation Fee */}
                <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', mb: 2 }}>
                  ₹{advisor.consultationFee} / session
                </Typography>

                {/* Languages */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">Languages:</Typography>
                  <Typography variant="body2">
                    {advisor.languages.join(', ')}
                  </Typography>
                </Box>

                {/* Consultation Types */}
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  {advisor.consultationTypes.map((type, index) => (
                    <Tooltip key={index} title={type}>
                      <IconButton size="small" sx={{ color: '#2e7d32' }}>
                        {getConsultationIcon(type)}
                      </IconButton>
                    </Tooltip>
                  ))}
                </Box>

                {/* Today's Availability */}
                {advisor.todaySlots.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Available today:
                    </Typography>
                    <Typography variant="body2" color="success.main">
                      {advisor.todaySlots.slice(0, 2).join(', ')}
                      {advisor.todaySlots.length > 2 && ` +${advisor.todaySlots.length - 2} more`}
                    </Typography>
                  </Box>
                )}
              </CardContent>

              {/* Action Buttons */}
              <Box sx={{ p: 2, pt: 0 }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Box sx={{ flex: 1 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      size="small"
                      startIcon={<Schedule />}
                      onClick={() => {
                        alert(`View available slots for ${advisor.name}\nPhone: ${advisor.phone}`);
                      }}
                    >
                      View Slots
                    </Button>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      size="small"
                      startIcon={<BookOnline />}
                      onClick={() => handleBookConsultation(advisor)}
                      sx={{ bgcolor: '#2e7d32' }}
                    >
                      Book Now
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Card>
          ))}
        </Box>
      )}

      {/* No Results */}
      {!loading && !error && advisors.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No advisors found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your filters or selecting a different location.
          </Typography>
        </Box>
      )}

      {/* Booking Dialog */}
      <Dialog 
        open={bookingDialogOpen} 
        onClose={() => setBookingDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Book Consultation</DialogTitle>
        <DialogContent>
          {selectedAdvisor && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedAdvisor.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {selectedAdvisor.specialization} • ₹{selectedAdvisor.consultationFee}
              </Typography>
              
              <Alert severity="info" sx={{ mt: 2 }}>
                Booking functionality will be integrated with user authentication.
                For now, please call: <strong>{selectedAdvisor.phone}</strong>
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBookingDialogOpen(false)}>Close</Button>
          <Button variant="contained" sx={{ bgcolor: '#2e7d32' }}>
            Call Now
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FinancialAdvisorsPage;