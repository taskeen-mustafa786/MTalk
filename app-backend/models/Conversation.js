const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema(
  {
    // Is this a group chat or private 1-on-1
    isGroup: { type: Boolean, default: false },

    // Optional group name
    name: { type: String },

    // Members in the conversation
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    // Only for groups: admins who can rename, add/remove users, etc.
    admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    // Reference to last message for preview in sidebar
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Optional: clean JSON response for frontend
ConversationSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

module.exports = mongoose.model('Conversation', ConversationSchema);
