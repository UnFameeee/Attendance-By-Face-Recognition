import { NextFunction, Request, Response } from 'express';
import AuthenticationService from '../services/auth.service';
import { LoginDTO } from '../model/dtos/login.dto';
import { RequestWithProfile } from '../interfaces/auth.interface';
import { CreateEmployeeDTO } from '../model/dtos/employee.dto';
import { HttpException } from '../config/httpException';

class AuthenticationController {
  public authService = new AuthenticationService();

  public registration = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const employeeData: CreateEmployeeDTO = req.body;
      const response = await this.authService.registration(employeeData);
      res.status(201).json(response);
    } catch (err) {
      next(new HttpException(500, "Server Error"));
    }
  }

  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const employeeData: LoginDTO = req.body;
      const tokens = await this.authService.login(employeeData);
      res.status(200).json(tokens);
    } catch (err) {
      next(new HttpException(500, "Server Error"));
    }
  }

  public logout = async (req: RequestWithProfile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const employeeData = req.profile;
      const response = await this.authService.logout(employeeData.id);
      res.status(200).json(response);
    } catch (err) {
      next(new HttpException(500, "Server Error"));
    }
  }

  public refreshToken = async (req: RequestWithProfile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const employeeData = req.profile;
      const refreshToken = req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null;
      const response = await this.authService.refreshToken(employeeData.id, refreshToken);
      res.status(200).json(response);
    } catch (err) {
      next(new HttpException(500, "Server Error"));
    }
  }
}

export default AuthenticationController;