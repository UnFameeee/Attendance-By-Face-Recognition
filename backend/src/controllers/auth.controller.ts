import { NextFunction, Request, Response, Router } from 'express';
import AuthenticationService from '../services/auth.service';
import { CreateProfileDto } from '../dtos/createProfile.dto';
import { Profile } from '@prisma/client';
import { LoginDto } from '../dtos/login.dto';

class AuthenticationController {
  public authService = new AuthenticationService();

  public registration = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const profileData: CreateProfileDto = req.body;
      const result = await this.authService.registration(profileData);

      res.status(201).json({ result: result, message: "" });
    } catch (err) {
      next(err);
    }
  }

  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const profileData: LoginDto = req.body;
      const result = await this.authService.login(profileData);
      res.status(200).json({ access: result, message: "" });
    } catch (err) {
      next(err);
    }
  }

  public logout = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      res.status(200).json({ result: "success", message: "" });
    } catch (err) {
      next(err);
    }
  }
}

export default AuthenticationController;