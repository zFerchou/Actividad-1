const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const config = require('./config');
const usuariosRoutes = require('./routes/usuarios');

const app = express();

// ✅✅✅ MIDDLEWARE CORS ESPECÍFICO PARA RESPUESTAS JSON
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    // Manejar preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

// ✅ Middleware
app.use(express.json());

// ✅ Rutas
app.use('/usuarios', usuariosRoutes);

// ✅ Swagger
const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ✅ Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Error interno del servidor' });
});

// ✅ Servidor
app.listen(config.server.port, () => {
    console.log(`Servidor corriendo en http://localhost:${config.server.port}`);
    console.log(`API de usuarios: http://localhost:${config.server.port}/usuarios`);
    console.log(`Documentación Swagger: http://localhost:${config.server.port}/docs`);
});