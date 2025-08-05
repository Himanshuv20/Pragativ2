# 🌾 CropCalendar 2.0 - Advanced Agricultural Intelligence Platform

> **A comprehensive full-stack agricultural advisory platform that generates personalized crop calendars using real-time satellite data, AI-powered recommendations, and comprehensive agricultural intelligence.**

## 🚀 Major Enhancements in Version 2.0

### 🆕 New Modules Added
- **🆘 SOS Emergency Response**: Real-time agricultural emergency detection and response system
- **🌱 Sustainable Agricultural Practices**: Location-based sustainable farming recommendations
- **🌤️ Weather Intelligence**: Real-time weather data with geolocation and multi-day forecasts
- **🏛️ Government Schemes**: Comprehensive agricultural schemes database with eligibility checker

### 🔧 Technical Improvements
- **Soil Data Integration**: Enhanced with Copernicus Sentinel satellite data for soil moisture and temperature
- **AI-Powered Recommendations**: Intelligent crop suggestions based on environmental conditions
- **Mobile-First Design**: Responsive UI with blue weather theme and agricultural iconography
- **Real-time Data**: Integration with OpenWeatherMap API, NASA APIs, and Copernicus satellite services

## 🏗️ Architecture

### Backend (Node.js/Express)
```
backend/
├── routes/
│   ├── cropCalendar.js         # Crop calendar generation
│   ├── satelliteData.js        # Satellite data integration
│   ├── weather.js              # Weather data and forecasts
│   ├── sosEmergency.js         # Emergency response system
│   ├── sustainablePractices.js # Sustainable farming practices
│   └── governmentSchemes.js    # Government schemes database
├── services/
│   ├── cropCalendarService.js
│   ├── satelliteDataService.js
│   ├── weatherService.js
│   ├── aiRecommendationService.js
│   ├── sosEmergencyService.js
│   ├── sustainablePracticesService.js
│   └── governmentSchemesService.js
└── data/
    ├── cropData.js             # Comprehensive crop database
    └── governmentSchemes.js    # Agricultural schemes data
```

### Frontend (React/TypeScript)
```
frontend/src/
├── pages/
│   ├── CropCalendarPage.tsx    # Multi-step crop calendar wizard
│   ├── WeatherPage.tsx         # Weather dashboard with geolocation
│   ├── SOSEmergencyPage.tsx    # Emergency response interface
│   ├── SustainablePracticesPage.tsx # Sustainable farming guide
│   └── GovernmentSchemesPage.tsx    # Government schemes browser
├── components/
│   ├── icons/AppIcons.tsx      # Custom agricultural SVG icons
│   ├── LocationStep.tsx        # Location selection component
│   ├── CropSelectionStep.tsx   # Crop selection interface
│   └── CalendarResults.tsx     # Calendar visualization
├── context/
│   └── CropCalendarContext.tsx # Global state management
├── theme/
│   ├── theme.ts                # Main MUI theme
│   ├── weatherTheme.ts         # Blue weather-specific theme
│   └── WeatherThemeProvider.tsx
└── services/
    └── api.ts                  # API client with comprehensive endpoints
```

## 🌟 Key Features

### 🎯 Core Functionality
- **Personalized Crop Calendars**: Generate detailed planting, maintenance, and harvesting schedules
- **Satellite Data Integration**: Real-time vegetation indices (NDVI), soil moisture, and weather data
- **AI-Enhanced Recommendations**: Machine learning-powered crop suggestions and risk assessments
- **Multi-language Support**: Agricultural guidance in multiple languages

### 📊 Data Sources
- **Copernicus Sentinel**: High-resolution satellite imagery and soil data
- **NASA SMAP**: Soil moisture and temperature data
- **OpenWeatherMap**: Real-time weather and forecasts
- **Hugging Face**: AI-powered agricultural insights

### 🛡️ Emergency & Sustainability
- **SOS Emergency System**: Automated threat detection (drought, pests, diseases)
- **Sustainable Practices**: Eco-friendly farming recommendations
- **Government Schemes**: Access to agricultural subsidies and support programs
- **Risk Assessment**: Climate and agricultural risk analysis

### 🎨 User Experience
- **Mobile-First Design**: Optimized for smartphones and tablets
- **Geolocation Support**: Automatic location detection for weather and recommendations
- **Responsive UI**: Material-UI components with agricultural theming
- **Progressive Web App**: Offline capabilities and app-like experience

## 🔧 Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Git

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure your API keys in .env
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Environment Variables
```env
# Backend (.env)
PORT=5001
NODE_ENV=production
NASA_API_KEY=your_nasa_key
OPENWEATHER_API_KEY=your_openweather_key
HUGGINGFACE_API_KEY=your_huggingface_key
COPERNICUS_USERNAME=your_copernicus_username
COPERNICUS_PASSWORD=your_copernicus_password
```

## 🌐 API Endpoints

### Crop Calendar
- `GET /api/crop-calendar/crops` - Get supported crops
- `POST /api/crop-calendar/generate` - Generate personalized calendar

### Weather & Environment
- `GET /api/weather/current/:lat/:lon` - Current weather conditions
- `GET /api/weather/forecast/:lat/:lon` - 7-day weather forecast
- `GET /api/satellite-data/:lat/:lon` - Satellite imagery and indices

### Emergency & Support
- `POST /api/sos/emergency` - Report agricultural emergency
- `GET /api/sos/recommendations/:lat/:lon` - Get emergency recommendations
- `GET /api/sustainable-practices` - Get sustainable farming practices
- `GET /api/government-schemes` - Browse government agricultural schemes

## 🧪 Testing

### Backend Testing
```bash
cd backend
# Test weather API
node test-weather-api.js
# Test satellite data
node test-copernicus.js
# Test location services
node test-location-weather.js
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 🚀 Deployment

### Backend Deployment
- Configure production environment variables
- Set up SSL certificates
- Deploy to cloud platform (AWS, Heroku, DigitalOcean)

### Frontend Deployment
```bash
cd frontend
npm run build
# Deploy build/ folder to static hosting (Netlify, Vercel, S3)
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Copernicus Programme**: For satellite data access
- **OpenWeatherMap**: For weather data services
- **NASA**: For agricultural and climate data
- **Hugging Face**: For AI/ML model hosting
- **Material-UI**: For React component library

## 📞 Support

For support, email support@cropcalendar.com or join our [Discord community](https://discord.gg/cropcalendar).

---

**Made with ❤️ for farmers and agricultural communities worldwide** 🌍🚜
