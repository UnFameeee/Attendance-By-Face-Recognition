import React, { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import * as Yup from "yup";
import DynamicTable, {
  FilterType,
} from "../../../components/table/DynamicTable";
import DynamicDrawer from "../../../components/table/DynamicDrawer";
import ChakraAlertDialog from "../../../components/ChakraAlertDialog";
import LoadingSpinner from "../../../components/LoadingSpinner";
import {
  Badge,
  Box,
  Flex,
  Heading,
  Stack,
  useDisclosure,
  useToast,
  Highlight,
  Button,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Tooltip,
} from "@chakra-ui/react";
import { useGetPermission } from "../../../hook/useGetPermission";
import { permissionLeaveRequestManagement } from "../../../screen-permissions/permission";
import { FaRegUserCircle } from "react-icons/fa";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { roleCodeColor } from "../../test/dumbTableData";
import { useGetListDepartment } from "../../../services/organization/department";
import { Formik } from "formik";
import FormTextField from "../../../components/field/FormTextField";
import { Helper } from "../../../Utils/Helper";
import { leaveRequestService } from "../../../services/leaveRequest/leaveRequest";
import { selectionData } from "../../../data/SelectionData";
import { approvalCodeColor } from "../../../data/ColorData";
import ModifyLeaveTypeModal from "../../../components/ModifyLeaveTypeModal";
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
  const [userInfo, setUserInfo] = useState(Helper.getUseDecodeInfor());
  const [currentDate, setCurrentDate] = useState(new Date());
  const [departmentId, setDepartmentId] = useState(
    Helper.getUseDecodeInfor().departmentId ?? ""
  );
  const [listLRDepartment, setListLRDepartment] = useState([]);

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
  const useGetLeaveRequestOfDepartment = useMutation(
    leaveRequestService.getLeaveRequestOfDepartment,
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
          setListLRDepartment((prevList) => {
            let resultData = [...data?.result?.data];
            // const mergedResult = unionBy(resultData, prevList, "shiftId");
            queryClient.setQueryData("listLRDepartment", resultData);
            return resultData;
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
  const { data: listDepartmentData, isLoading: isLoadingListDepartment } =
    useGetListDepartment();
  const [listDepartmentArray, setListDepartmentArray] = useState([]);
  useEffect(() => {
    setListDepartmentArray(
      Helper.convertToArraySelection(
        listDepartmentData?.result?.data,
        "departmentName",
        "departmentId"
      )
    );
  }, [listDepartmentData]);
  const useDeleteLeaveRequest = useMutation(
    leaveRequestService.deleteLeaveRequest,
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
          useGetLeaveRequestOfDepartment.mutate({
            departmentId,
            currentDate,
          });
          toast({
            title: `Delete Leave Request Successfully`,
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
  const useVerifyLeaveRequest = useMutation(
    leaveRequestService.verifyLeaveRequest,
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
          useGetLeaveRequestOfDepartment.mutate({
            departmentId,
            currentDate,
          });
          toast({
            title: "Verify Leave Request Successfully",
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
  // #region functions
  const DeleteRange = (data) => {
    console.log("handleDeleteRange", data);
  };
  const Delete = (row, action) => {
    setDeleteSingleData(row);
    onDeleteSingleOpen();
  };
  const handleAcceptDelete = () => {
    // console.log(deleteSingleData);
    useDeleteLeaveRequest.mutate(deleteSingleData.leaveRequestId);
    setDeleteSingleData({});
    onDeleteSingleClose();
  };
  const Edit = (row, action) => {
    onAddEditOpen();
    setEditData(row);
  };
  const handleApprovalLeaveRequest = (values) => {
    let leaveRequestId = editData.leaveRequestId;
    let status = values.status;
    let leaveRequestObj = {
      leaveRequestId,
      status,
    };
    closeDrawer();
    if (status != "WAITING") useVerifyLeaveRequest.mutate(leaveRequestObj);
  };
  const closeDrawer = () => {
    onAddEditClose();
    setEditData({});
  };
  const refreshListLRDepartment = () => {
    if (departmentId) {
      if (userInfo.roleName == "employee") {
        useGetLeaveRequestOfDepartment.mutate({
          departmentId,
          currentDate,
        });
      } else {
        useGetLeaveRequestOfDepartment.mutate({
          departmentId,
          currentDate,
        });
      }
    }
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
        accessor: "leaveRequestId",
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
        Header: "Full Name",
        accessor: "employee.fullname",
        // haveFilter: {
        //   filterType: FilterType.Text,
        // },

        cellWidth: "150px",
      },
      {
        Header: "Email",
        accessor: "employee.email",
        // haveFilter: {
        //   filterType: FilterType.Default,
        // },
      },

      {
        Header: "Department",
        accessor: "employee.department.departmentName",
        cellWidth: "150px",
        Cell: ({ value }) => <span>{value}</span>,
        // haveFilter: {
        //   filterType: FilterType.Text,
        // },
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
        // haveFilter: {
        //   filterType: FilterType.Default,
        // },
        cellWidth: "150px",
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
        // haveFilter: {
        //   filterType: FilterType.Default,
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
      name: "status",
      label: "Status",
      isSelectionField: true,
      selectionArray: selectionData.verifyData,
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
      name: "requestDate",
      label: "Request Date",
      isReadOnly: true,
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
    status: editData?.status ?? "",
    fullname: editData["employee.fullname"] ?? "",

    email: editData?.email ?? "",
    role: editData?.role ?? "",
    department: editData?.department ?? "",

    leaveType: editData["leaveType.name"] ?? "",
    requestDate: editData?.requestDate
      ? Helper.getMomentDateFormat(editData?.requestDate)
      : "",
    startDate: editData?.startDate
      ? Helper.getMomentDateFormat(editData?.startDate)
      : "",
    endDate: editData?.endDate
      ? Helper.getMomentDateFormat(editData?.endDate)
      : "",
    reason: editData?.reason ?? "",
    note: editData?.note ?? "",
  };
  const validationSchema = Yup.object().shape();
  // #endregion
  // #region form and Modal
  const initialValuesSelectDepartment = {
    department: departmentId,
  };
  // #endregion
  // #region useEffect
  useEffect(() => {
    refreshListLRDepartment();
  }, []);

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
    if (value != "" && Helper.isInSameMonth(value)) {
      // setIsFilterByDate(value);
      let filter = value;
      useGetLeaveRequestOfDepartment.mutate({
        departmentId,
        currentDate,
        filter,
      });
    } else if (value == "" && Helper.isInSameMonth(value)) {
      useGetLeaveRequestOfDepartment.mutate({
        departmentId,
        currentDate,
      });
    }
  };
  if (isLoadingListDepartment) return <LoadingSpinner />;
  return (
    <Stack h="100%" spacing={4}>
      <Flex
        gap="10px"
        bg="white"
        rounded="md"
        p={2}
        w="fit-content"
        shadow="2xl"
      >
        <Box w="10px" bg="blue.700" borderRadius="5px"></Box>
        <Heading fontSize="3xl">Leave Request Management</Heading>
      </Flex>
      <HStack
        bg="white"
        rounded="md"
        p="3"
        shadow="2xl"
        gap="10px"
        alignItems={{ base: "baseline", md: "center" }}
        flexDirection={{ base: "column", md: "row" }}
        w="fit-content"
      >
        {userInfo?.roleName == "admin" && <ModifyLeaveTypeModal />}
        <HStack alignItems={{ base: "baseline", sm: "center" }}>
          <Heading fontSize="xl" fontWeight="medium">
            <Highlight
              query={["Department:"]}
              styles={{ px: "2", py: "1", rounded: "full", bg: "purple.100" }}
            >
              Department:
            </Highlight>
          </Heading>
          <Formik
            initialValues={initialValuesSelectDepartment}
            onSubmit={(values, actions) => {
              const departmentId = values.department;
              setDepartmentId(departmentId);
              if (departmentId) {
                useGetLeaveRequestOfDepartment.mutate({
                  departmentId,
                  currentDate,
                });
              } else {
                setListLRDepartment([]);
              }
            }}
          >
            {(formik) => (
              <HStack
                as="form"
                onSubmit={formik.handleSubmit}
                flexDirection={{ sm: "row", base: "column" }}
                gap="10px"
                alignItems={{ base: "baseline", sm: "end" }}
              >
                <FormTextField
                  name="department"
                  placeholder="---"
                  isReadOnly={userInfo?.roleName == "manager"}
                  isSelectionField={true}
                  selectionArray={
                    listDepartmentArray ? [...listDepartmentArray] : []
                  }
                />
                {userInfo?.roleName != "manager" && (
                  <div className=" mt-[6px]">
                    <Button colorScheme="blue" type="submit" size="md">
                      Submit
                    </Button>
                  </div>
                )}
              </HStack>
            )}
          </Formik>
        </HStack>

        {departmentId != "" && (
          <Tooltip hasArrow label="Filter for start date of the leave request">
            <HStack
              w="fit-content"
              bg="white"
              rounded="md"
              justifyContent="flex-end"
            >
              <Heading fontSize="xl" fontWeight="medium">
                <Highlight
                  query={["Date Filter:"]}
                  styles={{
                    px: "2",
                    py: "1",
                    rounded: "full",
                    bg: "purple.100",
                  }}
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
        )}
      </HStack>
      {useGetLeaveRequestOfDepartment.isLoading ||
      useDeleteLeaveRequest.isLoading ? (
        <LoadingSpinner />
      ) : (
        <Box marginTop="10px">
          <DynamicTable
            onAddEditOpen={onAddEditOpen}
            handleDeleteRange={DeleteRange}
            tableRowAction={tableRowAction}
            columns={columns}
            data={listLRDepartment}
            permission={resultPermission}
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
        </Box>
      )}
    </Stack>
  );
}

export default LeaveRequestManagement;
