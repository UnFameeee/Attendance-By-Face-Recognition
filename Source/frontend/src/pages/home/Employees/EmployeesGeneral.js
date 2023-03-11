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
import PieChart from "../../../components/PieChart";
import ColumnChart from "../../../components/ColumnChart";
import ReactTableWithCharka from "../../../components/ReactTableWithCharka";
import { dumbTableData, roleCodeColor } from "../../test/dumbTableData";
import EmployeesGeneralDrawer from "./EmployeesGeneralDrawer";
import NoDataToDisplay from "../../../components/NoDataToDisplay";
import ChakraAlertDialog from "../../../components/ChakraAlertDialog";
function EmployeesGeneral() {
  const screenPadding = "2rem";
  const [openDrawerToEdit, setOpenDrawerToEdit] = useState(false);
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
    <Stack minHeight="100vh" spacing={4} padding={screenPadding}>
      <Heading fontSize="3xl" fontWeight="semibold">
        Employees Overview
      </Heading>
      <Flex justifyContent="space-between" gap={5}>
        <Box width="49%">
          <PieChart />
        </Box>
        <Box width="49%">
          <ColumnChart />
        </Box>
      </Flex>
      {data.length > 0 ? (
        <>
          <Box width="150px">
            <EmployeesGeneralDrawer
              isAddEditOpen={isAddEditOpen}
              onAddEditClose={onAddEditClose}
              openDrawerToEdit={openDrawerToEdit}
              setOpenDrawerToEdit={setOpenDrawerToEdit}
              editData={editData}
              setEditData={setEditData}
            />
          </Box>
          <ReactTableWithCharka
            onAddEditOpen={onAddEditOpen}
            handleDeleteRange={DeleteRange}
            tableRowAction={tableRowAction}
            columns={columns}
            data={data}
          />
          <ChakraAlertDialog
            title="Delete Single"
            isOpen={isDeleteSingleOpen}
            onClose={onDeleteSingleClose}
            onAccept={handleAcceptDelete}
          />
        </>
      ) : (
        <NoDataToDisplay />
      )}
    </Stack>
  );
}

export default EmployeesGeneral;
