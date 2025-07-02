const User = require('../models/User');
const Conversation = require('../models/Conversation'); // Assuming contact info comes from conversations
const path = require('path');
const fs = require('fs');

async function getProfile(req, res) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      id: user._id,
      username: user.username,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      status: user.status,
      online: user.online,
      lastSeen: user.lastSeen
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function updateProfile(req, res) {
  try {
    const updates = req.body;

    const allowedUpdates = ['displayName'];
    const filteredUpdates = {};
    allowedUpdates.forEach(key => {
      if (updates[key] !== undefined) {
        filteredUpdates[key] = updates[key];
      }
    });

    const user = await User.findByIdAndUpdate(req.user.id, filteredUpdates, { new: true });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      id: user._id,
      username: user.username,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      status: user.status,
      online: user.online
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function updateStatus(req, res) {
  try {
    const { status } = req.body;

    const user = await User.findByIdAndUpdate(req.user.id, { status }, { new: true });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ status: user.status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function updateAvatar(req, res) {
  try {
    const { avatarUrl } = req.body;

    const user = await User.findByIdAndUpdate(req.user.id, { avatarUrl }, { new: true });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ avatarUrl: user.avatarUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function getContacts(req, res) {
  try {
    const userId = req.user.id;

    // Assuming contacts are users from non-group conversations that the user is in
    const conversations = await Conversation.find({
      isGroup: false,
      members: userId
    }).populate('members', 'username displayName avatarUrl status online');

    const contacts = [];

    conversations.forEach(conv => {
      conv.members.forEach(member => {
        if (member._id.toString() !== userId) {
          contacts.push(member);
        }
      });
    });

    res.json(contacts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  getProfile,
  updateProfile,
  updateStatus,
  updateAvatar,
  getContacts
};
