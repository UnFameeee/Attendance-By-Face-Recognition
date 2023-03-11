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
function NotFound() {
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
              the page you are looking for is not available!
            </Text>
            <Link href="/dashboard">
              <Button textDecoration="none" colorScheme="green">
                Go to Home
              </Button>
            </Link>
          </Flex>
        </Flex>
      </Stack>
    </Center>
  );
}

export default NotFound;
