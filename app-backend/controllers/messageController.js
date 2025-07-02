const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

async function sendMessage(req, res) {
  try {
    const { conversationId, type, content } = req.body;
    
    // Validation
    if (!conversationId || !type || !content) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create and save message
    const message = new Message({
      conversation: conversationId,
      sender: req.user.id,
      type,
      content,
      status: 'sent'
    });

    await message.save();

    // Update conversation last message
    await Conversation.findByIdAndUpdate(
      conversationId,
      { 
        lastMessage: message._id,
        updatedAt: new Date() 
      }
    );

    // Populate sender details
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'displayName avatarUrl username');

    // Emit to conversation room
    req.io.to(conversationId).emit('newMessage', populatedMessage);

    return res.status(201).json(populatedMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  sendMessage
};
