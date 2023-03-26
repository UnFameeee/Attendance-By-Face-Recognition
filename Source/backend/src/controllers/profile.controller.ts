import { NextFunction, Response } from "express";
import { RequestWithProfile, MulterRequest } from '../interfaces/request.interface';
import { ProfileService } from "../services/profile.service";
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

  public uploadImages = async (req: MulterRequest, res: Response, next: NextFunction): Promise<void> => {
    try {

      const data: UpdateProfilePasswordDTO = req.body;
      const employeeId: string = req.params.employeeId;
      const response = await this.profileService.updateProfilePassword(employeeId, data);
      
      // console.log(req.files);
      const file = req.files;
      if (!file) {
        res.status(400).send({ message: "No file uploaded" });
      }
      res.status(200).json(file);
    } catch (err) {
      next(err);
    }
  }
}