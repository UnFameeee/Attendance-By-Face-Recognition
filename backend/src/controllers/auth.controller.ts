import { NextFunction, Request, Response, Router } from 'express';
import AuthenticationService from '../services/auth.service';
import { CreateProfileDto } from '../dtos/createProfile.dto';
import { LoginDto } from '../dtos/login.dto';
import { ResponseData } from '../config/ResponseData.config';

class AuthenticationController {
  public authService = new AuthenticationService();

  public registration = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    var response = new ResponseData<String>();
    try {
      const profileData: CreateProfileDto = req.body;
      const result = await this.authService.registration(profileData);
      response.result = result;
      res.status(201).json(response);
    } catch (err) {
      next(err);
    }
  }

  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const profileData: LoginDto = req.body;
      const accessToken = await this.authService.login(profileData);
      res.status(200).json({ access: accessToken, refresh: "" });
    } catch (err) {
      next(err);
    }
  }

  public logout = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    var response = new ResponseData<String>();
    try {
      response.result = "success";
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }
}

export default AuthenticationController;