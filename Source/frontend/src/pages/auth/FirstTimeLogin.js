import React from "react";
import {
  Text,
  Stack,
  Center,
  Avatar,
  VStack,
  HStack,
  Select,
  Image,
  Button,
  Heading,
  Flex,
  Box,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import firstTimeLogin from '../../assets/firstTimeLogin.jpg'
function FirstTimeLogin() {
  const navigate = useNavigate();

  return (
    <Stack bgColor="gray.200" h="100vh">
      <Center m="auto" p={5} rounded="md" bg="white">
        <VStack spacing="15px">
          <Flex w="100%" gap="10px">
            <Box w="10px" bg="blue.700" borderRadius="5px"></Box>
            <Heading fontSize="1.5rem">First Time Login</Heading>
          </Flex>
          <Box>
            <Image
              src={firstTimeLogin}
              height="350px"
            />
          </Box>
          <Box textAlign="center">
            <Text fontSize="2xl" fontWeight="bold">
              Welcome to the system!{" "}
            </Text>
            <Text fontSize="xl">
              Please take a moment to fill out your profile information.
            </Text>
          </Box>
          <Button
            colorScheme="blue"
            onClick={() => {
              navigate("/setting/profile");
            }}
          >
            Click here{" "}
          </Button>
        </VStack>
      </Center>
    </Stack>
  );
}

export default FirstTimeLogin;
