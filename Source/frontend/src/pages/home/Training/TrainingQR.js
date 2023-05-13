import React from 'react'
import { urlService } from '../../../services/url/url';
import { Box, Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react';
import QRCode from 'react-qr-code';
import { useEffect } from 'react';
import { Helper } from '../../../Utils/Helper';

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

export default function TrainingQR() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const employeeId = Helper.getUseDecodeInfor().id;
  const urlType = "TrainingFace";
  const {
    data: urlGenerateData,
    status: urlGenerateStatus,
    isFetching: urlGenerateisFetching,
    error: urlGenerateError,
    refetch: urlGenerateRefetch,
  } = urlService.useGenerateURL({ urlType, employeeId });

  console.log(urlGenerateData);
  console.log(urlGenerateisFetching)


  useEffect(() => {
    urlGenerateRefetch();
    onOpen();
  }, [])

  if (urlGenerateisFetching) {
    return <></>
  }

  return (
    <>
      {(!urlGenerateisFetching && urlGenerateData !== undefined) &&
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
            <ModalHeader fontWeight={"bold"} textAlign={"center"}>Scanning Face QR Code</ModalHeader>
            {/* <ModalCloseButton /> */}

            <Box height={"70%"} width={"100%"} display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"}>
              <Box height={"80%"} width={"100%"} display={"flex"} flexDirection={"column"} margin={"10px 0 10px 0"} padding={0} justifyContent={"center"} alignItems={"center"} gap={5}>
                <QRCode
                  size={256}
                  style={{ height: "45%", width: "45%" }}
                  value={urlGenerateData?.result}
                  viewBox={`0 0 256 256`}
                />
                <Text textAlign={"justify"} fontSize={"1rem"} fontWeight={"bold"} color={"gray"} padding={"0px 24px"}>Use your phone and scan this QR code to go to the <b style={{ color: "red" }}>Scanning Face</b> website and doing the things in the instruction. After finish the scanning, click the <b style={{ color: "green" }}>Finish</b> button to going back to the login page</Text>
              </Box>
            </Box>

            <ModalFooter gap={5}>
              <Button onClick={onClose} border={"1px solid gray"}>Finish</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      }
    </>
  )

}
