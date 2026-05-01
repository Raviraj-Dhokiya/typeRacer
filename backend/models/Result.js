import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  wpm: { type: Number, required: true },
  accuracy: { type: Number, required: true },
  timeTaken: { type: Number, required: true },
  mode: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

export default mongoose.model('Result', resultSchema);
