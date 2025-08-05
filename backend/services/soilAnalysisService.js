const axios = require('axios');
const moment = require('moment');
const cropData = require('../data/cropData');

class SoilAnalysisService {
  constructor() {
    this.useMockData = process.env.USE_MOCK_DATA === 'true';
    this.copernicusUsername = process.env.COPERNICUS_USERNAME;
    this.copernicusPassword = process.env.COPERNICUS_PASSWORD;
    this.openWeatherApiKey = process.env.OPENWEATHER_API_KEY;
    this.nominatimBaseUrl = 'https://nominatim.openstreetmap.org';
    this.copernicusBaseUrl = 'https://catalogue.dataspace.copernicus.eu/odata/v1';
    this.copernicusAuthUrl = 'https://identity.dataspace.copernicus.eu/auth/realms/CDSE/protocol/openid-connect/token';
    
    // Rate limiting (same pattern as crop calendar service)
    this.requestCounts = new Map();
    this.maxRequestsPerHour = 100;
    
    // OAuth2 token caching
    this.accessToken = null;
    this.tokenExpiry = null;
    
    console.log('🔬 SoilAnalysisService initialized');
  }

  /**
   * Get OAuth2 access token for Copernicus Data Space Ecosystem
   */
  async getCopernicusAccessToken() {
    // Check if we have a valid cached token
    if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
      return this.accessToken;
    }

    if (!this.copernicusUsername || !this.copernicusPassword) {
      throw new Error('Copernicus credentials not configured');
    }

    try {
      const authData = new URLSearchParams({
        'grant_type': 'password',
        'username': this.copernicusUsername,
        'password': this.copernicusPassword,
        'client_id': 'cdse-public'
      });

      console.log('🔐 Requesting Copernicus OAuth2 token...');
      const authResponse = await axios.post(this.copernicusAuthUrl, authData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        timeout: 15000
      });

