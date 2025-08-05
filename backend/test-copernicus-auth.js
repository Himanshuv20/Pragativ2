// Test script to verify Copernicus Data Space Ecosystem authentication
const axios = require('axios');

async function testCopernicusAuthentication() {
  const username = process.env.COPERNICUS_USERNAME;
  const password = process.env.COPERNICUS_PASSWORD;
  
  if (!username || !password) {
    console.log('❌ Copernicus credentials not found in environment variables');
    return;
  }

  console.log('🔐 Testing Copernicus Data Space Ecosystem authentication...');
  console.log(`👤 Username: ${username}`);
  console.log('🔑 Password: [HIDDEN]');

  try {
    // First, let's try to get an access token using the new CDSE API
    const authUrl = 'https://identity.dataspace.copernicus.eu/auth/realms/CDSE/protocol/openid-connect/token';
    
    const authData = new URLSearchParams({
      'grant_type': 'password',
      'username': username,
      'password': password,
      'client_id': 'cdse-public'
    });

    console.log('🌐 Attempting OAuth2 authentication...');
    const authResponse = await axios.post(authUrl, authData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      timeout: 15000
    });

    if (authResponse.data.access_token) {
      console.log('✅ OAuth2 authentication successful!');
      console.log(`🎫 Access token received (length: ${authResponse.data.access_token.length})`);
      
      // Now test the catalog API with the token
      const catalogUrl = 'https://catalogue.dataspace.copernicus.eu/odata/v1/Products?$top=1';
      
      console.log('🛰️ Testing catalog access with token...');
      const catalogResponse = await axios.get(catalogUrl, {
        headers: {
          'Authorization': `Bearer ${authResponse.data.access_token}`
        },
        timeout: 10000
      });

      console.log('✅ Catalog access successful!');
      console.log(`📊 Response status: ${catalogResponse.status}`);
      console.log(`📦 Products found: ${catalogResponse.data.value ? catalogResponse.data.value.length : 0}`);
      
      return authResponse.data.access_token;
    }
  } catch (error) {
    console.log('❌ OAuth2 authentication failed:', error.response?.status, error.response?.statusText);
    
    // Fallback: try basic authentication (old method)
    console.log('🔄 Trying basic authentication (legacy method)...');
    try {
      const catalogUrl = 'https://catalogue.dataspace.copernicus.eu/odata/v1/Products?$top=1';
      
      const basicResponse = await axios.get(catalogUrl, {
        auth: {
          username: username,
          password: password
        },
        timeout: 10000
      });

      console.log('✅ Basic authentication successful!');
      console.log(`📊 Response status: ${basicResponse.status}`);
      return 'basic_auth_works';
    } catch (basicError) {
      console.log('❌ Basic authentication also failed:', basicError.response?.status, basicError.response?.statusText);
      
      if (basicError.response?.status === 401) {
        console.log('🚫 Invalid credentials - please check username and password');
      } else if (basicError.response?.status === 403) {
        console.log('🚫 Access forbidden - account may not have proper permissions');
      } else {
        console.log('🔧 Other error occurred:', basicError.message);
      }
    }
  }
  
  return null;
}

// Test the authentication
if (require.main === module) {
  require('dotenv').config();
  testCopernicusAuthentication()
    .then(result => {
      if (result) {
        console.log('🎉 Copernicus authentication test completed successfully!');
      } else {
        console.log('😞 Copernicus authentication test failed');
      }
      process.exit(result ? 0 : 1);
    })
    .catch(error => {
      console.error('💥 Test script error:', error.message);
      process.exit(1);
    });
}

module.exports = { testCopernicusAuthentication };
