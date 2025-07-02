const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');

async function getConversations(req, res) {
  try {
    const conversations = await Conversation.find({ members: req.user.id })
      .sort({ updatedAt: -1 })
      .populate('lastMessage')
      .populate('members', 'displayName avatarUrl username online')
      .lean();

    const results = await Promise.all(conversations.map(async conv => {
      const lastMessage = conv.lastMessage;
      if (lastMessage) {
        const sender = await User.findById(lastMessage.sender).select('displayName avatarUrl username').lean();
        lastMessage.sender = sender;
      }
      return conv;
    }));

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function getMessages(req, res) {
  try {
    const conversationId = req.params.id;
    const limit = Math.min(parseInt(req.query.limit) || 50, 100);
    const before = req.query.before ? new Date(req.query.before) : new Date();

    const messages = await Message.find({
      conversation: conversationId,
      createdAt: { $lt: before }
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('sender', 'displayName avatarUrl')
      .lean();

    res.json(messages.reverse());
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function createConversation(req, res) {
  try {
    const { members, name, isGroup } = req.body;
    if (!Array.isArray(members) || members.length === 0) return res.status(400).json({ message: 'Members required' });

    if (!members.includes(req.user.id)) members.push(req.user.id);

    const conversation = new Conversation({ members, name, isGroup: !!isGroup, admins: [req.user.id] });
    await conversation.save();

    res.status(201).json(conversation); // Return 201 for created resource
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  getConversations,
  getMessages,
  createConversation,
};
