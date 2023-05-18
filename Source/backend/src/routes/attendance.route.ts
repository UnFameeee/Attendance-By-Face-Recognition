import { Router } from "express";
import { Routes } from "../interfaces/routes.interface";
import { AttendanceController } from "../controllers/attendance.controller";
import { zodValidate } from "../middlewares/zod.validation.middleware";
import { takeAttendanceSchema } from "../model/dtos/attendance.dto";
import { authMiddleware } from "../middlewares/authentication.middleware";
import { authorizeRoute } from "../middlewares/authorization.middleware";
import { PERMISSION, RESOURCE } from "../constant/database.constant";
import { attendanceImageUpload } from "../multer/attendance.storage";
import { dateTimeV2Schema } from "../model/dtos/workshift.dto";

export class AttendanceRoute implements Routes {
  public path = "/attendance";
  public router = Router();
  public attendanceController = new AttendanceController();

  constructor() {
    this.initializeRoutes();
  }

  private async initializeRoutes() {
    // api/attendance/takeAttendance
    this.router.post(`${this.path}/takeAttendance`,
      zodValidate(takeAttendanceSchema),
      this.attendanceController.takeAttendance
    )

    // api/attendance/takeAttendance
    this.router.get(`${this.path}/getEmployeeDetailById/:employeeId`,
      this.attendanceController.getEmployeeDetailById
    )

    // api/attendance/saveImage
    this.router.post(`${this.path}/saveImage`,
      attendanceImageUpload,
      this.attendanceController.saveImage
    )

    // api/attendance/getThisMonthAttendance
    this.router.post(`${this.path}/getThisMonthAttendance`,
      authMiddleware,
      zodValidate(dateTimeV2Schema),
      await authorizeRoute(PERMISSION.READ, RESOURCE.ATTENDANCE_MANAGEMENT),
      this.attendanceController.getThisMonthAttendance
    )

    // api/attendance/getTodayAttendance
    this.router.post(`${this.path}/getTodayAttendance`,
      authMiddleware,
      zodValidate(dateTimeV2Schema),
      await authorizeRoute(PERMISSION.READ, RESOURCE.ATTENDANCE_MANAGEMENT),
      this.attendanceController.getTodayAttendance
    )

    // api/attendance/getAttendanceHistory
    this.router.post(`${this.path}/getAttendanceHistory/:employeeId`,
      authMiddleware,
      zodValidate(dateTimeV2Schema),
      await authorizeRoute(PERMISSION.READ, RESOURCE.ATTENDANCE_MANAGEMENT),
      this.attendanceController.getAttendanceHistory
    )

    // api/attendance/getAttendanceDetail
    this.router.get(`${this.path}/getAttendanceDetail/:attendanceId`,
      authMiddleware,
      await authorizeRoute(PERMISSION.READ, RESOURCE.ATTENDANCE_MANAGEMENT),
      this.attendanceController.getAttendanceDetail
    )

    // api/attendance/getAttendanceStatistic/:employeeId
    this.router.post(`${this.path}/getAttendanceStatistic/:employeeId`,
      authMiddleware,
      zodValidate(dateTimeV2Schema),
      await authorizeRoute(PERMISSION.READ, RESOURCE.ATTENDANCE_MANAGEMENT),
      this.attendanceController.getAttendanceStatistic
    )

    // api/attendance/getYearlyAttendanceStatistic/:employeeId
    this.router.post(`${this.path}/getYearlyAttendanceStatistic/:employeeId`,
      authMiddleware,
      zodValidate(dateTimeV2Schema),
      await authorizeRoute(PERMISSION.READ, RESOURCE.ATTENDANCE_MANAGEMENT),
      this.attendanceController.getYearlyAttendanceStatistic
    )
  }
}