import express from 'express';
import { validateAppointmentRequest } from '../middleware/validateRequest.js';
import {
  createAppointment,
  getAppointmentBySession,
  getAllAppointments,
  updateAppointmentStatus,
} from '../services/appointmentService.js';
import { updateSession, saveMessage } from '../services/sessionService.js';

const router = express.Router();

/**
 * POST /api/appointments
 * Create a new appointment
 */
router.post('/', validateAppointmentRequest, async (req, res) => {
  try {
    const { sessionId, appointmentDetails } = req.body;

    // Create appointment
    const appointment = await createAppointment(sessionId, appointmentDetails);

    // Save confirmation message
    await saveMessage(
      sessionId,
      'assistant',
      `🎉 Your appointment has been successfully booked!\n\nWe'll contact you at ${appointmentDetails.phoneNumber} to confirm. Thank you for choosing our veterinary service!`
    );

    res.status(201).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create appointment',
    });
  }
});

/**
 * GET /api/appointments/session/:sessionId
 * Get appointment by session ID
 */
router.get('/session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    const appointment = await getAppointmentBySession(sessionId);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: 'Appointment not found',
      });
    }

    res.json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    console.error('Error getting appointment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve appointment',
    });
  }
});

/**
 * GET /api/appointments
 * Get all appointments with optional filters
 * Query params: status, dateFrom, dateTo, phoneNumber
 */
router.get('/', async (req, res) => {
  try {
    const { status, dateFrom, dateTo, phoneNumber } = req.query;

    const filters = {};
    if (status) filters.status = status;
    if (dateFrom) filters.dateFrom = dateFrom;
    if (dateTo) filters.dateTo = dateTo;
    if (phoneNumber) filters.phoneNumber = phoneNumber;

    const appointments = await getAllAppointments(filters);

    res.json({
      success: true,
      data: appointments,
      count: appointments.length,
    });
  } catch (error) {
    console.error('Error getting appointments:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve appointments',
    });
  }
});

/**
 * PATCH /api/appointments/:id/status
 * Update appointment status
 */
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Status is required',
      });
    }

    const appointment = await updateAppointmentStatus(id, status);

    res.json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    console.error('Error updating appointment status:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update appointment status',
    });
  }
});

export default router;
