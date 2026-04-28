import 'dotenv/config'; // Loads .env file
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import habitRoutes from './routes/habitRoutes.js'; // Ensure you have this

const app = express();

// 1. Security Middleware
app.use(helmet()); 
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' })); 
app.use(express.json());

// 2. Rate Limiting (Required for Security Rubric)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per window
  message: 'Too many authentication attempts, please try again later.'
});

// 3. Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB', err));

// 4. Routes
app.use('/api/auth', authLimiter, authRoutes); // Apply limiter only to auth routes
app.use('/api/habits', habitRoutes);

// 5. Server Startup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
