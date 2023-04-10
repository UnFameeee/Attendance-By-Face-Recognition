import React, { useContext, useState } from "react";
import GlobalContext from "../../pages/home/WorkShift/context/GlobalContext";
import { RiDeleteBin6Fill, RiCloseCircleFill } from "react-icons/ri";
import { BsCheckLg } from "react-icons/bs";
import { GrFormSchedule } from "react-icons/gr";
import { MdSegment } from "react-icons/md";
import { Flex, Icon, Input, Box } from "@chakra-ui/react";
const labelsClasses = [
  "calCo1",
  "calCo2",
  "calCo3",
  "calCo4",
  "calCo5",
  "calCo6",
  "calCo7",
  "calCo8",
  "calCo9",
  "calCo10",
  "calCo11",
  "calCo12",
  "calCo13",
];

export default function EventModal() {
  const { setShowEventModal, daySelected, dispatchCalEvent, selectedEvent } =
    useContext(GlobalContext);

  const [title, setTitle] = useState(selectedEvent ? selectedEvent.title : "");
  const [description, setDescription] = useState(
    selectedEvent ? selectedEvent.description : ""
  );
  const [selectedLabel, setSelectedLabel] = useState(
    selectedEvent
      ? labelsClasses.find((lbl) => lbl === selectedEvent.label)
      : labelsClasses[0]
  );

  function handleSubmit(e) {
    e.preventDefault();
    const calendarEvent = {
      title,
      description,
      label: selectedLabel,
      day: daySelected.valueOf(),
      id: selectedEvent ? selectedEvent.id : Date.now(),
    };
    if (selectedEvent) {
      dispatchCalEvent({ type: "update", payload: calendarEvent });
    } else {
      dispatchCalEvent({ type: "push", payload: calendarEvent });
    }

    setShowEventModal(false);
  }
  return (
    <div className="h-screen w-full fixed left-0 top-0 flex justify-center items-center">
      <form className="bg-white rounded-lg shadow-2xl w-96">
        <header className="bg-gray-100 px-4 py-2 flex justify-between items-center">
          <span className=" text-gray-400"></span>
          <div className="flex gap-2 ">
            {selectedEvent && (
              <span
                onClick={() => {
                  dispatchCalEvent({
                    type: "delete",
                    payload: selectedEvent,
                  });
                  setShowEventModal(false);
                }}
                className=" text-gray-400 cursor-pointer"
              >
                <Icon as={RiDeleteBin6Fill} fontSize="1.2rem" />
              </span>
            )}
            <button onClick={() => setShowEventModal(false)}>
              <span className=" text-gray-400">
                <Icon as={RiCloseCircleFill} fontSize="1.2rem" />
              </span>
            </button>
          </div>
        </header>
        <div className="p-3">
          <div className="grid grid-cols-1/6 items-end gap-y-7 gap-x-5">
            <Flex flexDirection="column" gap="10px">
              <input
                type="text"
                name="title"
                placeholder="Add title"
                value={title ?? "Unknown"}
                required
                className="pt-3 border-0 text-gray-600 text-xl font-semibold pb-2 w-full border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-blue-500"
                onChange={(e) => setTitle(e.target.value)}
              />
              <Flex gap="5px">
                <Box>
                  <span className=" text-gray-400">Start</span>
                  <Input type="time" />
                </Box>
                <Box>
                  <span className=" text-gray-400">End</span>
                  <Input type="time" />
                </Box>
              </Flex>
            </Flex>
            <Flex alignItems="center">
              <span className=" text-gray-400">
                <Icon as={GrFormSchedule} fontSize="1.5rem" />
              </span>
              <p>{daySelected.format("dddd, MMMM DD")}</p>
            </Flex>
            <Flex alignItems="center">
              <span className=" text-gray-400">
                <Icon as={MdSegment} fontSize="1.5rem" />
              </span>
              <input
                type="text"
                name="description"
                placeholder="Add a description"
                value={description}
                required
                className="pt-3 border-0 text-gray-600 pb-2 w-full border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-blue-500"
                onChange={(e) => setDescription(e.target.value)}
              />
            </Flex>
            <span className=" text-gray-400">Label</span>
            <div className="flex gap-x-2">
              {labelsClasses.map((lblClass, i) => (
                <span
                  key={i}
                  onClick={() => setSelectedLabel(lblClass)}
                  className={`bg-${lblClass} w-6 h-6 rounded-full flex items-center justify-center cursor-pointer`}
                >
                  {selectedLabel === lblClass && (
                    <span className=" text-white text-sm">
                      <Icon as={BsCheckLg} />
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
        <footer className="flex justify-end border-t p-3 mt-5">
          <button
            type="submit"
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded text-white"
          >
            Save
          </button>
        </footer>
      </form>
    </div>
  );
}
