import EmployeeController from '../controllers/employee.controller';
import { Routes } from '../interfaces/routes.interface';
import { Router } from 'express';

class EmployeeRoute implements Routes {
  public path = "/employee/";
  public router = Router();
  public employeeController = new EmployeeController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.employeeController.getEmployeeData);
  }
}

export default EmployeeRoute;