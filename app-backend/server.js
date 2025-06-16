const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const conversationRoutes = require('./routes/conversationRoutes');
const mediaRoutes = require('./routes/mediaRoutes');
const messageRoutes = require('./routes/messageRoutes');
const userRoutes = require('./routes/userRoutes');


const setupSocketHandlers = require('./sockets/socketHandlers');

const app = express();
const server = http.createServer(app)
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
});

//Middleware 
app.use(express.json());
app.use(cors());

//Routes
app.use('/api/routes/authRoutes',authRoutes);
app.use('/api/routes/conversation',conversationRoutes);
app.use('/api/routes/media',mediaRoutes);
app.use('/api/routes/message',messageRoutes);
app.use('/api/routes/users',userRoutes);

//socket.io setup
setupSocketHandlers(io)

//mongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://taskeen-mustafa786:TM786@taskeen.17hikpk.mongodb.net/?retryWrites=true&w=majority&appName=Taskeen';
mongoose.connect(MONGO_URI).then(() => {
  console.log('MongoDB connected');

  // Seed demo data after connection
const { seedDemoData } = require('./utils/seedDemoData');
  seedDemoData();
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Start server
const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



