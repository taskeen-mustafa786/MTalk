module.exports = function(io) {
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Handle joining conversation rooms
    socket.on('joinConversation', (conversationId) => {
      if (socket.rooms.has(conversationId)) {
        return;
      }
      
      socket.join(conversationId);
      console.log(`User ${socket.id} joined conversation: ${conversationId}`);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });

    // Error handling
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });
};
