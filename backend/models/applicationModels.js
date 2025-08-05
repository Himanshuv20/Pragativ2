const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { User, SupportedCrop, UserFarmDetails } = require('./index');

// CropCalendar model
const CropCalendar = sequelize.define('CropCalendar', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  calendarId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    unique: true,
    allowNull: false,
    field: 'calendar_id'
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id'
  },
  farmId: {
    type: DataTypes.INTEGER,
    field: 'farm_id'
  },
  cropId: {
    type: DataTypes.INTEGER,
    field: 'crop_id'
  },
  cropVariety: {
    type: DataTypes.STRING(100),
    field: 'crop_variety'
  },
  plannedArea: {
    type: DataTypes.DECIMAL(10, 4),
    allowNull: false,
    field: 'planned_area'
  },
  plantingDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'planting_date'
  },
  expectedHarvestDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'expected_harvest_date'
  },
  currentGrowthStage: {
    type: DataTypes.STRING(100),
    field: 'current_growth_stage'
  },
  progressPercentage: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0.0,
    field: 'progress_percentage'
  },
  growthTimeline: {
    type: DataTypes.JSON,
    allowNull: false,
    field: 'growth_timeline'
  },
  fertilizationSchedule: {
    type: DataTypes.JSON,
    field: 'fertilization_schedule'
  },
  irrigationSchedule: {
    type: DataTypes.JSON,
    field: 'irrigation_schedule'
  },
  pestManagementSchedule: {
    type: DataTypes.JSON,
    field: 'pest_management_schedule'
  },
  activityCalendar: {
    type: DataTypes.JSON,
    field: 'activity_calendar'
  },
  aiRecommendations: {
    type: DataTypes.JSON,
    field: 'ai_recommendations'
  },
  riskAssessment: {
    type: DataTypes.JSON,
    field: 'risk_assessment'
  },
  costEstimation: {
    type: DataTypes.JSON,
    field: 'cost_estimation'
  },
  calendarStatus: {
    type: DataTypes.STRING(50),
    defaultValue: 'active',
    field: 'calendar_status'
  },
  actualHarvestDate: {
    type: DataTypes.DATEONLY,
    field: 'actual_harvest_date'
  },
  actualYield: {
    type: DataTypes.DECIMAL(8, 2),
    field: 'actual_yield'
  },
  yieldUnit: {
    type: DataTypes.STRING(20),
    field: 'yield_unit'
  },
  generationConditions: {
    type: DataTypes.JSON,
    field: 'generation_conditions'
  }
}, {
  tableName: 'crop_calendars',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// WeatherData model
const WeatherData = sequelize.define('WeatherData', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  locationHash: {
    type: DataTypes.STRING(64),
    allowNull: false,
    field: 'location_hash'
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: false
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: false
  },
  currentTemperature: {
    type: DataTypes.DECIMAL(5, 2),
    field: 'current_temperature'
  },
  feelsLikeTemperature: {
    type: DataTypes.DECIMAL(5, 2),
    field: 'feels_like_temperature'
  },
  humidity: {
    type: DataTypes.INTEGER
  },
  pressure: {
    type: DataTypes.DECIMAL(7, 2)
  },
  windSpeed: {
    type: DataTypes.DECIMAL(5, 2),
    field: 'wind_speed'
  },
  windDirection: {
    type: DataTypes.INTEGER,
    field: 'wind_direction'
  },
  cloudCover: {
    type: DataTypes.INTEGER,
    field: 'cloud_cover'
  },
  visibility: {
    type: DataTypes.DECIMAL(5, 2)
  },
  uvIndex: {
    type: DataTypes.DECIMAL(3, 1),
    field: 'uv_index'
  },
  currentPrecipitation: {
    type: DataTypes.DECIMAL(6, 2),
    defaultValue: 0,
    field: 'current_precipitation'
  },
  precipitationLastHour: {
    type: DataTypes.DECIMAL(6, 2),
    defaultValue: 0,
    field: 'precipitation_last_hour'
  },
  precipitationLast24h: {
    type: DataTypes.DECIMAL(6, 2),
    defaultValue: 0,
    field: 'precipitation_last_24h'
  },
  weatherCondition: {
    type: DataTypes.STRING(100),
    field: 'weather_condition'
  },
  weatherDescription: {
    type: DataTypes.TEXT,
    field: 'weather_description'
  },
  weatherIcon: {
    type: DataTypes.STRING(20),
    field: 'weather_icon'
  },
  forecastData: {
    type: DataTypes.JSON,
    field: 'forecast_data'
  },
  dataSource: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'data_source'
  },
  apiCallTimestamp: {
    type: DataTypes.DATE,
    field: 'api_call_timestamp'
  },
  confidenceLevel: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 1.0,
    field: 'confidence_level'
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'expires_at'
  }
}, {
  tableName: 'weather_data',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

// SatelliteData model
const SatelliteData = sequelize.define('SatelliteData', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  locationHash: {
    type: DataTypes.STRING(64),
    allowNull: false,
    field: 'location_hash'
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: false
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: false
  },
  ndvi: {
    type: DataTypes.DECIMAL(6, 4)
  },
  evi: {
    type: DataTypes.DECIMAL(6, 4)
  },
  vegetationHealthStatus: {
    type: DataTypes.STRING(50),
    field: 'vegetation_health_status'
  },
  vegetationCoveragePercentage: {
    type: DataTypes.DECIMAL(5, 2),
    field: 'vegetation_coverage_percentage'
  },
  soilMoisturePercentage: {
    type: DataTypes.DECIMAL(5, 2),
    field: 'soil_moisture_percentage'
  },
  soilMoistureStatus: {
    type: DataTypes.STRING(50),
    field: 'soil_moisture_status'
  },
  soilTemperature: {
    type: DataTypes.DECIMAL(5, 2),
    field: 'soil_temperature'
  },
  landCoverType: {
    type: DataTypes.STRING(100),
    field: 'land_cover_type'
  },
  agriculturalLandPercentage: {
    type: DataTypes.DECIMAL(5, 2),
    field: 'agricultural_land_percentage'
  },
  satelliteSource: {
    type: DataTypes.STRING(100),
    field: 'satellite_source'
  },
  imageDate: {
    type: DataTypes.DATEONLY,
    field: 'image_date'
  },
  cloudCoverPercentage: {
    type: DataTypes.DECIMAL(5, 2),
    field: 'cloud_cover_percentage'
  },
  imageQualityScore: {
    type: DataTypes.DECIMAL(3, 2),
    field: 'image_quality_score'
  },
  processingLevel: {
    type: DataTypes.STRING(50),
    field: 'processing_level'
  },
  confidenceScore: {
    type: DataTypes.DECIMAL(5, 4),
    field: 'confidence_score'
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'expires_at'
  }
}, {
  tableName: 'satellite_data',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

// EmergencyReport model
const EmergencyReport = sequelize.define('EmergencyReport', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  emergencyId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    unique: true,
    allowNull: false,
    field: 'emergency_id'
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id'
  },
  farmId: {
    type: DataTypes.INTEGER,
    field: 'farm_id'
  },
  emergencyType: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'emergency_type'
  },
  severityLevel: {
    type: DataTypes.STRING(20),
    allowNull: false,
    field: 'severity_level'
  },
  emergencyTitle: {
    type: DataTypes.STRING(200),
    field: 'emergency_title'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: false
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: false
  },
  locationDescription: {
    type: DataTypes.TEXT,
    field: 'location_description'
  },
  affectedCrop: {
    type: DataTypes.STRING(100),
    field: 'affected_crop'
  },
  affectedAreaHectares: {
    type: DataTypes.DECIMAL(10, 4),
    field: 'affected_area_hectares'
  },
  estimatedDamagePercentage: {
    type: DataTypes.DECIMAL(5, 2),
    field: 'estimated_damage_percentage'
  },
  status: {
    type: DataTypes.STRING(50),
    defaultValue: 'reported'
  },
  priorityScore: {
    type: DataTypes.INTEGER,
    defaultValue: 50,
    field: 'priority_score'
  },
  recommendedActions: {
    type: DataTypes.JSON,
    field: 'recommended_actions'
  },
  expertResponse: {
    type: DataTypes.TEXT,
    field: 'expert_response'
  },
  resourcesProvided: {
    type: DataTypes.JSON,
    field: 'resources_provided'
  },
  resolutionSummary: {
    type: DataTypes.TEXT,
    field: 'resolution_summary'
  },
  reportedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'reported_at'
  },
  acknowledgedAt: {
    type: DataTypes.DATE,
    field: 'acknowledged_at'
  },
  resolvedAt: {
    type: DataTypes.DATE,
    field: 'resolved_at'
  },
  contactMethod: {
    type: DataTypes.STRING(50),
    field: 'contact_method'
  },
  urgentContactNeeded: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'urgent_contact_needed'
  }
}, {
  tableName: 'emergency_reports',
  timestamps: false
});

// Define associations
CropCalendar.belongsTo(User, { foreignKey: 'userId', as: 'user' });
CropCalendar.belongsTo(UserFarmDetails, { foreignKey: 'farmId', as: 'farm' });
CropCalendar.belongsTo(SupportedCrop, { foreignKey: 'cropId', as: 'crop' });

User.hasMany(CropCalendar, { foreignKey: 'userId', as: 'cropCalendars' });
UserFarmDetails.hasMany(CropCalendar, { foreignKey: 'farmId', as: 'cropCalendars' });
SupportedCrop.hasMany(CropCalendar, { foreignKey: 'cropId', as: 'cropCalendars' });

EmergencyReport.belongsTo(User, { foreignKey: 'userId', as: 'user' });
EmergencyReport.belongsTo(UserFarmDetails, { foreignKey: 'farmId', as: 'farm' });

User.hasMany(EmergencyReport, { foreignKey: 'userId', as: 'emergencyReports' });
UserFarmDetails.hasMany(EmergencyReport, { foreignKey: 'farmId', as: 'emergencyReports' });

module.exports = {
  CropCalendar,
  WeatherData,
  SatelliteData,
  EmergencyReport
};
