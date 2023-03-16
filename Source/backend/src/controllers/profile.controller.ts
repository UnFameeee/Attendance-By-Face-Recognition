import { NextFunction, Response } from "express";
import { RequestWithProfile } from "../interfaces/auth.interface";
import { ProfileService } from "../services/profile.service";
import { HttpException } from "../config/httpException";
import { UpdateProfileDTO, UpdateProfilePasswordDTO } from '../model/dtos/profile.dto';

export class ProfileController {
  public profileService = new ProfileService();

  public getProfileDetail = async (req: RequestWithProfile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const employeeId: string = req.params.employeeId;
      const response = await this.profileService.getProfileDetail(employeeId);
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  public updateProfileDetail = async (req: RequestWithProfile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: UpdateProfileDTO = req.body;
      const employeeId: string = req.params.employeeId;
      const response = await this.profileService.updateProfileDetail(employeeId, data);
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  public updateProfilePassword = async (req: RequestWithProfile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: UpdateProfilePasswordDTO = req.body;
      const employeeId: string = req.params.employeeId;
      const response = await this.profileService.updateProfilePassword(employeeId, data);
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }
}