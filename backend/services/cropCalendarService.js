const moment = require('moment');
const cropData = require('../data/cropData');
const AIRecommendationService = require('./aiRecommendationService');

class CropCalendarService {
  constructor() {
    this.cropDatabase = cropData;
    this.aiService = new AIRecommendationService();
  }

  /**
   * Generate a comprehensive crop calendar based on inputs and satellite data
   * Enhanced with AI recommendations from cropinailab/aksara_v1
   * @param {Object} params - Contains location, area, cropType, and satelliteData
   * @returns {Object} Complete crop calendar with milestones and AI insights
   */
  async generateCropCalendar({ location, area, cropType, satelliteData }) {
    console.log(`🌾 Generating AI-enhanced crop calendar for ${cropType} at location (${location.latitude}, ${location.longitude})`);
    
    try {
      // Get AI recommendations first
      const aiRecommendation = await this.aiService.getCropRecommendation({
        location,
        satelliteData,
        area,
        soilType: satelliteData.soilMoisture.status
      });

      console.log('🤖 AI recommendations received, integrating with crop calendar...');

      // Get base crop information
      const crop = this.getCropInfo(cropType);
      if (!crop) {
        throw new Error(`Unsupported crop type: ${cropType}`);
      }

      const currentDate = moment();
      const { latitude } = location;
      const isNorthernHemisphere = latitude > 0;
      
      // Analyze satellite data to adjust planting recommendations
      // Enhanced with AI insights
      const plantingAdjustments = this.analyzePlantingConditions(
        satelliteData, 
        crop, 
        isNorthernHemisphere,
        aiRecommendation
      );
      
      // Calculate optimal planting window with AI guidance
      const plantingWindow = this.calculatePlantingWindow(
        crop, 
        currentDate, 
        plantingAdjustments, 
        isNorthernHemisphere,
        aiRecommendation
      );
      
      // Generate growth stages timeline enhanced with AI insights
      const growthStages = this.calculateGrowthStages(crop, plantingWindow.optimalStart, satelliteData, aiRecommendation);
      
      // Calculate fertilization and irrigation schedules with AI management practices
      const maintenanceSchedule = this.calculateMaintenanceSchedule(
        crop, 
        plantingWindow.optimalStart, 
        area, 
        satelliteData,
        aiRecommendation
      );
      
      // Calculate harvesting window
      const harvestingWindow = this.calculateHarvestingWindow(crop, plantingWindow.optimalStart, area, satelliteData);
      
      // Generate recommendations enhanced with AI insights
      const recommendations = this.generateRecommendations(
        satelliteData, 
        crop, 
        currentDate, 
        plantingWindow,
        aiRecommendation
      );

      return {
        cropType,
        cropInfo: {
          name: crop.name,
          scientificName: crop.scientificName,
          category: crop.category,
          growingPeriod: crop.growingPeriodDays,
          description: crop.description
        },
        // AI Enhancement Section
        aiEnhancement: {
          modelUsed: aiRecommendation.aiRecommendation?.modelUsed || 'fallback',
          confidence: aiRecommendation.aiRecommendation?.confidence || 0.6,
          alternativeCrops: aiRecommendation.aiRecommendation?.recommendedCrops || [],
          aiInsights: aiRecommendation.aiRecommendation?.aiInsights || 'No AI insights available',
          riskAssessment: aiRecommendation.aiRecommendation?.riskAssessment || [],
          managementPractices: aiRecommendation.aiRecommendation?.managementPractices || [],
          generatedAt: aiRecommendation.aiRecommendation?.generatedAt || new Date().toISOString()
        },
        plantingWindow,
        growthStages,
        maintenanceSchedule,
        harvestingWindow,
        recommendations,
        satelliteDataSummary: {
          vegetationHealth: this.assessVegetationHealth(satelliteData.vegetationIndex),
          soilCondition: this.assessSoilCondition(satelliteData.soilMoisture),
          weatherSuitability: this.assessWeatherSuitability(satelliteData.temperature, satelliteData.precipitation),
          overallReadiness: this.assessOverallReadiness(satelliteData, crop)
        },
        generatedAt: new Date().toISOString(),
        location,
        area
      };

    } catch (error) {
      console.error('❌ Error generating AI-enhanced crop calendar:', error);
      
      // Fallback to traditional crop calendar generation
      return this.generateTraditionalCropCalendar({ location, area, cropType, satelliteData });
    }
  }

