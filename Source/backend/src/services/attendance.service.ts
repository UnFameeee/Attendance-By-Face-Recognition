import moment from 'moment';
import { ResponseData } from '../config/responseData.config';
import { prisma } from '../database/prisma.singleton';
import { AttendanceType } from '../utils/enum';
import { Helper } from '../utils/helper';
import { env } from '../config/env.config';
import { TakeAttendanceDTO } from '../model/dtos/attendance.dto';
import { DateTimeV2DTO } from '../model/dtos/workshift.dto';
import { attendance } from '../constant/attendance-exception.constant';
import { timezoneConfig } from '../constant/moment-timezone.constant';

export class AttendanceService {

  public takeAttendance = async (data: TakeAttendanceDTO) => {
    const response = new ResponseData<string>();

    const momentNow = moment(new Date()).tz(timezoneConfig);
    let threshHoldNow = Helper.ConfigStaticDateTime(momentNow.format("HH:mm"), momentNow.format("YYYY-MM-DD"));

    const modifyDate = moment.utc(data.date, "YYYY-MM-DD")

    //Kiểm tra lịch làm xem ngày đấy NV có ca làm hay ko
    const workShift = await prisma.workshift.findFirst({
      where: {
        employeeId: data.employeeId,
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
        allowEarlyLeave: true,
        allowLateArrival: true,
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
      response.message = "You don't have a schedule for today";
      return response;
    }

    //Kiểm tra xem đã có lần takeAttendance nào chưa ?
    const checkAttendance = await prisma.attendance.findFirst({
      where: {
        employeeId: data.employeeId,
        attendanceDate: {
          gte: modifyDate.startOf('day').toDate(),
          lte: modifyDate.endOf('day').toDate(),
        },
        deleted: false,
      }
    })

    //Get the shiftDate from workShift - YYYY-MM-DD
    const shiftDate = workShift.shiftDate;
    const date = `${shiftDate.getFullYear()}-${shiftDate.getMonth() + 1}-${shiftDate.getDate()}`;

    const queryOrganizationData = await prisma.organization.findFirst({
      select: {
        limitEarlyLeave: true,
        limitLateArrival: true,
      }
    })

    //If there ISN'T attendance record, it is CHECKIN
    if (!checkAttendance) {
      //Get the time from shiftType - HH:mm
      let startTime = workShift.shiftType.startTime;
      let time = moment.utc(startTime, "HH:mm").format("HH:mm");

      //Convert both of startTime and shiftDate to Date value
      let startShift: Date = Helper.ConfigStaticDateTime(time, date);
      //Nếu allowLateArrival == false => nhân viên được phép đi trễ
      if (workShift.allowLateArrival == false) {
        let baseStartTime = moment.utc(startTime, 'HH:mm');
        let baseLimitLateArrival = moment.utc(queryOrganizationData.limitLateArrival, 'HH:mm');
        let resultHour = moment.utc(baseStartTime.clone().add(baseLimitLateArrival.hour(), 'hours').add(baseLimitLateArrival.minute(), 'minutes')).format("HH:mm");

        let shiftThreshholdAfter = Helper.ConfigStaticDateTime(resultHour, date);

        //the latest punch in is startTime + 1 hour
        if (moment(new Date(shiftThreshholdAfter.getTime()), "HH:mm").diff(moment(new Date(threshHoldNow.getTime()), "HH:mm")) < 0) {
          response.message = "You are too late to check in, please contact with the manager";
          return response;
        }
      }

      //Check the time different from the checkIn time and the workShift startTime (startTime - checkIn)
      let diff = moment(new Date(startShift.getTime()), "HH:mm").diff(moment(new Date(threshHoldNow.getTime()), "HH:mm"));

      var lateArrival: Date;
      //if the value is negative -> lateArrival
      if (Math.sign(diff) === -1) {
        let duration = moment.duration(Math.abs(diff));
        // let formattedTimeDiff = moment(duration.asMilliseconds()).format('HH:mm');
        let formattedTimeDiff = new Date(duration.asMilliseconds()).toISOString().split("T")[1].slice(0, 5);
        lateArrival = Helper.ConfigStaticDateTime(formattedTimeDiff);
      }
      //if the value is positive or equal 0 -> right on time
      else {
        lateArrival = null;
      }

      let queryData = await prisma.attendance.create({
        data: {
          employeeId: data.employeeId,
          attendanceDate: Helper.ConfigStaticDateTime("00:00", data.date),
          checkIn: Helper.ConfigStaticDateTime(momentNow.format("HH:mm"), momentNow.format("YYYY-MM-DD")),
          checkinCapture: data.image,
          checkOut: null,
          lateArrival: lateArrival,
          totalHours: Helper.ConfigStaticDateTime("00:00"),
          absent: false,
          note: "",
        }
      })
      if (queryData) {
        response.result = "Check in successfully";
      } else {
        response.result = "Check in unsuccessfully, Server error";
      }
      return response;
    }
    //If there IS attendance record, it is CHECKOUT
    else {
      //Nếu đã checkout rồi
      if (checkAttendance.checkOut != null) {
        response.message = "You have already checkout, please check again";
        return response;
      }

      //Get the time from shiftType - HH:mm
      let endTime = workShift.shiftType.endTime;
      let time = moment.utc(endTime, "HH:mm").format("HH:mm");
      //Convert both of startTime and shiftDate to Date value
      let endShift: Date = Helper.ConfigStaticDateTime(time, date);
      //Nếu allowEarlyLeave == false => nhân viên được phép về sớm
      if (workShift.allowEarlyLeave == false) {
        let baseEndTime = moment.utc(endTime, 'HH:mm');
        let baseLimitEarlyLeave = moment.utc(queryOrganizationData.limitLateArrival, 'HH:mm');
        let resultHour = moment.utc(baseEndTime.clone().subtract(baseLimitEarlyLeave.hour(), 'hours').subtract(baseLimitEarlyLeave.minute(), 'minutes')).format("HH:mm");

        let shiftThreshholdBefore = Helper.ConfigStaticDateTime(resultHour, date);

        //the earliest punch out is endTime - 1 hour
        if (moment.utc(new Date(threshHoldNow.getTime()), "HH:mm").diff(moment.utc(new Date(shiftThreshholdBefore.getTime()), "HH:mm")) <= 0) {
          response.message = "You check out too early, please contact with the manager";
          return response;
        }
      }

      //Check the time different from the checkIn time and the workShift startTime (startTime - checkIn)
      let diff = moment.utc(new Date(threshHoldNow.getTime()), "HH:mm").diff(moment.utc(new Date(endShift.getTime()), "HH:mm"));

      var earlyLeave: Date;
      //if the value is positive -> earlyLeave
      if (Math.sign(diff) === 1) {
        earlyLeave = null;
      }
      //if the value is negative or equal 0 -> right on time
      else {
        let duration = moment.duration(Math.abs(diff));
        // let formattedTimeDiff = moment.utc(duration.asMilliseconds()).format('HH:mm');
        let formattedTimeDiff = new Date(duration.asMilliseconds()).toISOString().split("T")[1].slice(0, 5);
        earlyLeave = Helper.ConfigStaticDateTime(formattedTimeDiff);
      }

      const attendanceDateFilter = moment.utc(date, "YYYY-MM-DD");
      const queryShiftData = await prisma.attendance.findFirst({
        where: {
          employeeId: data.employeeId,
          attendanceDate: {
            gte: attendanceDateFilter.startOf('day').toDate(),
            lte: attendanceDateFilter.endOf('day').toDate(),
          },
          deleted: false,
        }
      })

      const totalHours = Helper.MinusDate(new Date(threshHoldNow), queryShiftData.checkIn);

      let queryData = await prisma.attendance.update({
        where: {
          attendanceId: queryShiftData.attendanceId,
        },
        data: {
          employeeId: data.employeeId,
          checkOut: Helper.ConfigStaticDateTime(momentNow.format("HH:mm"), momentNow.format("YYYY-MM-DD")),
          checkoutCapture: data.image,
          earlyLeave: earlyLeave,
          totalHours: Helper.ConfigStaticDateTime(totalHours),
        }
      })
      if (queryData) {
        response.result = "Check out successfully";
      } else {
        response.result = "Check out unsuccessfully, Server error";
      }
      return response;
    }
  }

  public getEmployeeById = async (employeeId: string, date: string): Promise<ResponseData<any>> => {
    const response = new ResponseData<any>;
    const queryData = await prisma.employee.findFirst({
      where: {
        id: employeeId,
        deleted: false
      },
      select: {
        id: true,
        fullname: true,
        image: true,
        role: {
          select: {
            displayName: true,
          }
        },
        email: true,
        gender: true,
        dateOfBirth: true,
        phoneNumber: true,
        description: true,
        department: {
          select: {
            departmentName: true,
          }
        },
        location: {
          select: {
            address: true,
            city: true,
            country: true,
            state: true
          },
        },
      },
    })

    const dateFilter = moment.utc(date, "YYYY-MM-DD")
    const queryAttendanceData = await prisma.attendance.findFirst({
      where: {
        employeeId: employeeId,
        attendanceDate: {
          gte: dateFilter.startOf('day').toDate(),
          lte: dateFilter.endOf('day').toDate(),
        }
      }
    })

    var attendanceType: string;
    if (!queryAttendanceData) {
      attendanceType = attendance.checkin;
    } else if (queryAttendanceData.checkIn) {
      attendanceType = attendance.checkout;
    }

    const resData = {
      attendanceType,
      ...queryData
    }

    if (queryData) {
      response.result = resData;
    } else {
      response.message = "Employee isn't exist";
    }
    return response;
  }

  public saveImage = async (files: { [fieldname: string]: Express.Multer.File[] }) => {
    const response = new ResponseData<string>;
    let link = `${env.SERVER_URL}/public${(files.images[0].destination).split("public")[1]}/${files.images[0].filename}`

    response.result = Helper.ConvertDoubleSlashURL(link);
    return response;
  }

  public getThisMonthAttendance = async (employeeId: string, data: DateTimeV2DTO) => {
    const response = new ResponseData<any>();
    const daysInMonth = moment.utc(`${data.year}-${data.month}-01`, "YYYY-MM-DD").daysInMonth();

    const startDate = Helper.ConfigStaticDateTime("00:00", `${data.year}-${data.month}-${1}`)
    const endDate = Helper.ConfigStaticDateTime("00:00", `${data.year}-${data.month}-${daysInMonth}`)
    // const startDate = moment.utc(`${data.year}-${data.month}-${1}`, "YYYY-MM-DD").toDate();
    // const endDate = moment.utc(`${data.year}-${data.month}-${daysInMonth}`, "YYYY-MM-DD").toDate();

    const queryData = await prisma.attendance.findMany({
      where: {
        // absent: false,
        isValid: true,
        employeeId: employeeId,
        attendanceDate: {
          gte: startDate,
          lte: endDate,
        },
        deleted: false,
      },
      select: {
        checkIn: true,
        checkOut: true,
        lateArrival: true,
        earlyLeave: true,
        totalHours: true,
      }
    })

    const queryLeaveData = await prisma.attendance.count({
      where: {
        absent: true,
        employeeId: employeeId,
        attendanceDate: {
          gte: startDate,
          lte: endDate,
        },
        deleted: false,
      },
    })


    const totalAttendance = await prisma.attendance.count({
      where: {
        absent: false,
        isValid: true,
        employeeId: employeeId,
        checkOut: {
          not: null,
        },
        attendanceDate: {
          gte: startDate,
          lte: endDate,
        },
        deleted: false,
      },
    })

    var totalWorkingHours: number = 0;
    var totalLateArrival: number = 0;
    var totalEarlyLeave: number = 0;

    for (var attendance of queryData) {
      if (attendance.checkOut != null) {
        // totalWorkingHours += Helper.MinusDate(attendance.checkOut, attendance.checkIn, false);

        totalWorkingHours += moment.duration(moment.utc(attendance.totalHours, "HH:mm").format("HH:mm")).asMilliseconds();

        totalLateArrival += moment.duration(moment.utc(attendance.lateArrival, "HH:mm").format("HH:mm")).asMilliseconds();

        totalEarlyLeave += moment.duration(moment.utc(attendance.earlyLeave, "HH:mm").format("HH:mm")).asMilliseconds();

      } else {
        totalWorkingHours += 0;
        totalLateArrival += 0;
        totalEarlyLeave += 0;
      }
    }

    const returnData = {
      totalAttendance: totalAttendance,
      totalLeaveDays: queryLeaveData,
      // totalWorkingHours: moment.utc(totalWorkingHours).format("HH:mm"),
      // totalLateArrival: moment.utc(totalLateArrival).format("HH:mm"),
      // totalEarlyLeave: moment.utc(totalEarlyLeave).format("HH:mm"),
      totalWorkingHours: Helper.ConvertMillisecondsToHHMM(totalWorkingHours),
      totalLateArrival: Helper.ConvertMillisecondsToHHMM(totalLateArrival),
      totalEarlyLeave: Helper.ConvertMillisecondsToHHMM(totalEarlyLeave),
    }

    response.result = returnData;
    return response;
  }

  public getTodayAttendance = async (employeeId: string, data: DateTimeV2DTO) => {
    const response = new ResponseData<any>();
    const convertedDate = moment.utc(`${data.year}-${data.month}-${data.date}`, "YYYY-MM-DD")

    const queryData = await prisma.attendance.findFirst({
      where: {
        employeeId: employeeId,
        attendanceDate: {
          gte: convertedDate.startOf('day').toDate(),
          lte: convertedDate.endOf('day').toDate(),
        },
        deleted: false,
      },
      select: {
        checkIn: true,
        checkOut: true,
        lateArrival: true,
        earlyLeave: true,
        totalHours: true,
      }
    })

    if (!queryData) {
      response.message = "No attendance recorded today";
      return response;
    }

    // var totalWorkingHours;
    // if (queryData.checkOut != null) {
    //   totalWorkingHours = Helper.MinusDate(queryData.checkOut, queryData.checkIn, true);
    // } else {
    //   totalWorkingHours = null;
    // }
    // const returnData = {
    //   totalWorkingHours,
    //   ...queryData
    // }

    response.result = queryData;
    return response;
  }

  public getAttendanceHistory = async (employeeId: string, data: DateTimeV2DTO) => {
    const response = new ResponseData<any>();
    const isValid = data.isValid;
    const daysInMonth = moment.utc(`${data.year}-${data.month}-01`, "YYYY-MM-DD").daysInMonth();

    const startDate = Helper.ConfigStaticDateTime("00:00", `${data.year}-${data.month}-${1}`)
    const endDate = Helper.ConfigStaticDateTime("00:00", `${data.year}-${data.month}-${daysInMonth}`)

    // const startDate = moment.utc(`${data.year}-${data.month}-${1}`, "YYYY-MM-DD").toDate();
    // const endDate = moment.utc(`${data.year}-${data.month}-${daysInMonth}`, "YYYY-MM-DD").toDate();

    const queryData = await prisma.attendance.findMany({
      where: {
        isValid: isValid,
        employeeId: employeeId,
        attendanceDate: {
          gte: startDate,
          lte: endDate,
        },
        deleted: false,
      },
      select: {
        attendanceId: true,
        attendanceDate: true,
        checkIn: true,
        checkOut: true,
        lateArrival: true,
        earlyLeave: true,
        absent: true,
        isValid: true,
        note: true,
      },
      orderBy: {
        attendanceDate: "asc"
      },
    })

    response.result = queryData;
    return response;
  }

  public getAttendanceDetail = async (attendanceId: string) => {
    const response = new ResponseData<any>();

    const queryData = await prisma.attendance.findFirst({
      where: {
        attendanceId: attendanceId,
        deleted: false,
      },
      select: {
        attendanceId: true,
        attendanceDate: true,
        checkIn: true,
        checkOut: true,
        checkinCapture: true,
        checkoutCapture: true,
        lateArrival: true,
        earlyLeave: true,
        totalHours: true,
        isValid: true,
        absent: true,
        note: true,
      }
    })

    if (!queryData) {
      response.message = "Attendance isn't exist";
      return response;
    }

    // var totalWorkingHours;
    // if (queryData.checkOut != null) {
    //   // totalWorkingHours = Helper.MinusDate(queryData.checkOut, queryData.checkIn, true);
    //   totalWorkingHours
    // } else {
    //   totalWorkingHours = null;
    // }
    // const returnData = {
    //   totalWorkingHours,
    //   ...queryData
    // }

    response.result = queryData;
    return response;
  }

  public getAttendanceStatistic = async (employeeId: string, data: DateTimeV2DTO) => {
    const response = new ResponseData<any>;

    const daysInMonth = moment.utc(`${data.year}-${data.month}-01`, "YYYY-MM-DD").daysInMonth();

    // const startDate = Helper.ConfigStaticDateTime("00:00", `${data.year}-${data.month}-${1}`)
    // const endDate = Helper.ConfigStaticDateTime("00:00", `${data.year}-${data.month}-${daysInMonth}`)

    const startDate = moment.utc(`${data.year}-${data.month}-${1}`, "YYYY-MM-DD").toDate();
    const endDate = moment.utc(`${data.year}-${data.month}-${daysInMonth}`, "YYYY-MM-DD").toDate();

    const queryAttendanceData = await prisma.attendance.count({
      where: {
        absent: false,
        isValid: true,
        employeeId: employeeId,
        attendanceDate: {
          gte: startDate,
          lte: endDate,
        },
        deleted: false,
        totalHours: {
          not: undefined,
        }
      }
    })

    const queryLeaveData = await prisma.attendance.count({
      where: {
        employeeId: employeeId,
        absent: true,
        attendanceDate: {
          gte: startDate,
          lte: endDate,
        },
        deleted: false,
      }
    })

    var resultArray = [
      {
        type: "Attendance Day",
        value: queryAttendanceData,
      },
      {
        type: "Leave Day",
        value: queryLeaveData,
      },
    ];

    response.result = resultArray;
    return response;
  }

  public getYearlyAttendanceStatistic = async (employeeId: string, data: DateTimeV2DTO) => {
    const response = new ResponseData<any[]>;

    var resultArray: any[] = [];

    for (var i = 1; i <= 12; ++i) {
      const daysInMonth = moment.utc(`${data.year}-${i}-01`, "YYYY-MM-DD").daysInMonth();

      // const startDate = Helper.ConfigStaticDateTime("00:00", `${data.year}-${i}-${1}`)
      // const endDate = Helper.ConfigStaticDateTime("00:00", `${data.year}-${i}-${daysInMonth}`)

      const startDate = moment.utc(`${data.year}-${data.month}-${1}`, "YYYY-MM-DD").toDate();
      const endDate = moment.utc(`${data.year}-${data.month}-${daysInMonth}`, "YYYY-MM-DD").toDate();

      const queryAttendanceData = await prisma.attendance.count({
        where: {
          absent: false,
          isValid: true,
          employeeId: employeeId,
          attendanceDate: {
            gte: startDate,
            lte: endDate,
          },
          deleted: false,
          totalHours: {
            not: undefined,
          }
        }
      })

      resultArray.push({
        action: i,
        pv: queryAttendanceData,
      })
    }

    response.result = resultArray;
    return response;
  }

  public validateAttendance = async (attendanceId: string, data: {
    isValid: boolean,
    note: string,
  }) => {
    const response = new ResponseData<string>;

    const queryCheckData = await prisma.attendance.findFirst({
      where: {
        attendanceId: attendanceId,
        deleted: false,
      },
      select: {
        absent: true,
      }
    })

    if (!queryCheckData) {
      response.message = "Attendance doesn't exist";
      return response;
    } else if (queryCheckData.absent == true) {
      response.message = "This is employee approved leave request day";
      return response;
    }

    const queryData = await prisma.attendance.update({
      where: {
        attendanceId: attendanceId,

      },
      data: {
        isValid: data.isValid,
        note: data.note,
      }
    })
    if (!queryData) {
      response.message = "System Error!";
      return response;
    }

    response.result = "Validate attendance successfully";
    return response;
  }
}