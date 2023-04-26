import { NextFunction, Request, Response } from "express";
import { AttendanceExceptionService } from "../services/attendance-exception.service";
import { SubmitAttendanceExceptionDTO } from "../model/dtos/attendance-exception.dto";
import { MulterRequest } from "../interfaces/request.interface";

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

  public saveImage = async (req: MulterRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const files: { [fieldname: string]: Express.Multer.File[] } = (req.files as { [fieldname: string]: Express.Multer.File[] });
      const email = (req.query.email).toString();
      const response = await this.attendanceExceptionService.saveImage(email, files);
      res.status(201).json(response);
    } catch (err) {
      next(err);
    }
  }
}