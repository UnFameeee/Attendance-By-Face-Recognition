import React, { useState } from "react";
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
  useToast,
  useDisclosure,
  Badge,
} from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import * as Yup from "yup";
import { leaveRequestDumbData, roleCodeColor } from "../../test/dumbTableData";
import { Formik } from "formik";
import { FaRegUserCircle } from "react-icons/fa";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { BsTelephone } from "react-icons/bs";
import { RiFolderUserLine } from "react-icons/ri";
import FormTextField from "../../../components/field/FormTextField";
import { useGetProfileDetail } from "../../../services/setting/profile";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { Helper } from "../../../Utils/Helper";
import { useGetPermission } from "../../../hook/useGetPermission";
import { permissionLeaveRequestPersonal } from "../../../screen-permissions/permission";
import ChakraAlertDialog from "../../../components/ChakraAlertDialog";
import DynamicDrawer from "../../../components/table/DynamicDrawer";
import DynamicTable, {
  FilterType,
} from "../../../components/table/DynamicTable";
function LeaveRequestPersonal() {
  // #region declare variable
  const resultPermission = useGetPermission(
    permissionLeaveRequestPersonal,
    "leave-request-personal"
  );
  var userDecodeData = Helper.getUseDecodeInfor();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [editData, setEditData] = useState({});
  const [deleteSingleData, setDeleteSingleData] = useState({});
  // #endregion
  // #region hooks
  const { data: profileDetailData, isLoading: isLoadingProfileDetail } =
    useGetProfileDetail(userDecodeData.id);
  const {
    isOpen: isDeleteSingleOpen,
    onOpen: onDeleteSingleOpen,
    onClose: onDeleteSingleClose,
  } = useDisclosure();
  const {
    isOpen: isAddEditOpen,
    onOpen: onAddEditOpen,
    onClose: onAddEditClose,
  } = useDisclosure();
  // #endregion
  // #region functions
  const DeleteRange = (data) => {
    console.log("handleDeleteRange", data);
  };
  const Delete = (row, action) => {
    setDeleteSingleData(row);
    onDeleteSingleOpen();
  };
  const handleAcceptDelete = () => {
    console.log(deleteSingleData);
    setDeleteSingleData({});
    onDeleteSingleClose();
  };
  const Edit = (row, action) => {
    onAddEditOpen();
    setEditData(row);
  };
  const handleViewApproval = (values) => {
    closeDrawer();
  };
  const closeDrawer = () => {
    onAddEditClose();
    setEditData({});
  };
  // #endregion
  // #region form
  var initialValuesExisted = {
    fullname: profileDetailData?.result?.fullname ?? "",
    email: profileDetailData?.result?.email ?? "",
    phone: profileDetailData?.result?.phoneNumber ?? "",
    role: profileDetailData?.result?.role?.displayName ?? "",
    department: profileDetailData?.result?.department?.departmentName ?? "",
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
  // #region table
  const tableRowAction = [
    {
      actionName: "View",
      func: Edit,
      isDisabled: resultPermission?.read,
    },
  ];
  const columns = React.useMemo(
    () => [
      {
        Header: "Id",
        accessor: "id",
        haveFilter: {
          filterType: FilterType.Text,
        },

        cellWidth: "150px",
        hidden: true,
      },
      {
        Header: "Approval",
        accessor: "isApproved",
        haveFilter: {
          filterType: FilterType.Default,
        },
        Cell: ({ value }) => (
          <Badge fontSize="lg">{value ? "yes" : "no"}</Badge>
        ),
        cellWidth: "100px",
      },
      {
        Header: "Leave type",
        accessor: "leaveType",
        haveFilter: {
          filterType: FilterType.Default,
        },
        cellWidth: "150px",
      },
      {
        Header: "Reason",
        accessor: "reason",
        haveFilter: {
          filterType: FilterType.Default,
        },
        cellWidth: "150px",
      },
      {
        Header: "Note",
        accessor: "note",
        haveFilter: {
          filterType: FilterType.Default,
        },
        cellWidth: "150px",
      },
      {
        Header: "Start date",
        accessor: "startDate",
        haveFilter: {
          filterType: FilterType.DateTime,
        },
        cellWidth: "150px",
      },
      {
        Header: "End date",
        accessor: "endDate",
        haveFilter: {
          filterType: FilterType.DateTime,
        },
        cellWidth: "150px",
      },
    ],
    []
  );
  const validationSchemaDrawer = Yup.object().shape();
  // #endregion
  // #region drawer
  const drawerFieldData = [
    {
      name: "isApproved",
      label: "Approval",
      isSelectionField: true,
      isDisabled: true,
      selectionArray: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
    {
      name: "leaveType",
      label: "Leave Type",
      placeholder: "---",
      isReadOnly: true,
    },
    {
      name: "reason",
      label: "Reason",
      isReadOnly: true,
      isTextAreaField: true,
      placeholder: "---",
    },
    {
      name: "note",
      label: "Note",
      isReadOnly: true,
      isTextAreaField: true,
      placeholder: "---",
    },
    {
      name: "startDate",
      label: "Start Date",
      isReadOnly: true,
      placeholder: "---",
    },
    {
      name: "endDate",
      label: "End Date",
      isReadOnly: true,
      placeholder: "---",
    },
  ];
  const initialValues = {
    isApproved: `${editData?.isApproved ?? false}`,
    fullname: `${editData?.fullname ?? ""}`,
    email: `${editData?.email ?? ""}`,
    role: editData?.role ?? "",
    department: editData?.department ?? "",
    leaveType: editData?.leaveType ?? "",
    startDate: editData?.startDate ?? "",
    endDate: editData?.endDate ?? "",
    reason: editData?.reason ?? "",
    note: editData?.note ?? "",
  };
  // #endregion
  if (isLoadingProfileDetail) return <LoadingSpinner />;
  return (
    <HStack minHeight="100vh" alignItems="baseline" spacing={3}>
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
          actions.resetForm();
        }}
      >
        {(formik) => (
          <Stack flex="50%" as="form" onSubmit={formik.handleSubmit}>
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
                    size="md"
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
                      leftIcon={<BsTelephone color="#999" fontSize="1.4rem" />}
                      // isDisabled={!resultPermission?.update}
                    />
                    <Flex gap={8}>
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
                        name="department"
                        label="Department"
                        isReadOnly={true}
                        type="text"
                        leftIcon={
                          <RiFolderUserLine color="#999" fontSize="1.5rem" />
                        }
                        // isDisabled={!resultPermission?.update}
                      />
                    </Flex>
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
                      leftIcon={<BsTelephone color="#999" fontSize="1.4rem" />}
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
      <Box flex="60%" minW={0}>
        <DynamicTable
          onAddEditOpen={onAddEditOpen}
          handleDeleteRange={DeleteRange}
          tableRowAction={tableRowAction}
          columns={columns}
          data={leaveRequestDumbData}
          permission={resultPermission}
          hideAction={true}
          noPaging={true}
        />
        <DynamicDrawer
          handleEdit={handleViewApproval}
          isAddEditOpen={isAddEditOpen}
          onAddEditClose={onAddEditClose}
          editData={editData}
          setEditData={setEditData}
          validationSchema={validationSchemaDrawer}
          initialValues={initialValues}
          drawerFieldData={drawerFieldData}
          titleArray={["View", "Create"]}
          disableSubmit={true}
        />
      </Box>
      <ChakraAlertDialog
        title="Delete Single"
        isOpen={isDeleteSingleOpen}
        onClose={onDeleteSingleClose}
        onAccept={handleAcceptDelete}
      />
    </HStack>
  );
}

export default LeaveRequestPersonal;