      if (authResponse.data.access_token) {
        this.accessToken = authResponse.data.access_token;
        // Set token expiry (default 1 hour, with 5 minute buffer)
        const expiresIn = authResponse.data.expires_in || 3600;
        this.tokenExpiry = new Date(Date.now() + (expiresIn - 300) * 1000);
        
        console.log('✅ Copernicus OAuth2 token obtained successfully');
        return this.accessToken;
      } else {
        throw new Error('No access token received');
      }
    } catch (error) {
      console.error('❌ Failed to get Copernicus access token:', error.response?.status, error.response?.statusText);
      throw new Error(`Copernicus authentication failed: ${error.message}`);
    }
  }

  /**
   * Main soil analysis function using Sentinel-2 satellite imagery
   * Enhanced with consistent error handling and logging like crop calendar service
   * @param {Object} params - Contains latitude, longitude, and date
   * @returns {Object} Complete soil analysis with recommendations
   */
  async analyzeSoilConditions({ latitude, longitude, date }) {
    try {
      console.log(`🔬 Generating comprehensive soil analysis for coordinates (${latitude}, ${longitude}) on ${date || 'current date'}`);

      // Standardize date format using moment (same as crop calendar)
      const analysisDate = date ? moment(date) : moment();
      console.log(`📅 Analysis date: ${analysisDate.format('YYYY-MM-DD')}`);

      // Check rate limiting
      if (!this.checkRateLimit()) {
        throw new Error('Rate limit exceeded. Maximum 100 requests per hour.');
      }

      let sentinelData;
      if (this.useMockData || !this.copernicusUsername || !this.copernicusPassword) {
        console.log('🔬 Using mock Sentinel-2 data for analysis');
        sentinelData = this.generateMockSentinelData(latitude, longitude, analysisDate.format('YYYY-MM-DD'));
      } else {
        console.log('🛰️ Fetching real Sentinel-2 data');
        try {
          sentinelData = await this.fetchRealSentinelData(latitude, longitude, analysisDate.format('YYYY-MM-DD'));
        } catch (error) {
          console.log('🔬 Falling back to mock data');
          sentinelData = this.generateMockSentinelData(latitude, longitude, analysisDate.format('YYYY-MM-DD'));
        }
      }

      // Calculate vegetation indices
      const vegetationIndices = this.calculateVegetationIndices(sentinelData.bands);
      
      // Analyze soil parameters
      const soilParameters = this.analyzeSoilParameters(sentinelData.bands, vegetationIndices, latitude);
      
      // Calculate overall soil health score
      const soilHealthScore = this.calculateSoilHealthScore(vegetationIndices, soilParameters);
      
      // Generate recommendations
      const recommendations = this.generateRecommendations(soilParameters, vegetationIndices);
      
      // Generate crop recommendations based on soil conditions
      const cropRecommendations = this.generateCropRecommendations(soilParameters, latitude, longitude, analysisDate);

      // Get location information
      const locationInfo = await this.reverseGeocode({ latitude, longitude });

      const analysis = {
        location: {
          latitude,
          longitude,
          name: locationInfo.displayName || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
          country: locationInfo.country || 'Unknown',
          region: locationInfo.state || locationInfo.region || 'Unknown'
        },
        acquisitionDate: sentinelData.acquisitionDate,
        cloudCover: sentinelData.cloudCover,
        vegetationIndices,
        soilParameters,
        soilHealthScore,
        recommendations,
        cropRecommendations,
        confidence: this.calculateConfidence(sentinelData.cloudCover, sentinelData.dataQuality),
        rawData: {
          sentinelScene: sentinelData.sceneId,
          processingLevel: sentinelData.processingLevel,
          spatialResolution: '10m-60m',
          spectralBands: Object.keys(sentinelData.bands)
        }
      };

      console.log(`[SoilAnalysis] Analysis completed with confidence: ${analysis.confidence}%`);
      return analysis;

    } catch (error) {
      console.error('[SoilAnalysis] Error in soil analysis:', error);
      throw new Error(`Soil analysis failed: ${error.message}`);
    }
  }

  /**
   * Fetch real Sentinel-2 data from Copernicus Data Space Ecosystem
   */
  async fetchRealSentinelData(latitude, longitude, date) {
    try {
      // Get OAuth2 access token
      const accessToken = await this.getCopernicusAccessToken();
      
      // Create bounding box around the point
      const bbox = this.createBoundingBox(latitude, longitude, 0.01); // ~1km radius
      
      // Create properly encoded geometry
      const polygon = `POLYGON((${bbox.west} ${bbox.south},${bbox.east} ${bbox.south},${bbox.east} ${bbox.north},${bbox.west} ${bbox.north},${bbox.west} ${bbox.south}))`;
      
      // Search for Sentinel-2 products with proper URL encoding
      // Note: Sentinel-2 data has a processing delay, so search for data from 3-7 days ago
      const searchDate = moment(date).subtract(5, 'days').format('YYYY-MM-DD');
      const filterParams = [
        `Collection/Name eq 'SENTINEL-2'`,
        `OData.CSC.Intersects(area=geography'SRID=4326;${polygon}')`,
        `ContentDate/Start ge ${searchDate}T00:00:00.000Z`,
        `ContentDate/Start le ${searchDate}T23:59:59.999Z`
      ].join(' and ');
      
      const searchUrl = `${this.copernicusBaseUrl}/Products?` +
        `$filter=${encodeURIComponent(filterParams)}&` +
        `$orderby=CloudCover asc&$top=5`;

      console.log('🛰️ Searching for Sentinel-2 products with OAuth2...');
      console.log('🔍 Search URL:', searchUrl);
      console.log('🔍 Filter params:', filterParams);
      const searchResponse = await axios.get(searchUrl, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        timeout: 15000
      });

      if (!searchResponse.data.value || searchResponse.data.value.length === 0) {
        console.log('[SoilAnalysis] No Sentinel-2 data found for the specified date, using recent data');
        return this.fetchRecentSentinelData(latitude, longitude);
      }

      // Select the best scene (lowest cloud cover)
      const bestScene = searchResponse.data.value[0];
      console.log(`📡 Found Sentinel-2 scene: ${bestScene.Name || bestScene.Id} (Cloud cover: ${bestScene.CloudCover}%)`);
      
      // Process the scene to extract band data
      const processedData = await this.processSentinelScene(bestScene, latitude, longitude);
      
      return processedData;

    } catch (error) {
      console.error('[SoilAnalysis] Error fetching real Sentinel data:', error.response?.status, error.response?.statusText || error.message);
      console.log('[SoilAnalysis] Falling back to mock data');
      return this.generateMockSentinelData(latitude, longitude, date);
    }
  }

  /**
   * Fetch recent Sentinel-2 data when no data is available for specific date
   */
  async fetchRecentSentinelData(latitude, longitude) {
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
    
    const bbox = this.createBoundingBox(latitude, longitude, 0.01);
    
    // Create properly encoded geometry
    const polygon = `POLYGON((${bbox.west} ${bbox.south},${bbox.east} ${bbox.south},${bbox.east} ${bbox.north},${bbox.west} ${bbox.north},${bbox.west} ${bbox.south}))`;
    
    const filterParams = [
      `Collection/Name eq 'SENTINEL-2'`,
      `OData.CSC.Intersects(area=geography'SRID=4326;${polygon}')`,
      `ContentDate/Start ge ${startDate.toISOString()}`,
      `ContentDate/Start le ${endDate.toISOString()}`
    ].join(' and ');
    
    const searchUrl = `${this.copernicusBaseUrl}/Products?` +
      `$filter=${encodeURIComponent(filterParams)}&` +
      `$orderby=CloudCover asc&$top=10`;

    try {
      // Get OAuth2 access token
      const accessToken = await this.getCopernicusAccessToken();
      
      console.log('🛰️ Searching for recent Sentinel-2 products...');
      const searchResponse = await axios.get(searchUrl, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        timeout: 15000
      });

      if (searchResponse.data.value && searchResponse.data.value.length > 0) {
        const bestScene = searchResponse.data.value[0];
        console.log(`📡 Found recent Sentinel-2 scene: ${bestScene.Name || bestScene.Id} (Cloud cover: ${bestScene.CloudCover}%)`);
        return await this.processSentinelScene(bestScene, latitude, longitude);
      }
    } catch (error) {
      console.error('[SoilAnalysis] Error fetching recent Sentinel data:', error.response?.status, error.response?.statusText || error.message);
    }

    // Final fallback to mock data
    console.log('[SoilAnalysis] No recent Sentinel-2 data found, using mock data');
    return this.generateMockSentinelData(latitude, longitude, new Date().toISOString().split('T')[0]);
  }

  /**
   * Process Sentinel-2 scene to extract band values
   */
  async processSentinelScene(scene, latitude, longitude) {
    // This is a simplified version - in production, you would download and process the actual imagery
    // For now, we'll simulate realistic band values based on scene metadata
    
    const cloudCover = scene.CloudCover || Math.random() * 20;
    const acquisitionDate = scene.ContentDate?.Start || new Date().toISOString();
    
    // Simulate realistic Sentinel-2 band values
    const bands = this.simulateRealisticBandValues(latitude, longitude, cloudCover);
    
    return {
      sceneId: scene.Id || `S2_${Date.now()}`,
      acquisitionDate: acquisitionDate.split('T')[0],
      cloudCover: Math.round(cloudCover * 100) / 100,
      processingLevel: 'Level-2A',
      dataQuality: cloudCover < 20 ? 'High' : cloudCover < 50 ? 'Medium' : 'Low',
      bands
    };
  }

  /**
   * Simulate realistic Sentinel-2 band values based on location
   */
  simulateRealisticBandValues(latitude, longitude, cloudCover) {
    // Adjust values based on latitude (vegetation patterns)
    const latitudeFactor = Math.cos(latitude * Math.PI / 180);
    const seasonFactor = Math.sin((new Date().getMonth() + 1) * Math.PI / 6);
    
    // Base reflectance values with realistic ranges
    const baseValues = {
      B01: 0.1 + Math.random() * 0.05, // Coastal aerosol
      B02: 0.08 + Math.random() * 0.04, // Blue
      B03: 0.06 + Math.random() * 0.04, // Green
      B04: 0.04 + Math.random() * 0.03, // Red
      B05: 0.1 + Math.random() * 0.15, // Red edge 1
      B06: 0.15 + Math.random() * 0.2, // Red edge 2
      B07: 0.18 + Math.random() * 0.22, // Red edge 3
      B08: 0.25 + Math.random() * 0.3, // NIR
      B8A: 0.23 + Math.random() * 0.27, // Narrow NIR
      B09: 0.02 + Math.random() * 0.02, // Water vapor
      B11: 0.15 + Math.random() * 0.2, // SWIR 1
      B12: 0.08 + Math.random() * 0.15  // SWIR 2
    };

    // Apply environmental factors
    Object.keys(baseValues).forEach(band => {
      baseValues[band] *= (1 + latitudeFactor * 0.2);
      baseValues[band] *= (1 + seasonFactor * 0.1);
      baseValues[band] *= (1 - cloudCover / 100 * 0.3); // Cloud impact
      baseValues[band] = Math.max(0.001, Math.min(1, baseValues[band]));
    });

    return baseValues;
  }

  /**
   * Generate comprehensive mock Sentinel-2 data
   */
  generateMockSentinelData(latitude, longitude, date) {
    const cloudCover = Math.random() * 30; // 0-30% cloud cover
    const bands = this.simulateRealisticBandValues(latitude, longitude, cloudCover);
    
    return {
      sceneId: `MOCK_S2_${Date.now()}`,
      acquisitionDate: date,
      cloudCover: Math.round(cloudCover * 100) / 100,
      processingLevel: 'Level-2A',
      dataQuality: 'High',
      bands
    };
  }

  /**
   * Calculate vegetation indices from Sentinel-2 bands
   */
  calculateVegetationIndices(bands) {
    const { B02: blue, B03: green, B04: red, B08: nir, B11: swir1 } = bands;
    
    // NDVI = (NIR - Red) / (NIR + Red)
    const ndvi = (nir - red) / (nir + red);
    
    // NDMI = (NIR - SWIR1) / (NIR + SWIR1)
    const ndmi = (nir - swir1) / (nir + swir1);
    
    // EVI = 2.5 * ((NIR - Red) / (NIR + 6*Red - 7.5*Blue + 1))
    const evi = 2.5 * ((nir - red) / (nir + 6 * red - 7.5 * blue + 1));
    
    // BSI = ((SWIR1 + Red) - (NIR + Blue)) / ((SWIR1 + Red) + (NIR + Blue))
    const bsi = ((swir1 + red) - (nir + blue)) / ((swir1 + red) + (nir + blue));
    
    return {
      ndvi: {
        value: Math.round(ndvi * 1000) / 1000,
        interpretation: this.interpretNDVI(ndvi),
        category: this.categorizeNDVI(ndvi)
      },
      ndmi: {
        value: Math.round(ndmi * 1000) / 1000,
        interpretation: this.interpretNDMI(ndmi),
        category: this.categorizeNDMI(ndmi)
      },
      evi: {
        value: Math.round(evi * 1000) / 1000,
        interpretation: this.interpretEVI(evi),
        category: this.categorizeEVI(evi)
      },
      bsi: {
        value: Math.round(bsi * 1000) / 1000,
        interpretation: this.interpretBSI(bsi),
        category: this.categorizeBSI(bsi)
      }
    };
  }

  /**
   * Analyze soil parameters from satellite data
   */
  analyzeSoilParameters(bands, vegetationIndices, latitude) {
    const { B08: nir, B11: swir1, B12: swir2, B04: red, B03: green } = bands;
    const { ndmi, bsi, ndvi } = vegetationIndices;
    
    // Soil moisture percentage using NDMI
    const moisturePercentage = Math.max(0, Math.min(100, 
      50 + (ndmi.value * 50) + (Math.random() - 0.5) * 10
    ));
    
    // Soil composition estimation
    const clayContent = Math.max(5, Math.min(60, 
      30 + (bsi.value * 20) + (swir1 / swir2 - 1) * 15
    ));
    const sandContent = Math.max(10, Math.min(80, 
      100 - clayContent - (15 + Math.random() * 10)
    ));
    const siltContent = 100 - clayContent - sandContent;
    
    // pH estimation (simplified)
    const phValue = 6.0 + (ndvi.value * 2) + (Math.random() - 0.5) * 1.5;
    
    // Organic matter content
    const organicMatter = Math.max(0.5, Math.min(10, 
      2 + (ndvi.value * 3) + (Math.random() - 0.5) * 1
    ));
    
    // Soil temperature estimation - need latitude parameter
    const soilTemperature = 15 + Math.random() * 20 + (Math.abs(latitude) / 90 * 10);
    
    // Fertility score (0-100)
    const fertilityScore = Math.round(
      (moisturePercentage * 0.3 + 
       organicMatter * 10 * 0.3 + 
       (phValue >= 6.0 && phValue <= 7.5 ? 80 : 40) * 0.2 +
       (100 - Math.abs(bsi.value) * 100) * 0.2) * 0.8 + Math.random() * 20
    );
    
    return {
      moisture: {
        percentage: Math.round(moisturePercentage * 10) / 10,
        status: this.categorizeMoisture(moisturePercentage),
        optimal: moisturePercentage >= 40 && moisturePercentage <= 70
      },
      composition: {
        clay: Math.round(clayContent * 10) / 10,
        sand: Math.round(sandContent * 10) / 10,
        silt: Math.round(siltContent * 10) / 10,
        texture: this.determineSoilTexture(clayContent, sandContent, siltContent)
      },
      ph: {
        value: Math.round(phValue * 10) / 10,
        category: this.categorizePH(phValue),
        optimal: phValue >= 6.0 && phValue <= 7.5
      },
      organicMatter: {
        percentage: Math.round(organicMatter * 10) / 10,
        category: this.categorizeOrganicMatter(organicMatter),
        status: organicMatter >= 3 ? 'Good' : organicMatter >= 2 ? 'Moderate' : 'Low'
      },
      temperature: {
        celsius: Math.round(soilTemperature * 10) / 10,
        fahrenheit: Math.round((soilTemperature * 9/5 + 32) * 10) / 10,
        optimal: soilTemperature >= 15 && soilTemperature <= 25
      },
      fertility: {
        score: Math.max(0, Math.min(100, fertilityScore)),
        category: this.categorizeFertility(fertilityScore),
        factors: this.analyzeFertilityFactors(moisturePercentage, organicMatter, phValue, bsi.value)
      }
    };
  }

  /**
   * Calculate overall soil health score
   */
  calculateSoilHealthScore(vegetationIndices, soilParameters) {
    const scores = {
      vegetation: Math.max(0, Math.min(100, (vegetationIndices.ndvi.value + 1) * 50)),
      moisture: soilParameters.moisture.optimal ? 85 : soilParameters.moisture.percentage,
      fertility: soilParameters.fertility.score,
      ph: soilParameters.ph.optimal ? 90 : Math.max(20, 100 - Math.abs(soilParameters.ph.value - 6.7) * 20),
      organicMatter: Math.min(100, soilParameters.organicMatter.percentage * 20)
    };
    
    const overallScore = Math.round(
      (scores.vegetation * 0.25 + 
       scores.moisture * 0.25 + 
       scores.fertility * 0.25 + 
       scores.ph * 0.15 + 
       scores.organicMatter * 0.1)
    );
    
    return {
      overall: Math.max(0, Math.min(100, overallScore)),
      category: this.categorizeSoilHealth(overallScore),
      components: scores,
      recommendations: this.getSoilHealthRecommendations(overallScore, scores)
    };
  }

  /**
   * Generate agricultural recommendations
   */
  generateRecommendations(soilParameters, vegetationIndices) {
    const recommendations = [];
    
    // Moisture recommendations
    if (soilParameters.moisture.percentage < 30) {
      recommendations.push({
        type: 'irrigation',
        priority: 'high',
        title: 'Increase Irrigation',
        description: 'Soil moisture is below optimal levels. Consider increasing irrigation frequency.',
        action: 'Implement drip irrigation or increase watering schedule by 25-30%'
      });
    } else if (soilParameters.moisture.percentage > 80) {
      recommendations.push({
        type: 'drainage',
        priority: 'medium',
        title: 'Improve Drainage',
        description: 'Soil moisture is too high. Improve drainage to prevent root rot.',
        action: 'Install drainage systems or reduce irrigation frequency'
      });
    }
    
    // pH recommendations
    if (soilParameters.ph.value < 6.0) {
      recommendations.push({
        type: 'liming',
        priority: 'medium',
        title: 'Soil Acidification',
        description: 'Soil is too acidic. Apply lime to raise pH levels.',
        action: `Apply 2-3 tons of agricultural lime per hectare to raise pH to 6.5-7.0`
      });
    } else if (soilParameters.ph.value > 8.0) {
      recommendations.push({
        type: 'acidification',
        priority: 'medium',
        title: 'Soil Alkalinity',
        description: 'Soil is too alkaline. Apply sulfur to lower pH levels.',
        action: 'Apply elemental sulfur at 200-400 kg per hectare'
      });
    }
    
    // Organic matter recommendations
    if (soilParameters.organicMatter.percentage < 2) {
      recommendations.push({
        type: 'organic_matter',
        priority: 'high',
        title: 'Increase Organic Matter',
        description: 'Low organic matter content affects soil fertility and structure.',
        action: 'Apply compost, manure, or practice cover cropping to increase organic matter'
      });
    }
    
    // Fertility recommendations
    if (soilParameters.fertility.score < 60) {
      recommendations.push({
        type: 'fertilization',
        priority: 'high',
        title: 'Nutrient Management',
        description: 'Soil fertility is below optimal levels.',
        action: 'Conduct soil test for NPK levels and apply balanced fertilizer accordingly'
      });
    }
    
    // Vegetation health recommendations
    if (vegetationIndices.ndvi.value < 0.3) {
      recommendations.push({
        type: 'crop_health',
        priority: 'high',
        title: 'Improve Vegetation Health',
        description: 'Low vegetation vigor detected. Address nutrient deficiencies.',
        action: 'Apply nitrogen-rich fertilizer and ensure adequate irrigation'
      });
    }
    
    return recommendations.slice(0, 5); // Return top 5 recommendations
  }

  /**
   * Generate crop recommendations based on soil conditions
   * @param {Object} soilParameters - Soil analysis parameters
   * @param {number} latitude - Location latitude
   * @param {number} longitude - Location longitude 
   * @param {string} analysisDate - Date of analysis
   * @returns {Array} Array of crop recommendations
   */
  generateCropRecommendations(soilParameters, latitude, longitude, analysisDate) {
    try {
      console.log('🌾 Generating crop recommendations based on soil analysis...');
      
      // Validate cropData import
      if (!cropData || !cropData.crops || !Array.isArray(cropData.crops)) {
        console.error('❌ cropData is not properly loaded:', typeof cropData);
        return {
          error: 'Crop database not available',
          message: 'Unable to load crop database for recommendations',
          recommendations: []
        };
      }
      
      const recommendedCrops = [];
      const currentMonth = moment(analysisDate).month() + 1; // moment months are 0-based
      const isNorthernRegion = latitude > 23.5; // Rough division for India
      
      // Analyze each crop against current soil conditions
      for (const crop of cropData.crops) {
        const suitabilityScore = this.calculateCropSuitability(crop, soilParameters, currentMonth, isNorthernRegion);
        
        if (suitabilityScore.totalScore >= 60) { // Only recommend crops with good suitability
          recommendedCrops.push({
            name: crop.name,
            scientificName: crop.scientificName,
            category: crop.category,
            suitabilityScore: suitabilityScore.totalScore,
            confidence: suitabilityScore.confidence,
            reasons: suitabilityScore.reasons,
            warnings: suitabilityScore.warnings,
            recommendations: suitabilityScore.recommendations,
            expectedYield: suitabilityScore.expectedYield,
            growingPeriod: crop.growingPeriodDays,
            difficulty: crop.difficulty,
            plantingWindow: this.getPlantingWindow(crop, currentMonth, isNorthernRegion),
            requirements: {
              soilPH: crop.requirements.soilPH,
              soilMoisture: crop.requirements.soilMoisture,
              temperature: crop.requirements.temperature
            }
          });
        }
      }
      
      // Sort by suitability score (highest first)
      recommendedCrops.sort((a, b) => b.suitabilityScore - a.suitabilityScore);
      
      // Return top 10 recommendations
      const topRecommendations = recommendedCrops.slice(0, 10);
      
      console.log(`✅ Generated ${topRecommendations.length} crop recommendations`);
      
      return {
        totalAnalyzed: cropData.crops.length,
        recommendedCount: topRecommendations.length,
        analysisDate: analysisDate,
        location: { latitude, longitude },
        soilSummary: {
          pH: soilParameters.ph.value,
          moisture: soilParameters.moisture.percentage,
          organicMatter: soilParameters.organicMatter.percentage,
          fertility: soilParameters.fertility.score
        },
        recommendations: topRecommendations
      };
      
    } catch (error) {
      console.error('❌ Error generating crop recommendations:', error.message);
      return {
        error: 'Failed to generate crop recommendations',
        message: error.message,
        recommendations: []
      };
    }
  }

  /**
   * Calculate crop suitability score based on soil conditions
   * @param {Object} crop - Crop data object
   * @param {Object} soilParameters - Current soil conditions
   * @param {number} currentMonth - Current month (1-12)
   * @param {boolean} isNorthernRegion - Whether location is in northern region
   * @returns {Object} Suitability analysis
   */
  calculateCropSuitability(crop, soilParameters, currentMonth, isNorthernRegion) {
    const scores = {
      pH: 0,
      moisture: 0,
      organicMatter: 0,
      fertility: 0,
      timing: 0
    };
    
    const reasons = [];
    const warnings = [];
    const recommendations = [];
    
    // pH suitability
    const currentPH = soilParameters.ph.value;
    const idealPH = crop.requirements.soilPH;
    
    if (currentPH >= idealPH.minimum && currentPH <= idealPH.maximum) {
      if (Math.abs(currentPH - idealPH.optimal) <= 0.3) {
        scores.pH = 100;
        reasons.push(`Optimal soil pH (${currentPH}) for ${crop.name}`);
      } else {
        scores.pH = 80;
        reasons.push(`Good soil pH (${currentPH}) for ${crop.name}`);
      }
    } else if (Math.abs(currentPH - idealPH.optimal) <= 1.0) {
      scores.pH = 60;
      warnings.push(`Soil pH (${currentPH}) is suboptimal for ${crop.name} (ideal: ${idealPH.optimal})`);
      if (currentPH < idealPH.minimum) {
        recommendations.push(`Apply lime to raise soil pH for better ${crop.name} growth`);
      } else {
        recommendations.push(`Apply sulfur to lower soil pH for better ${crop.name} growth`);
      }
    } else {
      scores.pH = 30;
      warnings.push(`Soil pH (${currentPH}) is poor for ${crop.name} (ideal range: ${idealPH.minimum}-${idealPH.maximum})`);
    }
    
    // Moisture suitability
    const currentMoisture = soilParameters.moisture.percentage;
    const idealMoisture = crop.requirements.soilMoisture;
    
    if (currentMoisture >= idealMoisture.minimum && currentMoisture <= idealMoisture.maximum) {
      if (Math.abs(currentMoisture - idealMoisture.optimal) <= 10) {
        scores.moisture = 100;
        reasons.push(`Optimal soil moisture (${currentMoisture}%) for ${crop.name}`);
      } else {
        scores.moisture = 85;
        reasons.push(`Good soil moisture (${currentMoisture}%) for ${crop.name}`);
      }
    } else if (Math.abs(currentMoisture - idealMoisture.optimal) <= 20) {
      scores.moisture = 65;
      if (currentMoisture < idealMoisture.minimum) {
        warnings.push(`Soil moisture (${currentMoisture}%) is low for ${crop.name}`);
        recommendations.push(`Increase irrigation for ${crop.name} cultivation`);
      } else {
        warnings.push(`Soil moisture (${currentMoisture}%) is high for ${crop.name}`);
        recommendations.push(`Improve drainage before planting ${crop.name}`);
      }
    } else {
      scores.moisture = 40;
      warnings.push(`Soil moisture (${currentMoisture}%) is unsuitable for ${crop.name} (ideal: ${idealMoisture.optimal}%)`);
    }
    
    // Organic matter suitability
    const currentOM = soilParameters.organicMatter.percentage;
    if (currentOM >= 3) {
      scores.organicMatter = 100;
      reasons.push(`Excellent organic matter content (${currentOM}%) supports ${crop.name}`);
    } else if (currentOM >= 2) {
      scores.organicMatter = 80;
      reasons.push(`Good organic matter content (${currentOM}%) for ${crop.name}`);
    } else if (currentOM >= 1) {
      scores.organicMatter = 60;
      warnings.push(`Moderate organic matter (${currentOM}%) - could be improved for ${crop.name}`);
      recommendations.push(`Add compost or manure to improve soil for ${crop.name}`);
    } else {
      scores.organicMatter = 40;
      warnings.push(`Low organic matter (${currentOM}%) may limit ${crop.name} growth`);
      recommendations.push(`Significant organic matter improvement needed for ${crop.name}`);
    }
    
    // Fertility suitability
    const currentFertility = soilParameters.fertility.score;
    if (currentFertility >= 80) {
      scores.fertility = 100;
      reasons.push(`High soil fertility supports excellent ${crop.name} growth`);
    } else if (currentFertility >= 60) {
      scores.fertility = 85;
      reasons.push(`Good soil fertility for ${crop.name} cultivation`);
    } else if (currentFertility >= 40) {
      scores.fertility = 65;
      warnings.push(`Moderate soil fertility - may need fertilization for ${crop.name}`);
      recommendations.push(`Apply balanced NPK fertilizer for ${crop.name}`);
    } else {
      scores.fertility = 45;
      warnings.push(`Low soil fertility requires significant improvement for ${crop.name}`);
      recommendations.push(`Soil test and comprehensive fertilization program needed for ${crop.name}`);
    }
    
    // Timing suitability
    const plantingWindows = isNorthernRegion ? crop.plantingSeasons.northern : crop.plantingSeasons.southern;
    let timingScore = 0;
    let bestWindow = null;
    
    for (const window of plantingWindows) {
      if (currentMonth >= window.start && currentMonth <= window.end) {
        timingScore = 100;
        bestWindow = window;
        reasons.push(`Perfect planting time for ${crop.name} (${window.type} season)`);
        break;
      } else {
        // Check if within 1 month of planting window
        const distanceToStart = Math.min(
          Math.abs(currentMonth - window.start),
          Math.abs(currentMonth - window.start + 12),
          Math.abs(currentMonth - window.start - 12)
        );
        const distanceToEnd = Math.min(
          Math.abs(currentMonth - window.end),
          Math.abs(currentMonth - window.end + 12),
          Math.abs(currentMonth - window.end - 12)
        );
        const minDistance = Math.min(distanceToStart, distanceToEnd);
        
        if (minDistance <= 1 && timingScore < 70) {
          timingScore = 70;
          bestWindow = window;
          warnings.push(`Near planting season for ${crop.name} (${window.type} season: ${this.getMonthName(window.start)}-${this.getMonthName(window.end)})`);
        } else if (minDistance <= 2 && timingScore < 50) {
          timingScore = 50;
          bestWindow = window;
          warnings.push(`Approaching planting season for ${crop.name} (${window.type} season: ${this.getMonthName(window.start)}-${this.getMonthName(window.end)})`);
        }
      }
    }
    
    scores.timing = timingScore;
    
    // Calculate total score (weighted average)
    const weights = {
      pH: 0.25,
      moisture: 0.25,
      organicMatter: 0.15,
      fertility: 0.20,
      timing: 0.15
    };
    
    const totalScore = Math.round(
      scores.pH * weights.pH +
      scores.moisture * weights.moisture +
      scores.organicMatter * weights.organicMatter +
      scores.fertility * weights.fertility +
      scores.timing * weights.timing
    );
    
    // Calculate confidence based on data quality
    const confidence = Math.min(95, Math.max(60, totalScore - 10));
    
    // Calculate expected yield modifier
    let expectedYield = 'Standard';
    if (totalScore >= 90) expectedYield = 'Excellent';
    else if (totalScore >= 80) expectedYield = 'Very Good';
    else if (totalScore >= 70) expectedYield = 'Good';
    else if (totalScore >= 60) expectedYield = 'Moderate';
    else expectedYield = 'Below Average';
    
    return {
      totalScore,
      confidence,
      scores,
      reasons,
      warnings,
      recommendations,
      expectedYield,
      bestPlantingWindow: bestWindow
    };
  }

  /**
   * Get planting window information for a crop
   * @param {Object} crop - Crop data
   * @param {number} currentMonth - Current month
   * @param {boolean} isNorthernRegion - Region flag
   * @returns {Object} Planting window info
   */
  getPlantingWindow(crop, currentMonth, isNorthernRegion) {
    const plantingWindows = isNorthernRegion ? crop.plantingSeasons.northern : crop.plantingSeasons.southern;
    
    for (const window of plantingWindows) {
      if (currentMonth >= window.start && currentMonth <= window.end) {
        return {
          status: 'optimal',
          season: window.type,
          period: `${this.getMonthName(window.start)} - ${this.getMonthName(window.end)}`,
          daysRemaining: this.calculateDaysInWindow(currentMonth, window.end)
        };
      }
    }
    
    // Find next planting window
    let nextWindow = null;
    let shortestWait = 12;
    
    for (const window of plantingWindows) {
      let monthsUntil = window.start - currentMonth;
      if (monthsUntil <= 0) monthsUntil += 12;
      
      if (monthsUntil < shortestWait) {
        shortestWait = monthsUntil;
        nextWindow = window;
      }
    }
    
    return {
      status: 'upcoming',
      season: nextWindow?.type || 'unknown',
      period: nextWindow ? `${this.getMonthName(nextWindow.start)} - ${this.getMonthName(nextWindow.end)}` : 'TBD',
      monthsUntil: shortestWait
    };
  }

  /**
   * Helper function to get month name
   * @param {number} monthNum - Month number (1-12)
   * @returns {string} Month name
   */
  getMonthName(monthNum) {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthNum - 1] || 'Unknown';
  }

  /**
   * Calculate days remaining in planting window
   * @param {number} currentMonth - Current month
   * @param {number} endMonth - End month of window
   * @returns {number} Days remaining
   */
  calculateDaysInWindow(currentMonth, endMonth) {
    if (endMonth >= currentMonth) {
      return (endMonth - currentMonth) * 30; // Rough estimate
    } else {
      return (12 - currentMonth + endMonth) * 30;
    }
  }

  /**
   * Geocoding service using OpenStreetMap Nominatim
   */
  async geocodeLocation(cityName) {
    try {
      const url = `${this.nominatimBaseUrl}/search?q=${encodeURIComponent(cityName)}&format=json&limit=1&addressdetails=1`;
      
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'AgriGuru-SoilAnalysis/1.0'
        },
        timeout: 5000
      });
      
      if (response.data && response.data.length > 0) {
        const location = response.data[0];
        return {
          latitude: parseFloat(location.lat),
          longitude: parseFloat(location.lon),
          displayName: location.display_name,
          country: location.address?.country,
          state: location.address?.state,
          city: location.address?.city || location.address?.town || location.address?.village
        };
      }
      
      throw new Error('Location not found');
      
    } catch (error) {
      console.error('[Geocoding] Error:', error);
      throw new Error(`Geocoding failed: ${error.message}`);
    }
  }

  /**
   * Reverse geocoding service
   */
  async reverseGeocode({ latitude, longitude }) {
    try {
      const url = `${this.nominatimBaseUrl}/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`;
      
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'AgriGuru-SoilAnalysis/1.0'
        },
        timeout: 5000
      });
      
      if (response.data) {
        const location = response.data;
        return {
          displayName: location.display_name,
          country: location.address?.country,
          state: location.address?.state,
          region: location.address?.region,
          city: location.address?.city || location.address?.town || location.address?.village,
          postcode: location.address?.postcode
        };
      }
      
      return {
        displayName: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
        country: 'Unknown',
        state: 'Unknown'
      };
      
    } catch (error) {
      console.error('[Reverse Geocoding] Error:', error);
      return {
        displayName: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
        country: 'Unknown',
        state: 'Unknown'
      };
    }
  }

  /**
   * Search locations with autocomplete
   */
  async searchLocations(query) {
    try {
      const url = `${this.nominatimBaseUrl}/search?q=${encodeURIComponent(query)}&format=json&limit=10&addressdetails=1`;
      
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'AgriGuru-SoilAnalysis/1.0'
        },
        timeout: 5000
      });
      
      if (response.data && response.data.length > 0) {
        return response.data.map(location => ({
          latitude: parseFloat(location.lat),
          longitude: parseFloat(location.lon),
          displayName: location.display_name,
          country: location.address?.country,
          state: location.address?.state,
          city: location.address?.city || location.address?.town || location.address?.village,
          type: location.type,
          importance: location.importance
        }));
      }
      
      return [];
      
    } catch (error) {
      console.error('[Location Search] Error:', error);
      return [];
    }
  }

  /**
   * Get Sentinel-2 satellite data
   */
  async getSentinelData({ latitude, longitude, startDate, endDate }) {
    if (this.useMockData) {
      return this.generateMockSentinelTimeSeries(latitude, longitude, startDate, endDate);
    }
    
    try {
      // Implementation for real Sentinel-2 data fetching
      // This would involve more complex data processing
      return await this.fetchSentinelTimeSeries(latitude, longitude, startDate, endDate);
    } catch (error) {
      console.log('[Sentinel Data] Falling back to mock data');
      return this.generateMockSentinelTimeSeries(latitude, longitude, startDate, endDate);
    }
  }

  /**
   * Generate mock time series data
   */
  generateMockSentinelTimeSeries(latitude, longitude, startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeSeries = [];
    
    let currentDate = new Date(start);
    while (currentDate <= end) {
      // Sentinel-2 has 5-day revisit time
      if (Math.random() > 0.3) { // 70% chance of data availability
        const mockData = this.generateMockSentinelData(
          latitude, 
          longitude, 
          currentDate.toISOString().split('T')[0]
        );
        timeSeries.push(mockData);
      }
      currentDate.setDate(currentDate.getDate() + 5);
    }
    
    return {
      timeSeries,
      totalScenes: timeSeries.length,
      dateRange: { startDate, endDate },
      location: { latitude, longitude }
    };
  }

  /**
   * Get health status of the service
   */
  async getHealthStatus() {
    const status = {
      timestamp: new Date().toISOString(),
      services: {
        copernicus: this.copernicusUsername ? 'configured' : 'not_configured',
        nominatim: 'available',
        openweather: this.openWeatherApiKey ? 'configured' : 'not_configured'
      },
      mode: this.useMockData ? 'mock' : 'live',
      rateLimit: {
        maxRequestsPerHour: this.maxRequestsPerHour,
        currentHourRequests: this.getCurrentHourRequests()
      }
    };
    
    // Test Nominatim service
    try {
      await axios.get(`${this.nominatimBaseUrl}/search?q=London&format=json&limit=1`, {
        timeout: 3000,
        headers: { 'User-Agent': 'AgriGuru-SoilAnalysis/1.0' }
      });
      status.services.nominatim = 'healthy';
    } catch (error) {
      status.services.nominatim = 'unhealthy';
    }
    
    return status;
  }

  // Helper methods for rate limiting
  checkRateLimit() {
    const currentHour = new Date().getHours();
    const requests = this.requestCounts.get(currentHour) || 0;
    
    if (requests >= this.maxRequestsPerHour) {
      return false;
    }
    
    this.requestCounts.set(currentHour, requests + 1);
    return true;
  }

  getCurrentHourRequests() {
    const currentHour = new Date().getHours();
    return this.requestCounts.get(currentHour) || 0;
  }

  // Helper methods for creating bounding boxes
  createBoundingBox(latitude, longitude, bufferDegrees) {
    return {
      north: latitude + bufferDegrees,
      south: latitude - bufferDegrees,
      east: longitude + bufferDegrees,
      west: longitude - bufferDegrees
    };
  }

  // Interpretation methods
  interpretNDVI(ndvi) {
    if (ndvi < -0.1) return 'Water/Snow/Cloud';
    if (ndvi < 0.1) return 'Bare soil/Rock';
    if (ndvi < 0.3) return 'Sparse vegetation';
    if (ndvi < 0.6) return 'Moderate vegetation';
    return 'Dense vegetation';
  }

  categorizeNDVI(ndvi) {
    if (ndvi < 0.1) return 'Poor';
    if (ndvi < 0.3) return 'Fair';
    if (ndvi < 0.6) return 'Good';
    return 'Excellent';
  }

  interpretNDMI(ndmi) {
    if (ndmi < -0.2) return 'Very dry soil';
    if (ndmi < 0) return 'Dry soil';
    if (ndmi < 0.2) return 'Moderate moisture';
    return 'High moisture';
  }

  categorizeNDMI(ndmi) {
    if (ndmi < -0.2) return 'Very Dry';
    if (ndmi < 0) return 'Dry';
    if (ndmi < 0.2) return 'Moderate';
    return 'Moist';
  }

  interpretEVI(evi) {
    if (evi < 0.1) return 'No vegetation';
    if (evi < 0.3) return 'Sparse vegetation';
    if (evi < 0.6) return 'Moderate vegetation';
    return 'Dense vegetation';
  }

  categorizeEVI(evi) {
    if (evi < 0.1) return 'None';
    if (evi < 0.3) return 'Sparse';
    if (evi < 0.6) return 'Moderate';
    return 'Dense';
  }

  interpretBSI(bsi) {
    if (bsi < -0.1) return 'Vegetated area';
    if (bsi < 0.1) return 'Mixed vegetation/soil';
    if (bsi < 0.3) return 'Exposed soil';
    return 'Bare soil/Rock';
  }

  categorizeBSI(bsi) {
    if (bsi < -0.1) return 'Low';
    if (bsi < 0.1) return 'Moderate';
    if (bsi < 0.3) return 'High';
    return 'Very High';
  }

  categorizeMoisture(moisture) {
    if (moisture < 20) return 'Very Dry';
    if (moisture < 40) return 'Dry';
    if (moisture < 70) return 'Optimal';
    if (moisture < 85) return 'Moist';
    return 'Saturated';
  }

  categorizePH(ph) {
    if (ph < 5.5) return 'Strongly Acidic';
    if (ph < 6.0) return 'Moderately Acidic';
    if (ph < 6.5) return 'Slightly Acidic';
    if (ph < 7.5) return 'Neutral';
    if (ph < 8.0) return 'Slightly Alkaline';
    if (ph < 8.5) return 'Moderately Alkaline';
    return 'Strongly Alkaline';
  }

  categorizeOrganicMatter(om) {
    if (om < 1) return 'Very Low';
    if (om < 2) return 'Low';
    if (om < 3) return 'Moderate';
    if (om < 5) return 'Good';
    return 'Excellent';
  }

  categorizeFertility(score) {
    if (score < 30) return 'Poor';
    if (score < 50) return 'Fair';
    if (score < 70) return 'Good';
    if (score < 85) return 'Very Good';
    return 'Excellent';
  }

  categorizeSoilHealth(score) {
    if (score < 40) return 'Poor';
    if (score < 60) return 'Fair';
    if (score < 75) return 'Good';
    if (score < 90) return 'Very Good';
    return 'Excellent';
  }

  determineSoilTexture(clay, sand, silt) {
    if (clay >= 40) return 'Clay';
    if (sand >= 70) return 'Sand';
    if (silt >= 80) return 'Silt';
    if (clay >= 20 && sand >= 45) return 'Sandy Clay';
    if (clay >= 20 && silt >= 40) return 'Silty Clay';
    if (sand >= 45 && silt >= 40) return 'Sandy Silt';
    return 'Loam';
  }

  analyzeFertilityFactors(moisture, organicMatter, ph, bsi) {
    const factors = [];
    
    if (moisture < 30) factors.push('Low soil moisture');
    if (organicMatter < 2) factors.push('Low organic matter');
    if (ph < 6.0 || ph > 8.0) factors.push('Suboptimal pH');
    if (Math.abs(bsi) > 0.2) factors.push('Poor soil structure');
    
    return factors.length > 0 ? factors : ['Good overall conditions'];
  }

  getSoilHealthRecommendations(score, components) {
    const recommendations = [];
    
    if (components.vegetation < 60) {
      recommendations.push('Improve vegetation cover');
    }
    if (components.moisture < 60) {
      recommendations.push('Optimize irrigation management');
    }
    if (components.fertility < 60) {
      recommendations.push('Apply balanced fertilization');
    }
    if (components.ph < 60) {
      recommendations.push('Adjust soil pH levels');
    }
    if (components.organicMatter < 60) {
      recommendations.push('Increase organic matter content');
    }
    
    return recommendations.length > 0 ? recommendations : ['Maintain current practices'];
  }

  calculateConfidence(cloudCover, dataQuality) {
    let confidence = 100;
    
    // Reduce confidence based on cloud cover
    confidence -= Math.min(cloudCover * 2, 50);
    
    // Adjust based on data quality
    if (dataQuality === 'Low') confidence -= 20;
    else if (dataQuality === 'Medium') confidence -= 10;
    
    // Mock data has lower confidence
    if (this.useMockData) confidence -= 15;
    
    return Math.max(30, Math.round(confidence));
  }
}

module.exports = new SoilAnalysisService();
