import moment from 'moment';
import { ResponseData } from '../config/responseData.config';
import { prisma } from '../database/prisma.singleton';
import { AttendanceType } from '../utils/enum';
import { Helper } from '../utils/helper';

export class AttendanceService {

  public takeAttendance = async (employeeId: string, attendanceType: string) => {
    const response = new ResponseData<string>();
    const now = new Date();
    const modifyDate = Helper.ConfigStaticDateTime("00:00", `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`)

    //Kiểm tra lịch làm xem ngày đấy NV có ca làm hay ko
    const workShift = await prisma.workshift.findFirst({
      where: {
        employeeId: employeeId,
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
        employeeId: employeeId,
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
          employeeId: employeeId,
          attendanceDate: modifyDate,
          checkIn: new Date(now.toISOString()),
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
          employeeId: employeeId,
          attendanceDate: Helper.ConfigStaticDateTime("00:00", date),
          deleted: false,
        }
      })

      let queryData = await prisma.attendance.update({
        where: {
          attendanceId: queryShiftData.attendanceId,
        },
        data: {
          employeeId: employeeId,
          attendanceDate: modifyDate,
          checkOut: new Date(now.toISOString()),
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
}