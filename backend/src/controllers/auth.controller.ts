import { NextFunction, Request, Response, Router } from 'express';
import AuthenticationService from '../services/auth.service';
import { CreateProfileDto } from '../dtos/createProfile.dto';
import { LoginDto } from '../dtos/login.dto';
import { ResponseData } from '../config/ResponseData.config';
import { RequestWithProfile } from '../interfaces/auth.interface';

class AuthenticationController {
  public authService = new AuthenticationService();

  public registration = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const profileData: CreateProfileDto = req.body;
      const response = await this.authService.registration(profileData);
      res.status(201).json(response);
    } catch (err) {
      next(err);
    }
  }

  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const profileData: LoginDto = req.body;
      const tokens = await this.authService.login(profileData);
      res.status(200).json(tokens);
    } catch (err) {
      next(err);
    }
  }

  public logout = async (req: RequestWithProfile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const profileData = req.profile;
      const response = await this.authService.logout(profileData.id);
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  public refreshToken = async (req: RequestWithProfile, res: Response, next: NextFunction): Promise<any> => {
    try {
      const profileData = req.profile;
      const refreshToken = req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null;
      const response = await this.authService.refreshToken(profileData.id, refreshToken);
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }
}

export default AuthenticationController;