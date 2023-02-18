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
import { Formik } from "formik";
import * as Yup from "yup";
import { LockIcon, AtSignIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { Form, Link } from "react-router-dom";
import React from "react";
import AuthTextField from "../../components/AuthTextField";

function Register() {
  return (
    <Center height="100vh" width="100vw" bgColor="gray.200">
      <Box paddingX="5" paddingY="8" bgColor="whitesmoke" rounded="xl">
        <Stack spacing="5">
          <Flex gap="2" flexDirection="column" alignItems="center">
            <Heading fontSize="xl">Create your account</Heading>
            <Text>Hey, Enter your details to get sign up</Text>
          </Flex>
          <Formik
            initialValues={{ email: "", password: "", confirmPassword: "" }}
            validationSchema={Yup.object({
              email: Yup.string()
                .email("Invalid Email")
                .required("Email required"),
              password: Yup.string()
                .required("Password required")
                .min(6, "Password is too short"),
              confirmPassword: Yup.string().oneOf(
                [Yup.ref("password"), null],
                "Passwords must match"
              ).required("Confirm password is required"),
            })}
            onSubmit={(values, actions) => {
              alert(JSON.stringify(values, null, 2));
              actions.resetForm();
            }}
          >
            {(formik) => (
              <Stack spacing="5" as="form" onSubmit={formik.handleSubmit}>
                <AuthTextField
                  name="email"
                  placeholder="abc@gmail.com"
                  leftIcon={<AtSignIcon />}
                />
                <AuthTextField
                  name="password"
                  placeholder="********"
                  type="password"
                  leftIcon={<LockIcon />}
                  rightIcon={<ViewIcon />}
                  hideIcon={<ViewOffIcon />}
                />
                <AuthTextField
                  name="confirmPassword"
                  placeholder="********"
                  type="password"
                  leftIcon={<LockIcon />}
                  rightIcon={<ViewIcon />}
                  hideIcon={<ViewOffIcon />}
                />
                <Button
                  type="submit"
                  bgColor="blue.600"
                  color="whitesmoke"
                  _hover={{
                    color: "black",
                    background: "whitesmoke",
                    border: "1px solid black",
                  }}
                >
                  {" "}
                  Sign up
                </Button>
              </Stack>
            )}
          </Formik>
          <Flex justifyContent="center" gap="1">
            <Text>You have register already? </Text>
            <Link to="/sign-in">
              <span style={{ fontWeight: "bold" }}>Sign in Now</span>
            </Link>
          </Flex>
        </Stack>
      </Box>
    </Center>
  );
}

export default Register;
