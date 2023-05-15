import dayjs from "dayjs";
import React, { useContext, useState, useEffect } from "react";
import GlobalContext from "../../pages/home/WorkShift/context/GlobalContext";
import { Helper } from "../../Utils/Helper";
import moment from "moment";
import { Badge, Box, Button,Text } from "@chakra-ui/react";
export default function Day({ day, rowIdx, listWorkShift }) {
  const [dayEvents, setDayEvents] = useState([]);
  const {
    setDaySelected,
    setShowEventModal,
    filteredEvents,
    setSelectedEvent,
    monthIndex,
    savedEvents,
    setMonthIndex,
  } = useContext(GlobalContext);
  let isShiftDay;
  if (listWorkShift) {
    isShiftDay = listWorkShift.filter(
      (item) =>
        day.format("DD-MM-YY") ===
        Helper.convertDateISOToDDMMYYY(item.shiftDate)
    );
  }
  const checkIfDayInSameMonth = () => {
    let realMonth = Math.floor(monthIndex) + 1;
    let yearDif = day.format("YYYY") - dayjs().format("YYYY");
    if (yearDif < 1) {
      yearDif = 1;
    }
    if (realMonth > 12) {
      realMonth = realMonth - 12 * yearDif;
    }
    if (day.format("M") == realMonth) {
      return true;
    }
    return false;
  };
  useEffect(() => {
    const events = filteredEvents.filter(
      (evt) => evt.day === day.format("YYYY-MM-DD")
    );
    setDayEvents(events);
    // console.log("filteredEvents",filteredEvents)
  }, [filteredEvents, day]);
  function getCurrentDayClass() {
    return day.format("DD-MM-YY") === dayjs().format("DD-MM-YY")
      ? "bg-blue-600 text-white rounded-full w-7"
      : "";
  }
  return (
    <div
      className={`border border-gray-300 flex flex-col 
    ${checkIfDayInSameMonth() ? "cursor-pointer" : "cursor-not-allowed"}`}
    >
      <header className="flex flex-col items-center">
        {rowIdx === 0 && (
          <p className="text-lg font-semibold mt-1">{day.format("ddd").toUpperCase()}</p>
        )}
        <p
          className={`text-md font-semibold p-1 my-1 text-center  ${getCurrentDayClass()}  ${
            checkIfDayInSameMonth() ? "" : "text-gray-300"
          }`}
        >
          {day.format("DD")}
        </p>
      </header>
      <div
        className={`flex-1 ${
          checkIfDayInSameMonth() ? "cursor-pointer" : "cursor-not-allowed"
        } `}
        onClick={() => {
          if (checkIfDayInSameMonth()) {
            setDaySelected(day);
            setShowEventModal(true);
          }
        }}
      >
        {isShiftDay?.length > 0 &&
          isShiftDay.map((item, index) => {
            // console.log("item", item);
            return (
              <div
                key={item?.shiftId}
                onClick={() => setSelectedEvent(item)}
                className={` p-1 mr-3 text-white ${
                  item.absent ? "bg-yellow-600" : "bg-[#3182ce]"
                }  text-sm rounded mb-1 truncate flex gap-[5px] flex-col ${
                  index === isShiftDay?.length - 1 ? "mb-[2rem]" : ""
                } `}
              >
                <span className=" overflow-hidden text-ellipsis whitespace-nowrap font-semibold text-[1rem]">
                  {item?.employee?.fullname ?? "Unknown"}
                </span>
                <div className=" flex flex-col gap-[5px]">
                  <Badge w='fit-content'>{item?.shiftType?.shiftName ?? ""}</Badge>
                  {item.absent ? (
                    <Text fontSize='lg'>Absent</Text>
                  ) : (
                    <div className="flex gap-[2px]">
                      <span className=" overflow-hidden text-ellipsis whitespace-nowrap">
                        {item?.shiftType?.startTime
                          ? moment(item?.shiftType?.startTime).format("hh:mm A")
                          : ""}{" "}
                        To{" "}
                        {item?.shiftType?.endTime
                          ? moment(item?.shiftType?.endTime).format("hh:mm A")
                          : ""}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
