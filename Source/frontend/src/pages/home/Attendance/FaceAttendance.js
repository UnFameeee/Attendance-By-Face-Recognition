import React, { useEffect, useRef, useState } from 'react';
import "./FaceAttendance.css"
import * as faceapi from '@vladmandic/face-api';

import {
  Box,
  Img,
  Text,
  useToast,
} from "@chakra-ui/react";
// import axiosBase from '../../../Utils/AxiosInstance';
import { useMutation } from 'react-query';
import { attendanceService } from '../../../services/attendance/attendance';
import { Helper } from '../../../Utils/Helper';
import AttendanceModal from '../../../components/Attendance/AttendanceModal';
import { useDispatch, useSelector } from 'react-redux';
import { setAttendanceModalProps } from '../../../store/Slice/AttendanceSlice/attendanceModalSlice';
import { setIsScaningPaused, setIsTakeAttendance } from '../../../store/Slice/AttendanceSlice/takeAttendanceSlice';
import ExceptionModel from '../../../components/Attendance/ExceptionModal';
import Webcam from 'react-webcam'
import { resetFailedCount, setExceptionModalOpen } from '../../../store/Slice/AttendanceSlice/exceptionModalSlice';
import { setImageCapture, setImageExceptionCapture } from '../../../store/Slice/AttendanceSlice/attendanceStorageSlice';
import axiosFaceBase from '../../../Utils/AxiosFaceInstance';
// const WebcamComponent = () => <Webcam />

