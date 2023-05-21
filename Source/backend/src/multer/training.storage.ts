import multer from "multer";
import path from "path";
import { RequestWithProfile } from '../interfaces/request.interface';
import fs from 'fs';

const directory = path.join(__dirname, "../public/training");

const trainingImagesStorage = multer.diskStorage({
  // Destination to store image     
  destination: async (req: RequestWithProfile, file, cb) => {
    const employeeId: string = (req.query.employeeId).toString();

    if (!fs.existsSync(`${directory}/${employeeId}`)) {
      fs.mkdirSync(`${directory}/${employeeId}`)
    }
    console.log("MulterStorage: ", `${directory}\\${employeeId}`)
    cb(null, `${directory}\\${employeeId}`)
  },
  filename: async (req: RequestWithProfile, file, cb) => {
    const employeeId: string = (req.query.employeeId).toString();

    const arrayUpload: { [fieldname: string]: Express.Multer.File[] } = (req.files as { [fieldname: string]: Express.Multer.File[] });

    // console.log(arrayUpload);

    cb(null, `${employeeId}_${arrayUpload.images.length}` + path.extname(file.originalname));
  }
});

export const trainingImagesUpload = multer({
  storage: trainingImagesStorage,
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
  { name: "images", maxCount: 50 }
])