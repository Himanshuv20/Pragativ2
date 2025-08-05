require('dotenv').config();
console.log('✅ Testing Copernicus Integration:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('COPERNICUS_USERNAME:', process.env.COPERNICUS_USERNAME ? 'SET' : 'NOT SET');
console.log('COPERNICUS_PASSWORD:', process.env.COPERNICUS_PASSWORD ? 'SET' : 'NOT SET');

if (process.env.COPERNICUS_USERNAME && process.env.COPERNICUS_PASSWORD) {
  console.log('🛰️ Copernicus credentials are available!');
  console.log('🌍 Ready to use real satellite data from Sentinel missions');
} else {
  console.log('⚠️ Copernicus credentials not found');
}
