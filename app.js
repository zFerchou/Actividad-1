const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const usuariosRoutes = require('./routes/usuarios');

const app = express();
app.use(bodyParser.json());

app.use('/usuarios', usuariosRoutes);

app.listen(config.server.port, () => {
  console.log(`Servidor corriendo en http://localhost:${config.server.port}`);
});
