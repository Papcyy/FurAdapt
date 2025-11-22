import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/database.js';

// Import routes
import authRoutes from './routes/auth.js';
import petRoutes from './routes/pets.js';
import adoptionRoutes from './routes/adoptions.js';
import chatRoutes from './routes/chat.js';
import analyticsRoutes from './routes/analytics.js';

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST"]
  }
});

// Connect to MongoDB
connectDB();

// Rate limiting - More permissive for development
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 1000, // limit each IP to 1000 requests per minute (very generous for dev)
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware - CORS must be first!
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));
app.options('*', cors()); // Enable pre-flight for all routes
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files for uploaded images
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/adoptions', adoptionRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/analytics', analyticsRoutes);

// Socket.IO for real-time chat
const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('user_online', (userId) => {
    connectedUsers.set(userId, socket.id);
    console.log(`User ${userId} is online with socket ${socket.id}`);
  });

  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on('send_message', (data) => {
    console.log('Broadcasting message to room:', data.room);
    socket.to(data.room).emit('receive_message', data);
  });

  socket.on('typing', (data) => {
    socket.to(data.room).emit('user_typing', data);
  });

  socket.on('stop_typing', (data) => {
    socket.to(data.room).emit('user_stop_typing', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    // Remove user from connected users
    for (const [userId, socketId] of connectedUsers.entries()) {
      if (socketId === socket.id) {
        connectedUsers.delete(userId);
        break;
      }
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { io };
