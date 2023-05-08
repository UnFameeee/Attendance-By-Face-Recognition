import { NextFunction, Response } from "express";
import { RequestWithProfile } from "../interfaces/request.interface";
import { LeavetypeService } from "../services/leavetype.service";
import { Page } from "../config/paginate.config";
import { ModifyLeavetypeDTO } from "../model/dtos/leavetype.dto";

export class LeavetypeController {
  public leavetypeService = new LeavetypeService();

  public getAllLeaveType = async (req: RequestWithProfile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page: Page = req.body;
      const response = await this.leavetypeService.getAllLeaveType(page);
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  public getListLeaveType = async (req: RequestWithProfile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await this.leavetypeService.getListLeaveType();
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  public modifyLeaveType = async (req: RequestWithProfile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: ModifyLeavetypeDTO = req.body;
      const response = await this.leavetypeService.modifyLeaveType(data);
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  public deleteLeaveType = async (req: RequestWithProfile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const leaveTypeId: string = req.params.leaveTypeId;
      const response = await this.leavetypeService.deleteLeaveType(leaveTypeId);
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }
}