import { NextFunction, Request, Response } from "express";
import { RequestWithProfile } from "../interfaces/request.interface";
import { LeaveRequestService } from "../services/leave-request.service";
import { DateTimeV2DTO } from "../model/dtos/workshift.dto";
import { CreateLeaveRequestDTO } from "../model/dtos/leave-request.dto";

export class LeaveRequestController {
  public leaveRequestService = new LeaveRequestService();

  public getLeaveRequestOfDepartment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const departmentId: string = req.params.departmentId;
      const data: DateTimeV2DTO = req.body;
      const response = await this.leaveRequestService.getLeaveRequestOfDepartment(departmentId, data);
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  public getLeaveRequestOfEmployee = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const employeeId: string = req.params.employeeId;
      const data: DateTimeV2DTO = req.body;
      const response = await this.leaveRequestService.getLeaveRequestOfEmployee(employeeId, data);
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  public createLeaveRequest = async (req: RequestWithProfile, res: Response, next: NextFunction) => {
    try {
      const employeeId: string = req.profile.id;
      const data: CreateLeaveRequestDTO = req.body;
      const response = await this.leaveRequestService.createLeaveRequest(employeeId, data);
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  public getAnnualDetail = async (req: RequestWithProfile, res: Response, next: NextFunction) => {
    try {
      const employeeId: string = req.profile.id;
      const response = await this.leaveRequestService.getAnnualDetail(employeeId);
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }
}