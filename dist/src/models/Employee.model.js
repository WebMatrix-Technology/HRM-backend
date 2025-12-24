"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmploymentType = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var EmploymentType;
(function (EmploymentType) {
    EmploymentType["FULL_TIME"] = "FULL_TIME";
    EmploymentType["PART_TIME"] = "PART_TIME";
    EmploymentType["CONTRACT"] = "CONTRACT";
    EmploymentType["INTERN"] = "INTERN";
})(EmploymentType || (exports.EmploymentType = EmploymentType = {}));
const EmployeeSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    employeeId: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: String,
    dateOfBirth: Date,
    address: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    department: String,
    position: String,
    joiningDate: { type: Date, default: Date.now },
    employmentType: { type: String, enum: Object.values(EmploymentType), default: EmploymentType.FULL_TIME },
    salary: Number,
    isActive: { type: Boolean, default: true },
    avatar: String,
}, {
    timestamps: true,
    collection: 'employees',
});
exports.default = mongoose_1.default.model('Employee', EmployeeSchema);
//# sourceMappingURL=Employee.model.js.map