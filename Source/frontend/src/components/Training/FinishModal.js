import { CheckCircleIcon } from '@chakra-ui/icons';
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
  // maxWidth: "100%",
  width: "fit-content",
  height: "fit-content"
}

export default function FinishModal({ openModal }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (openModal) {
      onOpen();
    } else {
      onClose();
    }
  }, [openModal])

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
            <CheckCircleIcon width={"6rem"} height={"6rem"} color={"green"} />

            <Text textAlign={"center"} fontSize={"1rem"} fontWeight={700}>You have finish the scanning</Text>

            <Text textAlign={"justify"} fontSize={"0.9rem"} lineHeight={"1.5rem"} fontWeight={"bold"} color={"gray"}>Click the <b style={{ color: "green" }}>"Finish"</b> button to end this session</Text>
          </ModalBody>

          <ModalFooter gap={5}>
            <Button onClick={onClose} border={"1px solid gray"} fontSize={"1rem"} fontWeight={600} width={"8rem"} >Finish</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}
