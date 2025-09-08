const express = require("express");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
<<<<<<< HEAD
=======
const bodyParser = require("body-parser");
const sequelize = require("./config"); // conexión a PostgreSQL
const usuarioRoutes = require("./routes/usuarios"); // tus rutas de usuarios
>>>>>>> 358ad3ceb5687a92fb6e698611069d1a0a10c14b

const app = express();
const swaggerDocument = YAML.load("./swagger.yaml");

<<<<<<< HEAD
// Ruta donde se mostrará la documentación
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}/docs`);
=======
// Middleware para parsear JSON
app.use(bodyParser.json());

// Rutas de la API
app.use("/usuarios", usuarioRoutes);

// Documentación con Swagger
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Sincronizar con la BD
sequelize
  .sync()
  .then(() => {
    console.log("Base de datos sincronizada");
  })
  .catch((err) => {
    console.error("Error al sincronizar la base de datos:", err);
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}/docs`);
  console.log(`API de usuarios disponible en http://localhost:${PORT}/usuarios`);
>>>>>>> 358ad3ceb5687a92fb6e698611069d1a0a10c14b
});
