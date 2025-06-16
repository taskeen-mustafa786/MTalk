const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
  isGroup: { type: Boolean, default: false },
  name: String,
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
}, { timestamps: true });

module.exports = mongoose.model('Conversation',ConversationSchema)