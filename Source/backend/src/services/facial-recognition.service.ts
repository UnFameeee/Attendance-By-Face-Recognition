import { env } from "../config/env.config";
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

// patch nodejs environment, we need to provide an implementation of
// HTMLCanvasElement and HTMLImageElement, additionally an implementation
// of ImageData is required, in case you want to use the MTCNN
const { Canvas, Image, ImageData } = canvas
faceapi.env.monkeyPatch({ Canvas, Image, ImageData })

export class FacialRecognitionService {
  public trainModel = async (): Promise<ResponseData<any>> => {
    const response = new ResponseData<any>();
    const pathToImage = "/../public/images/employee";
    const pathToModel: string = path.join(__dirname, "/../public/models");

    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromDisk(pathToModel),
      faceapi.nets.faceRecognitionNet.loadFromDisk(pathToModel),
      faceapi.nets.faceLandmark68Net.loadFromDisk(pathToModel),
    ])

    const folderName = fs.readdirSync(path.join(__dirname, pathToImage));
    const labelsArray = folderName;

    const labeledDescriptors = []
    for (const label of labelsArray) {
      const imageList = fs.readdirSync(path.join(__dirname, pathToImage, `/${label}`));

      const descriptors: any[] = [];
      for (let i = 0, imageListLength = imageList.length; i < imageListLength; ++i) {
        // const image = await faceapi.fetchImage(`${env.SERVER_URL}/public/images/employee/${label}/${imageList[i]}`);
        const image = await canvas.loadImage(`${env.SERVER_URL}/public/images/employee/${label}/${imageList[i]}`);
        console.log(image)

        const detection = await faceapi.detectSingleFace(image, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.2, maxResults: 1 }))
          .withFaceLandmarks()
          .withFaceDescriptor();

        descriptors.push(detection.descriptor);
      }
      labeledDescriptors.push(new faceapi.LabeledFaceDescriptors(label, descriptors));
    }

    // create a FaceMatcher object
    const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.56);

    const modelJSON = faceMatcher.toJSON();
    const modelName = "trainedFaceMatcher.json";
    fs.writeFileSync(path.join(__dirname, `/../public/train-model/${modelName}`), JSON.stringify(modelJSON));

    response.result = true;
    return response;
  }
}