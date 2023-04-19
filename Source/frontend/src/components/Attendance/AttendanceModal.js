import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react'
import React, { useEffect, } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setIsModalOpen } from '../../store/Slice/AttendanceSlice/attendanceModalSlice';
import { setIsScaningPaused, setIsTakeAttendance } from '../../store/Slice/AttendanceSlice/takeAttendanceSlice';
import { attendanceService } from '../../services/attendance/attendance';

export default function AttendanceModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isModalOpen, employeeId } = useSelector(state => state.attendanceModal);
  const dispatch = useDispatch();

  const {
    data,
    isFetching,
    onError,
    error,
  } = attendanceService.useGetEmployeeDetailById("a7310775-cb79-4391-88a8-3605a8276eb5")

  useEffect(() => {
    console.log(employeeId);
    if (isModalOpen) {
      // onOpen();
    }
    onOpen();
    console.log(data)
  }, [isModalOpen]);

  const closeModal = () => {
    dispatch(setIsModalOpen({
      isModalOpen: false,
    }))
    dispatch(setIsScaningPaused({
      isScaningPaused: false,
    }))
    onClose();
  }

  const takeAttendanceHandle = () => {
    dispatch(setIsTakeAttendance({
      isTakeAttendance: true,
    }))
    closeModal();
  }

  if (isFetching) {
    return <></>
  }

  return (
    <>
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
          <ModalHeader>Take Attendance</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>{employeeId}</Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={closeModal}>Close</Button>
            <Button colorScheme='blue' mr={3} onClick={takeAttendanceHandle}>Continue</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
