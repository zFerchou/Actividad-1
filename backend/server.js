const express = require('express');
const cors = require('cors'); // ← AÑADIR
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const config = require('./config');
const usuariosRoutes = require('./routes/usuarios');

const app = express();


app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));


app.use(bodyParser.json());


app.use(express.static('public'));


app.use('/usuarios', usuariosRoutes);


const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.listen(config.server.port, () => {
  console.log(`Servidor corriendo en http://localhost:${config.server.port}`);
  console.log(`API de usuarios: http://localhost:${config.server.port}/usuarios`);
  console.log(`Documentación Swagger: http://localhost:${config.server.port}/docs`);
});