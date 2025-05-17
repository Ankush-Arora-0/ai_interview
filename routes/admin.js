// routes/admin.js
import express from 'express';
import User from '../models/User.js';
import Interview from '../models/interview.js';
import authMiddleware from '../middleware/authMiddleware.js';
//import adminCheck from '../middleware/adminCheck.js';

const router = express.Router();

router.get(
  '/stats',
  authMiddleware,
  // adminCheck,
  async (req, res) => {
    try {
      const totalUsers = await User.countDocuments();
      const totalInterviews = await Interview.countDocuments();
      const recentUsers = await User.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name email');

      res.json({ totalUsers, totalInterviews, recentUsers });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error fetching stats' });
    }
  }
);

export default router;
