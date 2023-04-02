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
import { IoImageOutline } from "react-icons/io5";
import { FaRegUserCircle, FaGrinStars, FaHouseUser } from "react-icons/fa";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { RiFolderUserLine } from "react-icons/ri";
import { BsTelephone } from "react-icons/bs";
import { HiBuildingOffice2 } from "react-icons/hi2";
import PieChart from "../../../components/chart/PieChart";
import ColumnChart from "../../../components/chart/ColumnChart";
import DynamicTable from "../../../components/table/DynamicTable";
import { dumbTableData, roleCodeColor } from "../../test/dumbTableData";
import NoDataToDisplay from "../../../components/NoDataToDisplay";
import ChakraAlertDialog from "../../../components/ChakraAlertDialog";
import DynamicDrawer from "../../../components/table/DynamicDrawer";
import { FilterType } from "../../../components/table/DynamicTable";
import { useQueryClient } from "react-query";
import { useGetListEmployee } from "../../../services/employee/employee";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { useGetListDepartment } from "../../../services/organization/department";
function Department() {
  const [editData, setEditData] = useState({});
  const [deleteSingleData, setDeleteSingleData] = useState({});
  const { data, isLoading, isError, error } = useGetListDepartment();

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
  const tableRowAction = [
    {
      actionName: "Edit",
      func: Edit,
    },
    {
      actionName: "Delete",
      func: Delete,
    },
  ];
  const columns = React.useMemo(
    () => [
      {
        Header: "Department Name",
        accessor: "departmentName",
        haveFilter: {
          filterType: FilterType.Text,
        },
        haveSort: true,
        cellWidth: "150px",
      },
      {
        Header: "Organization Name",
        accessor: "organization.organizationName",
        haveFilter: {
          filterType: FilterType.Default,
        },
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
        cellWidth: "200px",
        haveFilter: {
          filterType: FilterType.Text,
        },
        haveSort: true,
      },
      {
        Header: "Country",
        accessor: "location.country",
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
      name: "organization.organizationName",
      label: "Organization Name",
      placeholder: "Enter your Organization Name",
      leftIcon: <MdOutlineAlternateEmail color="#999" fontSize="1.5rem" />,
    },
    {
      name: "city",
      label: "City",
      height: "150px",
      placeholder: "Enter your city",
    },
    {
      name: "state",
      label: "State",
      height: "150px",
      placeholder: "Enter your state",
    },
    {
      name: "country",
      label: "Country",
      height: "150px",
      placeholder: "Enter your country",
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
    organizationName: `${
      editData["organization.organizationName"]
        ? editData["organization.organizationName"]
        : ""
    }`,
    city: `${editData["location.city"] ? editData["location.city"] : ""}`,
    state: `${editData["location.state"] ? editData["location.state"] : ""}`,
    country: `${
      editData["location.country"] ? editData["location.country"] : ""
    }`,
    address: `${
      editData["location.address"] ? editData["location.address"] : ""
    }`,
  };
  const validationSchema = Yup.object().shape({
    departmentName: Yup.string().required("This field is required"),
    organizationName: Yup.string().required("This field is required"),
    city: Yup.string().required("This field is required"),
    state: Yup.string().required("This field is required"),
    country: Yup.string().required("This field is required"),
    address: Yup.string().required("This field is required"),
  });
  if (isLoading) return <LoadingSpinner />;
  return (
    <Stack minHeight="100vh" spacing={4}>
      <Flex gap="10px">
        <Box w="10px" bg="blue.700" borderRadius="5px"></Box>
        <Heading fontSize="3xl" fontWeight="semibold">
          Department Management
        </Heading>
      </Flex>
      {data?.result?.data.length > 0 ? (
        <Box marginTop="10px">
          <DynamicTable
            onAddEditOpen={onAddEditOpen}
            handleDeleteRange={DeleteRange}
            tableRowAction={tableRowAction}
            columns={columns}
            data={data?.result?.data}
          />
          <DynamicDrawer
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
      ) : (
        <NoDataToDisplay h="450px" />
      )}
    </Stack>
  );
}

export default Department;
