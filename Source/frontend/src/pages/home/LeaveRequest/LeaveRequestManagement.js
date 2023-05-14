import React, { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import * as Yup from "yup";
import DynamicTable, {
  FilterType,
} from "../../../components/table/DynamicTable";
import DynamicDrawer from "../../../components/table/DynamicDrawer";
import ChakraAlertDialog from "../../../components/ChakraAlertDialog";
import NoDataToDisplay from "../../../components/NoDataToDisplay";
import LoadingSpinner from "../../../components/LoadingSpinner";
import {
  Badge,
  Box,
  Flex,
  Heading,
  Stack,
  useDisclosure,
  useToast,
  Highlight,
  Button,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import { useGetPermission } from "../../../hook/useGetPermission";
import { permissionLeaveRequestManagement } from "../../../screen-permissions/permission";
import { FaRegUserCircle } from "react-icons/fa";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { roleCodeColor } from "../../test/dumbTableData";
import { useGetListDepartment } from "../../../services/organization/department";
import { Formik } from "formik";
import FormTextField from "../../../components/field/FormTextField";
import { Helper } from "../../../Utils/Helper";
import { leaveRequestService } from "../../../services/leaveRequest/leaveRequest";
import { selectionData } from "../../../data/SelectionData";
import { approvalCodeColor } from "../../../data/ColorData";
function LeaveRequestManagement() {
  // #region declare variable
  const resultPermission = useGetPermission(
    permissionLeaveRequestManagement,
    "leave-request-management"
  );
  const toast = useToast();
  const queryClient = useQueryClient();
  const [editData, setEditData] = useState({});
  const [deleteSingleData, setDeleteSingleData] = useState({});
  const [userInfo, setUserInfo] = useState(Helper.getUseDecodeInfor());
  const [currentDate, setCurrentDate] = useState(new Date());
  const [departmentId, setDepartmentId] = useState(
    Helper.getUseDecodeInfor().departmentId ?? ""
  );
  const [listLRDepartment, setListLRDepartment] = useState([]);
  const [currentModifyLeaveTypeId, setCurrentModifyLeaveTypeId] = useState("");
  const [toggleAddNewLeaveType, setToggleAddNewLeaveType] = useState(false);
  const [deleteLeaveTypeId, setDeleteLeaveTypeId] = useState("");

  // #endregion
  // #region hooks
  const {
    isOpen: isDeleteSingleOpen,
    onOpen: onDeleteSingleOpen,
    onClose: onDeleteSingleClose,
  } = useDisclosure();
  const {
    isOpen: isAddEditOpen,
    onOpen: onAddEditOpen,
    onClose: onAddEditClose,
  } = useDisclosure();
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
  const useGetLeaveRequestOfDepartment = useMutation(
    leaveRequestService.getLeaveRequestOfDepartment,
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
          setListLRDepartment((prevList) => {
            let resultData = [...data?.result?.data];
            // const mergedResult = unionBy(resultData, prevList, "shiftId");
            queryClient.setQueryData("listLRDepartment", resultData);
            return resultData;
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
  const { data: listDepartmentData, isLoading: isLoadingListDepartment } =
    useGetListDepartment();
  let listDepartmentArray = React.useMemo(() => {
    if (listDepartmentData?.result?.data?.length > 0) {
      let tempArray = [];
      listDepartmentData?.result?.data.map((item) => {
        tempArray.push({
          label: item.departmentName,
          value: item.departmentId,
        });
      });
      return tempArray;
    }
  });
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
        refreshListLRDepartment();
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
  const useDeleteLeaveRequest = useMutation(
    leaveRequestService.deleteLeaveRequest,
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
          useGetLeaveRequestOfDepartment.mutate({
            departmentId,
            currentDate,
          });
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
    }
  );
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
  const useVerifyLeaveRequest = useMutation(
    leaveRequestService.verifyLeaveRequest,
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
          useGetLeaveRequestOfDepartment.mutate({
            departmentId,
            currentDate,
          });
          toast({
            title: "Verify Leave Request Successfully",
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
  // #endregion
  // #region functions
  const DeleteRange = (data) => {
    console.log("handleDeleteRange", data);
  };
  const Delete = (row, action) => {
    setDeleteSingleData(row);
    onDeleteSingleOpen();
  };
  const handleAcceptDelete = () => {
    // console.log(deleteSingleData);
    useDeleteLeaveRequest.mutate(deleteSingleData.leaveRequestId)
    setDeleteSingleData({});
    onDeleteSingleClose();
  };
  const Edit = (row, action) => {
    onAddEditOpen();
    setEditData(row);
  };
  const handleApprovalLeaveRequest = (values) => {
    let leaveRequestId = editData.leaveRequestId;
    let status = values.status;
    let leaveRequestObj = {
      leaveRequestId,
      status,
    };
    closeDrawer();
    if (status != "WAITING") useVerifyLeaveRequest.mutate(leaveRequestObj);
  };
  const closeDrawer = () => {
    onAddEditClose();
    setEditData({});
  };
  const matchingRoleColor = (value) => {
    return roleCodeColor.find(
      (item) => Object.keys(item)[0].toLowerCase() === value.toLowerCase()
    );
  };
  const handleAcceptDeleteLeaveType = () => {
    onDeleteLeaveTypeAlertClose();
    setDeleteLeaveTypeId("");
    useDeleteLeaveType.mutate(deleteLeaveTypeId);
  };
  const resetModal = () => {
    setCurrentModifyLeaveTypeId("");
    setToggleAddNewLeaveType(false);
  };
  const refreshListLRDepartment = () => {
    if (departmentId) {
      if (userInfo.roleName == "employee") {
        useGetLeaveRequestOfDepartment.mutate({
          departmentId,
          currentDate,
        });
      } else {
        useGetLeaveRequestOfDepartment.mutate({
          departmentId,
          currentDate,
        });
      }
    }
  };
  // #endregion
  // #region table
  const tableRowAction = [
    {
      actionName: "Edit",
      func: Edit,
      isDisabled: resultPermission?.update,
    },
    {
      actionName: "Delete",
      func: Delete,
      isDisabled: resultPermission?.delete,
    },
  ];
  const columns = React.useMemo(
    () => [
      {
        Header: "Id",
        accessor: "leaveRequestId",
        // haveFilter: {
        //   filterType: FilterType.Text,
        // },
        cellWidth: "150px",
        hidden: true,
      },
      {
        Header: "Status",
        accessor: "status",
        // haveFilter: {
        //   filterType: FilterType.Default,
        // },
        Cell: ({ value }) => (
          <Badge
            p="5px"
            fontSize="lg"
            colorScheme={
              Object.values(
                Helper.matchingCodeColor(value, approvalCodeColor)
              )[0]
            }
          >
            {value}
          </Badge>
        ),
        cellWidth: "150px",
      },
      {
        Header: "Full Name",
        accessor: "employee.fullname",
        // haveFilter: {
        //   filterType: FilterType.Text,
        // },

        cellWidth: "150px",
      },
      {
        Header: "Email",
        accessor: "employee.email",
        // haveFilter: {
        //   filterType: FilterType.Default,
        // },
      },

      {
        Header: "Department",
        accessor: "employee.department.departmentName",
        cellWidth: "150px",
        Cell: ({ value }) => <span>{value}</span>,
        // haveFilter: {
        //   filterType: FilterType.Text,
        // },
      },
      {
        Header: "Leave type",
        accessor: "leaveType.name",
        // haveFilter: {
        //   filterType: FilterType.Default,
        // },
        cellWidth: "150px",
      },
      {
        Header: "Reason",
        accessor: "reason",
        // haveFilter: {
        //   filterType: FilterType.Default,
        // },
        cellWidth: "150px",
      },
      {
        Header: "Request date",
        accessor: "requestDate",
        // haveFilter: {
        //   filterType: FilterType.DateTime,
        // },
        cellWidth: "100px",
        type: "date",
      },
      {
        Header: "Start date",
        accessor: "startDate",
        // haveFilter: {
        //   filterType: FilterType.DateTime,
        // },
        cellWidth: "100px",
        type: "date",
      },
      {
        Header: "End date",
        accessor: "endDate",
        // haveFilter: {
        //   filterType: FilterType.DateTime,
        // },
        cellWidth: "100px",
        type: "date",
      },
      {
        Header: "Note",
        accessor: "note",
        // haveFilter: {
        //   filterType: FilterType.Default,
        // },
        cellWidth: "150px",
      },
    ],
    []
  );
  // #endregion
  // #region drawer
  const drawerFieldData = [
    {
      name: "status",
      label: "Status",
      isSelectionField: true,
      selectionArray: selectionData.verifyData,
    },
    {
      name: "fullname",
      isReadOnly: true,
      label: "Full Name",
      placeholder: "Enter your Full Name",
      leftIcon: <FaRegUserCircle color="#999" fontSize="1.5rem" />,
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "abc@gmail.com",
      isReadOnly: true,
      leftIcon: <MdOutlineAlternateEmail color="#999" fontSize="1.5rem" />,
    },
    {
      name: "role",
      label: "Role",
      isReadOnly: true,
      placeholder: "---",
    },
    {
      name: "department",
      label: "Department",
      placeholder: "---",
      isReadOnly: true,
    },
    {
      name: "leaveType",
      label: "Leave Type",
      placeholder: "---",
      isReadOnly: true,
    },
    {
      name: "reason",
      label: "Reason",
      isReadOnly: true,
      isTextAreaField: true,
      placeholder: "---",
    },
    {
      name: "note",
      label: "Note",
      isReadOnly: true,
      isTextAreaField: true,
      placeholder: "---",
    },
    {
      name: "requestDate",
      label: "Request Date",
      isReadOnly: true,
      placeholder: "---",
    },
    {
      name: "startDate",
      label: "Start Date",
      isReadOnly: true,
      placeholder: "---",
    },
    {
      name: "endDate",
      label: "End Date",
      isReadOnly: true,
      placeholder: "---",
    },
  ];
  const initialValues = {
    status: editData?.status ?? "",
    fullname: editData["employee.fullname"] ?? "",

    email: editData?.email ?? "",
    role: editData?.role ?? "",
    department: editData?.department ?? "",

    leaveType: editData["leaveType.name"] ?? "",
    requestDate: editData?.requestDate
      ? Helper.getMomentDateFormat(editData?.requestDate)
      : "",
    startDate: editData?.startDate
      ? Helper.getMomentDateFormat(editData?.startDate)
      : "",
    endDate: editData?.endDate
      ? Helper.getMomentDateFormat(editData?.endDate)
      : "",
    reason: editData?.reason ?? "",
    note: editData?.note ?? "",
  };
  const validationSchema = Yup.object().shape();
  // #endregion
  // #region form and Modal
  const [initialValuesModifyLeaveType, setInitialValuesModifyLeaveType] =
    useState({
      name_New: "",
      description_New: "",
      annualLeave_New: false,
    });
  const initialValuesSelectDepartment = {
    department: departmentId,
  };
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
  // #endregion
  // #region useEffect
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
  useEffect(() => {
    refreshListLRDepartment();
  }, []);

  // #endregion
  return (
    <Stack h="100%" spacing={4}>
      <Flex gap="10px">
        <Box w="10px" bg="blue.700" borderRadius="5px"></Box>
        <Heading fontSize="3xl">Leave Request Management</Heading>
      </Flex>
      <HStack w="fit-content" bg="white" rounded="md" p="3">
        {userInfo?.roleName == "admin" && (
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
                        const splitArray =
                          Helper.splitUnderscoreStringToArray(key);
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
                      modifyLeaveTypeObject["leaveTypeId"] =
                        currentModifyLeaveTypeId;
                      useModifyLeaveType.mutate(modifyLeaveTypeObject);
                    } else {
                      keys.map((key) => {
                        const splitArray =
                          Helper.splitUnderscoreStringToArray(key);
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
                    // onModifyLeaveTypeModalClose();
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
                                      }}
                                    >
                                      Delete
                                    </Button>
                                    <Button
                                      colorScheme="blue"
                                      onClick={() => {
                                        setCurrentModifyLeaveTypeId(
                                          item.leaveTypeId
                                        );
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
                                    onClick={() =>
                                      setToggleAddNewLeaveType(false)
                                    }
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
        )}
        <Heading fontSize="xl" fontWeight="medium">
          <Highlight
            query={["Department:"]}
            styles={{ px: "2", py: "1", rounded: "full", bg: "purple.100" }}
          >
            Department:
          </Highlight>
        </Heading>
        <Formik
          initialValues={initialValuesSelectDepartment}
          onSubmit={(values, actions) => {
            const departmentId = values.department;
            setDepartmentId(departmentId);
            if (departmentId) {
              useGetLeaveRequestOfDepartment.mutate({
                departmentId,
                currentDate,
              });
            }
          }}
        >
          {(formik) => (
            <HStack
              alignItems="center"
              as="form"
              onSubmit={formik.handleSubmit}
            >
              <FormTextField
                name="department"
                placeholder="---"
                isReadOnly={userInfo?.roleName == "manager"}
                isSelectionField={true}
                selectionArray={
                  listDepartmentArray ? [...listDepartmentArray] : []
                }
              />
              {userInfo?.roleName != "manager" && (
                <div className=" mt-[6px]">
                  <Button colorScheme="blue" type="submit" size="md">
                    Submit
                  </Button>
                </div>
              )}
            </HStack>
          )}
        </Formik>
      </HStack>
      <Box marginTop="10px">
        {false ? (
          <NoDataToDisplay h="450px" />
        ) : (
          <>
            <DynamicTable
              onAddEditOpen={onAddEditOpen}
              handleDeleteRange={DeleteRange}
              tableRowAction={tableRowAction}
              columns={columns}
              data={listLRDepartment}
              permission={resultPermission}
              noPaging={true}
            />
            <DynamicDrawer
              handleEdit={handleApprovalLeaveRequest}
              isAddEditOpen={isAddEditOpen}
              onAddEditClose={onAddEditClose}
              editData={editData}
              setEditData={setEditData}
              validationSchema={validationSchema}
              initialValues={initialValues}
              drawerFieldData={drawerFieldData}
            />
            <ChakraAlertDialog
              title="Delete Single"
              isOpen={isDeleteSingleOpen}
              onClose={onDeleteSingleClose}
              onAccept={handleAcceptDelete}
            />
          </>
        )}
      </Box>
    </Stack>
  );
}

export default LeaveRequestManagement;
