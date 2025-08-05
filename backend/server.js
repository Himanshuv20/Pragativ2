const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Database initialization
const { initializeDatabase } = require('./initDatabase');
const { testConnection } = require('./config/database');

const cropCalendarRoutes = require('./routes/cropCalendar');
const satelliteDataRoutes = require('./routes/satelliteData');
const aiRecommendationRoutes = require('./routes/aiRecommendations');
const sosEmergencyRoutes = require('./routes/sosEmergency');
const sustainablePracticesRoutes = require('./routes/sustainablePractices');
const weatherRoutes = require('./routes/weather');
const governmentSchemesRoutes = require('./routes/governmentSchemes');
const mandiDataRoutes = require('./routes/mandiData');
const debtCounselingRoutes = require('./routes/debtCounseling');
const soilAnalysisRoutes = require('./routes/soilAnalysis');
const pestDiseaseRoutes = require('./routes/pestDiseaseAnalysis');
const authRoutes = require('./routes/auth');
const chatbotRoutes = require('./routes/chatbot');
const translationRoutes = require('./routes/translation');

const app = express();
const PORT = process.env.PORT || 5000;

// Import middleware
const { authenticate, optionalAuth } = require('./middleware/auth');
const { languageMiddleware } = require('./middleware/language');

// Middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
  credentials: true,
  optionsSuccessStatus: 200
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply optional authentication and language middleware globally
app.use(optionalAuth);
app.use(languageMiddleware);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/crop-calendar', cropCalendarRoutes);
app.use('/api/satellite-data', satelliteDataRoutes);
app.use('/api/ai-recommendations', aiRecommendationRoutes);
app.use('/api/sos', sosEmergencyRoutes);
app.use('/api/sustainable-practices', sustainablePracticesRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/government-schemes', governmentSchemesRoutes);
app.use('/api/mandi-data', mandiDataRoutes);
app.use('/api/debt-counseling', debtCounselingRoutes);
app.use('/api/soil', soilAnalysisRoutes);
app.use('/api/pest-disease', pestDiseaseRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/translation', translationRoutes);
app.use('/api/locations', soilAnalysisRoutes);
app.use('/api/sentinel', soilAnalysisRoutes);

// Root endpoint - API Information
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'Crop Calendar API',
    version: '1.0.0',
    description: 'Agricultural advisory system with crop calendar and satellite data integration',
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/health',
      cropCalendar: '/api/crop-calendar',
      satelliteData: '/api/satellite-data',
      weather: '/api/weather',
      aiRecommendations: '/api/ai-recommendations',
      governmentSchemes: '/api/government-schemes',
      mandiData: '/api/mandi-data',
      debtCounseling: '/api/debt-counseling',
      soilAnalysis: '/api/soil',
      sosEmergency: '/api/sos',
      sustainablePractices: '/api/sustainable-practices',
      auth: '/api/auth'
    },
    features: [
      'Location-based crop calendars',
      'Real-time satellite data integration',
      'Weather forecasting',
      'AI-powered recommendations',
      'Government schemes information',
      'Live mandi price data',
      'Debt counseling services',
      'Soil analysis and recommendations',
      'Emergency SOS services',
      'Sustainable farming practices'
    ]
  });
});

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const dbConnected = await testConnection();
    res.status(200).json({
      status: 'OK',
      message: 'Crop Calendar API is running',
      database: dbConnected ? 'Connected' : 'Disconnected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: 'Service health check failed',
      database: 'Disconnected',
      timestamp: new Date().toISOString()
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Initialize database and start server
async function startServer() {
  try {
    console.log('🚀 Starting Crop Calendar API Server...');
    
    // Initialize database
    const dbInitialized = await initializeDatabase();
    if (!dbInitialized) {
      console.error('❌ Failed to initialize database');
      process.exit(1);
    }

    app.listen(PORT, () => {
      console.log(`🌾 Crop Calendar API server running on port ${PORT}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
      console.log(`📊 Database: MySQL connected on port 3305`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();
