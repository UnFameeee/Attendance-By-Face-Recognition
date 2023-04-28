import { NextFunction, Response } from "express";
import { RequestWithProfile, MulterRequest } from '../interfaces/request.interface';
import { ProfileService } from "../services/profile.service";
import { UpdateProfileDTO, UpdateProfilePasswordDTO } from '../model/dtos/profile.dto';
import { FacialRecognitionService } from "../services/facial-recognition.service";

export class ProfileController {
  public profileService = new ProfileService();
  public facialRecognitionService = new FacialRecognitionService();

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

  // public uploadImages = async (req: MulterRequest, res: Response, next: NextFunction): Promise<void> => {
  //   try {
  //     // const files: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] } = req.files;
  //     const files: { [fieldname: string]: Express.Multer.File[] } = (req.files as { [fieldname: string]: Express.Multer.File[] });
  //     const employeeId: string = req.profile.id;

  //     var index: number;
  //     if (Object.keys(req.query).length !== 0) {
  //       index = parseInt((req.query.index).toString());
  //     } else {
  //       index = null;
  //     }
  //     const response = await this.profileService.uploadImages(employeeId, files, index);

  //     if (response.message == null) {
  //       await this.facialRecognitionService.trainModel(employeeId);
  //     }
  //     res.status(200).json(response);
  //   } catch (err) {
  //     next(err);
  //   }
  // }

  public uploadImages = async (req: MulterRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const files: { [fieldname: string]: Express.Multer.File[] } = (req.files as { [fieldname: string]: Express.Multer.File[] });
      const employeeId: string = req.profile.id;

      const response = await this.profileService.uploadImages(employeeId, files);
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  public getProfileImages = async (req: RequestWithProfile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const employeeId: string = req.profile.id;
      const response = await this.profileService.getProfileImages(employeeId);
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }
}