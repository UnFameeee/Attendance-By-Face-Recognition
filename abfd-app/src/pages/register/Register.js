import {
  Box,
  Flex,
  Image,
  Center,
  Text,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  HStack,
  Stack,
  InputRightAddon,
  Button,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { LockIcon, AtSignIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { Form, Link } from "react-router-dom";
import React from "react";

function Register() {
  return (
    <Center height="100vh" width="100vw" bgColor="gray.200">
      <Box paddingX="5" paddingY="8" bgColor="whitesmoke" rounded="xl">
        <Stack spacing="5">
          <Flex gap="2" flexDirection="column" alignItems="center">
            <Heading fontSize="xl">Create your account</Heading>
            <Text>Hey, Enter your details to get sign up</Text>
          </Flex>
          <Stack spacing="3">
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <InputGroup>
                <InputLeftAddon children={<AtSignIcon />} />
                <Input placeholder="abc@gmail.com" />
              </InputGroup>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <InputLeftAddon children={<LockIcon />} />
                <Input placeholder="********" />
                <InputRightAddon cursor="pointer" children={<ViewOffIcon />} />
              </InputGroup>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Confirm Password</FormLabel>
              <InputGroup>
                <InputLeftAddon children={<LockIcon />} />
                <Input placeholder="********" />
                <InputRightAddon cursor="pointer" children={<ViewOffIcon />} />
              </InputGroup>
            </FormControl>
          </Stack>
          <Button
            bgColor="blue.600"
            color="whitesmoke"
            _hover={{
              color: "black",
              background: "whitesmoke",
              border:"1px solid black"
            }}
          >
            {" "}
            Sign up
          </Button>
          <Flex justifyContent="center" gap="1">
            <Text>You have register already? </Text>
            <Link to="/login">
              <span style={{ fontWeight: "bold" }}>Sign in Now</span>
            </Link>
          </Flex>
        </Stack>
      </Box>
    </Center>
  );
}

export default Register;
