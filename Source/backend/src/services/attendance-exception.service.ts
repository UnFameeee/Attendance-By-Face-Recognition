import moment from "moment";
import { env } from "../config/env.config";
import { Page, Paging } from "../config/paginate.config";
import { ResponseData } from "../config/responseData.config"
import { attendance, attendanceExceptionStatus } from "../constant/attendance-exception.constant";
import { ROLE } from "../constant/database.constant";
import { prisma } from "../database/prisma.singleton";
import { GetAttendanceExceptionDataDTO, SubmitAttendanceExceptionDTO } from "../model/dtos/attendance-exception.dto";
import { Helper } from "../utils/helper";
import { timezoneConfig } from "../constant/moment-timezone.constant";

export class AttendanceExceptionService {
  public submitAttendanceException = async (data: SubmitAttendanceExceptionDTO) => {
    const response = new ResponseData<string>();
    //Validate Email - if the email wasn't right, go to the image and remove it.
    const validateEmail = await prisma.employee.findFirst({
      where: {
        email: data.email,
        deleted: false,
      }
    })
    if (!validateEmail) {
      //delete the image
      response.message = "Email isn't exist, please check again!";
      return response;
    }

    let attendanceType: string;
    if (data.attendanceType == "CHECKIN") {
      attendanceType = attendance.checkin;
    } else if (data.attendanceType == "CHECKOUT") {
      attendanceType = attendance.checkout;
    }

    const momentNow = moment(new Date()).tz(timezoneConfig);

    const queryData = await prisma.attendanceException.create({
      data: {
        name: data.name,
        departmentId: data.departmentId,
        email: data.email,
        image: data.image,
        attendanceType: attendanceType,
        datetime: Helper.ConfigStaticDateTime(momentNow.format("HH:mm"), momentNow.format("YYYY-MM-DD")),
        status: attendanceExceptionStatus.waiting,
      }
    })
    if (!queryData) {
      response.message = "Server Error";
      return response;
    }
    response.result = "Attendance submits successfully!";
    return response;
  }


  public saveImage = async (email: string, files: { [fieldname: string]: Express.Multer.File[] }) => {
    const response = new ResponseData<any>;
    let link = `${env.SERVER_URL}/public${(files.images[0].destination).split("public")[1]}/${files.images[0].filename}`

    const queryValidateData = await prisma.employee.findFirst({
      where: {
        email: email,
        deleted: false,
      }
    })

    if (!queryValidateData) {
      response.message = "The email isn't exist";
      return response;
    }

    response.result = Helper.ConvertDoubleSlashURL(link);
    return response;
  }

  public saveAnonymousImage = async (files: { [fieldname: string]: Express.Multer.File[] }) => {
    const response = new ResponseData<string>;
    let link = `${env.SERVER_URL}/public${(files.images[0].destination).split("public")[1]}/${files.images[0].filename}`

    response.result = Helper.ConvertDoubleSlashURL(link);
    return response;
  }

