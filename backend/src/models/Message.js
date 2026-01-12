import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    index: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['user', 'assistant'],
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

// Compound indexes for efficient querying and sorting
messageSchema.index({ sessionId: 1, createdAt: 1 });
messageSchema.index({ sessionId: 1, role: 1 });

const Message = mongoose.model('Message', messageSchema);

export default Message;
