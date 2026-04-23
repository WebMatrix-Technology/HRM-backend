"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const app_1 = __importDefault(require("../src/app"));
const database_1 = __importDefault(require("../src/config/database"));
// Export an async handler for Vercel Serverless Functions
async function handler(req, res) {
    // Ensure database is connected before handling the request
    await (0, database_1.default)();
    // Pass the request to the Express app
    return (0, app_1.default)(req, res);
}
//# sourceMappingURL=index.js.map