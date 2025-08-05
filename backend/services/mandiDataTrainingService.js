const MandiDataService = require('./mandiDataService');
const fs = require('fs').promises;
const path = require('path');

class MandiDataTrainingService {
  constructor() {
    this.mandiService = new MandiDataService();
    this.dataPath = path.join(__dirname, '../data/mandi_training_data.json');
    this.modelPath = path.join(__dirname, '../data/mandi_model.json');
    
    // Training configuration
    this.trainingConfig = {
      collectInterval: 30 * 60 * 1000, // Collect data every 30 minutes
      minDataPoints: 100, // Minimum data points before training
      features: [
        'modalPrice',
        'minPrice', 
        'maxPrice',
        'arrivals',
        'seasonality', // Month of year
        'dayOfWeek',
        'stateIndex',
        'commodityIndex'
      ],
      target: 'modalPrice'
    };

    this.commodityMapping = {
      // Cereals
      'wheat': 0, 'rice': 1, 'maize': 2, 'bajra': 3, 'jowar': 4, 'ragi': 5,
      // Pulses
      'tur': 6, 'moong': 7, 'urad': 8, 'gram': 9, 'masoor': 10, 'chana': 11,
      // Oilseeds
      'soybean': 12, 'groundnut': 13, 'sunflower': 14, 'sesame': 15, 'safflower': 16, 'mustard': 17,
      // Cash crops
      'cotton': 18, 'sugarcane': 19, 'tobacco': 20,
      // Vegetables
      'onion': 21, 'potato': 22, 'tomato': 23, 'brinjal': 24, 'okra': 25, 'cauliflower': 26,
      'cabbage': 27, 'carrot': 28, 'green peas': 29, 'green chilli': 30, 'capsicum': 31,
      'bottle gourd': 32, 'ridge gourd': 33,
      // Fruits
      'mango': 34, 'banana': 35, 'grapes': 36, 'orange': 37, 'pomegranate': 38, 'papaya': 39,
      'guava': 40, 'apple': 41, 'sweet lime': 42, 'watermelon': 43,
      // Spices
      'turmeric': 44, 'coriander': 45, 'cumin': 46, 'fenugreek': 47, 'black pepper': 48,
      'cardamom': 49, 'cloves': 50, 'ginger': 51, 'garlic': 52,
      // Flowers
      'rose': 53, 'jasmine': 54, 'marigold': 55, 'chrysanthemum': 56
    };

    this.stateMapping = {
      'Maharashtra': 0, 'Punjab': 1, 'Haryana': 2, 'Uttar Pradesh': 3,
      'Karnataka': 4, 'Andhra Pradesh': 5, 'Tamil Nadu': 6, 'Gujarat': 7,
      'Rajasthan': 8, 'Madhya Pradesh': 9
    };

    console.log('🤖 Mandi Data Training Service initialized');
    
    // Start automatic data collection
    this.startDataCollection();
  }

  /**
   * Start automatic real-time data collection
   */
  startDataCollection() {
    console.log('📊 Starting real-time mandi data collection...');
    
    // Collect data immediately
    this.collectTrainingData();
    
    // Set up interval for continuous collection
    setInterval(() => {
      this.collectTrainingData();
    }, this.trainingConfig.collectInterval);
  }

