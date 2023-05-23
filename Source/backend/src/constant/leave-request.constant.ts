import { LeaveRequestType } from "../interfaces/leave-request.interface";

export const leaveRequestStatus: LeaveRequestType = {
  waiting: "WAITING",
  approve: "APPROVE",
  reject: "REJECT",
  overdate: "OVERDATE",
}