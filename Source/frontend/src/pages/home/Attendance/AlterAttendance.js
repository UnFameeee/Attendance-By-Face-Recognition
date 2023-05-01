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
} from "@chakra-ui/react";
import React from "react";
import FormTextField from "../../../components/field/FormTextField";
import { Formik } from "formik";
import ta_test from "../../../assets/ta.jpeg";
import { AiOutlineMail } from "react-icons/ai";
import { BiUser } from "react-icons/bi";
import ImagesUploading from "../../../components/ImagesUploading";
function AlterAttendance() {
  const [images, setImages] = React.useState([]);
  const onChange = (imageList, addUpdateIndex) => {
    // data for submit
    console.log(imageList, addUpdateIndex);
    setImages(imageList);
  };
  const initialValues = {
    attendanceType: "",
  };
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
          <Formik initialValues={initialValues}>
            {(formik) => (
              <>
                <Box w={{ base: "250px" }} h="150px">
                  <ImagesUploading
                    maxNumber={1}
                    images={images}
                    onChange={onChange}
                    noDescription={true}
                  />
                </Box>
                <HStack>
                  <FormTextField
                    name="attendanceType"
                    isSelectionField={true}
                    label="Attendance Type"
                    selectionArray={[
                      { label: "Check In", value: true },
                      { label: "Check Out", value: false },
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
                  selectionArray={[
                    { label: "Dep1", value: "Dep1" },
                    { label: "Dep2", value: "Dep2" },
                  ]}
                />
                <Button type="submit" colorScheme="blue">
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

export default AlterAttendance;
