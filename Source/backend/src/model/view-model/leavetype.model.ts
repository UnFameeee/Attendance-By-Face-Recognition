import { LeaveType } from "@prisma/client";

export interface LeavetypeModel extends
  Pick<LeaveType,
    "leaveTypeId" |
    "name" |
    "annualLeave"
  > {
}

export interface DropdownLeavetypeModel extends
  Pick<LeaveType,
    "leaveTypeId" |
    "name" |
    "annualLeave"
  > {
}