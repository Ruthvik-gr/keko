import express from 'express';
import chatRoutes from './chatRoutes.js';
import appointmentRoutes from './appointmentRoutes.js';
import conversationRoutes from './conversationRoutes.js';

const router = express.Router();

router.use('/chat', chatRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/conversations', conversationRoutes);

export default router;
