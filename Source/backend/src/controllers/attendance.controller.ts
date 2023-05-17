import { NextFunction, Request, Response } from "express";
import { MulterRequest, RequestWithProfile } from "../interfaces/request.interface";
import { AttendanceService } from "../services/attendance.service";
import { TakeAttendanceDTO } from "../model/dtos/attendance.dto";
import { EmployeeService } from "../services/employee.service";
import { HttpException } from "../config/httpException";
import moment from "moment";
import { DateTimeV2DTO } from "../model/dtos/workshift.dto";

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

  public getThisMonthAttendance = async (req: RequestWithProfile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: DateTimeV2DTO = req.body;
      const employeeId: string = req.profile.id;
      const response = await this.attendanceService.getThisMonthAttendance(employeeId, data);
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  public getTodayAttendance = async (req: RequestWithProfile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: DateTimeV2DTO = req.body;
      const employeeId: string = req.profile.id;
      const response = await this.attendanceService.getTodayAttendance(employeeId, data);
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  public getAttendanceHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: DateTimeV2DTO = req.body
      const employeeId: string = req.params.employeeId;
      const response = await this.attendanceService.getAttendanceHistory(employeeId, data);
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  public getAttendanceDetail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const attendanceId: string = req.params.attendanceId;
      const response = await this.attendanceService.getAttendanceDetail(attendanceId);
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  public getAttendanceStatistic = async (req: RequestWithProfile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: DateTimeV2DTO = req.body;
      const employeeId: string = req.params.employeeId;
      const response = await this.attendanceService.getAttendanceStatistic(employeeId, data);
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }
}