  /**
   * Collect real-time training data from multiple commodities and states
   * Enhanced for comprehensive Maharashtra and Andhra Pradesh crop data
   */
  async collectTrainingData() {
    try {
      console.log('🔄 Collecting comprehensive mandi data for Maharashtra and Andhra Pradesh...');
      
      // Comprehensive crop list for Maharashtra and Andhra Pradesh
      const commodities = [
        // Cereals
        'wheat', 'rice', 'maize', 'bajra', 'jowar', 'ragi',
        // Pulses
        'tur', 'moong', 'urad', 'gram', 'masoor', 'chana',
        // Oilseeds
        'soybean', 'groundnut', 'sunflower', 'sesame', 'safflower', 'mustard',
        // Cash crops
        'cotton', 'sugarcane', 'tobacco',
        // Vegetables
        'onion', 'potato', 'tomato', 'brinjal', 'okra', 'cauliflower', 'cabbage', 'carrot',
        'green peas', 'green chilli', 'capsicum', 'bottle gourd', 'ridge gourd',
        // Fruits
        'mango', 'banana', 'grapes', 'orange', 'pomegranate', 'papaya', 'guava',
        'apple', 'sweet lime', 'watermelon',
        // Spices
        'turmeric', 'coriander', 'cumin', 'fenugreek', 'black pepper', 'cardamom',
        'cloves', 'ginger', 'garlic',
        // Flowers
        'rose', 'jasmine', 'marigold', 'chrysanthemum'
      ];
      
      // Focus on Maharashtra and Andhra Pradesh
      const states = ['Maharashtra', 'Andhra Pradesh'];
      const collectedData = [];

      console.log(`📊 Training data collection for ${commodities.length} crops across ${states.length} states`);

      for (const state of states) {
        console.log(`🌾 Collecting data for ${state}...`);
        
        for (const commodity of commodities) {
          try {
            const data = await this.mandiService.getMandiPrices(commodity, state);
            
            if (data.success && data.data && data.data.length > 0) {
              const processedData = this.preprocessData(data.data, commodity, state);
              collectedData.push(...processedData);
              
              console.log(`✅ ${state} - ${commodity}: ${processedData.length} data points`);
            } else {
              console.log(`⚪ ${state} - ${commodity}: No data available`);
            }
            
            // Add small delay to prevent API rate limiting
            await new Promise(resolve => setTimeout(resolve, 100));
            
          } catch (error) {
            console.warn(`⚠️ ${state} - ${commodity}: ${error.message}`);
          }
        }
        
        console.log(`🎯 Completed ${state}: ${collectedData.filter(d => d.state === state).length} total data points`);
      }

      if (collectedData.length > 0) {
        await this.saveTrainingData(collectedData);
        console.log(`💾 Saved ${collectedData.length} new training data points`);
        
        // Check if we have enough data to train
        const totalData = await this.loadTrainingData();
        if (totalData.length >= this.trainingConfig.minDataPoints) {
          console.log(`🎯 Sufficient data available (${totalData.length} points). Training model...`);
          await this.trainPredictionModel();
        }
      }

    } catch (error) {
      console.error('❌ Error collecting training data:', error.message);
    }
  }

  /**
   * Preprocess raw mandi data for ML training
   */
  preprocessData(rawData, commodity, state) {
    const now = new Date();
    const processedData = [];

    for (const record of rawData) {
      if (record.modalPrice && record.modalPrice > 0) {
        const features = {
          // Price features
          modalPrice: parseFloat(record.modalPrice),
          minPrice: parseFloat(record.minPrice || record.modalPrice),
          maxPrice: parseFloat(record.maxPrice || record.modalPrice),
          arrivals: parseFloat(record.arrivals || 0),
          
          // Temporal features
          seasonality: now.getMonth(), // 0-11
          dayOfWeek: now.getDay(), // 0-6
          hour: now.getHours(),
          
          // Categorical features
          commodityIndex: this.commodityMapping[commodity.toLowerCase()] || 0,
          stateIndex: this.stateMapping[state] || 0,
          
          // Metadata
          timestamp: now.toISOString(),
          commodity: commodity,
          state: state,
          market: record.market,
          source: record.source,
          
          // Derived features
          priceSpread: (record.maxPrice || record.modalPrice) - (record.minPrice || record.modalPrice),
          priceVolatility: this.calculateVolatility(record),
          
          // Target variable
          target: parseFloat(record.modalPrice)
        };

        processedData.push(features);
      }
    }

    return processedData;
  }

  /**
   * Calculate price volatility indicator
   */
  calculateVolatility(record) {
    const modal = parseFloat(record.modalPrice);
    const min = parseFloat(record.minPrice || modal);
    const max = parseFloat(record.maxPrice || modal);
    
    if (modal === 0) return 0;
    return ((max - min) / modal) * 100; // Volatility as percentage
  }

