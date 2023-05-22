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
  useDisclosure
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
import { Helper } from "../../../Utils/Helper";
import ChakraAlertDialog from "../../../components/ChakraAlertDialog";
function OrganizationGeneral() {
  // #region declare variable
  const resultPermission = useGetPermission(
    permissionOrganizationManagement,
    "organization-management"
  );
  const toast = useToast();
  const queryClient = useQueryClient();
  const [userInfo, setUserInfo] = useState(Helper.getUseDecodeInfor());
  // #endregion
  // #region hooks
  const {
    isOpen: isSaveAlertOpen,
    onOpen: onSaveAlertOpen,
    onClose: onSaveAlertClose,
  } = useDisclosure();
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
  function handleAcceptSaveAlert() {}
  function convertToHour(value) {
    const [hoursString, minutesString] = value.split(":");
    const hours = parseInt(hoursString, 10);
    return hours;
  }
  function convertToMinute(value) {
    const [hoursString, minutesString] = value.split(":");
    const minutes = parseInt(minutesString, 10);
    return minutes;
  }
  var initialValues = {
    organizationName: organizationDetailData?.result?.organizationName ?? "",
    limitEarlyLeaveHour: organizationDetailData?.result?.limitEarlyLeave
      ? convertToHour(organizationDetailData?.result?.limitEarlyLeave)
      : 1,
    limitEarlyLeaveMinute: organizationDetailData?.result?.limitEarlyLeave
      ? convertToMinute(organizationDetailData?.result?.limitEarlyLeave)
      : 30,
    limitLateArrivalHour: organizationDetailData?.result?.limitLateArrival
      ? convertToHour(organizationDetailData?.result?.limitLateArrival)
      : 1,
    limitLateArrivalMinute: organizationDetailData?.result?.limitLateArrival
      ? convertToMinute(organizationDetailData?.result?.limitLateArrival)
      : 30,
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
    limitEarlyLeaveHour: Yup.number()
      .moreThan(-1, "Invalid value")
      .lessThan(25, "Invalid value"),
    limitLateArrivalHour: Yup.number()
      .moreThan(-1, "Invalid value")
      .lessThan(25, "Invalid value"),
    limitEarlyLeaveMinute: Yup.number()
      .moreThan(-1, "Invalid value")
      .lessThan(61, "Invalid value"),
    limitLateArrivalMinute: Yup.number()
      .moreThan(-1, "Invalid value")
      .lessThan(61, "Invalid value"),
    // address: Yup.string().required("This field is required"),
  });
  // console.log("initialValues", initialValues);
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
              debugger;
              const organizationDetail = {
                organizationName: values.organizationName,
                yearlyAnnualLeave: values.annualLeave,
                limitEarlyLeave: `${values.limitEarlyLeaveHour}:${values.limitEarlyLeaveMinute}`,
                limitLateArrival: `${values.limitLateArrivalHour}:${values.limitLateArrivalMinute}`,
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
              onSaveAlertClose();
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
                        {userInfo.roleName == "admin" && (
                          <Flex gap="10px">
                            <ModifyShiftTypeModal />
                            <ModifyLeaveTypeModal />
                          </Flex>
                        )}
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
                            {userInfo.roleName == "admin" && (
                              <Tooltip
                                placement="left"
                                hasArrow
                                label="Save Your Organization Information"
                              >
                                <Button
                                  isLoading={isLoadingOrganizationDetailData}
                                  onClick={onSaveAlertOpen}
                                  size="lg"
                                  colorScheme="blue"
                                  isDisabled={!resultPermission?.update}
                                >
                                  Save
                                </Button>
                              </Tooltip>
                            )}
                            <ChakraAlertDialog
                              title="Save Organization Details"
                              isOpen={isSaveAlertOpen}
                              onClose={onSaveAlertClose}
                              onAccept={formik.handleSubmit}
                              acceptButtonColor="blue"
                              acceptButtonLabel="Accept"
                            />
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
                              isReadOnly={!resultPermission?.update}
                            />
                            <Flex gap={5}>
                              <Box w="fit-content">
                                <FormTextField
                                  name="limitLateArrivalHour"
                                  label="Late Arrival Hour"
                                  type="number"
                                  isReadOnly={!resultPermission?.update}
                                />
                              </Box>
                              <Box w="fit-content">
                                <FormTextField
                                  name="limitLateArrivalMinute"
                                  label="Late Arrival Minute"
                                  type="number"
                                  isReadOnly={!resultPermission?.update}
                                />
                              </Box>
                            </Flex>
                            <Flex gap={5}>
                              <Box w="fit-content">
                                <FormTextField
                                  name="limitEarlyLeaveHour"
                                  label="Early Leave Hour"
                                  type="number"
                                  isReadOnly={!resultPermission?.update}
                                />
                              </Box>
                              <Box w="fit-content">
                                <FormTextField
                                  name="limitEarlyLeaveMinute"
                                  label="Early Leave Minute"
                                  type="number"
                                  isReadOnly={!resultPermission?.update}
                                />
                              </Box>
                            </Flex>
                            <FormTextField
                              name="annualLeave"
                              label="Annual Leave"
                              type="number"
                              isReadOnly={!resultPermission?.update}
                            />
                            <FormTextField
                              name="megaAddress"
                              isAddress={true}
                              formik={formik}
                              isReadOnly={!resultPermission?.update}
                            />
                            <FormTextField
                              name="address"
                              label="Address"
                              isTextAreaField={true}
                              type="text"
                              placeholder="Enter your Address"
                              isReadOnly={!resultPermission?.update}
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
