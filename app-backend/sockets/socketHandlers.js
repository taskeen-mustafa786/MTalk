const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const socketInstance = require('./socketInstance');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';

const onlineUsers = new Map(); // userId => socket.id

function setupSocketHandlers(io) {
  socketInstance.setSocketInstance(io);

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication error'));
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) return next(new Error('Authentication error'));
      socket.user = user;
      next();
    });
  });

  io.on('connection', (socket) => {
    const userId = socket.user.id;
    onlineUsers.set(userId, socket.id);

    User.findByIdAndUpdate(userId, { online: true, lastSeen: new Date() }).exec();

    Conversation.find({ members: userId }).then(conversations => {
      conversations.forEach(conv => {
        socket.join(conv._id.toString());
      });
    });

    socket.broadcast.emit('userOnline', { userId });

    socket.on('disconnect', () => {
      onlineUsers.delete(userId);
      User.findByIdAndUpdate(userId, { online: false, lastSeen: new Date() }).exec();
      socket.broadcast.emit('userOffline', { userId });
    });

    socket.on('typing', ({ conversationId, isTyping }) => {
      socket.to(conversationId).emit('typing', { userId, isTyping });
    });

    socket.on('sendMessage', async (data, callback) => {
      try {
        const { conversationId, type, content } = data;
        if (!conversationId || !type || !content) return callback({ status: 'error', message: 'Missing fields' });

        const message = new Message({
          conversation: conversationId,
          sender: userId,
          type,
          content,
          status: 'sent',
          readBy: [userId],
        });
        await message.save();

        await Conversation.findByIdAndUpdate(conversationId, { lastMessage: message._id, updatedAt: new Date() });

        io.to(conversationId).emit('newMessage', {
          ...message.toObject(),
          sender: { _id: userId }
        });

        callback({ status: 'ok', message });
      } catch (err) {
        console.error(err);
        callback({ status: 'error', message: 'Server error' });
      }
    });

    socket.on('messageRead', async ({ conversationId, messageId }) => {
      try {
        await Message.findByIdAndUpdate(messageId, { $addToSet: { readBy: userId } });
        socket.to(conversationId).emit('messageRead', { messageId, userId });
      } catch (err) {
        console.error(err);
      }
    });
  });
}

module.exports = setupSocketHandlers;
