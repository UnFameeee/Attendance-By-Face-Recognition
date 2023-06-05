import moment from "moment";
import { ResponseData } from "../config/responseData.config";
import { DateTimeV2DTO } from "../model/dtos/workshift.dto";
import { Helper } from "../utils/helper";
import { prisma } from "../database/prisma.singleton";
import { LeaveRequestModel } from "../model/view-model/leaverequest.model";
import { CreateLeaveRequestDTO } from "../model/dtos/leave-request.dto";
import { leaveRequestStatus } from "../constant/leave-request.constant";
import { Page, Paging, paginate } from "../config/paginate.config";
import { Employee } from "@prisma/client";
import { ROLE } from "../constant/database.constant";
import { timezoneConfig } from "../constant/moment-timezone.constant";

export class LeaveRequestService {
  public getLeaveRequestOfDepartment = async (employee: Employee, departmentId: string, page: Page): Promise<ResponseData<Paging<LeaveRequestModel[]>>> => {
    const response = new ResponseData<Paging<LeaveRequestModel[]>>;
    const pageResponse = new Paging<LeaveRequestModel[]>
    const data: DateTimeV2DTO = page.extendData;

    var startDate;
    var endDate;
    // if (data.month == 1) {
    //   startDate = Helper.ConfigStaticDateTime("00:00", `${data.year - 1}-${data.month}-${12}`)
    //   endDate = Helper.ConfigStaticDateTime("00:00", `${data.year}-${data.month + 1}-${12}`)
    // } else if (data.month == 12) {
    //   startDate = Helper.ConfigStaticDateTime("00:00", `${data.year}-${data.month - 1}-${12}`)
    //   endDate = Helper.ConfigStaticDateTime("00:00", `${data.year + 1}-${1}-${12}`)
    // } else {
    //   startDate = Helper.ConfigStaticDateTime("00:00", `${data.year}-${data.month - 1}-${12}`)
    //   endDate = Helper.ConfigStaticDateTime("00:00", `${data.year}-${data.month + 1}-${12}`)
    // }
    if (data.month == 1) {
      startDate = moment.utc(`${data.year - 1}-${data.month}-${12}`, "YYYY-MM-DD")
      endDate = moment.utc(`${data.year}-${data.month + 1}-${12}`, "YYYY-MM-DD")
    } else if (data.month == 12) {
      startDate = moment.utc(`${data.year}-${data.month - 1}-${12}`, "YYYY-MM-DD")
      endDate = moment.utc(`${data.year + 1}-${1}-${12}`, "YYYY-MM-DD");
    } else {
      startDate = moment.utc(`${data.year}-${data.month - 1}-${12}`, "YYYY-MM-DD");
      endDate = moment.utc(`${data.year}-${data.month + 1}-${12}`, "YYYY-MM-DD")
    }

    if (data.filter) {
      var dateFilter = moment.utc(data.filter, "YYYY-MM-DD")
    }

    const queryRoleData = await prisma.role.findFirst({
      where: {
        roleId: employee.roleId,
        deleted: false,
      }
    })

    var queryData;
    var totalElement;

    if (queryRoleData.roleName == ROLE.ADMIN) {
      var whereData: any;
      if (data.filter) {
        whereData = {
          employee: {
            departmentId: departmentId,
            deleted: false,
          },
          deleted: false,
          startDate: {
            gte: dateFilter.startOf('day').toDate(),
            lte: dateFilter.endOf('day').toDate(),
          },
          endDate: {
            lte: endDate.endOf('day').toDate(),
          }
        }
      } else {
        whereData = {
          employee: {
            departmentId: departmentId,
            deleted: false,
          },
          deleted: false,
          startDate: {
            gte: startDate.startOf('day').toDate(),
          },
          endDate: {
            lte: endDate.endOf('day').toDate(),
          }
        }
      }

      queryData = await prisma.leaveRequest.findMany({
        where: whereData,
        select: {
          leaveRequestId: true,
          employee: {
            select: {
              id: true,
              fullname: true,
              email: true,
              department: {
                select: {
                  departmentName: true,
                }
              }
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
              description: true,
            }
          }
        },
        orderBy: {
          requestDate: "desc",
        },
        ...paginate(page)
      })

      totalElement = await prisma.leaveRequest.count({
        where: whereData,
      })
    } else if (queryRoleData.roleName == ROLE.MANAGER) {
      var whereData: any;
      if (data.filter) {
        whereData = {
          deleted: false,
          employee: {
            department: {
              departmentId: departmentId,
            },
            id: {
              not: employee.id
            },
            deleted: false,
          },
          startDate: {
            gte: dateFilter.startOf('day').toDate(),
            lte: dateFilter.endOf('day').toDate(),
          },
          endDate: {
            lte: endDate.endOf('day').toDate(),
          }
        }
      } else {
        whereData = {
          deleted: false,
          employee: {
            department: {
              departmentId: departmentId,
            },
            id: {
              not: employee.id
            },
            deleted: false,
          },
          startDate: {
            gte: startDate.startOf('day').toDate(),
          },
          endDate: {
            lte: endDate.endOf('day').toDate(),
          }
        }
      }

      queryData = await prisma.leaveRequest.findMany({
        where: whereData,
        select: {
          leaveRequestId: true,
          employee: {
            select: {
              id: true,
              fullname: true,
              email: true,
              department: {
                select: {
                  departmentName: true,
                }
              }
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
              description: true,
            }
          }
        },
        orderBy: {
          requestDate: "desc",
        },
        ...paginate(page)
      })

      totalElement = await prisma.leaveRequest.count({
        where: whereData,
      })
    }

    pageResponse.data = queryData;
    pageResponse.page = page;
    pageResponse.page.totalElement = totalElement;
    response.result = pageResponse;
    return response;
  }

