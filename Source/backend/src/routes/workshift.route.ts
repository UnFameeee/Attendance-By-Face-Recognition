import { Router } from "express";
import { Routes } from "../interfaces/routes.interface";
import { WorkshiftController } from "../controllers/workshift.controller";
import { authMiddleware } from "../middlewares/authentication.middleware";
import { zodValidate } from "../middlewares/zod.validation.middleware";
import { autoCreateWorkshiftSchema, modifyWorkshiftSchema } from "../model/dtos/workshift.dto";
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
    // api/workshift/autoCreateWorkshift
    this.router.get(`${this.path}/getWorkshiftOfDepartment/departmentId`,
      authMiddleware,
      zodValidate(autoCreateWorkshiftSchema),
      await authorizeRoute(PERMISSION.CREATE, RESOURCE.WORKSHIFT_MANAGEMENT),
      this.workshiftController.getWorkshiftOfDepartment
    );

    // api/workshift/getWorkshiftOfEmployee
    this.router.get(`${this.path}/getWorkshiftOfEmployee/employeeId`,
      authMiddleware,
      zodValidate(autoCreateWorkshiftSchema),
      await authorizeRoute(PERMISSION.CREATE, RESOURCE.WORKSHIFT_MANAGEMENT),
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
  }
}