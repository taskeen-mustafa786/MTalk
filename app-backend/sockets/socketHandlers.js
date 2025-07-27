module.exports = function(io) {
  io.on('connection', (socket) => {
    console.log('📡 Client connected:', socket.id);

    socket.on('joinConversation', (conversationId) => {
      socket.join(conversationId);
      console.log(`👥 User joined conversation: ${conversationId}`);
    });

    socket.on('disconnect', () => {
      console.log('❌ Client disconnected:', socket.id);
    });

    socket.on('error', (err) => {
      console.error('⚠️ Socket error:', err);
    });
  });
};
