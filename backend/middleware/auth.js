// middleware/auth.js
const jwt = require('jsonwebtoken');
const config = require('../config');

const autenticacionMiddleware = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization') || '';
    // Acepta formatos: "Bearer <token>" y si viene duplicado "Bearer Bearer <token>"
    let token = authHeader.trim();
    while (token.toLowerCase().startsWith('bearer ')) {
      token = token.slice(7).trim();
    }

    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' });
    }
    return res.status(401).json({ error: 'Token inválido' });
  }
};

module.exports = autenticacionMiddleware;