  /**
   * Save training data to file
   */
  async saveTrainingData(newData) {
    try {
      let existingData = [];
      
      try {
        const fileData = await fs.readFile(this.dataPath, 'utf8');
        existingData = JSON.parse(fileData);
      } catch (error) {
        // File doesn't exist yet, start with empty array
        console.log('📁 Creating new training data file');
      }

      // Append new data
      existingData.push(...newData);
      
      // Keep only recent data (last 10,000 points)
      if (existingData.length > 10000) {
        existingData = existingData.slice(-10000);
      }

      await fs.writeFile(this.dataPath, JSON.stringify(existingData, null, 2));
      
    } catch (error) {
      console.error('❌ Error saving training data:', error.message);
    }
  }

  /**
   * Load training data from file
   */
  async loadTrainingData() {
    try {
      const fileData = await fs.readFile(this.dataPath, 'utf8');
      return JSON.parse(fileData);
    } catch (error) {
      console.log('📁 No existing training data found');
      return [];
    }
  }

  /**
   * Train prediction model using collected data
   */
  async trainPredictionModel() {
    try {
      console.log('🎯 Training price prediction model...');
      
      const trainingData = await this.loadTrainingData();
      
      if (trainingData.length < this.trainingConfig.minDataPoints) {
        console.log(`⚠️ Insufficient data for training. Need ${this.trainingConfig.minDataPoints}, have ${trainingData.length}`);
        return null;
      }

      // Prepare features and targets
      const features = trainingData.map(item => [
        item.minPrice,
        item.maxPrice,
        item.arrivals,
        item.seasonality,
        item.dayOfWeek,
        item.stateIndex,
        item.commodityIndex,
        item.priceSpread,
        item.priceVolatility
      ]);

      const targets = trainingData.map(item => item.target);

      // Simple linear regression model
      const model = this.trainLinearRegression(features, targets);
      
      // Calculate model metrics
      const metrics = this.evaluateModel(model, features, targets);
      
      // Save model
      const modelData = {
        model: model,
        metrics: metrics,
        trainingSize: trainingData.length,
        features: this.trainingConfig.features,
        timestamp: new Date().toISOString(),
        version: '1.0'
      };

      await fs.writeFile(this.modelPath, JSON.stringify(modelData, null, 2));
      
      console.log('✅ Model training completed!');
      console.log(`📊 Training size: ${trainingData.length} samples`);
      console.log(`📈 Model R²: ${metrics.r2.toFixed(4)}`);
      console.log(`📉 RMSE: ${metrics.rmse.toFixed(2)}`);
      
      return modelData;

    } catch (error) {
      console.error('❌ Error training model:', error.message);
      return null;
    }
  }

  /**
   * Simple linear regression implementation
   */
  trainLinearRegression(features, targets) {
    const n = features.length;
    const numFeatures = features[0].length;
    
    // Initialize weights
    let weights = new Array(numFeatures + 1).fill(0); // +1 for bias
    const learningRate = 0.0001;
    const epochs = 1000;

    // Normalize features
    const featureStats = this.normalizeFeatures(features);
    const normalizedFeatures = featureStats.normalized;

    // Gradient descent
    for (let epoch = 0; epoch < epochs; epoch++) {
      let totalError = 0;
      const gradients = new Array(numFeatures + 1).fill(0);

      for (let i = 0; i < n; i++) {
        // Prediction
        let prediction = weights[0]; // bias
        for (let j = 0; j < numFeatures; j++) {
          prediction += weights[j + 1] * normalizedFeatures[i][j];
        }

        const error = prediction - targets[i];
        totalError += error * error;

        // Calculate gradients
        gradients[0] += error; // bias gradient
        for (let j = 0; j < numFeatures; j++) {
          gradients[j + 1] += error * normalizedFeatures[i][j];
        }
      }

      // Update weights
      for (let j = 0; j < weights.length; j++) {
        weights[j] -= (learningRate * gradients[j]) / n;
      }
    }

    return {
      weights: weights,
      featureStats: featureStats.stats
    };
  }

