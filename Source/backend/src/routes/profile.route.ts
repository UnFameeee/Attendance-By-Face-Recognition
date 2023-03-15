import { Routes } from "../interfaces/routes.interface";
import { Router } from 'express';
import { authMiddleware } from '../middlewares/authentication.middleware';
import { zodValidate } from '../middlewares/zod.validation.middleware';
import { updateProfilePasswordSchema, updateProfileSchema } from '../model/dtos/profile.dto';
import { authorizeRoute } from "../middlewares/authorization.middleware";
import { PERMISSION, RESOURCE } from '../constant/database.constant';
import { ProfileController } from "../controllers/profile.controller";

export class ProfileRoute implements Routes {
  public path = "/profile";
  public router = Router();
  public profileController = new ProfileController();

  constructor() {
    this.initializeRoutes();
  }

  private async initializeRoutes() {
    //api/profile/getProfileDetail/:employeeId
    this.router.get(`${this.path}/getProfileDetail/:employeeId`,
      authMiddleware,
      await authorizeRoute(PERMISSION.READ, RESOURCE.PROFILE_MANAGEMENT),
      this.profileController.getProfileDetail
    );

    //api/profile/updateProfileDetail
    this.router.post(`${this.path}/updateProfileDetail/:employeeId`,
      authMiddleware,
      zodValidate(updateProfileSchema),
      await authorizeRoute(PERMISSION.UPDATE, RESOURCE.PROFILE_MANAGEMENT),
      this.profileController.updateProfileDetail
    );

    //api/profile/updateProfilePassword
    this.router.post(`${this.path}/updateProfilePassword/:employeeId`,
      authMiddleware,
      zodValidate(updateProfilePasswordSchema),
      await authorizeRoute(PERMISSION.UPDATE, RESOURCE.PROFILE_MANAGEMENT),
      this.profileController.updateProfilePassword
    );
  }
}