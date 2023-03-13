import { NextFunction, Response } from 'express';
import { DepartmentService } from '../services/department.service';
import { CreateDepartmentDTO, UpdateDepartmentDTO } from '../model/dtos/department.dto';
import { HttpException } from '../config/httpException';
import { RequestWithProfile } from '../interfaces/auth.interface';
import { Page } from '../config/paginate.config';

export class DepartmentController {
  public departmentService = new DepartmentService();

  public getAllDepartment = async (req: RequestWithProfile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page: Page = req.body;
      const response = await this.departmentService.getAllDepartment(page);
      res.status(200).json(response);
    } catch (err) {
      next(new HttpException(500, "Server Error"));
    }
  }

  public getDepartmentById = async (req: RequestWithProfile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const departmentId = req.params.departmentId;
      const response = await this.departmentService.getDepartmentById(departmentId);
      res.status(200).json(response);
    } catch (err) {
      next(new HttpException(500, "Server Error"));
    }
  }

  public createDepartment = async (req: RequestWithProfile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: UpdateDepartmentDTO = req.body;
      const response = await this.departmentService.createDepartment(data);
      res.status(200).json(response);
    } catch (err) {
      next(new HttpException(500, "Server Error"));
    }
  }

  public updateDepartmentDetail = async (req: RequestWithProfile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const departmentId = req.params.departmentId;
      const data: CreateDepartmentDTO = req.body;
      const response = await this.departmentService.updateDepartmentDetail(departmentId, data);
      res.status(200).json(response);
    } catch (err) {
      next(new HttpException(500, "Server Error"));
    }
  }

  public deleteDepartment = async (req: RequestWithProfile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const departmentId = req.params.departmentId;
      const response = await this.departmentService.deleteDepartment(departmentId);
      res.status(200).json(response);
    } catch (err) {
      next(new HttpException(500, "Server Error"));
    }
  }

  public deleteDepartments = async (req: RequestWithProfile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const departmentIds: string[] = req.body;
      const response = await this.departmentService.deleteDepartments(departmentIds);
      res.status(200).json(response);
    } catch (err) {
      next(new HttpException(500, "Server Error"));
    }
  }
}