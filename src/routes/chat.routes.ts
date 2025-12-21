import { Router } from 'express';
import {
  getConversations,
  getMessages,
  getGroups,
  getGroupMessages,
  createGroup,
  addGroupMembers,
  removeGroupMember,
  leaveGroup,
} from '../controllers/chat.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// One-to-one chat routes
router.get('/conversations', getConversations);
router.get('/messages/:otherEmployeeId', getMessages);

// Group chat routes
router.get('/groups', getGroups);
router.get('/groups/:groupId/messages', getGroupMessages);
router.post('/groups', createGroup);
router.post('/groups/:groupId/members', addGroupMembers);
router.delete('/groups/:groupId/members/:memberId', removeGroupMember);
router.post('/groups/:groupId/leave', leaveGroup);

export default router;

