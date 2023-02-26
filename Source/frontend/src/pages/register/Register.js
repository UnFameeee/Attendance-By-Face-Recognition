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
  useToast,
} from "@chakra-ui/react";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  LockIcon,
  AtSignIcon,
  ViewIcon,
  ViewOffIcon,
  StarIcon,
} from "@chakra-ui/icons";
import { HiOutlineUserCircle } from "react-icons/hi2";
import { Form, Link, useNavigate } from "react-router-dom";
import React from "react";
import AuthTextField from "../../components/AuthTextField";
import { useMutation } from "react-query";
import { register } from "../../services/auth/auth";
function Register() {
  const navigate = useNavigate();
  const toast = useToast();
  const useRegisterMutation = useMutation(register, {
    onSuccess: (data) => {
      toast({
        title: "Sign up successfully",
        position: "bottom-right",
        status: "success",
        isClosable: true,
        duration: 5000,
      });
    },
    onError: (error) => {
      console.log(error);
      toast({
        title: error.response.data.message,
        position: "bottom-right",
        status: "error",
        isClosable: true,
        duration: 5000,
      });
    },
  });
  return (
    <Center height="100vh" width="100vw" bgColor="gray.200">
      <Box paddingX="5" paddingY="8" bgColor="whitesmoke" rounded="xl">
        <Stack spacing="5">
          <Flex gap="2" flexDirection="column" alignItems="center">
            <Heading fontSize="xl">Create your account</Heading>
            <Text>Hey, Enter your details to get sign up</Text>
          </Flex>
          <Formik
            initialValues={{
              userName: "",
              email: "",
              password: "",
              confirmPassword: "",
            }}
            validationSchema={Yup.object({
              userName: Yup.string()
                .min(3, "Please enter a valid username")
                .required("User Name required"),
              email: Yup.string()
                .email("Invalid Email")
                .required("Email required"),
              password: Yup.string()
                .required("Password required")
                .min(6, "Password is too short"),
              confirmPassword: Yup.string()
                .oneOf([Yup.ref("password"), null], "Passwords must match")
                .required("Confirm password is required"),
            })}
            onSubmit={(values, actions) => {
              alert(JSON.stringify(values, null, 2));
              const newCredential = {
                username: values.userName,
                email: values.email,
                password: values.password,
              };
              useRegisterMutation.mutate(newCredential);
              actions.resetForm();
            }}
          >
            {(formik) => (
              <Stack spacing="5" as="form" onSubmit={formik.handleSubmit}>
                <AuthTextField
                  label="User Name"
                  name="userName"
                  placeholder="duy678"
                  leftIcon={<StarIcon />}
                />
                <AuthTextField
                  label="Email"
                  name="email"
                  placeholder="abc@gmail.com"
                  leftIcon={<AtSignIcon />}
                />
                <AuthTextField
                  label="Password"
                  name="password"
                  placeholder="********"
                  type="password"
                  leftIcon={<LockIcon />}
                  rightIcon={<ViewIcon />}
                  hideIcon={<ViewOffIcon />}
                />
                <AuthTextField
                  label="Confirm password"
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
                  isLoading={useRegisterMutation.isLoading}
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
