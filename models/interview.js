// models/Interview.js
import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  answers: [String],
  feedback: [String],
  date: {
    type: Date,
    default: Date.now
  }
});

// Check if the model already exists to avoid overwriting
const Interview = mongoose.models.Interview || mongoose.model('Interview', interviewSchema);

export default Interview;