  /**
   * Fallback method for traditional crop calendar generation
   */
  async generateTraditionalCropCalendar({ location, area, cropType, satelliteData }) {
    console.log('🔄 Falling back to traditional crop calendar generation');
    
    const crop = this.getCropInfo(cropType);
    if (!crop) {
      throw new Error(`Unsupported crop type: ${cropType}`);
    }

    const currentDate = moment();
    const { latitude } = location;
    const isNorthernHemisphere = latitude > 0;
    
    // Traditional methods without AI enhancement
    const plantingAdjustments = this.analyzePlantingConditions(satelliteData, crop, isNorthernHemisphere);
    const plantingWindow = this.calculatePlantingWindow(crop, currentDate, plantingAdjustments, isNorthernHemisphere);
    const growthStages = this.calculateGrowthStages(crop, plantingWindow.optimalStart, satelliteData);
    const maintenanceSchedule = this.calculateMaintenanceSchedule(crop, plantingWindow.optimalStart, area, satelliteData);
    const harvestingWindow = this.calculateHarvestingWindow(crop, plantingWindow.optimalStart, area, satelliteData);
    const recommendations = this.generateRecommendations(satelliteData, crop, currentDate, plantingWindow);

    return {
      cropType,
      cropInfo: {
        name: crop.name,
        scientificName: crop.scientificName,
        category: crop.category,
        growingPeriod: crop.growingPeriodDays,
        description: crop.description
      },
      // Traditional generation (no AI enhancement)
      aiEnhancement: {
        modelUsed: 'traditional',
        confidence: 0.6,
        alternativeCrops: [],
        aiInsights: 'Traditional rule-based calendar generation (AI service unavailable)',
        riskAssessment: [],
        managementPractices: [],
        generatedAt: new Date().toISOString()
      },
      plantingWindow,
      growthStages,
      maintenanceSchedule,
      harvestingWindow,
      recommendations,
      satelliteDataSummary: {
        vegetationHealth: this.assessVegetationHealth(satelliteData.vegetationIndex),
        soilCondition: this.assessSoilCondition(satelliteData.soilMoisture),
        weatherSuitability: this.assessWeatherSuitability(satelliteData.temperature, satelliteData.precipitation),
        overallReadiness: this.assessOverallReadiness(satelliteData, crop)
      },
      generatedAt: new Date().toISOString(),
      location,
      area
    };
  }

  /**
   * Get crop information from database
   * @param {string} cropType 
   * @returns {Object} Crop information
   */
  getCropInfo(cropType) {
    const normalizedCropType = cropType.toLowerCase().trim();
    return this.cropDatabase.crops.find(crop => 
      crop.name.toLowerCase() === normalizedCropType ||
      crop.aliases?.some(alias => alias.toLowerCase() === normalizedCropType)
    );
  }

  /**
   * Analyze satellite data to determine planting condition adjustments
   * @param {Object} satelliteData 
   * @param {Object} crop 
   * @param {boolean} isNorthernHemisphere 
   * @returns {Object} Adjustment recommendations
   */
  analyzePlantingConditions(satelliteData, crop, isNorthernHemisphere) {
    const adjustments = {
      delayDays: 0,
      advanceDays: 0,
      riskFactors: [],
      recommendations: []
    };

    // Analyze soil moisture
    const soilMoisturePercentage = satelliteData.soilMoisture.percentage;
    if (soilMoisturePercentage < crop.requirements.soilMoisture.minimum) {
      adjustments.delayDays += 7;
      adjustments.riskFactors.push('Low soil moisture');
      adjustments.recommendations.push('Consider irrigation before planting');
    } else if (soilMoisturePercentage > crop.requirements.soilMoisture.maximum) {
      adjustments.delayDays += 3;
      adjustments.riskFactors.push('Excess soil moisture');
      adjustments.recommendations.push('Allow soil to drain before planting');
    }

    // Analyze temperature
    const currentTemp = satelliteData.temperature.current;
    if (currentTemp < crop.requirements.temperature.minimum) {
      adjustments.delayDays += 14;
      adjustments.riskFactors.push('Temperature too low');
      adjustments.recommendations.push('Wait for warmer weather');
    } else if (currentTemp > crop.requirements.temperature.maximum) {
      adjustments.delayDays += 7;
      adjustments.riskFactors.push('Temperature too high');
      adjustments.recommendations.push('Consider heat-resistant varieties');
    }

    // Analyze recent precipitation
    const recentPrecipitation = satelliteData.precipitation.last7Days;
    if (recentPrecipitation > 50) {
      adjustments.delayDays += 3;
      adjustments.riskFactors.push('Heavy recent rainfall');
    }

    return adjustments;
  }

  /**
   * Calculate optimal planting window
   * @param {Object} crop 
   * @param {moment.Moment} currentDate 
   * @param {Object} adjustments 
   * @param {boolean} isNorthernHemisphere 
   * @returns {Object} Planting window information
   */
  calculatePlantingWindow(crop, currentDate, adjustments, isNorthernHemisphere) {
    const currentMonth = currentDate.month() + 1; // 1-12
    
    // Get base planting season for hemisphere
    const plantingSeasons = isNorthernHemisphere ? 
      crop.plantingSeasons.northern : 
      crop.plantingSeasons.southern;

    // Find the next suitable planting season
    let nextSeasonStart = null;
    let nextSeasonEnd = null;

    for (const season of plantingSeasons) {
      const seasonStart = moment().month(season.start - 1).date(1);
      const seasonEnd = moment().month(season.end - 1).date(1).endOf('month');

      if (seasonStart.isAfter(currentDate) || seasonStart.isSame(currentDate, 'month')) {
        nextSeasonStart = seasonStart.clone();
        nextSeasonEnd = seasonEnd.clone();
        break;
      }
    }

    // If no season found this year, take the first season of next year
    if (!nextSeasonStart) {
      const firstSeason = plantingSeasons[0];
      nextSeasonStart = moment().add(1, 'year').month(firstSeason.start - 1).date(1);
      nextSeasonEnd = moment().add(1, 'year').month(firstSeason.end - 1).date(1).endOf('month');
    }

    // Apply satellite data adjustments
    let optimalStart = nextSeasonStart.clone().add(adjustments.delayDays - adjustments.advanceDays, 'days');
    const optimalEnd = nextSeasonEnd.clone();

    // Ensure optimal start is not before current date
    if (optimalStart.isBefore(currentDate)) {
      optimalStart = currentDate.clone().add(1, 'day');
    }

    return {
      season: this.getSeasonName(optimalStart.month() + 1, isNorthernHemisphere),
      earliestStart: nextSeasonStart.format('YYYY-MM-DD'),
      latestEnd: nextSeasonEnd.format('YYYY-MM-DD'),
      optimalStart: optimalStart.format('YYYY-MM-DD'),
      optimalEnd: optimalEnd.format('YYYY-MM-DD'),
      adjustments: adjustments.delayDays - adjustments.advanceDays,
      riskFactors: adjustments.riskFactors,
      recommendations: adjustments.recommendations,
      daysFromNow: optimalStart.diff(currentDate, 'days')
    };
  }

