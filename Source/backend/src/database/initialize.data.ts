import { shifttype_data } from "../config/initializeData.config";
import { prisma } from "./prisma.singleton";

export const initializeShiftTypeData = async (flag: boolean) => {
  //only work if turn the flag == true
  if (flag) {
    for (const shifttype of shifttype_data) {
      const queryShifttype = await prisma.shiftType.findFirst({
        where: {
          shiftName: shifttype.shiftName,
        }
      });

      if (!queryShifttype) {
        await prisma.shiftType.create({
          data: {
            shiftName: shifttype.shiftName,
            startTime: shifttype.startTime,
            endTime: shifttype.endTime,
          }
        })
      }
    }
  }
}