import { Router } from "express";
import { authMiddleware } from "../middlewares/authentication.middleware";
import { zodValidate } from "../middlewares/zod.validation.middleware";
import { pageSchema } from "../model/dtos/page.dto";
import { PERMISSION, RESOURCE } from "../constant/database.constant";
import { authorizeRoute } from "../middlewares/authorization.middleware";
import { modifyShifttypeSchema } from "../model/dtos/shifttype.dto";
import { LeavetypeController } from "../controllers/leavetype.controller";
import { modifyLeavetypeSchema } from "../model/dtos/leavetype.dto";

export class LeavetypeRoute {
  public path = "/leavetype";
  public router = Router();
  public leavetypeController = new LeavetypeController();

  constructor() {
    this.initializeRoutes();
  }

  private async initializeRoutes() {
    // api/leavetype/getAllLeaveType
    this.router.post(`${this.path}/getAllLeaveType`,
      authMiddleware,
      zodValidate(pageSchema),
      // await authorizeRoute(PERMISSION.READ, RESOURCE.SHIFTTYPE_MANAGEMENT),
      this.leavetypeController.getAllLeaveType
    );

    //api/leavetype/getListLeaveType
    this.router.get(`${this.path}/getListLeaveType`,
      authMiddleware,
      // await authorizeRoute(PERMISSION.READ, RESOURCE.SHIFTTYPE_MANAGEMENT),
      this.leavetypeController.getListLeaveType
    );

    //api/leavetype/modifyLeaveType
    this.router.post(`${this.path}/modifyLeaveType`,
      authMiddleware,
      zodValidate(modifyLeavetypeSchema),
      // await authorizeRoute(PERMISSION.CREATE, RESOURCE.SHIFTTYPE_MANAGEMENT),
      this.leavetypeController.modifyLeaveType
    );

    //api/leavetype/deleteShiftType
    this.router.delete(`${this.path}/deleteLeaveType/:leaveTypeId`,
      authMiddleware,
      // await authorizeRoute(PERMISSION.DELETE, RESOURCE.SHIFTTYPE_MANAGEMENT),
      this.leavetypeController.deleteLeaveType
    );
  }
}