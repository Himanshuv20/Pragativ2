#!/usr/bin/env node

// Simple dev server that bypasses React Scripts memory issues
const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3001;

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Simple API proxy to backend
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:5001',
  changeOrigin: true
}));

// Serve a simple HTML page that loads our React app
app.get('*', (req, res) => {
  res.send(`
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
    </style>
  </head>
  <body>
    <div class="container">
      <div class="logo">🌾</div>
      <h1 class="title">Crop Calendar</h1>
      <p class="subtitle">Smart Agricultural Advisory Platform</p>
      
      <div class="features">
        <div class="feature">
          <div class="feature-icon">📅</div>
          <h3>Crop Calendar</h3>
          <p>Personalized planting schedules</p>
        </div>
        <div class="feature">
          <div class="feature-icon">🛰️</div>
          <h3>Soil Analysis</h3>
          <p>Real-time satellite data</p>
        </div>
        <div class="feature">
          <div class="feature-icon">🏪</div>
          <h3>Mandi Data</h3>
          <p>Live market prices</p>
        </div>
        <div class="feature">
          <div class="feature-icon">💰</div>
          <h3>Debt Counseling</h3>
          <p>Financial advisory</p>
        </div>
        <div class="feature">
          <div class="feature-icon">🏛️</div>
          <h3>Gov Schemes</h3>
          <p>Agricultural schemes</p>
        </div>
        <div class="feature">
          <div class="feature-icon">🌱</div>
          <h3>Sustainable Practices</h3>
          <p>Eco-friendly farming</p>
        </div>
      </div>

      <div class="api-status">
        <div>🔧 Backend Status: <span id="backend-status" class="status-loading">Checking...</span></div>
        <div>🛰️ Soil Analysis API: <span id="soil-status" class="status-loading">Checking...</span></div>
      </div>
    </div>

    <script>
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
});

app.listen(PORT, () => {
  console.log(`🌾 Crop Calendar frontend running on http://localhost:${PORT}`);
  console.log(`🔗 Backend proxy: http://localhost:5001`);
});
