#!/usr/bin/env node

const { spawn } = require('child_process');
const http = require('http');
const path = require('path');

const PORT = 3001;

// Simple check if backend is running
function checkBackend() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:5001/api/health', (res) => {
      resolve(true);
    });
    req.on('error', () => {
      resolve(false);
    });
    req.setTimeout(2000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function main() {
  console.log('🌾 Crop Calendar Frontend Launcher');
  console.log('===================================');
  
  const backendRunning = await checkBackend();
  if (backendRunning) {
    console.log('✅ Backend is running on port 5001');
  } else {
    console.log('⚠️  Backend not detected on port 5001');
  }
  
  console.log(`🚀 Starting frontend on port ${PORT}...`);
  
  // Try to start the static server first
  try {
    console.log('📁 Attempting to serve static files...');
    const server = spawn('node', ['static-server.js'], {
      cwd: __dirname,
      stdio: 'inherit'
    });
    
    server.on('error', (err) => {
      console.error('❌ Failed to start static server:', err.message);
      console.log('🔄 Falling back to proxy server...');
      
      const proxy = spawn('node', ['proxy-server.js'], {
        cwd: __dirname,
        stdio: 'inherit'
      });
      
      proxy.on('error', (err) => {
        console.error('❌ Failed to start proxy server:', err.message);
        process.exit(1);
      });
    });
    
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down frontend server...');
      server.kill();
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ Launch failed:', error.message);
    process.exit(1);
  }
}

main().catch(console.error);
