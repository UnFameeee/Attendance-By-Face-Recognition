import { NextFunction, Request, Response } from "express";
import EmployeeService from "../services/employee.service";
import { HttpException } from "../config/httpException";

class EmployeeController {
  public employeeService = new EmployeeService();

  public getEmployeeData = (req: Request, res: Response, next: NextFunction): any => {
    try {

    } catch (err) {
      next(new HttpException(500, "Server Error"));
    }
  }

  public updateEmployeeData = (req: Request, res: Response, next: NextFunction): any => {
    try {

    } catch (err) {
      next(new HttpException(500, "Server Error"));
    }
  }

  public deleteEmployeeData = (req: Request, res: Response, next: NextFunction): any => {
    try {

    } catch (err) {
      next(new HttpException(500, "Server Error"));
    }
  }
}

export default EmployeeController;