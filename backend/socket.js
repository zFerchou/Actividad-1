// backend/socket.js
let ioInstance = null;
let usuariosConectados = new Map();

function initSocket(server) {
  const { Server } = require('socket.io');
  ioInstance = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
  });
  usuariosConectados = new Map();

  ioInstance.on('connection', (socket) => {
    socket.on('registrarUsuario', (usuario_id) => {
      usuariosConectados.set(usuario_id, socket.id);
    });
    socket.on('disconnect', () => {
      for (const [usuario_id, id] of usuariosConectados.entries()) {
        if (id === socket.id) {
          usuariosConectados.delete(usuario_id);
          break;
        }
      }
    });
  });
}

function getIO() {
  return ioInstance;
}

function getUsuariosConectados() {
  return usuariosConectados;
}

module.exports = { initSocket, getIO, getUsuariosConectados };
