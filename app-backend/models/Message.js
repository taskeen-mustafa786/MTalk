const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['text', 'image', 'file', 'voice', 'location', 'reaction'], default: 'text' },
  content: String,
  status: { type: String, enum: ['sent', 'delivered', 'read'], default: 'sent' },
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Message',MessageSchema)