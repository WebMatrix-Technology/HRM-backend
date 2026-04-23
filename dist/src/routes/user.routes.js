"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_middleware_1.authenticate);
// Get all users (accessible to all authenticated users)
router.get('/', user_controller_1.getUsers);
// Get user by ID (accessible to all authenticated users)
router.get('/:id', user_controller_1.getUserById);
// Update, delete - only Admin
router.put('/:id', (0, auth_middleware_1.authorize)('ADMIN'), user_controller_1.updateUser);
router.delete('/:id', (0, auth_middleware_1.authorize)('ADMIN'), user_controller_1.deleteUser);
exports.default = router;
//# sourceMappingURL=user.routes.js.map