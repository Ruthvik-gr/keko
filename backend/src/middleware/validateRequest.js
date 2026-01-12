/**
 * Validate chat request body
 */
export const validateChatRequest = (req, res, next) => {
  const { message, sessionId } = req.body;

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Message is required and must be a non-empty string',
    });
  }

  if (message.length > 1000) {
    return res.status(400).json({
      success: false,
      error: 'Message is too long (max 1000 characters)',
    });
  }

  next();
};

/**
 * Validate appointment creation request
 */
export const validateAppointmentRequest = (req, res, next) => {
  const { sessionId, appointmentDetails } = req.body;

  if (!sessionId || typeof sessionId !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Session ID is required',
    });
  }

  if (!appointmentDetails || typeof appointmentDetails !== 'object') {
    return res.status(400).json({
      success: false,
      error: 'Appointment details are required',
    });
  }

  const { ownerName, petName, phoneNumber, preferredDate, preferredTime } = appointmentDetails;

  const errors = [];

  if (!ownerName || ownerName.trim().length < 2) {
    errors.push('Owner name is required (min 2 characters)');
  }

  if (!petName || petName.trim().length < 2) {
    errors.push('Pet name is required (min 2 characters)');
  }

  if (!phoneNumber || phoneNumber.trim().length < 10) {
    errors.push('Valid phone number is required');
  }

  if (!preferredDate || !/^\d{4}-\d{2}-\d{2}$/.test(preferredDate)) {
    errors.push('Preferred date is required (format: YYYY-MM-DD)');
  }

  if (!preferredTime || preferredTime.trim().length === 0) {
    errors.push('Preferred time is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: errors.join(', '),
    });
  }

  next();
};

/**
 * Validate session ID parameter
 */
export const validateSessionId = (req, res, next) => {
  const { sessionId } = req.params;

  if (!sessionId || typeof sessionId !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Valid session ID is required',
    });
  }

  next();
};

export default {
  validateChatRequest,
  validateAppointmentRequest,
  validateSessionId,
};
