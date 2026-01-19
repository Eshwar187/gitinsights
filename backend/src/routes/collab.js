import express from 'express';
import * as collabController from '../controllers/collabController.js';
import { authenticate } from '../middleware/auth.js';
import { checkQuota } from '../middleware/quota.js';

const router = express.Router();

router.use(authenticate);

router.post('/room/create', checkQuota('collaboration_room'), collabController.createRoom);
router.post('/room/join', collabController.joinRoom);

export default router;
