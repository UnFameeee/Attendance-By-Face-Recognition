import { NextFunction, Response } from 'express';
import { RequestWithProfile } from '../interfaces/request.interface';
import { WorkshiftService } from '../services/workshift.service';
import { AutoCreateWorkshiftDTO, DateTimeDTO, ModifyWorkshiftDTO } from '../model/dtos/workshift.dto';

export class WorkshiftController {
  public workshiftService = new WorkshiftService();

  public getWorkshiftOfDepartment = async (req: RequestWithProfile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const departmentId: string = req.params.departmentId;
      const data: DateTimeDTO = req.body;
      const response = await this.workshiftService.getWorkshiftOfDepartment(departmentId, data);
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  public getWorkshiftOfEmployee = async (req: RequestWithProfile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: DateTimeDTO = req.body;
      const employeeId = req.params.employeeId;
      const response = await this.workshiftService.getWorkshiftOfEmployee(employeeId, data);
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  public autoCreateWorkshift = async (req: RequestWithProfile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: AutoCreateWorkshiftDTO = req.body;
      const response = await this.workshiftService.autoCreateWorkshift(data);
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  public modifyWorkshift = async (req: RequestWithProfile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: ModifyWorkshiftDTO = req.body;
      const response = await this.workshiftService.modifyWorkshift(data);
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  public deleteWorkshift = async (req: RequestWithProfile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const shiftId: string = req.params.shiftId;
      const response = await this.workshiftService.deleteWorkshift(shiftId);
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }
}