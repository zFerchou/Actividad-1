const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    (req, res, next) => {
      if (req.path.startsWith('/notificaciones/leida')) {
        return createProxyMiddleware({
          target: 'http://localhost:8080',
          changeOrigin: true,
        })(req, res, next);
      }
      next();
    }
  );
};
