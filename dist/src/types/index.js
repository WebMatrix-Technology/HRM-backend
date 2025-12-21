"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HolidayType = exports.GroupRole = exports.GroupType = exports.MessageType = exports.ApplicationStatus = exports.JobStatus = exports.PayrollStatus = exports.LeaveStatus = exports.LeaveType = exports.AttendanceStatus = exports.EmploymentType = exports.Role = void 0;
var Role;
(function (Role) {
    Role["ADMIN"] = "ADMIN";
    Role["HR"] = "HR";
    Role["MANAGER"] = "MANAGER";
    Role["EMPLOYEE"] = "EMPLOYEE";
})(Role || (exports.Role = Role = {}));
var EmploymentType;
(function (EmploymentType) {
    EmploymentType["FULL_TIME"] = "FULL_TIME";
    EmploymentType["PART_TIME"] = "PART_TIME";
    EmploymentType["CONTRACT"] = "CONTRACT";
    EmploymentType["INTERN"] = "INTERN";
})(EmploymentType || (exports.EmploymentType = EmploymentType = {}));
var AttendanceStatus;
(function (AttendanceStatus) {
    AttendanceStatus["PRESENT"] = "PRESENT";
    AttendanceStatus["ABSENT"] = "ABSENT";
    AttendanceStatus["LATE"] = "LATE";
    AttendanceStatus["HALF_DAY"] = "HALF_DAY";
})(AttendanceStatus || (exports.AttendanceStatus = AttendanceStatus = {}));
var LeaveType;
(function (LeaveType) {
    LeaveType["SICK"] = "SICK";
    LeaveType["CASUAL"] = "CASUAL";
    LeaveType["EARNED"] = "EARNED";
    LeaveType["UNPAID"] = "UNPAID";
    LeaveType["MATERNITY"] = "MATERNITY";
    LeaveType["PATERNITY"] = "PATERNITY";
})(LeaveType || (exports.LeaveType = LeaveType = {}));
var LeaveStatus;
(function (LeaveStatus) {
    LeaveStatus["PENDING"] = "PENDING";
    LeaveStatus["APPROVED"] = "APPROVED";
    LeaveStatus["REJECTED"] = "REJECTED";
    LeaveStatus["CANCELLED"] = "CANCELLED";
})(LeaveStatus || (exports.LeaveStatus = LeaveStatus = {}));
var PayrollStatus;
(function (PayrollStatus) {
    PayrollStatus["PENDING"] = "PENDING";
    PayrollStatus["PROCESSED"] = "PROCESSED";
    PayrollStatus["PAID"] = "PAID";
})(PayrollStatus || (exports.PayrollStatus = PayrollStatus = {}));
var JobStatus;
(function (JobStatus) {
    JobStatus["OPEN"] = "OPEN";
    JobStatus["CLOSED"] = "CLOSED";
    JobStatus["DRAFT"] = "DRAFT";
})(JobStatus || (exports.JobStatus = JobStatus = {}));
var ApplicationStatus;
(function (ApplicationStatus) {
    ApplicationStatus["PENDING"] = "PENDING";
    ApplicationStatus["SHORTLISTED"] = "SHORTLISTED";
    ApplicationStatus["INTERVIEWED"] = "INTERVIEWED";
    ApplicationStatus["ACCEPTED"] = "ACCEPTED";
    ApplicationStatus["REJECTED"] = "REJECTED";
})(ApplicationStatus || (exports.ApplicationStatus = ApplicationStatus = {}));
var MessageType;
(function (MessageType) {
    MessageType["TEXT"] = "TEXT";
    MessageType["IMAGE"] = "IMAGE";
    MessageType["FILE"] = "FILE";
})(MessageType || (exports.MessageType = MessageType = {}));
var GroupType;
(function (GroupType) {
    GroupType["DEPARTMENT"] = "DEPARTMENT";
    GroupType["PROJECT"] = "PROJECT";
    GroupType["GENERAL"] = "GENERAL";
})(GroupType || (exports.GroupType = GroupType = {}));
var GroupRole;
(function (GroupRole) {
    GroupRole["ADMIN"] = "ADMIN";
    GroupRole["MODERATOR"] = "MODERATOR";
    GroupRole["MEMBER"] = "MEMBER";
})(GroupRole || (exports.GroupRole = GroupRole = {}));
var HolidayType;
(function (HolidayType) {
    HolidayType["PUBLIC"] = "PUBLIC";
    HolidayType["OPTIONAL"] = "OPTIONAL";
    HolidayType["COMPANY"] = "COMPANY";
})(HolidayType || (exports.HolidayType = HolidayType = {}));
//# sourceMappingURL=index.js.map