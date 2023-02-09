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
  Icon,
} from "@chakra-ui/react";
import { LockIcon, AtSignIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import React from "react";

function Login() {
  return (
    <Center height="100vh" width="100vw" bgColor="gray.200">
      <Box paddingX="5" paddingY="8" bgColor="whitesmoke" rounded="xl">
        <Stack spacing="5">
          <Flex gap="2" flexDirection="column" alignItems="center">
            <Heading fontSize="xl">Sign in to your Account</Heading>
            <Text>Welcome back!</Text>
          </Flex>
          <Stack spacing="5">
            <InputGroup>
              <InputLeftAddon children={<AtSignIcon />} />
              <Input placeholder="Email" />
            </InputGroup>
            <InputGroup>
              <InputLeftAddon children={<LockIcon />} />
              <Input placeholder="Password" />
              <InputRightAddon cursor="pointer" children={<ViewOffIcon />} />
            </InputGroup>
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
            Sign in
          </Button>
          <Box display="flex" justifyContent="center">
            <Text> &mdash; Or Sign in with &mdash;</Text>
          </Box>
          <Button bgColor="white" display="flex" alignItems="center" gap="1">
            <Icon as={FcGoogle} boxSize={6} />
            Sign in with Google
          </Button>
          <Flex justifyContent="center" gap="1">
            <Text>Don't have an account? </Text>
            <Link to="/register">
              <span style={{ fontWeight: "bold" }}>Sign up now!</span>
            </Link>
          </Flex>
        </Stack>
      </Box>
    </Center>
  );
}

export default Login;
