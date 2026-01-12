import mongoose from 'mongoose';

const contextSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  userId: {
    type: String,
    index: true,
  },
  userName: {
    type: String,
  },
  petName: {
    type: String,
  },
  source: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

// Indexes for efficient querying
contextSchema.index({ sessionId: 1 });
contextSchema.index({ userId: 1 });

const Context = mongoose.model('Context', contextSchema);

export default Context;
