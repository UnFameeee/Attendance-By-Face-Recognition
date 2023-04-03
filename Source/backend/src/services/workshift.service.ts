import moment from "moment";
import { ResponseData } from "../config/responseData.config";
import { prisma } from "../database/prisma.singleton";
import { AutoCreateWorkshiftDTO, ModifyWorkshiftDTO } from "../model/dtos/workshift.dto";

export class WorkshiftService {
  //auto create workshift base on
  public autoCreateWorkshift = async (data: AutoCreateWorkshiftDTO): Promise<ResponseData<String>> => {
    const response = new ResponseData<String>;

    // Get the number of days in the specified month
    // const numDays = moment(`${data.year}-${data.month}-01`).daysInMonth()

    for (const empId of data.employeeIds) {
      //looping through days in the specify month
      for (let i = data.fromDate; i <= data.toDate; ++i) {
        // Get the date in ISO 8601 format (e.g. "2023-04-01")
        const date = moment(`${data.year}-${data.month}-${i}`).format('YYYY-MM-DD');

        const queryData = await prisma.workshift.findFirst({
          where: {
            employeeId: empId,
            shiftDate: date,
            deleted: false,
          }
        })

        const shiftType = await prisma.shiftType.findFirst({
          where: {
            shiftName: data.shiftName,
            deleted: false,
          }
        })

        if (!queryData) {
          await prisma.workshift.create({
            data: {
              employeeId: empId,
              shiftDate: date,
              shiftTypeId: shiftType.shiftTypeId
            }
          })
        } else {
          await prisma.workshift.update({
            data: {
              employeeId: empId,
              shiftDate: date,
              shiftTypeId: shiftType.shiftTypeId
            },
            where: {
              shiftId: queryData.shiftId,
            }
          })
        }
      }

      response.result = "Create shift successfully";
      return response;
    }
  }

  public modifyWorkshift = async (data: ModifyWorkshiftDTO[]): Promise<ResponseData<String>> => {
    const response = new ResponseData<String>;
    var queryModifyData: any;

    for (const workshift of data) {
      const queryData = await prisma.workshift.findFirst({
        where: {
          employeeId: workshift.employeeId,
          shiftDate: workshift.shiftDate,
          deleted: false,
        }
      })

      // const shiftType = await prisma.shiftType.findFirst({
      //   where: {
      //     shiftName: workshift.shiftName,
      //     deleted: false,
      //   }
      // })

      //create
      if (!queryData) {
        queryModifyData = await prisma.workshift.create({
          data: {
            employeeId: workshift.employeeId,
            shiftTypeId: workshift.shiftTypeId,
            shiftDate: workshift.shiftDate,
          }
        })
      }
      //update
      else {
        queryModifyData = await prisma.workshift.update({
          data: {
            employeeId: workshift.employeeId,
            shiftTypeId: workshift.shiftTypeId,
            shiftDate: workshift.shiftDate,
          },
          where: {
            shiftId: queryData.shiftId
          }
        })
      }
    }
    if (queryModifyData) {
      response.result = "Modify workshift successfully";
    } else {
      response.message = "Modify workshift successfully";
    }
    return response;
  }
}