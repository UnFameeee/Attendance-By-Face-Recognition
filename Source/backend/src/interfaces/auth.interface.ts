import { Request } from 'express';
import { Employee } from '@prisma/client';

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface DataStoredInAccessToken {
  id: string;
  email: string;
  image: string;
  departmentId: string;
  roleName: string;
}

export interface DataStoredInRefreshToken {
  id: string;
}