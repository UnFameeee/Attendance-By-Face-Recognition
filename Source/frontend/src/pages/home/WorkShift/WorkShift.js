import React, { useState, useContext, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  HStack,
  Heading,
  Highlight,
  Stack,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import CalendarHeader from "../../../components/Calendar/CalendarHeader";
import Sidebar from "../../../components/Calendar/Sidebar";
import Month from "../../../components/Calendar/Month";
import GlobalContext from "./context/GlobalContext";
import EventModal from "../../../components/Calendar/EventModal";
import { Helper } from "../../../Utils/Helper";
import {
  getListEmployeeOfDepartment,
  useGetListEmployee,
} from "../../../services/employee/employee";
import LoadingSpinner from "../../../components/LoadingSpinner";
import {
  getWorkShiftOfDepartment,
  modifyWorkShiftService,
  useGetListShiftType,
  useGetWorkShiftDepartment,
  useGetWorkShiftEmployee,
} from "../../../services/workshift/workshift";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Field, Formik } from "formik";
import FormTextField from "../../../components/field/FormTextField";
import { useGetListDepartment } from "../../../services/organization/department";
import { unionBy } from "lodash/array";
import NoDataToDisplay from "../../../components/NoDataToDisplay";
function WorkShift() {
  // #region declare variable
  const toast = useToast();
  const queryClient = useQueryClient();
  const [listWorkShiftDepartment, setListWorkShiftDepartment] = useState([]);
  const [enableGetListEmployee, setEnableGetListEmployee] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(Helper.getMonth());
  const [departmentId, setDepartmentId] = useState();
  const { monthIndex, showEventModal } = useContext(GlobalContext);
  // #endregion
  // #region hooks
  const { data: listShiftType, isLoading: isLoadingListShiftType } =
    useGetListShiftType();
  const { data: listDepartmentData, isLoading: isLoadingListDepartment } =
    useGetListDepartment();
  const useGetListEmployee = (departmentId, isEnable = false) => {
    return useQuery(
      ["listEmployeeOfDepartment", departmentId],
      () => getListEmployeeOfDepartment({ departmentId }),
      {
        refetchOnWindowFocus: false,
        retry: 1,
        enabled: isEnable,
      }
    );
  };
  const { data: listEmployee, isLoading: isLoadingListEmployee } =
    useGetListEmployee(departmentId, enableGetListEmployee);
  const useModifyWorkShift = useMutation(modifyWorkShiftService, {
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
  });
  const useGetWorkShiftDepartment = useMutation(getWorkShiftOfDepartment, {
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
  });
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
      useGetWorkShiftDepartment.mutate({ departmentId, monthIndex });
    }
  };
  const initialValues = {
    department: "",
  };
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
  // #region table
  // #endregion
  // #region drawer
  // #endregion
  // #region form
  // #endregion
  if (
    isLoadingListEmployee &&
    isLoadingListShiftType &&
    isLoadingListDepartment
  )
    return <LoadingSpinner />;
  return (
    <React.Fragment>
      <Flex
        flexDirection={{ base: "column", md: "row" }}
        alignItems={{ base: "start", md: "center" }}
        bg="white"
        rounded="md"
        p="5px"
        mb="10px"
      >
        <Flex flex="1" gap="10px">
          <Box w="10px" bg="blue.700" borderRadius="5px"></Box>
          <Heading fontSize="3xl">Work Shift</Heading>
        </Flex>
        <HStack>
          <Heading fontSize="xl" fontWeight='medium'>
            <Highlight
              query={["Department:"]}
              styles={{ px: "2", py: "1", rounded: "full", bg: "red.100" }}
            >
              Department:
            </Highlight>
          </Heading>
          <Formik
            initialValues={initialValues}
            onSubmit={(values, actions) => {
              const departmentId = values.department;
              setDepartmentId(departmentId);
              if (departmentId) {
                useGetWorkShiftDepartment.mutate({ departmentId, monthIndex });
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
                  isSelectionField={true}
                  placeholder="---"
                  selectionArray={
                    listDepartmentArray ? [...listDepartmentArray] : []
                  }
                />
                <div className=" mt-[6px]">
                  <Button colorScheme="blue" type="submit" size='md'>
                    Submit
                  </Button>
                </div>
              </HStack>
            )}
          </Formik>
        </HStack>
      </Flex>
      {showEventModal && (
        <EventModal
          listEmployee={listEmployee?.result?.data}
          listShift={listShiftType?.result}
          modifyEventHandler={modifyWorkShift}
          refreshListWorkDepartment={refreshListWorkDepartment}
          setListWorkShiftDepartment={setListWorkShiftDepartment}
        />
      )}
      {departmentId ? (
        <div className=" min-h-screen flex flex-col p-[10px] bg-white rounded-md">
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
                styles={{ px: "2", py: "1", rounded: "full", bg: "red.100" }}
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
                  fontSize:'xl'
                }}
              >
                and hit Submit to see the work shift!
              </Highlight>
            </Heading>
          </Box>
          <NoDataToDisplay />
        </>
      )}
    </React.Fragment>
  );
}

export default WorkShift;
