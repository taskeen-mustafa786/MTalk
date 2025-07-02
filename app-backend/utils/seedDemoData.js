// utils/seedDemoData.js
const User = require('../models/User');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

async function seedDemoData() {
  const count = await User.countDocuments();
  if (count > 0) return; // already seeded

  try {
    const password = 'password123';
    const passwordHash = await bcrypt.hash(password, 10);

    const users = [
      { username: 'alice', email: 'alice@example.com', displayName: 'Alice Johnson' },
      { username: 'bob', email: 'bob@example.com', displayName: 'Bob Smith' },
      { username: 'carol', email: 'carol@example.com', displayName: 'Carol White' },
      { username: 'dave', email: 'dave@example.com', displayName: 'Dave Brown' },
      { username: 'eve', email: 'eve@example.com', displayName: 'Eve Davis' },
    ];

    const savedUsers = [];
    for (const u of users) {
      const user = new User({
        ...u,
        password: password,
        verified: true,
      });
      await user.save();
      savedUsers.push(user);
    }

    // Individual conversation between Alice and Bob
    const conv1 = new Conversation({
      isGroup: false,
      members: [savedUsers[0]._id, savedUsers[1]._id],
      name: 'Alice & Bob'
    });
    await conv1.save();

    const msg1 = new Message({
      conversation: conv1._id,
      sender: savedUsers[0]._id,
      type: 'text',
      content: 'Hey Bob! Welcome to the app.',
      status: 'read',
      readBy: [savedUsers[0]._id, savedUsers[1]._id],
    });

    const msg2 = new Message({
      conversation: conv1._id,
      sender: savedUsers[1]._id,
      type: 'text',
      content: 'Thanks Alice! Looks great.',
      status: 'read',
      readBy: [savedUsers[0]._id, savedUsers[1]._id],
    });

    await msg1.save();
    await msg2.save();
    conv1.lastMessage = msg2._id;
    await conv1.save();

    // Group conversation
    const groupConv = new Conversation({
      isGroup: true,
      members: savedUsers.map((u) => u._id),
      name: 'Demo Group Chat',
    });
    await groupConv.save();

    const groupMsg = new Message({
      conversation: groupConv._id,
      sender: savedUsers[2]._id,
      type: 'text',
      content: 'Welcome everyone to the group!',
      status: 'delivered',
      readBy: [savedUsers[2]._id],
    });

    await groupMsg.save();
    groupConv.lastMessage = groupMsg._id;
    await groupConv.save();

    console.log('✅ Demo data seeded successfully with 5 users and a group chat.');
  } catch (err) {
    console.error('❌ Error seeding demo data:', err);
  }
}

module.exports = { seedDemoData };
