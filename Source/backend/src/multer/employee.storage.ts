import multer from "multer";
import path from "path";
import { RequestWithProfile } from '../interfaces/request.interface';
import fs from 'fs';

const directory = "src/public/images/employee";
const imageStorage = multer.diskStorage({
  // Destination to store image     
  destination: async (req: RequestWithProfile, file, cb) => {
    // cb(null, `src/public/images/employee/${req.profile.id}`)
    if (!fs.existsSync(`${directory}/${req.profile.id}`)) {
      fs.mkdirSync(`${directory}/${req.profile.id}`)
    }
    cb(null, `${directory}/${req.profile.id}`)
  },
  filename: async (req: RequestWithProfile, file, cb) => {
    // cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));

    const arrayUpload: { [fieldname: string]: Express.Multer.File[] } = (req.files as { [fieldname: string]: Express.Multer.File[] });

    // for (const uploadedFile of arrayUpload.images) {
    // console.log(arrayUpload.images.length);
    // }   

    cb(null, `${req.profile.id}_${arrayUpload.images.length}` + path.extname(file.originalname));

    // console.log(`${req.profile.id}_${arrayUpload.images.length}` + path.extname(file.originalname))
  }
});

export const employeeImageUpload = multer({
  storage: imageStorage,
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

    // if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
    //   // upload only png - jpg -jpeg format
    //   return cb(new Error('Only support PNG, JPG, JPEG and file below 10mb'))
    // }
  }
})
  .fields([
    { name: "images", maxCount: 2 }
  ])