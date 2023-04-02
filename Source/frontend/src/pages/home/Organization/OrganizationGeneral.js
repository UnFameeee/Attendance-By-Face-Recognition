import React, { useEffect } from "react";
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
  Spinner,
  Center,
  useToast,
} from "@chakra-ui/react";
import * as Yup from "yup";
import { Field, Formik } from "formik";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { FaRegUserCircle, FaGrinStars } from "react-icons/fa";
import { MdOutlineAlternateEmail } from "react-icons/md";
import {
  BsCheckCircleFill,
  BsTelephone,
  BsCalendar2Date,
  BsFillMapFill,
} from "react-icons/bs";
import { RiFolderUserLine } from "react-icons/ri";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { GiModernCity } from "react-icons/gi";
import { SlOrganization } from "react-icons/sl";
import { TfiWorld } from "react-icons/tfi";
import FormTextField from "../../../components/field/FormTextField";
import {
  createOrganizationDetail,
  getOrganizationDetail,
  saveOrganizationDetail,
  useGetOrganizationDetail,
} from "../../../services/organization/organization";
import { useMutation, useQueryClient } from "react-query";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { permissionOrganizationGeneral } from "../../../screen-permissions/permission";
import { useGetPermission } from "../../../hook/useGetPermission";
function OrganizationGeneral() {
  const resultPermission = useGetPermission(
    permissionOrganizationGeneral,
    "organization-management"
  );
  const toast = useToast();
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useGetOrganizationDetail();
  const useCreateOrganizationDetail = useMutation(createOrganizationDetail, {
    onSuccess: (data) => {
      queryClient.invalidateQueries("organizationDetail");
      toast({
        title: "Save organization detail successfully",
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
  const useSaveOrganizationDetail = useMutation(saveOrganizationDetail, {
    onSuccess: (data) => {
      const { result } = data;
      queryClient.invalidateQueries("organizationDetail");
      toast({
        title: "Save organization detail successfully",
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
  var initialValuesExisted = {
    organizationName: data?.result?.organizationName
      ? data?.result?.organizationName
      : "",
    megaAddress: {
      country: data?.result?.location?.country ?? "",
      state: data?.result?.location?.state ?? "",
      city: data?.result?.location?.city ?? "",
    },
    address: data?.result?.location?.address ?? "",
  };
  const validationSchema = Yup.object().shape({
    organizationName: Yup.string().required("This field is required"),
    // address: Yup.string().required("This field is required"),
  });
  if (isLoading) return <LoadingSpinner />;
  return (
    <Stack minHeight="100vh" spacing={3}>
      {resultPermission?.read && (
        <Formik
          initialValues={initialValuesExisted}
          validationSchema={validationSchema}
          onSubmit={(values, actions) => {
            const organizationDetail = {
              organizationName: values.organizationName,
              location: {
                address: values.address,
                city: values.megaAddress?.city ?? "",
                country: values.megaAddress?.country ?? "",
                state: values.megaAddress?.state ?? "",
              },
            };
            if (data?.result == null) {
              useCreateOrganizationDetail.mutate(organizationDetail);
            } else {
              const saveOrganizationDetailObj = {
                organizationDetail: organizationDetail,
                id: data?.result?.organizationId,
              };
              useSaveOrganizationDetail.mutate(saveOrganizationDetailObj);
            }
            //actions.resetForm();
          }}
        >
          {(formik) => (
            <Stack as="form" onSubmit={formik.handleSubmit}>
              <Flex
                justifyContent="space-between"
                flexDirection={{
                  base: "column",
                  sm: "row",
                }}
              >
                <Box>
                  <Flex gap="10px">
                    <Box w="10px" bg="blue.700" borderRadius="5px"></Box>
                    <Heading fontSize="3xl">General Details</Heading>
                  </Flex>
                  <Text>
                    Update your organization and location details here.
                  </Text>
                </Box>
                <HStack>
                  <Button
                    isLoading={isLoading}
                    type="submit"
                    size="lg"
                    colorScheme="blue"
                    isDisabled={!resultPermission?.update}
                  >
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
                  <>
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
                        isDisabled={!resultPermission?.update}
                      />
                      <FormTextField
                        name="megaAddress"
                        isAddress={true}
                        formik={formik}
                        isDisabled={!resultPermission?.update}
                      />
                      <FormTextField
                        name="address"
                        label="Address"
                        isTextAreaField={true}
                        type="text"
                        placeholder="Enter your Address"
                        isDisabled={!resultPermission?.update}
                      />
                    </Stack>
                  </>
                </Stack>
              </Flex>
            </Stack>
          )}
        </Formik>
      )}
    </Stack>
  );
}

export default OrganizationGeneral;
