import React, { useState, useContext, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  HStack,
  Heading,
  Stack,
  VStack,
  useToast,
} from "@chakra-ui/react";
import CalendarHeader from "../../../components/Calendar/CalendarHeader";
import Sidebar from "../../../components/Calendar/Sidebar";
import Month from "../../../components/Calendar/Month";
import GlobalContext from "./context/GlobalContext";
import EventModal from "../../../components/Calendar/EventModal";
import { Helper } from "../../../Utils/Helper";
import { useGetListEmployee } from "../../../services/employee/employee";
import LoadingSpinner from "../../../components/LoadingSpinner";
import {
  getWorkShiftOfDepartment,
  modifyWorkShiftService,
  useGetListShiftType,
  useGetWorkShiftDepartment,
  useGetWorkShiftEmployee,
} from "../../../services/workshift/workshift";
import { useMutation, useQueryClient } from "react-query";
import { Field, Formik } from "formik";
import FormTextField from "../../../components/field/FormTextField";
import { useGetListDepartment } from "../../../services/organization/department";
import { unionBy } from "lodash/array";
function WorkShift() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [listWorkShiftDepartment, setListWorkShiftDepartment] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(Helper.getMonth());
  const [departmentId, setDepartmentId] = useState();
  const { monthIndex, showEventModal } = useContext(GlobalContext);
  const { data: listEmployee, isLoading: isLoadingListEmployee } =
    useGetListEmployee();
  const { data: listShiftType, isLoading: isLoadingListShiftType } =
    useGetListShiftType();
  const { data: listDepartmentData, isLoading: isLoadingListDepartment } =
    useGetListDepartment();
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
      setListWorkShiftDepartment((prevList) => {
        let resultData = [...data?.result];
        const mergedResult = unionBy(resultData, prevList, "shiftId");
        queryClient.setQueryData("listWorkShiftDepartment", mergedResult);
        return mergedResult;
      });
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
  const modifyWorkShift = (eventObj) => {
    useModifyWorkShift.mutate(eventObj);
  };
  const refreshListWorkDepartment = () => {
    useGetWorkShiftDepartment.mutate({ departmentId, monthIndex });
  };
  const initialValues = {
    department: "",
  };
  useEffect(() => {
    setCurrentMonth(Helper.getMonth(monthIndex));
    refreshListWorkDepartment()
  }, [monthIndex]);

  if (
    isLoadingListEmployee &&
    isLoadingListShiftType &&
    isLoadingListDepartment
  )
    return <LoadingSpinner />;
  return (
    <React.Fragment>
      <Flex alignItems="center" bg="white" rounded="md" p="5px" mb="10px">
        <Flex flex="1" gap="10px">
          <Box w="10px" bg="blue.700" borderRadius="5px"></Box>
          <Heading fontSize="3xl">Profile Details</Heading>
        </Flex>
        <HStack>
          <Heading fontSize="xl">Department: </Heading>
          <Formik
            initialValues={initialValues}
            onSubmit={(values, actions) => {
              const departmentId = values.department;
              setDepartmentId(departmentId);
              useGetWorkShiftDepartment.mutate({ departmentId, monthIndex });
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
                  <Button colorScheme="blue" type="submit">
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
        />
      )}
      <div className=" min-h-screen flex flex-col p-[10px] bg-white rounded-md">
        <CalendarHeader />
        <div className="flex flex-1">
          {/* <Sidebar /> */}
          <Month month={currentMonth} listWorkShift={listWorkShiftDepartment} />
        </div>
      </div>
    </React.Fragment>
  );
}

export default WorkShift;
