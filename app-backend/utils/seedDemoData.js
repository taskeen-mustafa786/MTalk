const User = require('../models/User');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const { hashPassword } = require('./password');

async function seedDemoData() {
  const count = await User.countDocuments();
  if (count > 0) return; // already seeded
  try {
    const passwordHash = await hashPassword('password123');
    const user1 = new User({
      username: 'alice',
      displayName: 'Alice Johnson',
      passwordHash,
      avatarUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/b910913b-4acf-431b-928a-a6d3b55e3f53.png',
    });
    const user2 = new User({
      username: 'bob',
      displayName: 'Bob Smith',
      passwordHash,
      avatarUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/2d370cd9-c6d9-4257-a1c8-4c62a1b14de7.png',
    });
    await user1.save();
    await user2.save();

    const conv = new Conversation({
      isGroup: false,
      members: [user1._id, user2._id],
      name: 'Alice & Bob',
    });
    await conv.save();

    const msg1 = new Message({
      conversation: conv._id,
      sender: user1._id,
      type: 'text',
      content: 'Hello Bob! This is a demo chat message.',
      status: 'read',
      readBy: [user1._id, user2._id],
    });
    const msg2 = new Message({
      conversation: conv._id,
      sender: user2._id,
      type: 'text',
      content: 'Hi Alice! Glad to see you here.',
      status: 'read',
      readBy: [user1._id, user2._id],
    });
    await msg1.save();
    await msg2.save();

    conv.lastMessage = msg2._id;
    await conv.save();

    console.log('Demo data seeded.');
  } catch (err) {
    console.error('Error seeding demo data:', err);
  }
}

module.exports = { seedDemoData };
