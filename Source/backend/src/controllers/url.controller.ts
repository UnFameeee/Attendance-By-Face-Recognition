import { NextFunction, Request, Response } from "express";
import { URLService } from "../services/url.service";

export class URLController {
  public urlService = new URLService();

  public generateURL = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const type: string = (req.query.type).toString();
      const employeeId: string = req.query?.id ? (req.query?.id).toString() : null;
      const url: string = req.query?.url ? (req.query?.url).toString() : null;

      const response = await this.urlService.generateURL(type, employeeId, url);
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  public validateURL = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const URL: string = req.body.URL;
      const response = await this.urlService.validateURL(URL);
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }
}