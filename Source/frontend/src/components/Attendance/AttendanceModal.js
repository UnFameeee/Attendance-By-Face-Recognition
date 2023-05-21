import { Box, Button, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react'
import React, { useEffect, useState, } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setAttendanceModalOpen } from '../../store/Slice/AttendanceSlice/attendanceModalSlice';
import { setIsScaningPaused, setIsTakeAttendance } from '../../store/Slice/AttendanceSlice/takeAttendanceSlice';
import { attendanceService } from '../../services/attendance/attendance';
import { resetFailedCount, setExceptionModalOpen, setFailedCount } from '../../store/Slice/AttendanceSlice/exceptionModalSlice';

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
  const { isExceptionModalOpen, failedCount } = useSelector(state => state.exceptionModal);

  const {
    data: employeeDetail,
    isFetching: employeeDetailIsFetching,
    onError: employeeDetailOnError,
    error: employeeDetailError,
    refetch: employeeDetailRefetch,
  } = attendanceService.useGetEmployeeDetailById(employeeId);

  useEffect(() => {
    if (isAttendanceModalOpen) {
      employeeDetailRefetch();
      onOpen();
    }
  }, [isAttendanceModalOpen]);

  const closeModal = () => {
    //failed count everytime the user cancel the attendance
    dispatch(setFailedCount());

    dispatch(setAttendanceModalOpen({
      isAttendanceModalOpen: false,
    }))

    //if the employee fail 3 (0 -> 1 -> 2) times attendance, popup the exception handle.
    if (failedCount == 2) {
      dispatch(resetFailedCount());

      dispatch(setExceptionModalOpen({
        isExceptionModalOpen: true,
      }))
    }
    else {
      dispatch(setIsScaningPaused({
        isScaningPaused: false,
      }))
    }

    onClose();
  }

  const takeAttendanceHandle = () => {
    //set all the failed count before 
    dispatch(resetFailedCount());

    //Commit a Take Attendance Session 
    dispatch(setIsTakeAttendance({
      isTakeAttendance: true,
    }))

    dispatch(setAttendanceModalOpen({
      isAttendanceModalOpen: false,
    }))

    dispatch(setIsScaningPaused({
      isScaningPaused: false,
    }))

    onClose();
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
            <ModalHeader fontWeight={"bold"} display={"flex"} justifyContent={"center"} alignItems={"center"} flexDirection={"column"} gap={"5px"}>
              <p style={{
                color: '#7F5D93',
                fontWeight: "bold",
                fontSize: "1.5rem",
              }}>
                Record Attendance
              </p>
              <p style={{
                background: "#C6F5D5",
                color: "#22543D",
                padding: "5px 10px 5px 10px"
              }}>
                {employeeDetail?.attendanceType}
              </p>
            </ModalHeader>
            {/* <ModalCloseButton /> */}
            <ModalBody style={ModalBodyStyle}>
              <Box display={"flex"} alignSelf={"center"} justifySelf={"center"}>
                <Image src={employeeDetail?.image} style={ImageStyle} />
              </Box>
              <Box>
                <Text textAlign={"center"} fontSize={"1.25rem"} fontWeight={"bold"} color={"#000000"}>Employee Information</Text>
                <Text><b>Name: </b>{employeeDetail?.fullname}</Text>
                <Text><b>ID: </b>{employeeDetail?.id}</Text>
                <Text><b>Gender: </b>{employeeDetail?.gender}</Text>
                <Text><b>Phone: </b>{employeeDetail?.phoneNumber}</Text>
                <Text><b>Department: </b>{employeeDetail?.department?.departmentName}</Text>
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