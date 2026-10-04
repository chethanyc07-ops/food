const { Server } = require('socket.io');
const config = require('./env');

let io = null;

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: [config.CLIENT_URL, 'http://localhost:3000', 'http://127.0.0.1:3000'],
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);

    socket.on('join_recommendation', (recommendationId) => {
      socket.join(`rec_${recommendationId}`);
      console.log(`[Socket] Client ${socket.id} joined room rec_${recommendationId}`);
    });

    socket.on('disconnect', () => {
      console.log(`[Socket] Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    // Return dummy object if not yet initialized so calls don't crash
    return {
      to: () => ({ emit: () => {} }),
      emit: () => {},
    };
  }
  return io;
};

module.exports = { initSocket, getIO };
