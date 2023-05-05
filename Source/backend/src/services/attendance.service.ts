import moment from 'moment';
import { ResponseData } from '../config/responseData.config';
import { prisma } from '../database/prisma.singleton';
import { AttendanceType } from '../utils/enum';
import { Helper } from '../utils/helper';
import { env } from '../config/env.config';
import { TakeAttendanceDTO } from '../model/dtos/attendance.dto';
import { DateTimeV2DTO } from '../model/dtos/workshift.dto';

export class AttendanceService {

  public takeAttendance = async (data: TakeAttendanceDTO) => {
    const response = new ResponseData<string>();

    const now = new Date();
    const modifyDate = Helper.ConfigStaticDateTime("00:00", `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`)

    //Kiểm tra lịch làm xem ngày đấy NV có ca làm hay ko
    const workShift = await prisma.workshift.findFirst({
      where: {
        employeeId: data.employeeId,
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
      response.message = "You don't have a schedule for today";
      return response;
    }

    //Kiểm tra xem đã có lần takeAttendance nào chưa ?
    const checkAttendance = await prisma.attendance.findFirst({
      where: {
        employeeId: data.employeeId,
        attendanceDate: modifyDate,
        deleted: false,
      }
    })

    //Get the shiftDate from workShift - YYYY-MM-DD
    const shiftDate = workShift.shiftDate;
    const date = `${shiftDate.getFullYear()}-${shiftDate.getMonth() + 1}-${shiftDate.getDate()}`;

    //If there ISN'T attendance record, it is CHECKIN
    if (!checkAttendance) {
      //Get the time from shiftType - HH:mm
      let startTime = workShift.shiftType.startTime;
      let time = moment(startTime, "HH:mm").format("HH:mm");

      //Convert both of startTime and shiftDate to Date value
      let startShift: Date = Helper.ConfigStaticDateTime(time, date);

      //create a threshhold, which is the startTime +1 and -1 hour
      let shiftThreshholdAfter = Helper.ConfigStaticDateTime(time, date);
      shiftThreshholdAfter.setHours(shiftThreshholdAfter.getHours() + 1);

      let shiftThreshholdBefore = Helper.ConfigStaticDateTime(time, date);
      shiftThreshholdBefore.setHours(shiftThreshholdBefore.getHours() - 1);

      //the latest punch in is startTime + 1 hour
      if (moment(new Date(shiftThreshholdAfter.getTime()), "HH:mm").diff(moment(new Date(now.getTime()), "HH:mm")) < 0) {
        response.message = "You are 1 hour late to checkin, please contact with the manager";
        return response;
      }

      if (moment(new Date(now.getTime()), "HH:mm").diff(moment(new Date(shiftThreshholdBefore.getTime()), "HH:mm")) < 0) {
        response.message = "You checkin so soon, comeback 1 hour before the shift start";
        return response;
      }

      //Check the time different from the checkIn time and the workShift startTime (startTime - checkIn)
      let diff = moment(new Date(startShift.getTime()), "HH:mm").diff(moment(new Date(now.getTime()), "HH:mm"));

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

      let queryData = await prisma.attendance.create({
        data: {
          employeeId: data.employeeId,
          attendanceDate: modifyDate,
          checkIn: new Date(now.toISOString()),
          checkinCapture: data.image,
          checkOut: null,
          lateArrival: lateArrival,
          totalHours: 0,
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
      //Get the time from shiftType - HH:mm
      let endTime = workShift.shiftType.endTime;
      let time = moment(endTime, "HH:mm").format("HH:mm");
      //Convert both of startTime and shiftDate to Date value
      let endShift: Date = Helper.ConfigStaticDateTime(time, date);

      //create a threshhold, which is the startTime +1 and -1 hour
      let shiftThreshholdAfter = Helper.ConfigStaticDateTime(time, date);
      shiftThreshholdAfter.setHours(shiftThreshholdAfter.getHours() + 1);

      let shiftThreshholdBefore = Helper.ConfigStaticDateTime(time, date);
      shiftThreshholdBefore.setHours(shiftThreshholdBefore.getHours() - 1);

      //the earliest punch out is endTime - 1 hour
      if (moment(new Date(now.getTime()), "HH:mm").diff(moment(new Date(shiftThreshholdBefore.getTime()), "HH:mm")) < 0) {
        response.message = "You checkout too early, please contact with the manager";
        return response;
      }

      if (moment(new Date(shiftThreshholdAfter.getTime()), "HH:mm").diff(moment(new Date(now.getTime()), "HH:mm")) < 0) {
        response.message = "You checkout too late, please contact with the manager";
        return response;
      }

      //Check the time different from the checkIn time and the workShift startTime (startTime - checkIn)
      let diff = moment(new Date(now.getTime()), "HH:mm").diff(moment(new Date(endShift.getTime()), "HH:mm"));

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
          employeeId: data.employeeId,
          attendanceDate: Helper.ConfigStaticDateTime("00:00", date),
          deleted: false,
        }
      })

      let queryData = await prisma.attendance.update({
        where: {
          attendanceId: queryShiftData.attendanceId,
        },
        data: {
          employeeId: data.employeeId,
          attendanceDate: modifyDate,
          checkOut: new Date(now.toISOString()),
          checkoutCapture: data.image,
          earlyLeave: earlyLeave,
          totalHours: 0,
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

  public saveImage = async (files: { [fieldname: string]: Express.Multer.File[] }) => {
    const response = new ResponseData<string>;
    let link = `${env.SERVER_URL}/public${(files.images[0].destination).split("public")[1]}/${files.images[0].filename}`

    response.result = Helper.ConvertDoubleSlashURL(link);
    return response;
  }

  public getThisMonthAttendance = async (employeeId: string, data: DateTimeV2DTO) => {
    const response = new ResponseData<string>();

    response.result = "";
    return response;
  }

  public getTodayAttendance = async (employeeId: string, data: DateTimeV2DTO) => {
    const response = new ResponseData<any>();
    const convertedDate = moment(`${data.year}-${data.month}-${data.date}`, "YYYY-MM-DD")

    const queryData = await prisma.attendance.findFirst({
      where: {
        employeeId: employeeId,
        attendanceDate: {
          gte: convertedDate.startOf('day').toDate(),
          lt: convertedDate.endOf('day').toDate(),
        },
        deleted: false,
      },
      select: {
        checkIn: true,
        checkOut: true,
        lateArrival: true,
        earlyLeave: true,
      }
    })

    if (!queryData) {
      response.message = "No attendance recorded today";
      return response;
    }

    var totalWorkingHours;

    if (queryData.checkOut != null) {
      const millisecondDif = moment(new Date(queryData.checkOut.getTime()), "HH:mm").diff(moment(new Date(queryData.checkIn.getTime()), "HH:mm"));

      totalWorkingHours = moment.utc(millisecondDif).format('HH:mm');
    } else {
      totalWorkingHours = null;
    }

    const returnData = {
      totalWorkingHours,
      ...queryData
    }

    response.result = returnData;
    return response;
  }

  public getAttendanceHistory = async (employeeId: string, data: DateTimeV2DTO) => {
    const response = new ResponseData<any>();
    const daysInMonth = moment(`${data.year + 1}-${data.month}-01`, "YYYY-MM-DD").daysInMonth();

    const startDate = Helper.ConfigStaticDateTime("00:00", `${data.year}-${data.month}-${1}`)
    const endDate = Helper.ConfigStaticDateTime("00:00", `${data.year}-${data.month}-${daysInMonth}`)

    const queryData = await prisma.attendance.findMany({
      where: {
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
      }
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
      }
    })

    if (!queryData) {
      response.message = "Attendance isn't exist";
      return response;
    }

    var totalWorkingHours;

    if (queryData.checkOut != null) {
      const millisecondDif = moment(new Date(queryData.checkOut.getTime()), "HH:mm").diff(moment(new Date(queryData.checkIn.getTime()), "HH:mm"));

      totalWorkingHours = moment.utc(millisecondDif).format('HH:mm');
    } else {
      totalWorkingHours = null;
    }

    const returnData = {
      totalWorkingHours,
      ...queryData
    }

    response.result = returnData;
    return response;
  }
}