import multer from "multer";
import path from "path";
import { RequestWithProfile } from '../interfaces/request.interface';
import fs from 'fs';

const directory = path.join(__dirname, "../public/images/employee");

const imageStorage = multer.diskStorage({
  // Destination to store image     
  destination: async (req: RequestWithProfile, file, cb) => {
    // cb(null, `src/public/images/employee/${req.profile.id}`)
    if (!fs.existsSync(`${directory}/${req.profile.id}`)) {
      fs.mkdirSync(`${directory}/${req.profile.id}`)
    }
    console.log("MulterStorage: ", `${directory}/${req.profile.id}`)
    cb(null, `${directory}/${req.profile.id}`)
  },
  filename: async (req: RequestWithProfile, file, cb) => {
    const queryParam = req.query;

    const arrayUpload: { [fieldname: string]: Express.Multer.File[] } = (req.files as { [fieldname: string]: Express.Multer.File[] });

    //Logic for no specify an index image
    if (Object.keys(queryParam).length === 0) {
      cb(null, `${req.profile.id}_${arrayUpload.images.length}` + path.extname(file.originalname));
    }
    //If we specify an index image need to be uploaded
    else {
      const index: number = parseInt((queryParam.index).toString());
      //If wrong index (only 1 and 2)
      if (index != 1 && index != 2) {
        cb(new Error("Wrong index param, please try again!"), null);
      } else {
        cb(null, `${req.profile.id}_${index}` + path.extname(file.originalname));
      }
    }
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