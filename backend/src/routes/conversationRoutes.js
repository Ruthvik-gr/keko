import express from 'express';
import { validateSessionId } from '../middleware/validateRequest.js';
import { getConversationHistory } from '../services/sessionService.js';
import { Message, Session } from '../models/index.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const sessions = await Session.find()
      .sort({ lastActivityAt: -1 })
      .select('sessionId status currentIntent messageCount lastActivityAt createdAt bookingData')
      .lean();

    res.json({
      success: true,
      data: sessions,
    });
  } catch (error) {
    console.error('Error getting sessions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve sessions',
    });
  }
});

router.get('/:sessionId', validateSessionId, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const limit = parseInt(req.query.limit) || 50;

    const conversation = await getConversationHistory(sessionId, limit);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found',
      });
    }

    res.json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    console.error('Error getting conversation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve conversation',
    });
  }
});

router.get('/:sessionId/messages', validateSessionId, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const result = await Message.aggregate([
      { $match: { sessionId } },
      { $sort: { createdAt: -1 } },
      {
        $facet: {
          messages: [
            { $skip: skip },
            { $limit: limit },
            {
              $project: {
                role: 1,
                content: 1,
                createdAt: 1,
              },
            },
          ],
          totalCount: [{ $count: 'count' }],
        },
      },
    ]);

    const messages = result[0].messages.reverse();
    const totalCount = result[0].totalCount[0]?.count || 0;

    res.json({
      success: true,
      data: {
        messages,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages: Math.ceil(totalCount / limit),
        },
      },
    });
  } catch (error) {
    console.error('Error getting messages:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve messages',
    });
  }
});

export default router;
