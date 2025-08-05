import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import Header from './components/Header';
import Chatbot from './components/Chatbot';
import HomePage from './pages/HomePage';
import ChatbotPage from './pages/ChatbotPage';
import CropCalendarPage from './pages/CropCalendarPage';
import SOSEmergencyPage from './pages/SOSEmergencyPage';
import SustainablePracticesPage from './pages/SustainablePracticesPage';
import WeatherPage from './pages/WeatherPage';
import GovernmentSchemesPage from './pages/GovernmentSchemesPage';
import MandiDataPage from './pages/MandiDataPage';
import DebtCounselingPage from './pages/DebtCounselingPage';
import SoilAnalysisPage from './pages/SoilAnalysisPage';
import SoilTestBookingPage from './pages/SoilTestBookingPage';
import PestDiseaseAnalysis from './pages/PestDiseaseAnalysis';
import ProfilePage from './pages/ProfilePage';
import { LoginPage } from './pages/LoginPage';
import { RegistrationPage } from './pages/RegistrationPage';
import { CropCalendarProvider } from './context/CropCalendarContext';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { agriculturalTheme } from './theme/theme';

import './App.css';

function App() {
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const handleLocationRequest = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  return (
    <ThemeProvider theme={agriculturalTheme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <LanguageProvider>
          <AuthProvider>
            <CropCalendarProvider>
              <Router>
                <div className="App">
                  <Header />
                  <main>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/chatbot" element={<ChatbotPage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/register" element={<RegistrationPage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/crop-calendar" element={<CropCalendarPage />} />
                      <Route path="/sos-emergency" element={<SOSEmergencyPage />} />
                      <Route path="/sos-emergency/:emergencyId" element={<SOSEmergencyPage />} />
                      <Route path="/sustainable-practices" element={<SustainablePracticesPage />} />
                      <Route path="/weather" element={<WeatherPage />} />
                      <Route path="/government-schemes" element={<GovernmentSchemesPage />} />
                      <Route path="/mandi-data" element={<MandiDataPage />} />
                      <Route path="/debt-counseling" element={<DebtCounselingPage />} />
                      <Route path="/soil-analysis" element={<SoilAnalysisPage />} />
                      <Route path="/pest-disease-analysis" element={<PestDiseaseAnalysis />} />
                      <Route path="/soil-test-booking" element={<SoilTestBookingPage />} />
                    </Routes>
                  </main>
                  
                  {/* Chatbot Component */}
                  <Chatbot
                    userId="user123" // In a real app, this would come from authentication
                    location={userLocation}
                    onLocationRequest={handleLocationRequest}
                  />
                </div>
              </Router>
            </CropCalendarProvider>
          </AuthProvider>
        </LanguageProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
