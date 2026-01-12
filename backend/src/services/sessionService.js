import { v4 as uuidv4 } from 'uuid';
import { Session, Context, Message } from '../models/index.js';

export const getOrCreateSession = async (sessionId = null, contextData = null) => {
  try {
    const sid = sessionId || uuidv4();

    let session = await Session.findOne({ sessionId: sid });

    if (!session) {
      session = new Session({
        sessionId: sid,
        status: 'active',
        currentIntent: 'general_qa',
        lastActivityAt: new Date(),
        messageCount: 0,
      });
      await session.save();
    } else {
      session.lastActivityAt = new Date();
      await session.save();
    }

    let context = null;
    if (contextData && (contextData.userId || contextData.userName || contextData.petName || contextData.source)) {
      context = await Context.findOne({ sessionId: sid });

      if (!context) {
        context = new Context({
          sessionId: sid,
          userId: contextData.userId || null,
          userName: contextData.userName || null,
          petName: contextData.petName || null,
          source: contextData.source || null,
        });
        await context.save();
      }
    }

    return { session, context };
  } catch (error) {
    console.error('Error in getOrCreateSession:', error);
    throw error;
  }
};

export const updateSession = async (sessionId, updates) => {
  try {
    const session = await Session.findOne({ sessionId });
    if (!session) {
      throw new Error('Session not found');
    }

    if (updates.status) session.status = updates.status;
    if (updates.currentIntent) session.currentIntent = updates.currentIntent;
    if (updates.messageCount !== undefined) session.messageCount = updates.messageCount;

    session.lastActivityAt = new Date();
    await session.save();

    return session;
  } catch (error) {
    console.error('Error updating session:', error);
    throw error;
  }
};

export const getConversationHistory = async (sessionId, limit = 50) => {
  try {
    const result = await Session.aggregate([
      { $match: { sessionId } },
      {
        $lookup: {
          from: 'contexts',
          localField: 'sessionId',
          foreignField: 'sessionId',
          as: 'context',
        },
      },
      { $unwind: { path: '$context', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'messages',
          let: { sid: '$sessionId' },
          pipeline: [
            { $match: { $expr: { $eq: ['$sessionId', '$$sid'] } } },
            { $sort: { createdAt: 1 } },
            { $limit: limit },
          ],
          as: 'messages',
        },
      },
      {
        $project: {
          sessionId: 1,
          status: 1,
          currentIntent: 1,
          messageCount: 1,
          lastActivityAt: 1,
          createdAt: 1,
          context: 1,
          messages: 1,
          bookingData: 1,
        },
      },
    ]);

    return result[0] || null;
  } catch (error) {
    console.error('Error getting conversation history:', error);
    throw error;
  }
};

export const saveMessage = async (sessionId, role, content) => {
  try {
    const message = new Message({
      sessionId,
      role,
      content,
    });
    await message.save();

    await Session.findOneAndUpdate(
      { sessionId },
      {
        $inc: { messageCount: 1 },
        lastActivityAt: new Date(),
      }
    );

    return message;
  } catch (error) {
    console.error('Error saving message:', error);
    throw error;
  }
};

export const cleanupOldSessions = async (daysOld = 30) => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await Session.updateMany(
      {
        lastActivityAt: { $lt: cutoffDate },
        status: 'active',
      },
      {
        status: 'closed',
      }
    );

    return result.modifiedCount;
  } catch (error) {
    console.error('Error cleaning up old sessions:', error);
    throw error;
  }
};

export default {
  getOrCreateSession,
  updateSession,
  getConversationHistory,
  saveMessage,
  cleanupOldSessions,
};
