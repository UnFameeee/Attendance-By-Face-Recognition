import { NextFunction, Response } from 'express';
import { RequestWithProfile } from '../interfaces/request.interface';
import { WorkshiftService } from '../services/workshift.service';
import { Page } from '../config/paginate.config';
import { AutoCreateWorkshiftDTO } from '../model/dtos/workshift.dto';

export class WorkshiftController {
  public workshiftService = new WorkshiftService();

  public getWorkshiftOfDepartment = async (req: RequestWithProfile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: any = req.body;
      // const response = await this.workshiftService.getWorkshiftOfDepartment(data);
      // res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  public getWorkshiftOfEmployee = async (req: RequestWithProfile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: any = req.body;
      // const response = await this.workshiftService.getWorkshiftOfEmployee(data);
      // res.status(200).json(response);
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
      const data: any = req.body;
      const response = await this.workshiftService.modifyWorkshift(data);
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }
}