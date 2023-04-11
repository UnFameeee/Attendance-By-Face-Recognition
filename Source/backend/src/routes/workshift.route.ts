import { Router } from "express";
import { Routes } from "../interfaces/routes.interface";
import { WorkshiftController } from "../controllers/workshift.controller";
import { authMiddleware } from "../middlewares/authentication.middleware";
import { zodValidate } from "../middlewares/zod.validation.middleware";
import { autoCreateWorkshiftSchema, dateTimeSchema, modifyWorkshiftSchema } from "../model/dtos/workshift.dto";
import { authorizeRoute } from "../middlewares/authorization.middleware";
import { PERMISSION, RESOURCE } from "../constant/database.constant";

export class WorkshiftRoute implements Routes {
  public path = "/workshift";
  public router = Router();
  public workshiftController = new WorkshiftController();

  constructor() {
    this.initializeRoutes();
  }

  private async initializeRoutes() {
    // // api/workshift/autoCreateWorkshift
    // this.router.post(`${this.path}/getWorkshiftOfDepartment/:departmentId`,
    //   authMiddleware,
    //   zodValidate(dateTimeSchema),
    //   await authorizeRoute(PERMISSION.READ, RESOURCE.WORKSHIFT_MANAGEMENT),
    //   this.workshiftController.getWorkshiftOfDepartment
    // );

    // api/workshift/getWorkshiftOfEmployee
    this.router.post(`${this.path}/getWorkshiftOfEmployee/:employeeId`,
      authMiddleware,
      zodValidate(dateTimeSchema),
      await authorizeRoute(PERMISSION.READ, RESOURCE.WORKSHIFT_MANAGEMENT),
      this.workshiftController.getWorkshiftOfEmployee
    );

    // api/workshift/autoCreateWorkshift
    this.router.post(`${this.path}/autoCreateWorkshift`,
      authMiddleware,
      zodValidate(autoCreateWorkshiftSchema),
      await authorizeRoute(PERMISSION.CREATE, RESOURCE.WORKSHIFT_MANAGEMENT),
      this.workshiftController.autoCreateWorkshift
    );

    //api/workshift/modifyWorkshift
    this.router.post(`${this.path}/modifyWorkshift`,
      authMiddleware,
      zodValidate(modifyWorkshiftSchema),
      await authorizeRoute(PERMISSION.CREATE, RESOURCE.WORKSHIFT_MANAGEMENT),
      this.workshiftController.modifyWorkshift
    );
    
    //api/workshift/deleteWorkshift
    this.router.delete(`${this.path}/deleteWorkshift/:shiftId`,
      authMiddleware,
      await authorizeRoute(PERMISSION.CREATE, RESOURCE.WORKSHIFT_MANAGEMENT),
      this.workshiftController.deleteWorkshift
    );
  }
}