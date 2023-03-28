import { NextFunction, Response } from "express";
import { RequestWithProfile } from "../interfaces/request.interface";
import { FacialRecognitionService } from "../services/facial-recognition.service";

export class FacialRecognitionController {
  public facialRecognitionService = new FacialRecognitionService();

  public trainModel = async (req: RequestWithProfile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await this.facialRecognitionService.trainModel();
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }
}