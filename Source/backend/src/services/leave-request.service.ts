import moment from "moment";
import { ResponseData } from "../config/responseData.config";
import { DateTimeV2DTO } from "../model/dtos/workshift.dto";
import { Helper } from "../utils/helper";
import { prisma } from "../database/prisma.singleton";
import { LeaveRequestModel } from "../model/view-model/leaverequest.model";

export class LeaveRequestService {
  public getLeaveRequestOfDepartment = async (departmentId: string, data: DateTimeV2DTO): Promise<ResponseData<LeaveRequestModel[]>> => {
    const response = new ResponseData<LeaveRequestModel[]>;

    const daysInMonth = moment(`${data.year}-${data.month}-01`, "YYYY-MM-DD").daysInMonth();

    const startDate = Helper.ConfigStaticDateTime("00:00", `${data.year}-${data.month}-${1}`)
    const endDate = Helper.ConfigStaticDateTime("00:00", `${data.year}-${data.month}-${daysInMonth}`)

    const queryData = await prisma.leaveRequest.findMany({
      where: {
        deleted: false,
        employee: {
          department: {
            departmentId: departmentId,
          }
        },
        startDate: {
          gte: startDate,
        },
        endDate: {
          lte: endDate,
        }
      },
      select: {
        leaveRequestId: true,
        employee: {
          select: {
            id: true,
            fullname: true,
          }
        },
        leaveTypeId: true,
        requestDate: true,
        isApproved: true,
        approver: {
          select: {
            fullname: true,
          }
        },
        reason: true,
        note: true,
        startDate: true,
        endDate: true,
        leaveType: {
          select: {
            name: true,
          }
        }
      },
      orderBy: {
        requestDate: "asc",
      },
    })

    response.result = queryData;
    return response;
  }

  public getWorkshiftOfEmployee = async (employeeId: string, data: DateTimeV2DTO): Promise<ResponseData<LeaveRequestModel[]>> => {
    const response = new ResponseData<LeaveRequestModel[]>;

    const daysInMonth = moment(`${data.year}-${data.month}-01`, "YYYY-MM-DD").daysInMonth();

    const startDate = Helper.ConfigStaticDateTime("00:00", `${data.year}-${data.month}-${1}`)
    const endDate = Helper.ConfigStaticDateTime("00:00", `${data.year}-${data.month}-${daysInMonth}`)

    const queryData = await prisma.leaveRequest.findMany({
      where: {
        deleted: false,
        employeeId: employeeId,
        startDate: {
          gte: startDate,
        },
        endDate: {
          lte: endDate,
        }
      },
      select: {
        leaveRequestId: true,
        employee: {
          select: {
            id: true,
            fullname: true,
          }
        },
        leaveTypeId: true,
        requestDate: true,
        isApproved: true,
        approver: {
          select: {
            fullname: true,
          }
        },
        reason: true,
        note: true,
        startDate: true,
        endDate: true,
        leaveType: {
          select: {
            name: true,
          }
        }
      },
      orderBy: {
        requestDate: "asc",
      },
    })

    response.result = queryData;
    return response;
  }

  //Đếm ngày nghỉ còn lại - Tổng ngày nghỉ
  //
}