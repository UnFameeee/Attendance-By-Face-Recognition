import moment from "moment";
import { ResponseData } from "../config/responseData.config";
import { prisma } from "../database/prisma.singleton";
import { AutoCreateWorkshiftDTO, DateTimeDTO, ModifyWorkshiftDTO } from "../model/dtos/workshift.dto";
import { Helper } from "../utils/helper";
import { WorkshiftModel } from "../model/view-model/workshift.model";

export class WorkshiftService {
  public getWorkshiftOfEmployee = async (employeeId: string, data: DateTimeDTO): Promise<ResponseData<WorkshiftModel[]>> => {
    const response = new ResponseData<WorkshiftModel[]>;
    const daysInmonth = moment(`${data.year}-${data.month}-01`, "YYYY-MM-DD").daysInMonth();
    const startDate = Helper.ConfigStaticDateTime("00:00", `${data.year}-${data.month}-${1}`)
    const endDate = Helper.ConfigStaticDateTime("00:00", `${data.year}-${data.month}-${daysInmonth}`)

    const queryData = await prisma.workshift.findMany({
      where: {
        deleted: false,
        employeeId: employeeId,
        shiftDate: {
          gte: startDate,
          lte: endDate,
        }
      },
      select: {
        shiftId: true,
        employeeId: true,
        shiftTypeId: true,
        shiftDate: true,
        shiftType: {
          select: {
            shiftName: true,
            startTime: true,
            endTime: true,
          }
        }
      },
      orderBy: {
        shiftDate: "asc"
      },
    })

    response.result = queryData;
    return response;
  }

  //auto create workshift base on Date from and to
  public autoCreateWorkshift = async (data: AutoCreateWorkshiftDTO): Promise<ResponseData<String>> => {
    const response = new ResponseData<String>;

    // Get the number of days in the specified month
    // const numDays = moment(`${data.year}-${data.month}-01`).daysInMonth()

    for (const empId of data.employeeIds) {
      //looping through days in the specify month
      for (let i = data.fromDate; i <= data.toDate; ++i) {
        // Get the date in ISO 8601 format (e.g. "2023-04-01")
        const date = Helper.ConfigStaticDateTime("00:00", `${data.year}-${data.month}-${i}`)

        const queryData = await prisma.workshift.findFirst({
          where: {
            employeeId: empId,
            shiftDate: date,
            deleted: false,
          }
        })

        const shiftType = await prisma.shiftType.findFirst({
          where: {
            shiftTypeId: data.shiftTypeId,
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

  public modifyWorkshift = async (data: ModifyWorkshiftDTO): Promise<ResponseData<String>> => {
    const response = new ResponseData<String>;
    var queryModifyData: any;
    const modifyDate = Helper.ConfigStaticDateTime("00:00", data.shiftDate)

    const queryData = await prisma.workshift.findFirst({
      where: {
        employeeId: data.employeeId,
        shiftDate: modifyDate,
        deleted: false,
      }
    })

    //create
    if (!queryData) {
      queryModifyData = await prisma.workshift.create({
        data: {
          employeeId: data.employeeId,
          shiftTypeId: data.shiftTypeId,
          shiftDate: modifyDate,
        }
      })
    }
    //update
    else {
      queryModifyData = await prisma.workshift.update({
        data: {
          employeeId: data.employeeId,
          shiftTypeId: data.shiftTypeId,
          shiftDate: modifyDate,
        },
        where: {
          shiftId: queryData.shiftId
        }
      })
    }

    if (queryModifyData) {
      response.result = "Modify workshift successfully";
    } else {
      response.message = "Modify workshift unsuccessfully";
    }
    return response;
  }

  public deleteWorkshift = async (shiftId: string): Promise<ResponseData<String>> => {
    const response = new ResponseData<String>;
    var queryModifyData: any;

    const queryData = await prisma.workshift.findFirst({
      where: {
        shiftId: shiftId,
        deleted: false,
      }
    })
    if (queryData) {
      queryModifyData = await prisma.workshift.update({
        where: {
          shiftId: shiftId
        },
        data: {
          deleted: true,
          deletedAt: new Date(new Date().toISOString()),
        }
      })
      if (queryModifyData) {
        response.result = "Delete workshift successfully";
      }
    } else {
      response.message = "Shift isn't exist, please try again";
    }

    return response;
  }
}