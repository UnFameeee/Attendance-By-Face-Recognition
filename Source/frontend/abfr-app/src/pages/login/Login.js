import {
  Box,
  Flex,
  Center,
  Text,
  Heading,
  Stack,
  Button,
  Icon,
} from "@chakra-ui/react";
import { Formik } from "formik";
import * as Yup from "yup";
import { LockIcon, AtSignIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import React from "react";
import AuthTextField from "../../components/AuthTextField";

function Login() {
  return (
    <Center height="100vh" width="100vw" bgColor="gray.200">
      <Box paddingX="5" paddingY="8" bgColor="whitesmoke" rounded="xl">
        <Stack spacing="5">
          <Flex gap="2" flexDirection="column" alignItems="center">
            <Heading fontSize="xl">Sign in to your Account</Heading>
            <Text>Welcome back!</Text>
          </Flex>
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={Yup.object({
              password: Yup.string()
                .required("Password required")
                .min(6, "Password is too short"),
              email: Yup.string()
                .email("Invalid Email")
                .required("Email required"),
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
                  placeholder="Email"
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
                  Sign in
                </Button>
              </Stack>
            )}
          </Formik>
          <Box display="flex" justifyContent="center">
            <Text> &mdash; Or Sign in with &mdash;</Text>
          </Box>
          <Button bgColor="white" display="flex" alignItems="center" gap="1">
            <Icon as={FcGoogle} boxSize={6} />
            Sign in with Google
          </Button>
          <Flex justifyContent="center" gap="1">
            <Text>Don't have an account? </Text>
            <Link to="/sign-up">
              <span style={{ fontWeight: "bold" }}>Sign up now!</span>
            </Link>
          </Flex>
        </Stack>
      </Box>
    </Center>
  );
}

export default Login;
