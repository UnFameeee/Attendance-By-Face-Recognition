import EmployeeController from '../controllers/employee.controller';
import { Routes } from '../interfaces/routes.interface';
import { Router } from 'express';
import { authMiddleware } from '../middlewares/authentication.middleware';
import { zodValidate } from '../middlewares/zod.validation.middleware';
import { pageSchema } from '../model/dtos/page.dto';
import { authorizeRoute } from '../middlewares/authorization.middleware';
import { PERMISSION, RESOURCE } from '../constant/database.constant';
import { updateEmployeeSchema, assignEmployeeDepartmentSchema, assignManagerDepartmentSchema, changeEmployeeRoleSchema } from '../model/dtos/employee.dto';

export class EmployeeRoute implements Routes {
  public path = "/employee";
  public router = Router();
  public employeeController = new EmployeeController();

  constructor() {
    this.initializeRoutes();
  }

  private async initializeRoutes() {
    // api/employee/listEmployee
    this.router.post(`${this.path}/listEmployee`,
      authMiddleware,
      zodValidate(pageSchema),
      await authorizeRoute(PERMISSION.READ, RESOURCE.DEPARTMENT_MANAGEMENT),
      this.employeeController.getListEmployee
    );

    // api/employee/listEmpInDepartment/:departmentId
    this.router.post(`${this.path}/listEmpInDepartment/:departmentId`,
      authMiddleware,
      zodValidate(pageSchema),
      await authorizeRoute(PERMISSION.READ, RESOURCE.EMPLOYEE_MANAGEMENT),
      this.employeeController.getEmpListInDepartment
    );

    // api/employee/getEmployeeById/:employeeId
    this.router.get(`${this.path}/getEmployeeById/:employeeId`,
      authMiddleware,
      await authorizeRoute(PERMISSION.READ, RESOURCE.EMPLOYEE_MANAGEMENT),
      this.employeeController.getEmployeeById
    );

    // api/employee/updateEmployeeDetail/:employeeId
    this.router.post(`${this.path}/updateEmployeeDetail/:employeeId`,
      authMiddleware,
      zodValidate(updateEmployeeSchema),
      await authorizeRoute(PERMISSION.UPDATE, RESOURCE.EMPLOYEE_MANAGEMENT),
      this.employeeController.updateEmployeeDetail
    );

    // api/employee/assignEmployeeToDepartment
    this.router.post(`${this.path}/assignEmployeeToDepartment`,
      authMiddleware,
      zodValidate(assignEmployeeDepartmentSchema),
      await authorizeRoute(PERMISSION.GRANT_POSITION, RESOURCE.EMPLOYEE_MANAGEMENT),
      this.employeeController.assignEmployeeToDepartment
    );

    // api/employee/assignManagerToDepartment
    this.router.post(`${this.path}/assignManagerToDepartment`,
      authMiddleware,
      zodValidate(assignManagerDepartmentSchema),
      await authorizeRoute(PERMISSION.GRANT_POSITION, RESOURCE.EMPLOYEE_MANAGEMENT),
      this.employeeController.assignManagerToDepartment
    );

    // api/employee/changeRoleOfEmployee
    this.router.post(`${this.path}/changeRoleOfEmployee`,
      authMiddleware,
      zodValidate(changeEmployeeRoleSchema),
      await authorizeRoute(PERMISSION.GRANT_PERMISSION, RESOURCE.EMPLOYEE_MANAGEMENT),
      this.employeeController.changeRoleOfEmployee
    );

    // api/employee/getListRoleOfEmployee
    this.router.get(`${this.path}/getListRoleOfEmployee`,
      authMiddleware,
      await authorizeRoute(PERMISSION.GRANT_PERMISSION, RESOURCE.EMPLOYEE_MANAGEMENT),
      this.employeeController.changeRoleOfEmployee
    );
  }
}

export default EmployeeRoute;