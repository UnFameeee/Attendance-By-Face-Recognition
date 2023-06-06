import multer from "multer";
import path from "path";
import fs from 'fs';
import { Request } from "express";
import { prisma } from "../database/prisma.singleton";
import moment from "moment";
import { Helper } from "../utils/helper";
import { RequestWithMulter } from "../interfaces/request.interface";
import { HttpException } from "../config/httpException";
import { timezoneConfig } from "../constant/moment-timezone.constant";

const directory = path.join(__dirname, "../public/attendance");
var now;
var staticDateFolder: string;
var errorFlag: boolean = false;
const attendanceImageStorage = multer.diskStorage({
  // Destination to store image     
  // Attendance - EmpID - Date - imageIn, imageOut
  destination: async (req: RequestWithMulter, file, cb) => {
    const employeeId: string = (req.query.employeeId).toString();

    //error handler
    errorFlag = false;

    // now = new Date();
    const momentNow = moment(new Date()).tz(timezoneConfig);
    now = momentNow;
    // const modifyDate = moment.utc(`${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`, "YYYY-MM-DD").toDate();
    // const targetDate = moment.utc(`${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`, "YYYY-MM-DD")
    const targetDate = Helper.ConfigStaticDateTime("00:00", `${momentNow.format("YYYY-MM-DD")}`)
    // const targetDateEnd = Helper.ConfigStaticDateTime("00:00", `${momentNow.format("YYYY-MM-DD")}`)

    console.log("attendance status date", targetDate);

    //Kiểm tra lịch làm xem ngày đấy NV có ca làm hay ko
    const workShift = await prisma.workshift.findFirst({
      where: {
        employeeId: employeeId,
        // shiftDate: {
        //   gte: targetDate.startOf('day').toDate(),
        //   lte: targetDate.endOf('day').toDate(),
        // },
        shiftDate: targetDate,
        deleted: false,
      },
    })

    if (!workShift) {
      errorFlag = true;
    } else {
      const queryAttendanceAbsent = await prisma.attendance.findFirst({
        where: {
          employeeId: employeeId,
          // attendanceDate: {
          //   gte: targetDate.startOf('day').toDate(),
          //   lte: targetDate.endOf('day').toDate(),
          // },
          attendanceDate: targetDate,
          deleted: false,
          absent: true,
        }
      })

      if (queryAttendanceAbsent) {
        errorFlag = true;
      } else {
        const queryAttendanceCheckoutData = await prisma.attendance.findFirst({
          where: {
            employeeId: employeeId,
            // attendanceDate: {
            //   gte: targetDate.startOf('day').toDate(),
            //   lte: targetDate.endOf('day').toDate(),
            // },
            attendanceDate: targetDate,
            checkIn: {
              not: null
            },
            checkOut: {
              not: null
            },
            deleted: false,
          }
        })
        if (queryAttendanceCheckoutData) {
          errorFlag = true;
        }
      }
    }

    //Check EmpID folder
    if (!fs.existsSync(`${directory}/${employeeId}`)) {
      fs.mkdirSync(`${directory}/${employeeId}`)
    }
    staticDateFolder = momentNow.format("YYYY-MM-DD");
    //Check Date folder
    if (!fs.existsSync(`${directory}/${employeeId}/${staticDateFolder}`)) {
      fs.mkdirSync(`${directory}/${employeeId}/${staticDateFolder}`)
    }

    console.log("MulterStorage: ", `${directory}/${employeeId}/${staticDateFolder}`)
    cb(null, `${directory}/${employeeId}/${staticDateFolder}`)
  },
  filename: async (req: RequestWithMulter, file, cb) => {
    const employeeId: string = (req.query.employeeId).toString();
    // const targetDate = moment.utc(`${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`, "YYYY-MM-DD")

    const targetDate = Helper.ConfigStaticDateTime("00:00", `${now.format("YYYY-MM-DD")}`)    

    if (errorFlag) {
      cb(null, `${employeeId}_${staticDateFolder}_unknown` + path.extname(file.originalname));
    } else {
      const queryAttendanceData = await prisma.attendance.findFirst({
        where: {
          employeeId: employeeId,
          // attendanceDate: {
          //   gte: targetDate.startOf('day').toDate(),
          //   lte: targetDate.endOf('day').toDate(),
          // }
          attendanceDate: targetDate,
        }
      })

      if (!queryAttendanceData) {
        // const arrayUpload: { [fieldname: string]: Express.Multer.File[] } = (req.files as { [fieldname: string]: Express.Multer.File[] });
        cb(null, `${employeeId}_${staticDateFolder}_checkin` + path.extname(file.originalname));
      } else if (queryAttendanceData.checkIn != null && queryAttendanceData.checkOut == null) {
        cb(null, `${employeeId}_${staticDateFolder}_checkout` + path.extname(file.originalname));
      }
    }
  }
});

export const attendanceImageUpload = multer({
  storage: attendanceImageStorage,
  limits: {
    fileSize: (10 * 1024 * 1024) // 10 MB
  },
  fileFilter(req, file, cb) {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(undefined, true)
    } else {
      cb(undefined, false)
      // upload only png - jpg -jpeg format
      return cb(new Error('Only support PNG, JPG, JPEG and file below 10mb'))
    }
  }
}).fields([
  { name: "images", maxCount: 1 }
])  