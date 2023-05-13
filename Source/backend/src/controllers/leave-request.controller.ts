import { NextFunction, Request, Response } from "express";
import { RequestWithProfile } from "../interfaces/request.interface";
import { LeaveRequestService } from "../services/leave-request.service";
import { CreateLeaveRequestDTO } from "../model/dtos/leave-request.dto";
import { Page } from "../config/paginate.config";
import { Employee } from "@prisma/client";

export class LeaveRequestController {
  public leaveRequestService = new LeaveRequestService();

  public getLeaveRequestOfDepartment = async (req: RequestWithProfile, res: Response, next: NextFunction) => {
    try {
      const departmentId: string = req.params.departmentId;
      const page: Page = req.body;
      const employee: Employee = req.profile;
      const response = await this.leaveRequestService.getLeaveRequestOfDepartment(employee, departmentId, page);
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  public getLeaveRequestOfEmployee = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const employeeId: string = req.params.employeeId;
      const page: Page = req.body;
      const response = await this.leaveRequestService.getLeaveRequestOfEmployee(employeeId, page);
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

  public verifyLeaveRequest = async (req: RequestWithProfile, res: Response, next: NextFunction) => {
    try {
      const status: string = req.body.status;
      const approverId: string = req.profile.id;
      const leaveRequestId: string = req.params.leaveRequestId;
      const response = await this.leaveRequestService.verifyLeaveRequest(leaveRequestId, approverId, status);
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  public deleteLeaveRequest = async (req: RequestWithProfile, res: Response, next: NextFunction) => {
    try {
      const leaveRequestId: string = req.params.leaveRequestId;
      const response = await this.leaveRequestService.deleteLeaveRequest(leaveRequestId);
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }
}