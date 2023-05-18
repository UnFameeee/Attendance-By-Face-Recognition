import React, { useState } from "react";
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
} from "@chakra-ui/react";
import { AiFillCheckCircle, AiFillClockCircle } from "react-icons/ai";
import { MdWorkHistory, MdTimerOff } from "react-icons/md";
import { BiTimer } from "react-icons/bi";
import AvatarWithPreview from "../../../components/AvatarWithPreview";
import { FaEquals } from "react-icons/fa";
import { TbArrowsRight } from "react-icons/tb";
import { attendanceService } from "../../../services/attendance/attendance";
import { Helper } from "../../../Utils/Helper";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { useMutation } from "react-query";
import moment from "moment";
function AttendancePersonal() {
  // #region declare variable
  const [currentDate, setCurrentDate] = useState(new Date().toISOString());
  const [userInfo, setUserInfo] = useState(Helper.getUseDecodeInfor());
  const [attendanceDetailObj, setAttendanceDetailObj] = useState({});

  // #endregion
  // #region hooks
  const {
    isOpen: isOpenAttendanceDetailModal,
    onOpen: onOpenAttendanceDetailModal,
    onClose: onCloseAttendanceDetailModal,
  } = useDisclosure();
  const { data: employeeData, isFetching: isFetchingEmployeeData } =
    attendanceService.useGetEmployeeDetailById(userInfo.id);
  const { data: attendanceHistoryData, isFetching: isFetchingHistoryData } =
    attendanceService.useGetAttendanceHistory({ currentDate, userInfo });
  const { data: attendanceMonthData, isFetching: isFetchingMonthData } =
    attendanceService.useGetThisMonthAttendance({ currentDate });
  const { data: attendanceTodayData, isFetching: isFetchingTodayData } =
    attendanceService.useGetTodayAttendance({ currentDate });
  const useGetAttendanceDetail = useMutation(
    attendanceService.getAttendanceDetail,
    {
      onSuccess: (data) => {
        setAttendanceDetailObj(data);
      },
    }
  );
  // #endregion
  // #region functions
  const handleOpenAttendanceDetail = (attendanceId) => {
    useGetAttendanceDetail.mutate(attendanceId);
    onOpenAttendanceDetailModal();
  };
  // #endregion
  // #region table
  // #endregion
  // #region drawer
  // #endregion
  // #region form
  // #endregion
  if (
    isFetchingHistoryData ||
    isFetchingMonthData ||
    isFetchingTodayData ||
    isFetchingEmployeeData
  )
    return <LoadingSpinner />;
  return (
    <>
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
              <Heading fontSize="1.7rem">{employeeData?.fullname}</Heading>
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
                <Icon color="white" boxSize="30px" as={AiFillCheckCircle} />
              </Center>
              <Box color="white">
                <Heading fontSize="2xl">
                  {attendanceMonthData?.totalAttendance}
                </Heading>
                <Text fontSize="xl">Total Attendance</Text>
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
              <Text>{attendanceTodayData?.totalHours}</Text>
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
              <Text>
                {Helper.convertDateISOToHHmm(attendanceTodayData?.checkIn)}
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
              <Text>
                {Helper.convertDateISOToHHmm(attendanceTodayData?.checkOut)}
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
              <Text>
                {Helper.convertDateISOToHHmm(attendanceTodayData?.lateArrival)}
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
              <Text>
                {Helper.convertDateISOToHHmm(attendanceTodayData?.earlyLeave)}
              </Text>
              <Text fontWeight="medium">Early Leave</Text>
            </Box>
          </SimpleGrid>
          {/* <HStack
            w="100%"
            alignItems="center"
            justifyContent="center"
            flexDirection={{
              base: "column",
              md: "row",
            }}
            gap="10px"
          >
            <HStack
              as={Button}
              h="100%"
              cursor="pointer"
              w={{
                base: "85%",
                sm: "60%",
                md: "50%",
                lg: "40%",
                xl: "30%",
              }}
              bg="green.400"
              rounded="xl"
              p="15px"
              shadow="lg"
            >
              <Center bg="green.300" rounded="50%" boxSize="3rem">
                <Icon color="white" boxSize="30px" as={AiOutlineLogin} />
              </Center>
              <Box color="white">
                <Heading fontSize="2xl">Check In &shy; &shy; &shy;</Heading>
              </Box>
            </HStack>
            <HStack
              ml="0 !important"
              as={Button}
              h="100%"
              cursor="pointer"
              w={{
                base: "85%",
                sm: "60%",
                md: "50%",
                lg: "40%",
                xl: "30%",
              }}
              bg="pink.400"
              rounded="xl"
              p="15px"
              shadow="lg"
            >
              <Center bg="pink.300" rounded="50%" boxSize="3rem">
                <Icon color="white" boxSize="30px" as={AiOutlineLogout} />
              </Center>
              <Box color="white">
                <Heading fontSize="2xl">Check Out</Heading>
              </Box>
            </HStack>
          </HStack> */}
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
            <Flex
              flex="1"
              justifyContent="flex-end"
              gap="10px"
              flexDirection={{ base: "column", md: "row" }}
            >
              <Flex alignItems="center" gap="5px">
                <Badge rounded="md" colorScheme="green" fontSize="md" p="5px">
                  O.T
                </Badge>
                <Text>
                  <FaEquals />{" "}
                </Text>
                <Badge rounded="md" colorScheme="green" fontSize="md" p="5px">
                  On Time
                </Badge>
              </Flex>
              <Flex alignItems="center" gap="5px">
                <Badge rounded="md" colorScheme="yellow" fontSize="md" p="5px">
                  L.A
                </Badge>
                <Text>
                  <FaEquals />{" "}
                </Text>
                <Badge rounded="md" colorScheme="yellow" fontSize="md" p="5px">
                  Late Arrival
                </Badge>
              </Flex>
              <Flex alignItems="center" gap="5px">
                <Badge rounded="md" colorScheme="orange" fontSize="md" p="5px">
                  E.L
                </Badge>
                <Text>
                  <FaEquals />{" "}
                </Text>
                <Badge rounded="md" colorScheme="orange" fontSize="md" p="5px">
                  Early Leave
                </Badge>
              </Flex>
            </Flex>
          </Flex>
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
                      {!item?.earlyLeave && !item?.lateArrival && (
                        <Badge
                          rounded="md"
                          colorScheme="green"
                          fontSize="md"
                          p="5px"
                        >
                          O.T
                        </Badge>
                      )}
                      {item?.lateArrival && (
                        <Badge
                          rounded="md"
                          colorScheme="yellow"
                          fontSize="md"
                          p="5px"
                        >
                          L.A
                        </Badge>
                      )}
                      {item?.earlyLeave && (
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
                          {Helper.convertDateISOToHHmm(item?.checkOut)}
                        </Text>
                      </VStack>
                    </HStack>
                  </VStack>
                );
              })}
          </SimpleGrid>
        </VStack>
      </Stack>
      <Modal
        isOpen={isOpenAttendanceDetailModal}
        onClose={onCloseAttendanceDetailModal}
        isCentered
        size="4xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Flex gap="10px" flexDirection="row">
              <Flex gap="10px">
                <Box w="10px" bg="blue.700" borderRadius="5px"></Box>
                <Heading fontWeight="medium" fontSize="2rem">
                  Detail
                </Heading>
              </Flex>
              <Box>
                {!attendanceDetailObj?.result?.earlyLeave &&
                  !attendanceDetailObj?.result?.lateArrival && (
                    <Badge
                      rounded="md"
                      colorScheme="green"
                      fontSize="md"
                      p="5px"
                    >
                      On Time
                    </Badge>
                  )}
                {attendanceDetailObj?.result?.lateArrival && (
                  <Badge
                    rounded="md"
                    colorScheme="yellow"
                    fontSize="md"
                    p="5px"
                  >
                    Late Arrival
                  </Badge>
                )}
                {attendanceDetailObj?.result?.earlyLeave && (
                  <Badge
                    rounded="md"
                    colorScheme="yellow"
                    fontSize="md"
                    p="5px"
                  >
                    Early Leave
                  </Badge>
                )}
              </Box>
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
                      {attendanceDetailObj?.result?.totalHours}
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
                      Early Leave:
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
        </ModalContent>
      </Modal>
    </>
  );
}

export default AttendancePersonal;
