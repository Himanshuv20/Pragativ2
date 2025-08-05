// Simple test server to verify Node.js is working
const http = require('http');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting frontend server...');

const server = http.createServer((req, res) => {
  console.log(`📝 Request: ${req.method} ${req.url}`);
  
  // Serve the React build files
  let filePath = req.url === '/' ? '/index.html' : req.url;
  const fullPath = path.join(__dirname, 'build', filePath);
  
  console.log(`📁 Trying to serve: ${fullPath}`);
  
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath);
    const ext = path.extname(fullPath);
    
    const contentType = {
      '.html': 'text/html',
      '.js': 'application/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.ico': 'image/x-icon'
    }[ext] || 'text/plain';
    
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
    console.log(`✅ Served: ${filePath}`);
  } else {
    // For SPA, serve index.html for unknown routes
    const indexPath = path.join(__dirname, 'build', 'index.html');
    if (fs.existsSync(indexPath)) {
      const content = fs.readFileSync(indexPath);
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content);
      console.log(`✅ Served index.html for: ${filePath}`);
    } else {
      res.writeHead(404);
      res.end('File not found');
      console.log(`❌ File not found: ${filePath}`);
    }
  }
});

server.listen(3000, 'localhost', () => {
  console.log('🎉 Server started successfully!');
  console.log('🌐 Frontend server running on http://localhost:3000');
  console.log('📂 Serving React build files');
  console.log('🔗 You can now open http://localhost:3000 in your browser');
});

server.on('error', (err) => {
  console.error('❌ Server error:', err);
  if (err.code === 'EADDRINUSE') {
    console.log('🔄 Port 3000 is already in use. Trying port 3001...');
    server.listen(3001, 'localhost', () => {
      console.log('🌐 Frontend server running on http://localhost:3001');
    });
  }
});
