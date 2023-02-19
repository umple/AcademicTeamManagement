const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  console.log(process.env.BACKEND_URL)
  app.use(
    '/api/*',
    createProxyMiddleware({
      target: process.env.REACT_APP_BACKEND_URL,
      changeOrigin: true,
    })
  );
};