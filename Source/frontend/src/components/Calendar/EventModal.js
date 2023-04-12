import React, { useContext, useState } from "react";
import GlobalContext from "../../pages/home/WorkShift/context/GlobalContext";
import { RiDeleteBin6Fill, RiCloseCircleFill } from "react-icons/ri";
import { BsCheckLg } from "react-icons/bs";
import { GrFormSchedule } from "react-icons/gr";
import { MdSegment } from "react-icons/md";
import { Flex, Icon, Input, Box, Button } from "@chakra-ui/react";
import { Formik } from "formik";
import * as Yup from "yup";
import FormTextField from "../field/FormTextField";
import { Helper } from "../../Utils/Helper";
const labelsClasses = [
  "bg-calCo1",
  "bg-calCo2",
  "bg-calCo3",
  "bg-calCo4",
  "bg-calCo5",
  "bg-calCo6",
  "bg-calCo7",
  "bg-calCo8",
  "bg-calCo9",
  "bg-calCo10",
  "bg-calCo11",
  "bg-calCo12",
  "bg-calCo13",
];

export default function EventModal(props) {
  const { createEventHandler, updateEventHandler } = props;
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

  const initialValues = {
    title: "",
    description: "",
    shiftType: "",
    shiftDate: "",
  };
  const validationSchema = Yup.object().shape({
    title: Yup.string().required("This field is required"),
    shiftType: Yup.string().required("This field is required"),
  });

  function handleSubmit() {
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
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, actions) => {
        handleSubmit();
        const eventObj = {
          shiftDate: Helper.convertTimestampToISO(daySelected.valueOf()),
          title: values.title,
          shiftType: values.shiftType,
          description: values.description,
        };
        console.log("eventObj", eventObj);
      }}
    >
      {(formik) => (
        <>
          <Box
            as="form"
            onSubmit={formik.handleSubmit}
            className="h-screen w-full fixed left-0 top-0 flex justify-center items-center"
          >
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
                    <FormTextField name="title" label="Title" type="text" />
                    <FormTextField
                      name="shiftType"
                      label="Shift Type"
                      isSelectionField={true}
                      placeholder="---"
                      selectionArray={[
                        { label: "Morning", value: "morning" },
                        { label: "Afternoon", value: "afternoon" },
                        { label: "Fulltime", value: "fulltime" },
                      ]}
                    />
                  </Flex>
                  <Flex alignItems="center">
                    <span className=" text-gray-400">
                      <Icon as={GrFormSchedule} fontSize="1.5rem" />
                    </span>
                    <p>{daySelected.format("dddd, MMMM DD")}</p>
                  </Flex>
                  <FormTextField
                    name="description"
                    label="Description"
                    type="text"
                  />
                  <span className=" text-gray-400">Label</span>
                  <Box
                    display="grid"
                    gridTemplateColumns="repeat( auto-fit, minmax(10px, 1fr))"
                  >
                    {labelsClasses.map((lblClass, i) => (
                      <span
                        key={i}
                        onClick={() => setSelectedLabel(lblClass)}
                        className={`${lblClass} w-6 h-6 rounded-full flex items-center justify-center cursor-pointer`}
                      >
                        {selectedLabel === lblClass && (
                          <span className=" text-white text-sm">
                            <Icon as={BsCheckLg} />
                          </span>
                        )}
                      </span>
                    ))}
                  </Box>
                </div>
              </div>
              <footer className="flex justify-end border-t p-3 mt-5">
                <Button
                  type="submit"
                  onClick={formik.handleSubmit}
                  className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded text-white"
                >
                  Save
                </Button>
              </footer>
            </form>
          </Box>
        </>
      )}
    </Formik>
  );
}
