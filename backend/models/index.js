const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// User model
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    unique: true,
    allowNull: false,
    field: 'user_id'
  },
  firstName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'first_name'
  },
  lastName: {
    type: DataTypes.STRING(100),
    field: 'last_name'
  },
  email: {
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: false
  },
  phoneNumber: {
    type: DataTypes.STRING(15),
    field: 'phone_number'
  },
  passwordHash: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'password_hash'
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    field: 'date_of_birth'
  },
  gender: {
    type: DataTypes.STRING(10)
  },
  profilePictureUrl: {
    type: DataTypes.TEXT,
    field: 'profile_picture_url'
  },
  preferredLanguageId: {
    type: DataTypes.INTEGER,
    field: 'preferred_language_id'
  },
  timezone: {
    type: DataTypes.STRING(50),
    defaultValue: 'Asia/Kolkata'
  },
  farmingExperienceYears: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'farming_experience_years'
  },
  educationLevel: {
    type: DataTypes.STRING(50),
    field: 'education_level'
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_verified'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  },
  emailVerifiedAt: {
    type: DataTypes.DATE,
    field: 'email_verified_at'
  },
  phoneVerifiedAt: {
    type: DataTypes.DATE,
    field: 'phone_verified_at'
  },
  lastLoginAt: {
    type: DataTypes.DATE,
    field: 'last_login_at'
  }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Language model
const Language = sequelize.define('Language', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  code: {
    type: DataTypes.STRING(5),
    unique: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  nativeName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'native_name'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  }
}, {
  tableName: 'languages',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

// Region model
const Region = sequelize.define('Region', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  state: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  district: {
    type: DataTypes.STRING(100)
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8)
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8)
  },
  timezone: {
    type: DataTypes.STRING(50),
    defaultValue: 'Asia/Kolkata'
  }
}, {
  tableName: 'regions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

// SupportedCrop model
const SupportedCrop = sequelize.define('SupportedCrop', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false
  },
  scientificName: {
    type: DataTypes.STRING(150),
    field: 'scientific_name'
  },
  category: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  aliases: {
    type: DataTypes.JSON
  },
  growingPeriodDays: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'growing_period_days'
  },
  difficultyLevel: {
    type: DataTypes.STRING(20),
    defaultValue: 'Medium',
    field: 'difficulty_level'
  },
  plantingSeasons: {
    type: DataTypes.JSON,
    allowNull: false,
    field: 'planting_seasons'
  },
  minTemperature: {
    type: DataTypes.DECIMAL(5, 2),
    field: 'min_temperature'
  },
  maxTemperature: {
    type: DataTypes.DECIMAL(5, 2),
    field: 'max_temperature'
  },
  optimalTemperature: {
    type: DataTypes.DECIMAL(5, 2),
    field: 'optimal_temperature'
  },
  minSoilMoisture: {
    type: DataTypes.INTEGER,
    field: 'min_soil_moisture'
  },
  maxSoilMoisture: {
    type: DataTypes.INTEGER,
    field: 'max_soil_moisture'
  },
  optimalSoilMoisture: {
    type: DataTypes.INTEGER,
    field: 'optimal_soil_moisture'
  },
  minSoilPh: {
    type: DataTypes.DECIMAL(3, 2),
    field: 'min_soil_ph'
  },
  maxSoilPh: {
    type: DataTypes.DECIMAL(3, 2),
    field: 'max_soil_ph'
  },
  optimalSoilPh: {
    type: DataTypes.DECIMAL(3, 2),
    field: 'optimal_soil_ph'
  },
  growthStages: {
    type: DataTypes.JSON,
    field: 'growth_stages'
  },
  fertilizationSchedule: {
    type: DataTypes.JSON,
    field: 'fertilization_schedule'
  },
  irrigationSchedule: {
    type: DataTypes.JSON,
    field: 'irrigation_schedule'
  },
  pestManagement: {
    type: DataTypes.JSON,
    field: 'pest_management'
  },
  expectedYieldPerHectare: {
    type: DataTypes.DECIMAL(8, 2),
    field: 'expected_yield_per_hectare'
  },
  yieldUnit: {
    type: DataTypes.STRING(20),
    defaultValue: 'tons',
    field: 'yield_unit'
  },
  waterRequirementPerWeek: {
    type: DataTypes.INTEGER,
    field: 'water_requirement_per_week'
  },
  harvestingMethod: {
    type: DataTypes.TEXT,
    field: 'harvesting_method'
  },
  postHarvestCare: {
    type: DataTypes.TEXT,
    field: 'post_harvest_care'
  },
  storageInstructions: {
    type: DataTypes.TEXT,
    field: 'storage_instructions'
  },
  processingDays: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    field: 'processing_days'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  }
}, {
  tableName: 'supported_crops',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// UserFarmDetails model
const UserFarmDetails = sequelize.define('UserFarmDetails', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id'
  },
  farmName: {
    type: DataTypes.STRING(100),
    field: 'farm_name'
  },
  state: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  district: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  village: {
    type: DataTypes.STRING(100)
  },
  pincode: {
    type: DataTypes.STRING(10)
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8)
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8)
  },
  totalFarmSize: {
    type: DataTypes.DECIMAL(10, 4),
    allowNull: false,
    field: 'total_farm_size'
  },
  farmSizeUnit: {
    type: DataTypes.STRING(20),
    defaultValue: 'hectares',
    field: 'farm_size_unit'
  },
  soilType: {
    type: DataTypes.STRING(100),
    field: 'soil_type'
  },
  irrigationType: {
    type: DataTypes.STRING(100),
    field: 'irrigation_type'
  },
  waterSource: {
    type: DataTypes.STRING(100),
    field: 'water_source'
  },
  mainCrops: {
    type: DataTypes.JSON,
    field: 'main_crops'
  },
  secondaryCrops: {
    type: DataTypes.JSON,
    field: 'secondary_crops'
  },
  farmingType: {
    type: DataTypes.STRING(50),
    field: 'farming_type'
  },
  hasStorageFacility: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'has_storage_facility'
  },
  hasProcessingFacility: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'has_processing_facility'
  },
  equipmentOwned: {
    type: DataTypes.JSON,
    field: 'equipment_owned'
  },
  isPrimaryFarm: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_primary_farm'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  }
}, {
  tableName: 'user_farm_details',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// UserSession model
const UserSession = sequelize.define('UserSession', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id'
  },
  sessionToken: {
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: false,
    field: 'session_token'
  },
  deviceInfo: {
    type: DataTypes.JSON,
    field: 'device_info'
  },
  ipAddress: {
    type: DataTypes.STRING(45),
    field: 'ip_address'
  },
  userAgent: {
    type: DataTypes.TEXT,
    field: 'user_agent'
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'expires_at'
  },
  lastActivityAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'last_activity_at'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  },
  loginMethod: {
    type: DataTypes.STRING(50),
    defaultValue: 'email',
    field: 'login_method'
  }
}, {
  tableName: 'user_sessions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

// Define associations
User.belongsTo(Language, { foreignKey: 'preferredLanguageId', as: 'preferredLanguage' });
Language.hasMany(User, { foreignKey: 'preferredLanguageId' });

User.hasMany(UserFarmDetails, { foreignKey: 'userId', as: 'farms' });
UserFarmDetails.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(UserSession, { foreignKey: 'userId', as: 'sessions' });
UserSession.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  User,
  Language,
  Region,
  SupportedCrop,
  UserFarmDetails,
  UserSession
};
