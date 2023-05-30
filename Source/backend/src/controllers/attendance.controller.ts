import { NextFunction, Request, Response } from "express";
import { MulterRequest, RequestWithProfile } from "../interfaces/request.interface";
import { AttendanceService } from "../services/attendance.service";
import { TakeAttendanceDTO } from "../model/dtos/attendance.dto";
import { EmployeeService } from "../services/employee.service";
import { HttpException } from "../config/httpException";
import moment from "moment";
import { DateTimeV2DTO } from "../model/dtos/workshift.dto";
import { ResponseData } from "../config/responseData.config";

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
      const date: string = req.body.date;
      const response = await this.attendanceService.getEmployeeById(employeeId, date);
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  public saveImage = async (req: MulterRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (req.error) {
        console.log(req.error)
        const response = new ResponseData<string>;
        response.message = req.error;
        res.status(201).json(response);
      }
      const files: { [fieldname: string]: Express.Multer.File[] } = (req.files as { [fieldname: string]: Express.Multer.File[] });
      const response = await this.attendanceService.saveImage(files);
      res.status(201).json(response);
    } catch (err) {
      next(err);
    }
  }

  public getThisMonthAttendance = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: DateTimeV2DTO = req.body;
      const employeeId: string = req.params.employeeId;
      const response = await this.attendanceService.getThisMonthAttendance(employeeId, data);
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  public getTodayAttendance = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: DateTimeV2DTO = req.body;
      const employeeId: string = req.params.employeeId;
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

  public getYearlyAttendanceStatistic = async (req: RequestWithProfile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: DateTimeV2DTO = req.body;
      const employeeId: string = req.params.employeeId;
      const response = await this.attendanceService.getYearlyAttendanceStatistic(employeeId, data);
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  public validateAttendance = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: {
        isValid: boolean,
        note: string,
      } = req.body;
      const attendanceId: string = req.params.attendanceId;
      const response = await this.attendanceService.validateAttendance(attendanceId, data);
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }
}