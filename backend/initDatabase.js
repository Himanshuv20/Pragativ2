const { sequelize } = require('./config/database');
const { User, Language, Region, SupportedCrop, UserFarmDetails, UserSession } = require('./models');
const { CropCalendar, WeatherData, SatelliteData, EmergencyReport } = require('./models/applicationModels');

// Initialize database and create tables
async function initializeDatabase() {
  try {
    console.log('🔄 Initializing database...');

    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection established');

    // Sync all models (create tables)
    await sequelize.sync({ alter: true }); // Use { force: true } to drop and recreate tables
    console.log('✅ Database tables synchronized');

    // Seed initial data
    await seedInitialData();
    
    console.log('✅ Database initialization completed');
    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    return false;
  }
}

// Seed initial data
async function seedInitialData() {
  try {
    console.log('🌱 Seeding initial data...');

    // Seed languages
    await seedLanguages();
    
    // Seed regions
    await seedRegions();
    
    // Seed supported crops
    await seedSupportedCrops();
    
    console.log('✅ Initial data seeded successfully');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
}

// Seed languages
async function seedLanguages() {
  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
    { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
    { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
    { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' }
  ];

  for (const lang of languages) {
    await Language.findOrCreate({
      where: { code: lang.code },
      defaults: lang
    });
  }
  console.log('✅ Languages seeded');
}

// Seed regions
async function seedRegions() {
  const regions = [
    { state: 'Maharashtra', district: 'Pune', latitude: 18.5204, longitude: 73.8567 },
    { state: 'Maharashtra', district: 'Nashik', latitude: 19.9975, longitude: 73.7898 },
    { state: 'Andhra Pradesh', district: 'Krishna', latitude: 16.2160, longitude: 81.1496 },
    { state: 'Andhra Pradesh', district: 'Guntur', latitude: 16.3067, longitude: 80.4365 },
    { state: 'Punjab', district: 'Ludhiana', latitude: 30.9000, longitude: 75.8573 },
    { state: 'Punjab', district: 'Amritsar', latitude: 31.6340, longitude: 74.8723 },
    { state: 'Haryana', district: 'Karnal', latitude: 29.6857, longitude: 76.9905 },
    { state: 'Haryana', district: 'Hisar', latitude: 29.1492, longitude: 75.7217 },
    { state: 'Uttar Pradesh', district: 'Meerut', latitude: 28.9845, longitude: 77.7064 },
    { state: 'Uttar Pradesh', district: 'Agra', latitude: 27.1767, longitude: 78.0081 },
    { state: 'Karnataka', district: 'Mysuru', latitude: 12.2958, longitude: 76.6394 },
    { state: 'Karnataka', district: 'Bengaluru Rural', latitude: 13.2846, longitude: 77.6211 },
    { state: 'Tamil Nadu', district: 'Coimbatore', latitude: 11.0168, longitude: 76.9558 },
    { state: 'Tamil Nadu', district: 'Thanjavur', latitude: 10.7905, longitude: 79.1378 },
    { state: 'Rajasthan', district: 'Jodhpur', latitude: 26.2389, longitude: 73.0243 },
    { state: 'Rajasthan', district: 'Kota', latitude: 25.2138, longitude: 75.8648 }
  ];

  for (const region of regions) {
    await Region.findOrCreate({
      where: { state: region.state, district: region.district },
      defaults: region
    });
  }
  console.log('✅ Regions seeded');
}

// Seed supported crops
async function seedSupportedCrops() {
  const crops = [
    {
      name: 'wheat',
      scientificName: 'Triticum aestivum',
      category: 'Cereal',
      description: 'A widely grown cereal grain and staple food crop',
      aliases: ['winter wheat', 'spring wheat'],
      growingPeriodDays: 120,
      difficultyLevel: 'Medium',
      plantingSeasons: {
        northern: [
          { start: 10, end: 12, type: 'winter' },
          { start: 3, end: 4, type: 'spring' }
        ],
        southern: [
          { start: 4, end: 6, type: 'winter' },
          { start: 9, end: 10, type: 'spring' }
        ]
      },
      minTemperature: 3,
      maxTemperature: 32,
      optimalTemperature: 20,
      minSoilMoisture: 60,
      maxSoilMoisture: 90,
      optimalSoilMoisture: 75,
      minSoilPh: 6.0,
      maxSoilPh: 7.5,
      optimalSoilPh: 6.5,
      growthStages: [
        { name: 'Germination', duration: 7, description: 'Seed sprouting and initial root development' },
        { name: 'Tillering', duration: 30, description: 'Multiple shoots development' },
        { name: 'Stem elongation', duration: 25, description: 'Vertical growth and node formation' },
        { name: 'Booting', duration: 14, description: 'Head formation inside leaf sheath' },
        { name: 'Heading', duration: 10, description: 'Head emergence from leaf sheath' },
        { name: 'Grain filling', duration: 34, description: 'Grain development and maturation' }
      ],
      expectedYieldPerHectare: 4.5,
      waterRequirementPerWeek: 25
    },
    {
      name: 'rice',
      scientificName: 'Oryza sativa',
      category: 'Cereal',
      description: 'Major cereal grain and staple food for over half of the world population',
      aliases: ['paddy rice', 'asian rice'],
      growingPeriodDays: 95,
      difficultyLevel: 'Hard',
      plantingSeasons: {
        northern: [
          { start: 5, end: 7, type: 'kharif' },
          { start: 11, end: 1, type: 'rabi' }
        ],
        southern: [
          { start: 11, end: 1, type: 'dry season' },
          { start: 5, end: 7, type: 'wet season' }
        ]
      },
      minTemperature: 16,
      maxTemperature: 35,
      optimalTemperature: 25,
      minSoilMoisture: 80,
      maxSoilMoisture: 100,
      optimalSoilMoisture: 95,
      minSoilPh: 5.5,
      maxSoilPh: 7.0,
      optimalSoilPh: 6.0,
      growthStages: [
        { name: 'Nursery', duration: 21, description: 'Seedling preparation in nursery beds' },
        { name: 'Transplanting', duration: 7, description: 'Moving seedlings to main field' },
        { name: 'Vegetative growth', duration: 35, description: 'Tillering and leaf development' },
        { name: 'Reproductive growth', duration: 21, description: 'Panicle initiation and flowering' },
        { name: 'Ripening', duration: 25, description: 'Grain filling and maturation' }
      ],
      expectedYieldPerHectare: 6.0,
      waterRequirementPerWeek: 150
    },
    {
      name: 'maize',
      scientificName: 'Zea mays',
      category: 'Cereal',
      description: 'Versatile cereal grain used for food, feed, and industrial purposes',
      aliases: ['corn', 'sweet corn'],
      growingPeriodDays: 85,
      difficultyLevel: 'Easy',
      plantingSeasons: {
        northern: [
          { start: 4, end: 6, type: 'spring' },
          { start: 7, end: 8, type: 'summer' }
        ],
        southern: [
          { start: 10, end: 12, type: 'post-monsoon' },
          { start: 2, end: 3, type: 'summer' }
        ]
      },
      minTemperature: 18,
      maxTemperature: 35,
      optimalTemperature: 26,
      minSoilMoisture: 50,
      maxSoilMoisture: 80,
      optimalSoilMoisture: 65,
      minSoilPh: 6.0,
      maxSoilPh: 7.5,
      optimalSoilPh: 6.8,
      growthStages: [
        { name: 'Germination', duration: 5, description: 'Seed sprouting and emergence' },
        { name: 'Vegetative growth', duration: 45, description: 'Leaf and stem development' },
        { name: 'Tasseling', duration: 10, description: 'Male flower development' },
        { name: 'Silking', duration: 5, description: 'Female flower emergence' },
        { name: 'Grain filling', duration: 20, description: 'Kernel development and maturation' }
      ],
      expectedYieldPerHectare: 8.5,
      waterRequirementPerWeek: 35
    },
    {
      name: 'tomato',
      scientificName: 'Solanum lycopersicum',
      category: 'Vegetable',
      description: 'Popular fruit vegetable grown worldwide',
      aliases: ['tomatoes', 'love apple'],
      growingPeriodDays: 75,
      difficultyLevel: 'Medium',
      plantingSeasons: {
        northern: [
          { start: 3, end: 5, type: 'spring' },
          { start: 7, end: 8, type: 'summer' }
        ],
        southern: [
          { start: 9, end: 11, type: 'spring' },
          { start: 1, end: 2, type: 'winter' }
        ]
      },
      minTemperature: 15,
      maxTemperature: 35,
      optimalTemperature: 25,
      minSoilMoisture: 60,
      maxSoilMoisture: 85,
      optimalSoilMoisture: 70,
      minSoilPh: 6.0,
      maxSoilPh: 7.0,
      optimalSoilPh: 6.5,
      growthStages: [
        { name: 'Germination', duration: 7, description: 'Seed sprouting and initial growth' },
        { name: 'Vegetative growth', duration: 28, description: 'Leaf and stem development' },
        { name: 'Flowering', duration: 14, description: 'Flower formation and pollination' },
        { name: 'Fruit development', duration: 21, description: 'Fruit growth and color development' },
        { name: 'Harvest', duration: 14, description: 'Continuous harvesting period' }
      ],
      expectedYieldPerHectare: 25.0,
      waterRequirementPerWeek: 40
    },
    {
      name: 'potato',
      scientificName: 'Solanum tuberosum',
      category: 'Vegetable',
      description: 'Starchy tuber crop, fourth largest food crop worldwide',
      aliases: ['potatoes', 'aloo'],
      growingPeriodDays: 90,
      difficultyLevel: 'Medium',
      plantingSeasons: {
        northern: [
          { start: 10, end: 12, type: 'rabi' },
          { start: 1, end: 2, type: 'late rabi' }
        ],
        southern: [
          { start: 11, end: 1, type: 'winter' },
          { start: 9, end: 10, type: 'pre-winter' }
        ]
      },
      minTemperature: 15,
      maxTemperature: 25,
      optimalTemperature: 20,
      minSoilMoisture: 70,
      maxSoilMoisture: 90,
      optimalSoilMoisture: 80,
      minSoilPh: 5.5,
      maxSoilPh: 6.5,
      optimalSoilPh: 6.0,
      growthStages: [
        { name: 'Germination', duration: 10, description: 'Sprouting and initial shoot emergence' },
        { name: 'Vegetative growth', duration: 35, description: 'Leaf and stem development' },
        { name: 'Tuber initiation', duration: 14, description: 'Underground tuber formation begins' },
        { name: 'Tuber bulking', duration: 21, description: 'Rapid tuber growth and starch accumulation' },
        { name: 'Maturation', duration: 10, description: 'Tuber maturation and skin formation' }
      ],
      expectedYieldPerHectare: 22.0,
      waterRequirementPerWeek: 30
    }
  ];

  for (const crop of crops) {
    await SupportedCrop.findOrCreate({
      where: { name: crop.name },
      defaults: crop
    });
  }
  console.log('✅ Supported crops seeded');
}

module.exports = {
  initializeDatabase,
  seedInitialData
};
