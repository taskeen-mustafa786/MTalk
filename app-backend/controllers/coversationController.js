const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');

// GET /api/conversations
async function getConversations(req, res) {
  try {
    const conversations = await Conversation.find({ members: req.user.id })
      .sort({ updatedAt: -1 })
      .populate('lastMessage')
      .populate('members', 'displayName avatarUrl username email online')
      .lean();

    const results = await Promise.all(
      conversations.map(async (conv) => {
        const lastMessage = conv.lastMessage;
        if (lastMessage) {
          const sender = await User.findById(lastMessage.sender)
            .select('displayName avatarUrl username email')
            .lean();
          lastMessage.sender = sender;
        }
        return conv;
      })
    );

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// GET /api/conversations/:id/messages
async function getMessages(req, res) {
  try {
    const conversationId = req.params.id;
    const limit = Math.min(parseInt(req.query.limit) || 50, 100);
    const before = req.query.before ? new Date(req.query.before) : new Date();

    const messages = await Message.find({
      conversation: conversationId,
      createdAt: { $lt: before },
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('sender', 'displayName avatarUrl email')
      .lean();

    res.json(messages.reverse());
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// POST /api/conversations
async function createConversation(req, res) {
  try {
    const { members, name, isGroup } = req.body;
    if (!Array.isArray(members) || members.length === 0) {
      return res.status(400).json({ message: 'Members required' });
    }

    if (!members.includes(req.user.id)) {
      members.push(req.user.id);
    }

    const conversation = new Conversation({
      members,
      name,
      isGroup: !!isGroup,
      admins: [req.user.id],
    });

    await conversation.save();
    await conversation.populate('members', 'displayName avatarUrl email');

    res.status(201).json(conversation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// POST /api/conversations/start
// POST /api/conversations/start
async function startConversation(req, res) {
  const { contactId } = req.body;
  const userId = req.user.id;

  if (!contactId || contactId === userId) {
    return res.status(400).json({ message: 'Invalid contactId' });
  }

  try {
    let conversation = await Conversation.findOne({
      isGroup: false,
      members: { $all: [userId, contactId], $size: 2 },
    })
      .populate('members', 'displayName email avatarUrl')
      .populate('lastMessage');

    if (!conversation) {
      conversation = new Conversation({
        members: [userId, contactId],
        isGroup: false,
      });
      await conversation.save();
      conversation = await Conversation.findById(conversation._id)
        .populate('members', 'displayName email avatarUrl')
        .populate('lastMessage');
    }

    res.status(200).json(conversation);
  } catch (err) {
    console.error('Start conversation error:', err);
    res.status(500).json({ message: 'Error starting conversation' });
  }
}

module.exports = {
  getConversations,
  getMessages,
  createConversation,
  startConversation,
};
