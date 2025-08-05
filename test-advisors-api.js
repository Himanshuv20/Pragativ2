#!/usr/bin/env node

/**
 * Test script for Financial Advisors API
 * This script tests the new advisor endpoints we just created
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:8000/api/debt-counseling';

async function testAdvisorsAPI() {
  console.log('🧪 Testing Financial Advisors API...\n');

  try {
    // Test 1: Get advisors for Pune, Maharashtra
    console.log('📍 Test 1: Fetching advisors for Pune, Maharashtra');
    const puneResponse = await axios.get(`${BASE_URL}/advisors`, {
      params: {
        state: 'Maharashtra',
        city: 'Pune'
      }
    });
    
    console.log(`✅ Found ${puneResponse.data.data.advisors.length} advisors in Pune`);
    console.log(`💰 Fee range: ₹${Math.min(...puneResponse.data.data.advisors.map(a => a.consultationFee))} - ₹${Math.max(...puneResponse.data.data.advisors.map(a => a.consultationFee))}`);
    console.log('');

    // Test 2: Get advisors for Hyderabad, Andhra Pradesh
    console.log('📍 Test 2: Fetching advisors for Hyderabad, Andhra Pradesh');
    const hyderabadResponse = await axios.get(`${BASE_URL}/advisors`, {
      params: {
        state: 'Andhra Pradesh',
        city: 'Hyderabad'
      }
    });
    
    console.log(`✅ Found ${hyderabadResponse.data.data.advisors.length} advisors in Hyderabad`);
    console.log(`💰 Fee range: ₹${Math.min(...hyderabadResponse.data.data.advisors.map(a => a.consultationFee))} - ₹${Math.max(...hyderabadResponse.data.data.advisors.map(a => a.consultationFee))}`);
    console.log('');

    // Test 3: Filter by specialization
    console.log('🎯 Test 3: Filtering by debt specialization');
    const debtSpecialistsResponse = await axios.get(`${BASE_URL}/advisors`, {
      params: {
        state: 'Maharashtra',
        city: 'Pune',
        specialization: 'debt'
      }
    });
    
    console.log(`✅ Found ${debtSpecialistsResponse.data.data.advisors.length} debt specialists`);
    console.log('');

    // Test 4: Get specific advisor details
    if (puneResponse.data.data.advisors.length > 0) {
      const advisorId = puneResponse.data.data.advisors[0].id;
      console.log(`👨‍💼 Test 4: Getting details for advisor ${advisorId}`);
      
      const advisorDetailsResponse = await axios.get(`${BASE_URL}/advisors/${advisorId}`);
      
      console.log(`✅ Advisor: ${advisorDetailsResponse.data.data.name}`);
      console.log(`📞 Contact: ${advisorDetailsResponse.data.data.phone}`);
      console.log(`🌟 Rating: ${advisorDetailsResponse.data.data.rating}`);
      console.log(`💼 Experience: ${advisorDetailsResponse.data.data.experience}`);
      console.log('');

      // Test 5: Get available slots
      console.log(`📅 Test 5: Getting available slots for ${advisorDetailsResponse.data.data.name}`);
      
      const slotsResponse = await axios.get(`${BASE_URL}/advisors/${advisorId}/slots`);
      
      console.log(`✅ Found slots for ${slotsResponse.data.data.totalDays} days`);
      console.log(`📋 Total available slots: ${slotsResponse.data.data.totalAvailableSlots}`);
      console.log('');
    }

    console.log('🎉 All tests completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Pune advisors: ${puneResponse.data.data.advisors.length}`);
    console.log(`   - Hyderabad advisors: ${hyderabadResponse.data.data.advisors.length}`);
    console.log(`   - Debt specialists: ${debtSpecialistsResponse.data.data.advisors.length}`);
    console.log('   - API endpoints working correctly ✅');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure the backend server is running:');
      console.log('   cd backend && node server.js');
    }
  }
}

// Run the tests
if (require.main === module) {
  testAdvisorsAPI();
}

module.exports = { testAdvisorsAPI };
