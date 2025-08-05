-- =====================================================
-- Agricultural Intelligence App - Complete Database Schema (MySQL)
-- =====================================================
-- MySQL Database Schema for AI-Powered Agriculture App
-- Features: User Management, Crop Calendars, AI Recommendations,
-- Weather Data, Emergency Response, Government Schemes, Mandi Data
-- =====================================================



-- Drop existing tables if they exist (for development)
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS user_sessions;
DROP TABLE IF EXISTS user_notifications;
DROP TABLE IF EXISTS user_feedback;
DROP TABLE IF EXISTS emergency_reports;
DROP TABLE IF EXISTS crop_calendars;
DROP TABLE IF EXISTS ai_recommendations;
DROP TABLE IF EXISTS weather_data;
DROP TABLE IF EXISTS satellite_data;
DROP TABLE IF EXISTS soil_analysis_reports;
DROP TABLE IF EXISTS mandi_price_data;
DROP TABLE IF EXISTS government_scheme_applications;
DROP TABLE IF EXISTS debt_counseling_sessions;
DROP TABLE IF EXISTS sustainable_practices_logs;
DROP TABLE IF EXISTS user_farm_details;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS supported_crops;
DROP TABLE IF EXISTS government_schemes;
DROP TABLE IF EXISTS soil_testing_centers;
DROP TABLE IF EXISTS financial_advisors;
DROP TABLE IF EXISTS languages;
DROP TABLE IF EXISTS regions;
SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================
-- 1. LOOKUP TABLES
-- =====================================================

-- Languages supported by the app
CREATE TABLE languages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(5) NOT NULL UNIQUE, -- 'hi', 'en', 'te', 'ta', etc.
    name VARCHAR(50) NOT NULL,
    native_name VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Regions (States/Districts in India)
CREATE TABLE regions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    timezone VARCHAR(50) DEFAULT 'Asia/Kolkata',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_state_district (state, district)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Supported crops with comprehensive data
CREATE TABLE supported_crops (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    scientific_name VARCHAR(150),
    category VARCHAR(50) NOT NULL, -- 'Cereal', 'Vegetable', 'Legume', etc.
    description TEXT,
    aliases JSON, -- Array of alternative names
    growing_period_days INT NOT NULL,
    difficulty_level VARCHAR(20) DEFAULT 'Medium', -- 'Easy', 'Medium', 'Hard'
    
    -- Growing seasons (JSON for flexibility)
    planting_seasons JSON NOT NULL,
    
    -- Environmental requirements
    min_temperature DECIMAL(5,2),
    max_temperature DECIMAL(5,2),
    optimal_temperature DECIMAL(5,2),
    min_soil_moisture INT,
    max_soil_moisture INT,
    optimal_soil_moisture INT,
    min_soil_ph DECIMAL(3,2),
    max_soil_ph DECIMAL(3,2),
    optimal_soil_ph DECIMAL(3,2),
    
    -- Growth data (JSON for stages, fertilization, etc.)
    growth_stages JSON,
    fertilization_schedule JSON,
    irrigation_schedule JSON,
    pest_management JSON,
    
    -- Yield and harvest info
    expected_yield_per_hectare DECIMAL(8,2),
    yield_unit VARCHAR(20) DEFAULT 'tons',
    water_requirement_per_week INT, -- liters per m²
    harvesting_method TEXT,
    post_harvest_care TEXT,
    storage_instructions TEXT,
    processing_days INT DEFAULT 1,
    
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Government schemes data
CREATE TABLE government_schemes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    scheme_name VARCHAR(200) NOT NULL,
    scheme_code VARCHAR(50) UNIQUE,
    category VARCHAR(100) NOT NULL, -- 'Loan', 'Subsidy', 'Insurance', etc.
    description TEXT,
    eligibility_criteria JSON,
    benefits JSON,
    application_process TEXT,
    required_documents JSON, -- Array of strings
    contact_details JSON,
    applicable_states JSON, -- Array of strings
    budget_allocation DECIMAL(15,2),
    start_date DATE,
    end_date DATE,
    priority_level VARCHAR(20) DEFAULT 'Medium', -- 'High', 'Medium', 'Low'
    is_emergency BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Soil testing centers
CREATE TABLE soil_testing_centers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    center_name VARCHAR(200) NOT NULL,
    address TEXT NOT NULL,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    pincode VARCHAR(10),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    contact_person VARCHAR(100),
    phone_number VARCHAR(15),
    email VARCHAR(100),
    services_offered JSON, -- Array of strings
    testing_charges JSON, -- Different test types and prices
    working_hours VARCHAR(100),
    is_government BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Financial advisors for debt counseling
CREATE TABLE financial_advisors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    advisor_name VARCHAR(100) NOT NULL,
    qualification VARCHAR(200),
    specializations JSON, -- Array of strings
    experience_years INT,
    state VARCHAR(100) NOT NULL,
    city VARCHAR(100),
    district VARCHAR(100),
    contact_number VARCHAR(15),
    email VARCHAR(100),
    languages_spoken JSON, -- Array of strings
    consultation_fee DECIMAL(8,2),
    consultation_types JSON, -- Array: 'In-Person', 'Video Call', 'Phone Call', 'Home Visit'
    availability_schedule JSON,
    rating DECIMAL(3,2) DEFAULT 0.0,
    total_consultations INT DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 2. USER MANAGEMENT
-- =====================================================

-- Main users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36) UNIQUE NOT NULL DEFAULT (UUID()),
    
    -- Personal Information
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(15),
    password_hash VARCHAR(255) NOT NULL,
    
    -- Profile Information
    date_of_birth DATE,
    gender VARCHAR(10), -- 'Male', 'Female', 'Other'
    profile_picture_url TEXT,
    
    -- Preferences
    preferred_language_id INT,
    timezone VARCHAR(50) DEFAULT 'Asia/Kolkata',
    
    -- Experience and Background
    farming_experience_years INT DEFAULT 0,
    education_level VARCHAR(50), -- 'Primary', 'Secondary', 'Graduate', etc.
    
    -- Account Status
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    email_verified_at TIMESTAMP NULL,
    phone_verified_at TIMESTAMP NULL,
    last_login_at TIMESTAMP NULL,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    FOREIGN KEY (preferred_language_id) REFERENCES languages(id),
    
    -- Indexes
    INDEX idx_email (email),
    INDEX idx_phone (phone_number),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User farm details (can have multiple farms per user)
