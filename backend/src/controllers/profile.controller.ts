import { NextFunction, Request, Response } from "express";
import ProfileService from "../services/profile.service";

class ProfileController {
  public profileService = new ProfileService();

  public getProfileData = (req: Request, res: Response, next: NextFunction): any => {
    try {

    } catch (err) {
      next(err);
    }
  }
}

export default ProfileController;