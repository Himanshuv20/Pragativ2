import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Chip,
  Link,
  Stack
} from '@mui/material';
import { GovernmentSchemesAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

interface Scheme {
  id: number;
  title: string;
  category: string;
  description: string;
  benefits: string[];
  eligibility: string;
  contactNumber?: string;
  website: string;
  priority: 'high' | 'medium' | 'low';
}

const GovernmentSchemesPage: React.FC = () => {
  const { t } = useLanguage();
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [filteredSchemes, setFilteredSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchSchemes();
  }, []);

  useEffect(() => {
    filterSchemes();
  }, [schemes, searchTerm, selectedCategory]);

  const fetchSchemes = async () => {
    try {
      setLoading(true);
      const response = await GovernmentSchemesAPI.getAllSchemes();
      if (response.success) {
        setSchemes(response.data);
      } else {
        setError('Failed to load government schemes');
      }
    } catch (err) {
      setError('Failed to load government schemes');
      console.error('Error fetching schemes:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterSchemes = () => {
    let filtered = schemes;

    if (searchTerm) {
      filtered = filtered.filter(scheme =>
        scheme.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scheme.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(scheme => scheme.category === selectedCategory);
    }

    setFilteredSchemes(filtered);
  };

  const handleSchemeClick = (scheme: Scheme) => {
    setSelectedScheme(scheme);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedScheme(null);
  };

  const categories = Array.from(new Set(schemes.map(scheme => scheme.category)));

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" height="200px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t('governmentSchemes.title')}
      </Typography>

      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          placeholder={t('governmentSchemes.searchPlaceholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ minWidth: 300, flexGrow: 1 }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>{t('governmentSchemes.category')}</InputLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            label={t('governmentSchemes.category')}
          >
            <MenuItem value="all">{t('governmentSchemes.allCategories')}</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category} value={category}>{category}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box 
        sx={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 3
        }}
      >
        {filteredSchemes.map((scheme) => (
          <Card 
            key={scheme.id}
            sx={{ 
              height: '100%',
              cursor: 'pointer',
              '&:hover': { elevation: 4 }
            }}
            onClick={() => handleSchemeClick(scheme)}
          >
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                {scheme.title}
              </Typography>
              <Chip 
                label={scheme.category} 
                size="small" 
                sx={{ mb: 1 }}
              />
              <Typography variant="body2" color="text.secondary">
                {scheme.description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{selectedScheme?.title}</DialogTitle>
        <DialogContent>
          {selectedScheme && (
            <>
              <Typography variant="body1" paragraph>
                {selectedScheme.description}
              </Typography>
              <Typography variant="h6" gutterBottom>
                {t('governmentSchemes.benefits')}:
              </Typography>
              <ul>
                {selectedScheme.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
              <Typography variant="h6" gutterBottom>
                {t('governmentSchemes.eligibility')}:
              </Typography>
              <Typography variant="body2" paragraph>
                {selectedScheme.eligibility}
              </Typography>
              {selectedScheme.website && (
                <Link href={selectedScheme.website} target="_blank" rel="noopener">
                  {t('governmentSchemes.visitWebsite')}
                </Link>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>{t('governmentSchemes.close')}</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default GovernmentSchemesPage;
