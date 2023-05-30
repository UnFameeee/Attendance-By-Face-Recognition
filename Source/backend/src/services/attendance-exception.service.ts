import moment from "moment";
import { env } from "../config/env.config";
import { Page, Paging } from "../config/paginate.config";
import { ResponseData } from "../config/responseData.config"
import { attendance, attendanceExceptionStatus } from "../constant/attendance-exception.constant";
import { ROLE } from "../constant/database.constant";
import { prisma } from "../database/prisma.singleton";
import { GetAttendanceExceptionDataDTO, SubmitAttendanceExceptionDTO } from "../model/dtos/attendance-exception.dto";
import { Helper } from "../utils/helper";

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
    const queryData = await prisma.attendanceException.create({
      data: {
        name: data.name,
        departmentId: data.departmentId,
        email: data.email,
        image: data.image,
        attendanceType: attendanceType,
        datetime: new Date(),
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
    const dateFilter = moment(`${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`, "YYYY-MM-DD")
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

    const targetDate = moment(`${queryEmployeeData.datetime.getFullYear()}-${queryEmployeeData.datetime.getMonth() + 1}-${queryEmployeeData.datetime.getDate()}`, "YYYY-MM-DD")

    const queryWorkshiftData = await prisma.workshift.findFirst({
      where: {
        employeeId: querySystemData.id,
        shiftDate: {
          gte: targetDate.startOf('day').toDate(),
          lte: targetDate.endOf('day').toDate(),
        }
      },
      select: {
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
        const time = moment(queryWorkshiftData.shiftType.startTime, "HH:mm").format("HH:mm");
        const date = moment(queryWorkshiftData.shiftDate, "YYYY-MM-DD").format("YYYY-MM-DD");
        shiftTime = Helper.ConfigStaticDateTime(time, date);
      } else if (queryEmployeeData.attendanceType == attendance.checkout) {
        const time = moment(queryWorkshiftData.shiftType.endTime, "HH:mm").format("HH:mm");
        const date = moment(queryWorkshiftData.shiftDate, "YYYY-MM-DD").format("YYYY-MM-DD");
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

    const queryData = await prisma.attendanceException.update({
      data: {
        status: statusUpdate,
        approverId: employeeId,
      },
      where: {
        attendanceExceptionId: attendanceExceptionId,
      }
    })

    if (statusUpdate == attendanceExceptionStatus.approve) {
      const queryEmployeeAttendanceExceptionData = await prisma.employee.findFirst({
        where: {
          email: queryAttendanceException.email,
          deleted: false,
        },
        select: {
          id: true,
        }
      })

      if (!queryEmployeeAttendanceExceptionData) {
        response.result = "Attendance recorded";
        return response;
      }

      const dateException = queryAttendanceException.datetime;

      const modifyDate = Helper.ConfigStaticDateTime("00:00", `${dateException.getFullYear()}-${dateException.getMonth() + 1}-${dateException.getDate()}`)

      //Kiểm tra lịch làm xem ngày đấy NV có ca làm hay ko
      const workShift = await prisma.workshift.findFirst({
        where: {
          employeeId: queryEmployeeAttendanceExceptionData.id,
          shiftDate: modifyDate,
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


      if (queryAttendanceException.attendanceType == attendance.checkin) {
        //Get the time from shiftType - HH:mm
        let startTime = workShift.shiftType.startTime;
        let time = moment(startTime, "HH:mm").format("HH:mm");

        //Convert both of startTime and shiftDate to Date value
        let startShift: Date = Helper.ConfigStaticDateTime(time, date);

        //Check the time different from the checkIn time and the workShift startTime (startTime - checkIn)
        let diff = moment(new Date(startShift.getTime()), "HH:mm").diff(moment(new Date(dateException), "HH:mm"));

        var lateArrival: Date;
        //if the value is negative -> lateArrival
        if (Math.sign(diff) === -1) {
          let duration = moment.duration(Math.abs(diff));
          let formattedTimeDiff = moment.utc(duration.asMilliseconds()).format('HH:mm');
          lateArrival = Helper.ConfigStaticDateTime(formattedTimeDiff);
        }
        //if the value is positive or equal 0 -> right on time
        else {
          lateArrival = null;
        }

        const queryData = await prisma.attendance.create({
          data: {
            employeeId: employeeId,
            attendanceDate: modifyDate,
            checkIn: dateException,
            checkOut: null,
            lateArrival: lateArrival,
            totalHours: Helper.ConfigStaticDateTime("00:00"),
            absent: false,
            note: "",
          }
        })
      } else if (queryAttendanceException.attendanceType == attendance.checkout) {
        //Get the time from shiftType - HH:mm
        let endTime = workShift.shiftType.endTime;
        let time = moment(endTime, "HH:mm").format("HH:mm");
        //Convert both of startTime and shiftDate to Date value
        let endShift: Date = Helper.ConfigStaticDateTime(time, date);
        //Check the time different from the checkIn time and the workShift startTime (startTime - checkIn)
        let diff = moment(new Date(dateException), "HH:mm").diff(moment(new Date(endShift.getTime()), "HH:mm"));

        var earlyLeave: Date;
        //if the value is positive -> earlyLeave
        if (Math.sign(diff) === 1) {
          earlyLeave = null;
        }
        //if the value is negative or equal 0 -> right on time
        else {
          let duration = moment.duration(Math.abs(diff));
          let formattedTimeDiff = moment.utc(duration.asMilliseconds()).format('HH:mm');
          earlyLeave = Helper.ConfigStaticDateTime(formattedTimeDiff);
        }

        const queryShiftData = await prisma.attendance.findFirst({
          where: {
            employeeId: employeeId,
            attendanceDate: Helper.ConfigStaticDateTime("00:00", date),
            deleted: false,
          }
        })

        const totalHours = Helper.MinusDate(queryShiftData.checkOut, queryShiftData.checkIn, true);

        let queryData = await prisma.attendance.update({
          where: {
            attendanceId: queryShiftData.attendanceId,
          },
          data: {
            employeeId: employeeId,
            attendanceDate: modifyDate,
            checkOut: dateException,
            earlyLeave: earlyLeave,
            totalHours: Helper.ConfigStaticDateTime(totalHours),
          }
        })
      }
    }
    response.result = "Attendance recorded";
    return response;
  }
}