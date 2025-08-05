# 🌾 Crop Calendar Application - Technical Documentation

> **Last Updated**: July 23, 2025  
> **Version**: 1.0.0  
> **Status**: Production Ready

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture & Technology Stack](#architecture--technology-stack)
3. [External APIs & Data Sources](#external-apis--data-sources)
4. [Data Models & Types](#data-models--types)
5. [Backend Services](#backend-services)
6. [Frontend Components](#frontend-components)
7. [Features & Functionality](#features--functionality)
8. [Deployment & Configuration](#deployment--configuration)
9. [Development Setup](#development-setup)
10. [API Documentation](#api-documentation)

---

## 🎯 Project Overview

The **Crop Calendar Application** is a full-stack agricultural advisory platform that generates personalized crop calendars using real-time satellite data, weather information, and comprehensive agricultural databases. The application provides farmers with data-driven insights for optimal crop planning, fertilization schedules, and harvest timing.

### Key Capabilities
- **🛰️ Satellite Data Integration**: Real-time vegetation indices, soil moisture, and weather data
- **📅 Personalized Crop Calendars**: Custom planting, fertilization, and harvesting schedules
- **🌍 Location-Based Agriculture**: GPS or manual coordinate input for precise data
- **📱 Responsive Design**: Mobile-first approach with adaptive UI
- **🔬 Agricultural Intelligence**: Data-driven recommendations and risk assessments

---

## 🏗️ Architecture & Technology Stack

### **System Architecture**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │  External APIs  │
│   React/TS      │◄──►│   Node.js/      │◄──►│  NASA, Weather  │
│   Material-UI   │    │   Express       │    │  Satellite Data │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Browser Store  │    │  JSON Database  │    │  Third-party    │
│  Context API    │    │  Crop Data      │    │  Services       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **Frontend Technology Stack**

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| **Framework** | React | 19.1.0 | Core UI framework |
| **Language** | TypeScript | Latest | Type safety and development experience |
| **UI Library** | Material-UI (MUI) | 7.2.0 | Component library and design system |
| **State Management** | React Context API | Built-in | Global state management |
| **Routing** | React Router | 7.7.0 | Client-side navigation |
| **HTTP Client** | Axios | 1.10.0 | API communication |
| **Date Handling** | Day.js | 1.11.13 | Date manipulation and formatting |
| **Charts** | Recharts | 3.1.0 | Data visualization |
| **Maps** | React Leaflet | 5.0.0 | Interactive maps |
| **Styling** | Emotion | 11.14.0 | CSS-in-JS styling |

### **Backend Technology Stack**

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| **Runtime** | Node.js | Latest | Server runtime environment |
| **Framework** | Express.js | 4.18.2 | Web application framework |
| **Language** | JavaScript (ES6+) | Latest | Server-side development |
| **HTTP Client** | Axios | 1.4.0 | External API communication |
| **Validation** | Express Validator | 7.0.1 | Input validation and sanitization |
| **Security** | Helmet | 7.0.0 | Security middleware |
| **CORS** | CORS | 2.8.5 | Cross-origin resource sharing |
| **Logging** | Morgan | 1.10.0 | HTTP request logging |
| **Date Library** | Moment.js | 2.29.4 | Date manipulation |
| **Environment** | Dotenv | 16.3.1 | Environment variable management |
| **Scheduling** | Node-cron | 3.0.2 | Task scheduling |

---

## 🌐 External APIs & Data Sources

### **Primary Data Sources**

#### 1. **NASA Earth API** 🛰️
- **Purpose**: Satellite imagery and vegetation indices
- **Endpoint**: `https://api.nasa.gov/planetary/earth`
- **Data Retrieved**:
  - NDVI (Normalized Difference Vegetation Index)
  - EVI (Enhanced Vegetation Index)
  - Satellite imagery for location analysis
- **API Key**: Required (`NASA_API_KEY`)
- **Rate Limits**: 1,000 requests/hour (Demo key: 30/hour)

#### 2. **OpenWeatherMap API** 🌤️
- **Purpose**: Real-time weather data and forecasts
- **Endpoint**: `https://api.openweathermap.org/data/2.5`
- **Data Retrieved**:
  - Current weather conditions
  - 7-day weather forecast
  - Historical weather data
  - Precipitation and humidity levels
- **API Key**: Required (`OPENWEATHER_API_KEY`)
- **Rate Limits**: 60 calls/minute (Free tier)

#### 3. **Simulated Satellite Data** 🔬
- **Purpose**: Demo and development fallback
- **Implementation**: Algorithm-generated realistic data
- **Data Points**:
  - Vegetation health indices
  - Soil moisture percentages
  - Climate conditions
  - Agricultural risk factors

### **API Integration Architecture**

```javascript
// Example API Service Structure
class SatelliteDataService {
  constructor() {
    this.nasaApiKey = process.env.NASA_API_KEY;
    this.openWeatherApiKey = process.env.OPENWEATHER_API_KEY;
  }

  async getSatelliteData(location) {
    // Multi-source data aggregation
    const weatherData = await this.getWeatherData(location);
    const vegetationData = await this.getVegetationData(location);
    const soilData = await this.getSoilMoistureData(location);
    
    return this.aggregateData([weatherData, vegetationData, soilData]);
  }
}
```

---

## 📊 Data Models & Types

### **Core Data Structures**

#### **Location Model**
```typescript
interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  timezone?: string;
}
```

#### **Satellite Data Model**
```typescript
interface SatelliteData {
  vegetationIndex: {
    ndvi: number;          // -1 to 1 (vegetation health)
    evi: number;           // Enhanced vegetation index
    lastCalculated: string;
  };
  soilMoisture: {
    percentage: number;    // 0-100%
    status: string;        // 'dry' | 'optimal' | 'wet'
    depth: string;         // Measurement depth
  };
  temperature: {
    current: number;       // Current temperature (°C)
    min: number;          // Daily minimum
    max: number;          // Daily maximum
    unit: string;         // Temperature unit
  };
  precipitation: {
    last7Days: number;     // mm of rainfall
    last30Days: number;    // mm of rainfall
    unit: string;         // Measurement unit
  };
  humidity: number;        // Relative humidity %
  windSpeed: number;       // Wind speed (km/h)
  cloudCover: number;      // Cloud coverage %
  sunlightHours: number;   // Daily sunlight hours
  lastUpdated: string;     // ISO timestamp
  location: Location;
  dataSource: string;      // API source identifier
  confidence: number;      // Data reliability (0-1)
}
```

#### **Crop Information Model**
```typescript
interface CropInfo {
  name: string;
  scientificName: string;
  category: string;        // 'Cereal' | 'Vegetable' | 'Legume' | etc.
  description: string;
  growingPeriod: number;   // Days from planting to harvest
  difficulty: string;      // 'Easy' | 'Medium' | 'Hard'
  plantingSeasons: {
    northern: PlantingWindow[];
    southern: PlantingWindow[];
  };
  requirements: {
    temperature: Range;
    soilMoisture: Range;
    soilPH: Range;
  };
  growthStages: GrowthStage[];
  fertilizationSchedule: FertilizationEvent[];
  irrigationSchedule: IrrigationEvent[];
  pestManagement: PestEvent[];
  recommendations: Recommendation[];
}
```

#### **Growth Stage Model**
```typescript
interface GrowthStage {
  name: string;           // 'Germination' | 'Vegetative' | etc.
  duration: number;       // Days in this stage
  description: string;
  activities: string[];   // Required farming activities
  careInstructions: string[];
  expectedSigns: string[];
  criticalFactors: string[];
  riskFactors: RiskFactor[];
}
```

### **Supported Crop Database**

| Crop | Scientific Name | Growing Period | Difficulty | Seasons |
|------|----------------|----------------|------------|---------|
| **Wheat** | Triticum aestivum | 120 days | Medium | Winter/Spring |
| **Rice** | Oryza sativa | 150 days | Medium | Summer/Monsoon |
| **Corn** | Zea mays | 100 days | Easy | Spring/Summer |
| **Tomato** | Solanum lycopersicum | 90 days | Medium | Spring/Summer |
| **Soybean** | Glycine max | 110 days | Easy | Late Spring |
| **Cotton** | Gossypium hirsutum | 180 days | Hard | Summer |
| **Sunflower** | Helianthus annuus | 90 days | Easy | Spring/Summer |
| **Barley** | Hordeum vulgare | 100 days | Easy | Spring/Fall |

---

## ⚙️ Backend Services

### **Service Architecture**

#### **1. Crop Calendar Service** 📅
```javascript
class CropCalendarService {
  // Generates personalized crop calendars
  async generateCropCalendar(location, cropName, area) {
    const cropData = this.getCropData(cropName);
    const satelliteData = await this.getSatelliteData(location);
    const calendar = this.calculateGrowthSchedule(cropData, satelliteData);
    return this.enrichWithRecommendations(calendar);
  }
}
```

**Responsibilities**:
- Calendar generation logic
- Growth stage calculations
- Fertilization scheduling
- Risk assessment
- Yield predictions

#### **2. Satellite Data Service** 🛰️
```javascript
class SatelliteDataService {
  // Integrates multiple data sources
  async getSatelliteData(location) {
    const [weather, vegetation, soil] = await Promise.all([
      this.getWeatherData(location),
      this.getVegetationData(location),
      this.getSoilMoistureData(location)
    ]);
    return this.aggregateAndValidate({ weather, vegetation, soil });
  }
}
```

**Responsibilities**:
- External API integration
- Data aggregation and validation
- Caching and optimization
- Fallback data simulation

### **API Endpoints**

#### **Crop Management**
```
GET    /api/crops                    # List all available crops
GET    /api/crops/:name             # Get specific crop details
POST   /api/crops/search            # Search crops by criteria
```

#### **Calendar Generation**
```
POST   /api/calendar/generate       # Generate crop calendar
GET    /api/calendar/:id            # Retrieve generated calendar
PUT    /api/calendar/:id            # Update calendar parameters
```

#### **Satellite Data**
```
GET    /api/satellite-data          # Get current satellite data
POST   /api/satellite-data/location # Get data for specific location
GET    /api/satellite-data/history  # Historical data trends
```

---

## 🎨 Frontend Components

### **Component Hierarchy**

```
App
├── Router
│   ├── HomePage
│   │   ├── Hero Section
│   │   ├── Features Overview
│   │   └── Crops Showcase
│   └── CropCalendarPage
│       ├── LocationStep
│       ├── CropSelectionStep
│       ├── AreaStep
│       └── CalendarResults
│           ├── Timeline View
│           └── Calendar View
├── Header (Responsive Navigation)
└── Context Providers
    └── CropCalendarContext
```

### **Key Components**

#### **1. LocationStep Component** 📍
```typescript
const LocationStep: React.FC = () => {
  // GPS integration and manual coordinate input
  const getCurrentLocation = useCallback(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => updateLocation(position.coords),
      (error) => handleLocationError(error)
    );
  }, []);
};
```

**Features**:
- GPS location detection
- Manual coordinate input
- Address validation
- Interactive map integration

#### **2. CropSelectionStep Component** 🌱
```typescript
const CropSelectionStep: React.FC = () => {
  // Dynamic crop filtering and selection
  const filteredCrops = useMemo(() => 
    crops.filter(crop => 
      crop.name.toLowerCase().includes(searchTerm.toLowerCase())
    ), [crops, searchTerm]
  );
};
```

**Features**:
- Visual crop cards with emojis
- Search and filtering
- Detailed crop information
- Responsive grid layout

#### **3. AreaStep Component** 📏
```typescript
const AreaStep: React.FC = () => {
  // Multi-unit area input with validation
  const convertToHectares = useCallback((value: number, unit: string) => {
    const conversions = { hectares: 1, acres: 0.404686, sqm: 0.0001 };
    return value * conversions[unit];
  }, []);
};
```

**Features**:
- Multi-unit support (hectares, acres, sq meters)
- Real-time validation
- Unit conversion
- Input sanitization

#### **4. CalendarResults Component** 📅
```typescript
const CalendarResults: React.FC = () => {
  // Dual-view calendar display
  const [viewMode, setViewMode] = useState<'timeline' | 'calendar'>('timeline');
  
  const renderTimelineView = () => (
    // Timeline visualization of growth stages
  );
  
  const renderCalendarView = () => (
    // Month-by-month calendar grid
  );
};
```

**Features**:
- Timeline and calendar views
- Interactive growth stages
- Color-coded activities
- Tooltips and detailed information

### **Responsive Design System**

#### **Breakpoints**
```typescript
const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,      // Mobile
      sm: 600,    // Tablet
      md: 900,    // Small desktop
      lg: 1200,   // Desktop
      xl: 1536,   // Large desktop
    },
  },
});
```

#### **Mobile-First Approach**
- Hamburger navigation menu for mobile
- Touch-friendly interface elements
- Responsive grid systems
- Adaptive typography scaling

---

## ✨ Features & Functionality

### **Core Features**

#### **1. Smart Location Detection** 🌍
- **GPS Integration**: Automatic location detection using browser geolocation
- **Manual Input**: Latitude/longitude coordinate entry
- **Address Search**: Future integration with geocoding services
- **Location Validation**: Coordinate bounds checking

#### **2. Comprehensive Crop Database** 🌾
- **8 Major Crops**: Wheat, rice, corn, tomato, soybean, cotton, sunflower, barley
- **Detailed Information**: Scientific names, growing periods, difficulty levels
- **Growth Stages**: 6 distinct phases with detailed descriptions
- **Seasonal Awareness**: Northern and southern hemisphere planting windows

#### **3. Intelligent Calendar Generation** 📅
- **Data-Driven Scheduling**: Based on satellite data and crop requirements
- **Fertilization Plans**: NPK ratios, timing, and application methods
- **Irrigation Schedules**: Water requirements by growth stage
- **Pest Management**: Preventive measures and treatment schedules

#### **4. Advanced Data Visualization** 📊
- **Timeline View**: Linear progression of growth stages
- **Calendar View**: Month-by-month activity grid
- **Color Coding**: Visual stage identification
- **Interactive Elements**: Tooltips and detailed information

#### **5. Responsive User Experience** 📱
- **Mobile-First Design**: Optimized for all device sizes
- **Progressive Web App**: Installable and offline-capable
- **Fast Loading**: Optimized performance and caching
- **Accessibility**: WCAG compliant interface

### **Advanced Functionality**

#### **Risk Assessment Engine**
```javascript
const assessRisks = (satelliteData, cropRequirements) => {
  const risks = [];
  
  if (satelliteData.soilMoisture.percentage < cropRequirements.soilMoisture.minimum) {
    risks.push({
      type: 'drought',
      severity: 'high',
      recommendation: 'Increase irrigation frequency'
    });
  }
  
  return risks;
};
```

#### **Yield Prediction Model**
- Weather pattern analysis
- Soil condition evaluation
- Historical data correlation
- Machine learning integration potential

---

## 🚀 Deployment & Configuration

### **Environment Variables**

#### **Backend Configuration**
```bash
# Server Configuration
PORT=5001
NODE_ENV=production

# API Keys
NASA_API_KEY=your_nasa_api_key_here
OPENWEATHER_API_KEY=your_openweather_api_key_here

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=crop_calendar

# Security
JWT_SECRET=your_jwt_secret_here
CORS_ORIGIN=https://yourfrontend.com
```

#### **Frontend Configuration**
```bash
# API Configuration
REACT_APP_API_BASE_URL=https://api.cropcalendar.com
REACT_APP_MAPS_API_KEY=your_maps_api_key_here

# Feature Flags
REACT_APP_ENABLE_OFFLINE_MODE=true
REACT_APP_DEBUG_MODE=false
```

### **Docker Configuration**

#### **Backend Dockerfile**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5001
CMD ["npm", "start"]
```

#### **Frontend Dockerfile**
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
```

### **Production Deployment**

#### **Recommended Architecture**
```
Internet → Load Balancer → Frontend (Nginx) → Backend (Node.js) → Database
                      ↓
               CDN (Static Assets)
```

#### **Performance Optimizations**
- **Frontend**: Code splitting, lazy loading, asset optimization
- **Backend**: Response caching, database indexing, API rate limiting
- **Infrastructure**: CDN integration, horizontal scaling, monitoring

---

## 🛠️ Development Setup

### **Prerequisites**
- Node.js 18+ and npm
- Git version control
- Code editor (VS Code recommended)
- Browser with developer tools

### **Quick Start**

#### **1. Clone Repository**
```bash
git clone https://github.com/yourusername/crop-calendar.git
cd crop-calendar
```

#### **2. Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your API keys
npm run dev
# Backend running on http://localhost:5001
```

#### **3. Frontend Setup**
```bash
cd frontend
npm install
npm start
# Frontend running on http://localhost:3000
```

#### **4. Development Workflow**
```bash
# Run both simultaneously
npm run dev  # From root directory
```

### **Testing Strategy**

#### **Backend Testing**
```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# API testing
npm run test:api
```

#### **Frontend Testing**
```bash
# Component tests
npm test

# E2E tests
npm run test:e2e

# Visual regression tests
npm run test:visual
```

---

## 📖 API Documentation

### **Authentication**
Currently, the API is open for demo purposes. Production deployment should implement:
- JWT-based authentication
- API key management
- Rate limiting per user

### **Request/Response Format**

#### **Standard Success Response**
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation completed successfully",
  "timestamp": "2025-07-23T10:30:00Z"
}
```

#### **Standard Error Response**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input parameters",
    "details": [
      {
        "field": "latitude",
        "message": "Must be between -90 and 90"
      }
    ]
  },
  "timestamp": "2025-07-23T10:30:00Z"
}
```

### **Detailed Endpoints**

#### **POST /api/calendar/generate**
Generates a personalized crop calendar.

**Request Body:**
```json
{
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060
  },
  "crop": "wheat",
  "area": {
    "value": 5.0,
    "unit": "hectares"
  },
  "plantingDate": "2025-10-15"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "calendar": {
      "cropInfo": {
        "name": "wheat",
        "scientificName": "Triticum aestivum",
        "growingPeriod": 120
      },
      "schedule": {
        "plantingDate": "2025-10-15",
        "harvestDate": "2026-02-12",
        "growthStages": [
          {
            "name": "Germination",
            "startDate": "2025-10-15",
            "endDate": "2025-10-22",
            "activities": ["Ensure adequate moisture", "Monitor for pests"],
            "stage": "germination"
          }
        ]
      },
      "recommendations": [
        {
          "type": "fertilization",
          "priority": "high",
          "description": "Apply NPK fertilizer",
          "scheduledDate": "2025-10-29"
        }
      ]
    }
  }
}
```

---

## 🔧 Technical Considerations

### **Scalability**
- **Horizontal Scaling**: Stateless backend design for load balancing
- **Database Optimization**: Indexing for crop data queries
- **Caching Strategy**: Redis for satellite data caching
- **CDN Integration**: Static asset delivery optimization

### **Security**
- **Input Validation**: Server-side validation for all inputs
- **CORS Configuration**: Restricted origins in production
- **Rate Limiting**: API endpoint protection
- **Data Sanitization**: XSS and injection prevention

### **Performance**
- **Lazy Loading**: Component-based code splitting
- **Image Optimization**: WebP format with fallbacks
- **API Response Caching**: Satellite data caching (5-minute TTL)
- **Bundle Analysis**: Regular bundle size monitoring

### **Monitoring & Analytics**
- **Error Tracking**: Integration with error monitoring services
- **Performance Metrics**: Core Web Vitals monitoring
- **User Analytics**: Privacy-compliant usage tracking
- **API Monitoring**: Uptime and response time tracking

---

## 📚 Additional Resources

### **Development Resources**
- [React Documentation](https://react.dev/)
- [Material-UI Documentation](https://mui.com/)
- [Express.js Guide](https://expressjs.com/)
- [NASA Earth API Documentation](https://api.nasa.gov/)

### **Agricultural References**
- [FAO Crop Calendar](http://www.fao.org/agriculture/crops)
- [USDA Plant Database](https://plants.usda.gov/)
- [Agricultural Weather Data](https://weather.gov/agriculture)

### **Contributing Guidelines**
- Fork the repository
- Create feature branches
- Follow code style guidelines
- Write comprehensive tests
- Submit pull requests with detailed descriptions

---

## 📞 Support & Contact

For technical support or questions about the Crop Calendar application:

- **Documentation**: This file and inline code comments
- **Issues**: GitHub Issues for bug reports and feature requests
- **Discussions**: GitHub Discussions for general questions
- **Code Review**: Pull requests welcome

---

*This documentation is maintained alongside the codebase and updated with each release. For the most current information, please refer to the latest version in the repository.*
