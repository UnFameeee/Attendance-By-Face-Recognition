import { NextFunction, Request, Response } from "express";
import { AttendanceExceptionService } from "../services/attendance-exception.service";
import { GetAttendanceExceptionDataDTO, SubmitAttendanceExceptionDTO } from "../model/dtos/attendance-exception.dto";
import { MulterRequest, RequestWithProfile } from "../interfaces/request.interface";
import { HttpException } from "../config/httpException";
import { Page } from "../config/paginate.config";

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
      if (req.error) {
        throw new HttpException(400, req.error);
      }
      const files: { [fieldname: string]: Express.Multer.File[] } = (req.files as { [fieldname: string]: Express.Multer.File[] });
      const email = (req.query.email).toString();
      const response = await this.attendanceExceptionService.saveImage(email, files);
      res.status(201).json(response);
    } catch (err) {
      next(err);
    }
  }

  public saveAnonymousImage = async (req: MulterRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const files: { [fieldname: string]: Express.Multer.File[] } = (req.files as { [fieldname: string]: Express.Multer.File[] });
      const response = await this.attendanceExceptionService.saveAnonymousImage(files);
      res.status(201).json(response);
    } catch (err) {
      next(err);
    }
  }

  public getListAttendanceException = async (req: RequestWithProfile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page: Page = req.body;
      const response = await this.attendanceExceptionService.getListAttendanceException(page);
      res.status(201).json(response);
    } catch (err) {
      next(err);
    }
  }

  public getAttendanceExceptionData = async (req: RequestWithProfile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const attendanceExceptionId: string = req.params.attendanceExceptionId;
      const response = await this.attendanceExceptionService.getAttendanceExceptionData(attendanceExceptionId);
      res.status(201).json(response);
    } catch (err) {
      next(err);
    }
  }

  public verifyAttendanceException = async (req: RequestWithProfile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const attendanceExceptionId: string = req.params.attendanceExceptionId;
      const status: string = req.body.status;
      const employeeId: string = req.profile.id;
      const response = await this.attendanceExceptionService.verifyAttendanceException(employeeId, attendanceExceptionId, status);
      res.status(201).json(response);
    } catch (err) {
      next(err);
    }
  }
}