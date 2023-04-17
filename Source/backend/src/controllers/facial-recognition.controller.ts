import { NextFunction, Request, Response } from "express";
import { FacialRecognitionService } from "../services/facial-recognition.service";

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
}