import {
  Box,
  Flex,
  Heading,
  Stack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { FaRegUserCircle } from "react-icons/fa";
import DynamicTable from "../../../components/table/DynamicTable";
import NoDataToDisplay from "../../../components/NoDataToDisplay";
import ChakraAlertDialog from "../../../components/ChakraAlertDialog";
import DynamicDrawer from "../../../components/table/DynamicDrawer";
import { FilterType } from "../../../components/table/DynamicTable";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Country, State } from "country-state-city";
import LoadingSpinner from "../../../components/LoadingSpinner";
import {
  departmentService,
  useGetListDepartment,
} from "../../../services/organization/department";
import { useGetPermission } from "../../../hook/useGetPermission";
import { permissionDepartmentManagement } from "../../../screen-permissions/permission";
import { organizationService } from "../../../services/organization/organization";
import { Helper } from "../../../Utils/Helper";
function DepartmentManagement() {
  // #region declare variables
  const resultPermission = useGetPermission(
    permissionDepartmentManagement,
    "department-management"
  );
  const toast = useToast();
  const queryClient = useQueryClient();
  const [editData, setEditData] = useState({});
  const [deleteSingleData, setDeleteSingleData] = useState({});
  // #endregion
  // #region hooks
  const {
    data: dataListDepartment,
    isFetching: isFetchingListDepartment,
    isLoading: isLoadingListDepartment,
  } = useGetListDepartment();
  const {
    data: dataListOrganization,
    isLoading: isLoadingListOrganization,
    isFetching: isFetchingListOrganization,
  } = useQuery("listOrganization", organizationService.getListOrganization, {
    refetchOnWindowFocus: false,
    retry: 1,
  });
  const [listOrganizationArray, setListOrganizationArray] = useState([]);
  useEffect(() => {
    setListOrganizationArray(
      Helper.convertToArraySelection(
        dataListOrganization?.result,
        "organizationName",
        "organizationId"
      )
    );
  }, [dataListOrganization]);
  const useCreateDepartment = useMutation(
    departmentService.createDepartmentService,
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
          queryClient.invalidateQueries("listDepartment");
          toast({
            title: "Create Department Successfully",
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
  const useDeleteDepartment = useMutation(departmentService.deleteDepartment, {
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
        queryClient.invalidateQueries("listDepartment");
        toast({
          title: "Delete Department Successfully",
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
  });
  const useSaveDepartment = useMutation(
    departmentService.saveDepartmentService,
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
          queryClient.invalidateQueries("listDepartment");
          toast({
            title: "Save Department Successfully",
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
    setDeleteSingleData(row.departmentId);
    onDeleteSingleOpen();
  };
  const handleAcceptDelete = () => {
    // console.log(deleteSingleData);
    useDeleteDepartment.mutate(deleteSingleData);
    setDeleteSingleData({});
    onDeleteSingleClose();
  };
  const Edit = (row, action) => {
    onAddEditOpen();
    setEditData(row);
  };
  const convertDepartmentObject = (values) => {
    let departmentLocation = values["location"];
    let organizationId = values["organization"];
    departmentLocation["address"] = values["address"];
    delete values["address"];
    delete values["location"];
    const departmentObj = {
      ...values,
      ["location"]: { ...departmentLocation },
      ["organization"]: { organizationId },
    };
    return departmentObj;
  };
  const handleCreateDepartment = (values) => {
    const departmentObj = convertDepartmentObject(values);
    useCreateDepartment.mutate(departmentObj);
    closeDrawer();
  };
  const handleEditDepartment = (values) => {
    const id = editData.departmentId;
    const departmentObj = convertDepartmentObject(values);
    useSaveDepartment.mutate({ id, departmentObj });
    closeDrawer();
  };
  const closeDrawer = () => {
    onAddEditClose();
    setEditData({});
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
        accessor: "departmentId",
        // haveFilter: {
        //   filterType: FilterType.Text,
        // },
        // haveSort: true,
        cellWidth: "150px",
        hidden: true,
      },
      {
        Header: "Dep.Name",
        accessor: "departmentName",
        // haveFilter: {
        //   filterType: FilterType.Text,
        // },
        // haveSort: true,

        cellWidth: "200px",
      },
      {
        Header: "Org.Name",
        accessor: "organization",
        // haveFilter: {
        //   filterType: FilterType.Default,
        // },
        // haveSort: true,
        Cell: ({ value }) => <span>{value?.organizationName}</span>,
        cellWidth: "200px",
      },
      {
        Header: "City",
        accessor: "location.city",
        cellWidth: "200px",
        // haveFilter: {
        //   filterType: FilterType.Text,
        // },
        // haveSort: true,
      },
      {
        Header: "State",
        accessor: "location.state",
        Cell: ({ row, value }) => {
          return (
            <span>
              {
                State?.getStateByCodeAndCountry(
                  row.values["location.state"],
                  row.values["location.country"]
                )?.name
              }
            </span>
          );
        },
        cellWidth: "150px",
        // haveFilter: {
        //   filterType: FilterType.Text,
        // },
        // haveSort: true,
      },
      {
        Header: "Country",
        accessor: "location.country",
        Cell: ({ row, value }) => {
          return (
            <span>
              {Country?.getCountryByCode(row.values["location.country"])?.name}
            </span>
          );
        },
        cellWidth: "200px",
        // haveFilter: {
        //   filterType: FilterType.Text,
        // },
        // haveSort: true,
      },
      {
        Header: "Address",
        accessor: "location.address",
        cellWidth: "200px",
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
      name: "departmentName",
      label: "Department Name",
      placeholder: "Enter your Department Name",
      leftIcon: <FaRegUserCircle color="#999" fontSize="1.5rem" />,
    },
    {
      name: "organization",
      label: "Organization",
      placeholder: "---",
      isSelectionField: true,
      selectionArray: listOrganizationArray ? [...listOrganizationArray] : [],
    },
    {
      name: "location",
      isAddress: true,
    },
    {
      isTextAreaField: true,
      name: "address",
      label: "Address",
      height: "130px",
      placeholder: "Enter your address",
    },
  ];
  const initialValues = {
    departmentName: `${editData.departmentName ? editData.departmentName : ""}`,
    organization: `${
      editData?.organization?.organizationId
        ? editData?.organization?.organizationId
        : ""
    }`,
    location: {
      country: `${editData["location.country"] ?? ""}`,
      state: `${editData["location.state"] ?? ""}`,
      city: `${editData["location.city"] ?? ""}`,
    },
    address: `${
      editData["location.address"] ? editData["location.address"] : ""
    }`,
  };
  const validationSchema = Yup.object().shape({
    departmentName: Yup.string().required("This field is required"),
    organization: Yup.string().required("This field is required"),
    address: Yup.string().required("This field is required"),
  });
  // #endregion
  if (isLoadingListDepartment || isLoadingListOrganization)
    return <LoadingSpinner />;
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
        <Heading fontSize="3xl">Department Management</Heading>
      </Flex>
      {useCreateDepartment.isLoading || useSaveDepartment.isLoading ? (
        <LoadingSpinner />
      ) : (
        <Box marginTop="10px">
          <DynamicTable
            onAddEditOpen={onAddEditOpen}
            handleDeleteRange={DeleteRange}
            tableRowAction={tableRowAction}
            columns={columns}
            data={dataListDepartment?.result?.data}
            permission={resultPermission}
          />
          <DynamicDrawer
            handleEdit={handleEditDepartment}
            handleCreate={handleCreateDepartment}
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

export default DepartmentManagement;