  /**
   * Normalize features for better training
   */
  normalizeFeatures(features) {
    const numFeatures = features[0].length;
    const stats = [];
    const normalized = [];

    // Calculate mean and std for each feature
    for (let j = 0; j < numFeatures; j++) {
      const values = features.map(row => row[j]);
      const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
      const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
      const std = Math.sqrt(variance) || 1; // Avoid division by zero
      
      stats[j] = { mean, std };
    }

    // Normalize features
    for (let i = 0; i < features.length; i++) {
      normalized[i] = [];
      for (let j = 0; j < numFeatures; j++) {
        normalized[i][j] = (features[i][j] - stats[j].mean) / stats[j].std;
      }
    }

    return { normalized, stats };
  }

  /**
   * Evaluate model performance
   */
  evaluateModel(model, features, targets) {
    const predictions = [];
    const n = features.length;

    // Make predictions
    for (let i = 0; i < n; i++) {
      let prediction = model.weights[0]; // bias
      for (let j = 0; j < features[i].length; j++) {
        const normalizedValue = (features[i][j] - model.featureStats[j].mean) / model.featureStats[j].std;
        prediction += model.weights[j + 1] * normalizedValue;
      }
      predictions.push(prediction);
    }

    // Calculate metrics
    const meanTarget = targets.reduce((sum, val) => sum + val, 0) / n;
    let totalSumSquares = 0;
    let residualSumSquares = 0;

    for (let i = 0; i < n; i++) {
      totalSumSquares += Math.pow(targets[i] - meanTarget, 2);
      residualSumSquares += Math.pow(targets[i] - predictions[i], 2);
    }

    const r2 = 1 - (residualSumSquares / totalSumSquares);
    const rmse = Math.sqrt(residualSumSquares / n);

    return { r2, rmse, predictions };
  }

  /**
   * Load trained model
   */
  async loadModel() {
    try {
      const modelData = await fs.readFile(this.modelPath, 'utf8');
      return JSON.parse(modelData);
    } catch (error) {
      console.log('📁 No trained model found');
      return null;
    }
  }

  /**
   * Predict price using trained model
   */
  async predictPrice(commodity, state, additionalFeatures = {}) {
    try {
      const model = await this.loadModel();
      if (!model) {
        throw new Error('No trained model available');
      }

      // Get current market data for context
      const currentData = await this.mandiService.getMandiPrices(commodity, state);
      
      if (!currentData.success || !currentData.data || currentData.data.length === 0) {
        throw new Error('No current market data available');
      }

      const avgCurrentPrice = currentData.data.reduce((sum, item) => sum + item.modalPrice, 0) / currentData.data.length;
      const avgArrivals = currentData.data.reduce((sum, item) => sum + (item.arrivals || 0), 0) / currentData.data.length;

      // Prepare features for prediction
      const now = new Date();
      const features = [
        avgCurrentPrice * 0.95, // Estimated min price
        avgCurrentPrice * 1.05, // Estimated max price
        additionalFeatures.arrivals || avgArrivals,
        now.getMonth(),
        now.getDay(),
        this.stateMapping[state] || 0,
        this.commodityMapping[commodity.toLowerCase()] || 0,
        avgCurrentPrice * 0.1, // Price spread
        5.0 // Default volatility
      ];

      // Normalize features
      const normalizedFeatures = [];
      for (let j = 0; j < features.length; j++) {
        normalizedFeatures[j] = (features[j] - model.model.featureStats[j].mean) / model.model.featureStats[j].std;
      }

      // Make prediction
      let prediction = model.model.weights[0]; // bias
      for (let j = 0; j < normalizedFeatures.length; j++) {
        prediction += model.model.weights[j + 1] * normalizedFeatures[j];
      }

      // Calculate confidence interval (simple approach)
      const confidence = Math.max(0.85, model.metrics.r2);
      const errorMargin = prediction * (1 - confidence) * 0.5;

      return {
        predictedPrice: Math.round(prediction),
        confidence: Math.round(confidence * 100),
        range: {
          min: Math.round(prediction - errorMargin),
          max: Math.round(prediction + errorMargin)
        },
        currentAverage: Math.round(avgCurrentPrice),
        modelMetrics: {
          r2: model.metrics.r2,
          rmse: model.metrics.rmse,
          trainingSize: model.trainingSize
        },
        features: {
          commodity,
          state,
          timestamp: now.toISOString()
        }
      };

    } catch (error) {
      console.error('❌ Error making prediction:', error.message);
      throw error;
    }
  }

