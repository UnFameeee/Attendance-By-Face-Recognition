import { Request } from 'express';
import { Profile } from '@prisma/client';
export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface DataStoredInToken {
  id: string;
  email?: string;
}

export interface RequestWithProfile extends Request {
  profile: Profile;
}