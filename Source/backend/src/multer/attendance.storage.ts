import multer from "multer";
import path from "path";
import fs from 'fs';
import { Request } from "express";

const directory = path.join(__dirname, "../public/attendance");

const attendanceImageStorage = multer.diskStorage({
  // Destination to store image     
  //Attendance - EmpID - Date - imageIn, imageOut
  destination: async (req: Request, file, cb) => {
    const employeeId: string = (req.query.employeeId).toString();

    //Check EmpID folder
    if (!fs.existsSync(`${directory}\\${employeeId}`)) {
      fs.mkdirSync(`${directory}\\${employeeId}`)
    }
    const now = new Date();
    const staticDateFolder = `${now.getFullYear()}_${now.getMonth() + 1}_${now.getDate()}`;
    //Check Date folder
    if (!fs.existsSync(`${directory}/${employeeId}/${staticDateFolder}`)) {
      fs.mkdirSync(`${directory}/${employeeId}/${staticDateFolder}`)
    }

    console.log("MulterStorage: ", `${directory}/${employeeId}`)
    cb(null, `${directory}/${employeeId}`)
  },
  filename: async (req: Request, file, cb) => {
    const employeeId: string = (req.query.employeeId).toString();
    // const arrayUpload: { [fieldname: string]: Express.Multer.File[] } = (req.files as { [fieldname: string]: Express.Multer.File[] });
    cb(null, `${employeeId}_${Date.now()}` + path.extname(file.originalname));
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