import { Center, Flex, Image, Text } from "@chakra-ui/react";
import React from "react";

function NoDataToDisplay({ height, ...props }) {
  return (
    <Center
      bg="white"
      w="100%"
      minHeight={height ?? "100%"}
      flex="1"
      display='flex'
      justifyContent="center"
      rounded="lg"
      backgroundImage="https://static.vecteezy.com/system/resources/previews/019/520/922/non_2x/no-result-document-file-data-not-found-concept-illustration-flat-design-eps10-modern-graphic-element-for-landing-page-empty-state-ui-infographic-icon-etc-vector.jpg"
      backgroundSize="contain"
      backgroundRepeat="no-repeat"
      backgroundPosition="center"
    >
    </Center>
  );
}

export default NoDataToDisplay;
