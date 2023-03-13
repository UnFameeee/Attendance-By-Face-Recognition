import { Router } from "express";
import { Routes } from "../interfaces/routes.interface";
import { PERMISSION, RESOURCE } from "../constant/database.constant";
import { authMiddleware } from "../middlewares/authentication.middleware";
import { zodValidate } from "../middlewares/zod.validation.middleware";
import { authorizeRoute } from "../middlewares/authorization.middleware";
import { OrganizationController } from "../controllers/organization.controller";
import { createOrganizationSchema, updateOrganizationSchema } from "../model/dtos/organization.dto";

export class OrganizationRoute implements Routes {
  public path = "/organization";
  public router = Router();
  public organizationController = new OrganizationController();

  constructor() {
    this.initializeRoutes();
  }

  private async initializeRoutes() {
    // api/organization/detail
    this.router.get(`${this.path}/detail`,
      authMiddleware,
      await authorizeRoute(PERMISSION.READ, RESOURCE.ORGANIZATION_MANAGEMENT),
      this.organizationController.getOrganizationDetail
    );

    // api/organization/detail
    // Get Organization List for select dropdown in create organization screen
    this.router.get(`${this.path}/list`,
      authMiddleware,
      await authorizeRoute(PERMISSION.CREATE, RESOURCE.ORGANIZATION_MANAGEMENT),
      this.organizationController.getOrganizationList
    );

    // api/organization/createOrganization
    this.router.post(`${this.path}/createOrganization`,
      authMiddleware,
      zodValidate(createOrganizationSchema),
      await authorizeRoute(PERMISSION.CREATE, RESOURCE.ORGANIZATION_MANAGEMENT),
      this.organizationController.createOrganization
    );

    // api/organization/updateOrganizationDetail/:organizationId
    this.router.post(`${this.path}/updateOrganizationDetail/:organizationId`,
      authMiddleware,
      zodValidate(updateOrganizationSchema),
      await authorizeRoute(PERMISSION.UPDATE, RESOURCE.ORGANIZATION_MANAGEMENT),
      this.organizationController.updateOrganizationDetail
    );
  }
}