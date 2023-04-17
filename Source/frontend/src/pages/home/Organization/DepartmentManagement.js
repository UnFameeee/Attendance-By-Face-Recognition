import {
  Avatar,
  Badge,
  Box,
  Flex,
  Heading,
  HStack,
  Icon,
  Stack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useMemo, useState } from "react";
import * as Yup from "yup";
import { FaRegUserCircle, FaGrinStars, FaHouseUser } from "react-icons/fa";
import DynamicTable from "../../../components/table/DynamicTable";
import NoDataToDisplay from "../../../components/NoDataToDisplay";
import ChakraAlertDialog from "../../../components/ChakraAlertDialog";
import DynamicDrawer from "../../../components/table/DynamicDrawer";
import { FilterType } from "../../../components/table/DynamicTable";
import { useMutation, useQueryClient } from "react-query";
import { Country, State, City } from "country-state-city";
import LoadingSpinner from "../../../components/LoadingSpinner";
import {
  createDepartmentService,
  saveDepartmentService,
  useGetListDepartment,
} from "../../../services/organization/department";
import { useGetPermission } from "../../../hook/useGetPermission";
import { permissionDepartmentGeneral } from "../../../screen-permissions/permission";
import { useGetListOrganization } from "../../../services/organization/organization";
function DepartmentManagement() {
  const resultPermission = useGetPermission(
    permissionDepartmentGeneral,
    "department-management"
  );
  const toast = useToast();
  const queryClient = useQueryClient();
  const [editData, setEditData] = useState({});
  const [deleteSingleData, setDeleteSingleData] = useState({});
  const {
    data: dataListDepartment,
    isLoading: isLoadingListDepartment,
    isError,
    error,
  } = useGetListDepartment();
  const { data: dataListOrganization, isLoading: isLoadingListOrganization } =
    useGetListOrganization();
  let listOrganizationArray = React.useMemo(() => {
    if (dataListOrganization?.result?.length > 0) {
      let tempArray = [];
      dataListOrganization?.result?.map((item) => {
        tempArray.push({
          label: item.organizationName,
          value: item.organizationId,
        });
      });
      return tempArray;
    }
  });
  const useCreateDepartment = useMutation(createDepartmentService, {
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
          title: "Create Department successfully",
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
  const useSaveDepartment = useMutation(saveDepartmentService, {
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
          title: "Save Department successfully",
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
  const matchingOrganizationName = (organizationId) => {
    if (listOrganizationArray?.length > 0) {
      let result = listOrganizationArray.find(
        (item) => item.value == organizationId
      );
      if (result) {
        return result.label;
      }
      return "";
    }
  };
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
        haveFilter: {
          filterType: FilterType.Text,
        },
        haveSort: true,
        cellWidth: "150px",
        hidden: true,
      },
      {
        Header: "Dep.Name",
        accessor: "departmentName",
        haveFilter: {
          filterType: FilterType.Text,
        },
        haveSort: true,

        cellWidth: "200px",
      },
      {
        Header: "Org.Name",
        accessor: "organization.organizationId",
        haveFilter: {
          filterType: FilterType.Default,
        },
        Cell: ({ value }) => <span>{matchingOrganizationName(value)}</span>,
        cellWidth: "200px",
        haveSort: true,
      },
      {
        Header: "City",
        accessor: "location.city",
        cellWidth: "200px",
        haveFilter: {
          filterType: FilterType.Text,
        },
        haveSort: true,
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
        haveFilter: {
          filterType: FilterType.Text,
        },
        haveSort: true,
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
        haveFilter: {
          filterType: FilterType.Text,
        },
        haveSort: true,
      },
      {
        Header: "Address",
        accessor: "location.address",
        cellWidth: "200px",
        haveFilter: {
          filterType: FilterType.Text,
        },
        haveSort: true,
      },
    ],
    []
  );
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
      editData["organization.organizationId"]
        ? editData["organization.organizationId"]
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
  if (isLoadingListDepartment) return <LoadingSpinner />;
  return (
    <Stack minHeight="100vh" spacing={4}>
      <Flex gap="10px">
        <Box w="10px" bg="blue.700" borderRadius="5px"></Box>
        <Heading fontSize="3xl">Department Management</Heading>
      </Flex>
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
      {dataListDepartment?.result?.data.length == 0 && (
        <NoDataToDisplay h="450px" />
      )}
    </Stack>
  );
}

export default DepartmentManagement;
