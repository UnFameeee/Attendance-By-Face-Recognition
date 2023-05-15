import dayjs from "dayjs";
import React, { useContext } from "react";
import logo from "../../assets/calendar/logo.png";
import GlobalContext from "../../pages/home/WorkShift/context/GlobalContext";
import { GrPrevious, GrNext } from "react-icons/gr";
import { ImCalendar } from "react-icons/im";
import { Button, Flex, HStack, Icon } from "@chakra-ui/react";
export default function CalendarHeader() {
  const { monthIndex, setMonthIndex } = useContext(GlobalContext);
  function handlePrevMonth() {
    setMonthIndex(monthIndex - 1);
  }
  function handleNextMonth() {
    setMonthIndex(monthIndex + 1);
  }
  function handleReset() {
    setMonthIndex(
      monthIndex === dayjs().month()
        ? monthIndex + Math.random()
        : dayjs().month()
    );
  }
  return (
    <Flex
      gap="10px"
      flexDirection={{ base: "column", md: "row" }}
      alignItems={{ base: "start", md: "center" }}
      className="px-4 py-2 flex items-center"
    >
      <HStack>
        <Icon as={ImCalendar} fontSize="1.8rem" />
        <h1 className="mr-10 text-xl text-black font-medium">Calendar</h1>
        <Button colorScheme="cyan" color="white" onClick={handleReset}>
          Today
        </Button>
      </HStack>
      <HStack>
        <Button onClick={handlePrevMonth} >
          <span className="material-icons-outlined cursor-pointer text-gray-600 mx-2">
            <Icon as={GrPrevious} />
          </span>
        </Button>
        <Button onClick={handleNextMonth}>
          <span className="material-icons-outlined cursor-pointer text-gray-600 mx-2">
            <Icon as={GrNext} />
          </span>
        </Button>
        <h2 className="ml-4 text-xl text-black font-bold">
          {dayjs(new Date(dayjs().year(), monthIndex)).format("MMMM YYYY")}
        </h2>
      </HStack>
    </Flex>
  );
}