  public getLeaveRequestOfEmployee = async (employeeId: string, page: Page): Promise<ResponseData<Paging<LeaveRequestModel[]>>> => {
    const response = new ResponseData<Paging<LeaveRequestModel[]>>;
    const pageResponse = new Paging<LeaveRequestModel[]>
    const data: DateTimeV2DTO = page.extendData;

    var startDate;
    var endDate;

    if (data.month == 1) {
      startDate = moment.utc(`${data.year - 1}-${data.month}-${12}`, "YYYY-MM-DD")
      endDate = moment.utc(`${data.year}-${data.month + 1}-${12}`, "YYYY-MM-DD")
    } else if (data.month == 12) {
      startDate = moment.utc(`${data.year}-${data.month - 1}-${12}`, "YYYY-MM-DD")
      endDate = moment.utc(`${data.year + 1}-${1}-${12}`, "YYYY-MM-DD");
    } else {
      startDate = moment.utc(`${data.year}-${data.month - 1}-${12}`, "YYYY-MM-DD");
      endDate = moment.utc(`${data.year}-${data.month + 1}-${12}`, "YYYY-MM-DD")
    }

    if (data.filter) {
      var dateFilter = moment.utc(data.filter, "YYYY-MM-DD");
    }

    var whereData: any;
    if (data.filter) {
      whereData = {
        deleted: false,
        employeeId: employeeId,
        startDate: {
          gte: dateFilter.startOf('day').toDate(),
          lte: dateFilter.endOf('day').toDate(),
        },
        endDate: {
          lte: endDate.endOf('day').toDate(),
        }
      }
    } else {
      whereData = {
        deleted: false,
        employeeId: employeeId,
        startDate: {
          gte: startDate.startOf('day').toDate(),
        },
        endDate: {
          lte: endDate.endOf('day').toDate(),
        }
      }
    }

    const queryData = await prisma.leaveRequest.findMany({
      where: whereData,
      select: {
        leaveRequestId: true,
        employee: {
          select: {
            id: true,
            fullname: true,
            email: true,
            department: {
              select: {
                departmentName: true,
              }
            }
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
        requestDate: "desc",
      },
      ...paginate(page)
    })

    const totalElement = await prisma.leaveRequest.count({
      where: {
        deleted: false,
        employeeId: employeeId,
        startDate: {
          gte: startDate.startOf('day').toDate(),
        },
        endDate: {
          lte: endDate.endOf('day').toDate(),
        }
      },
    })

    pageResponse.data = queryData;
    pageResponse.page = page;
    pageResponse.page.totalElement = totalElement;
    response.result = pageResponse;
    return response;
  }

  public createLeaveRequest = async (employeeId: string, data: CreateLeaveRequestDTO): Promise<ResponseData<String>> => {
    const response = new ResponseData<String>;
    const momentNow = moment(new Date()).tz(timezoneConfig);
    const startDate = Helper.ConfigStaticDateTime("00:00", data.startDate)
    const endDate = Helper.ConfigStaticDateTime("00:00", data.endDate)

    console.log(data.startDate)
    console.log(data.endDate)

    // const startDate = moment.utc(data.startDate, "YYYY-MM-DD").toDate();
    // const endDate = moment.utc(data.endDate, "YYYY-MM-DD").toDate();

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
      const startYearDate = Helper.ConfigStaticDateTime("00:00", `${dateYear}-01-01`);
      const endYearDate = Helper.ConfigStaticDateTime("00:00", `${dateYear}-12-31`);

      const queryAnnualLeaveData = await prisma.leaveRequest.findMany({
        where: {
          employeeId: employeeId,
          status: leaveRequestStatus.approve,
          startDate: {
            gte: startYearDate
          },
          endDate: {
            lte: endYearDate
          },
          leaveType: {
            annualLeave: true,
          },
          deleted: false,
        }
      })

      var countAnnualLeaves: number = 0;
      for (var x of queryAnnualLeaveData) {
        const startDate = new Date(x.startDate).toISOString().split("T")[0];
        const endDate = new Date(x.endDate).toISOString().split("T")[0];
        countAnnualLeaves += Helper.CountDaysFromStartDate(startDate, endDate);
      }

      const queryEmployeeAnnualLeave = await prisma.employee.findFirst({
        where: {
          id: employeeId,
          deleted: false,
        },
        select: {
          annualLeaveDays: true,
        }
      })

      if (countAnnualLeaves >= queryEmployeeAnnualLeave.annualLeaveDays) {
        response.message = "You are out of the Annual Leave Days";
        return response;
      } else {
        if ((Helper.CountDaysFromStartDate(data.startDate, data.endDate) + countAnnualLeaves) > queryEmployeeAnnualLeave.annualLeaveDays) {
          response.message = "You have request more than Annual Leave Days given";
          return response;
        }
      }
    }

    const queryModifyData = await prisma.leaveRequest.create({
      data: {
        employeeId: employeeId,
        leaveTypeId: data.leaveTypeId,
        requestDate: Helper.ConfigStaticDateTime(momentNow.format("HH:mm"), momentNow.format("YYYY-MM-DD")),
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
    const startYearDate = Helper.ConfigStaticDateTime("00:00", `${dateYear}-01-01`);
    const endYearDate = Helper.ConfigStaticDateTime("23:59", `${dateYear}-12-31`);

    const queryEmployeeAnnualLeave = await prisma.employee.findFirst({
      where: {
        id: employeeId,
        deleted: false,
      },
      select: {
        annualLeaveDays: true,
      }
    })

    const queryAnnualLeaveData = await prisma.leaveRequest.findMany({
      where: {
        employeeId: employeeId,
        status: leaveRequestStatus.approve,
        startDate: {
          gte: startYearDate
        },
        endDate: {
          lte: endYearDate
        },
        leaveType: {
          annualLeave: true,
        },
        deleted: false,
      }
    })

    var countAnnualLeaves: number = 0;
    for (var i = 0, length = queryAnnualLeaveData.length; i < length; ++i) {
      const startDate = new Date(queryAnnualLeaveData[i].startDate).toISOString().split("T")[0];
      const endDate = new Date(queryAnnualLeaveData[i].endDate).toISOString().split("T")[0];
      console.log(`startDate: ${startDate}, endDate: ${endDate}`);
      countAnnualLeaves += Helper.CountDaysFromStartDate(startDate, endDate);
    }

    const returnData = {
      totalAnnualLeave: queryEmployeeAnnualLeave.annualLeaveDays,
      annualLeaveUsed: countAnnualLeaves,
      annualLeaveRemaining: queryEmployeeAnnualLeave.annualLeaveDays - countAnnualLeaves,
    }

    response.result = returnData;
    return response;
  }

  //verify leave request
  public verifyLeaveRequest = async (leaveRequestId: string, approverId: string, status: string) => {
    const response = new ResponseData<any>;
    var statusUpdate: string;
    if (status == "APPROVE") {
      statusUpdate = leaveRequestStatus.approve;
    } else if (status == "REJECT") {
      statusUpdate = leaveRequestStatus.reject;
    } else if (status == "OVERDATE") {
      statusUpdate = leaveRequestStatus.overdate;
    }

    const queryData = await prisma.leaveRequest.findFirst({
      where: {
        leaveRequestId: leaveRequestId,
        deleted: false,
      },
      select: {
        leaveRequestId: true,
        employeeId: true,
        approverId: true,
        leaveType: {
          select: {
            annualLeave: true,
          }
        },
        requestDate: true,
        startDate: true,
        endDate: true,
        status: true,
        reason: true,
        note: true,
      }
    })

    if (!queryData) {
      response.result = "Leave Request isn't exist";
      return response;
    }

    //if it is over date
    if (new Date(queryData.startDate) <= new Date() && statusUpdate == leaveRequestStatus.overdate) {
      const queryUpdateLeaveRequest = await prisma.leaveRequest.update({
        where: {
          leaveRequestId: leaveRequestId,
        },
        data: {
          approverId: approverId,
          status: statusUpdate,
        }
      })

      response.result = "This leave request is OVERDATE";
      return response;
      // response.message = "This leave request is overdate and cannot be approve or reject";
      // return response;
    }

    if (queryData.status != leaveRequestStatus.waiting) {
      response.message = `This leave request is already ${queryData.status}`;
      return response;
    }

    if (status == "APPROVE") {
      //Tìm trong dãy ngày, nếu đã có lịch làm thì gán status, nếu chưa thì tạo mới với null shiftDate và gán status
      const leaveRequestDateStart = new Date(queryData.startDate).getDate();
      const leaveRequestDateEnd = new Date(queryData.endDate).getDate();

      const leaveRequestMonthStart = new Date(queryData.startDate).getMonth() + 1;
      const leaveRequestMonthEnd = new Date(queryData.endDate).getMonth() + 1;

      const leaveRequestYear = new Date(queryData.startDate).getFullYear();

      //Kiểm tra xem nhân vi
      const queryCheckIsAbsentData = await prisma.attendance.findMany({
        where: {
          employeeId: queryData.employeeId,
          attendanceDate: {
            gte: Helper.ConfigStaticDateTime("00:00", `${leaveRequestYear}-${leaveRequestMonthStart}-${leaveRequestDateStart}`),
            lte: Helper.ConfigStaticDateTime("23:59", `${leaveRequestYear}-${leaveRequestMonthEnd}-${leaveRequestDateEnd}`),
          },
          absent: true,
          isValid: true,
        },
        select:{
          attendanceId: true,
        }
      })
  
      console.log(queryCheckIsAbsentData)

      if (queryCheckIsAbsentData.length != 0) {
        response.message = "This employee already had requested a leave for one of these days, please reject this leave request";
        return response;
      }


      //Nếu trong cùng 1 tháng
      if (leaveRequestMonthStart == leaveRequestMonthEnd) {
        for (let i = leaveRequestDateStart; i <= leaveRequestDateEnd; ++i) {
          // Get the date in ISO 8601 format (e.g. "2023-04-01")
          const dateStart = Helper.ConfigStaticDateTime("00:00", `${leaveRequestYear}-${leaveRequestMonthStart}-${i}`)
          const dateEnd = Helper.ConfigStaticDateTime("23:59", `${leaveRequestYear}-${leaveRequestMonthEnd}-${i}`)
          // const date = moment.utc(`${leaveRequestYear}-${leaveRequestMonthStart}-${i}`, "YYYY-MM-DD")

          const queryWorkshiftData = await prisma.workshift.findFirst({
            where: {
              employeeId: queryData.employeeId,
              shiftDate: {
                gte: dateStart,
                lte: dateEnd,
              },
              deleted: false,
            }
          })

          //Tạo bên workshift
          if (!queryWorkshiftData) {
            await prisma.workshift.create({
              data: {
                employeeId: queryData.employeeId,
                shiftDate: dateStart,
                absent: true,
              }
            })
          } else {
            await prisma.workshift.update({
              data: {
                employeeId: queryData.employeeId,
                shiftDate: dateStart,
                absent: true,
              },
              where: {
                shiftId: queryWorkshiftData.shiftId,
              }
            })
          }

          // Nếu là nghỉ có phép
          var totalHours;
          if (queryData.leaveType.annualLeave == true) {
            totalHours = Helper.ConfigStaticDateTime("08:00");
          } else {
            totalHours = Helper.ConfigStaticDateTime("00:00");
          }

          //Tạo Attendance với totalHours = 08:00
          const queryCreateAttendance = await prisma.attendance.create({
            data: {
              employeeId: queryData.employeeId,
              attendanceDate: dateStart,
              checkIn: dateStart,
              checkOut: dateStart,
              lateArrival: Helper.ConfigStaticDateTime("00:00"),
              earlyLeave: Helper.ConfigStaticDateTime("00:00"),
              totalHours: totalHours,
              absent: true,
              note: queryData.note,
            }
          })

        }
      } else {
        const dateInMonth = moment.utc(`${leaveRequestYear + 1}-${leaveRequestMonthStart}-01`, "YYYY-MM-DD").daysInMonth();
        for (let i = leaveRequestDateStart; i <= dateInMonth; ++i) {
          // Get the date in ISO 8601 format (e.g. "2023-04-01")

          const dateStart = Helper.ConfigStaticDateTime("00:00", `${leaveRequestYear}-${leaveRequestMonthStart}-${i}`)
          const dateEnd = Helper.ConfigStaticDateTime("23:59", `${leaveRequestYear}-${leaveRequestMonthStart}-${i}`)

          const queryWorkshiftData = await prisma.workshift.findFirst({
            where: {
              employeeId: queryData.employeeId,
              shiftDate: {
                gte: dateStart,
                lte: dateEnd,
              },
              deleted: false,
            }
          })

          if (!queryWorkshiftData) {
            await prisma.workshift.create({
              data: {
                employeeId: queryData.employeeId,
                shiftDate: dateStart,
                absent: true,
              }
            })
          } else {
            await prisma.workshift.update({
              data: {
                employeeId: queryData.employeeId,
                shiftDate: dateStart,
                absent: true,
              },
              where: {
                shiftId: queryWorkshiftData.shiftId,
              }
            })
          }

          // Nếu là nghỉ có phép
          var totalHours;
          if (queryData.leaveType.annualLeave == true) {
            totalHours = Helper.ConfigStaticDateTime("08:00");
          } else {
            totalHours = Helper.ConfigStaticDateTime("00:00");
          }

          //Tạo Attendance với totalHours = 08:00
          const queryCreateAttendance = await prisma.attendance.create({
            data: {
              employeeId: queryData.employeeId,
              attendanceDate: dateStart,
              checkIn: dateStart,
              checkOut: dateStart,
              lateArrival: Helper.ConfigStaticDateTime("00:00"),
              earlyLeave: Helper.ConfigStaticDateTime("00:00"),
              totalHours: totalHours,
              absent: true,
              note: queryData.note,
            }
          })
        }
        for (let i = 1; i <= leaveRequestDateEnd; ++i) {
          // Get the date in ISO 8601 format (e.g. "2023-04-01")
          // const date = moment.utc(`${leaveRequestYear}-${leaveRequestMonthEnd}-${i}`, "YYYY-MM-DD");

          const dateStart = Helper.ConfigStaticDateTime("00:00", `${leaveRequestYear}-${leaveRequestMonthEnd}-${i}`)
          const dateEnd = Helper.ConfigStaticDateTime("23:59", `${leaveRequestYear}-${leaveRequestMonthEnd}-${i}`)


          const queryWorkshiftData = await prisma.workshift.findFirst({
            where: {
              employeeId: queryData.employeeId,
              shiftDate: {
                gte: dateStart,
                lte: dateEnd,
              },
              deleted: false,
            }
          })

          if (!queryWorkshiftData) {
            await prisma.workshift.create({
              data: {
                employeeId: queryData.employeeId,
                shiftDate: dateStart,
                absent: true,
              }
            })
          } else {
            await prisma.workshift.update({
              data: {
                employeeId: queryData.employeeId,
                shiftDate: dateStart,
                absent: true,
              },
              where: {
                shiftId: queryWorkshiftData.shiftId,
              }
            })
          }

          // Nếu là nghỉ có phép
          var totalHours;
          if (queryData.leaveType.annualLeave == true) {
            totalHours = Helper.ConfigStaticDateTime("08:00");
          } else {
            totalHours = Helper.ConfigStaticDateTime("00:00");
          }

          //Tạo Attendance với totalHours = 08:00
          const queryCreateAttendance = await prisma.attendance.create({
            data: {
              employeeId: queryData.employeeId,
              attendanceDate: dateStart,
              checkIn: dateStart,
              checkOut: dateStart,
              lateArrival: Helper.ConfigStaticDateTime("00:00"),
              earlyLeave: Helper.ConfigStaticDateTime("00:00"),
              totalHours: totalHours,
              absent: true,
              note: queryData.note,
            }
          })
        }
      }
    }

    const queryUpdateLeaveRequest = await prisma.leaveRequest.update({
      where: {
        leaveRequestId: leaveRequestId,
      },
      data: {
        approverId: approverId,
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