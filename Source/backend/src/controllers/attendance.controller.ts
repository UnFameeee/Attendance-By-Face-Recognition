import { NextFunction, Request, Response } from "express";
import { RequestWithProfile } from "../interfaces/request.interface";
import { AttendanceService } from "../services/attendance.service";
import { TakeAttendanceDTO } from "../model/dtos/attendance.dto";
import { EmployeeService } from "../services/employee.service";

export class AttendanceController {
  public attendanceService = new AttendanceService();
  public employeeService = new EmployeeService();

  public takeAttendance = async (req: RequestWithProfile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: TakeAttendanceDTO = req.body;
      const response = await this.attendanceService.takeAttendance(data.employeeId, data.attendanceType);
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
}