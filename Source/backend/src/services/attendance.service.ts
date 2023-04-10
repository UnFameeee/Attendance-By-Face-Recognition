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

    //If there ISN'T attendance record, it is CHECKIN
    if (!checkAttendance) {
      //Get the time from shiftType - HH:mm
      const startTime = workShift.shiftType.startTime;
      // const time = moment(startTime, "HH:mm").format("HH:mm");
      // const time = Helper.GetTimeFromDate(startTime);

      //Get the shiftDate from workShift - YYYY-MM-DD
      const shiftDate = workShift.shiftDate;
      const date = `${shiftDate.getFullYear()}-${shiftDate.getMonth() + 1}-${shiftDate.getDate()}`;

      const time = moment(now, "HH:mm").format("HH:mm");
      //Convert both of startTime and shiftDate to Date value
      const startShift: Date = Helper.ConfigStaticDateTime(time, date);
      console.log(startTime)
      console.log(now)
      console.log(time)
      console.log(date)
      //Check the time different from the checkIn time and the workShift startTime (startTime - checkIn)
      console.log(startShift.getTime())
      console.log(now.getTime())
      const timeDiff = startShift.getTime() - now.getTime();
      console.log(timeDiff)
      var lateArrival: Date;
      //if the value is negative -> lateArrival
      if (Math.sign(timeDiff) === -1) {
        let timeDiffAbs = Math.abs(timeDiff);
        const date = new Date(timeDiffAbs); 
        console.log(date);

        // // converts timeDiffMs to minutes (rounded down)
        // const timeDiffMinutes = Math.floor(timeDiffAbs / 1000 / 60); 
        // // converts timeDiffMs to hours (rounded down)
        // const timeDiffHours = Math.floor(timeDiffAbs / 1000 / 60 / 60);

        // lateArrival = Helper.ConfigStaticDateTime(`${timeDiffHours}:${timeDiffMinutes}`);
      }
      //if the value is positive or equal 0 -> right on time
      else {
        lateArrival = null;
      }

      // const queryData = await prisma.attendance.create({
      //   data: {
      //     employeeId: employeeId,
      //     attendanceDate: modifyDate,
      //     checkIn: new Date(now.toISOString()),
      //     checkOut: null,
      //     lateArrival: lateArrival,
      //     // earlyDeparture: null,
      //     totalHours: 0,
      //     absent: false,
      //     note: "",
      //   }
      // })
      // if (queryData) {
      //   response.result = "Check in successfully";
      // } else {
      //   response.result = "Check in unsuccessfully, Server error";
      // }
    }
    //If there IS attendance record, it is CHECKOUT
    else {

    }
  }
}