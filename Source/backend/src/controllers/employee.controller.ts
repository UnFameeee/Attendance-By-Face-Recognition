import { NextFunction, Response } from "express";
import { EmployeeService } from "../services/employee.service";
import { HttpException } from "../config/httpException";
import { RequestWithProfile } from '../interfaces/auth.interface';
import { Page } from "../config/paginate.config";
import { AssignEmployeeDepartmentDTO, AssignManagerDepartmentDTO, ChangeRoleDTO, UpdateEmployeeDTO } from '../model/dtos/employee.dto';

class EmployeeController {
  public employeeService = new EmployeeService();

  public getListEmployee = async (req: RequestWithProfile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page: Page = req.body;
      const response = await this.employeeService.getListEmployee(page);
      res.status(200).json(response);
    } catch (err) {
      next(new HttpException(500, "Server Error"));
    }
  }

  public getEmpListInDepartment = async (req: RequestWithProfile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const departmentId: string = req.params.departmentId;
      const page: Page = req.body;
      const response = await this.employeeService.getEmpListInDepartment(departmentId, page);
      res.status(200).json(response);
    } catch (err) {
      next(new HttpException(500, "Server Error"));
    }
  }

  public getEmployeeById = async (req: RequestWithProfile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const employeeId: string = req.params.employeeId;
      const response = await this.employeeService.getEmployeeById(employeeId);
      res.status(200).json(response);
    } catch (err) {
      next(new HttpException(500, "Server Error"));
    }
  }

  public updateEmployeeDetail = async (req: RequestWithProfile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const employeeId: string = req.params.employeeId;
      const data: UpdateEmployeeDTO = req.body;
      const response = await this.employeeService.updateEmployeeDetail(employeeId, data);
      res.status(200).json(response);
    } catch (err) {
      next(new HttpException(500, "Server Error"));
    }
  }

  public assignEmployeeToDepartment = async (req: RequestWithProfile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: AssignEmployeeDepartmentDTO = req.body;
      const response = await this.employeeService.assignEmployeeToDepartment(data);
      res.status(200).json(response);
    } catch (err) {
      next(new HttpException(500, "Server Error"));
    }
  }

  public assignManagerToDepartment = async (req: RequestWithProfile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: AssignManagerDepartmentDTO = req.body;
      const response = await this.employeeService.assignManagerToDepartment(data);
      res.status(200).json(response);
    } catch (err) {
      next(new HttpException(500, "Server Error"));
    }
  }

  public changeRoleOfEmployee = async (req: RequestWithProfile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: ChangeRoleDTO = req.body;
      const response = await this.employeeService.changeRoleOfEmployee(data);
      res.status(200).json(response);
    } catch (err) {
      next(new HttpException(500, "Server Error"));
    }
  }
}

export default EmployeeController;