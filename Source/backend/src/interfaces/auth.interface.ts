import { Request } from 'express';
import { Employee } from '@prisma/client';
export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface DataStoredInAccessToken {
  id: string;
  email: string;
}

export interface DataStoredInRefreshToken {
  id: string;
}


export interface RequestWithProfile extends Request {
  profile: Employee;
}