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
import SearchAndSelectAddressField from "../../../components/SearchAndSelectAddressField";

function Profile() {
  return (
    <Stack minHeight="100vh" spacing={3} paddingX={20} paddingTop={2}>
      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          email: "",
          gender: "male",
          phone: "",
          birthDate: undefined,
          about: "",
          address: "",
          department: "",
          workLocation: "",
          status: "",
          joiningDate: undefined,
          role: "",
        }}
        validationSchema={Yup.object({
          phone: Yup.string().matches(phoneRegExp, "Phone number is not valid"),
        })}
        onSubmit={(values, actions) => {

          alert(JSON.stringify(values, null, 2));
          //actions.resetForm();
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
                <Button variant="outline" bgColor="white" size="lg">
                  Cancel
                </Button>
                <Button type="submit" size="lg" colorScheme="blue">
                  Save
                </Button>
              </HStack>
            </Flex>
            <Flex gap={8}>
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
                      name="firstName"
                      label="First Name"
                      placeholder="Enter your First Name"
                      leftIcon={
                        <FaRegUserCircle color="#999" fontSize="1.5rem" />
                      }
                    />
                    <FormTextField
                      name="lastName"
                      label="Last Name"
                      placeholder="Enter your Last Name"
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
                      type="text"
                      isReadOnly={true}
                      placeholder="148Primas"
                      leftIcon={
                        <HiOutlineBuildingOffice2
                          color="#999"
                          fontSize="1.5rem"
                        />
                      }
                    />
                    <FormTextField
                      name="workLocation"
                      label="Work Location"
                      type="text"
                      isReadOnly={true}
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
                  <Flex gap={8}>
                    <FormTextField
                      name="status"
                      label="Status"
                      type="text"
                      isReadOnly={true}
                      placeholder="Idle"
                      leftIcon={<FaGrinStars color="#999" fontSize="1.5rem" />}
                    />
                    <FormTextField
                      name="role"
                      label="Role"
                      type="text"
                      isReadOnly={true}
                      placeholder="Employee"
                      leftIcon={
                        <RiFolderUserLine color="#999" fontSize="1.5rem" />
                      }
                    />
                  </Flex>
                  <FormTextField
                    isTextAreaField={true}
                    name="address"
                    label="Address"
                    placeholder="Search and select your address..."
                    formik={formik}
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
                      name="birthDate"
                      isDateField={true}
                      label="Birth Date"
                    />
                  </Flex>

                  <FormTextField
                    name="about"
                    isTextAreaField={true}
                    label="About"
                    placeholder="Describe yourself..."
                  />
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
