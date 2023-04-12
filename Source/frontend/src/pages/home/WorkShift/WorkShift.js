import React, { useState, useContext, useEffect } from "react";
import { Flex } from "@chakra-ui/react";
import CalendarHeader from "../../../components/Calendar/CalendarHeader";
import Sidebar from "../../../components/Calendar/Sidebar";
import Month from "../../../components/Calendar/Month";
import GlobalContext from "./context/GlobalContext";
import EventModal from "../../../components/Calendar/EventModal";
import { Helper } from "../../../Utils/Helper";

function WorkShift() {
  const [currentMonth, setCurrentMonth] = useState(Helper.getMonth());
  const { monthIndex, showEventModal } = useContext(GlobalContext);
  const createEvent = () =>{

  }
  const updateEvent = () =>{
    
  }
  useEffect(() => {
    setCurrentMonth(Helper.getMonth(monthIndex));
  }, [monthIndex]);
  return (
      <React.Fragment>
        {showEventModal && <EventModal />}
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