let streamObj;
var unknownCount = 0;
const textArr = [
  {
    title:"READY",
    color:'yellow.500'
  },
  {
    title:"PROCESSING",
    color:'blue.500'
  },
  {
    title:"COMPLETED",
    color:'green.500'
  },
  {
    title:"STOPPED",
    color:'red.500'
  },
  // "READY", "PROCESSING", "COMPLETED", "STOPPED"
]
export default function FaceAttendance() {
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const videoRef = useRef(null);
  const intervalRef = useRef(null);
  const toast = useToast();
  const [textProgress, setTextProgress] = useState({
    title:"READY",
    color:'black'
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const dispatch = useDispatch();
  const { isScaningPaused, isTakeAttendance } = useSelector(state => state.takeAttendance);
  const imageCapture = useSelector(state => state.attendanceStorage.imageCapture);
  const employeeId = useSelector(state => state.attendanceModal.employeeId);
  const { isAttendanceModalOpen } = useSelector((state) => state.attendanceModal);
  const { isExceptionModalOpen } = useSelector(state => state.exceptionModal);

  const useSaveImageOfAttendance = useMutation(({ employeeId, formData }) =>
    attendanceService.saveImageOfAttendance(employeeId, formData), {
    onSuccess: (data) => {
      if (data.result) {
        const time = new Date();
        useTakeAttendance.mutate({
          employeeId: employeeId,
          attendanceType: "FACE",
          image: data?.result,
          date: `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}`,
        });
      }
    },
  })

  const useTakeAttendance = useMutation((variable) =>
    attendanceService.takeAttendance(variable), {
    onSuccess: (data) => {
      dispatch(setIsTakeAttendance({
        isTakeAttendance: false,
      }))

      if (data.message) {
        toast({
          title: 'Attendance Result',
          description: data.message,
          position: "top",
          status: "error",
          variant: 'subtle',
          duration: 5000,
          containerStyle: {
            width: "30vw",
            padding: "0.3rem",
            fontSize: "1.25rem",
            textAlign: "center",
          },
        });
      } else {
        toast({
          title: 'Attendance Result',
          description: data.result,
          position: "top",
          status: "success",
          variant: 'subtle',
          duration: 5000,
          containerStyle: {
            width: "30vw",
            padding: "0.3rem",
            fontSize: "1.25rem",
            textAlign: "center",
          },
        });
      }

      setTimeout(() => {
        dispatch(setIsScaningPaused({
          isScaningPaused: false,
        }))
      }, 5000);
    },

    onError: (error) => {
      console.log(error);
      toast({
        title: error.response.data.message,
        position: "top",
        status: "error",
        isClosable: true,
        duration: 5000,
      });
    },
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
            title: "Loading the data...",
            position: "top",
            status: "info",
            duration: 5000,
            containerStyle: {
              width: "18vw",
              padding: "0.25rem",
              fontSize: "1.25rem",
              textAlign: "center",
            },
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
    // const canvas = faceapi.createCanvas(videoRef.current);
    // canvas.id = "canvas";
    // const canvasElems = document.querySelectorAll('.template canvas');
    // if (!canvasElems.length) {
    //   const template = document.querySelector('.template');
    //   template.append(canvas);
    // }

    // const displaySize = { width: 720, height: 560 }
    const videoResolution = document.getElementById("video");
    const resolution = {
      width: videoResolution.offsetWidth,
      height: videoResolution.offsetHeight,
    }
    const displaySize = resolution;
    // faceapi.matchDimensions(canvas, displaySize);

    async function addEvent() {
      //load the model

      const FaceMatcherJson = await axiosFaceBase.get(`/public/train-model/FaceMatcher.json`)
      const faceMatcher = faceapi.FaceMatcher.fromJSON(FaceMatcherJson.data);

      const faceDetectArray = [];
      const realtimeFaceRegconition = async () => {
        if (!useTakeAttendance.isLoading) {
          const detections = await faceapi
            // .detectAllFaces(videoRef.current, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.75, maxResults: 1 }))
            .detectAllFaces(videoRef.current.video, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.85, maxResults: 1 }))
            .withFaceLandmarks()
            .withFaceDescriptors()
            
          if(detections.length === 0){
            setIsProcessing(false)
          } else {
            setIsProcessing(true)
          }

          const resizedDetections = faceapi.resizeResults(
            detections,
            displaySize
          );

          // canvas
          //   .getContext('2d')
          //   .clearRect(0, 0, canvas.width, canvas.height);

          for (const detection of resizedDetections) {
            let faceDetected = faceMatcher.findBestMatch(detection.descriptor);
            console.log(faceDetected.distance);
            // const box = detection.detection.box;
            // const drawBox = new faceapi.draw.DrawBox(box, {
            //   label: faceDetected
            // });

            if (!isScaningPaused) {
              faceDetectArray.push(faceDetected.label);
              console.log(faceDetected.label)
              if (faceDetected.label == "unknown") {
                // setUnknownCount((prevValue) => prevValue + 1);
                unknownCount++;
                console.log(unknownCount)
                if (unknownCount === 15) {
                  //remove the data in the detection array
                  faceDetectArray.splice(0, faceDetectArray.length);

                  dispatch(setImageExceptionCapture({
                    imageExceptionCapture: videoRef.current.getScreenshot(),
                  }))

                  unknownCount = 0;
                  dispatch(resetFailedCount());
                  dispatch(setIsScaningPaused({
                    isScaningPaused: true,
                  }))
                  dispatch(setExceptionModalOpen({
                    isExceptionModalOpen: true,
                  }))
                }
              }

              console.log(faceDetectArray);
              if (faceDetectArray.length >= 3) {
                //if the case isn't "unknown"
                const highestFaceValue = Helper.findMostDuplicatedValue(faceDetectArray);
                if (highestFaceValue !== "unknown") {
                  unknownCount = 0;

                  dispatch(setIsScaningPaused({
                    isScaningPaused: true,
                  }))

                  dispatch(setAttendanceModalProps({
                    isAttendanceModalOpen: true,
                    employeeId: highestFaceValue
                  }))

                  dispatch(setImageCapture({
                    imageCapture: videoRef.current.getScreenshot(),
                  }))

                  dispatch(setImageExceptionCapture({
                    imageExceptionCapture: videoRef.current.getScreenshot(),
                  }))
                }

                faceDetectArray.splice(0, faceDetectArray.length);
              }
            }
            // drawBox.draw(canvas);
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
    if (isTakeAttendance) {
      const handleSaveUploadImages = async () => {
        const formData = new FormData();
        var file = await Helper.convertBase64ToFile(imageCapture, 'image.jpg')
        formData.append('images', file);
        useSaveImageOfAttendance.mutate({
          employeeId: employeeId,
          formData: formData
        });
      }
      handleSaveUploadImages();
    }
  }, [isTakeAttendance]);

  useEffect(() => {
    // console.log("isAttendanceModalOpen: ", isAttendanceModalOpen)
    // console.log("isExceptionModalOpen: ", isExceptionModalOpen)
    // console.log("isProcessing: ", isProcessing)

    //"READY", "PROCESSING", "COMPLETED", "STOPPED"
    if (!isProcessing && !isScaningPaused && !isAttendanceModalOpen && !isExceptionModalOpen) {
      setTextProgress(textArr[0])
    } else if (isProcessing && !isScaningPaused && !isAttendanceModalOpen && !isExceptionModalOpen) {
      setTextProgress(textArr[1])
    } else if ((isProcessing || !isProcessing) && isScaningPaused && isAttendanceModalOpen && !isExceptionModalOpen) {
      setTextProgress(textArr[2])
    } else if ((isProcessing || !isProcessing) && isScaningPaused && !isAttendanceModalOpen && isExceptionModalOpen) {
      setTextProgress(textArr[2])
    } else if ((isProcessing || !isProcessing) && isScaningPaused && !isAttendanceModalOpen && !isExceptionModalOpen) {
      setTextProgress(textArr[3])
    }
  }, [isAttendanceModalOpen, isExceptionModalOpen, isScaningPaused, isProcessing])

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
        {/* <video id="video" ref={videoRef} autoPlay={true} playsInline muted></video> */}
        <Webcam id='video' ref={videoRef} audio={false} screenshotFormat="image/jpeg" style={{
          height: "99.8vh",
          width: "100%",
          objectFit: "cover",
          transform: "rotateY(180deg)",
          WebkitTransform: "rotateY(180deg)",
          MozTransform: "rotateY(180deg)",
        }}></Webcam>
        <Box zIndex={1000000000} position={"absolute"} w={"160px"} h={"50px"} top={0} right={0} textAlign={"right"} display={"flex"} alignItems={"center"} justifyContent={"center"} border={"3px solid"} borderColor={textProgress.color}
          bg='white' rounded='md' textTransform='uppercase'>
          <Text fontSize={"20px"} fontWeight={"700"} color={textProgress.color} >{textProgress.title}</Text>
        </Box>
      </div>
      <div>
        <Img style={{ border: "1px solid red" }} id='captureImage' src={null} />
      </div>
      {employeeId && <AttendanceModal />}
      <ExceptionModel />
    </>
  );
}
