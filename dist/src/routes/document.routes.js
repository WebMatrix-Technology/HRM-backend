"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const document_controller_1 = require("../controllers/document.controller");
const router = express_1.default.Router();
// Multer Storage Configuration
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        const uploadDir = process.env.NODE_ENV === 'production' ? '/tmp/uploads' : 'uploads/';
        // Ensure directory exists
        if (!fs_1.default.existsSync(uploadDir)) {
            fs_1.default.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
        // Unique filename: timestamp-originalName
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path_1.default.extname(file.originalname));
    },
});
const upload = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});
// Routes
router.use(auth_middleware_1.authenticate); // ALl routes require login
router.post('/upload', upload.single('file'), document_controller_1.uploadDocument);
router.get('/employee/:employeeId', document_controller_1.getDocuments); // List docs for an employee
router.get('/download/:id', document_controller_1.downloadDocument);
router.delete('/:id', document_controller_1.deleteDocument);
exports.default = router;
//# sourceMappingURL=document.routes.js.map