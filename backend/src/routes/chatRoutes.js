import express from 'express';
import { validateChatRequest } from '../middleware/validateRequest.js';
import { generateAIResponse, detectIntent, extractAppointmentInfo, generateBookingPrompt } from '../services/aiService.js';
import { getOrCreateSession, saveMessage, updateSession } from '../services/sessionService.js';
import { Message } from '../models/index.js';

const router = express.Router();

router.post('/', validateChatRequest, async (req, res) => {
  try {
    const { message, sessionId, context } = req.body;

    const { session } = await getOrCreateSession(sessionId, context);

    await saveMessage(session.sessionId, 'user', message);

    const history = await Message.find({ sessionId: session.sessionId })
      .sort({ createdAt: 1 })
      .limit(20)
      .lean();

    let aiResponse;
    let intent = session.currentIntent;

    if (session.status === 'booking_in_progress') {
      const currentBookingData = session.bookingData || {};
      const extractedData = await extractAppointmentInfo(message, currentBookingData);

      session.bookingData = extractedData;
      await session.save();

      const missingFields = [];
      if (!extractedData.ownerName) missingFields.push('ownerName');
      if (!extractedData.petName) missingFields.push('petName');
      if (!extractedData.phoneNumber) missingFields.push('phoneNumber');
      if (!extractedData.preferredDate) missingFields.push('preferredDate');
      if (!extractedData.preferredTime) missingFields.push('preferredTime');

      if (missingFields.length === 0) {
        aiResponse = `Perfect! Let me confirm your appointment details:

- Pet Owner: ${extractedData.ownerName}
- Pet Name: ${extractedData.petName}
- Phone: ${extractedData.phoneNumber}
- Date: ${extractedData.preferredDate}
- Time: ${extractedData.preferredTime}
${extractedData.notes ? `- Notes: ${extractedData.notes}` : ''}

Please reply with "confirm" to book this appointment, or "cancel" to start over.`;
      } else {
        aiResponse = generateBookingPrompt(extractedData);
      }

      intent = 'appointment_booking';
    } else {
      const intentResult = await detectIntent(message);
      intent = intentResult.intent;

      if (intent === 'appointment_booking') {
        await updateSession(session.sessionId, {
          status: 'booking_in_progress',
          currentIntent: 'appointment_booking',
        });

        aiResponse = "Great! I'd be happy to help you book an appointment. May I have your name, please?";
      } else {
        aiResponse = await generateAIResponse(message, history);
      }
    }

    await saveMessage(session.sessionId, 'assistant', aiResponse);

    await updateSession(session.sessionId, {
      currentIntent: intent,
      lastActivityAt: new Date(),
    });

    res.json({
      success: true,
      data: {
        message: aiResponse,
        sessionId: session.sessionId,
        intent,
        bookingData: session.bookingData || null,
      },
    });
  } catch (error) {
    console.error('Error in chat route:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process message',
    });
  }
});

export default router;
