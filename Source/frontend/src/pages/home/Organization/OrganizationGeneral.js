import React, { useEffect, useState } from "react";
import {
  Box,
  Divider,
  Flex,
  Heading,
  Stack,
  HStack,
  Button,
  useToast,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import * as Yup from "yup";
import { Formik } from "formik";
import { SlOrganization } from "react-icons/sl";
import FormTextField from "../../../components/field/FormTextField";
import {
  organizationService,
  useGetOrganizationDetail,
} from "../../../services/organization/organization";
import { useMutation, useQueryClient } from "react-query";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { permissionOrganizationManagement } from "../../../screen-permissions/permission";
import { useGetPermission } from "../../../hook/useGetPermission";
import ModifyShiftTypeModal from "../../../components/ModifyShiftTypeModal";
import ModifyLeaveTypeModal from "../../../components/ModifyLeaveTypeModal";
function OrganizationGeneral() {
  // #region declare variable
  const resultPermission = useGetPermission(
    permissionOrganizationManagement,
    "organization-management"
  );
  const toast = useToast();
  const queryClient = useQueryClient();
  // #endregion
  // #region hooks
  const {
    data: organizationDetailData,
    isLoading: isLoadingOrganizationDetailData,
    isFetching: isFetchingOrganizationDetail,
  } = useGetOrganizationDetail();
  const useCreateOrganizationDetail = useMutation(
    organizationService.createOrganizationDetail,
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
          queryClient.invalidateQueries("organizationDetail");
          toast({
            title: "Save Organization Detail Successfully",
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
  const useSaveOrganizationDetail = useMutation(
    organizationService.saveOrganizationDetail,
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
          queryClient.invalidateQueries("organizationDetail");
          toast({
            title: "Save Organization Detail Successfully",
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
  // #region form
  var initialValues = {
    organizationName: organizationDetailData?.result?.organizationName ?? "",
    limitEarlyLeave: organizationDetailData?.result?.limitEarlyLeave ?? "18:00",
    limitLateArrival:
      organizationDetailData?.result?.limitLateArrival ?? "09:00",
    annualLeave: organizationDetailData?.result?.yearlyAnnualLeave ?? "12",
    megaAddress: {
      country: organizationDetailData?.result?.location?.country ?? "",
      state: organizationDetailData?.result?.location?.state ?? "",
      city: organizationDetailData?.result?.location?.city ?? "",
    },
    address: organizationDetailData?.result?.location?.address ?? "",
  };
  const validationSchema = Yup.object().shape({
    organizationName: Yup.string().required("This field is required"),
    // address: Yup.string().required("This field is required"),
  });
  // #endregion
  if (isLoadingOrganizationDetailData) return <LoadingSpinner />;
  return (
    <>
      {resultPermission?.read && (
        <Stack h="100%" spacing={3}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, actions) => {
              const organizationDetail = {
                organizationName: values.organizationName,
                yearlyAnnualLeave: values.annualLeave,
                limitEarlyLeave: values.limitEarlyLeave,
                limitLateArrival: values.limitLateArrival,
                location: {
                  address: values.address,
                  city: values.megaAddress?.city ?? "",
                  country: values.megaAddress?.country ?? "",
                  state: values.megaAddress?.state ?? "",
                },
              };
              if (organizationDetailData?.result == null) {
                useCreateOrganizationDetail.mutate(organizationDetail);
              } else {
                const saveOrganizationDetailObj = {
                  organizationDetail: organizationDetail,
                  id: organizationDetailData?.result?.organizationId,
                };
                useSaveOrganizationDetail.mutate(saveOrganizationDetailObj);
              }
              //actions.resetForm();
            }}
          >
            {(formik) => (
              <Stack as="form" onSubmit={formik.handleSubmit}>
                {useSaveOrganizationDetail.isLoading ||
                useCreateOrganizationDetail.isLoading ? (
                  <LoadingSpinner />
                ) : (
                  <>
                    <Flex
                      justifyContent="space-between"
                      gap="10px"
                      flexDirection={{
                        base: "column",
                        sm: "row",
                      }}
                    >
                      <VStack alignItems="baseline">
                        <Flex
                          gap="10px"
                          bg="white"
                          rounded="md"
                          p={2}
                          w="fit-content"
                          shadow="2xl"
                        >
                          <Box w="10px" bg="blue.700" borderRadius="5px"></Box>
                          <Heading fontSize="3xl">Organization Details</Heading>
                        </Flex>
                        <Flex gap='10px'>
                          <ModifyShiftTypeModal />
                          <ModifyLeaveTypeModal />
                        </Flex>
                      </VStack>
                      <HStack></HStack>
                    </Flex>
                    <Flex
                      shadow="2xl"
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
                          <Flex alignItems="center" p={4} px={8}>
                            <Box flex="1">
                              <Heading fontSize="xl">
                                Organization Information
                              </Heading>
                            </Box>
                            <Tooltip
                              placement="left"
                              hasArrow
                              label="Save Your Organization Information"
                            >
                              <Button
                                isLoading={isLoadingOrganizationDetailData}
                                type="submit"
                                size="lg"
                                colorScheme="blue"
                                isDisabled={!resultPermission?.update}
                              >
                                Save
                              </Button>
                            </Tooltip>
                          </Flex>
                          <Divider />
                          <Stack spacing={3} p={4} px={8}>
                            <FormTextField
                              name="organizationName"
                              label="Organization Name"
                              placeholder="Enter your Organization Name"
                              leftIcon={
                                <SlOrganization
                                  color="#999"
                                  fontSize="1.5rem"
                                />
                              }
                              isDisabled={!resultPermission?.update}
                            />
                            <FormTextField
                              name="limitEarlyLeave"
                              label="Early Leave"
                              isTimeField={true}
                              isDisabled={!resultPermission?.update}
                            />
                            <FormTextField
                              name="limitLateArrival"
                              label="Late Arrival"
                              isTimeField={true}
                              isDisabled={!resultPermission?.update}
                            />
                            <FormTextField
                              name="annualLeave"
                              label="Annual Leave"
                              type="number"
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
                  </>
                )}
              </Stack>
            )}
          </Formik>
        </Stack>
      )}
    </>
  );
}

export default OrganizationGeneral;
