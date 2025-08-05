const { HfInference } = require('@huggingface/inference');

class AIRecommendationService {
  constructor() {
    // Initialize Hugging Face client
    this.hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
    this.modelId = 'cropinailab/aksara_v1';
  }

  /**
   * Get AI-powered crop recommendations using cropinailab/aksara_v1 model
   * @param {Object} params - Input parameters for crop recommendation
   * @param {Object} params.location - Location coordinates
   * @param {Object} params.satelliteData - Real-time satellite data
   * @param {number} params.area - Farm area
   * @param {string} params.soilType - Soil type information
   * @returns {Promise<Object>} AI-generated crop recommendations
   */
  async getCropRecommendation(params) {
    try {
      console.log('🤖 Requesting AI crop recommendations from', this.modelId);
      
      // Prepare input data for the AI model
      const inputData = this.prepareModelInput(params);
      
      // Call the Hugging Face model
      const response = await this.hf.textGeneration({
        model: this.modelId,
        inputs: inputData,
        parameters: {
          max_new_tokens: 800,
          temperature: 0.7,
          top_p: 0.9,
          return_full_text: false,
          do_sample: true
        }
      });

      console.log('✅ AI model response received');
      
      // Parse and structure the AI response
      return this.parseAIResponse(response, params);

    } catch (error) {
      console.error('❌ Error getting AI crop recommendation:', error.message);
      
      // Fallback to enhanced simulation if AI service fails
      return this.getFallbackRecommendation(params);
    }
  }

  /**
   * Prepare input data in the format expected by aksara_v1 model
   */
  prepareModelInput(params) {
    const { location, satelliteData, area, soilType } = params;
    
    // Format input as structured prompt for agricultural AI model
    const inputPrompt = `Agricultural Context:
Location: ${location.latitude}°N, ${location.longitude}°E
Farm Area: ${area} hectares
Current Date: ${new Date().toISOString().split('T')[0]}

Environmental Conditions:
- Soil Moisture: ${satelliteData.soilMoisture.percentage}% (${satelliteData.soilMoisture.status})
- Temperature: ${satelliteData.temperature.current}°C (Range: ${satelliteData.temperature.min}-${satelliteData.temperature.max}°C)
- NDVI (Vegetation Index): ${satelliteData.vegetationIndex.ndvi.toFixed(3)}
- Recent Precipitation: ${satelliteData.precipitation.last7Days}mm (last 7 days)
- Humidity: ${satelliteData.humidity}%
- Cloud Cover: ${satelliteData.cloudCover}%
- Wind Speed: ${satelliteData.windSpeed} km/h

Request: Provide crop recommendations for these specific conditions including:
1. Top 3 most suitable crops
2. Optimal planting timing
3. Expected yield estimates
4. Risk assessment
5. Management practices

Please provide practical, location-specific agricultural advice.`;

    return inputPrompt;
  }

