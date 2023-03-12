import { Flex, Image, Text } from "@chakra-ui/react";
import React from "react";

function NoDataToDisplay() {
  return (
    <Flex
      bg="white"
      width="100%"
      flex='1'
      position='relative'
      justifyContent='center'
      rounded='lg'
      backgroundImage="https://static.vecteezy.com/system/resources/previews/019/520/922/non_2x/no-result-document-file-data-not-found-concept-illustration-flat-design-eps10-modern-graphic-element-for-landing-page-empty-state-ui-infographic-icon-etc-vector.jpg"
      backgroundSize='contain'
      backgroundRepeat='no-repeat'
      backgroundPosition='center'
      >
      <Text position='absolute' bottom='40px' fontWeight='semibold' fontSize='2xl'>No data to display yet!</Text>
    </Flex>
  );
}

export default NoDataToDisplay;
