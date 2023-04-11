// import React, { useEffect, useRef, useState } from 'react';
// import "./FaceAttendance.css"
// // import '@tensorflow/tfjs-node';
// import * as faceapi from '@vladmandic/face-api';

// import {
//   useToast,
// } from "@chakra-ui/react";
// import axiosBase, { baseURL } from '../../../Utils/AxiosInstance';

// let streamObj;
// export default function FaceAttendance() {
//   const [modelsLoaded, setModelsLoaded] = useState(false);
//   const videoRef = useRef(null);
//   const intervalRef = useRef(null);
//   const toast = useToast();

//   useEffect(() => {
//     async function loadModels() {

//       const model_url = `${baseURL}/public/models`
//       if (!modelsLoaded) {
//         await Promise.all([
//           faceapi.nets.ssdMobilenetv1.loadFromUri(`${model_url}`),
//           faceapi.nets.faceRecognitionNet.loadFromUri(`${model_url}`),
//           faceapi.nets.faceLandmark68Net.loadFromUri(`${model_url}`),
//         ]).then(async () => {
//           setModelsLoaded(true);
//           toast({
//             title: "Finish load the model!",
//             position: "bottom-right",
//             status: "info",
//             isClosable: true,
//             duration: 5000,
//           });
//         });
//       }

//       navigator.mediaDevices
//         .getUserMedia({ video: true })
//         .then((stream) => {
//           const video = videoRef.current;
//           if (!video) {
//             return;
//           }
//           video.srcObject = stream;
//           // Save the stream object for later use
//           streamObj = stream;
//           // video.style.transform = 'scaleX(-1)';
//         })
//         .catch(error => {
//           // Handle errors, such as the user denying permission
//           console.error('Error accessing camera:', error);
//         });
      
//     }

//     // async function trainModel() {
//     //   //Training model
//     //   const labels = ["acb72415-a002-47ae-97d6-401c2cba87b9"]
//     //   const faceDescriptors = []
//     //   for (const label of labels) {
//     //     const descriptors = [];
//     //     for (let i = 1; i <= 2; ++i) {
//     //       const image = await faceapi.fetchImage(`${baseURL}/public/images/employee/${label}/${label}_${i}.jpg`);
//     //       const detection = await faceapi.detectSingleFace(image, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
//     //       descriptors.push(detection.descriptor);
//     //     }
//     //     faceDescriptors.push(new faceapi.LabeledFaceDescriptors(label, descriptors));
//     //   }

//     //   const duration = (endTime.getTime() - startTime.getTime()) / 1000;
//     //   toast({
//     //     title: `Finish train the model! - Duration: ${duration} seconds`,
//     //     position: "bottom-right",
//     //     status: "info",
//     //     isClosable: true,
//     //     duration: 5000,
//     //   });
//     //   return faceDescriptors;
//     // }

//     async function addEvent() {
//       const canvas = faceapi.createCanvas(videoRef.current);
//       console.log("canvas: ", canvas);
//       canvas.id = "canvas";
//       const canvasElems = document.querySelectorAll('.template canvas');
//       if (!canvasElems.length) {
//         const a = document.querySelector('.template');
//         a.append(canvas);
//       }

//       const displaySize = { width: 720, height: 560 }
//       faceapi.matchDimensions(canvas, displaySize);

//       //load the model
//       const trainedFaceMatcherJson = await axiosBase.get(`/public/train-model/trainedFaceMatcher.json`);
//       const faceMatcher = faceapi.FaceMatcher.fromJSON(trainedFaceMatcherJson.data);
      
//       // const trainData = await trainModel();
//       // const faceMatcher = new faceapi.FaceMatcher(trainData, 0.46);

//       intervalRef.current = setInterval(async () => {
//         const detections = await faceapi
//           .detectAllFaces(videoRef.current, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.2, maxResults: 1 }))
//           .withFaceLandmarks()
//           .withFaceDescriptors()

//         const resizedDetections = faceapi.resizeResults(
//           detections,
//           displaySize
//         );
//         canvas
//           .getContext('2d')
//           .clearRect(0, 0, canvas.width, canvas.height);

//         for (const detection of resizedDetections) {
//           const box = detection.detection.box;
//           const drawBox = new faceapi.draw.DrawBox(box, {
//             label: faceMatcher.findBestMatch(detection.descriptor)
//           });
//           drawBox.draw(canvas);
//         }
//         // faceapi.draw.drawDetections(canvas, resizedDetections);
//         // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
//         // faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
//       }, 1000)
//     }

//     loadModels().then(async () => {
//       await addEvent();
//     });

//     return () => {
//       clearInterval(intervalRef.current);
//       if (streamObj) {
//         streamObj.getTracks().forEach(track => track.stop());
//       }
//     };
//   }, [])

//   return (
//     <>
//       <div className="template">
//         <video id="video" ref={videoRef} autoPlay={true} playsInline muted></video>
//       </div>
//     </>
//   );
// }
