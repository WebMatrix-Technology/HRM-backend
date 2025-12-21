"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
let cached = global.mongoose || { conn: null, promise: null };
if (!global.mongoose) {
    global.mongoose = cached;
}
async function connectDB() {
    const MONGODB_URI = process.env.DATABASE_URL || '';
    if (!MONGODB_URI) {
        throw new Error('Please define the DATABASE_URL environment variable');
    }
    if (cached.conn) {
        return cached.conn;
    }
    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };
        cached.promise = mongoose_1.default.connect(MONGODB_URI, opts).then((mongoose) => {
            return mongoose;
        });
    }
    try {
        cached.conn = await cached.promise;
        console.log('✅ MongoDB connected successfully');
    }
    catch (e) {
        cached.promise = null;
        throw e;
    }
    return cached.conn;
}
exports.default = connectDB;
//# sourceMappingURL=database.js.map