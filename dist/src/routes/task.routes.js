"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const task_controller_1 = require("../controllers/task.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
// Apply auth middleware to all routes
router.use(auth_middleware_1.authenticate);
router.get('/', task_controller_1.taskController.getTasks);
router.get('/:id', task_controller_1.taskController.getTask);
router.post('/', (0, auth_middleware_1.authorize)('ADMIN', 'MANAGER', 'HR'), task_controller_1.taskController.createTask);
router.put('/:id', (0, auth_middleware_1.authorize)('ADMIN', 'MANAGER', 'HR', 'EMPLOYEE'), task_controller_1.taskController.updateTask);
router.delete('/:id', (0, auth_middleware_1.authorize)('ADMIN', 'MANAGER'), task_controller_1.taskController.deleteTask);
exports.default = router;
//# sourceMappingURL=task.routes.js.map