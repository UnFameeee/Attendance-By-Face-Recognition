import { Routes } from "../interfaces/routes.interface";
import { Router } from 'express';
import { authMiddleware } from '../middlewares/authentication.middleware';
import { authorizeRoute } from "../middlewares/authorization.middleware";
import { PERMISSION, RESOURCE } from "../constant/database.constant";
import { DepartmentController } from '../controllers/department.controller';
import { zodValidate } from "../middlewares/zod.validation.middleware";
import { createDepartmentSchema, updateDepartmentSchema } from '../model/dtos/department.dto';
import { pageSchema } from "../model/dtos/page.dto";

export class DepartmentRoute implements Routes {
  public path = "/department";
  public router = Router();
  public departmentController = new DepartmentController();

  constructor() {
    this.initializeRoutes();
  }

  private async initializeRoutes() {
    // api/department/listDepartment
    this.router.post(`${this.path}/listDepartment`,
      // authMiddleware,
      zodValidate(pageSchema),
      // await authorizeRoute(PERMISSION.READ, RESOURCE.DEPARTMENT_MANAGEMENT),
      this.departmentController.getAllDepartmentPaging
    );

    // api/department/:departmentId
    this.router.get(`${this.path}/:departmentId`,
      authMiddleware,
      await authorizeRoute(PERMISSION.READ, RESOURCE.DEPARTMENT_MANAGEMENT),
      this.departmentController.getDepartmentById
    );

    // api/department/createDepartment
    this.router.post(`${this.path}/createDepartment`,
      authMiddleware,
      zodValidate(createDepartmentSchema),
      await authorizeRoute(PERMISSION.CREATE, RESOURCE.DEPARTMENT_MANAGEMENT),
      this.departmentController.createDepartment
    );

    // api/department/updateDepartmentDetail/:departmentId
    this.router.post(`${this.path}/updateDepartmentDetail/:departmentId`,
      authMiddleware,
      zodValidate(updateDepartmentSchema),
      await authorizeRoute(PERMISSION.UPDATE, RESOURCE.DEPARTMENT_MANAGEMENT),
      this.departmentController.updateDepartmentDetail
    );

    // api/department/deleteDepartment/:departmentId
    this.router.delete(`${this.path}/deleteDepartment/:departmentId`,
      authMiddleware,
      await authorizeRoute(PERMISSION.DELETE, RESOURCE.DEPARTMENT_MANAGEMENT),
      this.departmentController.deleteDepartment
    );

    // api/department/deleteDepartments
    this.router.post(`${this.path}/deleteDepartments`,
      authMiddleware,
      await authorizeRoute(PERMISSION.DELETE, RESOURCE.DEPARTMENT_MANAGEMENT),
      this.departmentController.deleteDepartments
    );
  }
}