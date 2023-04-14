import { NextFunction, Response } from 'express';
import { RequestWithProfile } from '../interfaces/request.interface';
import { Page } from '../config/paginate.config';
import { ShifttypeService } from '../services/shifttype.service';
import { ModifyWorkshiftDTO } from '../model/dtos/workshift.dto';

export class ShifttypeController {
  public shifttypeService = new ShifttypeService();

  public getAllShiftType = async (req: RequestWithProfile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page: Page = req.body;
      const response = await this.shifttypeService.getAllShiftType(page);
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  public getListShiftType = async (req: RequestWithProfile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await this.shifttypeService.getListShiftType();
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  public modifyShiftType = async (req: RequestWithProfile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: ModifyWorkshiftDTO = req.body;
      const response = await this.shifttypeService.modifyShiftType(data);
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  public deleteShiftType = async (req: RequestWithProfile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const shiftTypeId: string = req.params.shiftTypeId;
      const response = await this.shifttypeService.deleteShiftType(shiftTypeId);
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }
}