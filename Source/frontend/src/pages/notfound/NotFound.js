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
import "./NotFound.css";
import { useNavigate } from "react-router-dom";
import background from '../../assets/bg2.jpg';
function NotFound() {
  const navigate = useNavigate();
  return (
    <Center fontFamily="Arvo" minHeight="100vh">
      <Stack>
        <Flex flexDirection="column" alignItems="center">
          <Heading fontSize="80px">404</Heading>
          <Box
            backgroundRepeat="no-repeat"
            minWidth="100vw"
            className="four_zero_four_bg"
          ></Box>
          <Flex gap="5px" alignItems="center" flexDirection="column">
            <Heading className="h2">Look like you are lost</Heading>
            <Text fontSize="20px">
              The page you are looking for is not available!
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

export default NotFound;
