import { NextFunction, Request, Response } from "express";
import { URLService } from "../services/url.service";

export class URLController {
  public urlService = new URLService();

  public generateURL = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const type: string = (req.query.type).toString();
      const response = await this.urlService.generateURL(type);
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