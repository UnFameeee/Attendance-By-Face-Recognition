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
import { useSelector } from "react-redux";
import * as Yup from "yup";
import { FaRegUserCircle, FaGrinStars, FaHouseUser } from "react-icons/fa";
import { MdOutlineAlternateEmail } from "react-icons/md";
import {
  BsTelephone,
  BsFillShieldLockFill,
  BsEyeFill,
  BsEyeSlashFill,
} from "react-icons/bs";
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
import { Country, State, City } from "country-state-city";
import { permissionEmployeeGeneral } from "../../../screen-permissions/permission";
import { useGetPermission } from "../../../hook/useGetPermission";
function EmployeesGeneral() {
  const resultPermission = useGetPermission(
    permissionEmployeeGeneral,
    "employee-management"
  );
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
      isDisabled: resultPermission?.update,
    },
    {
      actionName: "Delete",
      func: Delete,
      isDisabled: resultPermission?.delete,
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
        Header: "Birthday",
        accessor: "dateOfBirth",
        haveFilter: {
          filterType: FilterType.DateTime,
        },
        haveSort: true,
        cellWidth: "150px",
        type: "date",
      },
      {
        Header: "Description",
        accessor: "description",
        haveFilter: {
          filterType: FilterType.Text,
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
        cellWidth: "210px",
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
      name: "password",
      label: "Password",
      placeholder: "Enter your Password",
      isPassword: "true",
      leftIcon: <BsFillShieldLockFill color="#999" fontSize="1.5rem" />,
      rightIcon: <BsEyeFill color="#999" fontSize="1.5rem" />,
      hideIcon: <BsEyeSlashFill color="#999" fontSize="1.5rem" />,
    },
    {
      name: "role",
      label: "Role",
      isSelectionField: true,
      placeholder:'---',
      selectionArray: [
        { label: "Employee", value: "employee" },
        { label: "Manager", value: "manager" },
      ],
    },
    {
      name: "phoneNumber",
      label: "Phone",
      type: "text",
      placeholder: "Enter your number",
      leftIcon: <BsTelephone color="#999" fontSize="1.4rem" />,
    },
    {
      name: "gender",
      label: "Gender",
      isGender: true,
      arrayGender: [
        { label: "Male", value: "male" },
        { label: "Female", value: "female" },
      ],
    },
    {
      name: "dateOfBirth",
      label: "Birthday",
      isDateField: true,
    },
    {
      name: "description",
      label: "Description",
      type: "text",
      placeholder: "Enter your description",
      isTextAreaField: true,
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
    fullname: `${editData?.fullname ?? ""}`,
    email: `${editData?.email ?? ""}`,
    phoneNumber: `${editData?.phoneNumber ?? ""}`,
    password: editData?.password ?? "",
    role:editData?.role ?? "",
    gender: editData?.gender ?? "male",
    dateOfBirth: `${
      editData?.dateOfBirth
        ? new Date(editData?.dateOfBirth).toISOString().substring(0, 10)
        : ""
    }`,
    description: `${editData?.description ?? ""}`,
    location: {
      country: `${editData["location.country"] ?? ""}`,
      state: `${editData["location.state"] ?? ""}`,
      city: `${editData["location.city"] ?? ""}`,
    },
    address: `${editData["location.address"] ?? ""}`,
  };
  const validationSchema = Yup.object().shape({
    fullname: Yup.string().required("This field is required"),
    email: Yup.string().required("This field is required"),
    password: Yup.string().required("This field is required"),
    role: Yup.string().required("This field is required"),
    phoneNumber: Yup.string(),
  });
  if (isLoading) return <LoadingSpinner />;
  return (
    <Stack minHeight="100vh" spacing={4}>
      <HStack>
        <Icon boxSize="40px" as={FaHouseUser} />
        <Heading fontSize="3xl" fontWeight="semibold">
          Employees Overview
        </Heading>
      </HStack>
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
      <Box marginTop="10px">
        <DynamicTable
          onAddEditOpen={onAddEditOpen}
          handleDeleteRange={DeleteRange}
          tableRowAction={tableRowAction}
          columns={columns}
          data={data?.result?.data}
          permission={resultPermission}
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
      {data?.result?.data.length == 0 && <NoDataToDisplay h="450px" />}
    </Stack>
  );
}

export default EmployeesGeneral;
