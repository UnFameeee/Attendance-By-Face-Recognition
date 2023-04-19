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
export default function EventModal(props) {
  const {
    modifyEventHandler,
    listEmployee,
    listShift,
  } = props;
  const {
    setShowEventModal,
    daySelected,
    dispatchCalEvent,
    selectedEvent,
    monthIndex,
  } = useContext(GlobalContext);
  let arrayEmployee = React.useMemo(() => {
    let tempArray = [];
    listEmployee.map((item, index) => {
      tempArray.push({
        label: item.fullname,
        value: item.id,
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
    shiftTypeId: "",
    shiftDate: "",
    employeeId: "",
  };
  const validationSchema = Yup.object().shape({
    shiftTypeId: Yup.string().required("This field is required"),
    employeeId: Yup.string().required("This field is required"),
  });
  const matchingEventColor = (data) => {
    const result = arrayEmployee.find((item) => item.value === data.employeeId);
    if (result) {
      return result.color;
    }
    return arrayEmployee[0].color;
  };
  const matchingEmployeeName = (employeeId) => {
    const result = arrayEmployee.find((item) => item.value === employeeId);
    if (result) {
      return result.label;
    }
    return "";
  };
  function handleSubmit(eventObj) {
    const calendarEvent = {
      title: "test",
      color: matchingEventColor(eventObj),
      day: eventObj.shiftDate,
      id: {
        employeeId: eventObj.employeeId,
        employeeName: eventObj.employeeName,
        time: Date.now(),
      },
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
        const eventObj = {
          shiftDate: Helper.getMomentDateFormat(daySelected.valueOf()),
          shiftTypeId: values.shiftTypeId,
          employeeId: values.employeeId,
        };
        setShowEventModal(false);
        modifyEventHandler(eventObj);
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
                    isSelectionField={true}
                    formik={formik}
                    selectionArray={arrayEmployee}
                  />
                </div>
              </div>
              <footer className="flex justify-end border-t p-3 mt-5">
                <Button
                  type="submit"
                  onClick={formik.handleSubmit}
                  colorScheme="blue"
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
