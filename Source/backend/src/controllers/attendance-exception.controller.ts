import { NextFunction, Request, Response } from "express";
import { AttendanceExceptionService } from "../services/attendance-exception.service";
import { SubmitAttendanceExceptionDTO } from "../model/dtos/attendance-exception.dto";

export class AttendanceExceptionController {
  public attendanceExceptionService = new AttendanceExceptionService();

  public submitAttendanceException = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: SubmitAttendanceExceptionDTO = req.body;
      const response = await this.attendanceExceptionService.submitAttendanceException(data);
      res.status(201).json(response);
    } catch (err) {
      next(err);
    }
  }
}