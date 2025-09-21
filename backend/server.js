const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const config = require('./config');
const usuariosRoutes = require('./routes/usuarios');
const authRoutes = require('./routes/auth');
const perfilRoutes = require('./routes/perfil'); // ← IMPORTACIÓN AÑADIDA
const notificacionesRoutes = require('./routes/notificaciones');

const app = express();

// CORS configuration
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Routes
app.use('/usuarios', usuariosRoutes);
app.use('/auth', authRoutes);
app.use('/perfil', perfilRoutes); // ← RUTA AÑADIDA
app.use('/notificaciones', notificacionesRoutes);

// Swagger documentation
const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Ruta de salud general
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    services: {
      usuarios: 'active',
      auth: 'active',
      perfil: 'active' // ← AÑADIDO
    }
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Ruta no encontrada',
    availableRoutes: [
      '/usuarios',
      '/auth', 
      '/perfil',
      '/notificaciones',
      '/docs',
      '/health'
    ]
  });
});

// SOCKET.IO refactor
const http = require('http');
const server = http.createServer(app);
const { initSocket } = require('./socket');
initSocket(server);

// Iniciar servidor
server.listen(config.server.port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${config.server.port}`);
  console.log(`👥 API de usuarios: http://localhost:${config.server.port}/usuarios`);
  console.log(`🔐 API de auth: http://localhost:${config.server.port}/auth`);
  console.log(`👤 API de perfil: http://localhost:${config.server.port}/perfil`);
  console.log(`🔔 API de notificaciones: http://localhost:${config.server.port}/notificaciones`);
  console.log(`📚 Documentación Swagger: http://localhost:${config.server.port}/docs`);
  console.log(`❤️  Health check: http://localhost:${config.server.port}/health`);
});