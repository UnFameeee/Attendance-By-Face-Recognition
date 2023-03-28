import { Router } from 'express';
import { Routes } from '../interfaces/routes.interface';
import AuthenticationController from '../controllers/auth.controller';
import { authMiddleware, refreshMiddleware } from '../middlewares/authentication.middleware';
import { loginSchema } from '../model/dtos/login.dto';
import { authorizeRoute } from '../middlewares/authorization.middleware';
import { RESOURCE, PERMISSION } from '../constant/database.constant';
import { zodValidate } from '../middlewares/zod.validation.middleware';
import { createEmployeeSchema } from '../model/dtos/employee.dto';

export class AuthenticationRoute implements Routes {
  public path = "/auth";
  public router = Router();
  public authController = new AuthenticationController();

  constructor() {
    this.initializeRoutes();
  }

  private async initializeRoutes() {
    this.router.post(`${this.path}/register`,
      authMiddleware,
      zodValidate(createEmployeeSchema),
      await authorizeRoute(PERMISSION.CREATE, RESOURCE.ACCOUNT_MANAGEMENT),
      this.authController.registration
    );

    this.router.post(`${this.path}/login`,
      zodValidate(loginSchema),
      this.authController.login
    );

    this.router.delete(`${this.path}/logout`,
      authMiddleware,
      this.authController.logout
    );

    this.router.post(`${this.path}/refreshToken`,
      refreshMiddleware,
      this.authController.refreshToken
    );

    this.router.get(`${this.path}/getPerms`,
      authMiddleware,
      this.authController.getPerms
    );
  }
}