const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const {seedDemoData} = require('./utils/seedDemoData')


// Import routes
const authRoutes = require('./routes/authRoutes');
const conversationRoutes = require('./routes/conversationRoutes');
const mediaRoutes = require('./routes/mediaRoutes');
const messageRoutes = require('./routes/messageRoutes');
const userRoutes = require('./routes/userRoutes');
const contactRoutes = require('./routes/contactRoutes');



const app = express();
const server = http.createServer(app);

// Enhanced CORS configuration
const allowedOrigins = ['http://localhost:5173']; // Add your frontend URL(s)

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// // Initialize Socket.IO with proper CORS settings
const io = require('socket.io')(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  },
  allowEIO3: true // For Socket.IO v2/v3 compatibility
});

// // MongoDB connection with timeout settings
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://taskeen-mustafa786:TM786@taskeen.17hikpk.mongodb.net/?retryWrites=true&w=majority&appName=Taskeen';

mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000
})
.then(() => {
  console.log('MongoDB connected successfully');
  
  // Socket.IO event handlers
  require('./sockets/socketHandlers')(io);

  
  console.log('Socket.IO initialized');

  seedDemoData();
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// // Middleware
app.use(express.json());

// // Attach io to request object
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);
app.use('/api/contacts', contactRoutes); // separate base path


// // Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