  public getListAttendanceException = async (page: Page): Promise<ResponseData<Paging<any[]>>> => {
    //Chia theo checkin / checkout
    //Chia theo role, nếu role là manager thì coi dc trong phòng ban của mình, admin thì coi được tất cả
    //Filter theo ngày/tháng/năm trên param
    //ApproverId -> Approver Name

    const response = new ResponseData<Paging<any[]>>;
    const pageResponse = new Paging<any[]>
    const data: GetAttendanceExceptionDataDTO = page.extendData;

    let attendanceType: string;
    if (data.attendanceType == "CHECKIN") {
      attendanceType = attendance.checkin;
    } else if (data.attendanceType == "CHECKOUT") {
      attendanceType = attendance.checkout;
    }

    let queryData: any;
    let totalElement: number;
    const now = new Date(data.filter);
    const dateFilter = moment.utc(`${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`, "YYYY-MM-DD")
    //Nếu Role là Admin -> lấy hết data
    if (data.roleName == ROLE.ADMIN) {
      var whereQuery;

      if (data.filter) {
        whereQuery = {
          datetime: {
            gte: dateFilter.startOf('day').toDate(),
            lte: dateFilter.endOf('day').toDate(),
          },
          attendanceType: attendanceType,
          departmentId: data.departmentId,
        }
      } else {
        whereQuery = {
          attendanceType: attendanceType,
          departmentId: data.departmentId,
        }
      }

      queryData = await prisma.attendanceException.findMany({
        where: whereQuery,
        select: {
          attendanceExceptionId: true,
          name: true,
          department: {
            select: {
              departmentName: true,
            }
          },
          datetime: true,
          approver: {
            select: {
              fullname: true,
            }
          },
          status: true,
        },
        orderBy: {
          datetime: "desc",
        },
      })

      totalElement = await prisma.attendanceException.count({
        where: whereQuery,
      })

    } else if (data.roleName == ROLE.MANAGER) {
      var whereQuery;
      if (data.filter) {
        whereQuery = {
          datetime: {
            gte: dateFilter.startOf('day').toDate(),
            lte: dateFilter.endOf('day').toDate(),
          },
          attendanceType: attendanceType,
        }
      } else {
        whereQuery = {
          attendanceType: attendanceType,
        }
      }

      queryData = await prisma.attendanceException.findMany({
        where: whereQuery,
        select: {
          attendanceExceptionId: true,
          name: true,
          department: {
            select: {
              departmentName: true,
            }
          },
          datetime: true,
          approver: {
            select: {
              fullname: true,
            }
          },
          status: true,
        },
        orderBy: {
          datetime: "desc",
        },
      })
      totalElement = await prisma.attendanceException.count({
        where: whereQuery,
      })
    }
    pageResponse.data = queryData;
    pageResponse.page = page;
    pageResponse.page.totalElement = totalElement;
    response.result = pageResponse;
    return response;
  }

  public getAttendanceExceptionData = async (attendanceExceptionId: string) => {
    const response = new ResponseData<any>;

    //Lấy data ở cả 2 bên là system và employee nhập vào
    const queryEmployeeData = await prisma.attendanceException.findFirst({
      where: {
        attendanceExceptionId: attendanceExceptionId,
      },
      select: {
        name: true,
        email: true,
        image: true,
        datetime: true,
        attendanceType: true,
        department: {
          select: {
            departmentName: true,
          }
        },
      }
    })

    if (!queryEmployeeData) {
      response.message = "The exception attendance isn't exist";
      return response;
    }

    const querySystemData = await prisma.employee.findFirst({
      where: {
        email: queryEmployeeData.email,
      },
      select: {
        id: true,
        fullname: true,
        email: true,
        image: true,
        department: {
          select: {
            departmentName: true,
          }
        },
        deleted: true,
      }
    })

    const targetDate = moment.utc(`${queryEmployeeData.datetime.getFullYear()}-${queryEmployeeData.datetime.getMonth() + 1}-${queryEmployeeData.datetime.getDate()}`, "YYYY-MM-DD")

    const queryWorkshiftData = await prisma.workshift.findFirst({
      where: {
        employeeId: querySystemData.id,
        shiftDate: {
          gte: targetDate.startOf('day').toDate(),
          lte: targetDate.endOf('day').toDate(),
        },
        deleted: false,
      },
      select: {
        shiftId: true,
        shiftDate: true,
        shiftType: {
          select: {
            startTime: true,
            endTime: true,
          }
        }
      }
    })

    var shiftTime;
    var noWorkingDayFlag: boolean = false;
    if (!queryWorkshiftData) {
      shiftTime = null;
      noWorkingDayFlag = true;
    } else {
      if (queryEmployeeData.attendanceType == attendance.checkin) {
        const time = moment.utc(queryWorkshiftData.shiftType.startTime, "HH:mm").format("HH:mm");
        const date = moment.utc(queryWorkshiftData.shiftDate, "YYYY-MM-DD").format("YYYY-MM-DD");
        shiftTime = Helper.ConfigStaticDateTime(time, date);
      } else if (queryEmployeeData.attendanceType == attendance.checkout) {
        const time = moment.utc(queryWorkshiftData.shiftType.endTime, "HH:mm").format("HH:mm");
        const date = moment.utc(queryWorkshiftData.shiftDate, "YYYY-MM-DD").format("YYYY-MM-DD");
        shiftTime = Helper.ConfigStaticDateTime(time, date);
      }
    }

    const data = {
      employeeData: queryEmployeeData,
      systemData: {
        shiftTime: shiftTime,
        noWorkingDayFlag: noWorkingDayFlag,
        ...querySystemData
      },
    }

    response.result = data;
    return response;
  }