  /**
   * Calculate growth stages timeline
   * @param {Object} crop 
   * @param {string} plantingDate 
   * @param {Object} satelliteData 
   * @returns {Array} Growth stages with dates
   */
  calculateGrowthStages(crop, plantingDate, satelliteData) {
    const plantDate = moment(plantingDate);
    const stages = [];

    // Add growth stage adjustments based on satellite data
    const temperatureMultiplier = this.getGrowthRateMultiplier(satelliteData.temperature.current, crop);
    
    let cumulativeDays = 0;
    crop.growthStages.forEach((stage, index) => {
      const adjustedDuration = Math.round(stage.duration * temperatureMultiplier);
      cumulativeDays += adjustedDuration;
      
      stages.push({
        stage: stage.name,
        description: stage.description,
        startDate: plantDate.clone().add(cumulativeDays - adjustedDuration, 'days').format('YYYY-MM-DD'),
        endDate: plantDate.clone().add(cumulativeDays, 'days').format('YYYY-MM-DD'),
        duration: adjustedDuration,
        keyActivities: stage.activities,
        careInstructions: stage.careInstructions,
        expectedSigns: stage.expectedSigns
      });
    });

    return stages;
  }

  /**
   * Calculate maintenance schedule (fertilization and irrigation)
   * @param {Object} crop 
   * @param {string} plantingDate 
   * @param {number} area 
   * @param {Object} satelliteData 
   * @returns {Object} Maintenance schedules
   */
  calculateMaintenanceSchedule(crop, plantingDate, area, satelliteData) {
    const plantDate = moment(plantingDate);
    const fertilization = [];
    let irrigation = [];

    // Calculate fertilization schedule (if available)
    if (crop.fertilizationSchedule && Array.isArray(crop.fertilizationSchedule)) {
      crop.fertilizationSchedule.forEach(fert => {
        const applicationDate = plantDate.clone().add(fert.daysAfterPlanting, 'days');
        const areaMultiplier = area; // Assuming area is in appropriate units
        
        fertilization.push({
          date: applicationDate.format('YYYY-MM-DD'),
          type: fert.type,
          nutrient: fert.nutrient,
          amountPerUnit: fert.amount,
          totalAmount: Math.round(fert.amount * areaMultiplier * 100) / 100,
          unit: fert.unit,
          method: fert.method,
          instructions: fert.instructions,
          stage: this.getGrowthStageAtDate(crop, plantDate, applicationDate)
        });
      });
    } else {
      // Generate default fertilization schedule based on growth stages
      console.log('🌱 No fertilization schedule found, generating default schedule...');
      const defaultFertilizations = this.generateDefaultFertilizationSchedule(crop, plantDate, area);
      fertilization.push(...defaultFertilizations);
    }

    // Generate precision irrigation schedule using live soil data
    console.log('🌱 Generating precision irrigation schedule using live soil data...');
    const plantingEndDate = plantDate.clone().add(crop.growingPeriodDays, 'days');
    irrigation = this.generatePrecisionIrrigationSchedule(crop, area, satelliteData, plantDate, plantingEndDate);

    return {
      fertilization,
      irrigation,
      totalFertilizerCost: this.calculateFertilizerCost(fertilization),
      totalWaterNeeded: irrigation.reduce((sum, irr) => sum + irr.amount, 0)
    };
  }

  /**
   * Calculate harvesting window
   * @param {Object} crop 
   * @param {string} plantingDate 
   * @param {number} area
   * @param {Object} satelliteData 
   * @returns {Object} Harvesting information
   */
  calculateHarvestingWindow(crop, plantingDate, area, satelliteData) {
    const plantDate = moment(plantingDate);
    const temperatureMultiplier = this.getGrowthRateMultiplier(satelliteData.temperature.current, crop);
    const adjustedGrowingPeriod = Math.round(crop.growingPeriodDays * temperatureMultiplier);
    
    const harvestStart = plantDate.clone().add(adjustedGrowingPeriod - 7, 'days');
    const harvestEnd = plantDate.clone().add(adjustedGrowingPeriod + 7, 'days');
    const optimalHarvest = plantDate.clone().add(adjustedGrowingPeriod, 'days');

    return {
      earliestDate: harvestStart.format('YYYY-MM-DD'),
      latestDate: harvestEnd.format('YYYY-MM-DD'),
      optimalDate: optimalHarvest.format('YYYY-MM-DD'),
      estimatedYield: this.calculateExpectedYield(crop, area, satelliteData),
      harvestingMethod: crop.harvestingMethod,
      postHarvestCare: crop.postHarvestCare,
      storageInstructions: crop.storageInstructions,
      marketReadiness: optimalHarvest.clone().add(crop.processingDays || 0, 'days').format('YYYY-MM-DD')
    };
  }

