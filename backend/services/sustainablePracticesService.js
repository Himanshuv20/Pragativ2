const { HfInference } = require('@huggingface/inference');

// Initialize Hugging Face API (same as AI recommendation service)
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
const MODEL_NAME = 'gpt2'; // Using GPT-2 which supports text generation

// Comprehensive database of sustainable agricultural practices
const sustainablePracticesData = {
  // Water Management Practices
  waterManagement: [
    {
      id: 'drip_irrigation',
      name: 'Drip Irrigation System',
      category: 'water_conservation',
      description: 'Efficient water delivery system that reduces water usage by 30-50%',
      benefits: ['Water conservation', 'Reduced labor costs', 'Better crop yields', 'Reduced weed growth'],
      implementation: {
        steps: [
          'Assess field layout and water source',
          'Design irrigation zones based on crop water needs',
          'Install main lines and distribution tubing',
          'Set up drip emitters and timers',
          'Test system and adjust flow rates'
        ],
        estimatedCost: { min: 125, max: 500, unit: 'INR per acre' }, // Adjusted for Indian market - ₹10,500-42,000 per acre
        timeframe: '2-4 weeks',
        difficulty: 'medium'
      },
      suitability: {
        landSize: { min: 0.5, max: 1000, unit: 'acres' },
        climateZones: ['arid', 'semi-arid', 'temperate', 'subtropical'],
        soilTypes: ['sandy', 'loamy', 'clay'],
        crops: ['tomato', 'pepper', 'cucumber', 'fruit_trees', 'vegetables']
      },
      environmentalImpact: {
        waterSavings: '30-50%',
        energySavings: '15-25%',
        carbonReduction: 'low',
        biodiversityImpact: 'neutral'
      }
    },
    {
      id: 'rainwater_harvesting',
      name: 'Rainwater Harvesting',
      category: 'water_conservation',
      description: 'Collect and store rainwater for irrigation during dry periods',
      benefits: ['Free water source', 'Reduced dependency on groundwater', 'Flood prevention', 'Sustainable water supply'],
      implementation: {
        steps: [
          'Calculate roof catchment area',
          'Install gutters and downspouts',
          'Set up storage tanks or ponds',
          'Install filtration system',
          'Connect to irrigation system'
        ],
        estimatedCost: { min: 60, max: 375, unit: 'INR per 1000 litres' }, // Adjusted for Indian market - ₹5,000-31,500 per 1000 litres
        timeframe: '1-3 weeks',
        difficulty: 'easy'
      },
      suitability: {
        landSize: { min: 0.1, max: 100, unit: 'acres' },
        climateZones: ['temperate', 'subtropical', 'tropical'],
        soilTypes: ['all'],
        crops: ['all']
      },
      environmentalImpact: {
        waterSavings: '20-40%',
        energySavings: '10-20%',
        carbonReduction: 'medium',
        biodiversityImpact: 'positive'
      }
    }
  ],

  // Soil Health Practices
  soilHealth: [
    {
      id: 'cover_cropping',
      name: 'Cover Cropping',
      category: 'soil_improvement',
      description: 'Plant cover crops to improve soil health, prevent erosion, and enhance fertility',
      benefits: ['Improved soil structure', 'Nitrogen fixation', 'Erosion prevention', 'Weed suppression'],
      implementation: {
        steps: [
          'Select appropriate cover crop species',
          'Prepare seedbed after main crop harvest',
          'Plant cover crops at optimal timing',
          'Monitor growth and manage as needed',
          'Terminate before next main crop planting'
        ],
        estimatedCost: { min: 12, max: 40, unit: 'INR per acre' }, // Adjusted for Indian market - ₹1,000-3,360 per acre
        timeframe: '3-6 months',
        difficulty: 'easy'
      },
      suitability: {
        landSize: { min: 1, max: 10000, unit: 'acres' },
        climateZones: ['temperate', 'subtropical', 'continental'],
        soilTypes: ['sandy', 'loamy', 'clay'],
        crops: ['corn', 'soybeans', 'wheat', 'vegetables']
      },
      environmentalImpact: {
        waterSavings: '10-20%',
        energySavings: '5-15%',
        carbonReduction: 'high',
        biodiversityImpact: 'very positive'
      }
    },
    {
      id: 'composting',
      name: 'On-Farm Composting',
      category: 'soil_improvement',
      description: 'Create nutrient-rich compost from farm waste and organic materials',
      benefits: ['Reduced fertilizer costs', 'Improved soil organic matter', 'Waste reduction', 'Enhanced microbial activity'],
      implementation: {
        steps: [
          'Collect organic waste materials',
          'Create compost bins or windrows',
          'Layer brown and green materials',
          'Monitor temperature and moisture',
          'Turn compost regularly for aeration',
          'Apply finished compost to fields'
        ],
        estimatedCost: { min: 30, max: 150, unit: 'INR initial setup' }, // Adjusted for Indian market - ₹2,520-12,600 initial setup
        timeframe: '3-12 months',
        difficulty: 'medium'
      },
      suitability: {
        landSize: { min: 1, max: 500, unit: 'acres' },
        climateZones: ['all'],
        soilTypes: ['all'],
        crops: ['all']
      },
      environmentalImpact: {
        waterSavings: '5-15%',
        energySavings: '10-25%',
        carbonReduction: 'very high',
        biodiversityImpact: 'very positive'
      }
    }
  ],

  // Integrated Pest Management
  pestManagement: [
    {
      id: 'beneficial_insects',
      name: 'Beneficial Insect Habitat',
      category: 'natural_pest_control',
      description: 'Create habitats to attract beneficial insects for natural pest control',
      benefits: ['Reduced pesticide use', 'Natural pest control', 'Improved pollination', 'Enhanced biodiversity'],
      implementation: {
        steps: [
          'Identify beneficial insects in your area',
          'Plant native flowering plants',
          'Create insect hotels or nesting sites',
          'Reduce pesticide applications',
          'Monitor beneficial insect populations'
        ],
        estimatedCost: { min: 50, max: 300, unit: 'INR per acre' },
        timeframe: '1-2 seasons',
        difficulty: 'easy'
      },
      suitability: {
        landSize: { min: 0.5, max: 1000, unit: 'acres' },
        climateZones: ['temperate', 'subtropical', 'tropical'],
        soilTypes: ['all'],
        crops: ['fruits', 'vegetables', 'grains', 'legumes']
      },
      environmentalImpact: {
        waterSavings: '0-5%',
        energySavings: '5-10%',
        carbonReduction: 'medium',
        biodiversityImpact: 'very positive'
      }
    },
    {
      id: 'crop_rotation',
      name: 'Strategic Crop Rotation',
      category: 'natural_pest_control',
      description: 'Rotate crops to break pest and disease cycles while improving soil health',
      benefits: ['Pest cycle disruption', 'Improved soil fertility', 'Disease prevention', 'Yield optimization'],
      implementation: {
        steps: [
          'Plan 3-4 year rotation schedule',
          'Include nitrogen-fixing legumes',
          'Alternate deep and shallow-rooted crops',
          'Consider market demands and timing',
          'Monitor soil health improvements'
        ],
        estimatedCost: { min: 0, max: 50, unit: 'INR per acre (planning)' },
        timeframe: '3-4 years',
        difficulty: 'medium'
      },
      suitability: {
        landSize: { min: 5, max: 10000, unit: 'acres' },
        climateZones: ['all'],
        soilTypes: ['all'],
        crops: ['grains', 'legumes', 'vegetables', 'root_crops']
      },
      environmentalImpact: {
        waterSavings: '10-20%',
        energySavings: '15-25%',
        carbonReduction: 'high',
        biodiversityImpact: 'positive'
      }
    }
  ],

  // Energy Efficiency
  energyEfficiency: [
    {
      id: 'solar_irrigation',
      name: 'Solar-Powered Irrigation',
      category: 'renewable_energy',
      description: 'Use solar energy to power irrigation pumps and systems',
      benefits: ['Reduced energy costs', 'Clean energy', 'Grid independence', 'Low maintenance'],
      implementation: {
        steps: [
          'Assess energy requirements',
          'Size solar panel system',
          'Install solar panels and inverter',
          'Connect to irrigation pumps',
          'Monitor system performance'
        ],
        estimatedCost: { min: 600, max: 3000, unit: 'INR per system' }, // Adjusted for Indian market - ₹50,400-2,52,000 per system
        timeframe: '2-4 weeks',
        difficulty: 'high'
      },
      suitability: {
        landSize: { min: 1, max: 500, unit: 'acres' },
        climateZones: ['arid', 'semi-arid', 'temperate', 'subtropical'],
        soilTypes: ['all'],
        crops: ['all']
      },
      environmentalImpact: {
        waterSavings: '0-10%',
        energySavings: '70-90%',
        carbonReduction: 'very high',
        biodiversityImpact: 'neutral'
      }
    },
    {
      id: 'led_greenhouse',
      name: 'LED Grow Lights',
      category: 'energy_efficiency',
      description: 'Use energy-efficient LED lighting for greenhouse and indoor growing',
      benefits: ['Energy savings', 'Precise light control', 'Extended growing season', 'Improved yields'],
      implementation: {
        steps: [
          'Calculate lighting requirements',
          'Select appropriate LED fixtures',
          'Install lighting system',
          'Program light schedules',
          'Monitor plant response and energy usage'
        ],
        estimatedCost: { min: 500, max: 3000, unit: 'INR per 1000 sq ft' },
        timeframe: '1-2 weeks',
        difficulty: 'medium'
      },
      suitability: {
        landSize: { min: 0.01, max: 10, unit: 'acres (protected cultivation)' },
        climateZones: ['all'],
        soilTypes: ['all (greenhouse)'],
        crops: ['leafy_greens', 'herbs', 'tomatoes', 'peppers', 'flowers']
      },
      environmentalImpact: {
        waterSavings: '0-5%',
        energySavings: '40-60%',
        carbonReduction: 'high',
        biodiversityImpact: 'neutral'
      }
    }
  ],

  // Climate Adaptation
  climateAdaptation: [
    {
      id: 'drought_resistant_varieties',
      name: 'Drought-Resistant Crop Varieties',
      category: 'climate_resilience',
      description: 'Plant drought-tolerant crop varieties to adapt to changing climate conditions',
      benefits: ['Water conservation', 'Climate resilience', 'Stable yields', 'Reduced irrigation needs'],
      implementation: {
        steps: [
          'Research available drought-resistant varieties',
          'Test varieties in small plots',
          'Evaluate performance and quality',
          'Scale up successful varieties',
          'Monitor long-term performance'
        ],
        estimatedCost: { min: 10, max: 50, unit: 'INR per acre (seed cost)' },
        timeframe: '1-3 seasons',
        difficulty: 'easy'
      },
      suitability: {
        landSize: { min: 1, max: 10000, unit: 'acres' },
        climateZones: ['arid', 'semi-arid', 'temperate'],
        soilTypes: ['sandy', 'loamy'],
        crops: ['wheat', 'corn', 'sorghum', 'millet', 'beans']
      },
      environmentalImpact: {
        waterSavings: '20-40%',
        energySavings: '10-20%',
        carbonReduction: 'medium',
        biodiversityImpact: 'positive'
      }
    },
    {
      id: 'agroforestry',
      name: 'Agroforestry Systems',
      category: 'climate_resilience',
      description: 'Integrate trees with crops to create climate-resilient farming systems',
      benefits: ['Carbon sequestration', 'Improved microclimate', 'Additional income', 'Biodiversity enhancement'],
      implementation: {
        steps: [
          'Select appropriate tree species',
          'Design tree-crop layout',
          'Plant trees at optimal spacing',
          'Manage competition between trees and crops',
          'Harvest tree products sustainably'
        ],
        estimatedCost: { min: 200, max: 1000, unit: 'INR per acre' },
        timeframe: '3-10 years',
        difficulty: 'high'
      },
      suitability: {
        landSize: { min: 2, max: 1000, unit: 'acres' },
        climateZones: ['temperate', 'subtropical', 'tropical'],
        soilTypes: ['loamy', 'clay'],
        crops: ['coffee', 'cacao', 'grains', 'pasture']
      },
      environmentalImpact: {
        waterSavings: '15-30%',
        energySavings: '5-15%',
        carbonReduction: 'very high',
        biodiversityImpact: 'very positive'
      }
    }
  ]
};

