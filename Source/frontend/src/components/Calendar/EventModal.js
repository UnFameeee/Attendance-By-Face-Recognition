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
const colorCodeList = [
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
const colorCodeList2 = [
  "#845EC2",
  "#D65DB1",
  "#FF6F91",
  "#FF9671",
  "#FFC75F",
  "#F9F871",
  "#008F7A",
  "#008E9B",
  "#0081CF",
  "#C4FCEF",
  "#FBEAFF",
  "#F3C5FF",
  "#FEFEDF",
];
export default function EventModal(props) {
  const { modifyEventHandler, listEmployee, listShift } =
    props;
  const { setShowEventModal, daySelected, dispatchCalEvent, selectedEvent } =
    useContext(GlobalContext);

  const [title, setTitle] = useState(selectedEvent ? selectedEvent.title : "");
  const [description, setDescription] = useState(
    selectedEvent ? selectedEvent.description : ""
  );
  const [selectedLabel, setSelectedLabel] = useState(
    selectedEvent
      ? colorCodeList.find((lbl) => lbl === selectedEvent.label)
      : colorCodeList[0]
  );
  let arrayEmployee = React.useMemo(() => {
    let tempArray = [];
    listEmployee.map((item, index) => {
      tempArray.push({
        label: item.fullname,
        value: item.id,
        color: colorCodeList2[index % colorCodeList2.length],
      });
    });
    return tempArray;
  });
  let arrayShift = React.useMemo(() => {
    let tempArray = [];
    listShift.map((item) => {
      tempArray.push({
        label: item.shiftName,
        value: item.shiftTypeId,
      });
    });
    return tempArray;
  });
  const initialValues = {
    title: "",
    description: "",
    shiftTypeId: "",
    shiftDate: "",
    employeeId: "",
  };
  const validationSchema = Yup.object().shape({
    title: Yup.string().required("This field is required"),
    shiftTypeId: Yup.string().required("This field is required"),
    employeeId: Yup.string().required("This field is required"),
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
          shiftDate: new Date(
            Helper.convertTimestampToISO(daySelected.valueOf())
          )
            .toISOString()
            .substring(0, 10),
          title: values.title,
          shiftTypeId: values.shiftTypeId,
          description: values.description,
          employeeId: values.employeeId,
        };
        modifyEventHandler(eventObj)
       
      }}
    >
      {(formik) => (
        <>
          <Box
            as="form"
            onSubmit={formik.handleSubmit}
            className="h-screen w-full fixed left-0 top-0 flex justify-center items-center"
          >
            <div className="bg-white rounded-lg shadow-2xl w-96">
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
                    <Flex alignItems="center">
                      <Box flex="1" alignItems="center">
                        <span className=" text-gray-400">
                          <Icon as={GrFormSchedule} fontSize="1.5rem" />
                        </span>
                        <p>{daySelected.format("dddd, MMMM DD")}</p>
                      </Box>
                      <Box flex="1">
                        <FormTextField
                          name="shiftTypeId"
                          label="Shift Type"
                          isSelectionField={true}
                          placeholder="---"
                          selectionArray={arrayShift}
                        />
                      </Box>
                    </Flex>
                  </Flex>
                  <FormTextField
                    name="employeeId"
                    label="Assign To"
                    placeholder="---"
                    isCustomSelectionField={true}
                    formik={formik}
                    selectionArray={arrayEmployee}
                  />
                  <FormTextField
                    name="description"
                    label="Description"
                    type="text"
                  />
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
            </div>
          </Box>
        </>
      )}
    </Formik>
  );
}
