// socket.js
const { Server } = require('socket.io');

let io;

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('joinConversation', (conversationId) => {
      socket.join(conversationId);
      console.log(`User joined conversation: ${conversationId}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
}

function socketMiddleware(req, res, next) {
  req.io = io;
  next();
}

module.exports = {
  initSocket,
  socketMiddleware,
  getIo: () => io,
};
