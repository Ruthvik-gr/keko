import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    index: true,
  },
  contextId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Context',
    index: true,
  },
  appointmentDetails: {
    ownerName: {
      type: String,
      required: true,
      minlength: 2,
    },
    petName: {
      type: String,
      required: true,
      minlength: 2,
    },
    phoneNumber: {
      type: String,
      required: true,
      index: true,
    },
    preferredDate: {
      type: String,
      required: true,
      index: true,
    },
    preferredTime: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
    },
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending',
    index: true,
  },
  confirmedAt: {
    type: Date,
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
appointmentSchema.index({ sessionId: 1 });
appointmentSchema.index({ contextId: 1 });
appointmentSchema.index({ 'appointmentDetails.phoneNumber': 1 });
appointmentSchema.index({ 'appointmentDetails.preferredDate': 1 });
appointmentSchema.index({ status: 1 });

// Update updatedAt before saving
appointmentSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;
