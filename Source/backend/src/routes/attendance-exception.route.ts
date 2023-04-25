import { Router } from "express";
import { Routes } from "../interfaces/routes.interface";
import { zodValidate } from "../middlewares/zod.validation.middleware";
import { submitAttendanceExceptionSchema } from "../model/dtos/attendance-exception.dto";
import { AttendanceExceptionController } from "../controllers/attendance-exception.controller";

export class AttendanceRoute implements Routes {
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
  }
}