import { Router } from "express";
import { Routes } from "../interfaces/routes.interface";
import { zodValidate } from "../middlewares/zod.validation.middleware";
import { submitAttendanceExceptionSchema } from "../model/dtos/attendance-exception.dto";
import { AttendanceExceptionController } from "../controllers/attendance-exception.controller";
import { attendanceImageUpload } from "../multer/attendance.storage";
import { attendanceExceptionImageUpload } from "../multer/attendance-exception.storage";
import { authMiddleware } from "../middlewares/authentication.middleware";

export class AttendanceExceptionRoute implements Routes {
  public path = "/attendance-exception";
  public router = Router();
  public attendanceExceptionController = new AttendanceExceptionController();

  constructor() {
    this.initializeRoutes();
  }

  private async initializeRoutes() {
    // api/attendance-exception/submission
    this.router.post(`${this.path}/submission`,
      // authMiddleware,
      zodValidate(submitAttendanceExceptionSchema),
      // await authorizeRoute(PERMISSION.CREATE, RESOURCE.ATTENDANCE_MANAGEMENT),
      this.attendanceExceptionController.submitAttendanceException
    )

    // api/attendance-exception/saveImage
    this.router.post(`${this.path}/saveImage`,
      // authMiddleware,
      // zodValidate(submitAttendanceExceptionSchema),
      // await authorizeRoute(PERMISSION.CREATE, RESOURCE.ATTENDANCE_MANAGEMENT),
      attendanceExceptionImageUpload,
      this.attendanceExceptionController.saveImage
    )

    // api/attendance-exception/saveImage
    this.router.post(`${this.path}/getListAttendanceException`,
      // authMiddleware,
      // zodValidate(submitAttendanceExceptionSchema),
      // await authorizeRoute(PERMISSION.CREATE, RESOURCE.ATTENDANCE_MANAGEMENT),
      this.attendanceExceptionController.getListAttendanceException
    )

    // api/attendance-exception/saveImage
    this.router.get(`${this.path}/getAttendanceExceptionData/:id`,
      // authMiddleware,
      // zodValidate(submitAttendanceExceptionSchema),
      // await authorizeRoute(PERMISSION.CREATE, RESOURCE.ATTENDANCE_MANAGEMENT),
      this.attendanceExceptionController.getAttendanceExceptionData
    )

    // api/attendance-exception/saveImage
    this.router.post(`${this.path}/verifyAttendanceException/:attendanceExceptionId`,
      authMiddleware,
      // zodValidate(submitAttendanceExceptionSchema),
      // await authorizeRoute(PERMISSION.CREATE, RESOURCE.ATTENDANCE_MANAGEMENT),
      this.attendanceExceptionController.verifyAttendanceException
    )
  }
}