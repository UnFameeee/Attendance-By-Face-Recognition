import {
  Avatar,
  Box,
  Center,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Stack,
  Text,
  Icon,
  Textarea,
  Image,
  HStack,
  Button,
  ButtonGroup,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import { Field, Formik } from "formik";
import * as Yup from "yup";
import React, { useState, useEffect } from "react";
import AsyncSelect from "react-select/async";
import Select from "react-select";
import axios from "axios";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { FaRegUserCircle, FaGrinStars } from "react-icons/fa";
import { MdOutlineAlternateEmail } from "react-icons/md";
import {
  BsCheckCircleFill,
  BsTelephone,
  BsCalendar2Date,
} from "react-icons/bs";
import { RiFolderUserLine } from "react-icons/ri";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { GiOfficeChair } from "react-icons/gi";
import ta_test_avt from "../../../assets/ta.jpeg";
import google_logo from "../../../assets/google-ar21-removebg-preview.png";
import FormTextField from "../../../components/FormTextField";
import { phoneRegExp } from "../../../Utils/ValidationRegExp";
import _ from "lodash";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  saveProfileDetail,
  useGetProfileDetail,
} from "../../../services/setting/profile";
import jwtDecode from "jwt-decode";
import LoadingSpinner from "../../../components/LoadingSpinner";
import ChakraAlertDialog from "../../../components/ChakraAlertDialog";
function Profile() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const {
    isOpen: isSaveDetailAlertOpen,
    onOpen: onSaveDetailAlertOpen,
    onClose: onSaveDetailAlertClose,
  } = useDisclosure();
  const accessTokenJSON = localStorage.getItem("accessToken");
  const accessToken = JSON.parse(accessTokenJSON);
  var userDecodeData = jwtDecode(accessToken);
  const { data, isLoading, isError, error } = useGetProfileDetail(
    userDecodeData.id
  );
  const useSaveProfileDetail = useMutation(saveProfileDetail, {
    onSuccess: (data) => {
      const { result } = data;
      queryClient.invalidateQueries(["profileDetail", userDecodeData.id]);
      toast({
        title: "Save profile detail successfully",
        position: "bottom-right",
        status: "success",
        isClosable: true,
        duration: 5000,
      });
    },
    onError: (error) => {
      toast({
        title: error.response.data.message,
        position: "bottom-right",
        status: "error",
        isClosable: true,
        duration: 5000,
      });
    },
  });
  const roleArray = [
    {
      label: "Project Manager",
      value: "Project Manager",
    },
    { label: "Estimator", value: "Estimator" },
    { label: "Electrician", value: "Electrician" },
    {
      label: "Construction Worker",
      value: "Construction Worker",
    },
    {
      label: "Construction Manager",
      value: "Construction Manager",
    },
    { label: "Engineer", value: "Engineer" },
    { label: "Admin", value: "Admin" },
  ];
  const initialValues = {
    fullname: data?.result?.fullname ? data?.result?.fullname : "",
    email: data?.result?.email ? data?.result?.email : "",
    gender: data?.result?.gender ? data?.result?.gender : "male",
    phone: data?.result?.phoneNumber ? data?.result?.phoneNumber : "",
    dateOfBirth: data?.result?.dateOfBirth
      ? new Date(data?.result?.dateOfBirth).toISOString().substring(0, 10)
      : "",
    address: data?.result?.location?.address
      ? data?.result?.location?.address
      : "",
    city: data?.result?.location?.city ? data?.result?.location?.city : "",
    country: data?.result?.location?.country
      ? data?.result?.location?.country
      : "",
    state: data?.result?.location?.state ? data?.result?.location?.state : "",

    department: data?.result?.department ? data?.result?.department : "",
    joiningDate: data?.result?.joiningDate ? data?.result?.joiningDate : "",
    role: data?.result?.role.displayName ? data?.result?.role.displayName : "",
  };
  const validationSchema = Yup.object().shape({
    phone: Yup.string().matches(phoneRegExp, "Phone number is not valid"),
    fullname: Yup.string().required("This field is required"),
    email: Yup.string().required("This field is required"),
    address: Yup.string().required("This field is required"),
    city: Yup.string().required("This field is required"),
    country: Yup.string().required("This field is required"),
    state: Yup.string().required("This field is required"),
    dateOfBirth: Yup.date().required("This field is required"),
  });
  if (isLoading) return <LoadingSpinner />;
  return (
    <Stack
      minHeight="100vh"
      spacing={3}
      paddingX={{ base: "5", sm: "5", md: "10", lg: "20", xl: "20" }}
      paddingTop={2}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, actions) => {
          onSaveDetailAlertClose();
          const profileDetail = {
            fullname: values.fullname,
            email: values.email,
            gender: values.gender,
            dateOfBirth: new Date(values.dateOfBirth).toISOString(),
            phoneNumber: 1231231231,
            location: {
              address: values.address,
              city: values.city,
              country: values.country,
              state: values.state,
            },
          };
          const profileDetailObj = {
            id: userDecodeData.id,
            profileDetail: profileDetail,
          };
          useSaveProfileDetail.mutate(profileDetailObj);
        }}
      >
        {(formik) => (
          <Stack as="form" onSubmit={formik.handleSubmit}>
            <Flex justifyContent="space-between">
              <Box>
                <Heading>General Details</Heading>
                <Text>Update your photo and personal details here.</Text>
              </Box>
              <HStack>
                <Button
                  onClick={onSaveDetailAlertOpen}
                  size="lg"
                  colorScheme="blue"
                >
                  Save
                </Button>
                <ChakraAlertDialog
                  title="Save profile detail"
                  message="Are you sure? This action will save your profile details."
                  isOpen={isSaveDetailAlertOpen}
                  onClose={onSaveDetailAlertClose}
                  acceptButtonLabel="Accept"
                  type="submit"
                  onAccept={formik.handleSubmit}
                />
              </HStack>
            </Flex>
            <Flex
              gap={8}
              flexDirection={{
                base: "column",
                sm: "column",
                md: "column",
                lg: "column",
                xl: "row",
              }}
            >
              <Stack
                bgColor="white"
                flex="1"
                border="0.5px solid #cfd3df"
                rounded="lg"
              >
                <Box p={4} px={8}>
                  <Heading fontSize="xl">Personal Information</Heading>
                </Box>
                <Divider />
                <Stack spacing={3} p={4} px={8}>
                  <Flex gap={8}>
                    <FormTextField
                      name="fullname"
                      label="Full Name"
                      placeholder="Enter your Full Name"
                      leftIcon={
                        <FaRegUserCircle color="#999" fontSize="1.5rem" />
                      }
                    />
                  </Flex>
                  <FormTextField
                    name="email"
                    label="Email"
                    type="email"
                    isReadOnly={true}
                    placeholder="abc@gmail.com"
                    leftIcon={
                      <MdOutlineAlternateEmail color="#999" fontSize="1.5rem" />
                    }
                  />
                  <FormTextField
                    name="gender"
                    isGender={true}
                    label="Gender"
                    arrayGender={[
                      { label: "Male", value: "male" },
                      { label: "Female", value: "female" },
                    ]}
                    formik={formik}
                  />
                  <Flex gap={8}>
                    <FormTextField
                      name="department"
                      label="Department"
                      isReadOnly={true}
                      type="text"
                      placeholder="148Primas"
                      leftIcon={
                        <HiOutlineBuildingOffice2
                          color="#999"
                          fontSize="1.5rem"
                        />
                      }
                    />
                    <FormTextField
                      name="location"
                      label="Work Location"
                      type="text"
                      placeholder="148Primas"
                      leftIcon={
                        <GiOfficeChair color="#999" fontSize="1.5rem" />
                      }
                    />
                  </Flex>
                  <FormTextField
                    name="phone"
                    label="Phone number"
                    type="number"
                    placeholder="Enter your number"
                    leftIcon={<BsTelephone color="#999" fontSize="1.4rem" />}
                  />

                  <FormTextField
                    name="role"
                    label="Role"
                    isSelectionField={true}
                    selectionArray={roleArray}
                    type="text"
                    placeholder="Employee"
                    leftIcon={
                      <RiFolderUserLine color="#999" fontSize="1.5rem" />
                    }
                  />
                  <Flex gap={8}>
                    <FormTextField
                      name="joiningDate"
                      label="Joining Date"
                      type="text"
                      isReadOnly={true}
                      placeholder="2/23/2023"
                      leftIcon={
                        <BsCalendar2Date color="#999" fontSize="1.5rem" />
                      }
                    />
                    <FormTextField
                      name="dateOfBirth"
                      isDateField={true}
                      label="Birth Date"
                    />
                  </Flex>
                  <Flex gap={8}>
                    <FormTextField
                      name="address"
                      isTextAreaField={true}
                      label="Address"
                      placeholder="Enter your address"
                    />
                    <FormTextField
                      name="city"
                      isTextAreaField={true}
                      label="City"
                      placeholder="Enter your city"
                    />
                  </Flex>
                  <Flex gap={8}>
                    <FormTextField
                      name="country"
                      isTextAreaField={true}
                      label="Country"
                      placeholder="Enter your country"
                    />
                    <FormTextField
                      name="state"
                      isTextAreaField={true}
                      label="State"
                      placeholder="Enter your state"
                    />
                  </Flex>
                </Stack>
              </Stack>
              <Stack
                bgColor="white"
                flex="1"
                border="0.5px solid #cfd3df"
                rounded="lg"
              >
                <Box p={4} px={8}>
                  <Heading fontSize="xl">Your Photo</Heading>
                </Box>
                <Divider />
                <Flex flexDirection="column" p={4} px={8} gap={10}>
                  <Flex
                    alignItems="center"
                    flex={1}
                    gap={3}
                    py={2}
                    flexDirection="column"
                  >
                    <Flex gap={4} flexDirection="row" alignItems="center">
                      <Avatar src={ta_test_avt} boxSize="80px" />
                      <Box
                        display="flex"
                        flexDirection="column"
                        gap={3}
                        fontSize="large"
                      >
                        <Text fontWeight="bold">Edit your photo</Text>
                        <Flex gap={2}>
                          <Text cursor="pointer" color="#999">
                            Delete
                          </Text>
                          <Text cursor="pointer" color="#4374e3">
                            Update
                          </Text>
                        </Flex>
                      </Box>
                    </Flex>
                    <Box
                      width="100%"
                      cursor="pointer"
                      boxSizing="border-box"
                      rounded="lg"
                      border="2px dashed #999"
                      height="250px"
                    >
                      <Center pt={10} pb={5}>
                        <Icon
                          boxSize={20}
                          color="#999"
                          as={AiOutlineCloudUpload}
                        />
                      </Center>
                      <Center>
                        <Text color="#4374e3" mr={1}>
                          Click to upload
                        </Text>
                        <Text>or drag and drop</Text>
                      </Center>
                      <Center display="flex" flexDirection="column">
                        <Text>SVG, PNG, JPEG or GIF</Text>
                        <Text>(max. 800x400px)</Text>
                      </Center>
                    </Box>
                  </Flex>
                  <Box flex={1}>
                    <Flex alignItems="center" justifyContent="space-between">
                      <Image src={google_logo} width="150px" />
                      <Box p={2} rounded="md" bgColor="#d8ffee">
                        <Text fontWeight="bold" color="#54c793">
                          Connected
                        </Text>
                      </Box>
                    </Flex>
                    <Box pl={2} fontSize="1.3rem">
                      <Text fontWeight="bold">Google</Text>
                      <Text>Use Google to sign in your account.</Text>
                      <Text color="#4374e3" cursor="pointer">
                        Click here to learn more.
                      </Text>
                    </Box>
                  </Box>
                </Flex>
              </Stack>
            </Flex>
          </Stack>
        )}
      </Formik>
    </Stack>
  );
}

export default Profile;
