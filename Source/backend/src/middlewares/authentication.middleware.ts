import { DataStoredInAccessToken, DataStoredInRefreshToken, RequestWithProfile } from '../interfaces/auth.interface';
import { Response, NextFunction } from 'express';
import { HttpException } from '../exceptions/httpException';
import * as jwt from 'jsonwebtoken';
import { prisma } from '../database/prisma.singleton';
require("dotenv").config();

export const authMiddleware = async (req: RequestWithProfile, res: Response, next: NextFunction): Promise<any> => {
  try {
    const Authorization = req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null;

    if (Authorization) {
      const secretKey: string = process.env.SECRET_KEY;
      const verificationResponse = (await jwt.verify(Authorization, secretKey)) as DataStoredInAccessToken;
      const id = verificationResponse.id;
      const findUser = await prisma.employee.findUnique({ where: { id: id } });
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
      const verificationResponse = (await jwt.verify(Authorization, secretKey)) as DataStoredInRefreshToken;
      const id = verificationResponse.id;
      const findUser = await prisma.employee.findUnique({ where: { id: id } });
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