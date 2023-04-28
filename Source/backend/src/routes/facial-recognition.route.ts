import { Router } from "express";
import { Routes } from "../interfaces/routes.interface";
import { authMiddleware } from '../middlewares/authentication.middleware';
import { authorizeRoute } from '../middlewares/authorization.middleware';
import { PERMISSION, RESOURCE } from '../constant/database.constant';
import { FacialRecognitionController } from "../controllers/facial-recognition.controller";
import { trainingImagesUpload } from "../multer/training.storage";

export class FacialRecognitionRoute implements Routes {
  public path = "/facialRecognition";
  public router = Router();
  public facialRecognitionController = new FacialRecognitionController();

  constructor() {
    this.initializeRoutes();
  }

  //1. lưu hình ảnh -> gọi model -> train data -> save model
  //2. Update (temporary the flow will be exactly like the saving image)
  //3. Trouble shooting flow. Choose the employee having error with it -> delete the images -> adding new picture of the error emp -> train data with all the image 
  //4. Back ground job. After {time} train the model once and save it into the data folder (optional)

  // If we have the background job running, we will solve the problem of delete and update the image.

  private async initializeRoutes() {
    // api/facialRecognition/trainModel/:employeeId
    this.router.post(`${this.path}/trainModel/:employeeId`,
      // authMiddleware,
      // await authorizeRoute(PERMISSION.READ, RESOURCE.FACIAL)
      this.facialRecognitionController.trainModel
    )

    // api/facialRecognition/trainAllModel
    this.router.post(`${this.path}/trainAllModel`,
      // authMiddleware,
      // await authorizeRoute(PERMISSION.READ, RESOURCE.FACIAL)
      this.facialRecognitionController.trainAllModel
    )

    // api/facialRecognition/uploadingImagesAndTraining
    this.router.post(`${this.path}/uploadingImagesAndTraining`,
      authMiddleware,
      // await authorizeRoute(PERMISSION.READ, RESOURCE.FACIAL)
      trainingImagesUpload,
      this.facialRecognitionController.uploadingImagesAndTraining
    )
  }
}