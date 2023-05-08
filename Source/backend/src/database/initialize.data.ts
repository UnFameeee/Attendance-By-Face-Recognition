import { leavetype_data, shifttype_data } from "../config/initializeData.config";
import { prisma } from "./prisma.singleton";

export const initializeShiftTypeData = async () => {
  for (const shifttype of shifttype_data) {
    const queryShifttype = await prisma.shiftType.findFirst({
      where: {
        shiftTypeId: shifttype.shiftTypeId,
      }
    });

    if (!queryShifttype) {
      await prisma.shiftType.create({
        data: {
          shiftTypeId: shifttype.shiftTypeId,
          shiftName: shifttype.shiftName,
          startTime: shifttype.startTime,
          endTime: shifttype.endTime,
        }
      })
    }

  }
}

export const initializeLeaveTypeData = async () => {
  for (const leavetype of leavetype_data) {
    const queryLeavetype = await prisma.leaveType.findFirst({
      where: {
        leaveTypeId: leavetype.leaveTypeId,
      }
    });

    if (!queryLeavetype) {
      await prisma.leaveType.create({
        data: {
          leaveTypeId: leavetype.leaveTypeId,
          name: leavetype.name,
          description: leavetype.description,
          annualLeave: leavetype.annualLeave,
        }
      })
    }
  }
}