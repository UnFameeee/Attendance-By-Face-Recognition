import { Box, Flex, Text } from "@chakra-ui/react";
import React from "react";

function Footer() {
  return (
    <Flex position='absolute' zIndex="1000" width="100vw" bottom={10} justifyContent='center'>
      <Text>Copyright @ABFR | Privacy Policy</Text>
    </Flex>
  );
}

export default Footer;
