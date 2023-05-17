import { Employee } from "@prisma/client";
import { Request } from "express";

export interface RequestWithMulter extends Request {
  error?: string;
}

export interface RequestWithProfile extends Request {
  profile: Employee;
  error?: string;
}

export interface MulterRequest extends Request {
  profile: Employee;
  file: Express.Multer.File;
  error?: string;
}