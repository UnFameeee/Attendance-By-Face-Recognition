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
import { useMutation, useQueryClient } from "react-query";
import { leaveRequestService } from "../services/leaveRequest/leaveRequest";
import * as Yup from "yup";
import { Helper } from "../Utils/Helper";
import LoadingSpinner from "./LoadingSpinner";
import FormTextField from "./field/FormTextField";
import { selectionData } from "../data/SelectionData";
import ChakraAlertDialog from "./ChakraAlertDialog";
import { Formik } from "formik";
function ModifyLeaveTypeModal() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [currentModifyLeaveTypeId, setCurrentModifyLeaveTypeId] = useState("");
  const [toggleAddNewLeaveType, setToggleAddNewLeaveType] = useState(false);
  const [deleteLeaveTypeId, setDeleteLeaveTypeId] = useState("");
  const {
    isOpen: isModifyLeaveTypeModalOpen,
    onOpen: onModifyLeaveTypeModalOpen,
    onClose: onModifyLeaveTypeModalClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteLeaveTypeAlertOpen,
    onOpen: onDeleteLeaveTypeAlertOpen,
    onClose: onDeleteLeaveTypeAlertClose,
  } = useDisclosure();
  const { data: LRLeaveTypeData, isLoading: isLoadingLRLeaveTypeData } =
    leaveRequestService.useGetAllLeaveType();
  const useModifyLeaveType = useMutation(leaveRequestService.modifyLeaveType, {
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
        queryClient.invalidateQueries("listLeaveType");
         toast({
          title: `${
            currentModifyLeaveTypeId != "" ? "Modify" : "Create"
          } Leave Type Successfully`,
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
  });
  const useDeleteLeaveType = useMutation(leaveRequestService.deleteLeaveType, {
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
        queryClient.invalidateQueries("listLeaveType");
        toast({
          title: `Delete Leave Type Successfully`,
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
  });
  const [initialValuesModifyLeaveType, setInitialValuesModifyLeaveType] =
    useState({
      name_New: "",
      description_New: "",
      annualLeave_New: false,
    });
  const [
    validationSchemaForCreateLeaveType,
    setValidationSchemaForCreateLeaveType,
  ] = useState(
    Yup.object().shape({
      name_New: Yup.string().required("This field is required"),
      description_New: Yup.string().required("This field is required"),
    })
  );
  const [
    validationSchemaForModifyLeaveType,
    setValidationSchemaForModifyLeaveType,
  ] = useState();
  const [objectLeaveType, setObjectLeaveType] = useState({});
  const resetModal = () => {
    setCurrentModifyLeaveTypeId("");
    setToggleAddNewLeaveType(false);
  };
  const handleAcceptDeleteLeaveType = () => {
    onDeleteLeaveTypeAlertClose();
    setDeleteLeaveTypeId("");
    useDeleteLeaveType.mutate(deleteLeaveTypeId);
  };
  useEffect(() => {
    setObjectLeaveType(() => {
      let tempObject = {};
      if (LRLeaveTypeData?.result?.data) {
        LRLeaveTypeData?.result?.data.map((item) => {
          tempObject[`name_${item.leaveTypeId}`] = item.name;
          tempObject[`description_${item.leaveTypeId}`] = item.description;
          tempObject[`annualLeave_${item.leaveTypeId}`] = item.annualLeave;
        });
      }
      return tempObject;
    });
  }, [isLoadingLRLeaveTypeData, LRLeaveTypeData]);
  useEffect(() => {
    setInitialValuesModifyLeaveType((prev) => {
      return { ...prev, ...objectLeaveType };
    });
    setValidationSchemaForModifyLeaveType((prev) => {
      let keys = Object.keys(objectLeaveType);
      let validateObj = {};
      keys.map((key) => {
        const splitArray = Helper.splitUnderscoreStringToArray(key);
        if (!splitArray.includes("annualLeave")) {
          validateObj[key] = Yup.string().required("This field is required");
        }
      });
      let temp = Yup.object().shape({ ...validateObj });
      return temp;
    });
  }, [objectLeaveType]);
  if (isLoadingLRLeaveTypeData) return <LoadingSpinner />;
  return (
    <>
      <Button colorScheme="teal" onClick={onModifyLeaveTypeModalOpen}>
        Modify Leave Type
      </Button>
      <Modal
        isOpen={isModifyLeaveTypeModalOpen}
        onClose={() => {
          onModifyLeaveTypeModalClose();
          resetModal();
        }}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <Formik
            initialValues={initialValuesModifyLeaveType}
            validationSchema={
              toggleAddNewLeaveType
                ? validationSchemaForCreateLeaveType
                : validationSchemaForModifyLeaveType
            }
            onSubmit={(values, actions) => {
              let modifyLeaveTypeObject = {};
              let keys = Object.keys(values);
              if (currentModifyLeaveTypeId != "") {
                keys.map((key) => {
                  const splitArray = Helper.splitUnderscoreStringToArray(key);
                  if (splitArray.includes(currentModifyLeaveTypeId)) {
                    if (splitArray.includes("name")) {
                      modifyLeaveTypeObject["name"] = values[key];
                    } else if (splitArray.includes("description")) {
                      modifyLeaveTypeObject["description"] = values[key];
                    } else if (splitArray.includes("annualLeave")) {
                      modifyLeaveTypeObject["annualLeave"] = values[key];
                    }
                  }
                });
                modifyLeaveTypeObject["leaveTypeId"] = currentModifyLeaveTypeId;
                useModifyLeaveType.mutate(modifyLeaveTypeObject);
              } else {
                keys.map((key) => {
                  const splitArray = Helper.splitUnderscoreStringToArray(key);
                  if (splitArray.includes("New")) {
                    if (splitArray.includes("name")) {
                      modifyLeaveTypeObject["name"] = values[key];
                    } else if (splitArray.includes("description")) {
                      modifyLeaveTypeObject["description"] = values[key];
                    } else if (splitArray.includes("annualLeave")) {
                      modifyLeaveTypeObject["annualLeave"] =
                        values[key] == "true" ? true : false;
                    }
                  }
                });
                useModifyLeaveType.mutate(modifyLeaveTypeObject);
              }
              onModifyLeaveTypeModalClose();
            }}
          >
            {(formik) => (
              <>
                <ModalHeader>Modify Leave Type</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Accordion allowToggle>
                    {LRLeaveTypeData &&
                      !toggleAddNewLeaveType &&
                      LRLeaveTypeData.result.data.map((item) => (
                        <AccordionItem key={item.name}>
                          <h2>
                            <AccordionButton>
                              <Box as="span" flex="1" textAlign="left">
                                {item.name}
                              </Box>
                              <AccordionIcon />
                            </AccordionButton>
                          </h2>
                          <AccordionPanel pb={4}>
                            <FormTextField
                              label="Leave Type Name"
                              name={`name_${item.leaveTypeId}`}
                            />
                            <FormTextField
                              label="Description"
                              isTextAreaField={true}
                              name={`description_${item.leaveTypeId}`}
                            />
                            <FormTextField
                              label="Is Annual Leave"
                              name={`annualLeave_${item.leaveTypeId}`}
                              isSelectionField={true}
                              selectionArray={selectionData.boolean}
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
                                  onDeleteLeaveTypeAlertOpen();
                                  setDeleteLeaveTypeId(item.leaveTypeId);
                                  onModifyLeaveTypeModalClose();
                                }}
                              >
                                Delete
                              </Button>
                              <Button
                                colorScheme="blue"
                                onClick={() => {
                                  setCurrentModifyLeaveTypeId(item.leaveTypeId);
                                  formik.handleSubmit();
                                }}
                              >
                                Save
                              </Button>
                            </Flex>
                          </AccordionPanel>
                        </AccordionItem>
                      ))}
                    {toggleAddNewLeaveType && (
                      <AccordionItem key="newShiftType">
                        <h2>
                          <AccordionButton
                            bg="primary1"
                            color="white"
                            _hover={{}}
                          >
                            <Box as="span" flex="1" textAlign="left">
                              New Leave Type
                            </Box>
                            <AccordionIcon />
                          </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                          <FormTextField
                            label="Leave Type Name"
                            name={`name_New`}
                          />
                          <FormTextField
                            label="Description"
                            isTextAreaField={true}
                            name={`description_New`}
                          />
                          <FormTextField
                            label="Is Annual Leave"
                            name={`annualLeave_New`}
                            isSelectionField={true}
                            selectionArray={selectionData.boolean}
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
                              onClick={() => setToggleAddNewLeaveType(false)}
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
                  {!toggleAddNewLeaveType && (
                    <Box mt="10px">
                      <Button
                        colorScheme="blue"
                        onClick={() => setToggleAddNewLeaveType(true)}
                      >
                        Add Another Leave Type
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
        isOpen={isDeleteLeaveTypeAlertOpen}
        onClose={onDeleteLeaveTypeAlertClose}
        onAccept={handleAcceptDeleteLeaveType}
        title="Delete Leave Type"
      />
    </>
  );
}

export default ModifyLeaveTypeModal;
