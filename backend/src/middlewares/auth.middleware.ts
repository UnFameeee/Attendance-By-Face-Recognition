import { DataStoredInToken, RequestWithProfile } from '../interfaces/auth.interface';
import { Response, NextFunction } from 'express';
import { HttpException } from '../exceptions/HttpException';
import * as jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
require("dotenv").config();

export const authMiddleware = async (req: RequestWithProfile, res: Response, next: NextFunction): Promise<any> => {
  try {
    const Authorization = req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null;

    if (Authorization) {
      const secretKey: string = process.env.SECRET_KEY;
      const verificationResponse = (await jwt.verify(Authorization, secretKey)) as DataStoredInToken;
      const profileId = verificationResponse.id;
      const profile = new PrismaClient().profile;
      const findUser = await profile.findUnique({ where: { id: profileId } });
      if (findUser) {
        req.profile = findUser;
        next();
      } else {
        next(new HttpException(401, 'Wrong authentication token'));
      }
    } else {
      next(new HttpException(404, 'Authentication token missing'));
    }
  } catch (err) {
    next(new HttpException(401, 'Wrong authentication token or it expired'));
  }
}

export const refreshMiddleware = async (req: RequestWithProfile, res: Response, next: NextFunction): Promise<any> => {
  try {
    const Authorization = req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null;

    if (Authorization) {
      const secretKey: string = process.env.REFRESH_KEY;
      const verificationResponse = (await jwt.verify(Authorization, secretKey)) as DataStoredInToken;
      const profileId = verificationResponse.id;
      const profile = new PrismaClient().profile;
      const findUser = await profile.findUnique({ where: { id: profileId } });
      if (findUser) {
        req.profile = findUser;
        next();
      } else {
        next(new HttpException(401, 'Wrong authentication token'));
      }
    } else {
      next(new HttpException(404, 'Authentication token missing'));
    }
  } catch (err: any) {
    next(new HttpException(401, 'Wrong authentication token or it expired'));
  }
}