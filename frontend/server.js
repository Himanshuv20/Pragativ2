const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3001;

// Simple static file server with API proxy
const server = http.createServer(async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Proxy API requests to backend
  if (req.url.startsWith('/api/')) {
    const options = {
      hostname: 'localhost',
      port: 5001,
      path: req.url,
      method: req.method,
      headers: req.headers
    };

    const proxyReq = http.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res);
    });

    proxyReq.on('error', (err) => {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Backend connection failed', message: err.message }));
    });

    req.pipe(proxyReq);
    return;
  }

  // Serve the main application page
  if (req.url === '/' || req.url === '/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#4CAF50" />
    <meta name="description" content="Crop Calendar - Smart Agricultural Advisory Platform" />
    <title>Crop Calendar - Agricultural Platform</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
        background: linear-gradient(135deg, #66BB6A 0%, #4CAF50 100%);
        color: white;
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .container {
        text-align: center;
        padding: 2rem;
        max-width: 1000px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        backdrop-filter: blur(15px);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
      }
      
      .logo {
        font-size: 5rem;
        margin-bottom: 1rem;
        text-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }
      
      .title {
        font-size: 3rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
        background: linear-gradient(45deg, #fff, #e8f5e8);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      
      .subtitle {
        font-size: 1.3rem;
        opacity: 0.9;
        margin-bottom: 2rem;
        font-weight: 300;
      }
      
      .features {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1.5rem;
        margin: 3rem 0;
      }
      
      .feature {
        padding: 1.5rem;
        background: rgba(255, 255, 255, 0.15);
        border-radius: 16px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        cursor: pointer;
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        position: relative;
        overflow: hidden;
      }
      
      .feature::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
        transition: left 0.6s;
      }
      
      .feature:hover {
        background: rgba(255, 255, 255, 0.25);
        transform: translateY(-5px) scale(1.02);
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
      }
      
      .feature:hover::before {
        left: 100%;
      }
      
      .feature-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
        display: block;
      }
      
      .feature h3 {
        font-size: 1.3rem;
        margin-bottom: 0.5rem;
        font-weight: 600;
      }
      
      .feature p {
        opacity: 0.9;
        line-height: 1.4;
      }
      
      .status-section {
        margin: 2rem 0;
        padding: 1.5rem;
        background: rgba(0, 0, 0, 0.1);
        border-radius: 12px;
        font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
      }
      
      .status-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0.5rem 0;
        padding: 0.5rem 0;
      }
      
      .status-good { color: #4CAF50; font-weight: 600; }
      .status-loading { color: #FFC107; }
      .status-error { color: #F44336; font-weight: 600; }
      
      .test-section {
        margin-top: 2rem;
      }
      
      .test-buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        justify-content: center;
        margin: 1rem 0;
      }
      
      .test-button {
        background: rgba(255, 255, 255, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.3);
        color: white;
        padding: 0.8rem 1.5rem;
        border-radius: 25px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: 500;
        font-size: 0.9rem;
      }
      
      .test-button:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
      
      .result-box {
        margin-top: 1.5rem;
        padding: 1.5rem;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 12px;
        font-family: 'SF Mono', Monaco, monospace;
        font-size: 0.85rem;
        text-align: left;
        max-height: 400px;
        overflow-y: auto;
        display: none;
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      .pulse {
        animation: pulse 2s infinite;
      }
      
      @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.7; }
        100% { opacity: 1; }
      }
      
      @media (max-width: 768px) {
        .container { margin: 1rem; padding: 1.5rem; }
        .title { font-size: 2rem; }
        .features { grid-template-columns: 1fr; gap: 1rem; }
        .test-buttons { flex-direction: column; align-items: center; }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="logo">🌾</div>
      <h1 class="title">Crop Calendar</h1>
      <p class="subtitle">Smart Agricultural Advisory Platform</p>
      
      <div class="features">
        <div class="feature" onclick="testSoilAnalysis()">
          <span class="feature-icon">🛰️</span>
          <h3>Soil Analysis</h3>
          <p>Real-time satellite imagery analysis using Sentinel-2 data for comprehensive soil health assessment</p>
        </div>
        
        <div class="feature" onclick="testCropCalendar()">
          <span class="feature-icon">📅</span>
          <h3>Crop Calendar</h3>
          <p>Personalized planting schedules based on location, climate, and crop requirements</p>
        </div>
        
        <div class="feature" onclick="testMandiData()">
          <span class="feature-icon">🏪</span>
          <h3>Mandi Data</h3>
          <p>Live market prices and trends from Data.gov.in and AGMARKNET sources</p>
        </div>
        
        <div class="feature" onclick="testWeatherData()">
          <span class="feature-icon">🌤️</span>
          <h3>Weather Data</h3>
          <p>Real-time weather information and forecasts for agricultural planning</p>
        </div>
        
        <div class="feature" onclick="testDebtCounseling()">
          <span class="feature-icon">💰</span>
          <h3>Debt Counseling</h3>
          <p>Financial advisory services and debt management solutions for farmers</p>
        </div>
        
        <div class="feature" onclick="testGovernmentSchemes()">
          <span class="feature-icon">🏛️</span>
          <h3>Government Schemes</h3>
          <p>Information about agricultural subsidies and government support programs</p>
        </div>
      </div>

      <div class="status-section">
        <h3>🔧 System Status</h3>
        <div class="status-item">
          <span>Backend Service:</span>
          <span id="backend-status" class="status-loading pulse">Checking...</span>
        </div>
        <div class="status-item">
          <span>Soil Analysis API:</span>
          <span id="soil-status" class="status-loading pulse">Checking...</span>
        </div>
        <div class="status-item">
          <span>Weather Service:</span>
          <span id="weather-status" class="status-loading pulse">Checking...</span>
        </div>
      </div>

      <div class="test-section">
        <h3>🧪 API Testing</h3>
        <div class="test-buttons">
          <button class="test-button" onclick="testAllAPIs()">🔄 Test All APIs</button>
          <button class="test-button" onclick="testSoilAnalysis()">🛰️ Soil Analysis</button>
          <button class="test-button" onclick="testLocationSearch()">📍 Location Search</button>
          <button class="test-button" onclick="clearResults()">🗑️ Clear Results</button>
        </div>
        <div id="result-box" class="result-box"></div>
      </div>
    </div>

    <script>
      const resultBox = document.getElementById('result-box');

      function showResult(title, data, isError = false) {
        resultBox.style.display = 'block';
        const color = isError ? '#F44336' : '#4CAF50';
        resultBox.innerHTML = 
          '<div style="color: ' + color + '; font-weight: 600; margin-bottom: 1rem;">' + title + '</div>' +
          '<pre style="white-space: pre-wrap; word-wrap: break-word;">' + 
          JSON.stringify(data, null, 2) + 
          '</pre>';
        resultBox.scrollTop = 0;
      }

      function clearResults() {
        resultBox.style.display = 'none';
        resultBox.innerHTML = '';
      }

      async function testSoilAnalysis() {
        showResult('🛰️ Testing Soil Analysis...', { status: 'Loading...', location: 'New Delhi' });
        try {
          const response = await fetch('/api/soil/analysis?lat=28.6139&lon=77.2090&date=2024-01-15');
          const data = await response.json();
          if (response.ok) {
            showResult('🛰️ Soil Analysis - Success', data);
          } else {
            showResult('🛰️ Soil Analysis - API Error', data, true);
          }
        } catch (error) {
          showResult('🛰️ Soil Analysis - Network Error', { error: error.message }, true);
        }
      }

      async function testLocationSearch() {
        showResult('📍 Testing Location Search...', { query: 'Delhi' });
        try {
          const response = await fetch('/api/locations/search?query=Delhi');
          const data = await response.json();
          if (response.ok) {
            showResult('📍 Location Search - Success', data);
          } else {
            showResult('📍 Location Search - API Error', data, true);
          }
        } catch (error) {
          showResult('📍 Location Search - Network Error', { error: error.message }, true);
        }
      }

      async function testCropCalendar() {
        showResult('📅 Testing Crop Calendar...', { location: 'Delhi', crop: 'wheat' });
        try {
          const response = await fetch('/api/crop-calendar?location=Delhi&crop=wheat');
          const data = await response.json();
          if (response.ok) {
            showResult('📅 Crop Calendar - Success', data);
          } else {
            showResult('📅 Crop Calendar - API Error', data, true);
          }
        } catch (error) {
          showResult('📅 Crop Calendar - Network Error', { error: error.message }, true);
        }
      }

      async function testMandiData() {
        showResult('🏪 Testing Mandi Data...', { status: 'Fetching live prices...' });
        try {
          const response = await fetch('/api/mandi/prices');
          const data = await response.json();
          if (response.ok) {
            showResult('🏪 Mandi Data - Success', data);
          } else {
            showResult('🏪 Mandi Data - API Error', data, true);
          }
        } catch (error) {
          showResult('🏪 Mandi Data - Network Error', { error: error.message }, true);
        }
      }

      async function testWeatherData() {
        showResult('🌤️ Testing Weather Data...', { location: 'Delhi' });
        try {
          const response = await fetch('/api/weather?lat=28.6139&lon=77.2090');
          const data = await response.json();
          if (response.ok) {
            showResult('🌤️ Weather Data - Success', data);
          } else {
            showResult('🌤️ Weather Data - API Error', data, true);
          }
        } catch (error) {
          showResult('🌤️ Weather Data - Network Error', { error: error.message }, true);
        }
      }

      async function testDebtCounseling() {
        showResult('💰 Testing Debt Counseling...', { status: 'Checking financial services...' });
        try {
          const response = await fetch('/api/debt-counseling/advice');
          const data = await response.json();
          if (response.ok) {
            showResult('💰 Debt Counseling - Success', data);
          } else {
            showResult('💰 Debt Counseling - API Error', data, true);
          }
        } catch (error) {
          showResult('💰 Debt Counseling - Network Error', { error: error.message }, true);
        }
      }

      async function testGovernmentSchemes() {
        showResult('🏛️ Testing Government Schemes...', { status: 'Fetching schemes...' });
        try {
          const response = await fetch('/api/government-schemes');
          const data = await response.json();
          if (response.ok) {
            showResult('🏛️ Government Schemes - Success', data);
          } else {
            showResult('🏛️ Government Schemes - API Error', data, true);
          }
        } catch (error) {
          showResult('🏛️ Government Schemes - Network Error', { error: error.message }, true);
        }
      }

      async function testAllAPIs() {
        showResult('🔄 Running Comprehensive API Tests...', { 
          status: 'Testing all endpoints...', 
          timestamp: new Date().toISOString() 
        });

        const tests = [
          { name: 'Backend Health', url: '/api/health', icon: '🔧' },
          { name: 'Soil Health', url: '/api/soil/health', icon: '🛰️' },
          { name: 'Soil Analysis', url: '/api/soil/analysis?lat=28.6139&lon=77.2090', icon: '🛰️' },
          { name: 'Location Search', url: '/api/locations/search?query=Delhi', icon: '📍' },
          { name: 'Weather Data', url: '/api/weather?lat=28.6139&lon=77.2090', icon: '🌤️' },
          { name: 'Mandi Prices', url: '/api/mandi/prices', icon: '🏪' }
        ];

        const results = {
          timestamp: new Date().toISOString(),
          totalTests: tests.length,
          results: {}
        };

        for (const test of tests) {
          try {
            const startTime = Date.now();
            const response = await fetch(test.url);
            const responseTime = Date.now() - startTime;
            const data = response.ok ? await response.json() : await response.text();
            
            results.results[test.name] = {
              icon: test.icon,
              status: response.status,
              ok: response.ok,
              responseTime: responseTime + 'ms',
              dataPreview: typeof data === 'object' ? 
                Object.keys(data).slice(0, 5) : 
                String(data).substring(0, 100)
            };
          } catch (error) {
            results.results[test.name] = {
              icon: test.icon,
              status: 'ERROR',
              ok: false,
              error: error.message
            };
          }
        }

        const successCount = Object.values(results.results).filter(r => r.ok).length;
        results.summary = {
          successful: successCount,
          failed: tests.length - successCount,
          successRate: Math.round((successCount / tests.length) * 100) + '%'
        };

        showResult('🧪 Comprehensive API Test Results', results);
      }

      async function checkSystemStatus() {
        // Check backend health
        try {
          const response = await fetch('/api/health');
          const statusEl = document.getElementById('backend-status');
          if (response.ok) {
            statusEl.textContent = '✅ Online';
            statusEl.className = 'status-good';
          } else {
            statusEl.textContent = '⚠️ Issues';
            statusEl.className = 'status-error';
          }
        } catch (error) {
          const statusEl = document.getElementById('backend-status');
          statusEl.textContent = '❌ Offline';
          statusEl.className = 'status-error';
        }

        // Check soil analysis
        try {
          const response = await fetch('/api/soil/health');
          const statusEl = document.getElementById('soil-status');
          if (response.ok) {
            statusEl.textContent = '✅ Online';
            statusEl.className = 'status-good';
          } else {
            statusEl.textContent = '⚠️ Issues';
            statusEl.className = 'status-error';
          }
        } catch (error) {
          const statusEl = document.getElementById('soil-status');
          statusEl.textContent = '❌ Offline';
          statusEl.className = 'status-error';
        }

        // Check weather service
        try {
          const response = await fetch('/api/weather?lat=28.6139&lon=77.2090');
          const statusEl = document.getElementById('weather-status');
          if (response.ok) {
            statusEl.textContent = '✅ Online';
            statusEl.className = 'status-good';
          } else {
            statusEl.textContent = '⚠️ Issues';
            statusEl.className = 'status-error';
          }
        } catch (error) {
          const statusEl = document.getElementById('weather-status');
          statusEl.textContent = '❌ Offline';
          statusEl.className = 'status-error';
        }
      }

      // Initialize
      checkSystemStatus();
      setInterval(checkSystemStatus, 30000);
    </script>
  </body>
</html>
    `);
    return;
  }

  // Serve static files from public directory
  const publicDir = path.join(__dirname, 'public');
  let filePath = path.join(publicDir, req.url);

  try {
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath);
      const contentType = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.ico': 'image/x-icon',
        '.svg': 'image/svg+xml'
      }[ext] || 'text/plain';

      res.writeHead(200, { 'Content-Type': contentType });
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File not found');
    }
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Server error');
  }
});

server.listen(PORT, () => {
  console.log(`🌾 Crop Calendar frontend running on http://localhost:${PORT}`);
  console.log(`🔗 Backend API proxy: http://localhost:5001`);
  console.log(`📱 Interactive testing interface available`);
  console.log(`🛰️ Soil Analysis module ready`);
});
