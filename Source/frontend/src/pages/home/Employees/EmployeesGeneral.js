import {
  Avatar,
  Badge,
  Box,
  Flex,
  Heading,
  HStack,
  Stack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import { IoImageOutline } from "react-icons/io5";
import { FaRegUserCircle, FaGrinStars } from "react-icons/fa";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { RiFolderUserLine } from "react-icons/ri";
import { BsTelephone } from "react-icons/bs";
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
function EmployeesGeneral() {
  const screenPadding = "2rem";
  const toast = useToast();
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useGetListEmployee();
  const [editData, setEditData] = useState({});
  const [deleteSingleData, setDeleteSingleData] = useState({});
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
    console.log("rowdd", row);

    console.log("row", row["location.city"]);
    onAddEditOpen();
    setEditData(row);
  };
  const matchingItem = (value) => {
    return roleCodeColor.find(
      (item) => Object.keys(item)[0].toLowerCase() === value.toLowerCase()
    );
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
  const tableData = React.useMemo(() => dumbTableData);
  const columns = React.useMemo(
    () => [
      {
        Header: "Full Name",
        accessor: "fullname",
        haveFilter: {
          filterType: FilterType.Text,
        },
        haveSort: true,
        cellWidth: "150px",
      },
      {
        Header: "Email",
        accessor: "email",
        haveFilter: {
          filterType: FilterType.Default,
        },
        haveSort: true,
      },
      {
        Header: "Gender",
        accessor: "gender",
        haveFilter: {
          filterType: FilterType.Default,
        },
        haveSort: true,
        cellWidth: "150px",
        textAlign: "center",
      },
      // {
      //   Header: "Role",
      //   accessor: "role",
      //   Cell: ({ value }) => (
      //     <Badge
      //       colorScheme={Object.values(matchingItem(value))[0]}
      //       fontSize="lg"
      //     >
      //       {value}
      //     </Badge>
      //   ),
      //   haveFilter: {
      //     filterType: FilterType.Default,
      //   },
      //   haveSort: true,
      // },
      {
        Header: "Phone",
        accessor: "phoneNumber",
        haveFilter: {
          filterType: FilterType.Number,
        },
        haveSort: true,
        cellWidth: "150px",
      },
      {
        Header: "Department",
        accessor: "department",
        cellWidth: "200px",
        haveFilter: {
          filterType: FilterType.Text,
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
  const roleArray = [
    {
      label: "Project Manager",
      value: "Project Manager",
    },
    { label: "Estimator", value: "Estimator" },
    { label: "Electrician", value: "Electrician" },
    {
      label: "Construction Worker",
      value: "Construction Worker",
    },
    {
      label: "Construction Manager",
      value: "Construction Manager",
    },
    { label: "Engineer", value: "Engineer" },
  ];
  const drawerFieldData = [
    {
      name: "fullname",
      label: "Full Name",
      placeholder: "Enter your Full Name",
      leftIcon: <FaRegUserCircle color="#999" fontSize="1.5rem" />,
    },
    // {
    //   name: "picture",
    //   label: "Picture",
    //   placeholder: "imageUrl.com",
    //   leftIcon: <IoImageOutline color="#999" fontSize="1.5rem" />,
    // },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "abc@gmail.com",
      leftIcon: <MdOutlineAlternateEmail color="#999" fontSize="1.5rem" />,
    },
    {
      name: "phoneNumber",
      label: "Phone",
      type: "text",
      placeholder: "Enter your number",
      leftIcon: <BsTelephone color="#999" fontSize="1.4rem" />,
    },
    // {
    //   isSelectionField: true,
    //   selectionArray: roleArray,
    //   name: "role",
    //   label: "Role",
    //   type: "text",
    //   placeholder: "Chose your role",
    //   leftIcon: <RiFolderUserLine color="#999" fontSize="1.5rem" />,
    // },
    {
      name: "department",
      label: "Department",
      height: "150px",
      placeholder: "Enter your department",
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
      height: "150px",
      placeholder: "Enter your address",
    },
  ];
  const initialValues = {
    fullname: `${editData.fullname ? editData.fullname : ""}`,
    email: `${editData.email ? editData.email : ""}`,
    phoneNumber: `${editData.phoneNumber ? editData.phoneNumber : ""}`,
    department: `${editData?.department ? editData?.department : ""}`,
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
    fullname: Yup.string().required("This field is required"),
    email: Yup.string().required("This field is required"),
    city: Yup.string().required("This field is required"),
    state: Yup.string().required("This field is required"),
    country: Yup.string().required("This field is required"),
    department: Yup.string().required("This field is required"),
    address: Yup.string().required("This field is required"),
    phoneNumber: Yup.string(),
  });
  if (isLoading) return <LoadingSpinner />;
  return (
    <Stack minHeight="100vh" spacing={4} padding={screenPadding}>
      <Heading fontSize="3xl" fontWeight="semibold">
        Employees Overview
      </Heading>
      <Flex
        justifyContent="space-between"
        gap={5}
        flexDirection={{
          base: "column",
          sm: "column",
          md: "row",
          lg: "row",
          xl: "row",
        }}
      >
        <Box
          width={{ base: "100%", sm: "100%", md: "50%", lg: "50%", xl: "50%" }}
        >
          <PieChart />
        </Box>
        <Box
          width={{ base: "100%", sm: "100%", md: "50%", lg: "50%", xl: "50%" }}
        >
          <ColumnChart />
        </Box>
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
        <NoDataToDisplay />
      )}
    </Stack>
  );
}

export default EmployeesGeneral;
