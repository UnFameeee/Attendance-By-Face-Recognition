import {
  Badge,
  Box,
  Flex,
  Heading,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Stack,
  useDisclosure,
  useToast,
  Button,
  SimpleGrid,
  Image,
} from "@chakra-ui/react";
import React, { useState } from "react";
import * as Yup from "yup";
import { FaRegUserCircle, FaHouseUser } from "react-icons/fa";
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
import NoDataToDisplay from "../../../components/NoDataToDisplay";
import ChakraAlertDialog from "../../../components/ChakraAlertDialog";
import DynamicDrawer from "../../../components/table/DynamicDrawer";
import { useMutation, useQueryClient } from "react-query";
import {
  employeeService,
  useGetListEmployee,
} from "../../../services/employee/employee";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { Country, State } from "country-state-city";
import { permissionEmployeeManagement } from "../../../screen-permissions/permission";
import { useGetPermission } from "../../../hook/useGetPermission";
import { passwordRegex } from "../../../Utils/ValidationRegExp";
import { roleCodeColor } from "../../../data/ColorData";
import { Helper } from "../../../Utils/Helper";
import test_image from "../../../assets/ta.jpeg";
import AvatarWithPreview from "../../../components/AvatarWithPreview";
function EmployeesManagement() {
  // #region declare variable
  const resultPermission = useGetPermission(
    permissionEmployeeManagement,
    "employee-management"
  );
  const toast = useToast();
  const queryClient = useQueryClient();
  const [editData, setEditData] = useState({});
  const [deleteSingleData, setDeleteSingleData] = useState({});
  const [employeeRetrainId, setEmployeeRetrainId] = useState();

  const [listEmployeePhotos, setListEmployeePhotos] = useState([]);

  // #endregion
  // #region hook
  const { data: listEmployeeData, isFetching: isFetchingListEmployee, isLoading: isLoadingListEmployee } =
    useGetListEmployee();
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
  const {
    isOpen: isPhotoViewModalOpen,
    onOpen: onPhotoViewModalOpen,
    onClose: onPhotoViewModalClose,
  } = useDisclosure();
  const {
    isOpen: isRetrainAlertOpen,
    onOpen: onRetrainAlertOpen,
    onClose: onRetrainAlertClose,
  } = useDisclosure();
  const useCreateEmployee = useMutation(employeeService.createEmployeeService, {
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
          title: "Create Employee Successfully",
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
  const useSaveEmployee = useMutation(employeeService.saveEmployeeService, {
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
          title: "Save Employee Successfully",
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
  const useDeleteEmployee = useMutation(employeeService.deleteEmployeeService, {
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
          title: "Delete Employee Successfully",
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
  const useGetEmployeePhotos = useMutation(
    employeeService.getListImageOfEmployee,
    {
      onSuccess: (data) => {
        setListEmployeePhotos(data?.result);
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
  const useRetrainPhotos = useMutation(employeeService.retrainPhotos, {
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
        toast({
          title: "Request Employee To Retrain Photos Successfully",
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
  // #endregion
  // #region function
  const handleEditEmployee = (values) => {
    const id = editData.id;
    const employeeObj = {
      ...values,
      ["dateOfBirth"]: values?.dateOfBirth
        ? new Date(values?.dateOfBirth).toISOString()
        : null,
    };
    useSaveEmployee.mutate({ id, employeeObj });
    closeDrawer();
  };
  const handleCreateEmployee = (values) => {
    const employeeObj = {
      ...values,
      ["dateOfBirth"]: values?.dateOfBirth
        ? new Date(values?.dateOfBirth).toISOString()
        : null,
    };
    useCreateEmployee.mutate(employeeObj);
    closeDrawer();
  };
  const editEmployee = (row, action) => {
    onAddEditOpen();
    setEditData(row);
  };
  const deleteEmployee = (row, action) => {
    setDeleteSingleData(row);
    onDeleteSingleOpen();
  };
  const DeleteRange = (data) => {
    console.log("handleDeleteRange", data);
  };
  const viewEmployeePhotos = (row, action) => {
    useGetEmployeePhotos.mutate(row.id);
    setEditData(row);
    onPhotoViewModalOpen();
  };
  const requestToRetrain = (row, action) => {
    setEditData(row);
    setEmployeeRetrainId(row.id);
    onRetrainAlertOpen();
  };
  const handleAcceptRetrain = () => {
    setEmployeeRetrainId();
    useRetrainPhotos.mutate(employeeRetrainId);
    onRetrainAlertClose();
  };
  const handleAcceptDelete = () => {
    console.log(deleteSingleData);
    useDeleteEmployee.mutate(deleteSingleData.id)
    setDeleteSingleData({});
    onDeleteSingleClose();
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
      func: editEmployee,
      isDisabled: resultPermission?.update,
    },
    {
      actionName: "View Face Data Photos",
      func: viewEmployeePhotos,
      isDisabled: true,
    },
    {
      actionName: "Request to retrain",
      func: requestToRetrain,
      isDisabled: true,
    },
    {
      actionName: "Delete",
      func: deleteEmployee,
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
        cellWidth: "250px",
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
        Header: "Gender",
        accessor: "gender",
        // haveFilter: {
        //   filterType: FilterType.Default,
        // },
        // haveSort: true,
        cellWidth: "150px",
      },
      {
        Header: "Role",
        accessor: "role.displayName",
        Cell: ({ value }) => (
          <Badge
            p="5px"
            colorScheme={
              Object.values(Helper.matchingCodeColor(value, roleCodeColor))[0]
            }
            fontSize="lg"
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
        Header: "Phone",
        accessor: "phoneNumber",
        // haveFilter: {
        //   filterType: FilterType.Number,
        // },
        // haveSort: true,
        cellWidth: "150px",
      },
      {
        Header: "Birthday",
        accessor: "dateOfBirth",
        // haveFilter: {
        //   filterType: FilterType.DateTime,
        // },
        // haveSort: true,
        cellWidth: "150px",
        type: "date",
      },
      {
        Header: "Description",
        accessor: "description",
        // haveFilter: {
        //   filterType: FilterType.Text,
        // },
        // haveSort: true,
        cellWidth: "150px",
      },
      {
        Header: "Department",
        accessor: "department",
        Cell: ({ value }) => <span>{value?.departmentName}</span>,
        cellWidth: "200px",
        // haveFilter: {
        //   filterType: FilterType.Text,
        // },
        // haveSort: true,
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
        cellWidth: "210px",
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
      name: "fullname",
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
      name: "password",
      label: "Password",
      placeholder: "Enter your Password",
      isPassword: "true",
      leftIcon: <BsFillShieldLockFill color="#999" fontSize="1.5rem" />,
      rightIcon: <BsEyeFill color="#999" fontSize="1.5rem" />,
      hideIcon: <BsEyeSlashFill color="#999" fontSize="1.5rem" />,
    },
    {
      name: "displayName",
      label: "Role",
      isSelectionField: true,
      placeholder: "---",
      selectionArray: [
        { label: "Employee", value: "Employee" },
        { label: "Manager", value: "Manager" },
      ],
    },
    {
      name: "department",
      label: "Department",
      placeholder: "---",
      isReadOnly: true,
    },
    {
      name: "phoneNumber",
      label: "Phone",
      type: "type",
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
    displayName: editData?.["role.displayName"] ?? "",
    department: editData?.department?.departmentName ?? "",
    gender: editData?.gender ?? "male",
    dateOfBirth: `${editData?.dateOfBirth
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
  const validationSchema = Yup.object().shape(
    Object.keys(editData).length === 0
      ? {
        fullname: Yup.string().min(8, "Full name must be more than 8 characters").required("This field is required"),
        email: Yup.string().required("This field is required"),
        displayName: Yup.string().required("This field is required"),
        password: Yup.string()
          .matches(
            passwordRegex,
            "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character and be at least 8 characters long"
          )
          .required("This field is required"),
      }
      : {
        fullname: Yup.string().required("This field is required"),
        email: Yup.string().required("This field is required"),
        password: Yup.string().matches(
          passwordRegex,
          "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character and be at least 8 characters long"
        ),
      }
  );
  // #endregion
  if (isLoadingListEmployee) return <LoadingSpinner />;
  return (
    <Stack h="100%" spacing={4}>
      <HStack>
        <Flex
          gap="10px"
          bg="white"
          rounded="md"
          p={2}
          w="fit-content"
          shadow="2xl"
        >
          <Box w="10px" bg="blue.700" borderRadius="5px"></Box>
          <Heading fontSize="3xl">Employees Overview</Heading>
        </Flex>
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
        {/* <Box
          width={{ base: "100%", sm: "100%", md: "50%", lg: "50%", xl: "50%" }}
        >
          <PieChart />
        </Box>
        <Box
          width={{ base: "100%", sm: "100%", md: "50%", lg: "50%", xl: "50%" }}
        >
          <ColumnChart />
        </Box> */}
      </Flex>
      {useCreateEmployee.isLoading ||
        useSaveEmployee.isLoading || useDeleteEmployee.isLoading ||
        isFetchingListEmployee ? (
        <LoadingSpinner />
      ) : (
        <Box marginTop="10px">
          {
            listEmployeeData?.result?.data &&
            <DynamicTable
              onAddEditOpen={onAddEditOpen}
              handleDeleteRange={DeleteRange}
              tableRowAction={tableRowAction}
              columns={columns}
              data={listEmployeeData?.result?.data}
              permission={resultPermission}
            />
          }
          <DynamicDrawer
            handleEdit={handleEditEmployee}
            handleCreate={handleCreateEmployee}
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
          <ChakraAlertDialog
            title="Require employee to retrain photos"
            isOpen={isRetrainAlertOpen}
            onClose={onRetrainAlertClose}
            onAccept={handleAcceptRetrain}
            acceptButtonLabel="Accept"
            acceptButtonColor="blue"
          />
          <Modal
            isOpen={isPhotoViewModalOpen}
            onClose={() => {
              onPhotoViewModalClose();
              setEditData({});
            }}
            size="4xl"
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader textTransform="capitalize">
                {editData.fullname}'s Photos
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <SimpleGrid
                  spacing={3}
                  gridTemplateColumns="repeat(auto-fit, minmax(150px,1fr))"
                >
                  {listEmployeePhotos.map((item, index) => (
                    <Flex
                      alignItems="center"
                      key={index}
                      boxSize="150px"
                      bg="black"
                    >
                      {/* <Image src={test_image} /> */}
                      <AvatarWithPreview
                        src={item.link}
                        altBoxSide="150px"
                        altRounded="none"
                        className="rounded-none"
                        alt={`${editData.fullname}-training-photo`}
                      />
                    </Flex>
                  ))}
                </SimpleGrid>
              </ModalBody>
              <ModalFooter>
                <Button
                  colorScheme="blue"
                  mr={3}
                  onClick={() => {
                    onPhotoViewModalClose();
                    setEditData({});
                  }}
                >
                  Close
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Box>
      )}
    </Stack>
  );
}

export default EmployeesManagement;
