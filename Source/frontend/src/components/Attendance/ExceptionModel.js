import React, { useEffect } from 'react'
import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react'
import { WarningTwoIcon } from '@chakra-ui/icons'
import { useDispatch } from 'react-redux';
import { setIsScaningPaused } from '../../store/Slice/AttendanceSlice/takeAttendanceSlice';
import { setExceptionModalOpen } from '../../store/Slice/AttendanceSlice/exceptionModalSlice';
import { useSelector } from 'react-redux';

const ModalBodyStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: "1rem",
}

export default function ExceptionModel() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  const { isExceptionModalOpen } = useSelector(state => state.exceptionModal);

  useEffect(() => {
    if (isExceptionModalOpen) {
      onOpen();
    }
  }, [isExceptionModalOpen]);

  const closeModal = () => {
    dispatch(setIsScaningPaused({
      isScaningPaused: false,
    }))
    dispatch(setExceptionModalOpen({
      isExceptionModalOpen: false,
    }))
    onClose();
  }

  // const 

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
          <ModalHeader fontWeight={"bold"}>Attendance Failure Report</ModalHeader>
          <ModalCloseButton />
          <ModalBody style={ModalBodyStyle}>

            <WarningTwoIcon width={"6rem"} height={"6rem"} color={"red"} />

            <Text textAlign={"center"} fontSize={"1rem"} fontWeight={700}>You have failed to take attendance many times. This may be due to errors coming from the attendance machine, do you want to report this to the Administrator?</Text>

            <Text textAlign={"center"} fontSize={"0.85rem"} fontWeight={"bold"} color={"gray"}>We will take an picture of you and send it to your manager if you click the <b style={{color: "red"}}>Report</b> button</Text>
            
            <Text textAlign={"center"} fontSize={"0.85rem"} fontWeight={"bold"} color={"gray"}>We suggest you try a few more times, before doing this action</Text>
          </ModalBody>
          <ModalFooter gap={5}>
            <Button onClick={closeModal} border={"1px solid gray"}>Close</Button>
            <Button colorScheme='red' onClick={closeModal}>Report</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
