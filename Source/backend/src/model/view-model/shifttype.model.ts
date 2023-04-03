import { ShiftType } from "@prisma/client";

export interface ShifttypeModel extends
  Pick<ShiftType,
    "shiftTypeId" |
    "shiftName" |
    "startTime" |
    "endTime"
  > {
}

export interface DropdownShifttypeModel extends
  Pick<ShiftType,
    "shiftTypeId" |
    "shiftName"
  > {
}