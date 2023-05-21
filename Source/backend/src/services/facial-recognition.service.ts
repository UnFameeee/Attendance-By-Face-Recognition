import { ResponseData } from "../config/responseData.config";
import fs from 'fs';
import path from "path";

// import nodejs bindings to native tensorflow,
// not required, but will speed up things drastically (python required)
import '@tensorflow/tfjs-node';
// import * as tf from '@tensorflow/tfjs-node';
// implements nodejs wrappers for HTMLCanvasElement, HTMLImageElement, ImageData
import * as canvas from 'canvas';
import * as faceapi from '@vladmandic/face-api';
import { LabeledFaceDescriptors, WithFaceDescriptor } from "@vladmandic/face-api";
import { env } from "../config/env.config";
import { prisma } from "../database/prisma.singleton";
import { Helper } from "../utils/helper";

// patch nodejs environment, we need to provide an implementation of
// HTMLCanvasElement and HTMLImageElement, additionally an implementation
// of ImageData is required, in case you want to use the MTCNN
const { Canvas, Image, ImageData } = canvas
faceapi.env.monkeyPatch({ Canvas, Image, ImageData })

export class FacialRecognitionService {
  public trainAllModel = async (): Promise<ResponseData<any>> => {
    const response = new ResponseData<any>();
    const pathToImage = "/../public/training";
    const pathToModel: string = path.join(__dirname, "/../public/models");
    const pathToCanvas: string = path.join(__dirname, "/../public/canvas");

    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromDisk(pathToModel),
      faceapi.nets.faceRecognitionNet.loadFromDisk(pathToModel),
      faceapi.nets.faceLandmark68Net.loadFromDisk(pathToModel),
      faceapi.nets.faceExpressionNet.loadFromDisk(pathToModel),
      faceapi.nets.ageGenderNet.loadFromDisk(pathToModel),
    ])

    const folderName = fs.readdirSync(path.join(__dirname, pathToImage));
    const labelsArray = folderName;

    const labeledDescriptors = []
    for (const label of labelsArray) {
      // if(label == )
      const imageList = fs.readdirSync(path.join(__dirname, pathToImage, `/${label}`));
      const descriptors: any[] = [];
      for (let i = 0, imageListLength = imageList.length; i < imageListLength; ++i) {
        // Load the image
        const image = await canvas.loadImage(path.join(__dirname, pathToImage, `/${label}/${imageList[i]}`));

        // Resize the image
        // const resizedImage = faceapi.resizeResults(image, { width: 512, height: 512 });

        console.log(image)

        const detection = await faceapi.detectSingleFace(image, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.75, maxResults: 1 }))
          .withFaceLandmarks(false)
          .withAgeAndGender()
          .withFaceExpressions()
          .withFaceDescriptor();

        if (detection) {
          descriptors.push(detection.descriptor);
        } else {
          console.log("undefined");
        }
      }
      labeledDescriptors.push(new faceapi.LabeledFaceDescriptors(label, descriptors));
    }

    // create a FaceMatcher object
    //currently best: 0.55
    const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.51);

    const modelJSON = faceMatcher.toJSON();
    const modelName = "FaceMatcher.json";
    fs.writeFileSync(path.join(__dirname, `/../public/train-model/${modelName}`), JSON.stringify(modelJSON));

    response.result = true;
    return response;
  }

  public trainModel = async (employeeId: string): Promise<ResponseData<any>> => {
    const response = new ResponseData<any>();
    const pathToImage = "/../public/training";
    const pathToModel: string = path.join(__dirname, "/../public/models");
    const pathToFaceDescriptors: string = path.join(__dirname, "/../public/train-model");

    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromDisk(pathToModel),
      faceapi.nets.faceRecognitionNet.loadFromDisk(pathToModel),
      faceapi.nets.faceLandmark68Net.loadFromDisk(pathToModel),
      faceapi.nets.faceExpressionNet.loadFromDisk(pathToModel),
      faceapi.nets.ageGenderNet.loadFromDisk(pathToModel),
    ])

    const label = employeeId;
    const imageList = fs.readdirSync(path.join(__dirname, pathToImage, `/${label}`));
    // Load the previously trained face descriptors
    //JSON.parse to convert the file to JSON and then using the built in function to convert it (fromJSON)
    const JSONparseFaceMatcher = JSON.parse(fs.readFileSync(`${pathToFaceDescriptors}/FaceMatcher.json`).toString());
    const FaceMatcherFromJSON: faceapi.FaceMatcher = faceapi.FaceMatcher.fromJSON(JSONparseFaceMatcher);
    var labeledDescriptors: Array<LabeledFaceDescriptors | WithFaceDescriptor<any> | Float32Array> = FaceMatcherFromJSON.labeledDescriptors;

    const descriptors: any[] = [];
    for (let i = 0, imageListLength = imageList.length; i < imageListLength; ++i) {
      // Load the image
      const image = await canvas.loadImage(path.join(__dirname, pathToImage, `/${label}/${imageList[i]}`));

      // Resize the image
      // const resizedImage = faceapi.resizeResults(image, { width: 512, height: 512 });

      // console.log(resizedImage)
      console.log(image)

      const detection = await faceapi.detectSingleFace(image, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.75, maxResults: 1 }))
        .withFaceLandmarks(false)
        .withAgeAndGender()
        .withFaceExpressions()
        .withFaceDescriptor();

      if (detection) {
        descriptors.push(detection.descriptor);
      } else {
        console.log("undefined");
      }
    }

    //find whether the employeeId is trained or not, if the trained data already exist, delete it
    const index = labeledDescriptors.findIndex(item => item.label === employeeId);
    if (index != -1) {
      labeledDescriptors.splice(index, 1);
    }
    labeledDescriptors.push(new faceapi.LabeledFaceDescriptors(label, descriptors));

    // create a FaceMatcher object
    //currently best: 0.55
    const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.51);

    const modelJSON = faceMatcher.toJSON();
    const modelName = "FaceMatcher.json";
    fs.writeFileSync(path.join(__dirname, `/../public/train-model/${modelName}`), JSON.stringify(modelJSON));

    response.result = true;
    return response;
  }

  public uploadingImagesAndTraining = async (employeeId: string, files: { [fieldname: string]: Express.Multer.File[] }): Promise<ResponseData<any>> => {
    const response = new ResponseData<any>();
    const dataArray = [];

    console.log(files.images);

    for (let i = 0, length = files.images.length; i < length; ++i) {
      let link = `${env.SERVER_URL}/public${(files.images[i].destination).split("public")[1]}/${files.images[i].filename}`;

      let tempObj = {
        employeeId: employeeId,
        link: Helper.ConvertDoubleSlashURL(link),
      }

      dataArray.push(tempObj);
    }

    const queryData = await prisma.faceTrainingImage.createMany({
      data: dataArray
    })

    await prisma.employee.update({
      where: {
        id: employeeId,
      },
      data: {
        isTrain: true,
      }
    })

    if (queryData) {
      const pathToFaceDescriptors: string = path.join(__dirname, "/../public/train-model");
      const JSONparseFaceMatcher = JSON.parse(fs.readFileSync(`${pathToFaceDescriptors}/FaceMatcher.json`).toString());
      if (JSONparseFaceMatcher.labeledDescriptors.length != 0) {
        await this.trainModel(employeeId);
      } else {
        await this.trainAllModel();
      }
    }
    response.result = true;
    return response;
  }
}