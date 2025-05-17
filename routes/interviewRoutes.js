// routes/interviewRoutes.js
import express from 'express';
import Interview from '../models/interview.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Save interview answers & feedback
router.post('/submit', authMiddleware, async (req, res) => {
  const { answers, feedback } = req.body;

  try {
    const interview = new Interview({
      userId: req.user.id,
      answers,
      feedback,
    });

    await interview.save();
    res.status(201).json({ message: 'Interview saved successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save interview' });
  }
});

// Get interviews for a user
router.get('/my-interviews', authMiddleware, async (req, res) => {
  try {
    const interviews = await Interview.find({ userId: req.user.id });
    res.json(interviews);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch interviews' });
  }
});

export default router;
