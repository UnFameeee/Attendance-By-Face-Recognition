import {
  Avatar,
  Badge,
  Box,
  Flex,
  Heading,
  HStack,
  Stack,
} from "@chakra-ui/react";
import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import PieChart from "../../../components/PieChart";
import ColumnChart from "../../../components/ColumnChart";
import ReactTableWithCharka from "../../../components/ReactTableWithCharka";
import { dumbTableData, roleCodeColor } from "../../test/dumbTableData";
import EmployeesGeneralDrawer from "./EmployeesGeneralDrawer";
function EmployeesGeneral() {
  const screenPadding = "2rem";
  const [openDrawerToEdit, setOpenDrawerToEdit] = useState(false);
  const [editData, setEditData] = useState({});
  const AddNew = () => {
    console.log("handleAddNew");
  };
  const DeleteRange = (data) => {
    console.log("handleDeleteRange", data);
  };
  const Delete = (row, action) => {
    console.log(row, action);
  };
  const Edit = (row, action) => {
    setEditData(row);
    setOpenDrawerToEdit(true);
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
  const matchingItem = (value) => {
    return roleCodeColor.find(
      (item) => Object.keys(item)[0].toLowerCase() === value.toLowerCase()
    );
  };
  const data = React.useMemo(() => dumbTableData);
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
      },
      {
        Header: "Email",
        accessor: "email",
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
      },
      {
        Header: "Phone Number",
        accessor: "phoneNumber",
      },
      {
        Header: "Address",
        accessor: "address",
        cellWidth: "200px",
      },
    ],
    []
  );
  return (
    <Box minHeight="100vh">
      <Stack spacing={4} padding={screenPadding}>
        <Heading fontSize="3xl" fontWeight="semibold">
          Employees Overview
        </Heading>
        <Flex justifyContent="space-between" gap={5}>
          <Box width="50%">
            <PieChart />
          </Box>
          <Box width="50%">
            <ColumnChart />
          </Box>
        </Flex>
        <Box width="150px">
          <EmployeesGeneralDrawer
            openDrawerToEdit={openDrawerToEdit}
            setOpenDrawerToEdit={setOpenDrawerToEdit}
            editData={editData}
            setEditData={setEditData}
          />
        </Box>
        <ReactTableWithCharka
          handleAddNew={AddNew}
          handleDeleteRange={DeleteRange}
          tableRowAction={tableRowAction}
          columns={columns}
          data={data}
        />
      </Stack>
    </Box>
  );
}

export default EmployeesGeneral;
