import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar:   { type: String },
  badges:   { type: [String], default: [] }, // Array of badge IDs
  level:    { type: Number, default: 1 },
  xp:       { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  otp:        { type: String },
  otpExpires: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);
