import { NextFunction, Response } from "express";
import { EmployeeService } from "../services/employee.service";

import { RequestWithProfile } from '../interfaces/request.interface';
import { Page } from "../config/paginate.config";
import { AssignEmployeeDepartmentDTO, AssignManagerDepartmentDTO, ChangeRoleDTO, CreateEmployeeDTO, UpdateEmployeeDTO } from '../model/dtos/employee.dto';
import { Employee } from "@prisma/client";

class EmployeeController {
  public employeeService = new EmployeeService();

  public getListEmployee = async (req: RequestWithProfile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page: Page = req.body;
      const response = await this.employeeService.getListEmployee(page);
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  public getEmpListInDepartment = async (req: RequestWithProfile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const departmentId: string = req.params.departmentId;
      const page: Page = req.body;
      const response = await this.employeeService.getEmpListInDepartment(departmentId, page);
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  public getEmployeeById = async (req: RequestWithProfile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const employeeId: string = req.params.employeeId;
      const response = await this.employeeService.getEmployeeById(employeeId);
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  public createEmployee = async (req: RequestWithProfile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: CreateEmployeeDTO = req.body;
      const response = await this.employeeService.createEmployee(data);
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  public updateEmployeeDetail = async (req: RequestWithProfile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const employeeId: string = req.params.employeeId;
      const data: UpdateEmployeeDTO = req.body;
      const response = await this.employeeService.updateEmployeeDetail(employeeId, data);
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  public assignEmployeeToDepartment = async (req: RequestWithProfile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: AssignEmployeeDepartmentDTO = req.body;
      const response = await this.employeeService.assignEmployeeToDepartment(data);
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  public assignManagerToDepartment = async (req: RequestWithProfile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: AssignManagerDepartmentDTO = req.body;
      const response = await this.employeeService.assignManagerToDepartment(data);
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  public changeRoleOfEmployee = async (req: RequestWithProfile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: ChangeRoleDTO = req.body;
      const response = await this.employeeService.changeRoleOfEmployee(data);
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }
  public getListRoleOfEmployee = async (req: RequestWithProfile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await this.employeeService.getListRoleOfEmployee();
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  public getListImageOfEmployee = async (req: RequestWithProfile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const employeeId = req.params.employeeId;
      // const employee: Employee = req.profile;
      const response = await this.employeeService.getListImageOfEmployee(employeeId);
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  public retrain = async (req: RequestWithProfile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const employeeId = req.params.employeeId;
      const response = await this.employeeService.retrain(employeeId);
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  public validateRetrain = async (req: RequestWithProfile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const employeeId = (req.query.employeeId).toString();
      const response = await this.employeeService.validateRetrain(employeeId);
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }
}

export default EmployeeController;