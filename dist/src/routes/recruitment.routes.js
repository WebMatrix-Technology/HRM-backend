"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const recruitment_controller_1 = require("../controllers/recruitment.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
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
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path_1.default.extname(file.originalname));
    },
});
const upload = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});
// Public routes (or authenticated for internal employees to view jobs)
router.get('/jobs', recruitment_controller_1.getJobs);
router.get('/jobs/:id', recruitment_controller_1.getJobById);
router.post('/jobs/:id/apply', upload.single('resumeFile'), recruitment_controller_1.applyForJob);
// Protected routes (HR/Admin only)
router.use(auth_middleware_1.authenticate);
router.post('/jobs', recruitment_controller_1.createJob);
router.put('/jobs/:id', recruitment_controller_1.updateJob);
router.get('/candidates', recruitment_controller_1.getCandidates);
router.put('/candidates/:id/status', recruitment_controller_1.updateCandidateStatus);
exports.default = router;
//# sourceMappingURL=recruitment.routes.js.map