const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // <-- importa cors
const config = require('./config');
const usuariosRoutes = require('./routes/usuarios');

const app = express();

// Middleware
app.use(cors()); // <-- permite solicitudes desde cualquier origen
app.use(bodyParser.json());

// Rutas
app.use('/usuarios', usuariosRoutes);

// Servidor
app.listen(config.server.port, () => {
  console.log(`Servidor corriendo en http://localhost:${config.server.port}`);
});
