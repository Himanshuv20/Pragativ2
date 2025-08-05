import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Card,
  CardContent,
  Avatar,
  Box,
  Chip,
  Stack
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { farmer } = useAuth();

  if (!farmer) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5">
            Please log in to view your profile
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Farmer Profile
      </Typography>
      
      <Stack spacing={3}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <Avatar
              sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}
            >
              {farmer.firstName.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="h5" gutterBottom>
              {farmer.firstName} {farmer.lastName}
            </Typography>
            <Chip 
              label={farmer.isVerified ? "Verified Farmer" : "Farmer"} 
              color={farmer.isVerified ? "success" : "primary"} 
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Email:</strong> {farmer.email}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Phone:</strong> {farmer.phoneNumber}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Location:</strong> {farmer.farmLocation.village}, {farmer.farmLocation.district}, {farmer.farmLocation.state}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Farm Size:</strong> {farmer.farmDetails.farmSize} {farmer.farmDetails.farmSizeUnit}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Soil Type:</strong> {farmer.farmDetails.soilType}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Irrigation:</strong> {farmer.farmDetails.irrigationType}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Main Crops:</strong> {farmer.farmDetails.mainCrops.join(', ')}
              </Typography>
              <Typography variant="body1">
                <strong>Experience:</strong> {farmer.experience} years
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
};

export default ProfilePage;