  /**
   * Get model training status and statistics
   */
  async getTrainingStatus() {
    try {
      const trainingData = await this.loadTrainingData();
      const model = await this.loadModel();

      return {
        dataCollected: trainingData.length,
        minimumRequired: this.trainingConfig.minDataPoints,
        modelTrained: !!model,
        lastModelTraining: model ? model.timestamp : null,
        modelPerformance: model ? model.metrics : null,
        dataCollectionInterval: this.trainingConfig.collectInterval / 1000 / 60, // minutes
        supportedCommodities: Object.keys(this.commodityMapping),
        supportedStates: Object.keys(this.stateMapping)
      };
    } catch (error) {
      console.error('❌ Error getting training status:', error.message);
      return null;
    }
  }

  /**
   * Manual training trigger
   */
  async manualTrain() {
    console.log('🔄 Manual training triggered...');
    
    // Collect fresh data
    await this.collectTrainingData();
    
    // Train model
    return await this.trainPredictionModel();
  }

  /**
   * Comprehensive training for Maharashtra and Andhra Pradesh
   * This method performs intensive data collection and training
   */
  async trainComprehensiveMandiData() {
    console.log('🚀 Starting comprehensive mandi data training for Maharashtra and Andhra Pradesh...');
    
    const startTime = Date.now();
    const stats = {
      totalCrops: 0,
      totalDataPoints: 0,
      successfulCrops: 0,
      failedCrops: 0,
      maharashtraData: 0,
      andhraData: 0,
      trainingResults: null
    };

    try {
      // Comprehensive crop list for both states
      const allCrops = [
        // Cereals & Grains
        'wheat', 'rice', 'maize', 'bajra', 'jowar', 'ragi', 'barley',
        // Pulses
        'tur', 'moong', 'urad', 'gram', 'masoor', 'chana', 'field pea', 'lathyrus',
        // Oilseeds
        'soybean', 'groundnut', 'sunflower', 'sesame', 'safflower', 'mustard', 'linseed', 'castor seed',
        // Cash crops
        'cotton', 'sugarcane', 'tobacco', 'jute',
        // Vegetables (Major)
        'onion', 'potato', 'tomato', 'brinjal', 'okra', 'cauliflower', 'cabbage', 'carrot',
        'green peas', 'green chilli', 'capsicum', 'bottle gourd', 'ridge gourd', 'bitter gourd',
        'pumpkin', 'cucumber', 'radish', 'beetroot', 'spinach', 'fenugreek leaves',
        // Fruits
        'mango', 'banana', 'grapes', 'orange', 'pomegranate', 'papaya', 'guava',
        'apple', 'sweet lime', 'watermelon', 'muskmelon', 'custard apple', 'jackfruit',
        // Spices & Condiments
        'turmeric', 'coriander', 'cumin', 'fenugreek', 'black pepper', 'cardamom',
        'cloves', 'ginger', 'garlic', 'dry chilli', 'tamarind', 'ajwain',
        // Flowers & Others
        'rose', 'jasmine', 'marigold', 'chrysanthemum', 'coconut', 'areca nut'
      ];

      const states = ['Maharashtra', 'Andhra Pradesh'];
      stats.totalCrops = allCrops.length;

      console.log(`📊 Training on ${allCrops.length} crops across ${states.length} states`);
      console.log('🎯 Target states: Maharashtra, Andhra Pradesh');

      const allCollectedData = [];

      // Collect data for each state
      for (const state of states) {
        console.log(`\n🌾 === COLLECTING DATA FOR ${state.toUpperCase()} ===`);
        let stateDataCount = 0;

        for (let i = 0; i < allCrops.length; i++) {
          const crop = allCrops[i];
          const progress = Math.round(((i + 1) / allCrops.length) * 100);
          
          try {
            console.log(`[${progress}%] ${state} - ${crop}...`);
            
            const cropData = await this.mandiService.getMandiPrices(crop, state);
            
            if (cropData.success && cropData.data && cropData.data.length > 0) {
              const processedData = this.preprocessData(cropData.data, crop, state);
              allCollectedData.push(...processedData);
              stateDataCount += processedData.length;
              stats.successfulCrops++;
              
              console.log(`  ✅ ${processedData.length} data points collected`);
            } else {
              console.log(`  ⚪ No data available`);
            }
            
            // Small delay to prevent overwhelming APIs
            await new Promise(resolve => setTimeout(resolve, 200));
            
          } catch (error) {
            stats.failedCrops++;
            console.log(`  ❌ Error: ${error.message}`);
          }
        }

        if (state === 'Maharashtra') {
          stats.maharashtraData = stateDataCount;
        } else {
          stats.andhraData = stateDataCount;
        }

        console.log(`🎯 ${state} complete: ${stateDataCount} data points collected`);
      }

      stats.totalDataPoints = allCollectedData.length;
      console.log(`\n📈 COLLECTION SUMMARY:`);
      console.log(`   Total data points: ${stats.totalDataPoints}`);
      console.log(`   Maharashtra: ${stats.maharashtraData} points`);
      console.log(`   Andhra Pradesh: ${stats.andhraData} points`);
      console.log(`   Successful crops: ${stats.successfulCrops}/${stats.totalCrops}`);

      // Save collected data
      if (allCollectedData.length > 0) {
        await this.saveTrainingData(allCollectedData);
        console.log('💾 Training data saved successfully');

        // Train the model
        console.log('\n🤖 TRAINING MACHINE LEARNING MODEL...');
        const trainingResult = await this.trainPredictionModel();
        stats.trainingResults = trainingResult;

        const endTime = Date.now();
        const duration = Math.round((endTime - startTime) / 1000);

        console.log(`\n🎉 COMPREHENSIVE TRAINING COMPLETED!`);
        console.log(`   Duration: ${duration} seconds`);
        console.log(`   Data collected: ${stats.totalDataPoints} points`);
        console.log(`   Model trained: ${trainingResult ? 'Success' : 'Failed'}`);

        return {
          success: true,
          stats,
          duration,
          message: `Successfully trained on ${stats.totalDataPoints} data points from ${stats.successfulCrops} crops`
        };
      } else {
        throw new Error('No data could be collected for training');
      }

    } catch (error) {
      console.error('❌ Comprehensive training failed:', error.message);
      return {
        success: false,
        error: error.message,
        stats
      };
    }
  }

