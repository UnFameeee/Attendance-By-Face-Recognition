import React, { useContext, useState } from "react";
import GlobalContext from "../../pages/home/WorkShift/context/GlobalContext";
import { RiDeleteBin6Fill, RiCloseCircleFill } from "react-icons/ri";
import { BsCheckLg } from "react-icons/bs";
import { GrFormSchedule } from "react-icons/gr";
import { MdSegment } from "react-icons/md";
import {
  Flex,
  Icon,
  Input,
  Box,
  Button,
  Text,
  HStack,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import { Formik } from "formik";
import * as Yup from "yup";
import FormTextField from "../field/FormTextField";
import { Helper } from "../../Utils/Helper";
import moment from "moment";
import { useMutation } from "react-query";
import { workShiftService } from "../../services/workshift/workshift";
import ChakraAlertDialog from "../ChakraAlertDialog";
export default function EventModal(props) {
  // #region declare variable
  const {
    modifyEventHandler,
    listEmployee,
    listShift,
    refreshListWorkDepartment,
    setListWorkShiftDepartment,
    isReadOnly,
  } = props;
  const { setShowEventModal, daySelected, selectedEvent } =
    useContext(GlobalContext);
  const toast = useToast();
  let arrayEmployee = React.useMemo(() => {
    let tempArray = [];
    listEmployee?.map((item, index) => {
      tempArray.push({
        label: item.fullname,
        value: item.id,
      });
    });
    return tempArray;
  });
  let arrayShift = React.useMemo(() => {
    let tempArray = [];
    listShift?.map((item) => {
      tempArray.push({
        label: item.shiftName,
        value: item.shiftTypeId,
      });
    });
    return tempArray;
  });
  // #endregion
  // #region hooks
  const useDeleteWorkShift = useMutation(
    workShiftService.deleteWorkShiftService,
    {
      onSuccess: (data) => {
        const { message } = data;
        if (message) {
          toast({
            title: message,
            position: "bottom-right",
            status: "error",
            isClosable: true,
            duration: 5000,
          });
        } else {
          setListWorkShiftDepartment((prevList) => {
            const removeSingleArray = prevList.filter(
              (item) => item?.shiftId != selectedEvent?.shiftId
            );
            return removeSingleArray;
          });
          refreshListWorkDepartment();
          toast({
            title: "Delete Shift Successfully",
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
    }
  );
  const {
    isOpen: isDeleteSingleOpen,
    onOpen: onDeleteSingleOpen,
    onClose: onDeleteSingleClose,
  } = useDisclosure();
  // #endregion
  // #region functions
  const handleAcceptDelete = () => {
    const shiftId = selectedEvent?.shiftId;
    useDeleteWorkShift.mutate(shiftId);
    setShowEventModal(false);
  };
  // #endregion
  // #region form
  const initialValues = {
    shiftTypeId: selectedEvent?.shiftTypeId ?? "",
    shiftDate: selectedEvent?.shiftDate ?? "",
    employeeId: selectedEvent?.employee?.id ?? "",
  };
  const validationSchema = Yup.object().shape({
    shiftTypeId: Yup.string().required("This field is required"),
    employeeId: Yup.string().required("This field is required"),
  });
  // #endregion
  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, actions) => {
          const eventObj = {
            shiftDate: Helper.getMomentDateFormat(daySelected.valueOf()),
            shiftTypeId: values.shiftTypeId,
            employeeId: values.employeeId,
          };
          if (selectedEvent) {
            eventObj["shiftId"] = selectedEvent?.shiftId;
          }
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
                <header className="bg-[#3182ce] px-4 py-2 flex justify-between items-center">
                  <span className=" text-white font-bold text-[1.2rem]">
                    Work Shift Detail
                  </span>
                  <div className="flex gap-2 ">
                    {selectedEvent && !isReadOnly && (
                      <span
                        onClick={() => {
                          onDeleteSingleOpen();
                        }}
                        className=" text-white cursor-pointer"
                      >
                        <Icon as={RiDeleteBin6Fill} fontSize="1.2rem" />
                      </span>
                    )}
                    <button onClick={() => setShowEventModal(false)}>
                      <span className=" text-white">
                        <Icon as={RiCloseCircleFill} fontSize="1.2rem" />
                      </span>
                    </button>
                  </div>
                </header>
                <div className="p-3">
                  <div className="grid gap-5">
                    <Box>
                      <FormTextField
                        name="shiftTypeId"
                        label="Shift Type"
                        isSelectionField={true}
                        placeholder="---"
                        selectionArray={arrayShift}
                        isReadOnly={isReadOnly}
                      />
                    </Box>
                    <Box alignItems="center">
                      <p className=" text-xl flex items-center">
                        {" "}
                        <Icon as={GrFormSchedule} fontSize="1.5rem" />
                        {daySelected.format("dddd, MMMM DD")}
                      </p>
                    </Box>
                    {selectedEvent?.shiftType && (
                      <HStack>
                        {selectedEvent?.shiftType?.startTime && (
                          <Text fontSize="xl">
                            From:{" "}
                            {selectedEvent?.shiftType?.startTime
                              ? moment(
                                  selectedEvent?.shiftType?.startTime
                                ).format("hh:mm A")
                              : ""}
                          </Text>
                        )}
                        {selectedEvent?.shiftType?.endTime && (
                          <Text fontSize="xl">
                            To:{" "}
                            {selectedEvent?.shiftType?.endTime
                              ? moment(
                                  selectedEvent?.shiftType?.endTime
                                ).format("hh:mm A")
                              : ""}
                          </Text>
                        )}
                      </HStack>
                    )}
                    <FormTextField
                      name="employeeId"
                      label="Assign To"
                      placeholder="---"
                      isSelectionField={true}
                      formik={formik}
                      selectionArray={arrayEmployee}
                      isReadOnly={isReadOnly}
                    />
                  </div>
                </div>
                {!isReadOnly && (
                  <footer className="flex justify-end border-t p-3 mt-5">
                    <Button
                      type="submit"
                      onClick={formik.handleSubmit}
                      colorScheme="blue"
                    >
                      Save
                    </Button>
                  </footer>
                )}
              </div>
            </Box>
          </>
        )}
      </Formik>
      <ChakraAlertDialog
        title="Delete Work Shift"
        isOpen={isDeleteSingleOpen}
        onClose={onDeleteSingleClose}
        onAccept={handleAcceptDelete}
      />
    </>
  );
}
