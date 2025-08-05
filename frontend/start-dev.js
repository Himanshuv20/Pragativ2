const { spawn } = require('child_process');
const path = require('path');

// Set environment variables
process.env.PORT = '3001';
process.env.NODE_OPTIONS = '--max-old-space-size=8192';
process.env.BROWSER = 'none'; // Don't auto-open browser

console.log('🌾 Starting Crop Calendar Frontend...');
console.log('📍 Port: 3001');
console.log('💾 Memory: 8GB allocated');

// Start React development server
const reactDev = spawn('npm', ['start'], {
  cwd: __dirname,
  stdio: 'inherit',
  env: {
    ...process.env,
    FORCE_COLOR: '1'
  }
});

reactDev.on('error', (err) => {
  console.error('❌ Failed to start React dev server:', err);
  process.exit(1);
});

reactDev.on('close', (code) => {
  console.log(`🛑 React dev server exited with code ${code}`);
  process.exit(code);
});

process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down frontend...');
  reactDev.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  reactDev.kill('SIGTERM');
  process.exit(0);
});
