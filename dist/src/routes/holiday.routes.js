"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const holiday_controller_1 = require("../controllers/holiday.controller");
const router = express_1.default.Router();
router.use(auth_middleware_1.authenticate);
router.post('/', holiday_controller_1.createHoliday);
router.get('/', holiday_controller_1.getHolidays);
router.delete('/:id', holiday_controller_1.deleteHoliday);
exports.default = router;
//# sourceMappingURL=holiday.routes.js.map