import { NextFunction, Request, Response } from "express";
import { MulterRequest, RequestWithProfile } from "../interfaces/request.interface";
import { AttendanceService } from "../services/attendance.service";
import { TakeAttendanceDTO } from "../model/dtos/attendance.dto";
import { EmployeeService } from "../services/employee.service";
import { HttpException } from "../config/httpException";

export class AttendanceController {
  public attendanceService = new AttendanceService();
  public employeeService = new EmployeeService();

  public takeAttendance = async (req: RequestWithProfile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: TakeAttendanceDTO = req.body;
      const response = await this.attendanceService.takeAttendance(data);
      res.status(201).json(response);
    } catch (err) {
      next(err);
    }
  }

  public getEmployeeDetailById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const employeeId: string = req.params.employeeId;
      const response = await this.employeeService.getEmployeeById(employeeId);
      res.status(200).json(response);
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
      const response = await this.attendanceService.saveImage(files);
      res.status(201).json(response);
    } catch (err) {
      next(err);
    }
  }
}