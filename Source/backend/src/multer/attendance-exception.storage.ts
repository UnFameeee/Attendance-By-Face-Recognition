import multer from "multer";
import path from "path";
import { RequestWithProfile } from '../interfaces/request.interface';
import fs from 'fs';
import { prisma } from "../database/prisma.singleton";
import { HttpException } from "../config/httpException";
import { attendance } from '../constant/attendance-exception.constant';
import moment from "moment";

const directory = path.join(__dirname, "../public/attendance");
var now: Date;
var staticDateFolder: string;
const attendanceExceptionImageStorage = multer.diskStorage({
  // Destination to store image     
  // Attendance - EmpID - Date - imageIn, imageOut
  destination: async (req: RequestWithProfile, file, cb) => {
    const email = (req.query.email).toString();
    const type = (req.query.type).toString();
    const queryEmployeeData = await prisma.employee.findFirst({
      where: {
        email: email,
        deleted: false,
      }
    })

    //config the datetime
    now = new Date();
    staticDateFolder = `${now.getFullYear()}_${now.getMonth() + 1}_${now.getDate()}`;
    const targetDate = moment(`${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`, "YYYY-MM-DD")

    //error handler
    var errorFlag: boolean = false;

    //Validate checkin - checkout
    if (type.toUpperCase() == attendance.checkin) {
      const queryAttendanceData = await prisma.attendance.findFirst({
        where: {
          employee: {
            email: email,
          },
          attendanceDate: {
            gte: targetDate.startOf('day').toDate(),
            lt: targetDate.endOf('day').toDate(),
          },
          checkIn: {
            not: null
          },
          checkOut: null,
          deleted: false,
        }
      })

      if (queryAttendanceData) {
        errorFlag = true;
        req.error = "You have already checkin, please check again";
        let error: Error = new Error("You have already checkin, please check again");
        cb(error, null);
      }
    } else if (type.toUpperCase() == attendance.checkout) {
      const queryAttendanceData = await prisma.attendance.findFirst({
        where: {
          employee: {
            email: email,
          },
          attendanceDate: {
            gte: targetDate.startOf('day').toDate(),
            lt: targetDate.endOf('day').toDate(),
          },
          checkIn: {
            not: null
          },
          checkOut: {
            not: null
          },
          deleted: false,
        }
      })
      if (queryAttendanceData) {
        errorFlag = true;
        req.error = "You have already checkout, please check again";
        let error: Error = new Error("You have already checkout, please check again");
        cb(error, null);
      }
    }

    if (!queryEmployeeData) {
      req.error = "The email isn't exist";
      let error: Error = new Error("The email isn't exist");
      cb(error, null);
    }

    if (queryEmployeeData && !errorFlag) {
      //Check EmpID folder
      if (!fs.existsSync(`${directory}\\${queryEmployeeData.id}`)) {
        fs.mkdirSync(`${directory}\\${queryEmployeeData.id}`)
      }

      //Check Date folder
      if (!fs.existsSync(`${directory}/${queryEmployeeData.id}/${staticDateFolder}`)) {
        fs.mkdirSync(`${directory}/${queryEmployeeData.id}/${staticDateFolder}`)
      }

      console.log("MulterStorage: ", `${directory}\\${queryEmployeeData.id}\\${staticDateFolder}`)
      cb(null, `${directory}\\${queryEmployeeData.id}\\${staticDateFolder}`)
    }
  },
  filename: async (req: RequestWithProfile, file, cb) => {
    // const arrayUpload: { [fieldname: string]: Express.Multer.File[] } = (req.files as { [fieldname: string]: Express.Multer.File[] });
    const email = (req.query.email).toString();
    const type = (req.query.type).toString();
    const queryEmployeeData = await prisma.employee.findFirst({
      where: {
        email: email,
        deleted: false,
      }
    })

    if (req.error) {
      let error: Error = new Error(req.error);
      cb(error, null);
    } else {
      if (queryEmployeeData) {
        cb(null, `${queryEmployeeData.id}_${type}` + path.extname(file.originalname));
      } else {
        req.error = "The email isn't exist";
        let error: Error = new Error("The email isn't exist");
        cb(error, null);
      }
    }
  }
});

export const attendanceExceptionImageUpload = multer({
  storage: attendanceExceptionImageStorage,
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