import {
  Text,
  Stack,
  Center,
  Avatar,
  VStack,
  HStack,
  Select,
  Image,
  Button,
  Heading,
  Flex,
  Box,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import FormTextField from "../../../components/field/FormTextField";
import { Formik } from "formik";
import { AiOutlineMail } from "react-icons/ai";
import { BiUser } from "react-icons/bi";
import ImagesUploading from "../../../components/ImagesUploading";
import { useGetListDepartment } from "../../../services/organization/department";
import * as Yup from "yup";
import { useMutation } from "react-query";
import { attendanceService } from "../../../services/attendance/attendance";
import { Helper } from "../../../Utils/Helper";
import { useSelector } from "react-redux";
function ReportAttendanceException() {
  // #region declare variable
  const toast = useToast();
  const [images, setImages] = React.useState([]);
  const [imageSrc, setImageSrc] = React.useState("");
  const params = new URLSearchParams(window.location.search);
  const urlImage = Helper.decodeWithCipher(params.get("session"));
  // #endregion
  // #region hooks
  useEffect(() => {
    if (urlImage) {
      setImageSrc(urlImage);
    }
  }, []);

  const useSubmissionOfExceptionAttendance = useMutation(
    attendanceService.submissionOfExceptionAttendance,
    {
      onSuccess: (data) => {
        const { message } = data;
        if (message) {
          toast({
            title: message,
            position: "bottom-right",
            status: "error",
            isClosable: true,
            duration: 5000,
          });
        } else {
          toast({
            title: "Submit Attendance Exception Successfully",
            position: "bottom-right",
            status: "success",
            isClosable: true,
            duration: 5000,
          });
        }
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
    }
  );
  // #endregion
  // #region functions
  const onChange = (imageList, addUpdateIndex) => {
    // data for submit
    console.log(imageList, addUpdateIndex);
    setImages(imageList);
  };
  // #endregion
  // #region form
  const initialValues = {
    attendanceType: "CHECKIN",
    name: "",
    email: "",
    department: "",
  };
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("This field is required"),
    email: Yup.string().required("This field is required"),
    department: Yup.string().required("This field is required"),
  });
  const { data: listDepartment } = useGetListDepartment();
  const [listDepartmentArray, setListDepartmentArray] = useState([])
  useEffect(() => {
    setListDepartmentArray(Helper.convertToArraySelection(listDepartment?.result?.data, "departmentName", "departmentId"))
  }, [listDepartment])
  // #endregion
  return (
    <Stack bgColor="gray.200" h="100vh">
      <Center
        m="auto"
        w={{ base: "85%", md: "70%" }}
        py="2rem"
        rounded="md"
        bg="white"
      >
        <VStack w="80%" spacing="15px">
          <Flex w="100%" gap="10px">
            <Box w="10px" bg="blue.700" borderRadius="5px"></Box>
            <Heading fontSize="1.5rem">Attendance Failure Record</Heading>
          </Flex>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, action) => {
              // console.log(values, "values");
              // console.log("imageSrc", imageSrc);
              let submissionObj = {};
              submissionObj["attendanceType"] = values.attendanceType;
              submissionObj["departmentId"] = values.department;
              submissionObj["email"] = values.email;
              submissionObj["name"] = values.name;
              submissionObj["image"] = imageSrc;
              useSubmissionOfExceptionAttendance.mutate(submissionObj)
            }}
          >
            {(formik) => (
              <>
                <Flex
                  alignItems="center"
                  justifyContent="center"
                  w={{ base: "250px" }}
                  h="200px"
                >
                  {/* <ImagesUploading
                    maxNumber={1}
                    images={images}
                    onChange={onChange}
                    noDescription={true}
                  /> */}
                  <Image src={imageSrc} objectFit="cover" boxSize="200px" />
                </Flex>
                <HStack>
                  <FormTextField
                    name="attendanceType"
                    isSelectionField={true}
                    label="Attendance Type"
                    selectionArray={[
                      { label: "Check In", value: "CHECKIN" },
                      { label: "Check Out", value: "CHECKOUT" },
                    ]}
                  />
                </HStack>
                <FormTextField name="name" label="Name" leftIcon={<BiUser />} />
                <FormTextField
                  name="email"
                  label="Email"
                  leftIcon={<AiOutlineMail />}
                />
                <FormTextField
                  name="department"
                  isSelectionField={true}
                  label="Department"
                  placeholder="---"
                  selectionArray={listDepartmentArray}
                />
                <Button onClick={formik.handleSubmit} colorScheme="blue">
                  Submit
                </Button>
              </>
            )}
          </Formik>
        </VStack>
      </Center>
    </Stack>
  );
}

export default ReportAttendanceException;
