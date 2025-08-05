const spawn = require('child_process').spawn;

console.log('🚀 Starting React development server...');

const reactScripts = spawn('node', ['node_modules/react-scripts/scripts/start.js'], {
  stdio: 'inherit',
  cwd: process.cwd(),
  env: { ...process.env, BROWSER: 'none', PORT: '3000' }
});

reactScripts.on('close', (code) => {
  console.log(`React app exited with code ${code}`);
});

reactScripts.on('error', (error) => {
  console.error('Error starting React app:', error);
});
