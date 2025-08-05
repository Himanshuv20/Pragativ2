const http = require('http');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const PORT = 3000;
const BACKEND_URL = 'http://localhost:5000';

const server = http.createServer(async (req, res) => {
  const url = req.url;
  
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // API proxy
  if (url.startsWith('/api/')) {
    try {
      const proxyUrl = `${BACKEND_URL}${url}`;
      console.log(`Proxying ${req.method} ${url} to ${proxyUrl}`);
      
      const response = await axios({
        method: req.method,
        url: proxyUrl,
        headers: req.headers,
        data: req.method !== 'GET' ? req : undefined
      });
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(response.data));
    } catch (error) {
      console.error('Proxy error:', error.message);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Proxy error', details: error.message }));
    }
    return;
  }
  
  // Serve static files - try build first, then public
  let filePath;
  
  if (url === '/') {
    // Serve index.html for root
    filePath = path.join(__dirname, 'build', 'index.html');
    if (!fs.existsSync(filePath)) {
      filePath = path.join(__dirname, 'public', 'index.html');
    }
  } else {
    // Try build directory first, then public
    filePath = path.join(__dirname, 'build', url);
    if (!fs.existsSync(filePath)) {
      filePath = path.join(__dirname, 'public', url);
    }
    if (!fs.existsSync(filePath)) {
      // For React Router, serve index.html for any unknown routes
      filePath = path.join(__dirname, 'build', 'index.html');
      if (!fs.existsSync(filePath)) {
        filePath = path.join(__dirname, 'public', 'index.html');
      }
    }
  }
  
  try {
    const content = fs.readFileSync(filePath);
    const ext = path.extname(filePath);
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
  } catch (error) {
    res.writeHead(404);
    res.end('File not found');
  }
});

server.listen(PORT, () => {
  console.log(`✅ Frontend server running on http://localhost:${PORT}`);
  console.log(`📁 Serving files from build directory`);
  console.log(`🔗 Proxying API requests to ${BACKEND_URL}`);
  console.log(`🌐 Open http://localhost:${PORT} in your browser`);
});
