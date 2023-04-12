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
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { FaRegUserCircle, FaGrinStars } from "react-icons/fa";
import { MdOutlineAlternateEmail } from "react-icons/md";
import {
  BsCheckCircleFill,
  BsTelephone,
  BsCalendar2Date,
} from "react-icons/bs";
import { RiFolderUserLine } from "react-icons/ri";
import { AiTwotoneSetting } from "react-icons/ai";
import { GiOfficeChair } from "react-icons/gi";
import ta_test_avt from "../../../assets/ta.jpeg";
import google_logo from "../../../assets/google-ar21-removebg-preview.png";
import FormTextField from "../../../components/field/FormTextField";
import { phoneRegExp } from "../../../Utils/ValidationRegExp";
import _ from "lodash";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  saveProfileDetail,
  uploadProfileImages,
  useGetProfileDetail,
} from "../../../services/setting/profile";
import jwtDecode from "jwt-decode";
import LoadingSpinner from "../../../components/LoadingSpinner";
import ChakraAlertDialog from "../../../components/ChakraAlertDialog";
import { useGetListRoleOfEmployee } from "../../../services/employee/employee";
import ImagesUploading from "../../../components/ImagesUploading";
import { permissionProfile } from "../../../screen-permissions/permission";
import { getPermission } from "../../../services/permission/permission";
import { useGetPermission } from "../../../hook/useGetPermission";
function Profile() {
  const resultPermission = useGetPermission(
    permissionProfile,
    "profile-management"
  );
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
  const useUploadImages = useMutation(uploadProfileImages, {
    onSuccess: (data) => {
      toast({
        title: "Save upload photos successfully",
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
  const [images, setImages] = React.useState([]);
  const maxNumber = 2;
  const onChange = (imageList, addUpdateIndex) => {
    // data for submit
    console.log(imageList, addUpdateIndex);
    setImages(imageList);
  };
  const handleSaveUploadImages = () => {
    const formData = new FormData();
    images.map((item) => {
      formData.append("images", item.file);
    });
    useUploadImages.mutate(formData);
  };
  // if(listRoleOfEmployeeData?.result){
  //   listRoleOfEmployeeData?.result.map((item) =>{
  //     roleArray.push({label:item.displayName,value:item.roleId})
  //   })
  // }
  const initialValues = {
    fullname: profileDetailData?.result?.fullname ?? "",
    email: profileDetailData?.result?.email ?? "",
    gender: profileDetailData?.result?.gender ?? "male",
    phone: profileDetailData?.result?.phoneNumber ?? "",
    dateOfBirth: profileDetailData?.result?.dateOfBirth
      ? new Date(profileDetailData?.result?.dateOfBirth)
          .toISOString()
          .substring(0, 10)
      : "",
    location: {
      country: profileDetailData?.result?.location?.country ?? "",
      state: profileDetailData?.result?.location?.state ?? "",
      city: profileDetailData?.result?.location?.city ?? "",
    },
    address: profileDetailData?.result?.location?.address ?? "",
    department: profileDetailData?.result?.department ?? "",
    role: profileDetailData?.result?.role?.displayName ?? "",
  };
  const validationSchema = Yup.object().shape({
    phone: Yup.string().matches(phoneRegExp, "Phone number is not valid"),
    fullname: Yup.string().required("This field is required"),
    email: Yup.string().required("This field is required"),
    address: Yup.string().required("This field is required"),
    dateOfBirth: Yup.date()
      .max(new Date(), "Your birth date is invalid")
      .required("This field is required"),
  });
  if (isLoadingProfileDetail) return <LoadingSpinner />;
  return (
    <Stack minHeight="100vh" spacing={3}>
      {resultPermission?.read && (
        <Stack>
          <Flex justifyContent="space-between">
            <Box>
              <Flex gap="10px">
                <Box w="10px" bg="blue.700" borderRadius="5px"></Box>
                <Heading fontSize="3xl">Profile Details</Heading>
              </Flex>
              <Text>Update your photo and personal details here.</Text>
            </Box>
          </Flex>
          <Flex
            gap={8}
            flexDirection={{
              base: "column",
              xl: "row",
            }}
          >
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={(values, actions) => {
                onSaveDetailAlertClose();
                const profileDetail = {
                  fullname: values?.fullname,
                  email: values?.email,
                  gender: values?.gender,
                  dateOfBirth: new Date(values?.dateOfBirth).toISOString(),
                  phoneNumber: 1231231231,
                  location: {
                    address: values?.address,
                    city: values?.location?.city ?? "",
                    country: values?.location?.country ?? "",
                    state: values?.location?.state ?? "",
                  },
                };
                const profileDetailObj = {
                  id: userDecodeData?.id,
                  profileDetail: profileDetail,
                };
                useSaveProfileDetail.mutate(profileDetailObj);
              }}
            >
              {(formik) => (
                <>
                  <Stack
                    bgColor="white"
                    flex="1"
                    border="0.5px solid #cfd3df"
                    rounded="lg"
                    as="form"
                    onSubmit={formik.handleSubmit}
                  >
                    <Flex p={4} px={8} pos="relative" alignItems="center">
                      <Heading flex="1" fontSize="xl">
                        Personal Information
                      </Heading>
                      <Button
                        onClick={onSaveDetailAlertOpen}
                        colorScheme="blue"
                        isDisabled={
                          !resultPermission?.update || !formik.isValid
                        }
                      >
                        Save
                      </Button>
                    </Flex>
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
                          isDisabled={!resultPermission?.update}
                        />
                      </Flex>
                      <FormTextField
                        name="email"
                        label="Email"
                        type="email"
                        isReadOnly={true}
                        placeholder="abc@gmail.com"
                        leftIcon={
                          <MdOutlineAlternateEmail
                            color="#999"
                            fontSize="1.5rem"
                          />
                        }
                        isDisabled={!resultPermission?.update}
                      />
                      <Flex gap={8}>
                        <FormTextField
                          name="dateOfBirth"
                          isDateField={true}
                          label="Birth Date"
                          isDisabled={!resultPermission?.update}
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
                          isDisabled={!resultPermission?.update}
                        />
                      </Flex>
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
                          isDisabled={!resultPermission?.update}
                        />
                        <FormTextField
                          name="role"
                          label="Role"
                          isReadOnly={true}
                          type="text"
                          leftIcon={
                            <RiFolderUserLine color="#999" fontSize="1.5rem" />
                          }
                          isDisabled={!resultPermission?.update}
                        />
                      </Flex>
                      <FormTextField
                        name="phone"
                        label="Phone number"
                        type="number"
                        placeholder="Enter your number"
                        leftIcon={
                          <BsTelephone color="#999" fontSize="1.4rem" />
                        }
                        isDisabled={!resultPermission?.update}
                      />

                      <FormTextField
                        name="location"
                        isAddress={true}
                        formik={formik}
                        isDisabled={!resultPermission?.update}
                      />
                      <FormTextField
                        name="address"
                        isTextAreaField={true}
                        label="Address"
                        placeholder="Enter your address"
                        isDisabled={!resultPermission?.update}
                      />
                    </Stack>
                  </Stack>
                  <ChakraAlertDialog
                    title="Save profile detail"
                    message="Are you sure? This action will save your profile details."
                    isOpen={isSaveDetailAlertOpen}
                    onClose={onSaveDetailAlertClose}
                    acceptButtonLabel="Accept"
                    type="submit"
                    onAccept={formik.handleSubmit}
                    acceptButtonColor="blue"
                  />
                </>
              )}
            </Formik>
            <Stack
              bgColor="white"
              flex="1"
              border="0.5px solid #cfd3df"
              rounded="lg"
            >
              <Box p={6} px={8}>
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
                      gap={1}
                      fontSize="large"
                    >
                      <Text fontWeight="bold">Edit your photo</Text>
                      <Button
                        colorScheme="blue"
                        isDisabled={images?.length == 0}
                        onClick={handleSaveUploadImages}
                      >
                        Save these photos
                      </Button>
                    </Box>
                  </Flex>
                  <ImagesUploading
                    images={images}
                    onChange={onChange}
                    maxNumber={maxNumber}
                    isDisabled={!resultPermission.update}
                  />
                </Flex>
                {/* <Box flex={1}>
                        <Flex
                          alignItems="center"
                          justifyContent="space-between"
                        >
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
                      </Box> */}
              </Flex>
            </Stack>
          </Flex>
        </Stack>
      )}
    </Stack>
  );
}

export default Profile;
