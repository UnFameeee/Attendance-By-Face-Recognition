import { Workshift } from "@prisma/client";

export interface WorkshiftModel extends
  Pick<Workshift,
    "shiftId" |
    "employeeId" |
    "shiftTypeId" |
    "shiftDate"
  > {
}