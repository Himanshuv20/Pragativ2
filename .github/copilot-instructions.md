# Copilot Instructions for Crop Calendar Project

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a full-stack agricultural advisory application that generates personalized crop calendars using real-time satellite data. The project consists of:
- **Backend**: Node.js/Express API server with satellite data integration
- **Frontend**: React TypeScript application with Material-UI
- **Database**: JSON-based crop database with comprehensive agricultural data

## Architecture & Technologies

### Backend (Node.js/Express)
- RESTful API with Express.js framework
- Satellite data services (NASA, OpenWeather APIs with simulation fallback)
- Comprehensive crop database with growth stages, requirements, and schedules
- Input validation using express-validator
- CORS enabled for frontend communication

### Frontend (React/TypeScript) 
- Modern React 18 with TypeScript for type safety
- Material-UI (MUI) components with agricultural green theme
- React Context API for state management
- React Router for navigation
- Axios for API communication
- Responsive design for all device types

## Key Features
1. **Location-based Agriculture**: GPS or manual coordinate input for precise satellite data
2. **Crop Calendar Generation**: Personalized planting, fertilization, and harvesting schedules
3. **Satellite Data Integration**: Real-time vegetation indices, soil moisture, and weather data
4. **Multi-step Workflow**: Guided form process for calendar generation
5. **Agricultural Intelligence**: Data-driven recommendations and risk assessments

## Development Guidelines

### Code Style
- Use TypeScript consistently throughout the project
- Follow React best practices (hooks, functional components)
- Implement proper error handling and loading states
- Use Material-UI components and theme system
- Maintain clean separation between API services and components

### API Design
- RESTful endpoints with consistent JSON responses
- Proper HTTP status codes and error messages
- Input validation and sanitization
- Satellite data simulation for development/demo purposes

### Data Models
- Location: latitude/longitude coordinates
- Crop Calendar: Complete timeline with growth stages
- Satellite Data: Vegetation indices, soil moisture, weather conditions
- Recommendations: Prioritized agricultural advice

## File Structure Notes
- `/backend/services/` - Business logic and external API integration
- `/backend/data/` - Crop database and agricultural data
- `/frontend/src/components/` - Reusable UI components  
- `/frontend/src/context/` - React Context providers
- `/frontend/src/services/` - API client and data fetching

## Agricultural Domain Knowledge
- Crop growth stages: germination, vegetative growth, flowering, maturity
- Satellite indices: NDVI (vegetation health), soil moisture levels
- Seasonal considerations: planting windows based on hemisphere
- Agricultural inputs: fertilization schedules, irrigation requirements
- Yield optimization: data-driven farming recommendations

## Common Patterns
- Use the `useCropCalendar` hook for accessing global state
- Implement loading states for all async operations
- Provide user-friendly error messages with recovery options
- Use Material-UI's responsive grid system for layouts
- Handle location services and coordinate validation properly

When working on this project, prioritize agricultural accuracy, user experience, and data-driven insights for farmers.
