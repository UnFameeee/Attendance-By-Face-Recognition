import React, { useEffect, useState } from "react";
import { useGetPermission } from "../../../hook/useGetPermission";
import { permissionAttendanceExceptionManagement } from "../../../screen-permissions/permission";
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
import { Formik } from "formik";
import FormTextField from "../../../components/field/FormTextField";
import { BsArrowLeftRight } from "react-icons/bs";
import { useGetListDepartment } from "../../../services/organization/department";
import { attendanceService } from "../../../services/attendance/attendance";
import { Helper } from "../../../Utils/Helper";
import moment from "moment";
import { approvalCodeColor } from "../../../data/ColorData";
import NoDataToDisplay from "../../../components/NoDataToDisplay";
import AvatarWithPreview from "../../../components/AvatarWithPreview";
function AttendanceExceptionManagement() {
  // #region declare variable
  const resultPermission = useGetPermission(
    permissionAttendanceExceptionManagement,
    "attendance-management"
  );
  const toast = useToast();
  const queryClient = useQueryClient();
  const finalRef = React.useRef(null);
  const [
    currentApprovalAttendanceException,
    setCurrentApprovalAttendanceException,
  ] = useState({});
  const [listAttendanceException, setListAttendanceException] = useState([]);
  const [approvalId, setApprovalId] = useState("");
  const [readOnlyApproval, setReadOnlyApproval] = useState(false);
  const [attendanceExceptionGetListObj, setAttendanceExceptionGetListObj] =
    useState();
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
  const useGetAttendanceExceptionData = useMutation(
    attendanceService.getAttendanceExceptionData,
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
          setCurrentApprovalAttendanceException((prevList) => {
            let resultData = data?.result;
            // const mergedResult = unionBy(resultData, prevList, "shiftId");
            queryClient.setQueryData(
              ["currentApprovalAttendanceException", checkType],
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
  const useVerifyExceptionAttendance = useMutation(
    attendanceService.verifyExceptionAttendance,
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
          useGetListAttendanceException.mutate(attendanceExceptionGetListObj);
          toast({
            title: "Verify Attendance Exception Successfully",
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
    }
  );
  // #endregion
  // #region functions
  const DeleteRange = (data) => {
    console.log("handleDeleteRange", data);
  };
  const Edit = (row, action) => {
    if (row.status !== "WAITING") {
      setReadOnlyApproval(true);
    } else {
      setReadOnlyApproval(false);
    }
    const id = row.attendanceExceptionId;
    setApprovalId(id);
    useGetAttendanceExceptionData.mutate(id);
  };
  const handleApproveApproval = () => {
    let verifyApprovalObj = {};
    verifyApprovalObj["status"] = "APPROVE";
    verifyApprovalObj["id"] = approvalId;
    useVerifyExceptionAttendance.mutate(verifyApprovalObj);
    onAddEditClose();
  };
  const handleRejectApproval = () => {
    let verifyApprovalObj = {};
    verifyApprovalObj["status"] = "REJECT";
    verifyApprovalObj["id"] = approvalId;
    useVerifyExceptionAttendance.mutate(verifyApprovalObj);
    onAddEditClose();
  };
  const handleChangeTab = (checkType) => {
    setCheckType(checkType);
    if (attendanceExceptionGetListObj?.departmentId) {
      let getListAttendanceExceptionObj = { ...attendanceExceptionGetListObj };
      getListAttendanceExceptionObj.attendanceType = checkType;
      useGetListAttendanceException.mutate(getListAttendanceExceptionObj);
    }
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
        accessor: "approver.fullname",
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
        Cell: ({ value }) => (
          <Badge
            p="5px"
            colorScheme={
              Object.values(
                Helper.matchingCodeColor(value, approvalCodeColor)
              )[0]
            }
            fontSize="lg"
          >
            {value}
          </Badge>
        ),
        cellWidth: "100px",
      },
    ],
    []
  );
  // #endregion
  // #region form
  const [listDepartmentArray, setListDepartmentArray] = useState([]);
  useEffect(() => {
    setListDepartmentArray(
      Helper.convertToArraySelection(
        listDepartmentData?.result?.data,
        "departmentName",
        "departmentId"
      )
    );
  }, [listDepartmentData]);
  const initialValuesForm = {
    dateSelect: "",
    departmentId: "",
  };
  const validationSchemaForm = Yup.object().shape({
    departmentId: Yup.string().required("This field is required"),
  });
  const [initialValuesModal, setInitialValuesModal] = useState();
  useEffect(() => {
    if (currentApprovalAttendanceException) {
      setInitialValuesModal(() => {
        let tempObj = {};
        tempObj["name_employeeInfo"] =
          currentApprovalAttendanceException?.employeeData?.name;
        tempObj["email_employeeInfo"] =
          currentApprovalAttendanceException?.employeeData?.email;
        tempObj["department_employeeInfo"] =
          currentApprovalAttendanceException?.employeeData?.department?.departmentName;
        tempObj["name_systemInfo"] =
          currentApprovalAttendanceException?.systemData?.fullname;
        tempObj["email_systemInfo"] =
          currentApprovalAttendanceException?.systemData?.email;
        tempObj["department_systemInfo"] =
          currentApprovalAttendanceException?.systemData?.department?.departmentName;
        tempObj["employeeImage"] =
          currentApprovalAttendanceException?.employeeData?.image;
        tempObj["systemImage"] =
          currentApprovalAttendanceException?.systemData?.image;
        tempObj["employeeTime"] = moment(
          currentApprovalAttendanceException?.employeeData?.datetime
        ).format("DD/MM/yyyy hh:mm A");
        tempObj["systemTime"] = moment(
          currentApprovalAttendanceException?.systemData?.shiftTime
        ).format("DD/MM/yyyy hh:mm A");
        return tempObj;
      });
    }
  }, [currentApprovalAttendanceException]);
  useEffect(() => {
    if (initialValuesModal?.name_employeeInfo) {
      onAddEditOpen();
    }
  }, [initialValuesModal]);
  // #endregion
  return (
    <VStack h="100%" alignItems="flex-start" spacing={3}>
      <VStack spacing="5">
        <Flex
          gap="10px"
          bg="white"
          rounded="md"
          p={2}
          w="fit-content"
          shadow="2xl"
        >
          <Box w="10px" bg="blue.700" borderRadius="5px"></Box>
          <Heading fontSize="3xl">Attendance Exception Management</Heading>
        </Flex>
      </VStack>
      <HStack bg="white" p={3} rounded="md" shadow="2xl">
        <Formik
          initialValues={initialValuesForm}
          validationSchema={validationSchemaForm}
          onSubmit={(values, actions) => {
            let attendanceExceptionListDataObj = {};
            attendanceExceptionListDataObj["attendanceType"] = checkType;
            if (values.dateSelect != "") {
              attendanceExceptionListDataObj["filter"] = values.dateSelect;
            }
            attendanceExceptionListDataObj["roleName"] = userRole.role;
            attendanceExceptionListDataObj["departmentId"] =
              values.departmentId;
            setAttendanceExceptionGetListObj(attendanceExceptionListDataObj);
            useGetListAttendanceException.mutate(
              attendanceExceptionListDataObj
            );
          }}
        >
          {(formik) => (
            <HStack
              // alignItems="end"
              as="form"
              onSubmit={formik.handleSubmit}
              flexDirection={{ sm: "row", base: "column" }}
              gap="10px"
              alignItems={{ base: "baseline", sm: "end" }}
            >
              <FormTextField
                label="Date"
                name="dateSelect"
                isDateField={true}
              />
              <FormTextField
                label="Department"
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
        <Tabs
          isFitted
          variant="solid-rounded"
          colorScheme={checkType == "CHECKIN" ? "green" : "red"}
        >
          <TabList
            mb="1em"
            gap="5px"
            flexDirection={{ base: "column", md: "row" }}
          >
            <Tab
              border="1px solid gray"
              rounded="md"
              onClick={() => handleChangeTab("CHECKIN")}
              shadow="2xl"
            >
              <Text fontSize="xl" fontWeight="bold">
                Check In
              </Text>
            </Tab>
            <Tab
              border="1px solid gray"
              rounded="md"
              onClick={() => handleChangeTab("CHECKOUT")}
            >
              <Text fontSize="xl" fontWeight="bold">
                Check Out
              </Text>
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel p="0">
              {attendanceExceptionGetListObj?.departmentId ? (
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
              ) : (
                <Stack>
                  <Box w="100%" bg="yellow.100" p="10px" mb="10px" rounded="md">
                    <Heading
                      fontSize="2xl"
                      fontWeight="medium"
                      textAlign="center"
                      lineHeight="tall"
                    >
                      <Highlight
                        query={["Department"]}
                        styles={{
                          px: "2",
                          py: "1",
                          rounded: "md",
                          bg: "white",
                          color: "black",
                          fontSize: "xl",
                        }}
                      >
                        Please at least choose your Department
                      </Highlight>{" "}
                      <Highlight
                        query={["Submit"]}
                        styles={{
                          px: "2",
                          py: "1",
                          rounded: "md",
                          bg: "#3182ce",
                          color: "white",
                          fontSize: "xl",
                        }}
                      >
                        and hit Submit to see the attendance exception
                      </Highlight>
                    </Heading>
                  </Box>
                  <Box h="500px">
                    <NoDataToDisplay />
                  </Box>
                </Stack>
              )}
            </TabPanel>
            <TabPanel p="0">
              {attendanceExceptionGetListObj?.departmentId ? (
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
              ) : (
                <Stack>
                  <Box w="100%" bg="yellow.100" p="10px" mb="10px" rounded="md">
                    <Heading
                      fontSize="2xl"
                      fontWeight="medium"
                      textAlign="center"
                      lineHeight="tall"
                    >
                      <Highlight
                        query={["Department"]}
                        styles={{
                          px: "2",
                          py: "1",
                          rounded: "md",
                          bg: "white",
                          color: "black",
                          fontSize: "xl",
                        }}
                      >
                        Please at least choose your Department
                      </Highlight>{" "}
                      <Highlight
                        query={["Submit"]}
                        styles={{
                          px: "2",
                          py: "1",
                          rounded: "md",
                          bg: "#3182ce",
                          color: "white",
                          fontSize: "xl",
                        }}
                      >
                        and hit Submit to see the attendance exception
                      </Highlight>
                    </Heading>
                  </Box>
                  <Box h="500px">
                    <NoDataToDisplay />
                  </Box>
                </Stack>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
      <Modal
        finalFocusRef={finalRef}
        isOpen={isAddEditOpen}
        onClose={onAddEditClose}
        isCentered
        size="6xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack alignItems="center">
              <Heading fontSize="2xl">Approval</Heading>
              <Heading fontSize="xl" fontWeight="medium">
                <Highlight
                  query={["Check In", "Check Out"]}
                  styles={{
                    px: "2",
                    py: "1",
                    rounded: "md",
                    bg: `${checkType == "CHECKIN" ? "green.100" : "red.100"} `,
                  }}
                >
                  {checkType == "CHECKIN" ? "Check In" : "Check Out"}
                </Highlight>
              </Heading>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Formik initialValues={initialValuesModal}>
              {(formik) => (
                <>
                  <HStack spacing="10px">
                    <VStack flex="1" alignItems="flex-start">
                      <Heading fontSize="xl" fontWeight="medium">
                        System Information
                      </Heading>
                      <HStack spacing="10px">
                        <AvatarWithPreview
                          alt="avatar-from-system"
                          src={initialValuesModal?.systemImage}
                          className="h-[300px] w-[300px] rounded-md"
                          altBoxSide="300px"
                          altRounded="5px"
                        />
                        <VStack alignItems="flex-start">
                          <Text fontSize="lg" fontWeight="medium">
                            Shift Time:
                          </Text>
                          <Text fontWeight="medium">
                            {initialValuesModal?.systemTime}
                          </Text>
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
                      <Box mt="23rem">
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
                      <HStack spacing="10px">
                        <AvatarWithPreview
                          alt="avatar-from-employee"
                          src={initialValuesModal?.employeeImage}
                          className="h-[300px] w-[300px] rounded-md"
                          altBoxSide="300px"
                          altRounded="5px"
                        />
                        <VStack alignItems="flex-start">
                          <Text fontSize="lg" fontWeight="medium">
                            Time:
                          </Text>
                          <Text fontWeight="medium">
                            {initialValuesModal?.employeeTime}
                          </Text>
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
                isDisabled={readOnlyApproval}
                onClick={handleRejectApproval}
              >
                <Text fontWeight="bold">Reject</Text>
              </Button>
              <Button
                borderWidth="2px"
                colorScheme="green"
                variant="outline"
                isDisabled={readOnlyApproval}
                onClick={handleApproveApproval}
              >
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
