import connectDB from '../config/database';
import { AppError } from '../middlewares/error.middleware';
import { AttendanceStatus } from '../models';
import Attendance from '../models/Attendance.model';

export const attendanceService = {
  punchIn: async (employeeId: string, workFromHome = false) => {
    await connectDB();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already punched in today
    const existing = await Attendance.findOne({
      employeeId,
      date: today,
    });

    if (existing?.punchIn) {
      throw new AppError('Already punched in today', 400);
    }

    const attendance = await Attendance.findOneAndUpdate(
      {
        employeeId,
        date: today,
      },
      {
        $set: {
          punchIn: new Date(),
          workFromHome,
          status: AttendanceStatus.PRESENT,
        },
      },
      {
        upsert: true,
        new: true,
      }
    );

    return attendance;
  },

  punchOut: async (employeeId: string, idleTime: number = 0) => {
    await connectDB();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      employeeId,
      date: today,
    });

    if (!attendance) {
      throw new AppError('No punch in record found for today', 400);
    }

    if (attendance.punchOut) {
      throw new AppError('Already punched out today', 400);
    }

    attendance.punchOut = new Date();
    attendance.idleTime = idleTime;

    // Calculate productive time (total seconds - idle seconds)
    if (attendance.punchIn) {
      const totalElapsedSeconds = Math.floor((attendance.punchOut.getTime() - attendance.punchIn.getTime()) / 1000);
      attendance.productiveTime = Math.max(0, totalElapsedSeconds - idleTime);
    }

    await attendance.save();

    return attendance;
  },

  getAttendance: async (employeeId: string, startDate: Date, endDate: Date) => {
    await connectDB();

    const attendances = await Attendance.find({
      employeeId,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    })
      .sort({ date: -1 })
      .lean();

    return attendances;
  },

  getMonthlyReport: async (employeeId: string, month: number, year: number) => {
    await connectDB();

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    const totalDays = endDate.getDate();

    const attendances = await Attendance.find({
      employeeId,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    })
      .sort({ date: -1 })
      .lean();

    const presentDays = attendances.filter((a) => a.status === AttendanceStatus.PRESENT).length;
    const absentDays = attendances.filter((a) => a.status === AttendanceStatus.ABSENT).length;
    const lateDays = attendances.filter((a) => a.status === AttendanceStatus.LATE).length;
    const wfhDays = attendances.filter((a) => a.workFromHome).length;

    return {
      totalDays,
      presentDays,
      absentDays,
      lateDays,
      wfhDays,
      attendances,
    };
  },
};
