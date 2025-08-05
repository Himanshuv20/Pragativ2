# 🌾 PRAGATI.ai - Architecture Documentation

## 📋 Overview

This folder contains comprehensive architecture documentation for the PRAGATI.ai agricultural intelligence platform. The documentation is presented in wiki-style HTML format with interactive Mermaid diagrams for detailed system visualization.

## 📁 Architecture Documents

### 1. **index.html** - Architecture Index
- **Purpose**: Main landing page with navigation to all architecture documents
- **Features**: System overview, statistics, and quick access to all architectural views
- **Best For**: Getting started and understanding the overall system scope

### 2. **01-Holistic-Architecture.html** - Complete System Overview
- **Purpose**: High-level system architecture showing all components and their relationships
- **Includes**:
  - System-wide architecture diagram
  - Technology stack breakdown
  - Data flow sequences
  - External API integrations
  - Performance and scalability insights
- **Best For**: Understanding the complete system design and component interactions

### 3. **02-Frontend-Architecture.html** - Frontend Deep Dive
- **Purpose**: Detailed React TypeScript frontend architecture
- **Includes**:
  - Component hierarchy and relationships
  - State management with Context API
  - Material-UI design system integration
  - API integration layer
  - UI/UX design principles
- **Best For**: Frontend developers and UI/UX designers

### 4. **03-Backend-Architecture.html** - Backend Services
- **Purpose**: Node.js/Express backend architecture and services
- **Includes**:
  - Microservices architecture
  - RESTful API design
  - Authentication and security layers
  - Database and data management
  - External API integrations
- **Best For**: Backend developers and system architects

### 5. **04-Individual-Modules-Architecture.html** - Module Specifications
- **Purpose**: Deep dive into individual system modules
- **Includes**:
  - Crop Calendar module workflow
  - Soil Analysis system architecture
  - Satellite Data integration details
  - Mandi Data and ML predictions
  - SOS Emergency response system
- **Best For**: Understanding specific module implementations and workflows

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe JavaScript for better development experience
- **Material-UI (MUI)** - Agricultural-themed UI components
- **React Router** - Client-side navigation
- **Axios** - HTTP client for API communication

### Backend
- **Node.js 22.18.0** - JavaScript runtime
- **Express.js** - Web application framework
- **JWT & OAuth2** - Authentication and authorization
- **Helmet & CORS** - Security middleware
- **Morgan** - HTTP request logging

### Data Integration
- **Copernicus Sentinel-2** - Real-time satellite imagery
- **OpenWeather API** - Weather data and forecasts
- **AGMARKNET** - Agricultural market price data
- **Hugging Face** - AI/ML model services
- **Data.gov.in** - Government schemes and policies

## 📊 System Capabilities

- **50+ Crop Varieties** - Comprehensive crop database
- **10,000+ ML Training Samples** - Machine learning models for price prediction
- **Real-time Satellite Data** - Live Copernicus Sentinel-2 imagery
- **11 Core Modules** - Specialized agricultural services
- **4+ External APIs** - Integrated data sources
- **24/7 Emergency SOS** - Agricultural emergency response

## 🔍 How to Use This Documentation

1. **Start with `index.html`** - Get an overview of the entire system
2. **Review `01-Holistic-Architecture.html`** - Understand system-wide design
3. **Explore specific layers**:
   - Frontend developers → `02-Frontend-Architecture.html`
   - Backend developers → `03-Backend-Architecture.html`
   - Module specialists → `04-Individual-Modules-Architecture.html`

## 🌐 Viewing the Documentation

### Local Viewing
1. Navigate to the Architecture folder
2. Open any HTML file in a web browser
3. Interactive Mermaid diagrams will render automatically

### Web Server (Recommended)
For best experience, serve the files through a web server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js (http-server)
npx http-server

# Then access: http://localhost:8000
```

## 📋 Architecture Highlights

### 🏗️ Design Principles
- **Microservices Architecture** - Independent, scalable services
- **Clean Separation of Concerns** - Clear boundaries between layers
- **API-First Design** - RESTful services with consistent interfaces
- **Security by Design** - Multi-layer security implementation
- **Responsive Design** - Mobile-first user interfaces

### 🚀 Key Features
- **Real-time Data Processing** - Live satellite and weather integration
- **AI-Powered Recommendations** - Machine learning for crop optimization
- **Comprehensive Agricultural Services** - End-to-end farming support
- **Emergency Response System** - 24/7 agricultural emergency assistance
- **Government Integration** - Access to schemes and subsidies

### ⚡ Performance Features
- **Caching Strategies** - Multiple levels of data caching
- **Graceful Degradation** - Fallback mechanisms for external APIs
- **Load Balancing Ready** - Stateless design for horizontal scaling
- **Error Handling** - Comprehensive error recovery systems

## 🔧 Technical Implementation Notes

### Authentication Flow
- JWT tokens for client authentication
- OAuth2 for external API access (Copernicus)
- Secure token storage and refresh mechanisms

### Data Processing
- Real-time satellite imagery analysis
- Machine learning price predictions
- Agricultural recommendation algorithms
- Weather-based farming advisories

### Integration Patterns
- RESTful API design
- Event-driven processing where applicable
- Graceful fallback to mock data
- Comprehensive input validation

## 📞 Support and Maintenance

This architecture documentation is designed to support:
- **Development Teams** - Technical implementation guidance
- **System Administrators** - Deployment and maintenance insights
- **Product Managers** - Feature understanding and planning
- **Agricultural Experts** - Domain-specific module comprehension

## 🔄 Version Information

- **Documentation Version**: 1.0
- **System Version**: Crop Calendar 4.0
- **Last Updated**: August 2, 2025
- **Mermaid Version**: 10.6.1

---

**🌾 Crop Calendar 4.0 - Empowering Farmers with Technology 🚀**