  /**
   * Parse AI model response and structure it for our application
   */
  parseAIResponse(aiResponse, originalParams) {
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

      console.log('📝 AI Response received:', generatedText.substring(0, 200) + '...');

      // Parse the AI response into structured data
      const parsedResponse = this.parseTextResponse(generatedText);
      
      // Enhance with our application-specific structure
      return this.enhanceAIResponse(parsedResponse, originalParams, generatedText);

    } catch (error) {
      console.error('❌ Error parsing AI response:', error);
      return this.getFallbackRecommendation(originalParams);
    }
  }

  /**
   * Parse text response from AI model into structured data
   */
  parseTextResponse(text) {
    const response = {
      recommendedCrops: this.extractCrops(text),
      plantingTiming: this.extractPlantingTiming(text),
      yieldEstimates: this.extractYieldEstimates(text),
      riskFactors: this.extractRiskFactors(text),
      managementPractices: this.extractManagementPractices(text),
      aiGenerated: true,
      rawResponse: text
    };

    return response;
  }

  /**
   * Extract crop recommendations from AI text
   */
  extractCrops(text) {
    const crops = [];
    const lowerText = text.toLowerCase();
    
    // Enhanced crop detection with confidence scoring
    const cropPatterns = {
      'wheat': ['wheat', 'triticum'],
      'rice': ['rice', 'oryza', 'paddy'],
      'corn': ['corn', 'maize', 'zea mays'],
      'tomato': ['tomato', 'solanum lycopersicum'],
      'soybean': ['soybean', 'soya', 'glycine max'],
      'cotton': ['cotton', 'gossypium'],
      'sunflower': ['sunflower', 'helianthus'],
      'barley': ['barley', 'hordeum'],
      'potato': ['potato', 'solanum tuberosum'],
      'sugarcane': ['sugarcane', 'sugar cane']
    };

    Object.entries(cropPatterns).forEach(([cropName, patterns]) => {
      const mentions = patterns.filter(pattern => lowerText.includes(pattern)).length;
      if (mentions > 0) {
        // Calculate confidence based on context
        const contextScore = this.calculateCropContextScore(text, cropName);
        const confidence = Math.min(0.6 + (mentions * 0.1) + contextScore, 0.95);
        
        crops.push({
          name: cropName,
          suitabilityScore: confidence,
          aiRecommended: true,
          mentions: mentions,
          reasons: this.extractCropReasons(text, cropName)
        });
      }
    });

    // Sort by suitability score and return top 3
    crops.sort((a, b) => b.suitabilityScore - a.suitabilityScore);
    return crops.slice(0, 3);
  }

  /**
   * Calculate crop context score based on surrounding text
   */
  calculateCropContextScore(text, cropName) {
    const positiveKeywords = ['suitable', 'recommended', 'optimal', 'good', 'best', 'ideal', 'favorable'];
    const negativeKeywords = ['unsuitable', 'avoid', 'not recommended', 'poor', 'difficult'];
    
    const cropSentences = text.toLowerCase().split(/[.!?]/).filter(sentence => 
      sentence.includes(cropName)
    );
    
    let score = 0;
    cropSentences.forEach(sentence => {
      positiveKeywords.forEach(keyword => {
        if (sentence.includes(keyword)) score += 0.1;
      });
      negativeKeywords.forEach(keyword => {
        if (sentence.includes(keyword)) score -= 0.2;
      });
    });
    
    return Math.max(-0.3, Math.min(0.3, score));
  }

  /**
   * Extract reasons for crop recommendation
   */
  extractCropReasons(text, cropName) {
    const reasons = [];
    const sentences = text.split(/[.!?]/).filter(sentence => 
      sentence.toLowerCase().includes(cropName)
    );
    
    sentences.forEach(sentence => {
      if (sentence.length > 20 && sentence.length < 150) {
        reasons.push(sentence.trim());
      }
    });
    
    return reasons.slice(0, 2); // Return top 2 reasons
  }

  /**
   * Extract planting timing information
   */
  extractPlantingTiming(text) {
    const timingKeywords = [
      'plant', 'sow', 'seed', 'timing', 'optimal time', 'best time',
      'spring', 'summer', 'autumn', 'winter', 'monsoon',
      'january', 'february', 'march', 'april', 'may', 'june',
      'july', 'august', 'september', 'october', 'november', 'december'
    ];
    
    const timingSentences = text.toLowerCase().split(/[.!?]/).filter(sentence =>
      timingKeywords.some(keyword => sentence.includes(keyword))
    );
    
    return {
      hasRecommendations: timingSentences.length > 0,
      suggestions: timingSentences.slice(0, 3),
      confidence: timingSentences.length > 0 ? 0.8 : 0.5
    };
  }

  /**
   * Extract yield estimates
   */
  extractYieldEstimates(text) {
    const yieldKeywords = ['yield', 'production', 'harvest', 'tons', 'kg', 'quintal', 'output'];
    const yieldSentences = text.toLowerCase().split(/[.!?]/).filter(sentence =>
      yieldKeywords.some(keyword => sentence.includes(keyword))
    );
    
    return {
      hasEstimates: yieldSentences.length > 0,
      estimates: yieldSentences.slice(0, 2),
      confidence: yieldSentences.length > 0 ? 0.75 : 0.5
    };
  }

  /**
   * Extract risk factors
   */
  extractRiskFactors(text) {
    const riskKeywords = [
      'risk', 'warning', 'caution', 'drought', 'flood', 'pest', 'disease',
      'fungal', 'bacterial', 'viral', 'insect', 'weather', 'climate'
    ];
    
    const risks = [];
    const riskSentences = text.toLowerCase().split(/[.!?]/).filter(sentence =>
      riskKeywords.some(keyword => sentence.includes(keyword))
    );
    
    riskKeywords.forEach(riskType => {
      if (text.toLowerCase().includes(riskType)) {
        const severity = this.assessRiskSeverity(text, riskType);
        risks.push({
          type: riskType,
          severity: severity,
          aiDetected: true
        });
      }
    });
    
    return risks.slice(0, 5); // Top 5 risks
  }

  /**
   * Assess risk severity based on context
   */
  assessRiskSeverity(text, riskType) {
    const highSeverityWords = ['high', 'severe', 'critical', 'major', 'significant'];
    const mediumSeverityWords = ['moderate', 'medium', 'some', 'potential'];
    const lowSeverityWords = ['low', 'minor', 'slight', 'minimal'];
    
    const riskContext = text.toLowerCase();
    
    if (highSeverityWords.some(word => riskContext.includes(word + ' ' + riskType))) {
      return 'high';
    } else if (mediumSeverityWords.some(word => riskContext.includes(word + ' ' + riskType))) {
      return 'medium';
    } else {
      return 'low';
    }
  }

  /**
   * Extract management practices
   */
  extractManagementPractices(text) {
    const practiceKeywords = [
      'irrigation', 'fertilizer', 'fertilization', 'nutrients', 'npk',
      'pest control', 'weed control', 'spacing', 'depth', 'mulching'
    ];
    
    const practices = [];
    practiceKeywords.forEach(practice => {
      if (text.toLowerCase().includes(practice)) {
        const sentences = text.split(/[.!?]/).filter(sentence =>
          sentence.toLowerCase().includes(practice)
        );
        
        if (sentences.length > 0) {
          practices.push({
            type: practice,
            recommendations: sentences.slice(0, 2),
            aiSuggested: true
          });
        }
      }
    });
    
    return practices;
  }

  /**
   * Enhance AI response with application-specific data
   */
  enhanceAIResponse(aiResponse, originalParams, rawText) {
    const { location, satelliteData, area } = originalParams;
    
    return {
      success: true,
      aiRecommendation: {
        modelUsed: 'cropinailab/aksara_v1',
        confidence: this.calculateOverallConfidence(aiResponse),
        recommendedCrops: aiResponse.recommendedCrops,
        plantingGuidance: aiResponse.plantingTiming,
        riskAssessment: aiResponse.riskFactors,
        yieldPredictions: aiResponse.yieldEstimates,
        managementPractices: aiResponse.managementPractices,
        environmentalFactors: {
          soilSuitability: this.calculateSoilSuitability(satelliteData),
          climaticConditions: this.assessClimaticConditions(satelliteData),
          seasonalFactors: this.getSeasonalFactors(location)
        },
        aiInsights: rawText,
        generatedAt: new Date().toISOString(),
        inputParameters: {
          location: location,
          area: area,
          satelliteConditions: {
            soilMoisture: satelliteData.soilMoisture.percentage,
            temperature: satelliteData.temperature.current,
            ndvi: satelliteData.vegetationIndex.ndvi
          }
        }
      },
      // Maintain compatibility with existing structure
      cropRecommendations: aiResponse.recommendedCrops.map(crop => ({
        name: crop.name,
        confidence: crop.suitabilityScore,
        reasons: crop.reasons || [`AI-recommended based on current conditions`],
        expectedYield: aiResponse.yieldEstimates.hasEstimates ? 'AI-estimated' : 'Moderate',
        riskLevel: aiResponse.riskFactors.length > 3 ? 'medium' : 'low',
        aiGenerated: true
      }))
    };
  }

  /**
   * Calculate overall confidence score
   */
  calculateOverallConfidence(aiResponse) {
    let confidence = 0.7; // Base confidence
    
    if (aiResponse.recommendedCrops.length > 0) confidence += 0.1;
    if (aiResponse.plantingTiming.hasRecommendations) confidence += 0.05;
    if (aiResponse.yieldEstimates.hasEstimates) confidence += 0.05;
    if (aiResponse.managementPractices.length > 0) confidence += 0.05;
    
    return Math.min(confidence, 0.95);
  }

  /**
   * Calculate soil suitability based on satellite data
   */
  calculateSoilSuitability(satelliteData) {
    const moistureScore = Math.min(satelliteData.soilMoisture.percentage / 60, 1);
    const temperatureScore = satelliteData.temperature.current > 10 && satelliteData.temperature.current < 35 ? 1 : 0.5;
    const ndviScore = Math.max(0, Math.min(1, satelliteData.vegetationIndex.ndvi + 0.5));
    
    return {
      overall: (moistureScore + temperatureScore + ndviScore) / 3,
      moisture: moistureScore,
      temperature: temperatureScore,
      vegetation: ndviScore
    };
  }

  /**
   * Assess climatic conditions
   */
  assessClimaticConditions(satelliteData) {
    return {
      temperature: {
        current: satelliteData.temperature.current,
        suitability: satelliteData.temperature.current >= 15 && satelliteData.temperature.current <= 30 ? 'optimal' : 'suboptimal'
      },
      moisture: {
        level: satelliteData.soilMoisture.percentage,
        status: satelliteData.soilMoisture.status,
        adequacy: satelliteData.soilMoisture.percentage > 40 ? 'adequate' : 'insufficient'
      },
      precipitation: {
        recent: satelliteData.precipitation.last7Days,
        adequacy: satelliteData.precipitation.last7Days > 10 ? 'sufficient' : 'low'
      }
    };
  }

  /**
   * Get seasonal factors based on location
   */
  getSeasonalFactors(location) {
    const isNorthernHemisphere = location.latitude > 0;
    const currentMonth = new Date().getMonth() + 1;
    
    let season;
    if (isNorthernHemisphere) {
      season = currentMonth >= 3 && currentMonth <= 5 ? 'spring' :
               currentMonth >= 6 && currentMonth <= 8 ? 'summer' :
               currentMonth >= 9 && currentMonth <= 11 ? 'autumn' : 'winter';
    } else {
      season = currentMonth >= 3 && currentMonth <= 5 ? 'autumn' :
               currentMonth >= 6 && currentMonth <= 8 ? 'winter' :
               currentMonth >= 9 && currentMonth <= 11 ? 'spring' : 'summer';
    }

    return {
      hemisphere: isNorthernHemisphere ? 'northern' : 'southern',
      currentSeason: season,
      plantingWindow: this.getPlantingWindow(season, isNorthernHemisphere)
    };
  }

  /**
   * Get planting window based on season
   */
  getPlantingWindow(season, isNorthernHemisphere) {
    const plantingSeasons = {
      northern: {
        spring: 'Optimal for most crops',
        summer: 'Good for heat-tolerant crops',
        autumn: 'Suitable for winter crops',
        winter: 'Limited planting options'
      },
      southern: {
        spring: 'Good for cool-season crops',
        summer: 'Limited planting options',
        autumn: 'Optimal for most crops',
        winter: 'Suitable for warm-season crops'
      }
    };

    const hemisphere = isNorthernHemisphere ? 'northern' : 'southern';
    return plantingSeasons[hemisphere][season];
  }

  /**
   * Fallback recommendation if AI service fails
   */
  getFallbackRecommendation(params) {
    console.log('🔄 Using enhanced fallback recommendation due to AI service unavailability');
    
    const { satelliteData, location, area } = params;
    
    // Enhanced rule-based recommendation
    const fallbackCrops = this.getRuleBasedCrops(satelliteData);
    
    return {
      success: true,
      aiRecommendation: {
        modelUsed: 'enhanced-fallback-simulation',
        confidence: 0.6,
        recommendedCrops: fallbackCrops,
        plantingGuidance: {
          hasRecommendations: true,
          suggestions: ['Consider current weather patterns', 'Monitor soil moisture levels'],
          confidence: 0.6
        },
        riskAssessment: this.assessEnvironmentalRisks(satelliteData),
        yieldPredictions: {
          hasEstimates: true,
          estimates: ['Moderate yield expected based on current conditions'],
          confidence: 0.6
        },
        fallbackReason: 'AI service unavailable, using enhanced rule-based recommendations',
        generatedAt: new Date().toISOString()
      },
      cropRecommendations: fallbackCrops.map(crop => ({
        name: crop.name,
        confidence: crop.suitabilityScore,
        reasons: crop.reasons,
        expectedYield: 'Moderate',
        riskLevel: 'low',
        aiGenerated: false
      }))
    };
  }

  /**
   * Get rule-based crop recommendations
   */
  getRuleBasedCrops(satelliteData) {
    const crops = [];
    
    // Temperature-based recommendations
    if (satelliteData.temperature.current >= 20 && satelliteData.temperature.current <= 30) {
      crops.push({
        name: 'rice',
        suitabilityScore: 0.8,
        reasons: ['Optimal temperature range', 'Good soil moisture conditions'],
        aiRecommended: false
      });
    }
    
    if (satelliteData.temperature.current >= 15 && satelliteData.temperature.current <= 25) {
      crops.push({
        name: 'wheat',
        suitabilityScore: 0.75,
        reasons: ['Suitable temperature', 'Current weather conditions favorable'],
        aiRecommended: false
      });
    }
    
    // Moisture-based recommendations
    if (satelliteData.soilMoisture.percentage > 50) {
      crops.push({
        name: 'corn',
        suitabilityScore: 0.7,
        reasons: ['High soil moisture suitable for corn', 'Good growing conditions'],
        aiRecommended: false
      });
    }
    
    return crops.slice(0, 3);
  }

  /**
   * Assess environmental risks
   */
  assessEnvironmentalRisks(satelliteData) {
    const risks = [];
    
    if (satelliteData.soilMoisture.percentage < 30) {
      risks.push({
        type: 'drought',
        severity: 'medium',
        aiDetected: false
      });
    }
    
    if (satelliteData.temperature.current > 35) {
      risks.push({
        type: 'heat stress',
        severity: 'high',
        aiDetected: false
      });
    }
    
    if (satelliteData.precipitation.last7Days > 100) {
      risks.push({
        type: 'excessive rainfall',
        severity: 'medium',
        aiDetected: false
      });
    }
    
    return risks;
  }
}

module.exports = AIRecommendationService;
