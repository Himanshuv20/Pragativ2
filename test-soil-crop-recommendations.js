#!/usr/bin/env node

/**
 * Test script for Enhanced Soil Analysis with Crop Recommendations
 * This script tests the new crop recommendation functionality
 */

const SoilAnalysisService = require('./backend/services/soilAnalysisService');

async function testSoilAnalysisWithCropRecommendations() {
  console.log('🧪 Testing Enhanced Soil Analysis with Crop Recommendations...\n');

  try {
    const soilService = new SoilAnalysisService();

    // Test coordinates for Pune, Maharashtra
    const testParams = {
      latitude: 18.5204,
      longitude: 73.8567,
      date: '2025-08-02'
    };

    console.log(`📍 Testing with coordinates: ${testParams.latitude}, ${testParams.longitude}`);
    console.log(`📅 Analysis date: ${testParams.date}\n`);

    // Perform soil analysis
    console.log('🔬 Running soil analysis...');
    const analysis = await soilService.analyzeSoilConditions(testParams);

    // Display results
    console.log('✅ Soil Analysis Complete!\n');
    
    console.log('📊 SOIL PARAMETERS:');
    console.log(`   pH: ${analysis.soilParameters.ph.value}`);
    console.log(`   Moisture: ${analysis.soilParameters.moisture.percentage}%`);
    console.log(`   Organic Matter: ${analysis.soilParameters.organicMatter.percentage}%`);
    console.log(`   Fertility Score: ${analysis.soilParameters.fertility.score}`);
    console.log(`   Overall Health: ${analysis.soilHealthScore.overall}\n`);

    console.log('🌾 CROP RECOMMENDATIONS:');
    if (analysis.cropRecommendations && analysis.cropRecommendations.recommendations) {
      console.log(`   Total Crops Analyzed: ${analysis.cropRecommendations.totalAnalyzed}`);
      console.log(`   Suitable Crops Found: ${analysis.cropRecommendations.recommendedCount}\n`);

      console.log('🎯 TOP RECOMMENDED CROPS:');
      analysis.cropRecommendations.recommendations.slice(0, 5).forEach((crop, index) => {
        console.log(`\n   ${index + 1}. ${crop.name.toUpperCase()} (${crop.scientificName})`);
        console.log(`      Category: ${crop.category}`);
        console.log(`      Suitability: ${crop.suitabilityScore}% (${crop.expectedYield} yield)`);
        console.log(`      Planting: ${crop.plantingWindow.season} season (${crop.plantingWindow.period})`);
        console.log(`      Difficulty: ${crop.difficulty}`);
        
        if (crop.reasons.length > 0) {
          console.log(`      ✓ ${crop.reasons[0]}`);
        }
        
        if (crop.warnings.length > 0) {
          console.log(`      ⚠ ${crop.warnings[0]}`);
        }
        
        if (crop.recommendations.length > 0) {
          console.log(`      💡 ${crop.recommendations[0]}`);
        }
      });
    } else {
      console.log('   ❌ No crop recommendations generated');
    }

    console.log('\n💡 GENERAL RECOMMENDATIONS:');
    analysis.recommendations.forEach((rec, index) => {
      console.log(`   ${index + 1}. ${rec.title}: ${rec.action}`);
    });

    console.log(`\n🎯 CONFIDENCE: ${analysis.confidence}%`);
    console.log(`📍 LOCATION: ${analysis.location.name}`);

    console.log('\n🎉 Test completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run the test
if (require.main === module) {
  testSoilAnalysisWithCropRecommendations();
}

module.exports = { testSoilAnalysisWithCropRecommendations };
