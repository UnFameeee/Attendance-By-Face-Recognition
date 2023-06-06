import multer from "multer";
import path from "path";
import fs from 'fs';
import { Request } from "express";
import { v4 } from "uuid";
import { timezoneConfig } from "../constant/moment-timezone.constant";
import moment from "moment";

const directory = path.join(__dirname, "../public/attendance-exception");
var now: Date;
var staticDateFolder: string;
const anonymousAttendanceImageStorage = multer.diskStorage({
  // Destination to store image     
  // Attendance - EmpID - Date - imageIn, imageOut
  destination: async (req: Request, file, cb) => {
    //config the datetime
    // now = new Date();
    // staticDateFolder = `${now.getFullYear()}_${now.getMonth() + 1}_${now.getDate()}`;
    const momentNow = moment(new Date()).tz(timezoneConfig);
    staticDateFolder = momentNow.format("YYYY-MM-DD");
    
    //Check Date folder
    if (!fs.existsSync(`${directory}/${staticDateFolder}`)) {
      fs.mkdirSync(`${directory}/${staticDateFolder}`)
    }

    console.log("MulterStorage: ", `${directory}/${staticDateFolder}`)
    cb(null, `${directory}/${staticDateFolder}`)

  },
  filename: async (req: Request, file, cb) => {
    // const arrayUpload: { [fieldname: string]: Express.Multer.File[] } = (req.files as { [fieldname: string]: Express.Multer.File[] });
    cb(null, `${v4()}` + path.extname(file.originalname));
  }
});

export const anonymousAttendanceImageUpload = multer({
  storage: anonymousAttendanceImageStorage,
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