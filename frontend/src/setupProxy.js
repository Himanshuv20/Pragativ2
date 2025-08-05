const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Proxy all /api requests to backend
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5000/api',  // Include /api in target
      changeOrigin: true,
      secure: false,
      pathRewrite: {
        '^/api': ''  // Strip /api since it's already in target
      },
      logLevel: 'debug',
      onProxyReq: (proxyReq, req, res) => {
        console.log('🔄 Proxying request:', req.method, req.url, '-> http://localhost:5000/api' + req.url.replace('/api', ''));
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log('✅ Proxy response:', proxyRes.statusCode, req.url);
      },
      onError: (err, req, res) => {
        console.error('❌ Proxy error:', err);
      }
    })
  );
};
