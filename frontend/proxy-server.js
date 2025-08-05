const http = require('http');
const httpProxy = require('http-proxy');

const PORT = 3001;
const REACT_DEV_PORT = 3000;
const BACKEND_URL = 'http://localhost:5001';

// Create a proxy for the React dev server
const reactProxy = httpProxy.createProxyServer({
  target: `http://localhost:${REACT_DEV_PORT}`,
  changeOrigin: true,
  ws: true
});

// Create a proxy for the backend API
const apiProxy = httpProxy.createProxyServer({
  target: BACKEND_URL,
  changeOrigin: true
});

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // Proxy API requests to backend
  if (req.url.startsWith('/api/')) {
    console.log(`Proxying API ${req.method} ${req.url} to backend`);
    apiProxy.web(req, res);
    return;
  }
  
  // Proxy everything else to React dev server
  console.log(`Proxying ${req.method} ${req.url} to React dev server`);
  reactProxy.web(req, res);
});

// Handle WebSocket connections for React hot reload
server.on('upgrade', (req, socket, head) => {
  reactProxy.ws(req, socket, head);
});

server.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
  console.log(`- Frontend: proxying to React dev server on port ${REACT_DEV_PORT}`);
  console.log(`- API: proxying to backend on ${BACKEND_URL}`);
  console.log(`\nStart React dev server with: npm start (in another terminal)`);
});

// Handle proxy errors
reactProxy.on('error', (err, req, res) => {
  console.error('React proxy error:', err.message);
  if (!res.headersSent) {
    res.writeHead(502, { 'Content-Type': 'text/plain' });
    res.end('React dev server not available. Please start it with: npm start');
  }
});

apiProxy.on('error', (err, req, res) => {
  console.error('API proxy error:', err.message);
  if (!res.headersSent) {
    res.writeHead(502, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Backend API not available' }));
  }
});
