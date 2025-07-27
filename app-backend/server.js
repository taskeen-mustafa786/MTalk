const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const { seedDemoData } = require('./utils/seedDemoData');
const { initSocket, socketMiddleware } = require('./sockets/socket'); // ✅ new

// Import routes
const authRoutes = require('./routes/authRoutes');
const conversationRoutes = require('./routes/conversationRoutes');
const mediaRoutes = require('./routes/mediaRoutes');
const messageRoutes = require('./routes/messageRoutes');
const userRoutes = require('./routes/userRoutes');
const contactRoutes = require('./routes/contactRoutes');

const app = express();
const server = http.createServer(app);

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://taskeen-mustafa786:TM786@taskeen.17hikpk.mongodb.net/?retryWrites=true&w=majority&appName=Taskeen';

mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000
})
.then(() => {
  console.log('✅ MongoDB connected successfully');

  // ✅ Initialize Socket.IO
  const io = initSocket(server);

  // ✅ Seed demo data after socket & DB ready
  seedDemoData();
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// Middleware
app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// ✅ Attach io to req
app.use(socketMiddleware);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);
app.use('/api/contacts', contactRoutes);

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
