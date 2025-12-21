"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const performance_controller_1 = require("../controllers/performance.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.get('/', performance_controller_1.getPerformances);
router.get('/:id', performance_controller_1.getPerformanceById);
router.post('/', (0, auth_middleware_1.authorize)('ADMIN', 'HR', 'MANAGER'), performance_controller_1.createPerformance);
router.put('/:id', (0, auth_middleware_1.authorize)('ADMIN', 'HR', 'MANAGER'), performance_controller_1.updatePerformance);
exports.default = router;
//# sourceMappingURL=performance.routes.js.map