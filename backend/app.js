const express = require('express');
const cors = require('cors');
const config = require('./config');
const usuariosRoutes = require('./routes/usuarios');

const app = express();

// ✅ Middleware CORRECTO (usa express.json() en lugar de bodyParser)
app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json()); 


app.use('/usuarios', usuariosRoutes);

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Error interno del servidor' });
});

// Servidor
app.listen(config.server.port, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${config.server.port}`);
});