  /**
   * Generate personalized recommendations
   * @param {Object} satelliteData 
   * @param {Object} crop 
   * @param {moment.Moment} currentDate 
   * @param {Object} plantingWindow 
   * @returns {Array} Recommendations
   */
  generateRecommendations(satelliteData, crop, currentDate, plantingWindow) {
    const recommendations = [];
    const daysToPlanting = moment(plantingWindow.optimalStart).diff(currentDate, 'days');

    // Immediate actions based on current conditions
    if (daysToPlanting <= 7 && daysToPlanting > 0) {
      recommendations.push({
        priority: 'high',
        category: 'preparation',
        title: 'Prepare for planting',
        description: 'Optimal planting window starts soon. Begin field preparation.',
        actions: ['Clear the field of weeds', 'Test soil pH', 'Prepare seeds/seedlings', 'Check irrigation system']
      });
    }

    // Soil moisture recommendations
    const soilMoisture = satelliteData.soilMoisture.percentage;
    if (soilMoisture < 30) {
      recommendations.push({
        priority: 'high',
        category: 'irrigation',
        title: 'Soil moisture is low',
        description: `Current soil moisture is ${soilMoisture}%. Consider irrigation.`,
        actions: ['Apply irrigation', 'Check irrigation system', 'Monitor soil moisture daily']
      });
    }

    // Weather-based recommendations
    if (satelliteData.precipitation.last7Days > 40) {
      recommendations.push({
        priority: 'medium',
        category: 'weather',
        title: 'Recent heavy rainfall',
        description: 'High precipitation in the last 7 days may affect field conditions.',
        actions: ['Check for waterlogging', 'Ensure proper drainage', 'Delay planting if soil is waterlogged']
      });
    }

    // Temperature recommendations
    const currentTemp = satelliteData.temperature.current;
    if (currentTemp < crop.requirements.temperature.minimum) {
      recommendations.push({
        priority: 'high',
        category: 'weather',
        title: 'Temperature below optimal range',
        description: `Current temperature (${currentTemp}°C) is below crop minimum (${crop.requirements.temperature.minimum}°C).`,
        actions: ['Wait for warmer weather', 'Consider protected cultivation', 'Use mulching to retain soil warmth']
      });
    }

    // Vegetation health recommendations
    const ndvi = satelliteData.vegetationIndex.ndvi;
    if (ndvi < 0.3) {
      recommendations.push({
        priority: 'medium',
        category: 'soil',
        title: 'Low vegetation activity in area',
        description: 'Satellite data shows low vegetation activity. Consider soil health improvement.',
        actions: ['Test soil nutrients', 'Apply organic matter', 'Consider cover cropping']
      });
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  // Helper methods

  getSeasonName(month, isNorthernHemisphere) {
    if (isNorthernHemisphere) {
      if (month >= 3 && month <= 5) return 'Spring';
      if (month >= 6 && month <= 8) return 'Summer';
      if (month >= 9 && month <= 11) return 'Fall';
      return 'Winter';
    } else {
      if (month >= 3 && month <= 5) return 'Fall';
      if (month >= 6 && month <= 8) return 'Winter';
      if (month >= 9 && month <= 11) return 'Spring';
      return 'Summer';
    }
  }

  getGrowthRateMultiplier(temperature, crop) {
    const optimal = crop.requirements.temperature.optimal;
    const min = crop.requirements.temperature.minimum;
    const max = crop.requirements.temperature.maximum;
    
    if (temperature < min || temperature > max) return 1.2; // Slower growth
    if (Math.abs(temperature - optimal) <= 2) return 0.9; // Faster growth
    return 1.0; // Normal growth
  }

  /**
   * Calculate irrigation frequency based on live soil data and crop requirements
   * Enhanced with multi-source soil moisture data
   * @param {Object} satelliteData - Contains live soil moisture from multiple sources
   * @param {Object} crop - Crop requirements and characteristics
   * @returns {number} Irrigation frequency in days
   */
  calculateIrrigationFrequency(satelliteData, crop) {
    const basePrecipitation = satelliteData.precipitation.last7Days;
    const soilMoisture = satelliteData.soilMoisture.percentage;
    const soilMoistureSource = satelliteData.soilMoisture.source;
    const soilDepth = satelliteData.soilMoisture.depth;
    const confidence = satelliteData.soilMoisture.confidence || 0.7;
    
    console.log(`🌱 Calculating irrigation using LIVE soil data: ${soilMoisture}% moisture (${soilMoistureSource})`);
    
    // Get crop-specific soil moisture requirements
    const cropMinMoisture = crop.requirements?.soilMoisture?.minimum || 30;
    const cropOptimalMoisture = crop.requirements?.soilMoisture?.optimal || 50;
    const cropMaxMoisture = crop.requirements?.soilMoisture?.maximum || 80;
    
    // Base irrigation frequency calculation using live soil data
    let irrigationDays = 7; // Default weekly irrigation
    
    // Adjust based on current soil moisture relative to crop needs
    if (soilMoisture < cropMinMoisture) {
      // Critical: Soil moisture below crop minimum
      irrigationDays = 1; // Daily irrigation needed
      console.log(`🚨 CRITICAL: Soil moisture ${soilMoisture}% below crop minimum ${cropMinMoisture}% - Daily irrigation required`);
    } else if (soilMoisture < cropOptimalMoisture) {
      // Low: Below optimal but above minimum
      irrigationDays = Math.max(2, 5 - Math.floor((cropOptimalMoisture - soilMoisture) / 5));
      console.log(`⚠️ LOW: Soil moisture ${soilMoisture}% below optimal ${cropOptimalMoisture}% - Irrigation every ${irrigationDays} days`);
    } else if (soilMoisture <= cropMaxMoisture) {
      // Optimal: Within good range
      irrigationDays = 7; // Weekly irrigation sufficient
      console.log(`✅ OPTIMAL: Soil moisture ${soilMoisture}% in good range - Weekly irrigation sufficient`);
    } else {
      // Excessive: Above maximum, reduce irrigation
      irrigationDays = Math.min(14, 10 + Math.floor((soilMoisture - cropMaxMoisture) / 10));
      console.log(`💧 EXCESS: Soil moisture ${soilMoisture}% above maximum ${cropMaxMoisture}% - Reduce to every ${irrigationDays} days`);
    }
    
    // Adjust for recent precipitation
    if (basePrecipitation > 30) {
      irrigationDays = Math.min(irrigationDays * 1.5, 14); // Extend irrigation intervals
      console.log(`🌧️ Recent heavy rain (${basePrecipitation}mm) - Extending irrigation to every ${irrigationDays} days`);
    } else if (basePrecipitation < 5) {
      irrigationDays = Math.max(irrigationDays * 0.7, 1); // Increase irrigation frequency
      console.log(`☀️ Low recent rainfall (${basePrecipitation}mm) - Increasing irrigation to every ${irrigationDays} days`);
    }
    
    // Adjust based on data source confidence
    if (confidence < 0.6) {
      // Lower confidence data - be more conservative
      irrigationDays = Math.max(irrigationDays * 0.8, 2);
      console.log(`📊 Lower confidence data (${confidence}) - Conservative irrigation every ${irrigationDays} days`);
    } else if (confidence > 0.9) {
      // High confidence data - can be more precise
      console.log(`📊 High confidence data (${confidence}) - Precise irrigation scheduling`);
    }
    
    // Special adjustments for different soil depths
    if (soilDepth === '0-5cm' || soilDepth === '0-7cm') {
      // Shallow measurements need more frequent monitoring
      irrigationDays = Math.max(irrigationDays * 0.9, 1);
      console.log(`📏 Shallow soil measurement (${soilDepth}) - Slightly more frequent irrigation`);
    } else if (soilDepth === '0-100cm') {
      // Deep measurements allow longer intervals
      irrigationDays = Math.min(irrigationDays * 1.1, 10);
      console.log(`📏 Deep soil measurement (${soilDepth}) - Longer irrigation intervals possible`);
    }
    
    // Log the data source for tracking
    console.log(`📡 Soil data source: ${soilMoistureSource} (depth: ${soilDepth}, confidence: ${confidence})`);
    
    return Math.round(irrigationDays);
  }

  /**
   * Calculate precise water amount using live soil data and evapotranspiration
   * @param {Object} crop 
   * @param {number} area 
   * @param {Object} satelliteData 
   * @returns {number} Water amount in liters
   */
  calculateWaterAmount(crop, area, satelliteData) {
    const areaInSquareMeters = area * 4047; // Convert acres to m²
    const soilMoisture = satelliteData.soilMoisture.percentage;
    const precipitationLast7Days = satelliteData.precipitation.last7Days || 0;
    
    // Base water requirement (L/m²/week)
    const baseWaterNeed = crop.waterRequirement || 25;
    
    // Calculate water deficit based on live soil data
    const cropOptimalMoisture = crop.requirements?.soilMoisture?.optimal || 50;
    const moistureDeficit = Math.max(0, cropOptimalMoisture - soilMoisture);
    
    // Water needed to restore optimal moisture (simplified calculation)
    const deficitWaterNeed = moistureDeficit * 2; // 2L/m² per percentage point deficit
    
    // Precipitation adjustment - subtract recent rainfall
    const precipitationCredit = Math.min(precipitationLast7Days * 0.8, baseWaterNeed * 0.5);
    
    // Calculate total water need
    const totalWaterNeed = Math.max(
      baseWaterNeed - precipitationCredit + deficitWaterNeed,
      baseWaterNeed * 0.2 // Minimum 20% of base requirement
    );
    
    // Daily water amount
    const dailyWaterAmount = Math.round(totalWaterNeed * areaInSquareMeters / 7);
    
    console.log(`💧 Water calculation: Deficit=${moistureDeficit}%, Need=${totalWaterNeed}L/m²/week, Daily=${dailyWaterAmount}L`);
    
    return dailyWaterAmount;
  }

  /**
   * Generate precision irrigation schedule using live soil data
   * @param {Object} crop 
   * @param {number} area 
   * @param {Object} satelliteData 
   * @param {moment.Moment} startDate 
   * @param {moment.Moment} endDate 
   * @returns {Array} Detailed irrigation schedule
   */

  /**
   * Generate default fertilization schedule for crops without predefined schedule
   * @param {Object} crop 
   * @param {moment.Moment} plantDate 
   * @param {number} area 
   * @returns {Array} Default fertilization schedule
   */
  generateDefaultFertilizationSchedule(crop, plantDate, area) {
    const fertilizations = [];
    const growingPeriodDays = crop.growingPeriodDays || 120;
    
    // Base fertilization at planting
    fertilizations.push({
      date: plantDate.format('YYYY-MM-DD'),
      type: 'Base Fertilizer',
      nutrient: 'NPK 10-26-26',
      amountPerUnit: 50,
      totalAmount: Math.round(50 * area * 100) / 100,
      unit: 'kg/hectare',
      method: 'Broadcasting',
      instructions: 'Apply and incorporate into soil before planting',
      stage: 'Planting'
    });

    // Mid-season fertilization (at 30% of growing period)
    const midSeasonDate = plantDate.clone().add(Math.round(growingPeriodDays * 0.3), 'days');
    fertilizations.push({
      date: midSeasonDate.format('YYYY-MM-DD'),
      type: 'Side Dressing',
      nutrient: 'Urea (46-0-0)',
      amountPerUnit: 25,
      totalAmount: Math.round(25 * area * 100) / 100,
      unit: 'kg/hectare',
      method: 'Side dressing',
      instructions: 'Apply between rows and incorporate lightly',
      stage: 'Vegetative Growth'
    });

    // Late season fertilization (at 60% of growing period) if long-season crop
    if (growingPeriodDays > 90) {
      const lateSeasonDate = plantDate.clone().add(Math.round(growingPeriodDays * 0.6), 'days');
      fertilizations.push({
        date: lateSeasonDate.format('YYYY-MM-DD'),
        type: 'Foliar Feed',
        nutrient: 'Micronutrient Mix',
        amountPerUnit: 2,
        totalAmount: Math.round(2 * area * 100) / 100,
        unit: 'kg/hectare',
        method: 'Foliar spray',
        instructions: 'Apply during cool morning hours',
        stage: 'Reproductive Growth'
      });
    }

    return fertilizations;
  }

  /**
   * Generate precision irrigation schedule
   * @param {Object} crop 
   * @param {number} area 
   * @param {Object} satelliteData 
   * @param {moment.Moment} startDate 
   * @param {moment.Moment} endDate 
   * @returns {Array} Detailed irrigation schedule
   */
  generatePrecisionIrrigationSchedule(crop, area, satelliteData, startDate, endDate) {
    const schedule = [];
    const irrigationFrequency = this.calculateIrrigationFrequency(satelliteData, crop);
    const baseWaterAmount = this.calculateWaterAmount(crop, area, satelliteData);
    
    console.log(`🌱 Generating precision irrigation schedule with ${irrigationFrequency}-day intervals`);
    
    let currentDate = moment(startDate);
    let irrigationCounter = 0;
    
    while (currentDate.isBefore(endDate)) {
      const daysSinceStart = currentDate.diff(startDate, 'days');
      const growthStage = this.getGrowthStageAtDate(crop, startDate, currentDate);
      
      // Adjust water amount based on growth stage
      let stageWaterMultiplier = 1.0;
      switch (growthStage) {
        case 'Germination':
          stageWaterMultiplier = 1.2; // More water for germination
          break;
        case 'Vegetative':
        case 'Tillering':
          stageWaterMultiplier = 1.1; // Increased water for growth
          break;
        case 'Flowering':
        case 'Heading':
          stageWaterMultiplier = 1.3; // Maximum water for reproductive stage
          break;
        case 'Grain Filling':
          stageWaterMultiplier = 1.1; // Moderate water for grain development
          break;
        case 'Maturity':
          stageWaterMultiplier = 0.7; // Reduced water before harvest
          break;
        default:
          stageWaterMultiplier = 1.0;
      }
      
      // Calculate adjusted water amount
      const adjustedWaterAmount = Math.round(baseWaterAmount * stageWaterMultiplier);
      const waterDurationMinutes = Math.round(adjustedWaterAmount / 50); // Assume 50L/min flow rate
      
      // Determine irrigation method based on soil conditions
      let irrigationMethod = 'Surface irrigation recommended';
      const soilMoisture = satelliteData.soilMoisture.percentage;
      if (soilMoisture < 20) {
        irrigationMethod = 'Deep irrigation required - use drip or soaker hoses';
      } else if (soilMoisture > 70) {
        irrigationMethod = 'Light irrigation only - avoid overwatering';
      }
      
      schedule.push({
        date: currentDate.format('YYYY-MM-DD'),
        amount: adjustedWaterAmount,
        unit: 'liters',
        method: irrigationMethod,
        duration: waterDurationMinutes,
        timing: 'Early morning (6-8 AM) or evening (6-8 PM)',
        stage: growthStage,
        soilMoistureData: {
          currentLevel: soilMoisture,
          source: satelliteData.soilMoisture.source,
          targetLevel: crop.requirements?.soilMoisture?.optimal || 50
        },
        notes: this.generateIrrigationNotes(soilMoisture, growthStage, satelliteData)
      });
      
      irrigationCounter++;
      currentDate.add(irrigationFrequency, 'days');
    }
    
    console.log(`✅ Generated ${schedule.length} irrigation events using live soil data`);
    return schedule;
  }

  /**
   * Generate contextual irrigation notes based on live soil data
   * @param {number} soilMoisture 
   * @param {string} growthStage 
   * @param {Object} satelliteData 
   * @returns {string} Irrigation notes
   */
  generateIrrigationNotes(soilMoisture, growthStage, satelliteData) {
    const notes = [];
    const source = satelliteData.soilMoisture.source;
    
    // Soil moisture status notes
    if (soilMoisture < 20) {
      notes.push(`CRITICAL: Very low soil moisture (${soilMoisture}%) detected by ${source}`);
      notes.push('Monitor plants for wilting symptoms');
    } else if (soilMoisture < 30) {
      notes.push(`LOW: Soil moisture (${soilMoisture}%) below optimal range`);
    } else if (soilMoisture > 80) {
      notes.push(`HIGH: Risk of waterlogging (${soilMoisture}%) - ensure proper drainage`);
    }
    
    // Growth stage specific notes
    if (growthStage === 'Germination') {
      notes.push('Keep soil consistently moist for seed germination');
    } else if (growthStage === 'Flowering' || growthStage === 'Heading') {
      notes.push('Critical water period - do not allow water stress');
    } else if (growthStage === 'Maturity') {
      notes.push('Reduce irrigation to promote grain drying');
    }
    
    // Data source credibility note
    if (satelliteData.soilMoisture.confidence > 0.9) {
      notes.push(`High-confidence soil data from ${source}`);
    } else if (satelliteData.soilMoisture.confidence < 0.7) {
      notes.push(`Monitor actual soil conditions - ${source} data has lower confidence`);
    }
    
    return notes.join('. ');
  }

  calculateExpectedYield(crop, area, satelliteData) {
    const baseYield = crop.expectedYield || { amount: 3, unit: 'tons/hectare' };
    const areaInHectares = area * 0.4047; // Convert acres to hectares
    
    // Adjust yield based on satellite data
    let yieldMultiplier = 1.0;
    
    // Soil moisture impact
    const soilMoisture = satelliteData.soilMoisture.percentage;
    if (soilMoisture >= 40 && soilMoisture <= 70) yieldMultiplier *= 1.1;
    else if (soilMoisture < 30 || soilMoisture > 80) yieldMultiplier *= 0.8;
    
    // Vegetation health impact
    const ndvi = satelliteData.vegetationIndex.ndvi;
    if (ndvi > 0.6) yieldMultiplier *= 1.2;
    else if (ndvi < 0.3) yieldMultiplier *= 0.7;
    
    const estimatedTotal = baseYield.amount * areaInHectares * yieldMultiplier;
    
    return {
      amount: Math.round(estimatedTotal * 100) / 100,
      unit: baseYield.unit,
      confidence: Math.min(0.95, 0.6 + satelliteData.confidence * 0.3)
    };
  }

  getGrowthStageAtDate(crop, plantDate, targetDate) {
    const daysSincePlanting = targetDate.diff(plantDate, 'days');
    let cumulativeDays = 0;
    
    for (const stage of crop.growthStages) {
      cumulativeDays += stage.duration;
      if (daysSincePlanting <= cumulativeDays) {
        return stage.name;
      }
    }
    
    return 'Maturity';
  }

  calculateFertilizerCost(fertilizationSchedule) {
    // Simplified cost calculation
    return fertilizationSchedule.reduce((total, fert) => {
      const costPerUnit = this.getFertilizerCost(fert.type);
      return total + (fert.totalAmount * costPerUnit);
    }, 0);
  }

  getFertilizerCost(type) {
    const costs = {
      'NPK': 2.5, // per kg
      'Urea': 1.8,
      'Phosphate': 3.2,
      'Potash': 2.0,
      'Organic': 1.5
    };
    return costs[type] || 2.0;
  }

  // Assessment methods

  assessVegetationHealth(vegetationIndex) {
    const ndvi = vegetationIndex.ndvi;
    if (ndvi > 0.7) return { status: 'Excellent', score: 95, description: 'Very healthy vegetation in the area' };
    if (ndvi > 0.5) return { status: 'Good', score: 80, description: 'Healthy vegetation conditions' };
    if (ndvi > 0.3) return { status: 'Moderate', score: 60, description: 'Moderate vegetation activity' };
    return { status: 'Poor', score: 30, description: 'Low vegetation activity, may need soil improvement' };
  }

  assessSoilCondition(soilMoisture) {
    const moisture = soilMoisture.percentage;
    if (moisture >= 40 && moisture <= 70) return { status: 'Optimal', score: 90, description: 'Ideal soil moisture for most crops' };
    if (moisture >= 30 && moisture < 40) return { status: 'Good', score: 75, description: 'Good soil moisture, may need monitoring' };
    if (moisture >= 70 && moisture <= 80) return { status: 'High', score: 70, description: 'High soil moisture, ensure good drainage' };
    if (moisture < 30) return { status: 'Low', score: 40, description: 'Low soil moisture, irrigation recommended' };
    return { status: 'Excessive', score: 30, description: 'Excessive moisture, drainage required' };
  }

  assessWeatherSuitability(temperature, precipitation) {
    const temp = temperature.current;
    const precip = precipitation.last7Days;
    
    let score = 100;
    let issues = [];
    
    if (temp < 10) { score -= 30; issues.push('Temperature too low'); }
    else if (temp > 35) { score -= 20; issues.push('Temperature high'); }
    
    if (precip < 5) { score -= 15; issues.push('Low precipitation'); }
    else if (precip > 50) { score -= 20; issues.push('Excessive rainfall'); }
    
    if (score >= 85) return { status: 'Excellent', score, description: 'Ideal weather conditions' };
    if (score >= 70) return { status: 'Good', score, description: 'Generally favorable weather' };
    if (score >= 50) return { status: 'Moderate', score, description: 'Weather conditions require attention', issues };
    return { status: 'Poor', score, description: 'Challenging weather conditions', issues };
  }

  assessOverallReadiness(satelliteData, crop) {
    const vegHealth = this.assessVegetationHealth(satelliteData.vegetationIndex);
    const soilCondition = this.assessSoilCondition(satelliteData.soilMoisture);
    const weatherSuitability = this.assessWeatherSuitability(satelliteData.temperature, satelliteData.precipitation);
    
    const overallScore = (vegHealth.score + soilCondition.score + weatherSuitability.score) / 3;
    
    if (overallScore >= 80) return { status: 'Ready', score: overallScore, description: 'Conditions are favorable for planting' };
    if (overallScore >= 60) return { status: 'Mostly Ready', score: overallScore, description: 'Generally good conditions with minor concerns' };
    if (overallScore >= 40) return { status: 'Caution', score: overallScore, description: 'Some conditions need improvement' };
    return { status: 'Not Ready', score: overallScore, description: 'Multiple conditions need attention before planting' };
  }

  /**
   * Get list of supported crops
   * @returns {Array} List of supported crop types
   */
  getSupportedCrops() {
    return this.cropDatabase.crops.map(crop => ({
      name: crop.name,
      scientificName: crop.scientificName,
      category: crop.category,
      description: crop.description,
      growingPeriod: crop.growingPeriodDays,
      difficulty: crop.difficulty || 'Medium'
    }));
  }

  /**
   * Validate if location is suitable for agriculture
   * @param {Object} location 
   * @returns {Object} Validation result
   */
  async validateLocation(location) {
    const { latitude, longitude } = location;
    
    // Basic geographical validation
    const validationResult = {
      isValid: true,
      suitabilityScore: 100,
      warnings: [],
      recommendations: []
    };

    // Check for extreme latitudes
    if (Math.abs(latitude) > 65) {
      validationResult.suitabilityScore -= 40;
      validationResult.warnings.push('Extreme latitude - very short growing season');
      validationResult.recommendations.push('Consider greenhouse or protected cultivation');
    }

    // Check for desert regions (simplified logic)
    if ((latitude >= 15 && latitude <= 35) || (latitude >= -35 && latitude <= -15)) {
      if (Math.abs(longitude) < 60) { // Potential desert regions
        validationResult.suitabilityScore -= 20;
        validationResult.warnings.push('Potential arid climate - may require intensive irrigation');
        validationResult.recommendations.push('Ensure adequate water supply and irrigation infrastructure');
      }
    }

    // Check for very high altitudes (approximate)
    // In a real implementation, you would use elevation APIs
    if (validationResult.suitabilityScore < 50) {
      validationResult.isValid = false;
    }

    return validationResult;
  }

  /**
   * Get list of all supported crops
   * @returns {Array} Array of supported crop objects
   */
  getSupportedCrops() {
    return this.cropDatabase.crops.map(crop => ({
      name: crop.name,
      scientificName: crop.scientificName,
      category: crop.category,
      description: crop.description,
      difficulty: crop.difficulty,
      growingPeriodDays: crop.growingPeriodDays,
      // Add emoji based on crop type for the UI
      emoji: this.getCropEmoji(crop.name)
    }));
  }

  /**
   * Get emoji for crop type
   * @param {string} cropName - Name of the crop
   * @returns {string} Emoji representation
   */
  getCropEmoji(cropName) {
    const emojiMap = {
      'wheat': '🌾',
      'rice': '🌾',
      'corn': '🌽',
      'tomato': '🍅',
      'potato': '🥔',
      'onion': '🧅',
      'carrot': '🥕',
      'lettuce': '🥬',
      'spinach': '🥬',
      'cabbage': '🥬',
      'broccoli': '🥦',
      'cauliflower': '🥦',
      'pepper': '🌶️',
      'cucumber': '🥒',
      'eggplant': '🍆',
      'squash': '🎃',
      'pumpkin': '🎃',
      'beans': '🫘',
      'peas': '🟢',
      'sunflower': '🌻',
      'cotton': '☁️',
      'soybean': '🫘',
      'barley': '🌾',
      'oats': '🌾'
    };
    return emojiMap[cropName.toLowerCase()] || '🌱';
  }
}

module.exports = new CropCalendarService();
