import moment from "moment";
import { ResponseData } from "../config/responseData.config";
import { DateTimeV2DTO } from "../model/dtos/workshift.dto";
import { Helper } from "../utils/helper";
import { prisma } from "../database/prisma.singleton";
import { LeaveRequestModel } from "../model/view-model/leaverequest.model";
import { CreateLeaveRequestDTO } from "../model/dtos/leave-request.dto";
import { leaveRequestStatus } from "../constant/leave-request.constant";

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
        status: true,
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

  public getLeaveRequestOfEmployee = async (employeeId: string, data: DateTimeV2DTO): Promise<ResponseData<LeaveRequestModel[]>> => {
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
        status: true,
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

  public createLeaveRequest = async (employeeId: string, data: CreateLeaveRequestDTO): Promise<ResponseData<String>> => {
    const response = new ResponseData<String>;
    const startDate = Helper.ConfigStaticDateTime("00:00", data.startDate)
    const endDate = Helper.ConfigStaticDateTime("00:00", data.endDate)

    //Nếu nhân viên đã có lịch nghỉ phép trong cùng ngày -> hủy
    const queryData = await prisma.leaveRequest.findFirst({
      where: {
        employeeId: employeeId,
        startDate: {
          gte: startDate,
        },
        endDate: {
          lte: endDate,
        }
      },
    })

    if (queryData) {
      response.message = "This employee already had requested a leave for one of these days";
      return response;
    }

    const queryValidateAnnualLeaveData = await prisma.leaveType.findFirst({
      where: {
        leaveTypeId: data.leaveTypeId,
        deleted: false,
      }
    })

    //Nếu tạo lịch nghỉ bằng Annual Leave
    if (queryValidateAnnualLeaveData.annualLeave == true) {
      const dateYear = new Date(startDate).getFullYear();
      const startYearDate = new Date(`${dateYear}-01-01`);
      const endYearDate = new Date(`${dateYear}-12-31`);
      const queryCountAnnualLeaveData = await prisma.leaveRequest.count({
        where: {
          startDate: {
            gte: startYearDate
          },
          endDate: {
            lte: endYearDate
          },
          leaveType: {
            annualLeave: true,
          }
        }
      })

      const queryEmployeeAnnualLeave = await prisma.employee.findFirst({
        where: {
          id: employeeId,
          deleted: false,
        },
        select: {
          annualLeaveDays: true,
        }
      })

      if (queryCountAnnualLeaveData >= queryEmployeeAnnualLeave.annualLeaveDays) {
        response.message = "You are out of the Annual Leave Days";
        return response;
      } else {
        if ((Helper.CountDaysFromStartDate(startDate, endDate) + queryCountAnnualLeaveData) > queryEmployeeAnnualLeave.annualLeaveDays) {
          response.message = "You have request more than Annual Leave Days given";
          return response;
        }
      }
    }

    const queryModifyData = await prisma.leaveRequest.create({
      data: {
        employeeId: employeeId,
        leaveTypeId: data.leaveTypeId,
        requestDate: new Date(),
        startDate: startDate,
        endDate: endDate,
        status: leaveRequestStatus.waiting,
        reason: data.reason,
        note: data.note,
      }
    })

    if (queryModifyData) {
      response.result = "Request a leave successfully";
      return response;
    }
  }

  public getAnnualDetail = async (employeeId: string) => {
    const response = new ResponseData<any>;
    const dateYear = new Date().getFullYear();
    const startYearDate = new Date(`${dateYear}-01-01`);
    const endYearDate = new Date(`${dateYear}-12-31`);

    const queryEmployeeAnnualLeave = await prisma.employee.findFirst({
      where: {
        id: employeeId,
        deleted: false,
      },
      select: {
        annualLeaveDays: true,
      }
    })

    const queryCountAnnualLeaveData = await prisma.leaveRequest.count({
      where: {
        startDate: {
          gte: startYearDate
        },
        endDate: {
          lte: endYearDate
        },
        leaveType: {
          annualLeave: true,
        }
      }
    })

    const returnData = {
      totalAnnualLeave: queryEmployeeAnnualLeave.annualLeaveDays,
      annualLeaveUsed: queryCountAnnualLeaveData,
      annualLeaveRemaining: queryEmployeeAnnualLeave.annualLeaveDays - queryCountAnnualLeaveData,
    }

    response.result = returnData;
    return response;
  }

  //verify leave request
  public verifyLeaveRequest = async (leaveRequestId: string, approverId: string, status: string) => {
    const response = new ResponseData<any>;

    const queryData = await prisma.leaveRequest.findFirst({
      where: {
        leaveRequestId: leaveRequestId,
        deleted: false,
      }
    })

    if (!queryData) {
      response.result = "Leave Request isn't exist";
      return response;
    }

    if (new Date(queryData.startDate) <= new Date()) {
      response.message = "This leave request is overdate and cannot be approve or reject";
      return response;
    }

    var statusUpdate: string;
    if (status == "APPROVE") {
      statusUpdate = leaveRequestStatus.approve;
    } else {
      statusUpdate = leaveRequestStatus.reject;
    }

    if (status == "APPROVE") {
      const queryWorkshift = await prisma.workshift.findMany({
        where: {
          employeeId: queryData.employeeId,
          shiftDate: {
            gte: queryData.startDate,
            lte: queryData.endDate,
          }
        }
      })

      var arrayWorkshiftId: string[];
      for (var workshift of queryWorkshift) {
        arrayWorkshiftId.push(workshift.shiftId);
      }

      const queryUpdateWorkshift = await prisma.workshift.updateMany({
        where: {
          shiftId: {
            in: arrayWorkshiftId,
          }
        },
        data: {
          absent: true,
        }
      })

    }

    const queryUpdateLeaveRequest = await prisma.leaveRequest.update({
      where: {
        leaveRequestId: leaveRequestId,
      },
      data: {
        status: statusUpdate,
      }
    })

    response.result = "Update Status successfully";
    return response;
  }

  //delete leave request
  public deleteLeaveRequest = async (leaveRequestId: string) => {
    const response = new ResponseData<any>;
    const queryData = await prisma.leaveRequest.findFirst({
      where: {
        leaveRequestId: leaveRequestId,
        deleted: false,
      }
    })

    if (new Date(queryData.startDate) <= new Date()) {
      response.message = "This leave request is overdate and cannot be deleted";
      return response;
    }

    const queryUpdateData = await prisma.leaveRequest.update({
      where: {
        leaveRequestId: leaveRequestId,
      },
      data: {
        deleted: true,
      }
    })

    if (!queryUpdateData) {
      response.message = "System Error";
      return response;
    }
    response.result = "Delete Leave Request successfully";
    return response;
  }
}