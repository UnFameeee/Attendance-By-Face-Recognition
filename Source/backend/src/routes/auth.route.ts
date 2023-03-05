import { Router } from 'express';
import { Routes } from '../interfaces/routes.interface';
import AuthenticationController from '../controllers/auth.controller';
import { CreateEmployeeDto } from '../dtos/createEmployee.dto';
import validationMiddleware from '../middlewares/validation.middleware';
import { authMiddleware, refreshMiddleware } from '../middlewares/authentication.middleware';
import { LoginDto } from '../dtos/login.dto';
import { authorizeRoute } from '../middlewares/authorization.middleware';
import { RESOURCE, PERMISSION } from '../constant/database.constant';

class AuthenticationRoute implements Routes {
  public path = "/auth";
  public router = Router();
  public authController = new AuthenticationController();

  constructor() {
    this.initializeRoutes();
  }

  private async initializeRoutes() {
    this.router.post(`${this.path}/register`, authMiddleware, validationMiddleware(CreateEmployeeDto), await authorizeRoute(PERMISSION.CREATE, RESOURCE.ACCOUNT_MANAGEMENT), this.authController.registration);
    this.router.post(`${this.path}/login`, validationMiddleware(LoginDto), this.authController.login);
    this.router.delete(`${this.path}/logout`, authMiddleware, this.authController.logout);
    this.router.post(`${this.path}/refreshToken`, refreshMiddleware, this.authController.refreshToken);
  }
}

export default AuthenticationRoute;