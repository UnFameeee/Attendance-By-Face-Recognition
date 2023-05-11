import React, { useState, useContext, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  HStack,
  Heading,
  Highlight,
  useDisclosure,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Stack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import CalendarHeader from "../../../components/Calendar/CalendarHeader";
import Month from "../../../components/Calendar/Month";
import GlobalContext from "./context/GlobalContext";
import EventModal from "../../../components/Calendar/EventModal";
import { Helper } from "../../../Utils/Helper";
import {
  employeeService,
  getListEmployeeOfDepartment,
} from "../../../services/employee/employee";
import LoadingSpinner from "../../../components/LoadingSpinner";
import {
  shiftTypeService,
  useGetListShiftType,
  workShiftService,
} from "../../../services/workshift/workshift";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Field, Formik } from "formik";
import FormTextField from "../../../components/field/FormTextField";
import { unionBy } from "lodash/array";
import NoDataToDisplay from "../../../components/NoDataToDisplay";
import { useGetListDepartment } from "../../../services/organization/department";
import moment from "moment";
import * as Yup from "yup";
import ChakraAlertDialog from "../../../components/ChakraAlertDialog";

function WorkShift() {
  // #region declare variable
  const toast = useToast();
  const queryClient = useQueryClient();
  const [userDecodeInfo, setUserDecodeInfo] = useState(
    Helper.getUseDecodeInfor()
  );
  const [listWorkShiftDepartment, setListWorkShiftDepartment] = useState([]);
  const [enableGetListEmployee, setEnableGetListEmployee] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(Helper.getMonth());
  const [toggleAddNewShiftType, setToggleAddNewShiftType] = useState(false);
  const [departmentId, setDepartmentId] = useState(
    Helper.getUseDecodeInfor().departmentId ?? ""
  );
  const { monthIndex, showEventModal } = useContext(GlobalContext);
  // #endregion
  // #region hooks
  const {
    isOpen: isModifyShiftTypeModalOpen,
    onOpen: onModifyShiftTypeModalOpen,
    onClose: onModifyShiftTypeModalClose,
  } = useDisclosure();
  const [deleteShiftTypeId, setDeleteShiftTypeId] = useState("");
  const {
    isOpen: isDeleteShiftTypeAlertOpen,
    onOpen: onDeleteShiftTypeAlertOpen,
    onClose: onDeleteShiftTypeAlertClose,
  } = useDisclosure();
  const { data: listShiftType, isLoading: isLoadingListShiftType } =
    useGetListShiftType();
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
  const useModifyWorkShift = useMutation(
    workShiftService.modifyWorkShiftService,
    {
      onSuccess: (data) => {
        const { result, message } = data;
        if (message) {
          toast({
            title: message,
            position: "bottom-right",
            status: "error",
            isClosable: true,
            duration: 5000,
          });
        } else {
          refreshListWorkDepartment();
          toast({
            title: "Modify WorkShift successfully",
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
  const useGetWorkShiftDepartment = useMutation(
    workShiftService.getWorkShiftOfDepartment,
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
          setListWorkShiftDepartment((prevList) => {
            let resultData = [...data?.result];
            const mergedResult = unionBy(resultData, prevList, "shiftId");
            queryClient.setQueryData("listWorkShiftDepartment", mergedResult);
            return mergedResult;
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
  const useGetWorkShiftOfEmployee = useMutation(
    workShiftService.getWorkShiftOfEmployee,
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
          setListWorkShiftDepartment((prevList) => {
            let resultData = [...data?.result];
            const mergedResult = unionBy(resultData, prevList, "shiftId");
            queryClient.setQueryData("listWorkShiftDepartment", mergedResult);
            return mergedResult;
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
  const useModifyShiftType = useMutation(
    shiftTypeService.modifyShiftTypeService,
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
          queryClient.invalidateQueries("listShiftType");
          refreshListWorkDepartment();
          toast({
            title: `${
              currentModifyShiftTypeId != "" ? "Modify" : "Create"
            } Shift Type Successfully`,
            position: "bottom-right",
            status: "success",
            isClosable: true,
            duration: 5000,
          });
        }
        resetModal();
      },
      onError: (error) => {
        toast({
          title: error.response.data.message,
          position: "bottom-right",
          status: "error",
          isClosable: true,
          duration: 5000,
        });
        resetModal();
      },
    }
  );
  const useDeleteShiftType = useMutation(
    shiftTypeService.deleteShiftTypeService,
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
          queryClient.invalidateQueries("listShiftType");
          toast({
            title: `Delete Shift Type Successfully`,
            position: "bottom-right",
            status: "success",
            isClosable: true,
            duration: 5000,
          });
        }
        resetModal();
      },
      onError: (error) => {
        toast({
          title: error.response.data.message,
          position: "bottom-right",
          status: "error",
          isClosable: true,
          duration: 5000,
        });
        resetModal();
      },
    }
  );
  // #endregion
  // #region functions
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
  const modifyWorkShift = (eventObj) => {
    useModifyWorkShift.mutate(eventObj);
  };
  const refreshListWorkDepartment = () => {
    if (departmentId) {
      if (userDecodeInfo.roleName == "employee") {
        let employeeId = userDecodeInfo.id;
        useGetWorkShiftOfEmployee.mutate({ employeeId, monthIndex });
      } else {
        useGetWorkShiftDepartment.mutate({ departmentId, monthIndex });
      }
    }
  };
  const resetModal = () => {
    setCurrentModifyShiftTypeId("");
    setToggleAddNewShiftType(false);
  };
  const handleAcceptDeleteShiftType = () => {
    onDeleteShiftTypeAlertClose();
    setDeleteShiftTypeId("");
    useDeleteShiftType.mutate(deleteShiftTypeId);
  };
  // #endregion
  // #region form & modal declare
  const initialValuesSelectDepartment = {
    department: departmentId,
  };
  const [objectShiftType, setObjectShiftType] = useState({});
  useEffect(() => {
    setObjectShiftType(() => {
      let tempObject = {};
      if (listShiftType?.result?.data) {
        listShiftType?.result?.data.map((item) => {
          tempObject[`startTime_${item.shiftTypeId}`] =
            moment(item.startTime).format("hh:mm");
          tempObject[`endTime_${item.shiftTypeId}`] = moment(
            item.endTime
          ).format("hh:mm");
          tempObject[`shiftName_${item.shiftTypeId}`] =
            item.shiftName;
        });
      }
      return tempObject;
    });
  }, [isLoadingListShiftType, listShiftType]);
  const [initialValuesModifyShiftType, setInitialValuesModifyShiftType] =
    useState({
      shiftName_New: "",
      startTime_New: "",
      endTime_New: "",
    });
  const [validationSchemaForCreateShift, setValidationSchemaForCreateShift] =
    useState(
      Yup.object().shape({
        shiftName_New: Yup.string().required("This field is required"),
        startTime_New: Yup.string().required("This field is required"),
        endTime_New: Yup.string()
          .test(
            "is-after",
            "End time must be after start time",
            function (value) {
              const { startTime_New } = this.parent;
              return moment(value, "hh:mm").isAfter(
                moment(startTime_New, "hh:mm")
              );
            }
          )
          .required("This field is required"),
      })
    );
  const [validationSchemaForModifyShift, setValidationSchemaForModifyShift] =
    useState();
  // const validationSchemaForCreateShift = Yup.object().shape({
  //   shiftName_New: Yup.string().required("This field is required"),
  //   startTime_New: Yup.string().required("This field is required"),
  //   endTime_New: Yup.string()
  //     .test("is-after", "End time must be after start time", function (value) {
  //       const { startTime_New } = this.parent;
  //       return moment(value, "hh:mm").isAfter(moment(startTime_New, "hh:mm"));
  //     })
  //     .required("This field is required"),
  // });
  const [currentModifyShiftTypeId, setCurrentModifyShiftTypeId] = useState("");

  // #endregion
  // #region useEffect
  useEffect(() => {
    setInitialValuesModifyShiftType((prev) => {
      return { ...prev, ...objectShiftType };
    });
    setValidationSchemaForModifyShift((prev) => {
      let keys = Object.keys(objectShiftType);
      let validateObj = {};
      keys.map((key) => {
        const splitArray = Helper.splitUnderscoreStringToArray(key);
        if (!splitArray.includes("endTime")) {
          validateObj[key] = Yup.string().required("This field is required");
        } else {
          validateObj[key] = Yup.string()
            .test(
              "is-after",
              "End time must be after start time",
              function (value) {
                const {[`startTime_${splitArray[1]}`]: startTimeValue} = this.parent;
                return moment(value, "hh:mm").isAfter(
                  moment(startTimeValue, "hh:mm")
                );
              }
            )
            .required("This field is required");
        }
      });
      let temp = Yup.object().shape({ ...validateObj });
      return temp;
    });
  }, [objectShiftType]);
  useEffect(() => {
    setCurrentMonth(Helper.getMonth(monthIndex));
    refreshListWorkDepartment();
  }, [monthIndex]);
  useEffect(() => {
    setListWorkShiftDepartment([]);
    if (departmentId) {
      setEnableGetListEmployee(true);
    }
  }, [departmentId]);
  // #endregion
  if (userDecodeInfo?.roleName == "employee") {
  } else if (
    isLoadingListEmployee &&
    isLoadingListShiftType &&
    isLoadingListDepartment
  ) {
    return <LoadingSpinner />;
  }
  return (
    <Stack h="100%">
      <Flex
        flexDirection={{ base: "column", md: "row" }}
        alignItems={{ base: "start", md: "center" }}
        bg="white"
        rounded="md"
        p="5px"
        mb="10px"
        gap="10px"
      >
        <Flex flex="1" gap="10px">
          <Box w="10px" bg="blue.700" borderRadius="5px"></Box>
          <Heading fontSize="3xl">Work Shift</Heading>
        </Flex>
        <HStack
          gap="5px"
          flexDirection={{ base: "column", md: "row" }}
          alignItems={{ base: "flex-start", md: "center" }}
        >
          {userDecodeInfo?.roleName == "admin" && (
            <>
              <Button colorScheme="teal" onClick={onModifyShiftTypeModalOpen}>
                Modify ShiftType
              </Button>
              <Modal
                isOpen={isModifyShiftTypeModalOpen}
                onClose={() => {
                  onModifyShiftTypeModalClose();
                  resetModal();
                }}
                isCentered
              >
                <ModalOverlay />
                <ModalContent>
                  <Formik
                    initialValues={initialValuesModifyShiftType}
                    validationSchema={
                      toggleAddNewShiftType
                        ? validationSchemaForCreateShift
                        : validationSchemaForModifyShift
                    }
                    onSubmit={(values, actions) => {
                      let modifyWorkShiftObject = {};
                      let keys = Object.keys(values);
                      if (currentModifyShiftTypeId != "") {
                        keys.map((key) => {
                          const splitArray =
                            Helper.splitUnderscoreStringToArray(key);
                          if (splitArray.includes(currentModifyShiftTypeId)) {
                            if (splitArray.includes("startTime")) {
                              modifyWorkShiftObject["startTime"] = values[key];
                            } else if (splitArray.includes("endTime")) {
                              modifyWorkShiftObject["endTime"] = values[key];
                            } else if (splitArray.includes("shiftName")) {
                              modifyWorkShiftObject["shiftName"] = values[key];
                            }
                          }
                        });
                        modifyWorkShiftObject["shiftTypeId"] =
                          currentModifyShiftTypeId;
                        useModifyShiftType.mutate(modifyWorkShiftObject);
                      } else {
                        keys.map((key) => {
                          const splitArray =
                            Helper.splitUnderscoreStringToArray(key);
                          if (splitArray.includes("New")) {
                            if (splitArray.includes("startTime")) {
                              modifyWorkShiftObject["startTime"] = values[key];
                            } else if (splitArray.includes("endTime")) {
                              modifyWorkShiftObject["endTime"] = values[key];
                            } else if (splitArray.includes("shiftName")) {
                              modifyWorkShiftObject["shiftName"] = values[key];
                            }
                          }
                        });
                        useModifyShiftType.mutate(modifyWorkShiftObject);
                      }
                      onModifyShiftTypeModalClose();
                    }}
                  >
                    {(formik) => (
                      <>
                        <ModalHeader>Modify ShiftType</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                          <Accordion allowToggle>
                            {listShiftType &&
                              !toggleAddNewShiftType &&
                              listShiftType.result.data.map((item) => (
                                <AccordionItem key={item.shiftName}>
                                  <h2>
                                    <AccordionButton>
                                      <Box as="span" flex="1" textAlign="left">
                                        {item.shiftName}
                                      </Box>
                                      <AccordionIcon />
                                    </AccordionButton>
                                  </h2>
                                  <AccordionPanel pb={4}>
                                    <FormTextField
                                      label="Shift Name"
                                      name={`shiftName_${item.shiftTypeId}`}
                                    />
                                    <FormTextField
                                      isTimeField={true}
                                      label="Start Time"
                                      name={`startTime_${item.shiftTypeId}`}
                                    />
                                    <FormTextField
                                      isTimeField={true}
                                      label="End Time"
                                      name={`endTime_${item.shiftTypeId}`}
                                    />
                                    <Flex
                                      w="100%"
                                      justifyContent="end"
                                      mt="10px"
                                      gap="5px"
                                    >
                                      <Button
                                        variant="outline"
                                        colorScheme="red"
                                        onClick={() => {
                                          onDeleteShiftTypeAlertOpen();
                                          setDeleteShiftTypeId(
                                            item.shiftTypeId
                                          );
                                        }}
                                      >
                                        Delete
                                      </Button>
                                      <Button
                                        colorScheme="blue"
                                        onClick={() => {
                                          setCurrentModifyShiftTypeId(
                                            item.shiftTypeId
                                          );
                                          formik.handleSubmit();
                                        }}
                                      >
                                        Save
                                      </Button>
                                    </Flex>
                                  </AccordionPanel>
                                </AccordionItem>
                              ))}
                            {toggleAddNewShiftType && (
                              <AccordionItem key="newShiftType">
                                <h2>
                                  <AccordionButton
                                    bg="primary1"
                                    color="white"
                                    _hover={{}}
                                  >
                                    <Box as="span" flex="1" textAlign="left">
                                      New Shift Type
                                    </Box>
                                    <AccordionIcon />
                                  </AccordionButton>
                                </h2>
                                <AccordionPanel pb={4}>
                                  <FormTextField
                                    label="Shift Name"
                                    name={`shiftName_New`}
                                  />
                                  <FormTextField
                                    isTimeField={true}
                                    label="Start Time"
                                    name={`startTime_New`}
                                  />
                                  <FormTextField
                                    isTimeField={true}
                                    label="End Time"
                                    name={`endTime_New`}
                                  />
                                  <Flex
                                    w="100%"
                                    justifyContent="end"
                                    mt="10px"
                                    gap="5px"
                                  >
                                    <Button
                                      variant="outline"
                                      colorScheme="red"
                                      onClick={() =>
                                        setToggleAddNewShiftType(false)
                                      }
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      colorScheme="blue"
                                      onClick={() => formik.handleSubmit()}
                                    >
                                      Create
                                    </Button>
                                  </Flex>
                                </AccordionPanel>
                              </AccordionItem>
                            )}
                          </Accordion>
                          {!toggleAddNewShiftType && (
                            <Box mt="10px">
                              <Button
                                colorScheme="blue"
                                onClick={() => setToggleAddNewShiftType(true)}
                              >
                                Add Another Shift
                              </Button>
                            </Box>
                          )}
                        </ModalBody>
                        <ModalFooter></ModalFooter>
                      </>
                    )}
                  </Formik>
                </ModalContent>
              </Modal>
              <ChakraAlertDialog
                isOpen={isDeleteShiftTypeAlertOpen}
                onClose={onDeleteShiftTypeAlertClose}
                onAccept={handleAcceptDeleteShiftType}
                title="Delete Shift Type"
              />
            </>
          )}
          <HStack>
            <Heading fontSize="xl" fontWeight="medium">
              <Highlight
                query={["Department:"]}
                styles={{ px: "2", py: "1", rounded: "full", bg: "purple.100" }}
              >
                Department:
              </Highlight>
            </Heading>
            <Formik
              initialValues={initialValuesSelectDepartment}
              onSubmit={(values, actions) => {
                const departmentId = values.department;
                setDepartmentId(departmentId);
                if (departmentId) {
                  useGetWorkShiftDepartment.mutate({
                    departmentId,
                    monthIndex,
                  });
                }
              }}
            >
              {(formik) => (
                <HStack
                  alignItems="center"
                  as="form"
                  onSubmit={formik.handleSubmit}
                >
                  <FormTextField
                    name="department"
                    placeholder="---"
                    isReadOnly={
                      userDecodeInfo?.roleName == "employee" ||
                      userDecodeInfo?.roleName == "manager"
                    }
                    isSelectionField={true}
                    selectionArray={
                      listDepartmentArray ? [...listDepartmentArray] : []
                    }
                  />
                  {userDecodeInfo?.roleName != "employee" &&
                    userDecodeInfo?.roleName != "manager" && (
                      <div className=" mt-[6px]">
                        <Button colorScheme="blue" type="submit" size="md">
                          Submit
                        </Button>
                      </div>
                    )}
                </HStack>
              )}
            </Formik>
          </HStack>
        </HStack>
      </Flex>
      {showEventModal && (
        <EventModal
          listEmployee={listEmployeeOfDepartment?.result?.data}
          listShift={listShiftType?.result?.data}
          modifyEventHandler={modifyWorkShift}
          refreshListWorkDepartment={refreshListWorkDepartment}
          setListWorkShiftDepartment={setListWorkShiftDepartment}
          isReadOnly={userDecodeInfo?.roleName == "employee"}
        />
      )}
      {departmentId ? (
        <div className=" h-[100%] flex flex-col p-[10px] bg-white rounded-md">
          <CalendarHeader />
          <div className="flex flex-1">
            {/* <Sidebar /> */}
            <Month
              month={currentMonth}
              listWorkShift={listWorkShiftDepartment}
            />
          </div>
        </div>
      ) : (
        <>
          <Box w="100%" bg="yellow.100" p="10px" mb="10px" rounded="md">
            <Heading
              fontSize="2xl"
              fontWeight="medium"
              textAlign="center"
              lineHeight="tall"
            >
              <Highlight
                query={["Department"]}
                styles={{ px: "2", py: "1", rounded: "full", bg: "purple.100" }}
              >
                Please choose your Department
              </Highlight>
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
                and hit Submit to see the work shift!
              </Highlight>
            </Heading>
          </Box>
          <Box h="100%">
            <NoDataToDisplay />
          </Box>
        </>
      )}
    </Stack>
  );
}

export default WorkShift;
