import React, { useEffect, useRef, useState } from 'react';
import "./FaceAttendance.css"
import * as faceapi from '@vladmandic/face-api';

import {
  useToast,
} from "@chakra-ui/react";
import axiosBase from '../../../Utils/AxiosInstance';
import { useMutation } from 'react-query';
import { attendanceService } from '../../../services/attendance/attendance';
import { Helper } from '../../../Utils/Helper';

let streamObj;
export default function FaceAttendance() {
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const videoRef = useRef(null);
  const intervalRef = useRef(null);
  const toast = useToast();

  const useTakeAttendance = useMutation((variable) =>
    attendanceService.takeAttendance(variable.employeeId, variable.attendanceType), {

    onSuccess: (data) => {
      toast({
        title: 'Checkin',
        description: data.result,
        position: "top",
        status: "success",
        variant: 'subtle',
        isClosable: true,
        duration: 5000,
      });

      setIsPaused(true);
      setTimeout(() => {
        setIsPaused(false);
      }, 10000);
    },
    onError: (error) => {
      console.log(error);
    }
  })

  useEffect(() => {
    async function loadingModels() {
      if (!modelsLoaded) {
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
          faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        ]).then(async () => {
          setModelsLoaded(true);
          toast({
            title: "Finish load the model!",
            position: "bottom-right",
            status: "info",
            isClosable: true,
            duration: 5000,
          });
        });
      }
    }
    loadingModels();

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        const video = videoRef.current;
        if (!video) {
          return;
        }
        video.srcObject = stream;
        // Save the stream object for later use
        streamObj = stream;
        // video.style.transform = 'scaleX(-1)';
      })
      .catch(error => {
        // Handle errors, such as the user denying permission
        console.error('Error accessing camera:', error);
      });
  }, []);

  useEffect(() => {
    const canvas = faceapi.createCanvas(videoRef.current);
    canvas.id = "canvas";
    const canvasElems = document.querySelectorAll('.template canvas');
    if (!canvasElems.length) {
      const template = document.querySelector('.template');
      template.append(canvas);
    }

    const displaySize = { width: 720, height: 560 }
    faceapi.matchDimensions(canvas, displaySize);

    async function addEvent() {
      //load the model
      const trainedFaceMatcherJson = await axiosBase.get(`/public/train-model/FaceMatcher.json`);
      const faceMatcher = faceapi.FaceMatcher.fromJSON(trainedFaceMatcherJson.data);

      const faceDetectArray = [];
      const realtimeFaceRegconition = async () => {
        if (!useTakeAttendance.isLoading) {
          const detections = await faceapi
            .detectAllFaces(videoRef.current, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.75, maxResults: 1 }))
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
            let faceDetected = faceMatcher.findBestMatch(detection.descriptor);
            const box = detection.detection.box;
            const drawBox = new faceapi.draw.DrawBox(box, {
              label: faceDetected
            });

            if (!isPaused) {
              faceDetectArray.push(faceDetected.label);
              console.log(faceDetectArray);
              if (faceDetectArray.length >= 3) {
                const data = {
                  employeeId: Helper.findMostDuplicatedValue(faceDetectArray),
                  attendanceType: "FACE",
                }
                //Xử lý data
                useTakeAttendance.mutate(data);

                faceDetectArray.splice(0, faceDetectArray.length);
              }
            }

            drawBox.draw(canvas);
          }
        }
      }

      intervalRef.current = setInterval(realtimeFaceRegconition, 1000);
    }

    // loadingModels().then(async () => {
    // });
    addEvent();

    return () => {
      clearInterval(intervalRef.current);
      // if (streamObj) {
      //   streamObj.getTracks().forEach(track => track.stop());
      // }
    };
  }, [isPaused])

  useEffect(() => {
    return () => {
      if (streamObj) {
        streamObj.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <>
      <div className="template">
        <video id="video" ref={videoRef} autoPlay={true} playsInline muted></video>
      </div>
    </>
  );
}
