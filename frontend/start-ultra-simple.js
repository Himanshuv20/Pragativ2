#!/usr/bin/env node

// Ultra-simple dev server without problematic dependencies
const http = require('http');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 3001;

const server = http.createServer((req, res) => {
  // Set CORS headers
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
      res.writeHead(500);
      res.end(`Backend Error: ${err.message}`);
    });

    req.pipe(proxyReq);
    return;
  }

  // Serve static files
  const publicDir = path.join(__dirname, 'public');
  let filePath = path.join(publicDir, req.url === '/' ? 'index.html' : req.url);

  // If file doesn't exist, serve our main page
  if (!fs.existsSync(filePath) || req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="Crop Calendar - Smart Agricultural Advisory Platform" />
    <link rel="apple-touch-icon" href="/logo192.png" />
    <link rel="manifest" href="/manifest.json" />
    <title>Crop Calendar</title>
    <style>
      body {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
          'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
          sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        background: linear-gradient(135deg, #66BB6A 0%, #4CAF50 100%);
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .container {
        text-align: center;
        color: white;
        padding: 2rem;
        border-radius: 16px;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        max-width: 800px;
      }
      .logo {
        font-size: 4rem;
        margin-bottom: 1rem;
      }
      .title {
        font-size: 2.5rem;
        font-weight: 600;
        margin-bottom: 1rem;
      }
      .subtitle {
        font-size: 1.2rem;
        opacity: 0.9;
        margin-bottom: 2rem;
      }
      .features {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-top: 2rem;
      }
      .feature {
        padding: 1rem;
        background: rgba(255, 255, 255, 0.15);
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        cursor: pointer;
        transition: all 0.3s ease;
      }
      .feature:hover {
        background: rgba(255, 255, 255, 0.25);
        transform: translateY(-2px);
      }
      .feature-icon {
        font-size: 2rem;
        margin-bottom: 0.5rem;
      }
      .api-status {
        margin-top: 2rem;
        padding: 1rem;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        font-family: monospace;
      }
      .status-good { color: #4CAF50; }
      .status-loading { color: #FFC107; }
      .status-error { color: #F44336; }
      .demo-section {
        margin-top: 2rem;
        padding: 1rem;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 8px;
      }
      .demo-button {
        background: rgba(255, 255, 255, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.3);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        margin: 0.25rem;
        cursor: pointer;
        transition: all 0.3s ease;
      }
      .demo-button:hover {
        background: rgba(255, 255, 255, 0.3);
      }
      .result-box {
        margin-top: 1rem;
        padding: 1rem;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 6px;
        font-family: monospace;
        font-size: 0.9rem;
        text-align: left;
        max-height: 300px;
        overflow-y: auto;
        display: none;
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
          <div class="feature-icon">🛰️</div>
          <h3>Soil Analysis</h3>
          <p>Real-time satellite data</p>
        </div>
        <div class="feature" onclick="testLocationSearch()">
          <div class="feature-icon">📍</div>
          <h3>Location Search</h3>
          <p>Smart geocoding</p>
        </div>
        <div class="feature" onclick="testMandiData()">
          <div class="feature-icon">🏪</div>
          <h3>Mandi Data</h3>
          <p>Live market prices</p>
        </div>
        <div class="feature" onclick="testWeatherData()">
          <div class="feature-icon">🌤️</div>
          <h3>Weather Data</h3>
          <p>Real-time weather</p>
        </div>
        <div class="feature" onclick="testCropCalendar()">
          <div class="feature-icon">📅</div>
          <h3>Crop Calendar</h3>
          <p>Personalized schedules</p>
        </div>
        <div class="feature" onclick="testGovernmentSchemes()">
          <div class="feature-icon">🏛️</div>
          <h3>Gov Schemes</h3>
          <p>Agricultural schemes</p>
        </div>
      </div>

      <div class="api-status">
        <div>🔧 Backend Status: <span id="backend-status" class="status-loading">Checking...</span></div>
        <div>🛰️ Soil Analysis API: <span id="soil-status" class="status-loading">Checking...</span></div>
      </div>

      <div class="demo-section">
        <h3>🧪 API Testing</h3>
        <p>Click the features above to test the APIs, or use these quick tests:</p>
        <button class="demo-button" onclick="testSoilAnalysis()">Test Soil Analysis (Delhi)</button>
        <button class="demo-button" onclick="testLocationSearch()">Search Location</button>
        <button class="demo-button" onclick="testAllAPIs()">Test All APIs</button>
        <div id="result-box" class="result-box"></div>
      </div>
    </div>

    <script>
      let resultBox = document.getElementById('result-box');

      function showResult(title, data) {
        resultBox.style.display = 'block';
        resultBox.innerHTML = `<strong>${title}</strong><br><pre>${JSON.stringify(data, null, 2)}</pre>`;
      }

      function showError(title, error) {
        resultBox.style.display = 'block';
        resultBox.innerHTML = `<strong style="color: #F44336">${title} - Error</strong><br><pre>${error}</pre>`;
      }

      async function testSoilAnalysis() {
        try {
          const response = await fetch('/api/soil/analysis?lat=28.6139&lon=77.2090&date=2024-01-15');
          const data = await response.json();
          showResult('🛰️ Soil Analysis (Delhi)', data);
        } catch (error) {
          showError('🛰️ Soil Analysis', error.message);
        }
      }

      async function testLocationSearch() {
        try {
          const response = await fetch('/api/locations/search?query=Delhi');
          const data = await response.json();
          showResult('📍 Location Search (Delhi)', data);
        } catch (error) {
          showError('📍 Location Search', error.message);
        }
      }

      async function testMandiData() {
        try {
          const response = await fetch('/api/mandi/prices');
          const data = await response.json();
          showResult('🏪 Mandi Data', data);
        } catch (error) {
          showError('🏪 Mandi Data', error.message);
        }
      }

      async function testWeatherData() {
        try {
          const response = await fetch('/api/weather?lat=28.6139&lon=77.2090');
          const data = await response.json();
          showResult('🌤️ Weather Data (Delhi)', data);
        } catch (error) {
          showError('🌤️ Weather Data', error.message);
        }
      }

      async function testCropCalendar() {
        try {
          const response = await fetch('/api/crop-calendar?location=Delhi&crop=wheat');
          const data = await response.json();
          showResult('📅 Crop Calendar (Delhi, Wheat)', data);
        } catch (error) {
          showError('📅 Crop Calendar', error.message);
        }
      }

      async function testGovernmentSchemes() {
        try {
          const response = await fetch('/api/government-schemes');
          const data = await response.json();
          showResult('🏛️ Government Schemes', data);
        } catch (error) {
          showError('🏛️ Government Schemes', error.message);
        }
      }

      async function testAllAPIs() {
        showResult('🔄 Testing All APIs', 'Running comprehensive tests...');
        
        const tests = [
          { name: 'Backend Health', url: '/api/health' },
          { name: 'Soil Health', url: '/api/soil/health' },
          { name: 'Soil Analysis', url: '/api/soil/analysis?lat=28.6139&lon=77.2090' },
          { name: 'Location Search', url: '/api/locations/search?query=Delhi' },
          { name: 'Mandi Data', url: '/api/mandi/prices' },
          { name: 'Weather Data', url: '/api/weather?lat=28.6139&lon=77.2090' }
        ];

        const results = {};
        
        for (const test of tests) {
          try {
            const response = await fetch(test.url);
            results[test.name] = {
              status: response.status,
              ok: response.ok,
              data: response.ok ? await response.json() : await response.text()
            };
          } catch (error) {
            results[test.name] = {
              status: 'ERROR',
              ok: false,
              error: error.message
            };
          }
        }
        
        showResult('🧪 All API Tests', results);
      }

      // Check API health
      async function checkAPIs() {
        try {
          const backendResponse = await fetch('/api/health');
          document.getElementById('backend-status').textContent = 
            backendResponse.ok ? '✅ Online' : '❌ Offline';
          document.getElementById('backend-status').className = 
            backendResponse.ok ? 'status-good' : 'status-error';
        } catch (error) {
          document.getElementById('backend-status').textContent = '❌ Offline';
          document.getElementById('backend-status').className = 'status-error';
        }

        try {
          const soilResponse = await fetch('/api/soil/health');
          document.getElementById('soil-status').textContent = 
            soilResponse.ok ? '✅ Online' : '❌ Offline';
          document.getElementById('soil-status').className = 
            soilResponse.ok ? 'status-good' : 'status-error';
        } catch (error) {
          document.getElementById('soil-status').textContent = '❌ Offline';
          document.getElementById('soil-status').className = 'status-error';
        }
      }

      // Check APIs on load
      checkAPIs();
      
      // Refresh every 30 seconds
      setInterval(checkAPIs, 30000);
    </script>
  </body>
</html>
    `);
    return;
  }

  // Serve static files
  const stat = fs.statSync(filePath);
  if (stat.isFile()) {
    const ext = path.extname(filePath);
    const contentType = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.ico': 'image/x-icon'
    }[ext] || 'text/plain';

    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`🌾 Crop Calendar frontend running on http://localhost:${PORT}`);
  console.log(`🔗 Backend proxy: http://localhost:5001`);
  console.log(`📱 Interactive API testing available`);
});
