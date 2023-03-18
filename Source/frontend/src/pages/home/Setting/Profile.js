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
import { AiOutlineCloudUpload, AiTwotoneSetting } from "react-icons/ai";
import { GiOfficeChair } from "react-icons/gi";
import ta_test_avt from "../../../assets/ta.jpeg";
import google_logo from "../../../assets/google-ar21-removebg-preview.png";
import FormTextField from "../../../components/field/FormTextField";
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
import { useGetListRoleOfEmployee } from "../../../services/employee/employee";
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
  const {
    data: profileDetailData,
    isLoading: isLoadingProfileDetail,
    isError,
    error,
  } = useGetProfileDetail(userDecodeData.id);
  // const {
  //   data: listRoleOfEmployeeData,
  //   isLoading: isLoadingListRoleOfEmployee,
  // } = useGetListRoleOfEmployee();
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
  let roleArray = [];
  // if(listRoleOfEmployeeData?.result){
  //   listRoleOfEmployeeData?.result.map((item) =>{
  //     roleArray.push({label:item.displayName,value:item.roleId})
  //   })
  // }
  const initialValues = {
    fullname: profileDetailData?.result?.fullname
      ? profileDetailData?.result?.fullname
      : "",
    email: profileDetailData?.result?.email
      ? profileDetailData?.result?.email
      : "",
    gender: profileDetailData?.result?.gender
      ? profileDetailData?.result?.gender
      : "male",
    phone: profileDetailData?.result?.phoneNumber
      ? profileDetailData?.result?.phoneNumber
      : "",
    dateOfBirth: profileDetailData?.result?.dateOfBirth
      ? new Date(profileDetailData?.result?.dateOfBirth)
          .toISOString()
          .substring(0, 10)
      : "",
    address: profileDetailData?.result?.location?.address
      ? profileDetailData?.result?.location?.address
      : "",
    city: profileDetailData?.result?.location?.city
      ? profileDetailData?.result?.location?.city
      : "",
    country: profileDetailData?.result?.location?.country
      ? profileDetailData?.result?.location?.country
      : "",
    state: profileDetailData?.result?.location?.state
      ? profileDetailData?.result?.location?.state
      : "",

    department: profileDetailData?.result?.department
      ? profileDetailData?.result?.department
      : "",
    joiningDate: profileDetailData?.result?.joiningDate
      ? profileDetailData?.result?.joiningDate
      : "",
    role: profileDetailData?.result?.role?.displayName
      ? profileDetailData?.result?.role?.displayName
      : "",
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
  if (isLoadingProfileDetail)
    return <LoadingSpinner />;
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
                <HStack>
                  <Icon boxSize="40px" as={AiTwotoneSetting} />
                  <Heading>General Details</Heading>
                </HStack>
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
                    isReadOnly={true}
                    type="text"
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
