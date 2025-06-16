const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
 username: { type: String, unique: true },
  displayName: String,
  passwordHash: String,
  avatarUrl: String,
  status: { type: String, default: 'Hey there! I am using WhatsApp Clone.' },
  online: { type: Boolean, default: false },
  lastSeen: Date,
},{timestamps:true})

module.exports = mongoose.Model('User',UserSchema)