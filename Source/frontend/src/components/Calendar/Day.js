import dayjs from "dayjs";
import React, { useContext, useState, useEffect } from "react";
import GlobalContext from "../../pages/home/WorkShift/context/GlobalContext";
import { Helper } from "../../Utils/Helper";
import moment from "moment";
export default function Day({ day, rowIdx, listWorkShift }) {
  const [dayEvents, setDayEvents] = useState([]);
  const {
    setDaySelected,
    setShowEventModal,
    filteredEvents,
    setSelectedEvent,
    monthIndex,
    setMonthIndex,
  } = useContext(GlobalContext);
  let isShiftDay;
  if (listWorkShift) {
    isShiftDay = listWorkShift.filter(
      (item) =>
        day.format("DD-MM-YY") ===
        Helper.convertDateISOToDDMMYYY(item.shiftDate)
    );
    if (isShiftDay.length > 0) {
      console.log("isShiftDay", isShiftDay);
      isShiftDay.map((item) => {
        const date = Helper.getMomentDateFormat(item?.shiftDate);
        console.log(date);
      });
    }
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
      (evt) => dayjs(evt.day).format("DD-MM-YY") === day.format("DD-MM-YY")
    );
    setDayEvents(events);
  }, [filteredEvents, day]);
  function getCurrentDayClass() {
    return day.format("DD-MM-YY") === dayjs().format("DD-MM-YY")
      ? "bg-blue-600 text-white rounded-full w-7"
      : "";
  }
  return (
    <div
      className={`border border-gray-200 flex flex-col 
    ${checkIfDayInSameMonth() ? "cursor-pointer" : "cursor-not-allowed"}`}
    >
      <header className="flex flex-col items-center">
        {rowIdx === 0 && (
          <p className="text-sm mt-1">{day.format("ddd").toUpperCase()}</p>
        )}
        <p
          className={`text-sm p-1 my-1 text-center  ${getCurrentDayClass()}  ${checkIfDayInSameMonth() ? "" : "text-gray-300"
            }`}
        >
          {day.format("DD")}
        </p>
      </header>
      <div
        className={`flex-1 ${checkIfDayInSameMonth() ? "cursor-pointer" : "cursor-not-allowed"
          } `}
        onClick={() => {
          if (checkIfDayInSameMonth()) {
            setDaySelected(day);
            setShowEventModal(true);
          }
        }}
      >
        {dayEvents.map((evt, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedEvent(evt)}
            className={`${evt.label
              } p-1 mr-3 text-gray-600 text-sm rounded mb-1 truncate ${idx == dayEvents.length - 1 ? "mb-5" : ""
              }`}
          >
            {evt.title ? evt.title : "Unknown"}
          </div>
        ))}
        {isShiftDay?.length > 0 &&
          isShiftDay.map((item) => (
            <div
              // onClick={() => setSelectedEvent(evt)}
              className={` p-1 mr-3 text-gray-600 text-sm rounded mb-1 truncate `}
            >
              {item?.employee?.fullname ?? "Unknown"}
            </div>
          ))}
      </div>
    </div>
  );
}
