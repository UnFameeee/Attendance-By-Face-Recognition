import {
  Avatar,
  Badge,
  Box,
  Flex,
  Heading,
  HStack,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import { IoImageOutline } from "react-icons/io5";
import { FaRegUserCircle, FaGrinStars } from "react-icons/fa";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { RiFolderUserLine } from "react-icons/ri";
import { BsTelephone } from "react-icons/bs";
import PieChart from "../../../components/PieChart";
import ColumnChart from "../../../components/ColumnChart";
import DynamicTable from "../../../components/DynamicTable";
import { dumbTableData, roleCodeColor } from "../../test/dumbTableData";
import NoDataToDisplay from "../../../components/NoDataToDisplay";
import ChakraAlertDialog from "../../../components/ChakraAlertDialog";
import DynamicDrawer from "../../../components/DynamicDrawer";
import { FilterType } from "../../../components/DynamicTable";
function EmployeesGeneral() {
  const screenPadding = "2rem";
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
        Header: "Picture",
        accessor: "picture",
        Cell: ({ value }) => <Avatar src={value} />,
      },
      {
        Header: "Full Name",
        accessor: "fullName",
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
        Header: "Role",
        accessor: "role",
        Cell: ({ value }) => (
          <Badge
            colorScheme={Object.values(matchingItem(value))[0]}
            fontSize="lg"
          >
            {value}
          </Badge>
        ),
        haveFilter: {
          filterType: FilterType.Default,
        },
        haveSort: true,
      },
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
        Header: "Address",
        accessor: "address",
        cellWidth: "200px",
        haveFilter: {
          filterType: FilterType.DateTime,
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
      name: "fullName",
      label: "Full Name",
      placeholder: "Enter your Full Name",
      leftIcon: <FaRegUserCircle color="#999" fontSize="1.5rem" />,
    },
    {
      name: "picture",
      label: "Picture",
      placeholder: "imageUrl.com",
      leftIcon: <IoImageOutline color="#999" fontSize="1.5rem" />,
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "abc@gmail.com",
      leftIcon: <MdOutlineAlternateEmail color="#999" fontSize="1.5rem" />,
    },
    {
      name: "phone",
      label: "Phone number",
      type: "text",
      placeholder: "Enter your number",
      leftIcon: <BsTelephone color="#999" fontSize="1.4rem" />,
    },
    {
      isSelectionField: true,
      selectionArray: roleArray,
      name: "role",
      label: "Role",
      type: "text",
      placeholder: "Chose your role",
      leftIcon: <RiFolderUserLine color="#999" fontSize="1.5rem" />,
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
    fullName: `${editData.fullName ? editData.fullName : ""}`,
    email: `${editData.email ? editData.email : ""}`,
    phone: `${editData.phoneNumber ? editData.phoneNumber : ""}`,
    address: `${editData.address ? editData.address : ""}`,
    picture: `${editData.picture ? editData.picture : ""}`,
    role: `${editData.role ? editData.role : ""}`,
  };
  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required("This field is required"),
    email: Yup.string().required("This field is required"),
    address: Yup.string().required("This field is required"),
    role: Yup.string().required("This field is required"),
    picture: Yup.string().required("This field is required"),
    phone: Yup.string(),
  });
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
      {tableData.length > 0 ? (
        <Box marginTop="10px">
          <DynamicTable
            onAddEditOpen={onAddEditOpen}
            handleDeleteRange={DeleteRange}
            tableRowAction={tableRowAction}
            columns={columns}
            data={tableData}
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
