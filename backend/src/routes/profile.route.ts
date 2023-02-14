import ProfileController from '../controllers/profile.controller';
import { Routes } from '../interfaces/routes.interface';
import { Router } from 'express';

class ProfileRoute implements Routes {
  public path = "/profile/";
  public router = Router();
  public profileController = new ProfileController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.profileController.getProfileData);
  }
}

export default ProfileRoute;