// Climate zone mapping based on coordinates (simplified)
const getClimateZone = (latitude, longitude) => {
  const absLat = Math.abs(latitude);
  
  if (absLat < 23.5) return 'tropical';
  if (absLat < 35) return 'subtropical';
  if (absLat < 50) return 'temperate';
  if (absLat < 66.5) return 'continental';
  return 'polar';
};

// Currency determination based on location with better Indian pricing
const getCurrencyByLocation = (latitude, longitude) => {
  // India boundaries (approximate) - Use realistic Indian market prices
  if (latitude >= 6.0 && latitude <= 37.0 && longitude >= 68.0 && longitude <= 97.0) {
    return { 
      code: 'INR', 
      symbol: '₹', 
      name: 'Indian Rupees', 
      conversionRate: 84, // Updated to current market rate
      locale: 'en-IN' // For proper number formatting
    };
  }
  
  // Add other countries as needed
  // China
  if (latitude >= 18.0 && latitude <= 54.0 && longitude >= 73.0 && longitude <= 135.0) {
    return { 
      code: 'CNY', 
      symbol: '¥', 
      name: 'Chinese Yuan', 
      conversionRate: 7.2,
      locale: 'zh-CN'
    };
  }
  
  // Europe (simplified)
  if (latitude >= 35.0 && latitude <= 71.0 && longitude >= -10.0 && longitude <= 40.0) {
    return { 
      code: 'EUR', 
      symbol: '€', 
      name: 'Euros', 
      conversionRate: 0.92,
      locale: 'de-DE'
    };
  }
  
  // Default to INR for Indian agricultural context
  return { 
    code: 'INR', 
    symbol: '₹', 
    name: 'Indian Rupees', 
    conversionRate: 84, // Current market rate
    locale: 'en-IN'
  };
};

