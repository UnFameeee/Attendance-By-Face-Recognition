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
  // console.log(listWorkShiftDepartment,"listWorkShiftDepartment")
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
  const [listEmployeeDataSelection, setListEmployeeDataSelection] = useState(
    []
  );
  const [employeeFilterId, setEmployeeFilterId] = useState("");
  useEffect(() => {
    if (userDecodeInfo.roleName == "employee") {
      setEmployeeFilterId(userDecodeInfo.id);
    }
  }, []);
  useEffect(() => {
    setListEmployeeDataSelection(
      Helper.convertToArraySelection(
        listEmployeeOfDepartment?.result?.data,
        "fullname",
        "id"
      )
    );
  }, [listEmployeeOfDepartment]);
  const initialValuesOfEmployeeFilter = {
    employeeFilter: "",
  };
  const selectionHandleOnChange = (value) => {
    setEmployeeFilterId(value);
  };
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
          refreshListWork();
          toast({
            title: "Modify WorkShift Successfully",
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
          refreshListWork();
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
  const modifyWorkShift = (eventObj) => {
    useModifyWorkShift.mutate(eventObj);
  };
  const refreshListWork = () => {
    if (departmentId) {
      if (employeeFilterId != "") {
        let employeeId = employeeFilterId;
        setListWorkShiftDepartment([]);
        useGetWorkShiftOfEmployee.mutate({ employeeId, monthIndex });
      } else {
        useGetWorkShiftDepartment.mutate({ departmentId, monthIndex });
      }
    }
  };
  useEffect(() => {
    refreshListWork();
  }, [employeeFilterId]);
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
          tempObject[`startTime_${item.shiftTypeId}`] = moment(
            item.startTime
          ).format("hh:mm");
          tempObject[`endTime_${item.shiftTypeId}`] = moment(
            item.endTime
          ).format("hh:mm");
          tempObject[`shiftName_${item.shiftTypeId}`] = item.shiftName;
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
                const { [`startTime_${splitArray[1]}`]: startTimeValue } =
                  this.parent;
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
    refreshListWork();
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
        rounded="md"
        p="5px"
        mb="10px"
        gap="10px"
      >
        <Flex
          gap="10px"
          bg="white"
          rounded="md"
          p={2}
          w="fit-content"
          shadow="2xl"
        >
          <Box w="10px" bg="blue.700" borderRadius="5px"></Box>
          <Heading fontSize="3xl">Work Shift</Heading>
        </Flex>
      </Flex>
      <HStack
        gap="10px"
        flexDirection={{ base: "column", lg: "row" }}
        alignItems={{ base: "baseline", lg: "center" }}
        bg="white"
        rounded="md"
        p={2}
        w='fit-content'
        shadow="2xl"
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
                                        //  console.log(formik.isValid);
                                        onDeleteShiftTypeAlertOpen();
                                        setDeleteShiftTypeId(item.shiftTypeId);
                                      }}
                                    >
                                      Delete
                                    </Button>
                                    <Button
                                      colorScheme="blue"
                                      onClick={() => {
                                        // console.log(formik.isValid);
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
        <HStack alignItems={{ base: "baseline", sm: "center" }} gap="10px">
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
              if (departmentId && userDecodeInfo.roleName == "employee") {
                let employeeId = employeeFilterId;
                useGetWorkShiftOfEmployee.mutate({
                  employeeId,
                  monthIndex,
                });
              } else if (
                departmentId &&
                userDecodeInfo.roleName != "employee"
              ) {
                useGetWorkShiftDepartment.mutate({
                  departmentId,
                  monthIndex,
                });
              }
            }}
          >
            {(formik) => (
              <HStack
                as="form"
                onSubmit={formik.handleSubmit}
                flexDirection={{ sm: "row", base: "column" }}
                gap="5px"
                alignItems={{ base: "baseline", sm: "center" }}
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
                    <div>
                      <Button colorScheme="blue" type="submit" size="md">
                        Submit
                      </Button>
                    </div>
                  )}
              </HStack>
            )}
          </Formik>
        </HStack>
        {userDecodeInfo.roleName != "employee" && (
          <HStack
            w="fit-content"
           
            gap="10px"
            alignItems={{ base: "baseline", sm: "center" }}
          >
            <Heading fontSize="xl" fontWeight="medium">
              <Highlight
                query={["Employee Filter:"]}
                styles={{ px: "2", py: "1", rounded: "full", bg: "purple.100" }}
              >
                Employee Filter:
              </Highlight>
            </Heading>
            <Formik initialValues={initialValuesOfEmployeeFilter}>
              {(formik) => (
                <Box w="150px">
                  <FormTextField
                    name="employeeFilter"
                    isSelectionField={true}
                    selectionArray={listEmployeeDataSelection}
                    placeholder="All"
                    handleOnChange={selectionHandleOnChange}
                  />
                </Box>
              )}
            </Formik>
          </HStack>
        )}
      </HStack>
      {showEventModal && (
        <EventModal
          listEmployee={listEmployeeOfDepartment?.result?.data}
          listShift={listShiftType?.result?.data}
          modifyEventHandler={modifyWorkShift}
          refreshListWork={refreshListWork}
          setListWorkShiftDepartment={setListWorkShiftDepartment}
          isReadOnly={userDecodeInfo?.roleName == "employee"}
        />
      )}
      {departmentId ? (
        <div className=" h-[100%] flex flex-col p-[10px] bg-[#fdfffdbf] rounded-md shadow-2xl">
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
          <Box
            w="100%"
            bg="yellow.100"
            p="10px"
            mb="10px"
            rounded="md"
            shadow="2xl"
          >
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
          <Box h="100%"></Box>
        </>
      )}
    </Stack>
  );
}

export default WorkShift;
