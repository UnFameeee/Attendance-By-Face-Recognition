import React, { useEffect, useState } from 'react'
import { Box, Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react'
import { WarningTwoIcon } from '@chakra-ui/icons'
import { useDispatch } from 'react-redux';
import { setIsScaningPaused } from '../../store/Slice/AttendanceSlice/takeAttendanceSlice';
import { setExceptionModalOpen } from '../../store/Slice/AttendanceSlice/exceptionModalSlice';
import { useSelector } from 'react-redux';
import QRCode from "react-qr-code";
import { urlService } from '../../services/url/url';

const ModalBodyStyle = {
  width: "35rem",
  height: "35rem",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: "1rem",
}

const ModalContentStyle = {
  width: "fit-content",
  height: "fit-content"
}

export default function ExceptionModel() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  const [state, setState] = useState(0);
  const { isExceptionModalOpen } = useSelector(state => state.exceptionModal);

  const urlType = "AttendanceException";
  const {
    data: urlGenerateData,
    status: urlGenerateStatus,
    isFetching: urlGenerateisFetching,
    error: urlGenerateError,
    refetch: urlGenerateRefetch,
  } = urlService.useGenerateURL(urlType);

  useEffect(() => {
    if (isExceptionModalOpen) {
      onOpen();
    }
  }, [isExceptionModalOpen]);

  // useEffect(() => {
  //   onOpen();
  // }, []);

  const closeModal = () => {
    dispatch(setIsScaningPaused({
      isScaningPaused: false,
    }))
    dispatch(setExceptionModalOpen({
      isExceptionModalOpen: false,
    }))
    setState(0);
    onClose();
  }

  const handleChangeToQR = () => {
    urlGenerateRefetch();
    setState(1)
  }

  if (urlGenerateisFetching) {
    return <></>
  }

  return (
    <>
      <Modal
        isCentered
        isOpen={isOpen}
        // onClose={closeModal}
        size="lg"
        motionPreset='slideInBottom'
      >
        <ModalOverlay
          bg='blackAlpha.300'
          backdropFilter='blur(10px) hue-rotate(90deg)'
        />
        <ModalContent style={ModalContentStyle}>
          <ModalHeader fontWeight={"bold"}>Attendance Failure Report</ModalHeader>
          <ModalCloseButton />
          {state == 0 &&
            <>
              <ModalBody style={ModalBodyStyle}>
                <WarningTwoIcon width={"6rem"} height={"6rem"} color={"red"} />

                <Text textAlign={"center"} fontSize={"1rem"} fontWeight={700}>You have failed to take attendance many times. This may be due to errors coming from the attendance machine, do you want to report this to the Administrator?</Text>

                <Text textAlign={"center"} fontSize={"0.85rem"} fontWeight={"bold"} color={"gray"}>We will take a picture of you and send it to your manager if you click the <b style={{ color: "red" }}>Report</b> button</Text>

                <Text textAlign={"center"} fontSize={"0.85rem"} fontWeight={"bold"} color={"gray"}>We suggest you try a few more times, before doing this action</Text>
              </ModalBody>
            </>
          }
          {state == 1 &&
            <Box height={"70%"} width={"100%"} display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"}>
              <Box height={"80%"} width={"100%"} display={"flex"} flexDirection={"column"} margin={0} padding={0} justifyContent={"center"} alignItems={"center"} gap={5}>
                <QRCode
                  size={256}
                  style={{ height: "65%", width: "65%" }}
                  value={urlGenerateData.result}
                  viewBox={`0 0 256 256`}
                />
                <Text textAlign={"center"} fontSize={"1rem"} fontWeight={"bold"} color={"gray"} padding={"0px 24px"}>Use your phone and scan this QR code to go to the <b style={{ color: "red" }}>Report Attendance</b> website and fill all the information</Text>
              </Box>
            </Box>
          }
          <ModalFooter gap={5}>
            <Button onClick={closeModal} border={"1px solid gray"}>Close</Button>
            {state == 0 &&
              <Button colorScheme='red' onClick={handleChangeToQR}>Report</Button>
            }
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