  /**
   * Get price insights and recommendations
   */
  async getPriceInsights(commodity, state) {
    try {
      const prediction = await this.predictPrice(commodity, state);
      const currentData = await this.mandiService.getMandiPrices(commodity, state);
      
      const insights = [];
      
      if (prediction.predictedPrice > prediction.currentAverage * 1.05) {
        insights.push({
          type: 'price_increase',
          message: `Price expected to increase by ${Math.round(((prediction.predictedPrice - prediction.currentAverage) / prediction.currentAverage) * 100)}%`,
          recommendation: 'Consider delaying sale for better prices',
          confidence: prediction.confidence
        });
      } else if (prediction.predictedPrice < prediction.currentAverage * 0.95) {
        insights.push({
          type: 'price_decrease',
          message: `Price expected to decrease by ${Math.round(((prediction.currentAverage - prediction.predictedPrice) / prediction.currentAverage) * 100)}%`,
          recommendation: 'Consider selling soon before prices drop',
          confidence: prediction.confidence
        });
      } else {
        insights.push({
          type: 'price_stable',
          message: 'Prices expected to remain stable',
          recommendation: 'Normal market conditions, sell when convenient',
          confidence: prediction.confidence
        });
      }

      // Volatility insights
      if (currentData.success && currentData.marketInsights) {
        const priceRange = currentData.marketInsights.priceRange;
        const volatility = ((priceRange.max - priceRange.min) / currentData.marketInsights.averagePrice) * 100;
        
        if (volatility > 15) {
          insights.push({
            type: 'high_volatility',
            message: `High price volatility detected (${volatility.toFixed(1)}%)`,
            recommendation: 'Monitor prices closely, market is unstable',
            confidence: 90
          });
        }
      }

      return {
        prediction,
        insights,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ Error generating price insights:', error.message);
      throw error;
    }
  }
}

module.exports = MandiDataTrainingService;