CREATE TABLE user_farm_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    farm_name VARCHAR(100),
    
    -- Location Information
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    village VARCHAR(100),
    pincode VARCHAR(10),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Farm Details
    total_farm_size DECIMAL(10,4) NOT NULL, -- in hectares
    farm_size_unit VARCHAR(20) DEFAULT 'hectares',
    soil_type VARCHAR(100),
    irrigation_type VARCHAR(100),
    water_source VARCHAR(100),
    
    -- Current Crops
    main_crops JSON, -- Array of crop names
    secondary_crops JSON, -- Array of crop names
    farming_type VARCHAR(50), -- 'Organic', 'Conventional', 'Mixed'
    
    -- Infrastructure
    has_storage_facility BOOLEAN DEFAULT FALSE,
    has_processing_facility BOOLEAN DEFAULT FALSE,
    equipment_owned JSON, -- Array of strings
    
    is_primary_farm BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_farm (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User sessions for authentication
CREATE TABLE user_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    device_info JSON, -- Browser, OS, IP address, etc.
    ip_address VARCHAR(45), -- IPv6 compatible
    user_agent TEXT,
    
    -- Session Management
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    last_activity_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Security
    login_method VARCHAR(50) DEFAULT 'email', -- 'email', 'phone', 'google', etc.
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_session_token (session_token),
    INDEX idx_user_sessions (user_id),
    INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 3. CORE APPLICATION DATA
-- =====================================================

-- Crop calendars generated for users
CREATE TABLE crop_calendars (
    id INT AUTO_INCREMENT PRIMARY KEY,
    calendar_id VARCHAR(36) UNIQUE NOT NULL DEFAULT (UUID()),
    user_id INT NOT NULL,
    farm_id INT,
    
    -- Crop Information
    crop_id INT,
    crop_variety VARCHAR(100),
    planned_area DECIMAL(10,4) NOT NULL, -- in hectares
    
    -- Calendar Details
    planting_date DATE NOT NULL,
    expected_harvest_date DATE NOT NULL,
    current_growth_stage VARCHAR(100),
    progress_percentage DECIMAL(5,2) DEFAULT 0.0,
    
    -- Generated Calendar Data (JSON)
    growth_timeline JSON NOT NULL,
    fertilization_schedule JSON,
    irrigation_schedule JSON,
    pest_management_schedule JSON,
    activity_calendar JSON,
    
    -- Recommendations
    ai_recommendations JSON,
    risk_assessment JSON,
    cost_estimation JSON,
    
    -- Status Tracking
    calendar_status VARCHAR(50) DEFAULT 'active', -- 'active', 'completed', 'abandoned'
    actual_harvest_date DATE,
    actual_yield DECIMAL(8,2),
    yield_unit VARCHAR(20),
    
    -- Satellite/Weather data at time of generation
    generation_conditions JSON,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (farm_id) REFERENCES user_farm_details(id),
    FOREIGN KEY (crop_id) REFERENCES supported_crops(id),
    INDEX idx_user_calendars (user_id),
    INDEX idx_calendar_id (calendar_id),
    INDEX idx_crop_calendar (crop_id),
    INDEX idx_calendar_status (calendar_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- AI recommendations history
CREATE TABLE ai_recommendations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    calendar_id INT,
    
    -- Recommendation Details
    recommendation_type VARCHAR(100) NOT NULL, -- 'crop_selection', 'planting_time', 'fertilizer', etc.
    priority_level VARCHAR(20) DEFAULT 'medium', -- 'high', 'medium', 'low'
    category VARCHAR(100), -- 'preparation', 'irrigation', 'weather', 'soil', etc.
    
    title VARCHAR(200) NOT NULL,
    description TEXT,
    recommended_actions JSON, -- Array of strings
    
    -- Input Conditions
    input_conditions JSON,
    satellite_data_snapshot JSON,
    weather_data_snapshot JSON,
    
    -- AI Model Information
    ai_model_version VARCHAR(50),
    confidence_score DECIMAL(5,4),
    
    -- User Response
    user_action VARCHAR(50), -- 'accepted', 'rejected', 'modified', 'pending'
    user_feedback TEXT,
    effectiveness_rating INT, -- 1-5 scale
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (calendar_id) REFERENCES crop_calendars(id),
    INDEX idx_user_recommendations (user_id),
    INDEX idx_recommendation_type (recommendation_type),
    INDEX idx_priority_level (priority_level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Weather data cache
CREATE TABLE weather_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    location_hash VARCHAR(64) NOT NULL, -- MD5 hash of lat,lng for indexing
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    
    -- Current Weather
    current_temperature DECIMAL(5,2),
    feels_like_temperature DECIMAL(5,2),
    humidity INT,
    pressure DECIMAL(7,2),
    wind_speed DECIMAL(5,2),
    wind_direction INT,
    cloud_cover INT,
    visibility DECIMAL(5,2),
    uv_index DECIMAL(3,1),
    
    -- Precipitation
    current_precipitation DECIMAL(6,2) DEFAULT 0,
    precipitation_last_hour DECIMAL(6,2) DEFAULT 0,
    precipitation_last_24h DECIMAL(6,2) DEFAULT 0,
    
    -- Weather Conditions
    weather_condition VARCHAR(100),
    weather_description TEXT,
    weather_icon VARCHAR(20),
    
    -- Forecast Data (JSON for 7-day forecast)
    forecast_data JSON,
    
    -- Data Source
    data_source VARCHAR(50) NOT NULL, -- 'openweather', 'simulation', etc.
    api_call_timestamp TIMESTAMP NULL,
    confidence_level DECIMAL(3,2) DEFAULT 1.0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    
    INDEX idx_location_hash (location_hash),
    INDEX idx_coordinates (latitude, longitude),
    INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Satellite data cache
CREATE TABLE satellite_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    location_hash VARCHAR(64) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    
    -- Vegetation Indices
    ndvi DECIMAL(6,4), -- -1 to 1
    evi DECIMAL(6,4),
    vegetation_health_status VARCHAR(50),
    vegetation_coverage_percentage DECIMAL(5,2),
    
    -- Soil Data
    soil_moisture_percentage DECIMAL(5,2),
    soil_moisture_status VARCHAR(50), -- 'dry', 'optimal', 'wet'
    soil_temperature DECIMAL(5,2),
    
    -- Land Cover
    land_cover_type VARCHAR(100),
    agricultural_land_percentage DECIMAL(5,2),
    
    -- Satellite Metadata
    satellite_source VARCHAR(100), -- 'Copernicus', 'NASA', 'Landsat', etc.
    image_date DATE,
    cloud_cover_percentage DECIMAL(5,2),
    image_quality_score DECIMAL(3,2),
    
    -- Data Processing
    processing_level VARCHAR(50),
    confidence_score DECIMAL(5,4),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    
    INDEX idx_satellite_location (location_hash),
    INDEX idx_satellite_coordinates (latitude, longitude),
    INDEX idx_image_date (image_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Soil analysis reports
CREATE TABLE soil_analysis_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    farm_id INT,
    testing_center_id INT,
    
    -- Sample Information
    sample_collection_date DATE NOT NULL,
    sample_location_description TEXT,
    sample_depth_cm INT DEFAULT 15,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Soil Properties
    soil_ph DECIMAL(3,2),
    electrical_conductivity DECIMAL(8,4), -- dS/m
    organic_carbon_percentage DECIMAL(5,2),
    organic_matter_percentage DECIMAL(5,2),
    
    -- Nutrients (all in kg/ha or ppm)
    nitrogen_available DECIMAL(8,2),
    phosphorus_available DECIMAL(8,2),
    potassium_available DECIMAL(8,2),
    sulfur_available DECIMAL(8,2),
    
    -- Micronutrients (ppm)
    zinc_ppm DECIMAL(6,2),
    iron_ppm DECIMAL(6,2),
    manganese_ppm DECIMAL(6,2),
    copper_ppm DECIMAL(6,2),
    boron_ppm DECIMAL(6,2),
    
    -- Physical Properties
    sand_percentage DECIMAL(5,2),
    silt_percentage DECIMAL(5,2),
    clay_percentage DECIMAL(5,2),
    soil_texture VARCHAR(50),
    
    -- Recommendations
    fertilizer_recommendations JSON,
    crop_suitability JSON,
    soil_health_score DECIMAL(5,2),
    improvement_suggestions JSON, -- Array of strings
    
    -- Report Metadata
    report_number VARCHAR(100),
    testing_method VARCHAR(100),
    lab_technician VARCHAR(100),
    report_status VARCHAR(50) DEFAULT 'completed',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (farm_id) REFERENCES user_farm_details(id),
    FOREIGN KEY (testing_center_id) REFERENCES soil_testing_centers(id),
    INDEX idx_user_soil_reports (user_id),
    INDEX idx_sample_date (sample_collection_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Emergency reports (SOS system)
CREATE TABLE emergency_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    emergency_id VARCHAR(36) UNIQUE NOT NULL DEFAULT (UUID()),
    user_id INT NOT NULL,
    farm_id INT,
    
    -- Emergency Details
    emergency_type VARCHAR(100) NOT NULL, -- 'pest_disease', 'weather_damage', 'equipment_failure', etc.
    severity_level VARCHAR(20) NOT NULL, -- 'low', 'medium', 'high', 'critical'
    emergency_title VARCHAR(200),
    description TEXT NOT NULL,
    
    -- Location
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    location_description TEXT,
    
    -- Affected Crop/Area
    affected_crop VARCHAR(100),
    affected_area_hectares DECIMAL(10,4),
    estimated_damage_percentage DECIMAL(5,2),
    
    -- Status Tracking
    status VARCHAR(50) DEFAULT 'reported', -- 'reported', 'acknowledged', 'in_progress', 'resolved'
    priority_score INT DEFAULT 50, -- 0-100
    
    -- Response
    recommended_actions JSON,
    expert_response TEXT,
    resources_provided JSON,
    resolution_summary TEXT,
    
    -- Timestamps
    reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    acknowledged_at TIMESTAMP NULL,
    resolved_at TIMESTAMP NULL,
    
    -- Contact Information
    contact_method VARCHAR(50), -- 'phone', 'app', 'field_visit'
    urgent_contact_needed BOOLEAN DEFAULT FALSE,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (farm_id) REFERENCES user_farm_details(id),
    INDEX idx_emergency_id (emergency_id),
    INDEX idx_user_emergencies (user_id),
    INDEX idx_emergency_type (emergency_type),
    INDEX idx_severity (severity_level),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Mandi (market) price data
CREATE TABLE mandi_price_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    -- Market Information
    mandi_name VARCHAR(200) NOT NULL,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    market_type VARCHAR(50), -- 'APMC', 'Private', 'Cooperative'
    
    -- Commodity Information
    commodity_name VARCHAR(100) NOT NULL,
    variety VARCHAR(100),
    grade VARCHAR(50), -- 'FAQ', 'A', 'B', etc.
    
    -- Price Information
    min_price DECIMAL(10,2) NOT NULL,
    max_price DECIMAL(10,2) NOT NULL,
    modal_price DECIMAL(10,2) NOT NULL,
    price_unit VARCHAR(20) DEFAULT 'per_quintal',
    
    -- Market Data
    arrival_quantity DECIMAL(12,2), -- in quintals
    traded_quantity DECIMAL(12,2),
    
    -- Date and Source
    price_date DATE NOT NULL,
    data_source VARCHAR(100) DEFAULT 'government_api',
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Quality Indicators
    price_trend VARCHAR(20), -- 'rising', 'falling', 'stable'
    market_activity VARCHAR(20), -- 'high', 'medium', 'low'
    
    INDEX idx_commodity_date (commodity_name, price_date),
    INDEX idx_mandi_location (state, district, mandi_name),
    INDEX idx_price_date (price_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Government scheme applications by users
CREATE TABLE government_scheme_applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    scheme_id INT,
    
    -- Application Details
    application_number VARCHAR(100) UNIQUE,
    application_date DATE DEFAULT (CURRENT_DATE),
    applied_amount DECIMAL(15,2),
    
    -- Status Tracking
    application_status VARCHAR(50) DEFAULT 'submitted', -- 'submitted', 'under_review', 'approved', 'rejected'
    review_comments TEXT,
    approved_amount DECIMAL(15,2),
    disbursement_date DATE,
    
    -- Documents
    documents_submitted JSON,
    additional_documents_required JSON, -- Array of strings
    
    -- Contact Information
    processing_officer VARCHAR(100),
    office_contact VARCHAR(100),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (scheme_id) REFERENCES government_schemes(id),
    INDEX idx_user_applications (user_id),
    INDEX idx_application_status (application_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Debt counseling sessions
CREATE TABLE debt_counseling_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    advisor_id INT,
    
    -- Session Details
    session_date DATE NOT NULL,
    session_time TIME NOT NULL,
    session_type VARCHAR(50) NOT NULL, -- 'In-Person', 'Video Call', 'Phone Call', 'Home Visit'
    duration_minutes INT DEFAULT 60,
    
    -- Financial Information
    total_debt_amount DECIMAL(15,2),
    monthly_income DECIMAL(10,2),
    monthly_expenses DECIMAL(10,2),
    debt_to_income_ratio DECIMAL(5,2),
    financial_health_score DECIMAL(5,2),
    
    -- Session Content
    consultation_topic VARCHAR(200),
    issues_discussed JSON, -- Array of strings
    advice_given TEXT,
    action_plan JSON,
    follow_up_required BOOLEAN DEFAULT FALSE,
    next_session_date DATE,
    
    -- Status and Feedback
    session_status VARCHAR(50) DEFAULT 'scheduled', -- 'scheduled', 'completed', 'cancelled', 'rescheduled'
    user_satisfaction_rating INT, -- 1-5 scale
    user_feedback TEXT,
    advisor_notes TEXT,
    
    -- Payment Information
    consultation_fee DECIMAL(8,2),
    payment_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'paid', 'waived'
    payment_method VARCHAR(50),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (advisor_id) REFERENCES financial_advisors(id),
    INDEX idx_user_sessions (user_id),
    INDEX idx_advisor_sessions (advisor_id),
    INDEX idx_session_date (session_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sustainable practices logging
CREATE TABLE sustainable_practices_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    farm_id INT,
    
    -- Practice Information
    practice_category VARCHAR(100) NOT NULL, -- 'water_conservation', 'soil_health', 'pest_management', etc.
    practice_name VARCHAR(200) NOT NULL,
    practice_description TEXT,
    
    -- Implementation Details
    implementation_date DATE NOT NULL,
    area_covered DECIMAL(10,4), -- in hectares
    resources_used JSON,
    cost_involved DECIMAL(10,2),
    
    -- Monitoring and Results
    monitoring_frequency VARCHAR(50), -- 'daily', 'weekly', 'monthly'
    expected_benefits JSON, -- Array of strings
    observed_benefits JSON, -- Array of strings
    challenges_faced JSON, -- Array of strings
    
    -- Impact Assessment
    water_saved_liters DECIMAL(12,2),
    carbon_footprint_reduction DECIMAL(8,2),
    cost_savings DECIMAL(10,2),
    yield_improvement_percentage DECIMAL(5,2),
    
    -- Status
    practice_status VARCHAR(50) DEFAULT 'active', -- 'active', 'completed', 'discontinued'
    effectiveness_rating INT, -- 1-5 scale
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (farm_id) REFERENCES user_farm_details(id),
    INDEX idx_user_practices (user_id),
    INDEX idx_practice_category (practice_category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 4. USER ENGAGEMENT AND FEEDBACK
-- =====================================================

-- User notifications
CREATE TABLE user_notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    
    -- Notification Content
    notification_type VARCHAR(100) NOT NULL, -- 'weather_alert', 'calendar_reminder', 'scheme_update', etc.
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    action_url TEXT,
    
    -- Targeting
    priority_level VARCHAR(20) DEFAULT 'medium', -- 'high', 'medium', 'low'
    category VARCHAR(100), -- 'emergency', 'reminder', 'information', 'promotion'
    
    -- Delivery
    delivery_method VARCHAR(50) DEFAULT 'app', -- 'app', 'email', 'sms', 'push'
    scheduled_for TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    delivered_at TIMESTAMP NULL,
    
    -- User Interaction
    read_at TIMESTAMP NULL,
    clicked_at TIMESTAMP NULL,
    dismissed_at TIMESTAMP NULL,
    
    -- Status
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'delivered', 'read', 'clicked', 'failed'
    retry_count INT DEFAULT 0,
    
    -- Metadata
    related_entity_type VARCHAR(100), -- 'crop_calendar', 'emergency', 'scheme', etc.
    related_entity_id INT,
    expires_at TIMESTAMP NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_notifications (user_id),
    INDEX idx_notification_type (notification_type),
    INDEX idx_status (status),
    INDEX idx_scheduled_delivery (scheduled_for)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User feedback and ratings
CREATE TABLE user_feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    
    -- Feedback Context
    feedback_type VARCHAR(100) NOT NULL, -- 'app_rating', 'feature_feedback', 'bug_report', 'suggestion'
    feature_name VARCHAR(100), -- 'crop_calendar', 'weather', 'emergency', etc.
    
    -- Feedback Content
    rating INT, -- 1-5 scale
    title VARCHAR(200),
    description TEXT,
    suggestions TEXT,
    
    -- Technical Information
    app_version VARCHAR(20),
    device_info JSON,
    screenshot_urls JSON, -- Array of strings
    
    -- Status and Response
    status VARCHAR(50) DEFAULT 'submitted', -- 'submitted', 'reviewed', 'addressed', 'closed'
    admin_response TEXT,
    resolution_summary TEXT,
    
    -- Metadata
    is_anonymous BOOLEAN DEFAULT FALSE,
    ip_address VARCHAR(45), -- IPv6 compatible
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_feedback (user_id),
    INDEX idx_feedback_type (feedback_type),
    INDEX idx_rating (rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 5. ADDITIONAL INDEXES FOR PERFORMANCE
-- =====================================================

-- Additional performance indexes
CREATE INDEX idx_users_active ON users(is_active);
CREATE INDEX idx_sessions_active ON user_sessions(is_active, expires_at);
CREATE INDEX idx_calendars_active ON crop_calendars(calendar_status, user_id);
CREATE INDEX idx_weather_location_time ON weather_data(location_hash, created_at);
CREATE INDEX idx_satellite_location_time ON satellite_data(location_hash, image_date);

-- Composite indexes for common queries
CREATE INDEX idx_user_farm_location ON user_farm_details(user_id, state, district);
CREATE INDEX idx_emergency_location_time ON emergency_reports(latitude, longitude, reported_at);
CREATE INDEX idx_mandi_commodity_location ON mandi_price_data(commodity_name, state, district, price_date);

-- =====================================================
-- 6. SAMPLE DATA INSERTION
-- =====================================================

-- Insert sample languages
INSERT INTO languages (code, name, native_name) VALUES
('en', 'English', 'English'),
('hi', 'Hindi', 'हिन्दी'),
('te', 'Telugu', 'తెలుగు'),
('ta', 'Tamil', 'தமிழ்'),
('kn', 'Kannada', 'ಕನ್ನಡ'),
('mr', 'Marathi', 'मराठी'),
('gu', 'Gujarati', 'ગુજરાતી'),
('pa', 'Punjabi', 'ਪੰਜਾਬੀ'),
('bn', 'Bengali', 'বাংলা'),
('or', 'Odia', 'ଓଡ଼ିଆ');

-- Insert sample regions (major agricultural states in India)
INSERT INTO regions (state, district, latitude, longitude) VALUES
('Maharashtra', 'Pune', 18.5204, 73.8567),
('Maharashtra', 'Nashik', 19.9975, 73.7898),
('Andhra Pradesh', 'Krishna', 16.2160, 81.1496),
('Andhra Pradesh', 'Guntur', 16.3067, 80.4365),
('Punjab', 'Ludhiana', 30.9000, 75.8573),
('Punjab', 'Amritsar', 31.6340, 74.8723),
('Haryana', 'Karnal', 29.6857, 76.9905),
('Haryana', 'Hisar', 29.1492, 75.7217),
('Uttar Pradesh', 'Meerut', 28.9845, 77.7064),
('Uttar Pradesh', 'Agra', 27.1767, 78.0081),
('Karnataka', 'Mysuru', 12.2958, 76.6394),
('Karnataka', 'Bengaluru Rural', 13.2846, 77.6211),
('Tamil Nadu', 'Coimbatore', 11.0168, 76.9558),
('Tamil Nadu', 'Thanjavur', 10.7905, 79.1378),
('Rajasthan', 'Jodhpur', 26.2389, 73.0243),
('Rajasthan', 'Kota', 25.2138, 75.8648);

-- Insert sample crops (JSON format for MySQL)
INSERT INTO supported_crops (
    name, scientific_name, category, description, aliases, growing_period_days, difficulty_level,
    planting_seasons, min_temperature, max_temperature, optimal_temperature,
    min_soil_moisture, max_soil_moisture, optimal_soil_moisture,
    min_soil_ph, max_soil_ph, optimal_soil_ph,
    growth_stages, expected_yield_per_hectare, water_requirement_per_week
) VALUES
(
    'wheat', 'Triticum aestivum', 'Cereal', 'A widely grown cereal grain and staple food crop',
    '["winter wheat", "spring wheat"]', 120, 'Medium',
    '{"northern": [{"start": 10, "end": 12, "type": "winter"}, {"start": 3, "end": 4, "type": "spring"}], "southern": [{"start": 4, "end": 6, "type": "winter"}, {"start": 9, "end": 10, "type": "spring"}]}',
    3, 32, 20, 60, 90, 75, 6.0, 7.5, 6.5,
    '[{"name": "Germination", "duration": 7, "description": "Seed sprouting and initial root development"}, {"name": "Tillering", "duration": 30, "description": "Multiple shoots development"}, {"name": "Stem elongation", "duration": 25, "description": "Vertical growth and node formation"}, {"name": "Booting", "duration": 14, "description": "Head formation inside leaf sheath"}, {"name": "Heading", "duration": 10, "description": "Head emergence from leaf sheath"}, {"name": "Grain filling", "duration": 34, "description": "Grain development and maturation"}]',
    4.5, 25
),
(
    'rice', 'Oryza sativa', 'Cereal', 'Major cereal grain and staple food for over half of the world population',
    '["paddy rice", "asian rice"]', 95, 'Hard',
    '{"northern": [{"start": 5, "end": 7, "type": "kharif"}, {"start": 11, "end": 1, "type": "rabi"}], "southern": [{"start": 11, "end": 1, "type": "dry season"}, {"start": 5, "end": 7, "type": "wet season"}]}',
    16, 35, 25, 80, 100, 95, 5.5, 7.0, 6.0,
    '[{"name": "Nursery", "duration": 21, "description": "Seedling preparation in nursery beds"}, {"name": "Transplanting", "duration": 7, "description": "Moving seedlings to main field"}, {"name": "Vegetative growth", "duration": 35, "description": "Tillering and leaf development"}, {"name": "Reproductive growth", "duration": 21, "description": "Panicle initiation and flowering"}, {"name": "Ripening", "duration": 25, "description": "Grain filling and maturation"}]',
    6.0, 150
),
(
    'maize', 'Zea mays', 'Cereal', 'Versatile cereal grain used for food, feed, and industrial purposes',
    '["corn", "sweet corn"]', 85, 'Easy',
    '{"northern": [{"start": 4, "end": 6, "type": "spring"}, {"start": 7, "end": 8, "type": "summer"}], "southern": [{"start": 10, "end": 12, "type": "post-monsoon"}, {"start": 2, "end": 3, "type": "summer"}]}',
    18, 35, 26, 50, 80, 65, 6.0, 7.5, 6.8,
    '[{"name": "Germination", "duration": 5, "description": "Seed sprouting and emergence"}, {"name": "Vegetative growth", "duration": 45, "description": "Leaf and stem development"}, {"name": "Tasseling", "duration": 10, "description": "Male flower development"}, {"name": "Silking", "duration": 5, "description": "Female flower emergence"}, {"name": "Grain filling", "duration": 20, "description": "Kernel development and maturation"}]',
    8.5, 35
),
(
    'tomato', 'Solanum lycopersicum', 'Vegetable', 'Popular fruit vegetable grown worldwide',
    '["tomatoes", "love apple"]', 75, 'Medium',
    '{"northern": [{"start": 3, "end": 5, "type": "spring"}, {"start": 7, "end": 8, "type": "summer"}], "southern": [{"start": 9, "end": 11, "type": "spring"}, {"start": 1, "end": 2, "type": "winter"}]}',
    15, 35, 25, 60, 85, 70, 6.0, 7.0, 6.5,
    '[{"name": "Germination", "duration": 7, "description": "Seed sprouting and initial growth"}, {"name": "Vegetative growth", "duration": 28, "description": "Leaf and stem development"}, {"name": "Flowering", "duration": 14, "description": "Flower formation and pollination"}, {"name": "Fruit development", "duration": 21, "description": "Fruit growth and color development"}, {"name": "Harvest", "duration": 14, "description": "Continuous harvesting period"}]',
    25.0, 40
),
(
    'potato', 'Solanum tuberosum', 'Vegetable', 'Starchy tuber crop, fourth largest food crop worldwide',
    '["potatoes", "aloo"]', 90, 'Medium',
    '{"northern": [{"start": 10, "end": 12, "type": "rabi"}, {"start": 1, "end": 2, "type": "late rabi"}], "southern": [{"start": 11, "end": 1, "type": "winter"}, {"start": 9, "end": 10, "type": "pre-winter"}]}',
    15, 25, 20, 70, 90, 80, 5.5, 6.5, 6.0,
    '[{"name": "Germination", "duration": 10, "description": "Sprouting and initial shoot emergence"}, {"name": "Vegetative growth", "duration": 35, "description": "Leaf and stem development"}, {"name": "Tuber initiation", "duration": 14, "description": "Underground tuber formation begins"}, {"name": "Tuber bulking", "duration": 21, "description": "Rapid tuber growth and starch accumulation"}, {"name": "Maturation", "duration": 10, "description": "Tuber maturation and skin formation"}]',
    22.0, 30
);

-- =====================================================
-- 7. CLEANUP FUNCTIONS AND PROCEDURES
-- =====================================================

-- Function to cleanup expired sessions (MySQL Stored Procedure)
DELIMITER //
CREATE PROCEDURE CleanupExpiredSessions()
BEGIN
    DECLARE deleted_count INT DEFAULT 0;
    
    DELETE FROM user_sessions WHERE expires_at < NOW();
    
    SELECT ROW_COUNT() AS sessions_deleted;
END //
DELIMITER ;

-- Function to cleanup expired weather data
DELIMITER //
CREATE PROCEDURE CleanupExpiredWeatherData()
BEGIN
    DELETE FROM weather_data WHERE expires_at < NOW();
    SELECT ROW_COUNT() AS weather_records_deleted;
END //
DELIMITER ;

-- Function to cleanup expired satellite data
DELIMITER //
CREATE PROCEDURE CleanupExpiredSatelliteData()
BEGIN
    DELETE FROM satellite_data WHERE expires_at < NOW();
    SELECT ROW_COUNT() AS satellite_records_deleted;
END //
DELIMITER ;

-- =====================================================
-- 8. VIEWS FOR COMMON QUERIES
-- =====================================================

-- User profile view with farm details
CREATE VIEW user_profiles AS
SELECT 
    u.id,
    u.user_id,
    u.first_name,
    u.last_name,
    u.email,
    u.phone_number,
    u.farming_experience_years,
    l.name as preferred_language,
    u.is_verified,
    u.last_login_at,
    u.created_at,
    COUNT(ufd.id) as total_farms,
    SUM(ufd.total_farm_size) as total_farm_area
FROM users u
LEFT JOIN languages l ON u.preferred_language_id = l.id
LEFT JOIN user_farm_details ufd ON u.id = ufd.user_id AND ufd.is_active = TRUE
WHERE u.is_active = TRUE
GROUP BY u.id, l.name;

-- Active crop calendars view
CREATE VIEW active_crop_calendars AS
SELECT 
    cc.id,
    cc.calendar_id,
    CONCAT(u.first_name, ' ', COALESCE(u.last_name, '')) as farmer_name,
    sc.name as crop_name,
    cc.planned_area,
    cc.planting_date,
    cc.expected_harvest_date,
    cc.current_growth_stage,
    cc.progress_percentage,
    cc.calendar_status,
    ufd.state,
    ufd.district,
    cc.created_at
FROM crop_calendars cc
JOIN users u ON cc.user_id = u.id
JOIN supported_crops sc ON cc.crop_id = sc.id
JOIN user_farm_details ufd ON cc.farm_id = ufd.id
WHERE cc.calendar_status = 'active'
ORDER BY cc.planting_date DESC;

-- Emergency alerts view
CREATE VIEW emergency_alerts AS
SELECT 
    er.id,
    er.emergency_id,
    CONCAT(u.first_name, ' ', COALESCE(u.last_name, '')) as farmer_name,
    u.phone_number,
    er.emergency_type,
    er.severity_level,
    er.description,
    er.latitude,
    er.longitude,
    ufd.state,
    ufd.district,
    er.status,
    er.reported_at,
    CASE 
        WHEN er.severity_level = 'critical' THEN 100
        WHEN er.severity_level = 'high' THEN 75
        WHEN er.severity_level = 'medium' THEN 50
        ELSE 25
    END as priority_score
FROM emergency_reports er
JOIN users u ON er.user_id = u.id
LEFT JOIN user_farm_details ufd ON er.farm_id = ufd.id
WHERE er.status IN ('reported', 'acknowledged', 'in_progress')
ORDER BY priority_score DESC, er.reported_at ASC;

-- =====================================================
-- 9. EVENT SCHEDULER FOR AUTOMATIC CLEANUP
-- =====================================================


-- Schedule session cleanup every hour
CREATE EVENT IF NOT EXISTS cleanup_sessions_hourly
ON SCHEDULE EVERY 1 HOUR
DO
  CALL CleanupExpiredSessions();

-- Schedule weather data cleanup daily
CREATE EVENT IF NOT EXISTS cleanup_weather_daily
ON SCHEDULE EVERY 1 DAY
DO
  CALL CleanupExpiredWeatherData();

-- Schedule satellite data cleanup weekly
CREATE EVENT IF NOT EXISTS cleanup_satellite_weekly
ON SCHEDULE EVERY 1 WEEK
DO
  CALL CleanupExpiredSatelliteData();

-- =====================================================
-- 10. FINAL COMMENTS AND OPTIMIZATION NOTES
-- =====================================================

-- Performance optimization notes:
-- 1. Consider partitioning large tables (weather_data, satellite_data) by date
-- 2. Use MySQL's built-in event scheduler for regular cleanup
-- 3. Optimize JSON columns with virtual columns for frequently queried fields
-- 4. Use connection pooling for high-traffic applications
-- 5. Consider read replicas for reporting queries

-- Security considerations:
-- 1. All passwords should be hashed using bcrypt or similar
-- 2. Session tokens should be cryptographically secure
-- 3. Implement rate limiting on authentication endpoints
-- 4. Use HTTPS in production
-- 5. Regular security audits of user data access

-- Data retention policies:
-- 1. Session data: 30 days (enforced by expires_at)
-- 2. Weather data: 1 year
-- 3. Satellite data: 2 years
-- 4. User activity logs: 3 years
-- 5. Financial records: 7 years (as per regulations)

-- MySQL specific optimizations:
-- 1. Use InnoDB engine for ACID compliance and foreign keys
-- 2. UTF8MB4 character set for full Unicode support including emojis
-- 3. JSON data type for flexible schema design
-- 4. Virtual columns can be added for computed fields from JSON
-- 5. Full-text search indexes can be added for text fields

COMMIT;
