export declare const attendanceService: {
    punchIn: (employeeId: string, workFromHome?: boolean) => Promise<import("mongoose").Document<unknown, {}, import("../models").IAttendance, {}, import("mongoose").DefaultSchemaOptions> & import("../models").IAttendance & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    punchOut: (employeeId: string) => Promise<import("mongoose").Document<unknown, {}, import("../models").IAttendance, {}, import("mongoose").DefaultSchemaOptions> & import("../models").IAttendance & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getAttendance: (employeeId: string, startDate: Date, endDate: Date) => Promise<(import("../models").IAttendance & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getMonthlyReport: (employeeId: string, month: number, year: number) => Promise<{
        totalDays: number;
        presentDays: number;
        absentDays: number;
        lateDays: number;
        wfhDays: number;
        attendances: (import("../models").IAttendance & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
    }>;
};
//# sourceMappingURL=attendance.service.d.ts.map