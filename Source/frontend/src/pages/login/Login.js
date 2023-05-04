import {
  Box,
  Flex,
  Center,
  Text,
  Heading,
  Stack,
  Button,
  useToast,
} from "@chakra-ui/react";
import { Formik } from "formik";
import * as Yup from "yup";
import { LockIcon, AtSignIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import React, { useEffect } from "react";
import AuthTextField from "../../components/field/AuthTextField";
import { useMutation, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { authService } from "../../services/auth/auth";
import jwtDecode from "jwt-decode";
import {  permissionService } from "../../services/permission/permission";
export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();
  const cookies = new Cookies();
  const getUserPermission = useMutation(permissionService.getPermission, {
    onSuccess: (data) => {
      localStorage.setItem("userPermission", JSON.stringify(data.result));
    },
  });
  const useLoginMutation = useMutation(authService.login, {
    onSuccess: (data) => {
      const { refresh, access } = data;
      const decoded = jwtDecode(refresh);
      cookies.set("jwt_authentication", refresh, {
        expires: new Date(decoded.exp * 1000),
      });
      localStorage.setItem("accessToken", JSON.stringify(access));
      navigate("/dashboard");
      const decodeData = jwtDecode(access);
      queryClient.setQueryData(["userDecodeData"], decodeData);
      toast({
        title: "Sign in successfully",
        position: "bottom-right",
        status: "success",
        isClosable: true,
        duration: 5000,
      });
      getUserPermission.mutate();
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

  const initialValues = { email: "", password: "" };
  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required("Password required")
      .min(6, "Password is too short"),
    email: Yup.string().email("Invalid Email").required("Email required"),
  });
  return (
    <Center minHeight="calc(100vh - 160px)" width="100vw" bgColor="gray.200">
      <Box paddingX="5" paddingY="8" bgColor="whitesmoke" rounded="xl">
        <Stack spacing="5">
          <Flex gap="2" flexDirection="column" alignItems="center">
            <Heading fontSize="xl">Sign in to your Account</Heading>
            <Text>Welcome back!</Text>
          </Flex>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, actions) => {
              const credential = {
                email: values.email,
                password: values.password,
              };
              useLoginMutation.mutate(credential);
              actions.resetForm();
            }}
          >
            {(formik) => (
              <Stack spacing="5" as="form" onSubmit={formik.handleSubmit}>
                <AuthTextField
                  label="Email"
                  name="email"
                  placeholder="Email"
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
                <Button
                  type="submit"
                  bgColor="blue.600"
                  color="whitesmoke"
                  isLoading={useLoginMutation.isLoading}
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
          {/* <Box display="flex" justifyContent="center">
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
          </Flex> */}
        </Stack>
      </Box>
    </Center>
  );
}
