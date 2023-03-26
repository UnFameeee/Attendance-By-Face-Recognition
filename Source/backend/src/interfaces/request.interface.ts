import { Employee } from "@prisma/client";
import { Request } from "express";

export interface RequestWithProfile extends Request {
  profile: Employee;
}

export interface MulterRequest extends Request {
  profile: Employee;
  file: Express.Multer.File;
}