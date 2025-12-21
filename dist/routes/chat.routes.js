"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chat_controller_1 = require("../controllers/chat.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_middleware_1.authenticate);
// One-to-one chat routes
router.get('/conversations', chat_controller_1.getConversations);
router.get('/messages/:otherEmployeeId', chat_controller_1.getMessages);
// Group chat routes
router.get('/groups', chat_controller_1.getGroups);
router.get('/groups/:groupId/messages', chat_controller_1.getGroupMessages);
router.post('/groups', chat_controller_1.createGroup);
router.post('/groups/:groupId/members', chat_controller_1.addGroupMembers);
router.delete('/groups/:groupId/members/:memberId', chat_controller_1.removeGroupMember);
router.post('/groups/:groupId/leave', chat_controller_1.leaveGroup);
exports.default = router;
//# sourceMappingURL=chat.routes.js.map