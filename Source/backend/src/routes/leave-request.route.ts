import { Router } from "express";
import { authMiddleware } from "../middlewares/authentication.middleware";
import { zodValidate } from "../middlewares/zod.validation.middleware";
import { pageSchema } from "../model/dtos/page.dto";
import { PERMISSION, RESOURCE } from "../constant/database.constant";
import { authorizeRoute } from "../middlewares/authorization.middleware";
import { LeaveRequestController } from "../controllers/leave-request.controller";
import { createLeaveRequestSchema } from "../model/dtos/leave-request.dto";
import { dateTimeV2Schema } from "../model/dtos/workshift.dto";

export class LeaveRequestRoute {
  public path = "/leaverequest";
  public router = Router();
  public leaveRequestController = new LeaveRequestController();

  constructor() {
    this.initializeRoutes();
  }

  private async initializeRoutes() {
    // api/leaverequest/getLeaveRequestOfDepartment
    this.router.post(`${this.path}/getLeaveRequestOfDepartment/:departmentId`,
      authMiddleware,
      zodValidate(pageSchema),
      // await authorizeRoute(PERMISSION.READ, RESOURCE.SHIFTTYPE_MANAGEMENT),
      this.leaveRequestController.getLeaveRequestOfDepartment
      );
      
      //api/leaverequest/getLeaveRequestOfEmployee
      this.router.post(`${this.path}/getLeaveRequestOfEmployee/:employeeId`,
      authMiddleware,
      // zodValidate(dateTimeV2Schema),
      zodValidate(pageSchema),
      // await authorizeRoute(PERMISSION.READ, RESOURCE.SHIFTTYPE_MANAGEMENT),
      this.leaveRequestController.getLeaveRequestOfEmployee
    );

    //api/leaverequest/createLeaveRequest
    this.router.post(`${this.path}/createLeaveRequest`,
      authMiddleware,
      zodValidate(createLeaveRequestSchema),
      // await authorizeRoute(PERMISSION.CREATE, RESOURCE.SHIFTTYPE_MANAGEMENT),
      this.leaveRequestController.createLeaveRequest
    );

    //api/leaverequest/getAnnualDetail
    this.router.get(`${this.path}/getAnnualDetail`,
      authMiddleware,
      // await authorizeRoute(PERMISSION.DELETE, RESOURCE.SHIFTTYPE_MANAGEMENT),
      this.leaveRequestController.getAnnualDetail
    );

    //api/leaverequest/verifyLeaveRequest
    this.router.post(`${this.path}/verifyLeaveRequest/:leaveRequestId`,
      authMiddleware,
      // zodValidate(createLeaveRequestSchema),
      // await authorizeRoute(PERMISSION.CREATE, RESOURCE.SHIFTTYPE_MANAGEMENT),
      this.leaveRequestController.verifyLeaveRequest
    );

    //api/leaverequest/deleteLeaveRequest
    this.router.delete(`${this.path}/deleteLeaveRequest/:leaveRequestId`,
      authMiddleware,
      // zodValidate(createLeaveRequestSchema),
      // await authorizeRoute(PERMISSION.CREATE, RESOURCE.SHIFTTYPE_MANAGEMENT),
      this.leaveRequestController.deleteLeaveRequest
    );
  }
}