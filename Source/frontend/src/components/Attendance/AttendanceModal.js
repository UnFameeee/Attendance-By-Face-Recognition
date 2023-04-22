import { Box, Button, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react'
import React, { useEffect, } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setAttendanceModalOpen } from '../../store/Slice/AttendanceSlice/attendanceModalSlice';
import { setIsScaningPaused, setIsTakeAttendance } from '../../store/Slice/AttendanceSlice/takeAttendanceSlice';
import { attendanceService } from '../../services/attendance/attendance';
import { resetFailedCount, setFailedCount } from '../../store/Slice/AttendanceSlice/exceptionModalSlice';

const ModalBodyStyle = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between"
}

const ImageStyle = {
  height: "9rem",
  width: "7rem",
  display: "flex",
  justifySelf: "center",
  alignSelf: "center",
}

export default function AttendanceModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isAttendanceModalOpen, employeeId } = useSelector(state => state.attendanceModal);
  const dispatch = useDispatch();

  const {
    data: employeeDetail,
    isFetching: employeeDetailIsFetching,
    onError: employeeDetailOnError,
    error: employeeDetailError,
  } = attendanceService.useGetEmployeeDetailById(employeeId);
  // } = attendanceService.useGetEmployeeDetailById("a7310775-cb79-4391-88a8-3605a8276eb5");

  // useEffect(() => {
  //   console.log("Lmao")
  //   onOpen();
  // }, []);

  useEffect(() => {
    if (isAttendanceModalOpen) {
      onOpen();
    }
  }, [isAttendanceModalOpen]);

  const closeModal = () => {
    dispatch(setIsScaningPaused({
      isScaningPaused: false,
    }))
    dispatch(setAttendanceModalOpen({
      isAttendanceModalOpen: false,
    }))

    //failed count everytime the user cancel the attendance
    dispatch(setFailedCount());

    onClose();
  }

  const takeAttendanceHandle = () => {
    //set all the failed count before 
    dispatch(resetFailedCount());

    //Commit a Take Attendance Session 
    dispatch(setIsTakeAttendance({
      isTakeAttendance: true,
    }))
    closeModal();
  }

  if (employeeDetailIsFetching) {
    return <></>;
  }

  return (
    <>
      {!employeeDetailIsFetching &&
        <Modal
          isCentered
          isOpen={isOpen}
          onClose={closeModal}
          size="lg"
          motionPreset='slideInBottom'
        >
          <ModalOverlay
            bg='blackAlpha.300'
            backdropFilter='blur(10px) hue-rotate(90deg)'
          />
          <ModalContent>
            <ModalHeader fontWeight={"bold"}>Take Attendance</ModalHeader>
            <ModalCloseButton />
            <ModalBody style={ModalBodyStyle}>
              <Box display={"flex"} alignSelf={"center"} justifySelf={"center"}>
                <Image src={employeeDetail.employeeImages[0].link} style={ImageStyle} />
              </Box>
              <Box>
                <Text textAlign={"center"} fontSize={"1.25rem"} fontWeight={"bold"} color={"red"}>Employee Information</Text>
                <Text><b>Name: </b>{employeeDetail.fullname}</Text>
                <Text><b>ID: </b>{employeeDetail.id}</Text>
                <Text><b>Gender: </b>{employeeDetail.gender}</Text>
                <Text><b>Phone: </b>{employeeDetail.phoneNumber}</Text>
                <Text><b>Department: </b>{employeeDetail.department?.departmentName}</Text>
              </Box>
            </ModalBody>
            <ModalFooter gap={5}>
              <Button onClick={closeModal} border={"1px solid gray"}>Close</Button>
              <Button colorScheme='blue' onClick={takeAttendanceHandle}>Continue</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      }
    </>
  )
}