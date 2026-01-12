import { Appointment, Context, Session } from '../models/index.js';

export const createAppointment = async (sessionId, appointmentDetails) => {
  try {
    const context = await Context.findOne({ sessionId });

    const appointment = new Appointment({
      sessionId,
      contextId: context?._id || null,
      appointmentDetails: {
        ownerName: appointmentDetails.ownerName,
        petName: appointmentDetails.petName,
        phoneNumber: appointmentDetails.phoneNumber,
        preferredDate: appointmentDetails.preferredDate,
        preferredTime: appointmentDetails.preferredTime,
        notes: appointmentDetails.notes || null,
      },
      status: 'pending',
    });

    await appointment.save();

    await Session.findOneAndUpdate(
      { sessionId },
      { status: 'appointment_completed' }
    );

    return appointment;
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
};

export const getAppointmentsBySession = async (sessionId) => {
  try {
    const appointments = await Appointment.aggregate([
      { $match: { sessionId } },
      {
        $lookup: {
          from: 'contexts',
          localField: 'contextId',
          foreignField: '_id',
          as: 'context',
        },
      },
      { $unwind: { path: '$context', preserveNullAndEmptyArrays: true } },
      { $sort: { createdAt: -1 } },
    ]);

    return appointments;
  } catch (error) {
    console.error('Error getting appointments:', error);
    throw error;
  }
};

export const getAppointmentBySession = async (sessionId) => {
  try {
    const appointment = await Appointment.findOne({ sessionId }).sort({ createdAt: -1 });
    return appointment;
  } catch (error) {
    console.error('Error getting appointment by session:', error);
    throw error;
  }
};

export const getAllAppointments = async (filters = {}) => {
  try {
    const query = {};

    if (filters.status) {
      query.status = filters.status;
    }
    if (filters.phoneNumber) {
      query['appointmentDetails.phoneNumber'] = filters.phoneNumber;
    }
    if (filters.dateFrom || filters.dateTo) {
      query['appointmentDetails.preferredDate'] = {};
      if (filters.dateFrom) {
        query['appointmentDetails.preferredDate'].$gte = filters.dateFrom;
      }
      if (filters.dateTo) {
        query['appointmentDetails.preferredDate'].$lte = filters.dateTo;
      }
    }

    const appointments = await Appointment.aggregate([
      { $match: query },
      {
        $lookup: {
          from: 'contexts',
          localField: 'contextId',
          foreignField: '_id',
          as: 'context',
        },
      },
      { $unwind: { path: '$context', preserveNullAndEmptyArrays: true } },
      { $sort: { createdAt: -1 } },
    ]);

    return appointments;
  } catch (error) {
    console.error('Error getting all appointments:', error);
    throw error;
  }
};

export const updateAppointmentStatus = async (appointmentId, status) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true }
    );

    return appointment;
  } catch (error) {
    console.error('Error updating appointment status:', error);
    throw error;
  }
};

export default {
  createAppointment,
  getAppointmentsBySession,
  getAppointmentBySession,
  getAllAppointments,
  updateAppointmentStatus,
};
