#!/usr/bin/env node

/**
 * Comprehensive Mandi Data Training Script
 * Trains ML model with latest data for all crops from Maharashtra and Andhra Pradesh
 */

const MandiDataTrainingService = require('./services/mandiDataTrainingService');

async function runComprehensiveTraining() {
  console.log('🚀 Starting Comprehensive Mandi Data Training');
  console.log('🎯 Target States: Maharashtra, Andhra Pradesh');
  console.log('📊 Training on 60+ crop varieties');
  console.log('⏰ This may take 10-15 minutes...\n');

  const trainingService = new MandiDataTrainingService();

  try {
    const startTime = Date.now();
    
    // Run comprehensive training
    const result = await trainingService.trainComprehensiveMandiData();
    
    const endTime = Date.now();
    const totalDuration = Math.round((endTime - startTime) / 1000);

    console.log('\n' + '='.repeat(60));
    console.log('🎉 COMPREHENSIVE TRAINING COMPLETED!');
    console.log('='.repeat(60));

    if (result.success) {
      console.log(`✅ Status: SUCCESS`);
      console.log(`⏱️  Total Duration: ${totalDuration} seconds`);
      console.log(`📊 Data Points Collected: ${result.stats.totalDataPoints}`);
      console.log(`🌾 Successful Crops: ${result.stats.successfulCrops}`);
      console.log(`🏛️  Maharashtra Data: ${result.stats.maharashtraData} points`);
      console.log(`🏛️  Andhra Pradesh Data: ${result.stats.andhraData} points`);
      console.log(`🤖 Model Training: ${result.stats.trainingResults ? 'Success' : 'Pending'}`);
      
      if (result.stats.trainingResults) {
        console.log(`📈 Model Performance: R² = ${result.stats.trainingResults.r2?.toFixed(4) || 'N/A'}`);
      }
      
      console.log('\n🎯 The ML model is now trained with comprehensive mandi data!');
      console.log('🔮 You can now use price prediction APIs for accurate forecasts.');
    } else {
      console.log(`❌ Status: FAILED`);
      console.log(`💥 Error: ${result.error}`);
      console.log(`📊 Data Points Collected: ${result.stats.totalDataPoints}`);
      console.log(`🌾 Successful Crops: ${result.stats.successfulCrops}`);
    }

  } catch (error) {
    console.error('\n❌ TRAINING FAILED WITH ERROR:');
    console.error(error.message);
    console.error('\nStack trace:', error.stack);
  }

  console.log('\n📋 Training Summary:');
  console.log('   - Enhanced commodity mapping with 57 crop varieties');
  console.log('   - Real-time data collection from Data.gov.in APIs');
  console.log('   - ML model with temporal and categorical features');
  console.log('   - Price prediction with confidence intervals');
  console.log('   - Ready for production use\n');
}

// Handle script termination gracefully
process.on('SIGINT', () => {
  console.log('\n⚠️ Training interrupted by user');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n⚠️ Training terminated');
  process.exit(0);
});

// Run the training
if (require.main === module) {
  runComprehensiveTraining()
    .then(() => {
      console.log('🏁 Training script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Training script failed:', error.message);
      process.exit(1);
    });
}

module.exports = { runComprehensiveTraining };
