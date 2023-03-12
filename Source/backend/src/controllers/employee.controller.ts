import { NextFunction, Request, Response } from "express";
import EmployeeService from "../services/employee.service";

class EmployeeController {
  public employeeService = new EmployeeService();

  public getEmployeeData = (req: Request, res: Response, next: NextFunction): any => {
    try {

    } catch (err) {
      next(err);
    }
  }

  public updateEmployeeData = (req: Request, res: Response, next: NextFunction): any => {
    try {

    } catch (err) {
      next(err);
    }
  }

  public deleteEmployeeData = (req: Request, res: Response, next: NextFunction): any => {
    try {

    } catch (err) {
      next(err);
    }
  }
}

export default EmployeeController;