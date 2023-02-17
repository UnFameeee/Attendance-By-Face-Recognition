import { Router } from 'express';
import { Routes } from '../interfaces/routes.interface';
import AuthenticationController from '../controllers/auth.controller';
import { CreateProfileDto } from '../dtos/createProfile.dto';
import validationMiddleware from '../middlewares/validation.middleware';
import { authMiddleware, refreshMiddleware } from '../middlewares/auth.middleware';
import { LoginDto } from '../dtos/login.dto';

class AuthenticationRoute implements Routes {
  public path = "/auth";
  public router = Router();
  public authController = new AuthenticationController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/register`, validationMiddleware(CreateProfileDto), this.authController.registration);
    this.router.post(`${this.path}/login`, validationMiddleware(LoginDto), this.authController.login);
    this.router.delete(`${this.path}/logout`, authMiddleware, this.authController.logout);
    this.router.post(`${this.path}/refreshToken`, refreshMiddleware, this.authController.refreshToken);
  }
}

export default AuthenticationRoute;