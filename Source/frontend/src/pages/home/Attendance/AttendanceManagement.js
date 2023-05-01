import React, { useState } from "react";
import { useGetPermission } from "../../../hook/useGetPermission";
import { permissionAttendanceManagement } from "../../../screen-permissions/permission";
import { useQueryClient } from "react-query";
import {
  Box,
  Divider,
  Flex,
  Heading,
  Stack,
  Text,
  HStack,
  Button,
  Tooltip,
  useToast,
  useDisclosure,
  Badge,
  VStack,
  Highlight,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalContent,
  Center,
  Icon,
  Image,
  Avatar,
} from "@chakra-ui/react";
import * as Yup from "yup";
import DynamicTable from "../../../components/table/DynamicTable";
import DynamicDrawer from "../../../components/table/DynamicDrawer";
import ChakraAlertDialog from "../../../components/ChakraAlertDialog";
import { attendanceDumbData } from "../../test/dumbTableData";
import { Formik } from "formik";
import FormTextField from "../../../components/field/FormTextField";
import { BsArrowLeftRight } from "react-icons/bs";
import test_Img from "../../../assets/ta.jpeg";
function AttendanceManagement() {
  // #region declare variable
  const resultPermission = useGetPermission(
    permissionAttendanceManagement,
    "attendance-management"
  );
  const toast = useToast();
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const finalRef = React.useRef(null);
  const [editData, setEditData] = useState({});
  const [deleteSingleData, setDeleteSingleData] = useState({});
  // #endregion
  // #region hooks
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
  const handleSubmitApproval = (values) => {
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
      actionName: "Approval",
      func: Edit,
      isDisabled: resultPermission?.read,
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
        cellWidth: "150px",
        hidden: true,
      },
      {
        Header: "Check type",
        accessor: "checkType",
        Cell: ({ value }) => (
          <Badge fontSize="lg">{value ? "In" : "Out"}</Badge>
        ),
        // haveFilter: {
        //   filterType: FilterType.Default,
        // },
        cellWidth: "150px",
      },
      {
        Header: "Full name",
        accessor: "fullname",
        // haveFilter: {
        //   filterType: FilterType.Text,
        // },
        cellWidth: "150px",
      },
      {
        Header: "Department",
        accessor: "department",
        // haveFilter: {
        //   filterType: FilterType.Text,
        // },
        cellWidth: "150px",
      },
      {
        Header: "Approval",
        accessor: "isApproved",
        // haveFilter: {
        //   filterType: FilterType.Default,
        // },
        Cell: ({ value }) => (
          <Badge fontSize="lg">{value ? "yes" : "no"}</Badge>
        ),
        cellWidth: "100px",
      },
      {
        Header: "Time",
        accessor: "time",
        // haveFilter: {
        //   filterType: FilterType.DateTime,
        // },
        cellWidth: "150px",
      },
    ],
    []
  );
  // #endregion
  // #region drawer
  const drawerFieldData = [
    {
      name: "isApproved",
      label: "Approval",
      isSelectionField: true,
      selectionArray: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
    {
      name: "checkType",
      label: "Check Type",
      placeholder: "---",
      isReadOnly: Object.keys(editData).length === 0 ? false : true,
    },
    {
      name: "fullname",
      label: "Fullname",
      isReadOnly: Object.keys(editData).length === 0 ? false : true,
      isTextAreaField: true,
      rows: "5",
      placeholder: "write out your reason...",
    },
    {
      name: "department",
      label: "Department",
      isReadOnly: Object.keys(editData).length === 0 ? false : true,
    },

    {
      name: "time",
      label: "Time",
      isReadOnly: Object.keys(editData).length === 0 ? false : true,
      isDateField: true,
    },
  ];
  const initialValues = {
    isApproved: `${editData?.isApproved ?? false}`,
    checkType: editData?.checkType ? "In" : "Out",
    time: editData?.time
      ? new Date(editData?.time).toISOString().substring(0, 10)
      : "",
    fullname: editData?.fullname ?? "",
    department: editData?.department ?? "",
  };
  const initialValuesForm = {
    dateSelect: "",
  };
  const validationSchema = Yup.object().shape({});
  // #endregion
  // #region form
  // #endregion
  return (
    <VStack minHeight="100vh" alignItems="flex-start" spacing={3}>
      <HStack spacing="5">
        <Flex gap="10px">
          <Box w="10px" bg="blue.700" borderRadius="5px"></Box>
          <Heading fontSize="3xl">Attendance Management</Heading>
        </Flex>
        <HStack>
          <Heading fontSize="xl" fontWeight="medium">
            <Highlight
              query={["Date Select:"]}
              styles={{ px: "2", py: "1", rounded: "full", bg: "red.100" }}
            >
              Date Select:
            </Highlight>
          </Heading>
          <Formik
            initialValues={initialValuesForm}
            onSubmit={(values, actions) => {
              console.log("values", values);
            }}
          >
            {(formik) => (
              <HStack
                alignItems="center"
                as="form"
                onSubmit={formik.handleSubmit}
              >
                <FormTextField name="dateSelect" isDateField={true} />
                <div className=" mt-[6px]">
                  <Button colorScheme="blue" type="submit" size="md">
                    Submit
                  </Button>
                </div>
              </HStack>
            )}
          </Formik>
        </HStack>
      </HStack>
      <Box w="100%">
        <Tabs isFitted variant="soft-rounded" colorScheme="blue">
          <TabList mb="1em">
            <Tab border="1px solid gray">Check In</Tab>
            <Tab border="1px solid gray">Check Out</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Box w="100%">
                <DynamicTable
                  onAddEditOpen={onAddEditOpen}
                  handleDeleteRange={DeleteRange}
                  tableRowAction={tableRowAction}
                  columns={columns}
                  data={attendanceDumbData}
                  permission={resultPermission}
                  noPaging={true}
                  hideButtons={true}
                />
              </Box>
            </TabPanel>
            <TabPanel>
              <Box w="100%">
                <DynamicTable
                  onAddEditOpen={onAddEditOpen}
                  handleDeleteRange={DeleteRange}
                  tableRowAction={tableRowAction}
                  columns={columns}
                  data={attendanceDumbData}
                  permission={resultPermission}
                  noPaging={true}
                  hideButtons={true}
                />
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
      <Modal
        finalFocusRef={finalRef}
        isOpen={isAddEditOpen}
        onClose={onAddEditClose}
        isCentered
        size="2xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack alignItems="center">
              <Heading fontSize="2xl">Approval</Heading>
              <Heading fontSize="xl" fontWeight="medium">
                <Highlight
                  query={["Check In", "Check Out"]}
                  styles={{ px: "2", py: "1", rounded: "md", bg: "red.100" }}
                >
                  Check In
                </Highlight>
              </Heading>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Formik>
              {(formik) => (
                <>
                  <HStack spacing='10px'>
                    <VStack flex="1" alignItems="flex-start">
                      <Heading fontSize="xl" fontWeight="medium">
                        System Information
                      </Heading>
                      <HStack spacing="20px">
                        <Avatar src={test_Img} boxSize="100px" />
                        <VStack>
                          <Text fontSize="lg">Time:</Text>
                          <Text>20:50 PM</Text>
                        </VStack>
                      </HStack>
                      <FormTextField name="name" label="Name" />
                      <FormTextField name="department" label="Department" />
                      <FormTextField name="email" label="Email" />
                    </VStack>
                    <Flex alignItems="center">
                      <Box mt='10rem'>
                        <Icon
                          color="blue.500"
                          as={BsArrowLeftRight}
                          fontSize="2.5rem"
                        />
                      </Box>
                    </Flex>
                    <VStack flex="1" alignItems="flex-start">
                      <Heading fontSize="xl" fontWeight="medium">
                        Employee Information
                      </Heading>
                      <HStack spacing="20px">
                        <Avatar src={test_Img} boxSize="100px" />
                        <VStack>
                          <Text fontSize="lg">Time:</Text>
                          <Text>20:50 PM</Text>
                        </VStack>
                      </HStack>
                      <FormTextField name="name" label="Name" />
                      <FormTextField name="department" label="Department" />
                      <FormTextField name="email" label="Email" />
                    </VStack>
                  </HStack>
                </>
              )}
            </Formik>
          </ModalBody>

          <ModalFooter>
            <Center>
              <Button
                variant="outline"
                colorScheme="red"
                mr={3}
                borderWidth="2px"
                onClick={onAddEditClose}
              >
                <Text fontWeight="bold">Reject</Text>
              </Button>
              <Button borderWidth="2px" colorScheme="green" variant="outline">
                <Text fontWeight="bold">Approve</Text>
              </Button>
            </Center>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* <DynamicDrawer
        handleCreate={handleSubmitApproval}
        isAddEditOpen={isAddEditOpen}
        onAddEditClose={onAddEditClose}
        editData={editData}
        setEditData={setEditData}
        validationSchema={validationSchema}
        initialValues={initialValues}
        drawerFieldData={drawerFieldData}
        titleArray={["Approval", "Create"]}
      /> */}
      <ChakraAlertDialog
        title="Delete Single"
        isOpen={isDeleteSingleOpen}
        onClose={onDeleteSingleClose}
        onAccept={handleAcceptDelete}
      />
    </VStack>
  );
}

export default AttendanceManagement;
