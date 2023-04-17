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

// patch nodejs environment, we need to provide an implementation of
// HTMLCanvasElement and HTMLImageElement, additionally an implementation
// of ImageData is required, in case you want to use the MTCNN
const { Canvas, Image, ImageData } = canvas
faceapi.env.monkeyPatch({ Canvas, Image, ImageData })

export class FacialRecognitionService {
  public trainAllModel = async (): Promise<ResponseData<any>> => {
    const response = new ResponseData<any>();
    const pathToImage = "/../public/images/employee";
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
        const resizedImage = faceapi.resizeResults(image, { width: 512, height: 512 });

        // //save the cut image
        // // create canvas with desired dimensions
        // const testCanvas = canvas.createCanvas(5000, 5000);
        // const ctx = testCanvas.getContext('2d');
        // ctx.drawImage(image, 0, 0);
        // // save canvas as PNG file
        // const out = fs.createWriteStream(`${pathToCanvas}/${label}_${i}.png`);
        // const stream = testCanvas.createPNGStream();
        // await stream.pipe(out);
        // await out.on('finish', () => console.log('Image saved.'));

        console.log(resizedImage)

        const detection = await faceapi.detectSingleFace(resizedImage, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.75, maxResults: 1 }))
          .withFaceLandmarks(false)
          .withAgeAndGender()
          .withFaceExpressions()
          .withFaceDescriptor();
        descriptors.push(detection.descriptor);
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
    const pathToImage = "/../public/images/employee";
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
      const resizedImage = faceapi.resizeResults(image, { width: 512, height: 512 });

      console.log(resizedImage)

      const detection = await faceapi.detectSingleFace(resizedImage, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.75, maxResults: 1 }))
        .withFaceLandmarks(false)
        .withAgeAndGender()
        .withFaceExpressions()
        .withFaceDescriptor();
      descriptors.push(detection.descriptor);
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
}