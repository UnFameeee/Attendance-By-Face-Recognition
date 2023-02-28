import { NextFunction, Request, Response } from "express";
import ProfileService from "../services/profile.service";
import { PrismaClient } from '@prisma/client';
import { HttpException } from "../exceptions/HttpException";
import { DataStoredInToken } from "../interfaces/auth.interface";
import * as jwt from 'jsonwebtoken';

class ProfileController {
  public profileService = new ProfileService();

  public getProfileData = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const Authorization = req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null;
      if (Authorization) {
        const secretKey: string = process.env.SECRET_KEY;
        const verificationResponse = (await jwt.verify(Authorization, secretKey)) as DataStoredInToken;
        const profileId = verificationResponse.id;
        const profile = new PrismaClient().profile;
        const findUser = await profile.findUnique({ where: { id: profileId } });
        // if (findUser) {
        //   req.profile = findUser;
        //   next();
        // } else {
        //   next(new HttpException(401, 'Wrong authentication token'));
        // }
      } else {
        next(new HttpException(404, 'Authentication token missing'));
      }
    } catch (err) {
      next(err);
    }
  }
}

export default ProfileController;