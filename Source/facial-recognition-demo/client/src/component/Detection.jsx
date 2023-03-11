import React, { useEffect, useRef, useState } from 'react';
import './Detection.css';
import * as faceapi from 'face-api.js';
import { toast } from 'react-toastify';
import Header from './Header';

export default function Detection() {
  const [modelsLoaded, setModelsLoaded] = useState(false);
  // const [faceMatcher, setFaceMatcher] = useState(null);
  const videoRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    async function loadModels() {
      if (!modelsLoaded) {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
          faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
          // faceapi.nets.faceExpressionNet.loadFromUri("/models"),
        ]).then(async () => {
          setModelsLoaded(true);
          toast("Finish load the model!");
        });
      }

      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          const video = videoRef.current;
          if (!video) {
            return;
          }
          video.srcObject = stream;
        })
        .catch(error => {
          // Handle errors, such as the user denying permission
          console.error('Error accessing camera:', error);
        });
    }

    async function trainModel() {
      //Training model
      const labels = ["QuocThang", "AnhMinh"]
      const faceDescriptors = []
      for (const label of labels) {
        const descriptors = [];
        for (let i = 1; i <= 2; ++i) {
          const image = await faceapi.fetchImage(`http://127.0.0.1:4000/images/${label}${i}.jpg`);
          const detection = await faceapi.detectSingleFace(image, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
          descriptors.push(detection.descriptor);
        }
        faceDescriptors.push(new faceapi.LabeledFaceDescriptors(label, descriptors));
      }
      toast("Finish train the model!");

      // setFaceMatcher(new faceapi.FaceMatcher(faceDescriptors, 0.6));

      return faceDescriptors;
    }

    async function addEvent() {
      const canvas = faceapi.createCanvas(videoRef.current);
      console.log("canvas: ", canvas);
      canvas.id = "canvas";
      const canvasElems = document.querySelectorAll('.template canvas');
      if (!canvasElems.length) {
        const a = document.querySelector('.template');
        a.append(canvas);
      }

      const displaySize = { width: 720, height: 560 }
      faceapi.matchDimensions(canvas, displaySize);

      //load the model
      const trainData = await trainModel();
      const faceMatcher = new faceapi.FaceMatcher(trainData, 0.6)

      intervalRef.current = setInterval(async () => {
        const detections = await faceapi
          // .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptors()

        const resizedDetections = faceapi.resizeResults(
          detections,
          displaySize
        );
        canvas
          .getContext('2d')
          .clearRect(0, 0, canvas.width, canvas.height);

        for (const detection of resizedDetections) {
          const box = detection.detection.box;
          const drawBox = new faceapi.draw.DrawBox(box, {
            label: faceMatcher.findBestMatch(detection.descriptor)
            // label: "Face"
          });
          drawBox.draw(canvas);
        }
        // faceapi.draw.drawDetections(canvas, resizedDetections);
        // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        // faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
      }, 100)
    }

    loadModels().then(async() => {
      await addEvent();
    });

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [])

  return (
    <>
      <Header />
      <div className="template">
        <video id="video" ref={videoRef} autoPlay={true} playsInline muted></video>
      </div>
    </>
  );
}