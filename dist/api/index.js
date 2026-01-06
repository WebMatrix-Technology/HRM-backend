"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("../src/app"));
const database_1 = __importDefault(require("../src/config/database"));
// Connect to database (cached connection for serverless)
// Initialize connection on module load
(0, database_1.default)().catch((error) => {
    console.error('❌ Initial database connection error:', error);
    // Connection will be retried on first request that needs it
});
// Export the Express app directly for Vercel
// Vercel's @vercel/node runtime will automatically handle Express apps
// The database connection is cached globally, so subsequent requests will use the same connection
exports.default = app_1.default;
//# sourceMappingURL=index.js.map