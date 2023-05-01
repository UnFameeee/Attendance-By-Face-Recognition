import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import * as Yup from "yup";
import DynamicTable, {
  FilterType,
} from "../../../components/table/DynamicTable";
import DynamicDrawer from "../../../components/table/DynamicDrawer";
import ChakraAlertDialog from "../../../components/ChakraAlertDialog";
import NoDataToDisplay from "../../../components/NoDataToDisplay";
import LoadingSpinner from "../../../components/LoadingSpinner";
import {
  Badge,
  Box,
  Flex,
  Heading,
  Stack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useGetPermission } from "../../../hook/useGetPermission";
import { permissionLeaveRequestManagement } from "../../../screen-permissions/permission";
import { FaRegUserCircle } from "react-icons/fa";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { leaveRequestDumbData, roleCodeColor } from "../../test/dumbTableData";

function LeaveRequestManagement() {
  // #region declare variable
  const resultPermission = useGetPermission(
    permissionLeaveRequestManagement,
    "leave-request-management"
  );
  const toast = useToast();
  const queryClient = useQueryClient();
  const [editData, setEditData] = useState({});
  const [deleteSingleData, setDeleteSingleData] = useState({});
  // #endregion
  // #region hooks
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
  const handleApprovalLeaveRequest = (values) => {
    closeDrawer();
  };
  const closeDrawer = () => {
    onAddEditClose();
    setEditData({});
  };
  const matchingRoleColor = (value) => {
    return roleCodeColor.find(
      (item) => Object.keys(item)[0].toLowerCase() === value.toLowerCase()
    );
  };
  // #endregion
  // #region table
  const tableRowAction = [
    {
      actionName: "Edit",
      func: Edit,
      isDisabled: resultPermission?.update,
    },
    {
      actionName: "Delete",
      func: Delete,
      isDisabled: resultPermission?.delete,
    },
  ];
  const columns = React.useMemo(
    () => [
      {
        Header: "Id",
        accessor: "id",
        // haveFilter: {
        //   filterType: FilterType.Text,
        // },
        cellWidth: "150px",
        hidden: true,
      },
      {
        Header: "Approval",
        accessor: "isApproved",
        // haveFilter: {
        //   filterType: FilterType.Default,
        // },
        Cell: ({ value }) => (
          <Badge fontSize="lg">{value ? "yes" : "no"}</Badge>
        ),
        cellWidth: "150px",
      },
      {
        Header: "Full Name",
        accessor: "fullname",
        // haveFilter: {
        //   filterType: FilterType.Text,
        // },

        cellWidth: "150px",
      },
      {
        Header: "Email",
        accessor: "email",
        // haveFilter: {
        //   filterType: FilterType.Default,
        // },
      },
      {
        Header: "Role",
        accessor: "role",
        Cell: ({ value }) => <Badge fontSize="lg">{value}</Badge>,
        // haveFilter: {
        //   filterType: FilterType.Default,
        // },
        cellWidth: "150px",
      },
      {
        Header: "Department",
        accessor: "department",
        cellWidth: "150px",
        Cell: ({ value }) => <span>{value}</span>,
        // haveFilter: {
        //   filterType: FilterType.Text,
        // },
      },
      {
        Header: "Leave type",
        accessor: "leaveType",
        // haveFilter: {
        //   filterType: FilterType.Default,
        // },
        cellWidth: "150px",
      },
      {
        Header: "Reason",
        accessor: "reason",
        // haveFilter: {
        //   filterType: FilterType.Default,
        // },
        cellWidth: "150px",
      },
      {
        Header: "Note",
        accessor: "note",
        // haveFilter: {
        //   filterType: FilterType.Default,
        // },
        cellWidth: "150px",
      },
      {
        Header: "Start date",
        accessor: "startDate",
        // haveFilter: {
        //   filterType: FilterType.DateTime,
        // },
        cellWidth: "150px",
      },
      {
        Header: "End date",
        accessor: "endDate",
        // haveFilter: {
        //   filterType: FilterType.DateTime,
        // },
        cellWidth: "150px",
      },
    ],
    []
  );
  // #endregion
  // #region drawer
  const drawerFieldData = [
    {
      name: "isApproved",
      label: "Approval",
      isSelectionField: true,
      selectionArray: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
    {
      name: "fullname",
      isReadOnly: true,
      label: "Full Name",
      placeholder: "Enter your Full Name",
      leftIcon: <FaRegUserCircle color="#999" fontSize="1.5rem" />,
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "abc@gmail.com",
      isReadOnly: true,
      leftIcon: <MdOutlineAlternateEmail color="#999" fontSize="1.5rem" />,
    },
    {
      name: "role",
      label: "Role",
      isReadOnly: true,
      placeholder: "---",
    },
    {
      name: "department",
      label: "Department",
      placeholder: "---",
      isReadOnly: true,
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
  const validationSchema = Yup.object().shape();
  // #endregion
  // #region form
  // #endregion

  return (
    <Stack minHeight="100vh" spacing={4}>
      <Flex gap="10px">
        <Box w="10px" bg="blue.700" borderRadius="5px"></Box>
        <Heading fontSize="3xl">Leave Request Management</Heading>
      </Flex>
      <Box marginTop="10px">
        {false ? (
          <NoDataToDisplay h="450px" />
        ) : (
          <>
            <DynamicTable
              onAddEditOpen={onAddEditOpen}
              handleDeleteRange={DeleteRange}
              tableRowAction={tableRowAction}
              columns={columns}
              data={leaveRequestDumbData}
              permission={resultPermission}
              noPaging={true}
              hideButtons={true}
            />
            <DynamicDrawer
              handleEdit={handleApprovalLeaveRequest}
              isAddEditOpen={isAddEditOpen}
              onAddEditClose={onAddEditClose}
              editData={editData}
              setEditData={setEditData}
              validationSchema={validationSchema}
              initialValues={initialValues}
              drawerFieldData={drawerFieldData}
            />
            <ChakraAlertDialog
              title="Delete Single"
              isOpen={isDeleteSingleOpen}
              onClose={onDeleteSingleClose}
              onAccept={handleAcceptDelete}
            />
          </>
        )}
      </Box>
    </Stack>
  );
}

export default LeaveRequestManagement;