  public verifyAttendanceException = async (employeeId: string, attendanceExceptionId: string, status: string) => {
    const response = new ResponseData<any>;
    //nhận đầu vào là reject hoặc là approve
    //Update approver
    //Update thông tin bên attendance

    var statusUpdate: string;
    if (status == "APPROVE") {
      statusUpdate = attendanceExceptionStatus.approve;
    } else if (status == "REJECT") {
      statusUpdate = attendanceExceptionStatus.reject;
    }

    //Update attendance record
    const queryAttendanceException = await prisma.attendanceException.findFirst({
      where: {
        attendanceExceptionId: attendanceExceptionId,
      }
    })

    if (!queryAttendanceException) {
      response.message = "The attendance exception record isn't exist";
      return response;
    }

    let queryEmployeeAttendanceExceptionData;

    //nếu != reject
    //kiểm tra xem nhân viên bị xóa chưa - rồi thì tbao là đã bị xóa, cần chọn reject
    if (statusUpdate != attendanceExceptionStatus.reject) {
      //Tìm ID của nhân viên theo email
      queryEmployeeAttendanceExceptionData = await prisma.employee.findFirst({
        where: {
          email: queryAttendanceException.email,
          deleted: false,
        },
        select: {
          id: true,
        }
      })

      if (!queryEmployeeAttendanceExceptionData) {
        response.result = "This employee has been deleted, please REJECT this attendance exception.";
        return response;
      }
    }

    const queryAttendanceExceptionData = await prisma.attendanceException.findFirst({
      where: {
        attendanceExceptionId: attendanceExceptionId,
      }
    })

    if (statusUpdate == attendanceExceptionStatus.approve) {
      const dateException = queryAttendanceException.datetime;
      const formatDateException = new Date(dateException).toISOString().split("T")[0];
      const formatTimeException = new Date(dateException).toISOString().split("T")[1].slice(0, 5);
      let threshHoldException = Helper.ConfigStaticDateTime(formatTimeException, formatDateException);

      const modifyDate = moment.utc(`${dateException.getFullYear()}-${dateException.getMonth() + 1}-${dateException.getDate()}`, "YYYY-MM-DD");

      //Kiểm tra lịch làm xem ngày đấy NV có ca làm hay ko
      const workShift = await prisma.workshift.findFirst({
        where: {
          employeeId: queryEmployeeAttendanceExceptionData.id,
          shiftDate: {
            gte: modifyDate.startOf('day').toDate(),
            lte: modifyDate.endOf('day').toDate(),
          },
          deleted: false,
        },
        select: {
          shiftId: true,
          employeeId: true,
          shiftDate: true,
          shiftTypeId: true,
          shiftType: {
            select: {
              shiftName: true,
              startTime: true,
              endTime: true,
            }
          }
        }
      })

      if (!workShift) {
        response.message = "The employee doesn't have workshift for this day";
        return response;
      }

      //Get the shiftDate from workShift - YYYY-MM-DD
      const shiftDate = workShift.shiftDate;
      const date = `${shiftDate.getFullYear()}-${shiftDate.getMonth() + 1}-${shiftDate.getDate()}`;

      //Kiểm tra ngày hôm đó nhân viên có attendance nào được record chưa (NHƯNG MÀ VALID), nếu có thì thông báo cho quản lý check lại.
      const attendanceDateFilter = moment.utc(date, "YYYY-MM-DD");
      const queryCheckAttendanceData = await prisma.attendance.findFirst({
        where: {
          employeeId: queryEmployeeAttendanceExceptionData.id,
          attendanceDate: {
            gte: attendanceDateFilter.startOf('day').toDate(),
            lte: attendanceDateFilter.endOf('day').toDate(),
          },
          checkIn: {
            not: null
          },
          checkOut: {
            not: null
          },
          isValid: true,
          deleted: false,
        }
      })

      if (queryCheckAttendanceData) {
        response.message = "There is an attendance recorded on this day, please check again before verify this attendance exception";
        return response;
      }

      if (queryAttendanceException.attendanceType == attendance.checkin) {
        //Get the time from shiftType - HH:mm
        const startTime = workShift.shiftType.startTime;
        const time = moment.utc(startTime, "HH:mm").format("HH:mm");

        //Convert both of startTime and shiftDate to Date value
        const startShift: Date = Helper.ConfigStaticDateTime(time, date);

        //Check the time different from the checkIn time and the workShift startTime (startTime - checkIn)
        const diff = moment.utc(new Date(startShift.getTime()), "HH:mm").diff(moment(new Date(threshHoldException), "HH:mm"));

        var lateArrival: Date;
        //if the value is negative -> lateArrival
        if (Math.sign(diff) === -1) {
          const duration = moment.duration(Math.abs(diff));
          const formattedTimeDiff = new Date(duration.asMilliseconds()).toISOString().split("T")[1].slice(0, 5);
          lateArrival = Helper.ConfigStaticDateTime(formattedTimeDiff);
        }
        //if the value is positive or equal 0 -> right on time
        else {
          lateArrival = null;
        }

        const queryAttendanceCreateData = await prisma.attendance.create({
          data: {
            employeeId: queryEmployeeAttendanceExceptionData.id,
            attendanceDate: Helper.ConfigStaticDateTime("00:00", `${dateException.getFullYear()}-${dateException.getMonth() + 1}-${dateException.getDate()}`),
            checkIn: threshHoldException,
            checkOut: null,
            checkinCapture: queryAttendanceExceptionData.image,
            lateArrival: lateArrival,
            totalHours: Helper.ConfigStaticDateTime("00:00"),
            absent: false,
            note: "",
          }
        })
      } else if (queryAttendanceException.attendanceType == attendance.checkout) {
        //Get the time from shiftType - HH:mm
        const endTime = workShift.shiftType.endTime;
        const time = moment.utc(endTime, "HH:mm").format("HH:mm");
        //Convert both of startTime and shiftDate to Date value
        const endShift: Date = Helper.ConfigStaticDateTime(time, date);
        //Check the time different from the checkIn time and the workShift startTime (startTime - checkIn)
        const diff = moment.utc(new Date(threshHoldException), "HH:mm").diff(moment.utc(new Date(endShift.getTime()), "HH:mm"));

        var earlyLeave: Date;
        //if the value is positive -> earlyLeave
        if (Math.sign(diff) === 1) {
          earlyLeave = null;
        }
        //if the value is negative or equal 0 -> right on time
        else {
          const duration = moment.duration(Math.abs(diff));
          const formattedTimeDiff = new Date(duration.asMilliseconds()).toISOString().split("T")[1].slice(0, 5);
          earlyLeave = Helper.ConfigStaticDateTime(formattedTimeDiff);
        }

        const attendanceDateFilter = moment.utc(date, "YYYY-MM-DD");
        const queryAttendanceData = await prisma.attendance.findFirst({
          where: {
            employeeId: queryEmployeeAttendanceExceptionData.id,
            attendanceDate: {
              gte: attendanceDateFilter.startOf('day').toDate(),
              lte: attendanceDateFilter.endOf('day').toDate(),
            },
            isValid: true,
            deleted: false,
          }
        })

        if (!queryAttendanceData) {
          response.message = "There is no attendance check-in recorded on this day, please check again before verify this attendance exception";
          return response;
        }

        const totalHours = Helper.MinusDate(new Date(threshHoldException), queryAttendanceData.checkIn);

        const queryAttendanceCreateData = await prisma.attendance.update({
          where: {
            attendanceId: queryAttendanceData.attendanceId,
          },
          data: {
            employeeId: queryEmployeeAttendanceExceptionData.id,
            // attendanceDate: modifyDate.toDate(),
            checkOut: threshHoldException,
            checkoutCapture: queryAttendanceExceptionData.image,
            earlyLeave: earlyLeave,
            totalHours: Helper.ConfigStaticDateTime(totalHours),
          }
        })
      }
    }

    const queryUpdateAttendanceExceptionData = await prisma.attendanceException.update({
      data: {
        status: statusUpdate,
        approverId: employeeId,
      },
      where: {
        attendanceExceptionId: attendanceExceptionId,
      }
    })

    response.result = "Attendance recorded";
    return response;
  }
}