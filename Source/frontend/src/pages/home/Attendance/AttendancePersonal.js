import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Heading,
  Stack,
  Avatar,
  Text,
  HStack,
  VStack,
  Icon,
  Center,
  SimpleGrid,
  Badge,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Highlight,
  Button,
  useToast,
} from "@chakra-ui/react";
import FormTextField from "../../../components/field/FormTextField";
import { Formik } from "formik";
import { AiFillCheckCircle, AiFillClockCircle } from "react-icons/ai";
import { MdWorkHistory, MdTimerOff } from "react-icons/md";
import { BiTimer } from "react-icons/bi";
import AvatarWithPreview from "../../../components/AvatarWithPreview";
import { FaEquals } from "react-icons/fa";
import { RiUserVoiceFill } from "react-icons/ri";
import { attendanceService } from "../../../services/attendance/attendance";
import { Helper } from "../../../Utils/Helper";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { useMutation, useQuery, useQueryClient } from "react-query";
import moment from "moment";
import { employeeService } from "../../../services/employee/employee";
import { useGetListDepartment } from "../../../services/organization/department";
import * as Yup from "yup";
import NoDataToDisplay from "../../../components/NoDataToDisplay";
function AttendancePersonal() {
  // #region declare variable
  const formikRef = useRef();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [userInfo, setUserInfo] = useState(Helper.getUseDecodeInfor());
  const [userId, setUserId] = useState(Helper.getUseDecodeInfor().id);
  const [currentTab, setCurrentTab] = useState("personal");

  const [attendanceDetailObj, setAttendanceDetailObj] = useState({});
  const [departmentId, setDepartmentId] = useState(
    Helper.getUseDecodeInfor().departmentId ?? ""
  );
  const [listDepartmentArray, setListDepartmentArray] = useState([]);
  const [enableGetListEmployee, setEnableGetListEmployee] = useState(false);
  const [listEmployeeDataSelection, setListEmployeeDataSelection] = useState(
    []
  );
  const [employeeFilterId, setEmployeeFilterId] = useState("");
  const [monthPersonal, setMonthPersonal] = useState(new Date().getMonth() + 1);
  const [yearPersonal, setYearPersonal] = useState(new Date().getFullYear());
  const [monthManagement, setMonthManagement] = useState(
    new Date().getMonth() + 1
  );
  const [yearManagement, setYearManagement] = useState(
    new Date().getFullYear()
  );
  const [isValid, setIsValid] = useState(true);
  const [isValidPersonal, setIsValidPersonal] = useState(true);
  const [reportInvalidId, setReportInvalidId] = useState();

  useEffect(() => {
    if (userInfo.roleName == "employee") {
      setEmployeeFilterId(userInfo.id);
    }
  }, []);
  useEffect(() => {
    if (departmentId) {
      setEnableGetListEmployee(true);
    }
  }, [departmentId]);

  // #endregion
  // #region hooks
  const {
    isOpen: isOpenAttendanceDetailModal,
    onOpen: onOpenAttendanceDetailModal,
    onClose: onCloseAttendanceDetailModal,
  } = useDisclosure();
  const {
    isOpen: isOpenReportInvalidModal,
    onOpen: onOpenReportInvalidModal,
    onClose: onCloseReportInvalidModal,
  } = useDisclosure();
  const {
    data: employeeData,
    isLoading: isLoadingEmployeeData,
    isFetching: isFetchingEmployeeData,
  } = attendanceService.useGetEmployeeDetailById(userId);
  const {
    data: attendanceHistoryData,
    isFetching: isFetchingHistoryData,
    isLoading: isLoadingHistoryData,
    refetch: refetchAttendanceHistoryData,
  } = attendanceService.useGetAttendanceHistory({
    month: monthPersonal,
    year: yearPersonal,
    id: userId,
    isValid: isValidPersonal,
  });
  const { data: attendanceMonthData, isFetching: isFetchingMonthData } =
    attendanceService.useGetThisMonthAttendance(userId);
  const { data: attendanceTodayData, isFetching: isFetchingTodayData } =
    attendanceService.useGetTodayAttendance(userId);
  const useGetAttendanceDetail = useMutation(
    attendanceService.getAttendanceDetail,
    {
      onSuccess: (data) => {
        setAttendanceDetailObj(data);
      },
    }
  );

  const useReportInvalid = useMutation(attendanceService.validateAttendance, {
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
        if (currentTab == "management") {
          queryClient.invalidateQueries([
            "attendanceHistoryData",
            employeeFilterId,
          ]);
          queryClient.invalidateQueries([
            "thisMonthAttendanceData",
            employeeFilterId,
          ]);
        } else {
          queryClient.invalidateQueries(["attendanceHistoryData", userId]);
          queryClient.invalidateQueries(["thisMonthAttendanceData", userId]);
        }
        toast({
          title: "Report Invalid Attendance Successfully",
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
  const {
    data: employeeFilterData,
    isFetching: isFetchingFilterEmployeeData,
    refetch: refetchEmployeeFilterData,
  } = attendanceService.useGetEmployeeDetailById(employeeFilterId);

  const {
    data: attendanceMonthFilterData,
    isFetching: isFetchingMonthFilterData,
    refetch: refetchAttendanceMonthFilterData,
  } = attendanceService.useGetThisMonthAttendance(employeeFilterId);
  const {
    data: attendanceTodayFilterData,
    isFetching: isFetchingTodayFilterData,
    refetch: refetchAttendanceTodayFilterData,
  } = attendanceService.useGetTodayAttendance(employeeFilterId);
  const {
    data: attendanceHistoryFilterData,
    isFetching: isFetchingHistoryFilterData,
    isLoading: isLoadingHistoryFilterData,
    refetch: refetchAttendanceHistoryFilterData,
  } = attendanceService.useGetAttendanceHistory({
    month: monthManagement,
    year: yearManagement,
    id: employeeFilterId,
    isValid: isValid,
  });
  const { data: listDepartmentData, isLoading: isLoadingListDepartment } =
    useGetListDepartment();
  const useGetListEmployeeOfDepartment = (departmentId, isEnable = false) => {
    return useQuery(
      ["listEmployeeOfDepartment", departmentId],
      () => employeeService.getListEmployeeOfDepartment({ departmentId }),
      {
        refetchOnWindowFocus: false,
        retry: 1,
        enabled: isEnable,
      }
    );
  };
  const { data: listEmployeeOfDepartment, isLoading: isLoadingListEmployee } =
    useGetListEmployeeOfDepartment(departmentId, enableGetListEmployee);
  // #endregion
  // #region functions
  const handleOpenAttendanceDetail = (attendanceId) => {
    useGetAttendanceDetail.mutate(attendanceId);
    onOpenAttendanceDetailModal();
  };
  const handleOnClickReportInvalid = (id) => {
    onOpenReportInvalidModal();
    setReportInvalidId(id);
  };
  const selectionHandleOnChange = (value) => {
    setEmployeeFilterId(value);
  };
  function handleChangeTab(value) {
    setCurrentTab(value);
  }
  function refreshAttendanceManagement() {
    refetchAttendanceHistoryFilterData();
    refetchAttendanceMonthFilterData();
    refetchAttendanceTodayFilterData();
    refetchEmployeeFilterData();
  }
  useEffect(() => {
    if (employeeFilterId) {
      refreshAttendanceManagement();
    }
  }, [employeeFilterId]);
  useEffect(() => {
    setListDepartmentArray(
      Helper.convertToArraySelection(
        listDepartmentData?.result?.data,
        "departmentName",
        "departmentId"
      )
    );
  }, [listDepartmentData]);
  useEffect(() => {
    setListEmployeeDataSelection(
      Helper.convertToArraySelection(
        listEmployeeOfDepartment?.result?.data,
        "fullname",
        "id"
      )
    );
  }, [listEmployeeOfDepartment]);

  // #endregion
  // #region table
  // #endregion
  // #region drawer
  // #endregion
  // #region form
  const initialValuesOfEmployeeFilter = {
    employeeFilter: "",
  };
  const initialValuesSelectDepartment = {
    department: departmentId,
  };
  const initialValuesReportInvalid = {
    note: "",
  };
  const initialValuesForDateFilterSelection = {
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  };
  const validationSchemaForDateFilterSelection = Yup.object().shape({
    month: Yup.number()
      .moreThan(0, "Invalid value")
      .lessThan(13, "Invalid value")
      .required("This field is required"),
    year: Yup.number()
      .moreThan(0, "Invalid value")
      .required("This field is required"),
  });
  useEffect(() => {
    refetchAttendanceHistoryData();
  }, [monthPersonal, yearPersonal, isValidPersonal]);
  useEffect(() => {
    refetchAttendanceHistoryFilterData();
  }, [monthManagement, yearManagement, isValid]);
  useEffect(() => {
    setIsValid(true);
    setIsValidPersonal(true);
  }, [currentTab]);
  // #endregion
  return (
    <>
      <Tabs
        variant="soft-rounded"
        colorScheme={`${currentTab == "personal" ? "green" : "blue"}`}
      >
        <TabList ml="12px">
          <Tab
            fontSize="2xl"
            fontWeight="bold"
            border="1px solid gray"
            onClick={() => {
              handleChangeTab("personal");
            }}
          >
            Personal
          </Tab>
          {userInfo.roleName != "employee" && (
            <Tab
              fontSize="2xl"
              fontWeight="bold"
              border="1px solid gray"
              onClick={() => {
                handleChangeTab("management");
              }}
            >
              Management
            </Tab>
          )}
        </TabList>
        <TabPanels>
          <TabPanel>
            {isLoadingHistoryData ||
            isFetchingMonthData ||
            isFetchingTodayData ||
            isFetchingEmployeeData ? (
              <Box w="100%" h="500px">
                <LoadingSpinner />
              </Box>
            ) : (
              <Stack spacing={5} h="100%">
                <VStack
                  paddingX={5}
                  paddingY={4}
                  bg="#ffffffdb"
                  rounded="xl"
                  alignItems="start"
                  spacing="15px"
                  shadow="2xl"
                >
                  <Flex gap="10px">
                    <Box w="10px" bg="blue.700" borderRadius="5px"></Box>
                    <Heading fontSize="2rem" fontWeight="medium">
                      Detail Employee
                    </Heading>
                  </Flex>
                  <HStack
                    w="100%"
                    justifyContent="start"
                    spacing="30px"
                    gap={{
                      base: "5px",
                      md: "30px",
                    }}
                    flexDirection={{
                      base: "column",
                      md: "row",
                    }}
                  >
                    <Avatar boxSize="120px" src={employeeData?.image} />
                    <VStack
                      ml="0 !important"
                      w="100%"
                      alignItems={{
                        base: "center",
                        md: "start",
                      }}
                    >
                      <Heading fontSize="1.7rem">
                        {employeeData?.fullname}
                      </Heading>
                      <HStack
                        w="100%"
                        spacing="3rem"
                        flexDirection={{
                          base: "column",
                          md: "row",
                        }}
                        gap={{
                          base: "5px",
                          md: "30px",
                        }}
                      >
                        <Flex
                          alignItems={{
                            base: "center",
                            md: "start",
                          }}
                          flexDirection="column"
                        >
                          <Text fontSize="1.2rem">Role</Text>
                          <Heading fontWeight="medium" fontSize="2xl">
                            {employeeData?.role?.displayName}
                          </Heading>
                        </Flex>
                        <Flex
                          alignItems={{
                            base: "center",
                            md: "start",
                          }}
                          flexDirection="column"
                          ml="0 !important"
                        >
                          <Text fontSize="1.2rem">Phone Number</Text>
                          <Heading fontWeight="medium" fontSize="2xl">
                            {employeeData?.phoneNumber}
                          </Heading>
                        </Flex>
                        <Flex
                          alignItems={{
                            base: "center",
                            md: "start",
                          }}
                          flexDirection="column"
                          ml="0 !important"
                        >
                          <Text fontSize="1.2rem">Email Address</Text>
                          <Heading fontWeight="medium" fontSize="2xl">
                            {employeeData?.email}
                          </Heading>
                        </Flex>
                      </HStack>
                    </VStack>
                  </HStack>
                </VStack>
                <VStack
                  paddingX={5}
                  paddingY={4}
                  bg="#ffffffdb"
                  rounded="xl"
                  alignItems="start"
                  justifyContent="center"
                  spacing="15px"
                  shadow="2xl"
                >
                  <Flex gap="10px">
                    <Box w="10px" bg="blue.700" borderRadius="5px"></Box>
                    <Heading fontWeight="medium" fontSize="2rem">
                      This Month Attendance Detail
                    </Heading>
                  </Flex>
                  <SimpleGrid
                    w="100%"
                    spacing={4}
                    gridTemplateColumns="repeat(auto-fit, minmax(240px,1fr))"
                  >
                    <HStack bg="cyan.500" rounded="xl" p="15px" shadow="lg">
                      <Center bg="cyan.300" rounded="50%" boxSize="3rem">
                        <Icon
                          color="white"
                          boxSize="30px"
                          as={AiFillCheckCircle}
                        />
                      </Center>
                      <Box color="white">
                        <Heading fontSize="2xl">
                          {attendanceMonthData?.totalAttendance}
                        </Heading>
                        <Text fontSize="xl">Total Attendance</Text>
                      </Box>
                    </HStack>
                    <HStack bg="teal.500" rounded="xl" p="15px" shadow="lg">
                      <Center bg="teal.300" rounded="50%" boxSize="3rem">
                        <Icon
                          color="white"
                          boxSize="30px"
                          as={RiUserVoiceFill}
                        />
                      </Center>
                      <Box color="white">
                        <Heading fontSize="2xl">
                          {attendanceMonthData?.totalLeaveDays}
                        </Heading>
                        <Text fontSize="xl">Total Leave Days</Text>
                      </Box>
                    </HStack>
                    <HStack bg="blue.500" rounded="xl" p="15px" shadow="lg">
                      <Center bg="blue.300" rounded="50%" boxSize="3rem">
                        <Icon color="white" boxSize="30px" as={MdWorkHistory} />
                      </Center>
                      <Box color="white">
                        <Heading fontSize="2xl">
                          {attendanceMonthData?.totalWorkingHours == "00:00"
                            ? "--:--"
                            : attendanceMonthData?.totalWorkingHours}
                        </Heading>
                        <Text fontSize="xl">Total Working Hours</Text>
                      </Box>
                    </HStack>

                    <HStack bg="yellow.500" rounded="xl" p="15px" shadow="lg">
                      <Center bg="yellow.300" rounded="50%" boxSize="3rem">
                        <Icon color="white" boxSize="30px" as={MdTimerOff} />
                      </Center>
                      <Box color="white">
                        <Heading fontSize="2xl">
                          {attendanceMonthData?.totalLateArrival == "00:00"
                            ? "--:--"
                            : attendanceMonthData?.totalLateArrival}
                        </Heading>
                        <Text fontSize="xl">Total Late Arrival</Text>
                      </Box>
                    </HStack>
                    <HStack bg="orange.500" rounded="xl" p="15px" shadow="lg">
                      <Center bg="orange.300" rounded="50%" boxSize="3rem">
                        <Icon color="white" boxSize="30px" as={BiTimer} />
                      </Center>
                      <Box color="white">
                        <Heading fontSize="2xl">
                          {attendanceMonthData?.totalEarlyLeave == "00:00"
                            ? "--:--"
                            : attendanceMonthData?.totalEarlyLeave}
                        </Heading>
                        <Text fontSize="xl">Total Early Leave</Text>
                      </Box>
                    </HStack>
                  </SimpleGrid>
                </VStack>
                <VStack
                  paddingX={5}
                  paddingY={4}
                  bg="#ffffffdb"
                  rounded="xl"
                  alignItems="start"
                  justifyContent="center"
                  spacing="15px"
                  shadow="2xl"
                >
                  <Flex gap="10px">
                    <Box w="10px" bg="blue.700" borderRadius="5px"></Box>
                    <Heading fontWeight="medium" fontSize="2rem">
                      Today Attendance
                    </Heading>
                  </Flex>
                  <SimpleGrid
                    w="100%"
                    spacing={4}
                    gridTemplateColumns="repeat(auto-fit, minmax(100px,1fr))"
                    justifyContent="space-around"
                  >
                    <Box
                      bg="blue.500"
                      color="white"
                      p={5}
                      rounded="md"
                      fontSize="xl"
                      flex="1"
                    >
                      <Text fontWeight="bold">
                        {Helper.convertDateISOToHHmm(
                          attendanceTodayData?.totalHours
                        )}
                      </Text>
                      <Text fontWeight="medium">Working Hours</Text>
                    </Box>
                    <Box
                      bg="green.500"
                      color="white"
                      p={5}
                      rounded="md"
                      fontSize="xl"
                      flex="1"
                    >
                      <Text fontWeight="bold">
                        {Helper.convertDateISOToHHmm(
                          attendanceTodayData?.checkIn
                        )}
                      </Text>
                      <Text fontWeight="medium">Check In</Text>
                    </Box>
                    <Box
                      bg="purple.500"
                      color="white"
                      p={5}
                      rounded="md"
                      fontSize="xl"
                      flex="1"
                    >
                      <Text fontWeight="bold">
                        {Helper.convertDateISOToHHmm(
                          attendanceTodayData?.checkOut
                        )}
                      </Text>
                      <Text fontWeight="medium">Check Out</Text>
                    </Box>

                    <Box
                      bg="yellow.500"
                      color="white"
                      p={5}
                      rounded="md"
                      fontSize="xl"
                      flex="1"
                    >
                      <Text fontWeight="bold">
                        {Helper.convertDateISOToHHmm(
                          attendanceTodayData?.lateArrival
                        )}
                      </Text>
                      <Text fontWeight="medium">Late Arrival</Text>
                    </Box>

                    <Box
                      bg="orange.500"
                      color="white"
                      p={5}
                      rounded="md"
                      fontSize="xl"
                      flex="1"
                    >
                      <Text fontWeight="bold">
                        {Helper.convertDateISOToHHmm(
                          attendanceTodayData?.earlyLeave
                        )}
                      </Text>
                      <Text fontWeight="medium">Early Leave</Text>
                    </Box>
                  </SimpleGrid>
                </VStack>
                <VStack
                  paddingX={5}
                  paddingY={4}
                  bg="#ffffffdb"
                  rounded="xl"
                  alignItems="start"
                  spacing="15px"
                  shadow="2xl"
                >
                  <Flex
                    gap="10px"
                    w="100%"
                    flexDirection={{ base: "column", md: "row" }}
                  >
                    <Flex gap="10px">
                      <Box w="10px" bg="blue.700" borderRadius="5px"></Box>
                      <Heading fontWeight="medium" fontSize="2rem">
                        Attendance History
                      </Heading>
                    </Flex>
                  </Flex>
                  <HStack
                    display="flex"
                    flexDirection={{ base: "column", sm: "row" }}
                    alignItems={{ base: "baseline", sm: "center" }}
                  >
                    <Heading fontSize="xl" fontWeight="medium" mb="6px">
                      <Highlight
                        query={["Type Filter:"]}
                        styles={{
                          px: "2",
                          py: "1",
                          rounded: "full",
                          bg: "purple.100",
                        }}
                      >
                        Type Filter:
                      </Highlight>
                    </Heading>
                    <Box>
                      <Button
                        isLoading={isFetchingHistoryData ? true : false}
                        onClick={() => {
                          setIsValidPersonal(true);
                        }}
                        colorScheme={isValidPersonal ? "blue" : "gray"}
                      >
                        Valid
                      </Button>
                    </Box>
                    <Box>
                      <Button
                        isLoading={isFetchingHistoryData ? true : false}
                        onClick={() => {
                          setIsValidPersonal(false);
                        }}
                        colorScheme={!isValidPersonal ? "blue" : "gray"}
                      >
                        Invalid
                      </Button>
                    </Box>
                  </HStack>
                  <HStack
                    w="fit-content"
                    flexDir={{ base: "column", md: "row" }}
                    alignItems={{ base: "baseline", md: "flex-end" }}
                  >
                    <Heading fontSize="xl" fontWeight="medium" mb="6px">
                      <Highlight
                        query={["Date Filter:"]}
                        styles={{
                          px: "2",
                          py: "1",
                          rounded: "full",
                          bg: "purple.100",
                        }}
                      >
                        Date Filter:
                      </Highlight>
                    </Heading>
                    <Formik
                      initialValues={initialValuesForDateFilterSelection}
                      validationSchema={validationSchemaForDateFilterSelection}
                      onSubmit={(values, action) => {
                        setMonthPersonal(values.month);
                        setYearPersonal(values.year);
                      }}
                    >
                      {(formik) => (
                        <Stack
                          flexDirection={{ base: "column", md: "row" }}
                          alignItems={{ base: "baseline", md: "flex-end" }}
                          gap="5px"
                        >
                          <Flex gap="5px">
                            <Box w="100px">
                              <FormTextField
                                label="Month"
                                name="month"
                                type="number"
                              />
                            </Box>
                            <Box w="100px">
                              <FormTextField
                                label="Year"
                                name="year"
                                type="number"
                              />
                            </Box>
                          </Flex>
                          <Button
                            onClick={formik.handleSubmit}
                            colorScheme="blue"
                          >
                            Submit
                          </Button>
                        </Stack>
                      )}
                    </Formik>
                  </HStack>
                  {isFetchingHistoryData ? (
                    <Box h="100px" w="100%">
                      <LoadingSpinner />
                    </Box>
                  ) : (
                    <SimpleGrid
                      w="100%"
                      spacing={3}
                      gridTemplateColumns="repeat(auto-fit, minmax(285px,1fr))"
                    >
                      {attendanceHistoryData &&
                        attendanceHistoryData.map((item, index) => {
                          return (
                            <VStack
                              color="white"
                              alignItems="start"
                              bg="gray.500"
                              rounded="xl"
                              p="20px"
                              key={index}
                              shadow="lg"
                              onClick={() =>
                                handleOpenAttendanceDetail(item.attendanceId)
                              }
                              cursor="pointer"
                            >
                              <HStack w="100%">
                                <HStack w="100%" flex="1" spacing="5px">
                                  <Icon as={AiFillClockCircle} />
                                  <Text fontSize="xl" fontWeight="bold">
                                    {Helper.convertDateISOToDDMMyyyy(
                                      item?.attendanceDate
                                    )}
                                  </Text>
                                </HStack>
                                {!item?.earlyLeave &&
                                  !item?.lateArrival &&
                                  !item?.absent && (
                                    <Badge
                                      rounded="md"
                                      colorScheme="green"
                                      fontSize="md"
                                      p="5px"
                                    >
                                      O.T
                                    </Badge>
                                  )}
                                {item?.lateArrival && !item?.absent && (
                                  <Badge
                                    rounded="md"
                                    colorScheme="yellow"
                                    fontSize="md"
                                    p="5px"
                                  >
                                    L.A
                                  </Badge>
                                )}
                                {item?.absent && (
                                  <Badge
                                    rounded="md"
                                    colorScheme="teal"
                                    fontSize="md"
                                    p="5px"
                                  >
                                    L.D
                                  </Badge>
                                )}
                                {item?.earlyLeave && !item?.absent && (
                                  <Badge
                                    rounded="md"
                                    colorScheme="orange"
                                    fontSize="md"
                                    p="5px"
                                  >
                                    E.L
                                  </Badge>
                                )}
                              </HStack>
                              <HStack w="100%" spacing="50px">
                                <VStack alignItems="start">
                                  <Text fontSize="xl">Check in</Text>
                                  <Text fontSize="2xl" fontWeight="bold">
                                    {Helper.convertDateISOToHHmm(item?.checkIn)}
                                  </Text>
                                </VStack>
                                <VStack alignItems="start">
                                  <Text fontSize="xl">Check out</Text>
                                  <Text fontSize="2xl" fontWeight="bold">
                                    {Helper.convertDateISOToHHmm(
                                      item?.checkOut
                                    )}
                                  </Text>
                                </VStack>
                              </HStack>
                            </VStack>
                          );
                        })}
                    </SimpleGrid>
                  )}
                </VStack>
              </Stack>
            )}
          </TabPanel>
          <TabPanel>
            <Stack spacing={5} h="100%">
              <HStack
                gap="10px"
                flexDirection={{ base: "column", lg: "row" }}
                alignItems={{ base: "baseline", lg: "center" }}
                bg="white"
                rounded="md"
                p={2}
                shadow="2xl"
                w={{ base: "100%", md: "fit-content" }}
              >
                <HStack
                  gap="10px"
                  flexDir={{ base: "column", md: "row" }}
                  alignItems={{ base: "baseline", md: "center" }}
                >
                  <Heading fontSize="xl" fontWeight="medium">
                    <Highlight
                      query={["Department:"]}
                      styles={{
                        px: "2",
                        py: "1",
                        rounded: "full",
                        bg: "purple.100",
                      }}
                    >
                      Department:
                    </Highlight>
                  </Heading>
                  <Formik
                    initialValues={initialValuesSelectDepartment}
                    onSubmit={(values, actions) => {
                      const departmentId = values.department;
                      setDepartmentId(departmentId);
                      setEmployeeFilterId("");
                      formikRef.current?.resetForm();
                    }}
                  >
                    {(formik) => (
                      <HStack
                        as="form"
                        onSubmit={formik.handleSubmit}
                        gap="5px"
                        flexDir={{ base: "column", sm: "row" }}
                        alignItems={{ base: "baseline", sm: "center" }}
                      >
                        <Box w="200px">
                          <FormTextField
                            name="department"
                            placeholder="---"
                            isReadOnly={
                              userInfo?.roleName == "employee" ||
                              userInfo?.roleName == "manager"
                            }
                            isSelectionField={true}
                            selectionArray={
                              listDepartmentArray
                                ? [...listDepartmentArray]
                                : []
                            }
                          />
                        </Box>
                        {userInfo?.roleName != "employee" &&
                          userInfo?.roleName != "manager" && (
                            <div>
                              <Button
                                colorScheme="blue"
                                type="submit"
                                size="md"
                              >
                                Submit
                              </Button>
                            </div>
                          )}
                      </HStack>
                    )}
                  </Formik>
                </HStack>
                {userInfo.roleName != "employee" && departmentId && (
                  <HStack
                    w="fit-content"
                    gap="10px"
                    flexDir={{ base: "column", md: "row" }}
                    alignItems={{ base: "baseline", md: "center" }}
                  >
                    <Heading fontSize="xl" fontWeight="medium">
                      <Highlight
                        query={["Employee Filter:"]}
                        styles={{
                          px: "2",
                          py: "1",
                          rounded: "full",
                          bg: "purple.100",
                        }}
                      >
                        Employee Filter:
                      </Highlight>
                    </Heading>
                    <Formik
                      initialValues={initialValuesOfEmployeeFilter}
                      innerRef={formikRef}
                    >
                      {(formik) => (
                        <Box w="200px">
                          <FormTextField
                            name="employeeFilter"
                            isSelectionField={true}
                            selectionArray={listEmployeeDataSelection}
                            placeholder="---"
                            handleOnChange={selectionHandleOnChange}
                          />
                        </Box>
                      )}
                    </Formik>
                  </HStack>
                )}
              </HStack>
              {!employeeFilterId && (
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
                          rounded: "2xl",
                          bg: "purple.100",
                          color: "black",
                          fontSize: "xl",
                        }}
                      >
                        Please at least choose your Department
                      </Highlight>{" "}
                      <Highlight
                        query={["Employee"]}
                        styles={{
                          px: "2",
                          py: "1",
                          rounded: "2xl",
                          bg: "purple.100",
                          color: "black",
                          fontSize: "xl",
                        }}
                      >
                        and Employee to see the information
                      </Highlight>
                    </Heading>
                  </Box>
                  <Box h="500px">
                    <NoDataToDisplay />
                  </Box>
                </Stack>
              )}
              {employeeFilterId && (
                <>
                  {isFetchingFilterEmployeeData ||
                  isLoadingHistoryFilterData ||
                  isFetchingTodayFilterData ||
                  isFetchingMonthFilterData ? (
                    <Box w="100%" h="500px">
                      <LoadingSpinner />
                    </Box>
                  ) : (
                    <>
                      <VStack
                        paddingX={5}
                        paddingY={4}
                        bg="#ffffffdb"
                        rounded="xl"
                        alignItems="start"
                        spacing="15px"
                        shadow="2xl"
                      >
                        <Flex gap="10px">
                          <Box w="10px" bg="blue.700" borderRadius="5px"></Box>
                          <Heading fontSize="2rem" fontWeight="medium">
                            Detail Employee
                          </Heading>
                        </Flex>
                        <HStack
                          w="100%"
                          justifyContent="start"
                          spacing="30px"
                          gap={{
                            base: "5px",
                            md: "30px",
                          }}
                          flexDirection={{
                            base: "column",
                            md: "row",
                          }}
                        >
                          <Avatar
                            boxSize="120px"
                            src={employeeFilterData?.image}
                          />
                          <VStack
                            ml="0 !important"
                            w="100%"
                            alignItems={{
                              base: "center",
                              md: "start",
                            }}
                          >
                            <Heading fontSize="1.7rem">
                              {employeeFilterData?.fullname}
                            </Heading>
                            <HStack
                              w="100%"
                              spacing="3rem"
                              flexDirection={{
                                base: "column",
                                md: "row",
                              }}
                              gap={{
                                base: "5px",
                                md: "30px",
                              }}
                            >
                              <Flex
                                alignItems={{
                                  base: "center",
                                  md: "start",
                                }}
                                flexDirection="column"
                              >
                                <Text fontSize="1.2rem">Role</Text>
                                <Heading fontWeight="medium" fontSize="2xl">
                                  {employeeFilterData?.role?.displayName}
                                </Heading>
                              </Flex>
                              <Flex
                                alignItems={{
                                  base: "center",
                                  md: "start",
                                }}
                                flexDirection="column"
                                ml="0 !important"
                              >
                                <Text fontSize="1.2rem">Phone Number</Text>
                                <Heading fontWeight="medium" fontSize="2xl">
                                  {employeeFilterData?.phoneNumber}
                                </Heading>
                              </Flex>
                              <Flex
                                alignItems={{
                                  base: "center",
                                  md: "start",
                                }}
                                flexDirection="column"
                                ml="0 !important"
                              >
                                <Text fontSize="1.2rem">Email Address</Text>
                                <Heading fontWeight="medium" fontSize="2xl">
                                  {employeeFilterData?.email}
                                </Heading>
                              </Flex>
                            </HStack>
                          </VStack>
                        </HStack>
                      </VStack>
                      <VStack
                        paddingX={5}
                        paddingY={4}
                        bg="#ffffffdb"
                        rounded="xl"
                        alignItems="start"
                        justifyContent="center"
                        spacing="15px"
                        shadow="2xl"
                      >
                        <Flex gap="10px">
                          <Box w="10px" bg="blue.700" borderRadius="5px"></Box>
                          <Heading fontWeight="medium" fontSize="2rem">
                            This Month Attendance Detail
                          </Heading>
                        </Flex>
                        <SimpleGrid
                          w="100%"
                          spacing={4}
                          gridTemplateColumns="repeat(auto-fit, minmax(240px,1fr))"
                        >
                          <HStack
                            bg="cyan.500"
                            rounded="xl"
                            p="15px"
                            shadow="lg"
                          >
                            <Center bg="cyan.300" rounded="50%" boxSize="3rem">
                              <Icon
                                color="white"
                                boxSize="30px"
                                as={AiFillCheckCircle}
                              />
                            </Center>
                            <Box color="white">
                              <Heading fontSize="2xl">
                                {attendanceMonthFilterData?.totalAttendance}
                              </Heading>
                              <Text fontSize="xl">Total Attendance</Text>
                            </Box>
                          </HStack>
                          <HStack
                            bg="teal.500"
                            rounded="xl"
                            p="15px"
                            shadow="lg"
                          >
                            <Center bg="teal.300" rounded="50%" boxSize="3rem">
                              <Icon
                                color="white"
                                boxSize="30px"
                                as={RiUserVoiceFill}
                              />
                            </Center>
                            <Box color="white">
                              <Heading fontSize="2xl">
                                {attendanceMonthFilterData?.totalLeaveDays}
                              </Heading>
                              <Text fontSize="xl">Total Leave Days</Text>
                            </Box>
                          </HStack>
                          <HStack
                            bg="blue.500"
                            rounded="xl"
                            p="15px"
                            shadow="lg"
                          >
                            <Center bg="blue.300" rounded="50%" boxSize="3rem">
                              <Icon
                                color="white"
                                boxSize="30px"
                                as={MdWorkHistory}
                              />
                            </Center>
                            <Box color="white">
                              <Heading fontSize="2xl">
                                {attendanceMonthFilterData?.totalWorkingHours ==
                                "00:00"
                                  ? "--:--"
                                  : attendanceMonthFilterData?.totalWorkingHours}
                              </Heading>
                              <Text fontSize="xl">Total Working Hours</Text>
                            </Box>
                          </HStack>

                          <HStack
                            bg="yellow.500"
                            rounded="xl"
                            p="15px"
                            shadow="lg"
                          >
                            <Center
                              bg="yellow.300"
                              rounded="50%"
                              boxSize="3rem"
                            >
                              <Icon
                                color="white"
                                boxSize="30px"
                                as={MdTimerOff}
                              />
                            </Center>
                            <Box color="white">
                              <Heading fontSize="2xl">
                                {attendanceMonthFilterData?.totalLateArrival ==
                                "00:00"
                                  ? "--:--"
                                  : attendanceMonthFilterData?.totalLateArrival}
                              </Heading>
                              <Text fontSize="xl">Total Late Arrival</Text>
                            </Box>
                          </HStack>
                          <HStack
                            bg="orange.500"
                            rounded="xl"
                            p="15px"
                            shadow="lg"
                          >
                            <Center
                              bg="orange.300"
                              rounded="50%"
                              boxSize="3rem"
                            >
                              <Icon color="white" boxSize="30px" as={BiTimer} />
                            </Center>
                            <Box color="white">
                              <Heading fontSize="2xl">
                                {attendanceMonthFilterData?.totalEarlyLeave ==
                                "00:00"
                                  ? "--:--"
                                  : attendanceMonthFilterData?.totalEarlyLeave}
                              </Heading>
                              <Text fontSize="xl">Total Early Leave</Text>
                            </Box>
                          </HStack>
                        </SimpleGrid>
                      </VStack>
                      <VStack
                        paddingX={5}
                        paddingY={4}
                        bg="#ffffffdb"
                        rounded="xl"
                        alignItems="start"
                        justifyContent="center"
                        spacing="15px"
                        shadow="2xl"
                      >
                        <Flex gap="10px">
                          <Box w="10px" bg="blue.700" borderRadius="5px"></Box>
                          <Heading fontWeight="medium" fontSize="2rem">
                            Today Attendance
                          </Heading>
                        </Flex>
                        <SimpleGrid
                          w="100%"
                          spacing={4}
                          gridTemplateColumns="repeat(auto-fit, minmax(100px,1fr))"
                          justifyContent="space-around"
                        >
                          <Box
                            bg="blue.500"
                            color="white"
                            p={5}
                            rounded="md"
                            fontSize="xl"
                            flex="1"
                          >
                            <Text fontWeight="bold">
                              {Helper.convertDateISOToHHmm(
                                attendanceTodayFilterData?.totalHours
                              )}
                            </Text>
                            <Text fontWeight="medium">Working Hours</Text>
                          </Box>
                          <Box
                            bg="green.500"
                            color="white"
                            p={5}
                            rounded="md"
                            fontSize="xl"
                            flex="1"
                          >
                            <Text fontWeight="bold">
                              {Helper.convertDateISOToHHmm(
                                attendanceTodayFilterData?.checkIn
                              )}
                            </Text>
                            <Text fontWeight="medium">Check In</Text>
                          </Box>
                          <Box
                            bg="purple.500"
                            color="white"
                            p={5}
                            rounded="md"
                            fontSize="xl"
                            flex="1"
                          >
                            <Text fontWeight="bold">
                              {Helper.convertDateISOToHHmm(
                                attendanceTodayFilterData?.checkOut
                              )}
                            </Text>
                            <Text fontWeight="medium">Check Out</Text>
                          </Box>

                          <Box
                            bg="yellow.500"
                            color="white"
                            p={5}
                            rounded="md"
                            fontSize="xl"
                            flex="1"
                          >
                            <Text fontWeight="bold">
                              {Helper.convertDateISOToHHmm(
                                attendanceTodayFilterData?.lateArrival
                              )}
                            </Text>
                            <Text fontWeight="medium">Late Arrival</Text>
                          </Box>

                          <Box
                            bg="orange.500"
                            color="white"
                            p={5}
                            rounded="md"
                            fontSize="xl"
                            flex="1"
                          >
                            <Text fontWeight="bold">
                              {Helper.convertDateISOToHHmm(
                                attendanceTodayFilterData?.earlyLeave
                              )}
                            </Text>
                            <Text fontWeight="medium">Early Leave</Text>
                          </Box>
                        </SimpleGrid>
                      </VStack>
                      <VStack
                        paddingX={5}
                        paddingY={4}
                        bg="#ffffffdb"
                        rounded="xl"
                        alignItems="start"
                        spacing="15px"
                        shadow="2xl"
                      >
                        <Flex
                          gap="10px"
                          w="100%"
                          flexDirection={{ base: "column", md: "row" }}
                        >
                          <Flex gap="10px">
                            <Box
                              w="10px"
                              bg="blue.700"
                              borderRadius="5px"
                            ></Box>
                            <Heading fontWeight="medium" fontSize="2rem">
                              Attendance History
                            </Heading>
                          </Flex>
                        </Flex>
                        <HStack
                          display="flex"
                          gap="10px"
                          flexDirection={{ base: "column", sm: "row" }}
                          alignItems={{ base: "baseline", sm: "center" }}
                        >
                          <Heading fontSize="xl" fontWeight="medium" mb="6px">
                            <Highlight
                              query={["Type Filter:"]}
                              styles={{
                                px: "2",
                                py: "1",
                                rounded: "full",
                                bg: "purple.100",
                              }}
                            >
                              Type Filter:
                            </Highlight>
                          </Heading>
                          <Flex gap="5px">
                            <Box>
                              <Button
                                isLoading={
                                  isFetchingHistoryFilterData ? true : false
                                }
                                onClick={() => {
                                  setIsValid(true);
                                }}
                                colorScheme={isValid ? "blue" : "gray"}
                              >
                                Valid
                              </Button>
                            </Box>
                            <Box>
                              <Button
                                isLoading={
                                  isFetchingHistoryFilterData ? true : false
                                }
                                onClick={() => {
                                  setIsValid(false);
                                }}
                                colorScheme={!isValid ? "blue" : "gray"}
                              >
                                Invalid
                              </Button>
                            </Box>
                          </Flex>
                        </HStack>
                        <HStack
                          w="fit-content"
                          flexDir={{ base: "column", md: "row" }}
                          alignItems={{ base: "baseline", md: "flex-end" }}
                        >
                          <Heading fontSize="xl" fontWeight="medium" mb="6px">
                            <Highlight
                              query={["Date Filter:"]}
                              styles={{
                                px: "2",
                                py: "1",
                                rounded: "full",
                                bg: "purple.100",
                              }}
                            >
                              Date Filter:
                            </Highlight>
                          </Heading>
                          <Formik
                            initialValues={initialValuesForDateFilterSelection}
                            validationSchema={
                              validationSchemaForDateFilterSelection
                            }
                            onSubmit={(values, action) => {
                              setMonthManagement(values.month);
                              setYearManagement(values.year);
                            }}
                          >
                            {(formik) => (
                              <Stack
                                gap="5px"
                                flexDirection={{ base: "column", md: "row" }}
                                alignItems={{
                                  base: "baseline",
                                  md: "flex-end",
                                }}
                              >
                                <Flex gap="5px">
                                  <Box w="100px">
                                    <FormTextField
                                      label="Month"
                                      name="month"
                                      type="number"
                                    />
                                  </Box>
                                  <Box w="100px">
                                    <FormTextField
                                      label="Year"
                                      name="year"
                                      type="number"
                                    />
                                  </Box>
                                </Flex>
                                <Button
                                  onClick={formik.handleSubmit}
                                  colorScheme="blue"
                                >
                                  Submit
                                </Button>
                              </Stack>
                            )}
                          </Formik>
                        </HStack>
                        {isFetchingHistoryFilterData ? (
                          <Box w="100%" h="100px">
                            <LoadingSpinner />
                          </Box>
                        ) : (
                          <SimpleGrid
                            w="100%"
                            spacing={3}
                            gridTemplateColumns="repeat(auto-fit, minmax(285px,1fr))"
                          >
                            {attendanceHistoryFilterData &&
                              attendanceHistoryFilterData.map((item, index) => {
                                return (
                                  <VStack
                                    color="white"
                                    alignItems="start"
                                    bg="gray.500"
                                    rounded="xl"
                                    p="20px"
                                    key={index}
                                    shadow="lg"
                                    onClick={() =>
                                      handleOpenAttendanceDetail(
                                        item.attendanceId
                                      )
                                    }
                                    cursor="pointer"
                                  >
                                    <HStack w="100%">
                                      <HStack w="100%" flex="1" spacing="5px">
                                        <Icon as={AiFillClockCircle} />
                                        <Text fontSize="xl" fontWeight="bold">
                                          {Helper.convertDateISOToDDMMyyyy(
                                            item?.attendanceDate
                                          )}
                                        </Text>
                                      </HStack>
                                      {!item?.earlyLeave &&
                                        !item?.lateArrival &&
                                        !item?.absent && (
                                          <Badge
                                            rounded="md"
                                            colorScheme="green"
                                            fontSize="md"
                                            p="5px"
                                          >
                                            O.T
                                          </Badge>
                                        )}
                                      {item?.lateArrival && !item?.absent && (
                                        <Badge
                                          rounded="md"
                                          colorScheme="yellow"
                                          fontSize="md"
                                          p="5px"
                                        >
                                          L.A
                                        </Badge>
                                      )}
                                      {item?.absent && (
                                        <Badge
                                          rounded="md"
                                          colorScheme="teal"
                                          fontSize="md"
                                          p="5px"
                                        >
                                          L.D
                                        </Badge>
                                      )}
                                      {item?.earlyLeave && !item?.absent && (
                                        <Badge
                                          rounded="md"
                                          colorScheme="orange"
                                          fontSize="md"
                                          p="5px"
                                        >
                                          E.L
                                        </Badge>
                                      )}
                                    </HStack>
                                    <HStack w="100%" spacing="50px">
                                      <VStack alignItems="start">
                                        <Text fontSize="xl">Check in</Text>
                                        <Text fontSize="2xl" fontWeight="bold">
                                          {Helper.convertDateISOToHHmm(
                                            item?.checkIn
                                          )}
                                        </Text>
                                      </VStack>
                                      <VStack alignItems="start">
                                        <Text fontSize="xl">Check out</Text>
                                        <Text fontSize="2xl" fontWeight="bold">
                                          {Helper.convertDateISOToHHmm(
                                            item?.checkOut
                                          )}
                                        </Text>
                                      </VStack>
                                    </HStack>
                                  </VStack>
                                );
                              })}
                          </SimpleGrid>
                        )}
                      </VStack>
                    </>
                  )}
                </>
              )}
            </Stack>
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Modal
        isOpen={isOpenAttendanceDetailModal}
        onClose={onCloseAttendanceDetailModal}
        isCentered
        size="4xl"
      >
        <ModalOverlay />
        <ModalContent>
          {useGetAttendanceDetail.isLoading ? (
            <Box w="100%" h="546px">
              <LoadingSpinner />
            </Box>
          ) : (
            <>
              <ModalHeader>
                <Flex gap="10px" flexDirection="row">
                  <Flex gap="10px">
                    <Box w="10px" bg="blue.700" borderRadius="5px"></Box>
                    <Heading fontWeight="medium" fontSize="2rem">
                      Detail
                    </Heading>
                  </Flex>
                  <Flex gap="5px">
                    {/* {isValid && currentTab == "management" && (
                      <Badge
                        rounded="md"
                        colorScheme="blue"
                        fontSize="md"
                        p="5px"
                      >
                        Valid
                      </Badge>
                    )}
                    {!isValid && currentTab == "management" && (
                      <Badge
                        rounded="md"
                        colorScheme="red"
                        fontSize="md"
                        p="5px"
                      >
                        Invalid
                      </Badge>
                    )} */}
                    {attendanceDetailObj?.result?.absent && (
                      <Badge
                        rounded="md"
                        colorScheme="teal"
                        fontSize="md"
                        p="5px"
                      >
                        Leave Day
                      </Badge>
                    )}
                    {!attendanceDetailObj?.result?.earlyLeave &&
                      !attendanceDetailObj?.result?.lateArrival &&
                      !attendanceDetailObj?.result?.absent && (
                        <Badge
                          rounded="md"
                          colorScheme="green"
                          fontSize="md"
                          p="5px"
                        >
                          On Time
                        </Badge>
                      )}
                    {attendanceDetailObj?.result?.lateArrival &&
                      !attendanceDetailObj?.result?.absent && (
                        <Badge
                          rounded="md"
                          colorScheme="yellow"
                          fontSize="md"
                          p="5px"
                        >
                          Late Arrival
                        </Badge>
                      )}
                    {attendanceDetailObj?.result?.earlyLeave &&
                      !attendanceDetailObj?.result?.absent && (
                        <Badge
                          rounded="md"
                          colorScheme="orange"
                          fontSize="md"
                          p="5px"
                        >
                          Early Leave
                        </Badge>
                      )}
                    {currentTab == "management" && (
                      <Button
                        ml="10px"
                        colorScheme={isValid ? "red" : "teal"}
                        onClick={() => {
                          handleOnClickReportInvalid(
                            attendanceDetailObj.result?.attendanceId
                          );
                        }}
                      >
                        {isValid ? "Report Invalid" : "Convert To Valid"}
                      </Button>
                    )}
                  </Flex>
                </Flex>
                <Flex margin="20px 0px 0px 0px">
                  <Text fontSize="1.15rem" fontWeight="semibold" color={"red"}>
                    Note:{" "}
                    <b style={{ fontWeight: "normal", color: "black" }}>
                      {attendanceDetailObj?.result?.note}
                    </b>
                  </Text>
                </Flex>
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <HStack w="100%" spacing="20px">
                  <VStack alignItems="center" flex="1">
                    <Box
                      w="100%"
                      ml="7rem"
                      flex="1"
                      fontSize="1.2rem"
                      fontWeight="medium"
                    >
                      <Flex alignItems="center" gap="5px">
                        <AiFillClockCircle />
                        <Text>
                          {Helper.convertDateISOToDDMMyyyy(
                            attendanceDetailObj?.result?.attendanceDate
                          )}
                        </Text>
                      </Flex>
                      <Text>Date</Text>
                    </Box>
                    <VStack alignItems="center">
                      <AvatarWithPreview
                        className="h-[300px] w-[300px] rounded-md"
                        src={attendanceDetailObj?.result?.checkinCapture}
                        alt="Check In Image"
                        altBoxSide="300px"
                        altRounded="5px"
                      />
                      <Box fontSize="1.1rem" fontWeight="medium">
                        <Text color="green.600">
                          Check In:
                          {Helper.convertDateISOToHHmm(
                            attendanceDetailObj?.result?.checkIn
                          )}
                        </Text>
                        <Text color="orange.400">
                          Late Arrival:{" "}
                          {Helper.convertDateISOToHHmm(
                            attendanceDetailObj?.result?.lateArrival
                          )}
                        </Text>
                      </Box>
                    </VStack>
                  </VStack>
                  <VStack alignItems="center" flex="1">
                    <Box
                      w="100%"
                      ml="7rem"
                      flex="1"
                      fontSize="1.2rem"
                      fontWeight="medium"
                    >
                      <Flex gap="5px" alignItems="center">
                        <MdWorkHistory />
                        <Text>
                          {Helper.convertDateISOToHHmm(
                            attendanceDetailObj?.result?.totalHours
                          )}
                        </Text>
                      </Flex>
                      <Text>Total working hours</Text>
                    </Box>
                    <VStack alignItems="center">
                      <AvatarWithPreview
                        className="h-[300px] w-[300px] rounded-md"
                        src={attendanceDetailObj?.result?.checkoutCapture}
                        alt="Check Out Image"
                        altBoxSide="300px"
                        altRounded="5px"
                      />
                      <Box fontSize="1.1rem" fontWeight="medium">
                        <Text color="pink.600">
                          Check Out:{" "}
                          {Helper.convertDateISOToHHmm(
                            attendanceDetailObj?.result?.checkOut
                          )}
                        </Text>
                        <Text color="orange.400">
                          Early Leave:{" "}
                          {Helper.convertDateISOToHHmm(
                            attendanceDetailObj?.result?.earlyLeave
                          )}
                        </Text>
                      </Box>
                    </VStack>
                  </VStack>
                </HStack>
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isOpenReportInvalidModal}
        onClose={onCloseReportInvalidModal}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {isValid
              ? "Report Invalid Attendance"
              : "Convert To Valid Attendance"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Formik
              initialValues={initialValuesReportInvalid}
              onSubmit={(values, actions) => {
                let reportInvalidObj = {
                  id: reportInvalidId,
                  isValid: !isValid,
                  note: values.note,
                };
                useReportInvalid.mutate(reportInvalidObj);
                onCloseReportInvalidModal();
                onCloseAttendanceDetailModal();
                setReportInvalidId();
                actions.reset();
              }}
            >
              {(formik) => (
                <Stack>
                  <FormTextField
                    label="Note"
                    name="note"
                    isTextAreaField={true}
                  />
                  <Button onClick={formik.handleSubmit} colorScheme="blue">
                    Submit
                  </Button>
                </Stack>
              )}
            </Formik>
          </ModalBody>

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default AttendancePersonal;
