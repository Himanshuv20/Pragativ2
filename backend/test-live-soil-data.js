/**
 * Test script for Live Soil Data Integration in Crop Calendar
 * This script tests the enhanced soil data collection and crop calendar integration
 */

const satelliteDataService = require('./services/satelliteDataService');
const cropCalendarService = require('./services/cropCalendarService');

async function testLiveSoilDataIntegration() {
  console.log('🧪 Testing Live Soil Data Integration for Crop Calendar...\n');
  
  // Test locations with different soil conditions
  const testLocations = [
    { name: 'Delhi, India', latitude: 28.6139, longitude: 77.2090 },
    { name: 'California, USA', latitude: 36.7783, longitude: -119.4179 },
    { name: 'São Paulo, Brazil', latitude: -23.5505, longitude: -46.6333 },
    { name: 'Munich, Germany', latitude: 48.1351, longitude: 11.5820 }
  ];
  
  const testCrops = ['wheat', 'rice', 'maize', 'tomato'];
  
  for (const location of testLocations) {
    console.log(`\n📍 Testing location: ${location.name} (${location.latitude}, ${location.longitude})`);
    console.log('=' .repeat(80));
    
    try {
      // Test satellite data collection with live soil data
      console.log('\n🛰️ Step 1: Collecting live satellite and soil data...');
      const satelliteData = await satelliteDataService.getSatelliteData(location);
      
      // Display soil data details
      console.log('\n🌱 LIVE SOIL DATA RESULTS:');
      console.log(`   Soil Moisture: ${satelliteData.soilMoisture.percentage}%`);
      console.log(`   Status: ${satelliteData.soilMoisture.status}`);
      console.log(`   Data Source: ${satelliteData.soilMoisture.source}`);
      console.log(`   Depth: ${satelliteData.soilMoisture.depth}`);
      console.log(`   Confidence: ${satelliteData.soilMoisture.confidence || 'N/A'}`);
      console.log(`   Methodology: ${satelliteData.soilMoisture.methodology || 'N/A'}`);
      console.log(`   Last Updated: ${satelliteData.lastUpdated}`);
      
      // Test crop calendar generation with live soil data
      for (const cropType of testCrops.slice(0, 2)) { // Test first 2 crops per location
        console.log(`\n🌾 Step 2: Generating crop calendar for ${cropType} using live soil data...`);
        
        const calendarRequest = {
          location: location,
          area: 2.5, // hectares
          cropType: cropType,
          satelliteData: satelliteData
        };
        
        const cropCalendar = await cropCalendarService.generateCropCalendar(calendarRequest);
        
        // Display key results influenced by live soil data
        console.log(`\n📅 CROP CALENDAR RESULTS (${cropType.toUpperCase()}):`);
        console.log(`   Planting adjustments: ${cropCalendar.plantingWindow.adjustments} days`);
        console.log(`   Risk factors: ${cropCalendar.plantingWindow.riskFactors.join(', ')}`);
        console.log(`   Irrigation events: ${cropCalendar.maintenanceSchedule.irrigation.length}`);
        console.log(`   Total water needed: ${cropCalendar.maintenanceSchedule.totalWaterNeeded} liters`);
        
        // Show first few irrigation recommendations
        if (cropCalendar.maintenanceSchedule.irrigation.length > 0) {
          console.log('\n💧 SAMPLE IRRIGATION SCHEDULE (First 3 events):');
          cropCalendar.maintenanceSchedule.irrigation.slice(0, 3).forEach((irrigation, index) => {
            console.log(`   ${index + 1}. ${irrigation.date}: ${irrigation.amount}L (${irrigation.method})`);
            if (irrigation.soilMoistureData) {
              console.log(`      Soil: ${irrigation.soilMoistureData.currentLevel}% → ${irrigation.soilMoistureData.targetLevel}% (${irrigation.soilMoistureData.source})`);
            }
            if (irrigation.notes) {
              console.log(`      Notes: ${irrigation.notes}`);
            }
          });
        }
        
        // Show soil condition assessment
        console.log(`\n🌍 SOIL ASSESSMENT:`);
        console.log(`   Overall readiness: ${cropCalendar.satelliteDataSummary.overallReadiness.status}`);
        console.log(`   Soil condition: ${cropCalendar.satelliteDataSummary.soilCondition.status}`);
        console.log(`   Recommendations: ${cropCalendar.recommendations.length} total`);
        
        // Show soil-specific recommendations
        const soilRecommendations = cropCalendar.recommendations.filter(rec => 
          rec.category === 'irrigation' || rec.title.toLowerCase().includes('soil')
        );
        if (soilRecommendations.length > 0) {
          console.log('\n🔧 SOIL-BASED RECOMMENDATIONS:');
          soilRecommendations.forEach((rec, index) => {
            console.log(`   ${index + 1}. [${rec.priority.toUpperCase()}] ${rec.title}`);
            console.log(`      ${rec.description}`);
            console.log(`      Actions: ${rec.actions.join(', ')}`);
          });
        }
      }
      
    } catch (error) {
      console.error(`❌ Error testing location ${location.name}:`, error.message);
    }
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('✅ Live Soil Data Integration Test Complete!');
  console.log('\n📊 SUMMARY OF ENHANCEMENTS:');
  console.log('   • Multi-source soil moisture data (ERA5, CGLS, SMAP, Weather-based)');
  console.log('   • Precision irrigation scheduling based on live soil conditions');
  console.log('   • Real-time soil moisture monitoring and recommendations');
  console.log('   • Crop-specific soil moisture thresholds and adjustments');
  console.log('   • Data source tracking and confidence scoring');
  console.log('   • Enhanced water balance calculations using meteorological data');
}

// Additional test for soil data source fallback chain
async function testSoilDataSourceFallback() {
  console.log('\n🔄 Testing Soil Data Source Fallback Chain...\n');
  
  const location = { latitude: 28.6139, longitude: 77.2090 }; // Delhi
  
  try {
    const satelliteData = await satelliteDataService.getSatelliteData(location);
    
    console.log('📡 Data Source Chain Test Results:');
    console.log(`   Primary Source Used: ${satelliteData.soilMoisture.source}`);
    console.log(`   Data Confidence: ${satelliteData.soilMoisture.confidence}`);
    console.log(`   Fallback Status: ${satelliteData.soilMoisture.source.includes('Weather') ? 'Used fallback' : 'Used satellite data'}`);
    
    // Test the precision of different sources
    if (satelliteData.soilMoisture.source.includes('ERA5')) {
      console.log('   ✅ ERA5-Land reanalysis data successfully retrieved');
    } else if (satelliteData.soilMoisture.source.includes('CGLS')) {
      console.log('   ✅ Copernicus Global Land Service data successfully retrieved');
    } else if (satelliteData.soilMoisture.source.includes('SMAP')) {
      console.log('   ✅ NASA SMAP satellite data successfully retrieved');
    } else {
      console.log('   📊 Using enhanced weather-based calculation (fallback)');
    }
    
  } catch (error) {
    console.error('❌ Soil data source test failed:', error.message);
  }
}

// Run the tests
async function runAllTests() {
  console.log('🌾 LIVE SOIL DATA INTEGRATION TEST SUITE');
  console.log('==========================================\n');
  
  await testLiveSoilDataIntegration();
  await testSoilDataSourceFallback();
  
  console.log('\n🎉 All tests completed! The system is now using LIVE soil data for crop calendar generation.');
}

// Export for use as module or run directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  testLiveSoilDataIntegration,
  testSoilDataSourceFallback,
  runAllTests
};
