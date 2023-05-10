import React, { useEffect, useRef, useState } from 'react'
import * as faceapi from '@vladmandic/face-api';
import { Box, Img, Progress, Text, useToast } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import Webcam from 'react-webcam';
import axiosBase from '../../../Utils/AxiosInstance';
import "./TrainingFace.css";

let streamTrainingObj;
const limitPictures = 2;
export default function TrainingFace() {
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const videoRef = useRef(null);
  const intervalRef = useRef(null);
  const toast = useToast();
  const dispatch = useDispatch();
  const [capturedImages, setCapturedImages] = useState([]);
  const [isScaningPaused, setIsScaningPaused] = useState(false);

  // const useSaveImageOfAttendance = useMutation((variable) =>
  //   attendanceService.saveImageOfAttendance(variable), {
  //   onSuccess: (data) => {
  //     useTakeAttendance.mutate({
  //       employeeId: employeeId,
  //       attendanceType: "FACE",
  //       image: data.result,
  //     });
  //   },
  //   onError: (error) => {
  //     console.log(error);
  //     toast({
  //       title: error.response.data.message,
  //       position: "bottom-right",
  //       status: "error",
  //       isClosable: true,
  //       duration: 5000,
  //     });
  //   },
  // })

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
        streamTrainingObj = stream;
        // video.style.transform = 'scaleX(-1)';
      })
      .catch(error => {
        // Handle errors, such as the user denying permission
        console.error('Error accessing camera:', error);
      });
  }, []);

  useEffect(() => {
    const canvas = faceapi.createCanvas(videoRef.current);
    canvas.id = "canvas_training";
    const canvasElems = document.querySelectorAll('.template_training #canvas_training');
    if (!canvasElems.length) {
      const template = document.querySelector('.template_training');
      template.append(canvas);
    }

    // const displaySize = { width: 720, height: 560 }
    const videoResolution = document.getElementById("video_training");
    // console.log(videoResolution.offsetWidth)
    // console.log(videoResolution.offsetHeight)
    const resolution = {
      width: videoResolution.offsetWidth,
      height: videoResolution.offsetHeight,
    }
    const displaySize = resolution;
    faceapi.matchDimensions(canvas, displaySize);

    async function addEvent() {
      //load the model
      // const FaceMatcherJson = await axiosBase.get(`/public/train-model/FaceMatcher.json`);
      // const faceMatcher = faceapi.FaceMatcher.fromJSON(FaceMatcherJson.data);

      // const faceDetectArray = [];
      const realtimeFaceRegconition = async () => {
        const detections = await faceapi
          // .detectAllFaces(videoRef.current, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.75, maxResults: 1 }))
          .detectAllFaces(videoRef.current.video, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.75, maxResults: 1 }))
          .withFaceLandmarks()
          .withFaceDescriptors()

        if (!isScaningPaused) {
          console.log(detections);
          if (detections.length !== 0) {
            const image = videoRef.current.getScreenshot();
            setCapturedImages(prevImages => [...prevImages, image]);
          }
  
          const resizedDetections = faceapi.resizeResults(
            detections,
            displaySize
          );
  
          canvas
            .getContext('2d')
            .clearRect(0, 0, canvas.width, canvas.height);
  
          for (const detection of resizedDetections) {
            // let faceDetected = faceMatcher.findBestMatch(detection.descriptor);
            const box = detection.detection.box;
            const drawBox = new faceapi.draw.DrawBox(box,
              // {
              //   label: faceDetected
              // }
            );
            drawBox.draw(canvas);
          }
        }
      }
      intervalRef.current = setInterval(realtimeFaceRegconition, 1000);
    }
    addEvent();

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [videoRef, isScaningPaused])

  useEffect(() => {
    return () => {
      if (streamTrainingObj) {
        streamTrainingObj.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (capturedImages.length >= limitPictures) {
      setIsScaningPaused(true);
      console.log(capturedImages.length);
    }
  }, [capturedImages])

  return (
    <Box width={"100%"} height={"100%"} style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
    }}>
      <div className="template_training">
        <Webcam style={{
          // display: "flex",
          // width: "1244px",
          // height: "100%",
          height: "88vh",
          width: "100%",
          objectFit: "cover",
        }} id='video_training' ref={videoRef} audio={false} screenshotFormat="image/jpeg" ></Webcam>
      </div>
      {/* <div>
        <Img style={{ border: "1px solid red" }} id='captureImage_training' src={null} />
      </div> */}
      <Box width={"100%"} height={"10vh"} display={"flex"} justifyContent={"center"} alignItems={"center"} flexDirection={"column"}>
        <Text fontSize={"1.35rem"} fontWeight={500} >TRAINING PROGRESS</Text>
        {/* <Progress colorScheme='green' height='1.75rem' width={"80%"} value={20} /> */}
        <Progress colorScheme='green' height='1.75rem' width={"80%"} value={(capturedImages.length / limitPictures) * 100} />
      </Box>
    </Box>
  )
}
