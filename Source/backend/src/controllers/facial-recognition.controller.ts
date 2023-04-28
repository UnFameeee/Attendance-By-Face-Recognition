import { NextFunction, Request, Response } from "express";
import { FacialRecognitionService } from "../services/facial-recognition.service";
import { MulterRequest } from "../interfaces/request.interface";

export class FacialRecognitionController {
  public facialRecognitionService = new FacialRecognitionService();

  public trainModel = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const employeeId: string = req.params.employeeId;
      const response = await this.facialRecognitionService.trainModel(employeeId);
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  public trainAllModel = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await this.facialRecognitionService.trainAllModel();
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  public uploadingImagesAndTraining = async (req: MulterRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const files: { [fieldname: string]: Express.Multer.File[] } = (req.files as { [fieldname: string]: Express.Multer.File[] });
      const employeeId: string = req.profile.id;

      const response = await this.facialRecognitionService.uploadingImagesAndTraining(employeeId, files);
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }
}