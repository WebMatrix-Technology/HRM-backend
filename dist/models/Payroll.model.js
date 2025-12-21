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
exports.PayrollStatus = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var PayrollStatus;
(function (PayrollStatus) {
    PayrollStatus["PENDING"] = "PENDING";
    PayrollStatus["PROCESSED"] = "PROCESSED";
    PayrollStatus["PAID"] = "PAID";
})(PayrollStatus || (exports.PayrollStatus = PayrollStatus = {}));
const PayrollSchema = new mongoose_1.Schema({
    employeeId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Employee', required: true },
    month: { type: Number, required: true, min: 1, max: 12 },
    year: { type: Number, required: true },
    basicSalary: { type: Number, required: true },
    allowances: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },
    pf: Number,
    esic: Number,
    tds: Number,
    netSalary: { type: Number, required: true },
    payslipUrl: String,
    status: { type: String, enum: Object.values(PayrollStatus), default: PayrollStatus.PENDING },
    paidAt: Date,
}, {
    timestamps: true,
    collection: 'payrolls',
});
PayrollSchema.index({ employeeId: 1, month: 1, year: 1 }, { unique: true });
exports.default = mongoose_1.default.model('Payroll', PayrollSchema);
//# sourceMappingURL=Payroll.model.js.map