import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, email, password, role = 'user' } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists',
        conflict: existingUser.email === email ? 'email' : 'username',
      });
    }
    const user = new User({
      username,
      email,
      password: await bcrypt.hash(password, 10),
      role,
    });

    await user.save();
    const payload = {
      user: {
        id: user._id.toString(),
        role: user.role || 'user',
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) {
          console.error('JWT Error:', err);
          return res.status(500).json({ message: 'Error generating token' });
        }
        res.status(201).json({
          token,
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role || 'user',
          },
        });
      }
    );
  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = {
      user: {
        id: user._id.toString(), 
        role: user.role || 'user',
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) {
          console.error('JWT Error:', err);
          return res.status(500).json({ message: 'Error generating token' });
        }
        res.json({
          token,
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role || 'user',
          },
        });
      }
    );
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
});

export default router;