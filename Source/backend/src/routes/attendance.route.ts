import { Router } from "express";
import { Routes } from "../interfaces/routes.interface";
import { AttendanceController } from "../controllers/attendance.controller";
import { zodValidate } from "../middlewares/zod.validation.middleware";
import { takeAttendanceSchema } from "../model/dtos/attendance.dto";
import { authMiddleware } from "../middlewares/authentication.middleware";
import { authorizeRoute } from "../middlewares/authorization.middleware";
import { PERMISSION, RESOURCE } from "../constant/database.constant";
import { attendanceImageUpload } from "../multer/attendance.storage";

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
      // authMiddleware,
      zodValidate(takeAttendanceSchema),
      // await authorizeRoute(PERMISSION.CREATE, RESOURCE.ATTENDANCE_MANAGEMENT),
      this.attendanceController.takeAttendance
    )

    // api/attendance/takeAttendance
    this.router.get(`${this.path}/getEmployeeDetailById/:employeeId`,
      // authMiddleware,
      // zodValidate(takeAttendanceSchema),
      // await authorizeRoute(PERMISSION.CREATE, RESOURCE.ATTENDANCE_MANAGEMENT),
      this.attendanceController.getEmployeeDetailById
    )

    // api/attendance-exception/saveImage
    this.router.post(`${this.path}/saveImage`,
      // authMiddleware,
      // zodValidate(submitAttendanceExceptionSchema),
      // await authorizeRoute(PERMISSION.CREATE, RESOURCE.ATTENDANCE_MANAGEMENT),
      attendanceImageUpload,
      this.attendanceController.saveImage
    )
  }
}