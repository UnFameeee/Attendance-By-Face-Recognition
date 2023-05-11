import React, { useEffect, useRef, useState } from 'react'
import * as faceapi from '@vladmandic/face-api';
import { Box, Button, Img, Progress, Text, useToast } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import Webcam from 'react-webcam';
import Mask from "./mask.svg";
import axiosBase from '../../../Utils/AxiosInstance';
import "./TrainingFace.css";
import InstructionModal from '../../../components/Training/InstructionModal';
import FinishModal from '../../../components/Training/FinishModal';

let streamTrainingObj;
const limitPictures = 2;
export default function TrainingFace() {
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const videoRef = useRef(null);
  const intervalRef = useRef(null);
  const toast = useToast();
  const dispatch = useDispatch();
  const [capturedImages, setCapturedImages] = useState([]);
  const [isScaningPaused, setIsScaningPaused] = useState(true);
  const [startTraining, setStartTraining] = useState(false);
  const [finishScanning, setFinishScanning] = useState(false);

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
        streamTrainingObj = stream;
      })
      .catch(error => {
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

    const videoResolution = document.getElementById("video_training");
    const resolution = {
      width: videoResolution.offsetWidth,
      height: videoResolution.offsetHeight,
    }
    const displaySize = resolution;
    faceapi.matchDimensions(canvas, displaySize);

    async function addEvent() {
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
      setFinishScanning(true);
      console.log(capturedImages.length);
    }
  }, [capturedImages])

  const startTrainingHandleClick = () => {
    setStartTraining(true);
    setIsScaningPaused(false);
  }

  return (
    <Box width={"100%"} height={"100%"} style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
    }}>
      <div className="template_training">
        <Img style={{
          position: "absolute",
          height: "50vh",
          top: "44%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 4,
        }} src={Mask} />
        <Webcam style={{
          height: "88vh",
          width: "100%",
          objectFit: "cover",
          transform: "rotateY(180deg)",
          WebkitTransform: "rotateY(180deg)",
          MozTransform: "rotateY(180deg)",
        }} id='video_training' ref={videoRef} audio={false} screenshotFormat="image/jpeg" ></Webcam>
      </div>
      <Box width={"100%"} height={"10vh"} display={"flex"} justifyContent={"center"} alignItems={"center"} flexDirection={"column"}>
        {
          !startTraining &&
          <Button
            onClick={startTrainingHandleClick}
            padding={"1.5rem"}
            textColor={"white"}
            fontWeight={600}
            fontSize={"1.2rem"}
            background={"linear-gradient(90deg, rgba(72,180,255,1) 0%, rgba(36,72,255,1) 100%)"}
            _hover={{
              background: "linear-gradient(90deg, rgba(118,199,255,1) 0%, rgba(61,94,255,1) 100%)"
            }}
          >
            Scan My Face
          </Button>
        }
        {
          startTraining &&
          <>
            <Text fontSize={"1.35rem"} fontWeight={500} >TRAINING PROGRESS</Text>
            <Progress background={"#e1e1e1"} colorScheme='blue' height='1.75rem' width={"80%"} value={(capturedImages.length / limitPictures) * 100} />
          </>
        }
      </Box>
      <InstructionModal />
      <FinishModal openModal={finishScanning} />
    </Box>
  )
}
