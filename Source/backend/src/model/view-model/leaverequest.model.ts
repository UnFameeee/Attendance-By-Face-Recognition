import { Employee, LeaveRequest, LeaveType, Department } from "@prisma/client";

export interface IEmployee extends Pick<Employee,
  "id" |
  "fullname" |
  "email"
> {
  department: Pick<Department,
    "departmentName"
  >; // Nest the Department model here
}


export interface LeaveRequestModel extends
  Pick<LeaveRequest,
    "leaveRequestId" |
    "leaveTypeId" |
    "requestDate" |
    "status" |
    "reason" |
    "note" |
    "startDate" |
    "endDate"
  > {
  leaveType: Pick<LeaveType,
    "name"
  >,
  approver: Pick<Employee,
    "fullname"
  >,
  employee: IEmployee
}