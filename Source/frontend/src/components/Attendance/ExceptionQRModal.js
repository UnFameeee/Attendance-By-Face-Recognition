import React, { useEffect, useState } from 'react'
import QRCode from "react-qr-code";
import { urlService } from '../../services/url/url';
import { Box, Text } from '@chakra-ui/react';

export default function ExceptionQRModal({ urlImage }) {
  const urlType = "AttendanceException";
  const {
    data: urlGenerateData,
    status: urlGenerateStatus,
    isFetching: urlGenerateisFetching,
    error: urlGenerateError,
    refetch: urlGenerateRefetch,
  } = urlService.useGenerateURL({ urlType, urlImage });

  useEffect(() => {
    urlGenerateRefetch();
  }, [urlImage])

  if (urlGenerateisFetching) {
    return <></>
  }

  return (
    <> {(!urlGenerateisFetching && urlGenerateData !== undefined) &&
      <Box height={"70%"} width={"100%"} display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"}>
        <Box height={"80%"} width={"100%"} display={"flex"} flexDirection={"column"} margin={0} padding={0} justifyContent={"center"} alignItems={"center"} gap={5}>
          <QRCode
            size={256}
            style={{ height: "45%", width: "45%" }}
            value={urlGenerateData.result}
            viewBox={`0 0 256 256`}
          />
          <Text textAlign={"center"} fontSize={"1rem"} fontWeight={"bold"} color={"gray"} padding={"0px 24px"}>Use your phone and scan this QR code to go to the <b style={{ color: "red" }}>Report Attendance</b> website and fill all the information</Text>
        </Box>
      </Box>
    }
    </>
  )
}