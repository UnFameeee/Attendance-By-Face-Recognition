import moment from "moment";
import { ResponseData } from "../config/responseData.config";
import { prisma } from "../database/prisma.singleton";
import { AutoCreateWorkshiftDTO, DateTimeDTO, ModifyWorkshiftDTO } from "../model/dtos/workshift.dto";
import { Helper } from "../utils/helper";
import { WorkshiftModel } from "../model/view-model/workshift.model";

export class WorkshiftService {
  public getWorkshiftOfDepartment = async (departmentId: string, data: DateTimeDTO): Promise<ResponseData<WorkshiftModel[]>> => {
    const response = new ResponseData<WorkshiftModel[]>;
    var daysInPreviousmonth;
    var daysInNextmonth;

    //Get last 7 days of the previous month and first 7 days of the next month 
    daysInPreviousmonth = moment(`${data.year}-${data.month.previousMonth}-01`, "YYYY-MM-DD").daysInMonth();
    daysInNextmonth = moment(`${data.year}-${data.month.nextMonth}-01`, "YYYY-MM-DD").daysInMonth();

    //12 1 2
    if (data.month.previousMonth == 12) {
      daysInPreviousmonth = moment(`${data.year - 1}-${data.month.previousMonth}-01`, "YYYY-MM-DD").daysInMonth();
    }
    //11 12 1
    if (data.month.nextMonth == 1) {
      daysInNextmonth = moment(`${data.year + 1}-${data.month.nextMonth}-01`, "YYYY-MM-DD").daysInMonth();
    }

    const startDate = Helper.ConfigStaticDateTime("00:00", `${data.year}-${data.month.previousMonth}-${daysInPreviousmonth - 7}`)
    const endDate = Helper.ConfigStaticDateTime("00:00", `${data.year}-${data.month.nextMonth}-${daysInNextmonth - 24}`)

    const queryData = await prisma.workshift.findMany({
      where: {
        deleted: false,
        employee: {
          department: {
            departmentId: departmentId,
          }
        },
        shiftDate: {
          gte: startDate,
          lte: endDate,
        }
      },
      select: {
        shiftId: true,
        employee: {
          select: {
            id: true,
            fullname: true,
          }
        },
        absent: true,
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
        employeeId: "asc",
      },
    })

    response.result = queryData;
    return response;
  }

  public getWorkshiftOfEmployee = async (employeeId: string, data: DateTimeDTO): Promise<ResponseData<WorkshiftModel[]>> => {
    const response = new ResponseData<WorkshiftModel[]>;
    var daysInPreviousmonth;
    var daysInNextmonth;

    //Get last 7 days of the previous month and first 7 days of the next month 
    daysInPreviousmonth = moment(`${data.year}-${data.month.previousMonth}-01`, "YYYY-MM-DD").daysInMonth();
    daysInNextmonth = moment(`${data.year}-${data.month.nextMonth}-01`, "YYYY-MM-DD").daysInMonth();

    //12 1 2
    if (data.month.previousMonth == 12) {
      daysInPreviousmonth = moment(`${data.year - 1}-${data.month.previousMonth}-01`, "YYYY-MM-DD").daysInMonth();
    }
    //11 12 1
    if (data.month.nextMonth == 1) {
      daysInNextmonth = moment(`${data.year + 1}-${data.month.nextMonth}-01`, "YYYY-MM-DD").daysInMonth();
    }

    const startDate = Helper.ConfigStaticDateTime("00:00", `${data.year}-${data.month.previousMonth}-${daysInPreviousmonth - 7}`)
    const endDate = Helper.ConfigStaticDateTime("00:00", `${data.year}-${data.month.nextMonth}-${daysInNextmonth - 24}`)

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
        absent: true,
        employee: {
          select: {
            id: true,
            fullname: true,
          }
        },
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

    // console.log(queryData[0].shiftDate.toString())
    // console.log(moment(queryData[0].shiftDate, "YYYY-MM-DD").format("YYYY-MM-DD"));

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
    const modifyDate = Helper.ConfigStaticDateTime("00:00", data.shiftDate)

    //create
    if (!data.shiftId) {
      //Nếu nhân viên đã có ca trong cùng ngày -> hủy
      const queryData = await prisma.workshift.findFirst({
        where: {
          employeeId: data.employeeId,
          shiftDate: modifyDate,
        }
      })

      if (queryData) {
        response.message = "This employee already had workshift for this day";
        return response;
      }

      const queryModifyData = await prisma.workshift.create({
        data: {
          employeeId: data.employeeId,
          shiftTypeId: data.shiftTypeId,
          shiftDate: modifyDate,
        }
      })
      if (queryModifyData) {
        response.result = "Create workshift successfully";
        return response;
      }
    }
    //update
    else {
      const queryWorkshiftData = await prisma.workshift.findFirst({
        where: {
          shiftId: data.shiftId,
          deleted: false,
        }
      })

      if (queryWorkshiftData.employeeId != data.employeeId) {
        //Nếu đổi ca cho một nhân viên khác có ca trong cùng ngày -> hủy
        const queryData = await prisma.workshift.findFirst({
          where: {
            employeeId: data.employeeId,
            shiftDate: modifyDate,
            deleted: false,
          }
        })

        if (queryData) {
          response.message = "The employee that you moved the shift for, has their own workshift for today";
          return response;
        }
      }

      const queryModifyData = await prisma.workshift.update({
        data: {
          employeeId: data.employeeId,
          shiftTypeId: data.shiftTypeId,
          shiftDate: modifyDate,
        },
        where: {
          shiftId: data.shiftId
        }
      })
      if (queryModifyData) {
        response.result = "Update workshift successfully";
        return response;
      }
    }
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