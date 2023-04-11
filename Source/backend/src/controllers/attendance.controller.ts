import { NextFunction, Response } from "express";
import { RequestWithProfile } from "../interfaces/request.interface";
import { AttendanceService } from "../services/attendance.service";
import { TakeAttendanceDTO } from "../model/dtos/attendance.dto";

export class AttendanceController {
  public attendanceService = new AttendanceService();

  public takeAttendance = async (req: RequestWithProfile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: TakeAttendanceDTO = req.body;
      const response = await this.attendanceService.takeAttendance(data.employeeId, data.attendanceType);
      res.status(201).json(response);
    } catch (err) {
      next(err);
    }
  }
}