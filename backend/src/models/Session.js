import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'booking_in_progress', 'appointment_completed', 'closed'],
    default: 'active',
    index: true,
  },
  currentIntent: {
    type: String,
    enum: ['general_qa', 'appointment_booking', 'unknown'],
    default: 'general_qa',
  },
  lastActivityAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  messageCount: {
    type: Number,
    default: 0,
  },
  bookingData: {
    type: {
      ownerName: String,
      petName: String,
      phoneNumber: String,
      preferredDate: String,
      preferredTime: String,
      notes: String,
    },
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexes for efficient querying
sessionSchema.index({ sessionId: 1 });
sessionSchema.index({ lastActivityAt: 1 });
sessionSchema.index({ status: 1 });

// Update updatedAt before saving
sessionSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Session = mongoose.model('Session', sessionSchema);

export default Session;
