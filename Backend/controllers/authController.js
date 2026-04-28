// controllers/authController.js
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

export const register = async (req, res) => {
  const { username, password } = req.body;
  
  // Basic validation check
  if (!username || !password) return res.status(400).json({ message: 'Please provide credentials' });

  const userExists = await User.findOne({ username });
  if (userExists) return res.status(400).json({ message: 'User already exists' });

  const user = await User.create({ username, password, role: 'user' });
  res.status(201).json({ message: 'User registered' });
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  // Use the model method instead of manual bcrypt comparison
  if (user && (await user.matchPassword(password))) {
    res.json({ token: generateToken(user._id) });
  } else {
    // 401 is the standard for failed authentication
    res.status(401).json({ message: 'Invalid credentials' });
  }
};
