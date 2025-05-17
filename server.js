import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js'; // Import auth routes
import interviewRoutes from './routes/interviewRoutes.js';
import Interview from './models/interview.js'; // Import Interview model to avoid redefining it
import adminRoutes from './routes/admin.js';
import path from 'path';
//app.use('/api/admin', adminRoutes);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use(express.static('dist'));
// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes); // Make sure to use the right prefix for authentication routes
app.use('/api/interview', interviewRoutes); // Use this for interview-specific routes

// Post route to save interview responses
app.post('/api/submit', async (req, res) => {
  const { userId, answers, feedback } = req.body;

  try {
    const interview = new Interview({ userId, answers, feedback });
    await interview.save();
    res.status(201).send({ message: 'Interview responses saved successfully' });
  } catch (err) {
    res.status(500).send({ message: 'Error saving responses', error: err });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
