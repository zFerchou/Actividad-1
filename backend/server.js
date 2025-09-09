const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const config = require('./config');
const usuariosRoutes = require('./routes/usuarios');

const app = express();

// Middleware
app.use(bodyParser.json());

// Servir front-end estático (tu index.html y demás archivos)
app.use(express.static('public'));

// Rutas API
app.use('/usuarios', usuariosRoutes);

// Documentación Swagger
const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Iniciar servidor
app.listen(config.server.port, () => {
  console.log(`Servidor corriendo en http://localhost:${config.server.port}`);
  console.log(`API de usuarios: http://localhost:${config.server.port}/usuarios`);
  console.log(`Documentación Swagger: http://localhost:${config.server.port}/docs`);
});
