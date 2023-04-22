import React from "react";
import {
  Box,
  Divider,
  Flex,
  Heading,
  Stack,
  Text,
  HStack,
  Button,
  Tooltip,
} from "@chakra-ui/react";
import * as Yup from "yup";
import { Formik } from "formik";
import { FaRegUserCircle } from "react-icons/fa";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { BsTelephone } from "react-icons/bs";
import { RiFolderUserLine } from "react-icons/ri";
import FormTextField from "../../../components/field/FormTextField";
import { useGetProfileDetail } from "../../../services/setting/profile";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { Helper } from "../../../Utils/Helper";

function LeaveRequest() {
  // #region declare variable
  var userDecodeData = Helper.getUseDecodeInfor();
  // #endregion
  // #region hooks
  const { data: profileDetailData, isLoading: isLoadingProfileDetail } =
    useGetProfileDetail(userDecodeData.id);
  // #endregion
  // #region form
  var initialValuesExisted = {
    fullname: profileDetailData?.result?.fullname ?? "",
    email: profileDetailData?.result?.email ?? "",
    phone: profileDetailData?.result?.phoneNumber ?? "",
    role: profileDetailData?.result?.role?.displayName ?? "",
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
    note: "",
  };
  const validationSchema = Yup.object().shape({
    leaveType: Yup.string().required("This field is required"),
    reason: Yup.string().required("This field is required"),
    startDate: Yup.date()
      .min(new Date(), "Start date must be in the future")
      .required("This field is required"),
    endDate: Yup.date()
      .min(Yup.ref("startDate"), "End date must be after start date")
      .required("This field is required"),
  });
  // #endregion
  if (isLoadingProfileDetail) return <LoadingSpinner />;
  return (
    <Stack minHeight="100vh" spacing={3}>
      {true && (
        <Formik
          initialValues={initialValuesExisted}
          validationSchema={validationSchema}
          onSubmit={(values, actions) => {
            const leaveRequestObj = {
              employeeId: userDecodeData.id,
              leaveType: values.leaveType,
              startDate: new Date(values?.startDate).toISOString(),
              endDate: new Date(values?.endDate).toISOString(),
              reason: values.reason,
              note: values.note,
            };
            console.log("leaveRequestObj", leaveRequestObj);
            // if (data?.result == null) {
            //   // useCreateOrganizationDetail.mutate(organizationDetail);
            // } else {
            //   // const saveOrganizationDetailObj = {
            //   //   organizationDetail: organizationDetail,
            //   //   id: data?.result?.organizationId,
            //   // };
            //   // useSaveOrganizationDetail.mutate(saveOrganizationDetailObj);
            // }
            actions.resetForm();
          }}
        >
          {(formik) => (
            <Stack as="form" onSubmit={formik.handleSubmit}>
              <Flex justifyContent="space-between">
                <Box>
                  <Flex gap="10px">
                    <Box w="10px" bg="blue.700" borderRadius="5px"></Box>
                    <Heading fontSize="3xl">Leave Request</Heading>
                  </Flex>
                  <Text>Create your leave request</Text>
                </Box>
                <HStack>
                  <Tooltip
                    placement="left"
                    hasArrow
                    label="Create Your Leave Request"
                  >
                    <Button
                      // isLoading={isLoading}
                      type="submit"
                      size="lg"
                      colorScheme="blue"
                      // isDisabled={!resultPermission?.update}
                    >
                      Create
                    </Button>
                  </Tooltip>
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
                      <Heading fontSize="xl">Leave Request Information</Heading>
                    </Box>
                    <Divider />
                    <Stack spacing={3} p={4} px={8}>
                      <FormTextField
                        isReadOnly={true}
                        name="fullname"
                        label="Full Name"
                        placeholder="Enter your Full Name"
                        leftIcon={
                          <FaRegUserCircle color="#999" fontSize="1.5rem" />
                        }
                        // isDisabled={!resultPermission?.update}
                      />
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
                        // isDisabled={!resultPermission?.update}
                      />
                      <FormTextField
                        isReadOnly={true}
                        name="phone"
                        label="Phone number"
                        type="number"
                        placeholder="Enter your number"
                        leftIcon={
                          <BsTelephone color="#999" fontSize="1.4rem" />
                        }
                        // isDisabled={!resultPermission?.update}
                      />
                      <FormTextField
                        name="role"
                        label="Role"
                        isReadOnly={true}
                        type="text"
                        leftIcon={
                          <RiFolderUserLine color="#999" fontSize="1.5rem" />
                        }
                        // isDisabled={!resultPermission?.update}
                      />
                      <FormTextField
                        name="leaveType"
                        label="Leave Type"
                        type="Text"
                        isSelectionField={true}
                        placeholder="---"
                        selectionArray={[
                          { value: "vacation", label: "Vacation" },
                          { value: "sick", label: "Sick" },
                          { value: "quiting", label: "Quiting" },
                          { value: "other", label: "Other" },
                        ]}
                        leftIcon={
                          <BsTelephone color="#999" fontSize="1.4rem" />
                        }
                        // isDisabled={!resultPermission?.update}
                      />
                      <HStack spacing={4}>
                        <FormTextField
                          name="startDate"
                          isDateField={true}
                          label="Start Date"
                          // isDisabled={!resultPermission?.update}
                        />
                        <FormTextField
                          name="endDate"
                          isDateField={true}
                          label="End Date"
                          // isDisabled={!resultPermission?.update}
                        />
                      </HStack>
                      <FormTextField
                        name="reason"
                        label="Reason"
                        isTextAreaField={true}
                        type="text"
                        placeholder="Enter your Reason"
                        // isDisabled={!resultPermission?.update}
                      />
                      <FormTextField
                        name="note"
                        label="Note"
                        isTextAreaField={true}
                        type="text"
                        placeholder="Note*"
                        // isDisabled={!resultPermission?.update}
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

export default LeaveRequest;
