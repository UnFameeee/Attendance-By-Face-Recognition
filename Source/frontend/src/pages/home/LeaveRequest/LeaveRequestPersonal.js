import React, { useEffect, useState } from "react";
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
  Highlight,
  Input,
} from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import * as Yup from "yup";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { Helper } from "../../../Utils/Helper";
import { useGetPermission } from "../../../hook/useGetPermission";
import { permissionLeaveRequestPersonal } from "../../../screen-permissions/permission";
import ChakraAlertDialog from "../../../components/ChakraAlertDialog";
import DynamicDrawer from "../../../components/table/DynamicDrawer";
import DynamicTable, {
  FilterType,
} from "../../../components/table/DynamicTable";
import { leaveRequestService } from "../../../services/leaveRequest/leaveRequest";
import {
  selectionData,
  selectionVerifyData,
} from "../../../data/SelectionData";
import { approvalCodeColor } from "../../../data/ColorData";
import { Formik } from "formik";
import FormTextField from "../../../components/field/FormTextField";
function LeaveRequestPersonal() {
  // #region declare variable
  const resultPermission = useGetPermission(
    permissionLeaveRequestPersonal,
    "leave-request-personal"
  );
  const toast = useToast();
  const queryClient = useQueryClient();
  const [editData, setEditData] = useState({});
  const [deleteSingleData, setDeleteSingleData] = useState({});
  const [userInfo, setUserInfo] = useState(Helper.getUseDecodeInfor());
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isFilterByDate, setIsFilterByDate] = useState();

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
  const {
    data: LREmployeeData,
    isLoading: isLoadingLREmployeeData,
    refetch: refetchLREmployeeData,
  } = leaveRequestService.useGetLeaveRequestOfAnEmployee({
    currentDate,
    userInfo,
    filter: isFilterByDate,
  });
  const { data: LRAnnualDetailData, isLoading: isLoadingLRAnnualDetailData } =
    leaveRequestService.useGetAnnualDetail();
  const { data: LRLeaveTypeData, isLoading: isLoadingLRLeaveTypeData } =
    leaveRequestService.useGetAllLeaveType();
  const useCreateLeaveRequest = useMutation(
    leaveRequestService.createLeaveRequest,
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
          queryClient.invalidateQueries("listLeaveRequestOfAnEmployee");
          toast({
            title: "Create Leave Request Successfully",
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
  const [listLRLeaveType, setListLRLeaveType] = useState([]);
  useEffect(() => {
    setListLRLeaveType(
      Helper.convertToArraySelection(
        LRLeaveTypeData?.result?.data,
        "name",
        "leaveTypeId"
      )
    );
  }, [LRLeaveTypeData]);
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
  const handleSubmitLeaveRequest = (values) => {
    const leaveRequestObj = {
      leaveTypeId: values.leaveType,
      startDate: new Date(values?.startDate).toISOString(),
      endDate: new Date(values?.endDate).toISOString(),
      reason: values.reason,
      note: values.note,
    };
    console.log("leaveRequestObj.startDate", leaveRequestObj.startDate);
    useCreateLeaveRequest.mutate(leaveRequestObj);
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
        accessor: "leaveRequestId",
        // haveFilter: {
        //   filterType: FilterType.Text,
        // },
        cellWidth: "150px",
        hidden: true,
      },
      {
        Header: "LeaveTypeId",
        accessor: "leaveTypeId",
        // haveFilter: {
        //   filterType: FilterType.Text,
        // },
        cellWidth: "150px",
        hidden: true,
      },
      {
        Header: "Status",
        accessor: "status",
        // haveFilter: {
        //   filterType: FilterType.Default,
        // },
        Cell: ({ value }) => (
          <Badge
            p="5px"
            fontSize="lg"
            colorScheme={
              Object.values(
                Helper.matchingCodeColor(value, approvalCodeColor)
              )[0]
            }
          >
            {value}
          </Badge>
        ),
        cellWidth: "150px",
      },
      {
        Header: "Leave type",
        accessor: "leaveType.name",
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
        Header: "Request date",
        accessor: "requestDate",
        // haveFilter: {
        //   filterType: FilterType.DateTime,
        // },
        cellWidth: "100px",
        type: "date",
      },
      {
        Header: "Start date",
        accessor: "startDate",
        // haveFilter: {
        //   filterType: FilterType.DateTime,
        // },
        cellWidth: "100px",
        type: "date",
      },
      {
        Header: "End date",
        accessor: "endDate",
        // haveFilter: {
        //   filterType: FilterType.DateTime,
        // },
        cellWidth: "100px",
        type: "date",
      },
      {
        Header: "Note",
        accessor: "note",
        cellWidth: "200px",

        // haveFilter: {
        //   filterType: FilterType.Default,
        // },
      },
    ],
    []
  );
  // #endregion
  // #region drawer
  const drawerFieldData = [
    {
      name: "status",
      label: "Status",
      isReadOnly: true,
      isSelectionField: true,
      selectionArray: selectionData.verifyData,
    },
    {
      name: "leaveType",
      label: "Leave Type",
      placeholder: "---",
      isSelectionField: true,
      selectionArray: listLRLeaveType ?? [],
      isReadOnly: Object.keys(editData).length === 0 ? false : true,
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
    status: editData?.status ?? "",
    leaveType: editData?.leaveTypeId ?? "",
    startDate: editData?.startDate
      ? Helper.getMomentDateFormat(editData?.startDate)
      : "",
    endDate: editData?.endDate
      ? Helper.getMomentDateFormat(editData?.endDate)
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
  const initialValuesForDateFilterSelection = {
    dateFilter: "",
  };
  const validationSchemaForDateFilterSelection = Yup.object().shape({
    dateFilter: Yup.date().test(
      "is-same-month",
      "The date must be in the same month",
      function (value) {
        if (value) {
          const currentMonth = new Date().getMonth();
          const selectedMonth = new Date(value).getMonth();
          return currentMonth === selectedMonth;
        }
        return true;
      }
    ),
  });
  const handleOnChangeDateFilter = (value) => {
    if (value != "") {
      setIsFilterByDate(value);
    } else {
      setIsFilterByDate();
    }
  };
  useEffect(() => {
    let filter = isFilterByDate;
    if (Helper.isInSameMonth(filter)) {
      refetchLREmployeeData({
        currentDate,
        userInfo,
        filter,
      });
    }
  }, [isFilterByDate]);
  if (
    isLoadingLREmployeeData ||
    isLoadingLRLeaveTypeData ||
    isLoadingLRAnnualDetailData
  )
    return <LoadingSpinner />;
  return (
    <VStack h="100%" alignItems="flex-start" spacing={3}>
      <Flex gap="10px">
        <Box w="10px" bg="blue.700" borderRadius="5px"></Box>
        <Heading fontSize="3xl">Leave Request Personal</Heading>
      </Flex>
      <HStack bg="white" rounded="md" p={3} spacing="10px">
        <Flex alignItems="center" gap="5px">
          <Highlight
            query="Total Annual Leave:"
            styles={{
              p: "2",
              rounded: "5px",
              bg: "orange.100",
              fontWeight: "medium",
            }}
          >
            Total Annual Leave:
          </Highlight>
          <Input
            readOnly
            w="50px"
            size="md"
            type="number"
            value={LRAnnualDetailData?.result?.totalAnnualLeave ?? 0}
          />
        </Flex>
        <Flex alignItems="center" gap="5px">
          <Highlight
            query="Annual Leave Used:"
            styles={{
              p: "2",
              rounded: "5px",
              bg: "orange.100",
              fontWeight: "medium",
            }}
          >
            Annual Leave Used:
          </Highlight>
          <Input
            readOnly
            w="50px"
            size="md"
            type="number"
            value={LRAnnualDetailData?.result?.annualLeaveUsed ?? 0}
          />
        </Flex>
        <Flex alignItems="center" gap="5px">
          <Highlight
            query="Annual Leave Remaining:"
            styles={{
              p: "2",
              rounded: "5px",
              bg: "orange.100",
              fontWeight: "medium",
            }}
          >
            Annual Leave Remaining:
          </Highlight>
          <Input
            readOnly
            w="50px"
            size="md"
            type="number"
            value={LRAnnualDetailData?.result?.annualLeaveRemaining ?? 0}
          />
        </Flex>
      </HStack>
      <Tooltip
        placement="right"
        hasArrow
        label="Filter for start date of the leave request"
      >
        <HStack bg="white" rounded="md" p="10px" justifyContent="flex-end">
          <Heading fontSize="xl" fontWeight="medium">
            <Highlight
              query={["Date Filter:"]}
              styles={{ px: "2", py: "1", rounded: "full", bg: "purple.100" }}
            >
              Date Filter:
            </Highlight>
          </Heading>

          <Formik
            initialValues={initialValuesForDateFilterSelection}
            validationSchema={validationSchemaForDateFilterSelection}
          >
            {(formik) => (
              <Box w="150px">
                <FormTextField
                  name="dateFilter"
                  isDateField={true}
                  handleOnChange={handleOnChangeDateFilter}
                />
              </Box>
            )}
          </Formik>
        </HStack>
      </Tooltip>
      <Box w="100%" mt="10px">
        <DynamicTable
          onAddEditOpen={onAddEditOpen}
          handleDeleteRange={DeleteRange}
          tableRowAction={tableRowAction}
          columns={columns}
          data={LREmployeeData?.result?.data}
          permission={resultPermission}
          noPaging={true}
        />
        <DynamicDrawer
          handleCreate={handleSubmitLeaveRequest}
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
