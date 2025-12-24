"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const app_1 = __importDefault(require("../src/app"));
const database_1 = __importDefault(require("../src/config/database"));
// Connect to database (cached connection for serverless)
let isConnected = false;
const connectDatabase = async () => {
    if (isConnected) {
        return;
    }
    try {
        await (0, database_1.default)();
        isConnected = true;
        console.log('✅ Database connection established');
    }
    catch (error) {
        console.error('❌ Database connection error:', error);
        // Don't set isConnected to true on error
        // This allows retry on next request
        isConnected = false;
    }
};
// Vercel serverless function handler
async function handler(req, res) {
    // Connect to database if not already connected
    await connectDatabase();
    // Handle the request with Express app
    return (0, app_1.default)(req, res);
}
//# sourceMappingURL=index.js.map