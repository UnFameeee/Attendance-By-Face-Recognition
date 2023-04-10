import { Router } from "express";
import { ShifttypeController } from "../controllers/shifttype.controller";
import { authMiddleware } from "../middlewares/authentication.middleware";
import { zodValidate } from "../middlewares/zod.validation.middleware";
import { pageSchema } from "../model/dtos/page.dto";
import { PERMISSION, RESOURCE } from "../constant/database.constant";
import { authorizeRoute } from "../middlewares/authorization.middleware";
import { modifyShifttypeSchema } from "../model/dtos/shifttype.dto";

export class ShifttypeRoute {
  public path = "/shifttype";
  public router = Router();
  public shifttypeController = new ShifttypeController();

  constructor() {
    this.initializeRoutes();
  }

  private async initializeRoutes() {
    // api/shifttype/autoCreateWorkshift
    this.router.get(`${this.path}/getAllShiftType`,
      authMiddleware,
      zodValidate(pageSchema),
      await authorizeRoute(PERMISSION.READ, RESOURCE.SHIFTTYPE_MANAGEMENT),
      this.shifttypeController.getAllShiftType
    );

    //api/shifttype/getListShiftType
    this.router.get(`${this.path}/getListShiftType`,
      authMiddleware,
      await authorizeRoute(PERMISSION.READ, RESOURCE.SHIFTTYPE_MANAGEMENT),
      this.shifttypeController.getListShiftType
    );

    //api/shifttype/modifyShiftType
    this.router.post(`${this.path}/modifyShiftType`,
      authMiddleware,
      zodValidate(modifyShifttypeSchema),
      await authorizeRoute(PERMISSION.CREATE, RESOURCE.SHIFTTYPE_MANAGEMENT),
      this.shifttypeController.modifyShiftType
    );

    //api/shifttype/deleteShiftType
    this.router.delete(`${this.path}/deleteShiftType/:shiftTypeId`,
      authMiddleware,
      await authorizeRoute(PERMISSION.DELETE, RESOURCE.SHIFTTYPE_MANAGEMENT),
      this.shifttypeController.deleteShiftType
    );
  }
}