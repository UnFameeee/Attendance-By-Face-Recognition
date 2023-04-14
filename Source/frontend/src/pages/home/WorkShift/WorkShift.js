import React, { useState, useContext, useEffect } from "react";
import { Flex, useToast } from "@chakra-ui/react";
import CalendarHeader from "../../../components/Calendar/CalendarHeader";
import Sidebar from "../../../components/Calendar/Sidebar";
import Month from "../../../components/Calendar/Month";
import GlobalContext from "./context/GlobalContext";
import EventModal from "../../../components/Calendar/EventModal";
import { Helper } from "../../../Utils/Helper";
import { useGetListEmployee } from "../../../services/employee/employee";
import LoadingSpinner from "../../../components/LoadingSpinner";
import {
  modifyWorkShiftService,
  useGetListShiftType,
  useGetWorkShiftOfEmployee,
} from "../../../services/workshift/workshift";
import { useMutation } from "react-query";

function WorkShift() {
  const toast = useToast();
  const [currentMonth, setCurrentMonth] = useState(Helper.getMonth());
  const { monthIndex, showEventModal } = useContext(GlobalContext);
  const { data: listEmployee, isLoading: isLoadingListEmployee } =
    useGetListEmployee();
  const { data: listShiftType, isLoading: isLoadingListShiftType } =
    useGetListShiftType();
  const { data: listWorkShiftOfEmployee, isLoading: isLoadingListWorkShiftOfEmployee } =
    useGetWorkShiftOfEmployee();
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
        // queryClient.invalidateQueries("listEmployee");
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
  const modifyWorkShift = (eventObj) => {
    useModifyWorkShift.mutate(eventObj);
  };

  useEffect(() => {
    setCurrentMonth(Helper.getMonth(monthIndex));
  }, [monthIndex]);
  if (isLoadingListEmployee && isLoadingListShiftType && isLoadingListWorkShiftOfEmployee)
    return <LoadingSpinner />;
  return (
    <React.Fragment>
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
          <Sidebar />
          <Month month={currentMonth} />
        </div>
      </div>
    </React.Fragment>
  );
}

export default WorkShift;
