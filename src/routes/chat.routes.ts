import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
  getConversations,
  getMessages,
  getGroups,
  getGroupMessages,
  createGroup,
  addGroupMembers,
  removeGroupMember,
  leaveGroup,
  updateGroupSettings,
  uploadChatAttachment,
} from '../controllers/chat.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const uploadDir = process.env.NODE_ENV === 'production' ? '/tmp/uploads/chat' : 'uploads/chat';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});


// All routes require authentication
router.use(authenticate);

// One-to-one chat routes
router.get('/conversations', getConversations);
router.get('/messages/:otherEmployeeId', getMessages);

// Group chat routes
router.get('/groups', getGroups);
router.get('/groups/:groupId/messages', getGroupMessages);
router.post('/groups', createGroup);
router.put('/groups/:groupId', updateGroupSettings);
router.post('/groups/:groupId/members', addGroupMembers);
router.delete('/groups/:groupId/members/:memberId', removeGroupMember);
router.post('/groups/:groupId/leave', leaveGroup);

// Upload route
router.post('/upload', upload.single('file'), uploadChatAttachment);

export default router;

