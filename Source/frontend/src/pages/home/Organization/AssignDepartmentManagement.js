import React from "react";
import { useGetPermission } from "../../../hook/useGetPermission";
import { permissionAssignDepartmentManagement } from "../../../screen-permissions/permission";
import {
  Badge,
  Box,
  Flex,
  Heading,
  Stack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  employeeService,
  useGetListEmployee,
} from "../../../services/employee/employee";
import { useState } from "react";
import * as Yup from "yup";
import DynamicTable, {
  FilterType,
} from "../../../components/table/DynamicTable";
import DynamicDrawer from "../../../components/table/DynamicDrawer";
import ChakraAlertDialog from "../../../components/ChakraAlertDialog";
import NoDataToDisplay from "../../../components/NoDataToDisplay";
import { roleCodeColor } from "../../test/dumbTableData";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { FaRegUserCircle } from "react-icons/fa";
import { MdOutlineAlternateEmail } from "react-icons/md";
import {
  departmentService,
} from "../../../services/organization/department";

function AssignDepartmentManagement() {
  // #region declare variable
  const resultPermission = useGetPermission(
    permissionAssignDepartmentManagement,
    "assign-department-management"
  );
  const toast = useToast();
  const queryClient = useQueryClient();
  const [editData, setEditData] = useState({});
  const [deleteSingleData, setDeleteSingleData] = useState({});
  // #endregion
  // #region hooks
  const { 
    data: listEmployeeData,
    isFetching: isFetchingListEmployee,
   } = useGetListEmployee();
  const {
    data: dataListDepartment,
    isLoading: isLoadingListDepartment,
    isFetching: isFetchingListDepartment,
  } = useQuery("listDepartment",departmentService.getListDepartment, {
    refetchOnWindowFocus: false,
    retry: 1,
    enabled: listEmployeeData && Object.keys(listEmployeeData).length > 0,
  });
  let listDepartmentArray = React.useMemo(() => {
    if (dataListDepartment?.result?.data.length > 0) {
      let tempArray = [];
      dataListDepartment?.result?.data.map((item) => {
        tempArray.push({
          label: item.departmentName,
          value: item.departmentId,
        });
      });
      return tempArray;
    }
  });
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
  const useAssignEmployeeToDepartment = useMutation(
    employeeService.assignEmployeeToDepartmentService,
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
          queryClient.invalidateQueries("listEmployee");
          toast({
            title: "Assign Employee To Department Successfully",
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
  const useAssignManagerToDepartment = useMutation(
   employeeService.assignEmployeeToDepartmentService,
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
          queryClient.invalidateQueries("listEmployee");
          toast({
            title: "Assign Manager To Department Successfully",
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
    console.log(deleteSingleData);
    setDeleteSingleData({});
    onDeleteSingleClose();
  };
  const Edit = (row, action) => {
    onAddEditOpen();
    setEditData(row);
  };
  const handleAssignDepartment = (values) => {
    const employeeId = editData?.id;
    const assignObj = {
      employeeId: employeeId,
      departmentId: values?.department,
    };
    if (values.displayName == "Manager") {
      useAssignManagerToDepartment.mutate(assignObj);
    } else {
      useAssignEmployeeToDepartment.mutate(assignObj);
    }
    closeDrawer();
  };
  const closeDrawer = () => {
    onAddEditClose();
    setEditData({});
  };
  const matchingDepartmentName = (departmentId) => {
    if (listDepartmentArray?.length > 0) {
      let result = listDepartmentArray.find(
        (item) => item.value == departmentId
      );
      if (result) {
        return result.label;
      }
      return "";
    }
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
        // haveSort: true,
        cellWidth: "150px",
        hidden: true,
      },
      {
        Header: "Full Name",
        accessor: "fullname",
        // haveFilter: {
        //   filterType: FilterType.Text,
        // },
        // haveSort: true,
        cellWidth: "150px",
      },
      {
        Header: "Email",
        accessor: "email",
        // haveFilter: {
        //   filterType: FilterType.Default,
        // },
        // haveSort: true,
      },
      {
        Header: "Role",
        accessor: "role.displayName",
        Cell: ({ value }) => (
          <Badge
            colorScheme={Object.values(matchingRoleColor(value))[0]}
            fontSize="lg"
            p='5px'
          >
            {value}
          </Badge>
        ),
        // haveFilter: {
        //   filterType: FilterType.Default,
        // },
        // haveSort: true,
        cellWidth: "150px",
      },
      {
        Header: "Department",
        accessor: "department",
        cellWidth: "200px",
        Cell: ({ value }) => <span>{value?.departmentName}</span>,
        // haveFilter: {
        //   filterType: FilterType.Text,
        // },
        // haveSort: true,
      },
    ],
    []
  );
  // #endregion
  // #region drawer
  const drawerFieldData = [
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
      isReadOnly: Object.keys(editData).length === 0 ? false : true,
      leftIcon: <MdOutlineAlternateEmail color="#999" fontSize="1.5rem" />,
    },
    {
      name: "displayName",
      label: "Role",
      isReadOnly: true,
      placeholder: "---",
    },
    {
      name: "department",
      label: "Department",
      placeholder: "---",
      isSelectionField: true,
      selectionArray: listDepartmentArray ? [...listDepartmentArray] : [],
    },
  ];
  const initialValues = {
    fullname: `${editData?.fullname ?? ""}`,
    email: `${editData?.email ?? ""}`,
    displayName: editData?.["role.displayName"] ?? "",
    department: editData?.department?.departmentId ?? "",
  };
  const validationSchema = Yup.object().shape(
    editData?.department?.departmentId != undefined
      ? {
          department: Yup.string().required(
            "You can not set department to null if it already have one before"
          ),
        }
      : {}
  );
  // #endregion
  if (isFetchingListDepartment || isFetchingListEmployee) return <LoadingSpinner />;
  return (
    <Stack h='100%' spacing={4}>
      <Flex gap="10px">
        <Box w="10px" bg="blue.700" borderRadius="5px"></Box>
        <Heading fontSize="3xl">Assigning Department Management</Heading>
      </Flex>
      <Box marginTop="10px">
        {listEmployeeData && listEmployeeData?.result?.data != undefined && listEmployeeData?.result?.data.length == 0 ? (
          <NoDataToDisplay h="450px" />
        ) : (
          <>
            <DynamicTable
              onAddEditOpen={onAddEditOpen}
              handleDeleteRange={DeleteRange}
              tableRowAction={tableRowAction}
              columns={columns}
              data={listEmployeeData?.result?.data}
              permission={resultPermission}
            />
            <DynamicDrawer
              handleEdit={handleAssignDepartment}
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

export default AssignDepartmentManagement;
