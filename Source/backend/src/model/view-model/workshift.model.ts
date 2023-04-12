import { Employee, ShiftType, Workshift } from "@prisma/client";

export interface WorkshiftModel extends
  Pick<Workshift,
    "shiftId" |
    "shiftTypeId" |
    "shiftDate"
  > {
  shiftType: Pick<ShiftType,
    "shiftName" |
    "startTime" |
    "endTime"
  >,
  employee: Pick<Employee,
    "id" |
    "fullname"
  >,
}