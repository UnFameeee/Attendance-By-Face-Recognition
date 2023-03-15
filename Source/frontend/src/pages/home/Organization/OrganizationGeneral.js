import React from "react";
import {
  Box,
  Divider,
  Flex,
  Heading,
  Stack,
  Text,
  Icon,
  Textarea,
  Image,
  HStack,
  Button,
  ButtonGroup,
} from "@chakra-ui/react";
import * as Yup from "yup";
import { Field, Formik } from "formik";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { FaRegUserCircle, FaGrinStars } from "react-icons/fa";
import { MdOutlineAlternateEmail } from "react-icons/md";
import {
  BsCheckCircleFill,
  BsTelephone,
  BsCalendar2Date,BsFillMapFill
} from "react-icons/bs";
import { RiFolderUserLine } from "react-icons/ri";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { GiModernCity } from "react-icons/gi";
import { SlOrganization } from "react-icons/sl";
import {TfiWorld} from 'react-icons/tfi'
import FormTextField from "../../../components/FormTextField";

function OrganizationGeneral() {
  const initialValues = {
    organizationName: "",
    address: "",
    city: "",
    state: "",
    country: "",
  };
  const validationSchema = Yup.object().shape({});
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
          alert(JSON.stringify(values, null, 2));
          //actions.resetForm();
        }}
      >
        {(formik) => (
          <Stack as="form" onSubmit={formik.handleSubmit}>
            <Flex justifyContent="space-between">
              <Box>
                <Heading>General Details</Heading>
                <Text>Update your organization and location details here.</Text>
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
                  <Heading fontSize="xl">Organization Information</Heading>
                </Box>
                <Divider />
                <Stack spacing={3} p={4} px={8}>
                  <FormTextField
                    name="organizationName"
                    label="Organization Name"
                    placeholder="Enter your Organization Name"
                    leftIcon={
                      <SlOrganization color="#999" fontSize="1.5rem" />
                    }
                  />
                  <FormTextField
                    name="city"
                    label="City"
                    placeholder="Enter your City"
                    leftIcon={
                      <GiModernCity color="#999" fontSize="1.5rem" />
                    }
                  />
                  <FormTextField
                    name="state"
                    label="State"
                    type="text"
                    placeholder="Enter your State"
                    leftIcon={
                      <BsFillMapFill color="#999" fontSize="1.5rem" />
                    }
                  />
                  <FormTextField
                    name="country"
                    label="Country"
                    type="text"
                    placeholder="Enter your Country"
                    leftIcon={
                      <TfiWorld color="#999" fontSize="1.5rem" />
                    }
                  />
                  <FormTextField
                    name="address"
                    label="Address"
                    isTextAreaField={true}
                    type="text"
                    placeholder="Enter your Address"
                  />
                </Stack>
              </Stack>
            </Flex>
          </Stack>
        )}
      </Formik>
    </Stack>
  );
}

export default OrganizationGeneral;
