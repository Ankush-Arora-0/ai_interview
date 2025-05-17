import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User.js';

const router = express.Router();
const saltRounds = 10;

// Helper to validate strings
const isNonEmptyString = (val) =>
  typeof val === 'string' && val.trim().length > 0;

// Register
router.post('/register', async (req, res) => {
  const { name, email, password,role } = req.body;

  // Null/empty checks
  if (!isNonEmptyString(name)) {
    return res.status(400).json({ message: 'Name is required' });
  }
  if (!isNonEmptyString(email)) {
    return res.status(400).json({ message: 'Email is required' });
  }
  if (!isNonEmptyString(password)) {
    return res.status(400).json({ message: 'Password is required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new User({ name: name.trim(), email: email.trim(), password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Error registering user' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Null/empty checks
  if (!isNonEmptyString(email)) {
    return res.status(400).json({ message: 'Email is required' });
  }
  if (!isNonEmptyString(password)) {
    return res.status(400).json({ message: 'Password is required' });
  }

  try {
    const user = await User.findOne({ email: email.trim() });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    res.status(200).json({ message: 'Login successful', userId: user._id });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Login error' });
  }
});

export default router;
