const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const User = require('../models/User');
const io = require('../sockets/socketInstance'); 

async function sendMessage(req, res) {
  try {
    const { conversationId, type, content } = req.body;
    if (!conversationId || !type || !content) return res.status(400).json({ message: 'Missing fields' });

    const message = new Message({
      conversation: conversationId,
      sender: req.user.id,
      type,
      content,
      status: 'sent',
    });
    await message.save();

    await Conversation.findByIdAndUpdate(conversationId, { lastMessage: message._id, updatedAt: new Date() });

    // Emit via Socket.io
    const populatedMessage = await message.populate('sender', 'displayName avatarUrl username').execPopulate();
    io.to(conversationId).emit('newMessage', populatedMessage);

    res.json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  sendMessage,
};
