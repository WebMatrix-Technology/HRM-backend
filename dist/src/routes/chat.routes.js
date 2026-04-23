"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const chat_controller_1 = require("../controllers/chat.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Multer Storage Configuration
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        const uploadDir = process.env.NODE_ENV === 'production' ? '/tmp/uploads/chat' : 'uploads/chat';
        if (!fs_1.default.existsSync(uploadDir)) {
            fs_1.default.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path_1.default.extname(file.originalname));
    },
});
const upload = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});
// All routes require authentication
router.use(auth_middleware_1.authenticate);
// One-to-one chat routes
router.get('/conversations', chat_controller_1.getConversations);
router.get('/messages/:otherEmployeeId', chat_controller_1.getMessages);
// Group chat routes
router.get('/groups', chat_controller_1.getGroups);
router.get('/groups/:groupId/messages', chat_controller_1.getGroupMessages);
router.post('/groups', chat_controller_1.createGroup);
router.put('/groups/:groupId', chat_controller_1.updateGroupSettings);
router.post('/groups/:groupId/members', chat_controller_1.addGroupMembers);
router.delete('/groups/:groupId/members/:memberId', chat_controller_1.removeGroupMember);
router.post('/groups/:groupId/leave', chat_controller_1.leaveGroup);
// Upload route
router.post('/upload', upload.single('file'), chat_controller_1.uploadChatAttachment);
exports.default = router;
//# sourceMappingURL=chat.routes.js.map