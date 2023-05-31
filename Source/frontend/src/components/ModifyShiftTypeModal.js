import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  HStack,
  Heading,
  Highlight,
  useDisclosure,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Stack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import {
  shiftTypeService,
  useGetListShiftType,
} from "../services/workshift/workshift";
import { useMutation, useQueryClient } from "react-query";
import * as Yup from "yup";
import { Formik } from "formik";
import { Helper } from "../Utils/Helper";
import FormTextField from "./field/FormTextField";
import ChakraAlertDialog from "./ChakraAlertDialog";
import moment from "moment";
import LoadingSpinner from "./LoadingSpinner";

function ModifyShiftTypeModal(props) {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [toggleAddNewShiftType, setToggleAddNewShiftType] = useState(false);
  const [currentModifyShiftTypeId, setCurrentModifyShiftTypeId] = useState("");
  const [deleteShiftTypeId, setDeleteShiftTypeId] = useState("");
  const [objectShiftType, setObjectShiftType] = useState({});

  const {
    isOpen: isDeleteShiftTypeAlertOpen,
    onOpen: onDeleteShiftTypeAlertOpen,
    onClose: onDeleteShiftTypeAlertClose,
  } = useDisclosure();
  const {
    isOpen: isSaveShiftTypeAlertOpen,
    onOpen: onSaveShiftTypeAlertOpen,
    onClose: onSaveShiftTypeAlertClose,
  } = useDisclosure();
  const {
    isOpen: isModifyShiftTypeModalOpen,
    onOpen: onModifyShiftTypeModalOpen,
    onClose: onModifyShiftTypeModalClose,
  } = useDisclosure();
  const {
    data: listShiftType,
    isLoading: isLoadingListShiftType,
    isFetching: isFetchingListShiftType,
  } = useGetListShiftType();
  const useModifyShiftType = useMutation(
    shiftTypeService.modifyShiftTypeService,
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
          queryClient.invalidateQueries("listShiftType");
          toast({
            title: `${
              currentModifyShiftTypeId != "" ? "Modify" : "Create"
            } Shift Type Successfully`,
            position: "bottom-right",
            status: "success",
            isClosable: true,
            duration: 5000,
          });
        }
        resetModal();
      },
      onError: (error) => {
        toast({
          title: error.response.data.message,
          position: "bottom-right",
          status: "error",
          isClosable: true,
          duration: 5000,
        });
        resetModal();
      },
    }
  );
  const useDeleteShiftType = useMutation(
    shiftTypeService.deleteShiftTypeService,
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
          queryClient.invalidateQueries("listShiftType");
          toast({
            title: `Delete Shift Type Successfully`,
            position: "bottom-right",
            status: "success",
            isClosable: true,
            duration: 5000,
          });
        }
        resetModal();
      },
      onError: (error) => {
        toast({
          title: error.response.data.message,
          position: "bottom-right",
          status: "error",
          isClosable: true,
          duration: 5000,
        });
        resetModal();
      },
    }
  );
  const [validationSchemaForCreateShift, setValidationSchemaForCreateShift] =
    useState(
      Yup.object().shape({
        shiftName_New: Yup.string().required("This field is required"),
        startTime_New: Yup.string().required("This field is required"),
        endTime_New: Yup.string()
          .test(
            "is-after",
            "End time must be after start time",
            function (value) {
              const { startTime_New } = this.parent;
              return moment.utc(value, "hh:mm").isAfter(
                moment.utc(startTime_New, "hh:mm")
              );
            }
          )
          .required("This field is required"),
      })
    );
  const [validationSchemaForModifyShift, setValidationSchemaForModifyShift] =
    useState();
  const [initialValuesModifyShiftType, setInitialValuesModifyShiftType] =
    useState({
      shiftName_New: "",
      startTime_New: "",
      endTime_New: "",
    });
  function resetModal() {
    onModifyShiftTypeModalClose();
    setCurrentModifyShiftTypeId("");
    setToggleAddNewShiftType(false);
  }
  const handleAcceptDeleteShiftType = () => {
    onDeleteShiftTypeAlertClose();
    setDeleteShiftTypeId("");
    useDeleteShiftType.mutate(deleteShiftTypeId);
  };
  const handleAcceptSaveShiftType = () => {
    onDeleteShiftTypeAlertClose();
    setDeleteShiftTypeId("");
    useDeleteShiftType.mutate(deleteShiftTypeId);
  };
  useEffect(() => {
    setObjectShiftType(() => {
      let tempObject = {};
      if (listShiftType?.result?.data) {
        listShiftType?.result?.data.map((item) => {
          tempObject[`startTime_${item.shiftTypeId}`] = moment.utc(
            item.startTime
          ).format("HH:mm");
          tempObject[`endTime_${item.shiftTypeId}`] = moment.utc(
            item.endTime
          ).format("HH:mm");
          tempObject[`shiftName_${item.shiftTypeId}`] = item.shiftName;
        });
      }
      return tempObject;
    });
  }, [isLoadingListShiftType, listShiftType]);
  useEffect(() => {
    setInitialValuesModifyShiftType((prev) => {
      return { ...prev, ...objectShiftType };
    });
    setValidationSchemaForModifyShift((prev) => {
      let keys = Object.keys(objectShiftType);
      let validateObj = {};
      keys.map((key) => {
        const splitArray = Helper.splitUnderscoreStringToArray(key);
        if (!splitArray.includes("endTime")) {
          validateObj[key] = Yup.string().required("This field is required");
        } else {
          validateObj[key] = Yup.string()
            .test(
              "is-after",
              "End time must be after start time",
              function (value) {
                const { [`startTime_${splitArray[1]}`]: startTimeValue } =
                  this.parent;
                return moment.utc(value, "hh:mm").isAfter(
                  moment.utc(startTimeValue, "hh:mm")
                );
              }
            )
            .required("This field is required");
        }
      });
      let temp = Yup.object().shape({ ...validateObj });
      return temp;
    });
  }, [objectShiftType]);
  if (isLoadingListShiftType) return <LoadingSpinner />;
  return (
    <>
      <Button
        colorScheme="teal"
        w="fit-content"
        onClick={onModifyShiftTypeModalOpen}
      >
        Modify Shift Type
      </Button>
      <Modal
        isOpen={isModifyShiftTypeModalOpen}
        onClose={() => {
          onModifyShiftTypeModalClose();
          resetModal();
        }}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <Formik
            initialValues={initialValuesModifyShiftType}
            validationSchema={
              toggleAddNewShiftType
                ? validationSchemaForCreateShift
                : validationSchemaForModifyShift
            }
            onSubmit={(values, actions) => {
              let modifyWorkShiftObject = {};
              let keys = Object.keys(values);
              if (currentModifyShiftTypeId != "") {
                keys.map((key) => {
                  const splitArray = Helper.splitUnderscoreStringToArray(key);
                  if (splitArray.includes(currentModifyShiftTypeId)) {
                    if (splitArray.includes("startTime")) {
                      modifyWorkShiftObject["startTime"] = values[key];
                    } else if (splitArray.includes("endTime")) {
                      modifyWorkShiftObject["endTime"] = values[key];
                    } else if (splitArray.includes("shiftName")) {
                      modifyWorkShiftObject["shiftName"] = values[key];
                    }
                  }
                });
                modifyWorkShiftObject["shiftTypeId"] = currentModifyShiftTypeId;
                useModifyShiftType.mutate(modifyWorkShiftObject);
              } else {
                keys.map((key) => {
                  const splitArray = Helper.splitUnderscoreStringToArray(key);
                  if (splitArray.includes("New")) {
                    if (splitArray.includes("startTime")) {
                      modifyWorkShiftObject["startTime"] = values[key];
                    } else if (splitArray.includes("endTime")) {
                      modifyWorkShiftObject["endTime"] = values[key];
                    } else if (splitArray.includes("shiftName")) {
                      modifyWorkShiftObject["shiftName"] = values[key];
                    }
                  }
                });
                useModifyShiftType.mutate(modifyWorkShiftObject);
              }
              onModifyShiftTypeModalClose();
              onSaveShiftTypeAlertClose();
            }}
          >
            {(formik) => (
              <>
                <ModalHeader>Modify Shift Type</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Accordion allowToggle>
                    {listShiftType &&
                      !toggleAddNewShiftType &&
                      listShiftType.result.data.map((item) => (
                        <AccordionItem key={item.shiftName}>
                          <h2>
                            <AccordionButton>
                              <Box as="span" flex="1" textAlign="left">
                                {item.shiftName}
                              </Box>
                              <AccordionIcon />
                            </AccordionButton>
                          </h2>
                          <AccordionPanel pb={4}>
                            <FormTextField
                              label="Shift Name"
                              name={`shiftName_${item.shiftTypeId}`}
                            />
                            <FormTextField
                              isTimeField={true}
                              label="Start Time"
                              name={`startTime_${item.shiftTypeId}`}
                            />
                            <FormTextField
                              isTimeField={true}
                              label="End Time"
                              name={`endTime_${item.shiftTypeId}`}
                            />
                            <Flex
                              w="100%"
                              justifyContent="end"
                              mt="10px"
                              gap="5px"
                            >
                              <Button
                                variant="outline"
                                colorScheme="red"
                                onClick={() => {
                                  //  console.log(formik.isValid);
                                  onDeleteShiftTypeAlertOpen();
                                  setDeleteShiftTypeId(item.shiftTypeId);
                                }}
                              >
                                Delete
                              </Button>
                              <Button
                                colorScheme="blue"
                                onClick={() => {
                                  // console.log(formik.isValid);
                                  setCurrentModifyShiftTypeId(item.shiftTypeId);
                                  // formik.handleSubmit();
                                  onSaveShiftTypeAlertOpen();
                                }}
                              >
                                Save
                              </Button>
                            </Flex>
                          </AccordionPanel>
                        </AccordionItem>
                      ))}
                    <ChakraAlertDialog
                      isOpen={isSaveShiftTypeAlertOpen}
                      onClose={onSaveShiftTypeAlertClose}
                      onAccept={formik.handleSubmit}
                      title="Save Shift Type"
                      acceptButtonColor="blue"
                      acceptButtonLabel="Accept"
                    />
                    {toggleAddNewShiftType && (
                      <AccordionItem key="newShiftType">
                        <h2>
                          <AccordionButton
                            bg="primary1"
                            color="white"
                            _hover={{}}
                          >
                            <Box as="span" flex="1" textAlign="left">
                              New Shift Type
                            </Box>
                            <AccordionIcon />
                          </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                          <FormTextField
                            label="Shift Name"
                            name={`shiftName_New`}
                          />
                          <FormTextField
                            isTimeField={true}
                            label="Start Time"
                            name={`startTime_New`}
                          />
                          <FormTextField
                            isTimeField={true}
                            label="End Time"
                            name={`endTime_New`}
                          />
                          <Flex
                            w="100%"
                            justifyContent="end"
                            mt="10px"
                            gap="5px"
                          >
                            <Button
                              variant="outline"
                              colorScheme="red"
                              onClick={() => setToggleAddNewShiftType(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              colorScheme="blue"
                              onClick={() => formik.handleSubmit()}
                            >
                              Create
                            </Button>
                          </Flex>
                        </AccordionPanel>
                      </AccordionItem>
                    )}
                  </Accordion>
                  {!toggleAddNewShiftType && (
                    <Box mt="10px">
                      <Button
                        colorScheme="blue"
                        onClick={() => setToggleAddNewShiftType(true)}
                      >
                        Add Another Shift Type
                      </Button>
                    </Box>
                  )}
                </ModalBody>
                <ModalFooter></ModalFooter>
              </>
            )}
          </Formik>
        </ModalContent>
      </Modal>
      <ChakraAlertDialog
        isOpen={isDeleteShiftTypeAlertOpen}
        onClose={onDeleteShiftTypeAlertClose}
        onAccept={handleAcceptDeleteShiftType}
        title="Delete Shift Type"
      />
    </>
  );
}

export default ModifyShiftTypeModal;
