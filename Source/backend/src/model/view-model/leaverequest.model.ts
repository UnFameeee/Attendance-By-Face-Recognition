import { Employee, LeaveRequest, LeaveType } from "@prisma/client";

export interface LeaveRequestModel extends
  Pick<LeaveRequest,
    "leaveRequestId" |
    "leaveTypeId" |
    "requestDate" |
    "isApproved" |
    "reason" |
    "note" |
    "startDate" |
    "endDate"
  > {
  leaveType: Pick<LeaveType,
    "name"
  >,
  employee: Pick<Employee,
    "id" |
    "fullname"
  >,
  approver: Pick<Employee,
    "fullname"
  >,
}