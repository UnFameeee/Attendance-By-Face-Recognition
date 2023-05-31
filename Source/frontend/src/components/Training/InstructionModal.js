import { InfoOutlineIcon } from '@chakra-ui/icons';
import { Box, Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react';
import React from 'react'
import { useEffect } from 'react';

const ModalBodyStyle = {
  width: "25rem",
  height: "25rem",
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

export default function InstructionModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    onOpen();
  }, [])

  return (
    <Box>
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
          <ModalHeader fontWeight={"bold"} textAlign={"center"} ></ModalHeader>
          {/* <ModalCloseButton /> */}

          <ModalBody style={ModalBodyStyle}>
            <InfoOutlineIcon width={"6rem"} height={"6rem"} color={"blue"} />

            <Text textAlign={"center"} fontSize={"1rem"} fontWeight={700}>Follow the below instructions</Text>

            <Text textAlign={"justify"} fontSize={"0.9rem"} lineHeight={"1.5rem"} fontWeight={"bold"} color={"gray"}>Please ensure that the lighting in the background is sufficient for optimal visibility and then put your face in the blue marked area, after you have fixed the face in the right position, press the <b style={{ color: "blue" }}>"Scan My Face"</b> button to start scanning the face. During the scan, move the head <b style={{ color: "red" }}>up</b>, <b style={{ color: "red" }}>down</b>, <b style={{ color: "red" }}>left</b>, <b style={{ color: "red" }}>right</b> until the progress bar completes</Text>
          </ModalBody>

          <ModalFooter gap={5}>
            <Button onClick={onClose} border={"1px solid gray"} fontSize={"1rem"} fontWeight={600} width={"8rem"} >Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}
