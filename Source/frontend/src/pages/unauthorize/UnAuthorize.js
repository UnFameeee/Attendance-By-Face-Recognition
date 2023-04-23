import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import React from "react";
import "./UnAuthorize.css";
import { useNavigate } from "react-router-dom";
function UnAuthorize() {
  const navigate = useNavigate();
  return (
    <Center fontFamily="Arvo" minHeight="100vh">
      <Stack>
        <Flex flexDirection="column" alignItems="center">
          <Heading fontSize="80px">403</Heading>
          <Box
            backgroundRepeat="no-repeat"
            minWidth="100vw"
            className="four_zero_four_bg"
          ></Box>
          <Flex gap="5px" alignItems="center" flexDirection="column">
            <Heading className="h2">Forbidden</Heading>

            <Text fontSize="20px">
              Sorry, you're not allowed to go beyond this point!
            </Text>

            <Button
              onClick={() => navigate(-1)}
              textDecoration="none"
              colorScheme="green"
            >
              Go back
            </Button>
          </Flex>
        </Flex>
      </Stack>
    </Center>
  );
}

export default UnAuthorize;