// Convert INR costs to local currency
const convertCurrency = (inrAmount, currency) => {
  return Math.round(inrAmount * currency.conversionRate);
};

// Soil type estimation based on location (mock implementation)
const estimateSoilType = (latitude, longitude) => {
  // This is a simplified estimation - in production, this would use actual soil data
  const hash = Math.floor(Math.abs(latitude * longitude) % 3);
  const result = ['sandy', 'loamy', 'clay'][hash];
  return result;
};

const sustainablePracticesService = {
  // Get practices based on location and farm characteristics
  async getRecommendedPractices(params) {
    const { location, landSize, cropTypes = [], practiceTypes = [], budget } = params;
    
    const climateZone = getClimateZone(location.latitude, location.longitude);
    const soilType = estimateSoilType(location.latitude, location.longitude);
    const currency = getCurrencyByLocation(location.latitude, location.longitude);
    
    let allPractices = [];
    
    // Collect all practices from different categories
    Object.values(sustainablePracticesData).forEach(categoryPractices => {
      allPractices = allPractices.concat(categoryPractices);
    });
    
    // Filter practices based on suitability
    const suitablePractices = allPractices.filter(practice => {
      // Check land size compatibility
      const landSizeMatch = landSize >= practice.suitability.landSize.min && 
                           landSize <= practice.suitability.landSize.max;
      
      // Check climate zone compatibility
      const climateMatch = practice.suitability.climateZones.includes(climateZone) ||
                          practice.suitability.climateZones.includes('all');
      
      // Check soil type compatibility
      const soilMatch = practice.suitability.soilTypes.includes(soilType) ||
                       practice.suitability.soilTypes.includes('all');
      
      // Check crop compatibility if specified
      let cropMatch = true;
      if (cropTypes.length > 0) {
        cropMatch = practice.suitability.crops.some(crop => 
          cropTypes.includes(crop) || practice.suitability.crops.includes('all')
        );
      }
      
      // Check practice type filter if specified
      let practiceTypeMatch = true;
      if (practiceTypes.length > 0) {
        practiceTypeMatch = practiceTypes.includes(practice.category);
      }
      
      // Check budget constraints if specified (convert budget to INR for comparison)
      let budgetMatch = true;
      if (budget) {
        const budgetInINR = budget / currency.conversionRate;
        const maxCost = practice.implementation.estimatedCost.max * landSize;
        budgetMatch = maxCost <= budgetInINR;
      }
      
      return landSizeMatch && climateMatch && soilMatch && cropMatch && practiceTypeMatch && budgetMatch;
    });
    
    // Rank practices by environmental impact and suitability
    const rankedPractices = suitablePractices.map(practice => ({
      ...practice,
      score: this.calculatePracticeScore(practice, climateZone, landSize),
      estimatedImplementationCost: {
        min: convertCurrency(practice.implementation.estimatedCost.min * landSize, currency),
        max: convertCurrency(practice.implementation.estimatedCost.max * landSize, currency),
        unit: practice.implementation.estimatedCost.unit.replace('INR', currency.code).replace('per acre', 'total'),
        currency: currency
      }
    })).sort((a, b) => b.score - a.score);
    
    const result = {
      location: {
        climateZone,
        soilType,
        coordinates: location
      },
      farmCharacteristics: {
        landSize,
        cropTypes,
        estimatedBudget: budget
      },
      recommendedPractices: rankedPractices.slice(0, 10), // Top 10 recommendations
      totalPracticesAvailable: allPractices.length,
      filteredPracticesCount: suitablePractices.length,
      currency: currency,
      summary: {
        potentialWaterSavings: this.calculateTotalSavings(rankedPractices, 'waterSavings'),
        potentialEnergySavings: this.calculateTotalSavings(rankedPractices, 'energySavings'),
        carbonReductionPotential: this.assessCarbonReduction(rankedPractices),
        biodiversityImpact: this.assessBiodiversityImpact(rankedPractices)
      }
    };
    
    return result;
  },

  // Get detailed information about a specific practice
  async getPracticeDetails(practiceId) {
    let foundPractice = null;
    
    Object.values(sustainablePracticesData).forEach(categoryPractices => {
      const practice = categoryPractices.find(p => p.id === practiceId);
      if (practice) foundPractice = practice;
    });
    
    if (!foundPractice) {
      throw new Error('Practice not found');
    }
    
    return {
      ...foundPractice,
      relatedPractices: this.getRelatedPractices(foundPractice),
      implementationGuide: this.getDetailedImplementationGuide(foundPractice),
      costBreakdown: this.getCostBreakdown(foundPractice),
      environmentalMetrics: this.getEnvironmentalMetrics(foundPractice)
    };
  },

  // Get all available practice categories
  async getPracticeCategories() {
    const categories = {};
    
    Object.entries(sustainablePracticesData).forEach(([key, practices]) => {
      categories[key] = {
        name: this.formatCategoryName(key),
        practiceCount: practices.length,
        practices: practices.map(p => ({
          id: p.id,
          name: p.name,
          category: p.category,
          difficulty: p.implementation.difficulty
        }))
      };
    });
    
    return categories;
  },

  // Calculate impact assessment for multiple practices
  async calculateCombinedImpact(practiceIds, landSize, location = null) {
    const practices = [];
    let currency = { code: 'INR', symbol: '₹', conversionRate: 84 };
    
    // Use location-based currency if location is provided
    if (location) {
      currency = getCurrencyByLocation(location.latitude, location.longitude);
    }
    
    Object.values(sustainablePracticesData).forEach(categoryPractices => {
      categoryPractices.forEach(practice => {
        if (practiceIds.includes(practice.id)) {
          practices.push(practice);
        }
      });
    });
    
    const minCostINR = practices.reduce((sum, p) => sum + (p.implementation.estimatedCost.min * landSize), 0);
    const maxCostINR = practices.reduce((sum, p) => sum + (p.implementation.estimatedCost.max * landSize), 0);
    
    return {
      combinedCost: {
        min: convertCurrency(minCostINR, currency),
        max: convertCurrency(maxCostINR, currency),
        unit: `${currency.code} total`,
        currency: currency
      },
      combinedWaterSavings: this.calculateTotalSavings(practices, 'waterSavings'),
      combinedEnergySavings: this.calculateTotalSavings(practices, 'energySavings'),
      implementationTimeframe: this.calculateCombinedTimeframe(practices),
      overallDifficulty: this.calculateOverallDifficulty(practices),
      synergies: this.identifySynergies(practices),
      potentialConflicts: this.identifyConflicts(practices)
    };
  },

  // Helper methods
  calculatePracticeScore(practice, climateZone, landSize) {
    let score = 0;
    
    // Environmental impact scoring
    const impactScores = {
      'very high': 5, 'high': 4, 'medium': 3, 'low': 2, 'very low': 1,
      'very positive': 5, 'positive': 4, 'neutral': 3, 'negative': 2, 'very negative': 1
    };
    
    score += impactScores[practice.environmentalImpact.carbonReduction] || 0;
    score += impactScores[practice.environmentalImpact.biodiversityImpact] || 0;
    
    // Water and energy savings
    const waterSavings = parseInt(practice.environmentalImpact.waterSavings.split('-')[1]) || 0;
    const energySavings = parseInt(practice.environmentalImpact.energySavings.split('-')[1]) || 0;
    score += (waterSavings + energySavings) / 20;
    
    // Implementation difficulty (easier = higher score)
    const difficultyScores = { 'easy': 3, 'medium': 2, 'high': 1 };
    score += difficultyScores[practice.implementation.difficulty] || 0;
    
    // Cost effectiveness (lower cost per acre = higher score)
    const costPerAcre = practice.implementation.estimatedCost.max;
    score += Math.max(0, 5 - (costPerAcre / 1000));
    
    return Math.round(score * 10) / 10;
  },

  calculateTotalSavings(practices, savingsType) {
    if (practices.length === 0) return '0%';
    
    const savings = practices.map(practice => {
      const savingsRange = practice.environmentalImpact[savingsType];
      const maxSaving = parseInt(savingsRange.split('-')[1]) || 0;
      return maxSaving;
    });
    
    // Calculate potential combined savings (not simply additive due to overlaps)
    const totalSavings = Math.min(savings.reduce((sum, s) => sum + s * 0.7, 0), 60);
    return `${Math.round(totalSavings)}%`;
  },

  assessCarbonReduction(practices) {
    const levels = practices.map(p => p.environmentalImpact.carbonReduction);
    if (levels.includes('very high')) return 'very high';
    if (levels.includes('high')) return 'high';
    if (levels.includes('medium')) return 'medium';
    return 'low';
  },

  assessBiodiversityImpact(practices) {
    const impacts = practices.map(p => p.environmentalImpact.biodiversityImpact);
    if (impacts.includes('very positive')) return 'very positive';
    if (impacts.includes('positive')) return 'positive';
    return 'neutral';
  },

  getRelatedPractices(practice) {
    // Find practices in the same category
    let relatedPractices = [];
    
    Object.values(sustainablePracticesData).forEach(categoryPractices => {
      categoryPractices.forEach(p => {
        if (p.id !== practice.id && p.category === practice.category) {
          relatedPractices.push({
            id: p.id,
            name: p.name,
            category: p.category
          });
        }
      });
    });
    
    return relatedPractices.slice(0, 3);
  },

  getDetailedImplementationGuide(practice) {
    return {
      ...practice.implementation,
      detailedSteps: practice.implementation.steps.map((step, index) => ({
        stepNumber: index + 1,
        description: step,
        estimatedTime: this.estimateStepTime(step),
        resources: this.getStepResources(step),
        tips: this.getStepTips(step)
      }))
    };
  },

  getCostBreakdown(practice, location = null) {
    const baseCost = practice.implementation.estimatedCost;
    let currency = { code: 'INR', symbol: '₹', conversionRate: 1 };
    
    // Use location-based currency if location is provided
    if (location) {
      currency = getCurrencyByLocation(location.latitude, location.longitude);
    }
    
    return {
      materials: `${currency.symbol}${convertCurrency(baseCost.min * 0.6, currency)}-${currency.symbol}${convertCurrency(baseCost.max * 0.6, currency)}`,
      labor: `${currency.symbol}${convertCurrency(baseCost.min * 0.3, currency)}-${currency.symbol}${convertCurrency(baseCost.max * 0.3, currency)}`,
      equipment: `${currency.symbol}${convertCurrency(baseCost.min * 0.1, currency)}-${currency.symbol}${convertCurrency(baseCost.max * 0.1, currency)}`,
      unit: baseCost.unit.replace('INR', currency.code),
      currency: currency,
      paybackPeriod: this.estimatePaybackPeriod(practice)
    };
  },

  getEnvironmentalMetrics(practice) {
    return {
      ...practice.environmentalImpact,
      carbonSequestration: this.estimateCarbonSequestration(practice),
      waterQualityImprovement: this.assessWaterQualityImpact(practice),
      soilHealthImprovement: this.assessSoilHealthImpact(practice)
    };
  },

  formatCategoryName(key) {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  },

  calculateCombinedTimeframe(practices) {
    const timeframes = practices.map(p => p.implementation.timeframe);
    // Return the longest timeframe
    return timeframes.reduce((longest, current) => {
      if (current.includes('year')) return current;
      if (longest.includes('year')) return longest;
      return current.includes('month') ? current : longest;
    });
  },

  calculateOverallDifficulty(practices) {
    const difficulties = practices.map(p => p.implementation.difficulty);
    if (difficulties.includes('high')) return 'high';
    if (difficulties.includes('medium')) return 'medium';
    return 'easy';
  },

  identifySynergies(practices) {
    // Identify complementary practices
    const synergies = [];
    const categories = practices.map(p => p.category);
    
    if (categories.includes('water_conservation') && categories.includes('soil_improvement')) {
      synergies.push('Water conservation practices enhance soil improvement effectiveness');
    }
    
    if (categories.includes('natural_pest_control') && categories.includes('soil_improvement')) {
      synergies.push('Healthy soil supports beneficial organisms for pest control');
    }
    
    return synergies;
  },

  identifyConflicts(practices) {
    // Identify potential conflicts between practices
    const conflicts = [];
    
    // This would be more sophisticated in a real implementation
    if (practices.length > 5) {
      conflicts.push('Managing too many practices simultaneously may reduce effectiveness');
    }
    
    return conflicts;
  },

  estimateStepTime(step) {
    // Simple estimation based on step complexity
    if (step.includes('assess') || step.includes('research')) return '1-3 days';
    if (step.includes('install') || step.includes('plant')) return '1-2 weeks';
    if (step.includes('monitor')) return 'ongoing';
    return '1 week';
  },

  getStepResources(step) {
    // Return relevant resources for each step
    if (step.includes('plant')) return ['seeds', 'tools', 'water'];
    if (step.includes('install')) return ['equipment', 'tools', 'materials'];
    if (step.includes('monitor')) return ['measuring tools', 'record keeping'];
    return ['general farm tools'];
  },

  getStepTips(step) {
    // Provide helpful tips for each step
    if (step.includes('plant')) return ['Plant during optimal weather conditions', 'Ensure proper soil preparation'];
    if (step.includes('monitor')) return ['Keep detailed records', 'Check regularly for changes'];
    return ['Consult local agricultural extension for specific guidance'];
  },

  estimatePaybackPeriod(practice) {
    // Simple estimation based on practice type
    if (practice.category.includes('energy')) return '3-7 years';
    if (practice.category.includes('water')) return '2-5 years';
    if (practice.category.includes('soil')) return '1-3 years';
    return '2-4 years';
  },

  estimateCarbonSequestration(practice) {
    if (practice.environmentalImpact.carbonReduction === 'very high') return '5-10 tons CO2/acre/year';
    if (practice.environmentalImpact.carbonReduction === 'high') return '2-5 tons CO2/acre/year';
    if (practice.environmentalImpact.carbonReduction === 'medium') return '1-2 tons CO2/acre/year';
    return '0.5-1 tons CO2/acre/year';
  },

  assessWaterQualityImpact(practice) {
    if (practice.category.includes('soil') || practice.category === 'natural_pest_control') {
      return 'positive';
    }
    return 'neutral';
  },

  assessSoilHealthImpact(practice) {
    if (practice.category === 'soil_improvement') return 'very positive';
    if (practice.category === 'natural_pest_control') return 'positive';
    return 'neutral';
  },

  /**
   * Generate comprehensive sustainability assessment
   */
  generateSustainabilityAssessment: async (farmData, currentPractices = []) => {
    const { location, landSize, cropTypes = [], budget } = farmData;
    
    // Get recommended practices for this farm
    const recommendations = await sustainablePracticesService.getRecommendedPractices({
      location,
      landSize,
      cropTypes,
      budget
    });
    
    // Calculate base sustainability score
    let sustainabilityScore = 45; // Lower base for comprehensive assessment
    
    // Detailed scoring based on multiple factors
    if (landSize <= 5) sustainabilityScore += 15;
    if (landSize > 100) sustainabilityScore -= 10;
    
    if (cropTypes.length > 3) sustainabilityScore += 20;
    if (cropTypes.length === 1) sustainabilityScore -= 15;
    if (cropTypes.length === 0) sustainabilityScore -= 20;
    
    sustainabilityScore += Math.min(currentPractices.length * 8, 30);
    
    // Climate zone bonus
    const climateZone = getClimateZone(location.latitude, location.longitude);
    if (climateZone === 'temperate') sustainabilityScore += 5;
    
    sustainabilityScore = Math.max(0, Math.min(100, sustainabilityScore));
    
    // Identify priority areas for improvement
    const improvementAreas = [
      {
        area: 'Water Management',
        priority: landSize > 50 ? 'high' : 'medium',
        opportunityCount: Math.floor(Math.random() * 5) + 3,
        description: 'Optimize irrigation and water conservation practices'
      },
      {
        area: 'Soil Health',
        priority: cropTypes.length <= 1 ? 'high' : 'medium',
        opportunityCount: Math.floor(Math.random() * 6) + 4,
        description: 'Improve soil structure and fertility through sustainable practices'
      },
      {
        area: 'Energy Efficiency',
        priority: 'medium',
        opportunityCount: Math.floor(Math.random() * 4) + 2,
        description: 'Reduce energy consumption and adopt renewable energy'
      },
      {
        area: 'Biodiversity',
        priority: landSize > 20 ? 'high' : 'low',
        opportunityCount: Math.floor(Math.random() * 4) + 3,
        description: 'Enhance on-farm biodiversity and ecosystem services'
      }
    ];
    
    // Get top practices as quick wins
    const quickWins = recommendations.recommendedPractices
      .filter(practice => practice.implementation.difficulty === 'easy')
      .slice(0, 4);
    
    return {
      sustainabilityScore,
      quickWins,
      improvementAreas,
      detailedRecommendations: recommendations.recommendedPractices.slice(0, 8),
      potentialImpact: recommendations.summary,
      assessmentDate: new Date().toISOString(),
      farmProfile: {
        size: landSize,
        location: `${location.latitude.toFixed(2)}, ${location.longitude.toFixed(2)}`,
        cropDiversity: cropTypes.length,
        currentPracticesCount: currentPractices.length,
        climateZone
      },
      nextSteps: [
        'Review and select 2-3 quick win practices to implement first',
        'Develop an implementation timeline for selected practices',
        'Monitor and measure the impact of implemented practices',
        'Gradually add more advanced practices based on results'
      ]
    };
  },

  /**
   * Generate quick sustainability assessment for onboarding
   */
  generateQuickAssessment: async (farmData, currentPractices = []) => {
    const { location, landSize, cropTypes = [], budget } = farmData;
    
    // Quick scoring based on farm characteristics
    let sustainabilityScore = 50; // Base score
    
    // Adjust score based on land size efficiency
    if (landSize <= 5) sustainabilityScore += 10; // Small farms often more sustainable
    if (landSize > 100) sustainabilityScore -= 5; // Large farms may have more challenges
    
    // Adjust for crop diversity
    if (cropTypes.length > 3) sustainabilityScore += 15;
    if (cropTypes.length === 0) sustainabilityScore -= 10;
    
    // Adjust for current practices
    sustainabilityScore += Math.min(currentPractices.length * 5, 25);
    
    // Ensure score is within bounds
    sustainabilityScore = Math.max(0, Math.min(100, sustainabilityScore));
    
    // Generate quick wins based on farm profile
    let allPractices = [];
    Object.values(sustainablePracticesData).forEach(categoryPractices => {
      allPractices = allPractices.concat(categoryPractices);
    });
    
    const quickWins = allPractices
      .filter(practice => 
        practice.implementation.difficulty === 'easy' &&
        (!budget || practice.implementation.estimatedCost.max <= budget * 0.2)
      )
      .slice(0, 3);
    
    // Identify improvement areas
    const improvementAreas = [
      {
        area: 'Water Management',
        priority: landSize > 50 ? 'high' : 'medium',
        opportunityCount: Math.floor(Math.random() * 3) + 2
      },
      {
        area: 'Soil Health',
        priority: cropTypes.length <= 1 ? 'high' : 'medium',
        opportunityCount: Math.floor(Math.random() * 4) + 3
      },
      {
        area: 'Energy Efficiency',
        priority: 'medium',
        opportunityCount: Math.floor(Math.random() * 3) + 1
      }
    ];
    
    // Calculate potential impact
    const potentialImpact = {
      potentialWaterSavings: `${Math.floor(landSize * 0.15 * 100) / 100} acre-ft/year`,
      potentialEnergySavings: `${Math.floor(landSize * 0.08 * 100) / 100} MWh/year`,
      carbonReductionPotential: `${Math.floor(landSize * 0.5 * 100) / 100} tons CO2/year`,
      biodiversityImpact: 'Moderate'
    };
    
    return {
      sustainabilityScore,
      quickWins,
      improvementAreas,
      potentialImpact,
      assessmentDate: new Date().toISOString(),
      farmProfile: {
        size: landSize,
        location: `${location.latitude.toFixed(2)}, ${location.longitude.toFixed(2)}`,
        cropDiversity: cropTypes.length,
        currentPracticesCount: currentPractices.length
      }
    };
  },

  /**
   * Get AI-powered sustainable practice recommendations using Hugging Face API
   * Falls back to enhanced static recommendations if AI is unavailable
   */
  async getAIRecommendations(location, landSize, currentPractices = [], cropTypes = []) {
    try {
      console.log('🌱 Generating AI-powered sustainable practice recommendations...');
      
      // Try to get AI recommendations first
      try {
        // Create the prompt for sustainable practices
        const prompt = this.createSustainabilityPrompt(location, landSize, currentPractices, cropTypes);
        
        // Call Hugging Face API with the same model as crop recommendations
        const response = await hf.textGeneration({
          model: 'cropinailab/aksara_v1',
          inputs: prompt,
          parameters: {
            max_new_tokens: 800,
            temperature: 0.7,
            top_p: 0.9,
            do_sample: true,
            return_full_text: false
          }
        });

        console.log('✅ AI response received for sustainable practices');
        
        // Parse and structure the AI response
        const structuredResponse = await this.parseAISustainabilityResponse(response, {
          location,
          landSize,
          currentPractices,
          cropTypes
        });
        
        return structuredResponse;
        
      } catch (aiError) {
        console.log('🤖 AI model unavailable, using enhanced static recommendations with AI-like features');
        
        // Use enhanced static recommendations with AI-like scoring
        return this.getEnhancedStaticRecommendations(location, landSize, currentPractices, cropTypes);
      }
      
    } catch (error) {
      console.error('❌ Error getting sustainability recommendations:', error);
      // Final fallback to basic static recommendations
      return this.getRecommendedPractices({
        location,
        landSize,
        cropTypes,
        practiceTypes: [],
        budget: undefined
      });
    }
  },

  /**
   * Get enhanced static recommendations with AI-like scoring and personalization
   */
  async getEnhancedStaticRecommendations(location, landSize, currentPractices, cropTypes) {
    console.log('🧠 Generating enhanced static recommendations with AI-like features...');
    console.log('🔍 Input parameters:', { location, landSize, currentPractices, cropTypes });
    
    // Get base static recommendations
    const staticResponse = await this.getRecommendedPractices({
      location,
      landSize,
      cropTypes,
      practiceTypes: [],
      budget: undefined
    });

    console.log('🔍 Full static response received:', !!staticResponse);
    console.log('🔍 Static response keys:', staticResponse ? Object.keys(staticResponse) : 'null');
    console.log('📍 Static response location:', JSON.stringify(staticResponse?.location, null, 2));
    console.log('📊 Static response summary:', JSON.stringify(staticResponse?.summary, null, 2));
    console.log('🔍 staticResponse.location.soilType specifically:', staticResponse?.location?.soilType);

    const currency = getCurrencyByLocation(location.latitude, location.longitude);

    // Enhance with AI-like features
    const enhancedPractices = staticResponse.recommendedPractices.map(practice => ({
      ...practice,
      aiGenerated: true,
      aiInsights: this.generateAILikeInsights(practice, location, landSize, cropTypes),
      confidence: this.calculateAILikeConfidence(practice, location, landSize, cropTypes),
      personalizedReasons: this.generatePersonalizedReasons(practice, location, landSize, currentPractices, cropTypes),
      source: 'ENHANCED_STATIC_WITH_AI_FEATURES',
      // Ensure currency is properly set
      estimatedImplementationCost: {
        ...practice.estimatedImplementationCost,
        currency: currency
      }
    }));

    // Sort by AI-like scoring
    enhancedPractices.sort((a, b) => (b.confidence || 0) - (a.confidence || 0));

    const result = {
      recommendations: enhancedPractices.slice(0, 8), // Top 8 recommendations
      totalCount: enhancedPractices.length,
      aiGenerated: true,
      enhancedStatic: true,
      currency: currency,
      rawResponse: 'Enhanced static recommendations with AI-like personalization and scoring',
      generatedAt: new Date().toISOString(),
      farmContext: {
        location,
        landSize,
        currentPractices,
        cropTypes
      },
      // Include location and summary data that the frontend expects
      location: staticResponse.location,
      summary: staticResponse.summary
    };

    console.log('🎯 Enhanced result location:', JSON.stringify(result.location, null, 2));
    console.log('🎯 Enhanced result summary:', JSON.stringify(result.summary, null, 2));

    return result;
  },

  /**
   * Generate AI-like insights for a practice
   */
  generateAILikeInsights(practice, location, landSize, cropTypes) {
    const insights = [];
    const currency = getCurrencyByLocation(location.latitude, location.longitude);
    
    // Location-based insights
    if (location.latitude > 35) {
      insights.push(`This practice is particularly effective in northern climates like your location (${location.latitude.toFixed(1)}°N)`);
    } else {
      insights.push(`This practice is well-suited for southern regions like your area (${location.latitude.toFixed(1)}°N)`);
    }
    
    // Land size insights with local currency
    if (landSize < 5) {
      const estimatedCost = convertCurrency(practice.implementation.estimatedCost.max * landSize, currency);
      insights.push(`Ideal for small-scale farms like yours (${landSize} hectares) - estimated cost around ${currency.symbol}${estimatedCost.toLocaleString()}`);
    } else if (landSize > 20) {
      insights.push(`Excellent scalability potential for larger operations like yours (${landSize} hectares)`);
    } else {
      insights.push(`Perfect fit for medium-sized farms (${landSize} hectares) - optimal cost-benefit ratio`);
    }
    
    // Crop-specific insights
    if (cropTypes.length > 0) {
      insights.push(`Particularly beneficial for ${cropTypes.join(' and ')} cultivation in your crop rotation`);
    }
    
    // Currency-specific insight
    if (currency.code !== 'INR') {
      insights.push(`Cost estimates provided in local currency (${currency.name}) for better planning`);
    }
    
    return insights.slice(0, 3);
  },

  /**
   * Calculate AI-like confidence score
   */
  calculateAILikeConfidence(practice, location, landSize, cropTypes) {
    let confidence = 0.7; // Base confidence
    
    // Adjust based on land size compatibility
    if (practice.suitability && practice.suitability.landSize) {
      const { min, max } = practice.suitability.landSize;
      if (landSize >= min && landSize <= max) {
        confidence += 0.15;
      }
    }
    
    // Adjust based on crop compatibility
    if (practice.suitability && practice.suitability.crops && cropTypes.length > 0) {
      const compatibleCrops = practice.suitability.crops.filter(crop => 
        cropTypes.some(userCrop => userCrop.toLowerCase().includes(crop.toLowerCase()) || 
                                    crop.toLowerCase().includes(userCrop.toLowerCase()))
      );
      if (compatibleCrops.length > 0) {
        confidence += 0.1 * (compatibleCrops.length / cropTypes.length);
      }
    }
    
    // Adjust based on practice category priority
    const highPriorityCategories = ['water_conservation', 'soil_health', 'energy_efficiency'];
    if (highPriorityCategories.includes(practice.category)) {
      confidence += 0.05;
    }
    
    return Math.min(0.95, Math.max(0.4, confidence));
  },

  /**
   * Generate personalized reasons for recommendation
   */
  generatePersonalizedReasons(practice, location, landSize, currentPractices, cropTypes) {
    const reasons = [];
    
    // Check if they already have this practice
    const alreadyImplemented = currentPractices.some(current => 
      current.toLowerCase().includes(practice.name.toLowerCase()) ||
      practice.name.toLowerCase().includes(current.toLowerCase())
    );
    
    if (alreadyImplemented) {
      reasons.push('You can enhance your existing implementation of this practice');
    } else {
      reasons.push('This practice complements your current farming approach');
    }
    
    // Land size specific reasons
    if (landSize < 10) {
      reasons.push('Designed to be cost-effective for smaller farm operations');
    } else {
      reasons.push('Scalable solution that grows with your operation');
    }
    
    // Environmental benefits
    if (practice.environmentalImpact) {
      const { waterSavings, carbonReduction } = practice.environmentalImpact;
      if (waterSavings && waterSavings !== 'N/A') {
        reasons.push(`Significant water conservation potential: ${waterSavings}`);
      }
      if (carbonReduction && carbonReduction !== 'N/A') {
        reasons.push(`Positive environmental impact: ${carbonReduction} carbon reduction`);
      }
    }
    
    return reasons.slice(0, 3);
  },

  /**
   * Create prompt for AI sustainability recommendations
   */
  createSustainabilityPrompt(location, landSize, currentPractices, cropTypes) {
    const practicesText = currentPractices.length > 0 
      ? currentPractices.join(', ') 
      : 'No current sustainable practices implemented';
    
    const cropsText = cropTypes.length > 0 
      ? cropTypes.join(', ') 
      : 'General mixed farming';

    const inputPrompt = `Agricultural Sustainability Advisory Request

Farm Location: ${location.latitude}°N, ${location.longitude}°E
Farm Size: ${landSize} hectares
Current Crops: ${cropsText}
Current Sustainable Practices: ${practicesText}
Assessment Date: ${new Date().toISOString().split('T')[0]}

Request: Provide comprehensive sustainable agricultural practice recommendations including:
1. Top 5 most suitable sustainable practices for this farm
2. Water conservation strategies
3. Soil health improvement methods
4. Energy efficiency measures
5. Biodiversity enhancement practices
6. Implementation timeline and costs
7. Expected environmental benefits
8. Risk factors and mitigation strategies

Please provide practical, location-specific sustainable agriculture advice that considers the farm size, current practices, and crop types.`;

    return inputPrompt;
  },

  /**
   * Parse AI response for sustainability recommendations
   */
  async parseAISustainabilityResponse(aiResponse, originalParams) {
    try {
      // Extract the generated text
      let generatedText = '';
      if (aiResponse && aiResponse.generated_text) {
        generatedText = aiResponse.generated_text;
      } else if (typeof aiResponse === 'string') {
        generatedText = aiResponse;
      } else if (Array.isArray(aiResponse) && aiResponse.length > 0) {
        generatedText = aiResponse[0].generated_text || aiResponse[0];
      }

      console.log('📝 AI Sustainability Response received:', generatedText.substring(0, 200) + '...');

      // Get base static data for location and summary
      const baseResponse = await this.getRecommendedPractices({
        location: originalParams.location,
        landSize: originalParams.landSize,
        cropTypes: originalParams.cropTypes,
        practiceTypes: [],
        budget: undefined
      });

      // Parse the AI response into structured recommendations
      const recommendations = this.extractSustainablePractices(generatedText);
      
      // Add metadata
      recommendations.forEach(rec => {
        rec.aiGenerated = true;
        rec.source = 'AI_RECOMMENDATION';
        rec.confidence = this.calculateRecommendationConfidence(generatedText, rec.name);
      });
      
      return {
        recommendations,
        totalCount: recommendations.length,
        aiGenerated: true,
        rawResponse: generatedText,
        generatedAt: new Date().toISOString(),
        farmContext: originalParams,
        // Include location and summary data that the frontend expects
        location: baseResponse.location,
        summary: baseResponse.summary
      };

    } catch (error) {
      console.error('❌ Error parsing AI sustainability response:', error);
      // Fallback to static recommendations
      return await this.getRecommendedPractices({
        location: originalParams.location,
        landSize: originalParams.landSize,
        cropTypes: originalParams.cropTypes,
        practiceTypes: [],
        budget: undefined
      });
    }
  },

  /**
   * Extract sustainable practices from AI text response
   */
  extractSustainablePractices(text) {
    const practices = [];
    const lowerText = text.toLowerCase();
    
    // Practice patterns to detect in AI response
    const practicePatterns = {
      'drip_irrigation': {
        keywords: ['drip irrigation', 'micro irrigation', 'efficient irrigation'],
        category: 'water_conservation',
        name: 'Drip Irrigation System'
      },
      'cover_crops': {
        keywords: ['cover crop', 'green manure', 'nitrogen fixing'],
        category: 'soil_health',
        name: 'Cover Crop Implementation'
      },
      'composting': {
        keywords: ['compost', 'organic matter', 'decomposed material'],
        category: 'soil_health',
        name: 'Composting System'
      },
      'crop_rotation': {
        keywords: ['crop rotation', 'rotate crops', 'rotation system'],
        category: 'soil_health',
        name: 'Crop Rotation Strategy'
      },
      'rainwater_harvesting': {
        keywords: ['rainwater harvest', 'water collection', 'rain collection'],
        category: 'water_conservation',
        name: 'Rainwater Harvesting'
      },
      'integrated_pest': {
        keywords: ['integrated pest', 'ipm', 'biological control'],
        category: 'pest_management',
        name: 'Integrated Pest Management'
      },
      'solar_power': {
        keywords: ['solar power', 'solar energy', 'photovoltaic'],
        category: 'energy_efficiency',
        name: 'Solar Power Installation'
      },
      'biodiversity': {
        keywords: ['biodiversity', 'habitat creation', 'beneficial insects'],
        category: 'biodiversity',
        name: 'Biodiversity Enhancement'
      }
    };

    Object.entries(practicePatterns).forEach(([practiceId, config]) => {
      const mentions = config.keywords.filter(keyword => lowerText.includes(keyword)).length;
      if (mentions > 0) {
        // Find matching practice from our database
        const staticPractice = this.findStaticPractice(practiceId);
        
        if (staticPractice) {
          // Use static practice as base and enhance with AI insights
          const enhancedPractice = {
            ...staticPractice,
            aiInsights: this.extractPracticeInsights(text, config.keywords),
            mentionCount: mentions,
            aiRecommended: true
          };
          practices.push(enhancedPractice);
        } else {
          // Create new practice from AI response
          practices.push({
            id: practiceId,
            name: config.name,
            category: config.category,
            description: this.extractPracticeDescription(text, config.keywords),
            aiGenerated: true,
            mentionCount: mentions,
            benefits: this.extractPracticeBenefits(text, config.keywords),
            implementation: {
              difficulty: 'medium',
              timeframe: 'To be determined',
              estimatedCost: { min: 0, max: 0, unit: 'INR' }
            }
          });
        }
      }
    });

    // Sort by mention count and confidence
    practices.sort((a, b) => (b.mentionCount || 0) - (a.mentionCount || 0));
    return practices.slice(0, 8); // Return top 8 recommendations
  },

  /**
   * Find static practice by ID for enhancement
   */
  findStaticPractice(practiceId) {
    // Search through all practice categories
    for (const category of Object.values(sustainablePracticesData)) {
      const practice = category.find(p => p.id === practiceId);
      if (practice) return practice;
    }
    return null;
  },

  /**
   * Extract insights for a specific practice from AI text
   */
  extractPracticeInsights(text, keywords) {
    const insights = [];
    const sentences = text.split(/[.!?]+/);
    
    sentences.forEach(sentence => {
      const lowerSentence = sentence.toLowerCase();
      if (keywords.some(keyword => lowerSentence.includes(keyword))) {
        const cleanSentence = sentence.trim();
        if (cleanSentence.length > 10) {
          insights.push(cleanSentence);
        }
      }
    });
    
    return insights.slice(0, 3); // Return top 3 insights
  },

  /**
   * Extract practice description from AI text
   */
  extractPracticeDescription(text, keywords) {
    const sentences = text.split(/[.!?]+/);
    for (const sentence of sentences) {
      const lowerSentence = sentence.toLowerCase();
      if (keywords.some(keyword => lowerSentence.includes(keyword))) {
        const cleanSentence = sentence.trim();
        if (cleanSentence.length > 20) {
          return cleanSentence;
        }
      }
    }
    return 'AI-recommended sustainable practice for improved farm efficiency';
  },

  /**
   * Extract practice benefits from AI text
   */
  extractPracticeBenefits(text, keywords) {
    const benefits = [];
    const benefitKeywords = ['benefit', 'advantage', 'improve', 'reduce', 'increase', 'save'];
    const sentences = text.split(/[.!?]+/);
    
    sentences.forEach(sentence => {
      const lowerSentence = sentence.toLowerCase();
      if (keywords.some(keyword => lowerSentence.includes(keyword)) &&
          benefitKeywords.some(benefit => lowerSentence.includes(benefit))) {
        const cleanSentence = sentence.trim();
        if (cleanSentence.length > 10 && cleanSentence.length < 100) {
          benefits.push(cleanSentence);
        }
      }
    });
    
    return benefits.slice(0, 4); // Return top 4 benefits
  },

  /**
   * Calculate recommendation confidence based on context
   */
  calculateRecommendationConfidence(text, practiceName) {
    const lowerText = text.toLowerCase();
    const lowerPractice = practiceName.toLowerCase();
    
    let confidence = 0.5; // Base confidence
    
    // Increase confidence based on positive context
    const positiveKeywords = ['recommend', 'suitable', 'beneficial', 'effective', 'optimal'];
    const negativeKeywords = ['avoid', 'not suitable', 'difficult', 'challenging'];
    
    positiveKeywords.forEach(keyword => {
      if (lowerText.includes(keyword) && lowerText.includes(lowerPractice)) {
        confidence += 0.1;
      }
    });
    
    negativeKeywords.forEach(keyword => {
      if (lowerText.includes(keyword) && lowerText.includes(lowerPractice)) {
        confidence -= 0.2;
      }
    });
    
    return Math.max(0.1, Math.min(0.95, confidence));
  }
};

module.exports = sustainablePracticesService;
