import { ShiftType, Workshift } from "@prisma/client";

export interface WorkshiftModel extends
  Pick<Workshift,
    "shiftId" |
    "employeeId" |
    "shiftTypeId" |
    "shiftDate"
  > {
  shiftType: Pick<ShiftType,
    "shiftName" |
    "startTime" |
    "endTime"
  >,
}