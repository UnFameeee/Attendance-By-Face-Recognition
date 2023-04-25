import { AttendanceExceptionStatusType, AttendanceType } from '../interfaces/attendance-exception.interface';
export const attendance: AttendanceType = {
  checkin: "CHECKIN",
  checkout: "CHECKOUT",
}

export const attendanceExceptionStatus: AttendanceExceptionStatusType = {
  waiting: "WAITING",
  approve: "APPROVE",
  reject: "REJECT",
}