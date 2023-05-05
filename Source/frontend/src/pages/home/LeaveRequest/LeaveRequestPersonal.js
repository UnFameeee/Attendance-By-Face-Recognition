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
  VStack,
} from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import * as Yup from "yup";
import { leaveRequestDumbData, roleCodeColor } from "../../test/dumbTableData";
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
  const handleSubmitApproval = (values) => {
    const leaveRequestObj = {
      employeeId: userDecodeData.id,
      leaveType: values.leaveType,
      startDate: new Date(values?.startDate).toISOString(),
      endDate: new Date(values?.endDate).toISOString(),
      reason: values.reason,
      note: values.note,
    };
    console.log("leaveRequestObj", leaveRequestObj);
    closeDrawer();
  };
  const closeDrawer = () => {
    onAddEditClose();
    setEditData({});
  };
  // #endregion
  // #region form
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
          <Badge p='5px' fontSize="lg">{value ? "yes" : "no"}</Badge>
        ),
        cellWidth: "100px",
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
        cellWidth: "200px",

        // haveFilter: {
        //   filterType: FilterType.Default,
        // },
      },
      {
        Header: "Note",
        accessor: "note",
        cellWidth: "200px",

        // haveFilter: {
        //   filterType: FilterType.Default,
        // },
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
      isSelectionField: true,
      selectionArray: [
        { value: "vacation", label: "Vacation" },
        { value: "sick", label: "Sick" },
        { value: "quiting", label: "Quiting" },
        { value: "other", label: "Other" },
      ],
      isDisabled: Object.keys(editData).length === 0 ? false : true,
    },
    {
      name: "reason",
      label: "Reason",
      isReadOnly: Object.keys(editData).length === 0 ? false : true,
      isTextAreaField: true,
      rows: "5",
      placeholder: "write out your reason...",
    },
    {
      name: "note",
      label: "Note",
      isReadOnly: Object.keys(editData).length === 0 ? false : true,
      isTextAreaField: true,
      rows: "5",
      placeholder: "write out your note...",
    },
    {
      name: "startDate",
      label: "Start Date",
      isReadOnly: Object.keys(editData).length === 0 ? false : true,
      isDateField: true,
    },
    {
      name: "endDate",
      label: "End Date",
      isReadOnly: Object.keys(editData).length === 0 ? false : true,
      isDateField: true,
    },
  ];
  const initialValues = {
    isApproved: `${editData?.isApproved ?? false}`,
    leaveType: editData?.leaveType ?? "",
    startDate: editData?.startDate
      ? new Date(editData?.startDate).toISOString().substring(0, 10)
      : "",
    endDate: editData?.endDate
      ? new Date(editData?.startDate).toISOString().substring(0, 10)
      : "",
    reason: editData?.reason ?? "",
    note: editData?.note ?? "",
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
    <VStack minHeight="100vh" alignItems="flex-start" spacing={3}>
      <Flex gap="10px">
        <Box w="10px" bg="blue.700" borderRadius="5px"></Box>
        <Heading fontSize="3xl">Leave Request Personal</Heading>
      </Flex>
      <Box w="100%" mt="10px">
        <DynamicTable
          onAddEditOpen={onAddEditOpen}
          handleDeleteRange={DeleteRange}
          tableRowAction={tableRowAction}
          columns={columns}
          data={leaveRequestDumbData}
          permission={resultPermission}
          noPaging={true}
        />
        <DynamicDrawer
          handleCreate={handleSubmitApproval}
          isAddEditOpen={isAddEditOpen}
          onAddEditClose={onAddEditClose}
          editData={editData}
          setEditData={setEditData}
          validationSchema={validationSchema}
          initialValues={initialValues}
          drawerFieldData={drawerFieldData}
          titleArray={["View", "Create"]}
          disableSubmit={Object.keys(editData).length === 0 ? false : true}
        />
        <ChakraAlertDialog
          title="Delete Single"
          isOpen={isDeleteSingleOpen}
          onClose={onDeleteSingleClose}
          onAccept={handleAcceptDelete}
        />
      </Box>
    </VStack>
  );
}

export default LeaveRequestPersonal;
