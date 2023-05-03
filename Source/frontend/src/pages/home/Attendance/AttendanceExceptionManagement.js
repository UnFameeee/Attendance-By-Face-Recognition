import React, { useState } from "react";
import { useGetPermission } from "../../../hook/useGetPermission";
import { permissionAttendanceManagement } from "../../../screen-permissions/permission";
import { useMutation, useQueryClient } from "react-query";
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
import { useGetListDepartment } from "../../../services/organization/department";
import { attendanceService } from "../../../services/attendance/attendance";
import { Helper } from "../../../Utils/Helper";
function AttendanceExceptionManagement() {
  // #region declare variable
  const resultPermission = useGetPermission(
    permissionAttendanceManagement,
    "attendance-management"
  );
  const toast = useToast();
  const queryClient = useQueryClient();
  const finalRef = React.useRef(null);
  const [editData, setEditData] = useState({});
  const [listAttendanceException, setListAttendanceException] = useState([]);
  console.log("listAttendanceException", listAttendanceException);
  const [checkType, setCheckType] = useState("CHECKIN");
  const [userRole, setUserRole] = useState(Helper.getUserRole());
  // #endregion
  // #region hooks
  const {
    isOpen: isAddEditOpen,
    onOpen: onAddEditOpen,
    onClose: onAddEditClose,
  } = useDisclosure();
  const { data: listDepartmentData } = useGetListDepartment();
  const useGetListAttendanceException = useMutation(
    attendanceService.getListAttendanceException,
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
          setListAttendanceException((prevList) => {
            let resultData = [...data?.result?.data];
            // const mergedResult = unionBy(resultData, prevList, "shiftId");
            queryClient.setQueryData(
              ["listAttendanceException", checkType],
              resultData
            );
            return resultData;
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
  // #endregion
  // #region functions
  const DeleteRange = (data) => {
    console.log("handleDeleteRange", data);
  };
  const Edit = (row, action) => {
    console.log("Row",row)
    onAddEditOpen();
    setEditData(row);
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
        accessor: "attendanceExceptionId",
        // haveFilter: {
        //   filterType: FilterType.Text,
        // },
        cellWidth: "150px",
        hidden: true,
      },
      {
        Header: "Name",
        accessor: "name",
        // haveFilter: {
        //   filterType: FilterType.Text,
        // },
        cellWidth: "150px",
      },
      {
        Header: "Department",
        accessor: "department.departmentName",
        // haveFilter: {
        //   filterType: FilterType.Text,
        // },
        cellWidth: "150px",
      },
      {
        Header: "Time",
        accessor: "datetime",
        // haveFilter: {
        //   filterType: FilterType.DateTime,
        // },
        type: "date",
        cellWidth: "150px",
      },
      {
        Header: "Approver",
        accessor: "approver",
        // haveFilter: {
        //   filterType: FilterType.Text,
        // },
        cellWidth: "150px",
      },
      {
        Header: "Status",
        accessor: "status",
        // haveFilter: {
        //   filterType: FilterType.Default,
        // },
        Cell: ({ value }) => <Badge fontSize="lg">{value}</Badge>,
        cellWidth: "100px",
      },
    ],
    []
  );
  // #endregion
  // #region drawer

  // #endregion
  // #region form
  let listDepartmentArray = React.useMemo(() => {
    if (listDepartmentData?.result?.data?.length > 0) {
      let tempArray = [];
      listDepartmentData?.result?.data.map((item) => {
        tempArray.push({
          label: item.departmentName,
          value: item.departmentId,
        });
      });
      return tempArray;
    }
  });
  const initialValuesForm = {
    dateSelect: "",
    departmentId: "",
  };
  const validationSchemaForm = Yup.object().shape({
    departmentId: Yup.string().required("This field is required"),
    dateSelect: Yup.date().required("This field is required"),
  });
  // #endregion
  return (
    <VStack minHeight="100vh" alignItems="flex-start" spacing={3}>
      <VStack spacing="5">
        <Flex gap="10px">
          <Box w="10px" bg="blue.700" borderRadius="5px"></Box>
          <Heading fontSize="3xl">Attendance Exception Management</Heading>
        </Flex>
      </VStack>
      <HStack bg="white" p={3} rounded="md">
        <Heading fontSize="xl" fontWeight="medium">
          <Highlight
            query={["Data Select"]}
            styles={{ px: "2", py: "1", rounded: "full", bg: "red.100" }}
          >
            Data Select
          </Highlight>
        </Heading>
        <Formik
          initialValues={initialValuesForm}
          validationSchema={validationSchemaForm}
          onSubmit={(values, actions) => {
            let attendanceExceptionDataObj = {};
            attendanceExceptionDataObj["attendanceType"] = checkType;
            attendanceExceptionDataObj["filter"] = values.dateSelect;
            attendanceExceptionDataObj["roleName"] = userRole.role;
            attendanceExceptionDataObj["departmentId"] = values.departmentId;
            useGetListAttendanceException.mutate(attendanceExceptionDataObj);
          }}
        >
          {(formik) => (
            <HStack
              alignItems="center"
              as="form"
              onSubmit={formik.handleSubmit}
            >
              <FormTextField name="dateSelect" isDateField={true} />
              <FormTextField
                name="departmentId"
                isSelectionField={true}
                placeholder="---"
                selectionArray={listDepartmentArray}
              />

              <div className=" mt-[6px]">
                <Button colorScheme="blue" type="submit" size="md">
                  Submit
                </Button>
              </div>
            </HStack>
          )}
        </Formik>
      </HStack>
      <Box w="100%">
        <Tabs isFitted variant="soft-rounded" colorScheme="blue">
          <TabList mb="1em">
            <Tab
              border="1px solid gray"
              onClick={() => setCheckType("CHECKIN")}
            >
              Check In
            </Tab>
            <Tab
              border="1px solid gray"
              onClick={() => setCheckType("CHECKOUT")}
            >
              Check Out
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Box w="100%">
                <DynamicTable
                  onAddEditOpen={onAddEditOpen}
                  handleDeleteRange={DeleteRange}
                  tableRowAction={tableRowAction}
                  columns={columns}
                  data={listAttendanceException}
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
                  data={listAttendanceException}
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
                  {checkType == "CHECKIN" ? "Check in" : "Check out"}
                </Highlight>
              </Heading>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Formik
            >
              {(formik) => (
                <>
                  <HStack spacing="10px">
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
                      <FormTextField
                        isReadOnly={true}
                        name="name_systemInfo"
                        label="Name"
                      />
                      <FormTextField
                        isReadOnly={true}
                        name="department_systemInfo"
                        label="Department"
                      />
                      <FormTextField
                        isReadOnly={true}
                        name="email_systemInfo"
                        label="Email"
                      />
                    </VStack>
                    <Flex alignItems="center">
                      <Box mt="10rem">
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
                      <FormTextField
                        isReadOnly={true}
                        name="name_employeeInfo"
                        label="Name"
                      />
                      <FormTextField
                        isReadOnly={true}
                        name="department_employeeInfo"
                        label="Department"
                      />
                      <FormTextField
                        isReadOnly={true}
                        name="email_employeeInfo"
                        label="Email"
                      />
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
    </VStack>
  );
}

export default AttendanceExceptionManagement;
