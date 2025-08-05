#!/usr/bin/env node

// Custom start script that bypasses memory issues
const { spawn } = require('child_process');
const path = require('path');

// Set environment variables for memory optimization
process.env.PORT = '3001';
process.env.GENERATE_SOURCEMAP = 'false';
process.env.SKIP_PREFLIGHT_CHECK = 'true';
process.env.TSC_COMPILE_ON_ERROR = 'true';
process.env.ESLINT_NO_DEV_ERRORS = 'true';
process.env.FAST_REFRESH = 'false';
process.env.NODE_OPTIONS = '--max-old-space-size=8192';

// Disable TypeScript checking by setting the environment variable
process.env.TSC_COMPILE_ON_ERROR = 'true';
process.env.ESLINT_NO_DEV_ERRORS = 'true';

console.log('Starting React development server with optimized settings...');
console.log('Port: 3001');
console.log('Memory limit: 8GB');
console.log('TypeScript checking: Disabled');
console.log('Source maps: Disabled for better performance');

const child = spawn('npx', ['react-scripts', 'start'], {
  stdio: 'inherit',
  shell: true,
  env: process.env
});

child.on('exit', (code) => {
  console.log(`React development server exited with code ${code}`);
  process.exit(code);
});

child.on('error', (error) => {
  console.error('Error starting React development server:', error);
  process.exit(1);
});
