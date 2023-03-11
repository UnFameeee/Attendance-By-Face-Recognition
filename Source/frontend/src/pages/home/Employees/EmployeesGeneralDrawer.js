import React, { useEffect, useState } from "react";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Button,
  Input,
  Text,
  Stack,
  Flex,
  Box,
} from "@chakra-ui/react";
import { Field, Formik } from "formik";
import * as Yup from "yup";
import { phoneRegExp } from "../../../Utils/ValidationRegExp";
import FormTextField from "../../../components/FormTextField";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { FaRegUserCircle, FaGrinStars } from "react-icons/fa";
import { MdOutlineAlternateEmail } from "react-icons/md";
import {
  BsCheckCircleFill,
  BsTelephone,
  BsCalendar2Date,
} from "react-icons/bs";
import { RiFolderUserLine } from "react-icons/ri";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { GiOfficeChair } from "react-icons/gi";
import { IoImageOutline } from "react-icons/io5";
function EmployeesGeneralDrawer(props) {
  const { openDrawerToEdit, setOpenDrawerToEdit, editData, setEditData } = props;
  const { isOpen, onOpen, onClose, getDisclosureProps } = useDisclosure();
  const [drawerTitle, setDrawerTitle] = useState("");
  const btnRef = React.useRef();
  const initialValues = {
    fullName: `${editData.fullName ? editData.fullName : ""}`,
    email: `${editData.email ? editData.email : ""}`,
    phone: `${editData.phoneNumber ? editData.phoneNumber : ""}`,
    address: `${editData.address ? editData.address : ""}`,
    picture: `${editData.picture ? editData.picture : ""}`,
    role: `${editData.role ? editData.role : ""}`,
  };
  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required("This field is required"),
    email: Yup.string().required("This field is required"),
    address: Yup.string().required("This field is required"),
    role: Yup.string().required("This field is required"),
    picture: Yup.string().required("This field is required"),
    phone: Yup.string(),
  });
  const handleOpen = () => {
    setDrawerTitle("Create");
    onOpen();
  };
  const handleClose = () => {
    setOpenDrawerToEdit(false);
    setEditData({})
    onClose();
  };
  useEffect(() => {
    if (openDrawerToEdit) {
      setDrawerTitle("Edit");
      onOpen();
    }
  }, [openDrawerToEdit]);
  
  return (
    <>
      <Button ref={btnRef} colorScheme="blue" onClick={handleOpen}>
        Add New
      </Button>

      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={handleClose}
        finalFocusRef={btnRef}
        size="md"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{drawerTitle}</DrawerHeader>
          <DrawerBody>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={(values, actions) => {
                console.log("actions", actions);
                alert(JSON.stringify(values, null, 2));
                actions.resetForm();
                setEditData({})
                handleClose()
              }}
            >
              {(formik) => (
                <Stack
                  display="flex"
                  height="100%"
                  as="form"
                  onSubmit={formik.handleSubmit}
                >
                  <Box flex="1">
                    <Flex gap={8}>
                      <FormTextField
                        name="fullName"
                        label="Full Name"
                        placeholder="Enter your Full Name"
                        leftIcon={
                          <FaRegUserCircle color="#999" fontSize="1.5rem" />
                        }
                      />
                    </Flex>
                    <FormTextField
                      name="picture"
                      label="Picture"
                      leftIcon={
                        <IoImageOutline color="#999" fontSize="1.5rem" />
                      }
                    />

                    <FormTextField
                      name="email"
                      label="Email"
                      type="email"
                      placeholder="abc@gmail.com"
                      leftIcon={
                        <MdOutlineAlternateEmail
                          color="#999"
                          fontSize="1.5rem"
                        />
                      }
                    />
                    <FormTextField
                      name="phone"
                      label="Phone number"
                      type="text"
                      placeholder="Enter your number"
                      leftIcon={<BsTelephone color="#999" fontSize="1.4rem" />}
                    />
                    <Flex gap={8}>
                      <FormTextField
                        isSelectionField={true}
                        selectionArray={[
                          {
                            label: "Project Manager",
                            value: "Project Manager",
                          },
                          { label: "Estimator", value: "Estimator" },
                          { label: "Electrician", value: "Electrician" },
                          {
                            label: "Construction Worker",
                            value: "Construction Worker",
                          },
                          {
                            label: "Construction Manager",
                            value: "Construction Manager",
                          },
                          { label: "Engineer", value: "Engineer" },
                        ]}
                        name="role"
                        label="Role"
                        type="text"
                        placeholder="Employee"
                        leftIcon={
                          <RiFolderUserLine color="#999" fontSize="1.5rem" />
                        }
                      />
                    </Flex>
                    <FormTextField
                      isTextAreaField={true}
                      name="address"
                      label="Address"
                      height="150px"
                      placeholder="Enter your address"
                      formik={formik}
                    />
                  </Box>
                  <Flex justifyContent="flex-end" marginTop="auto">
                    <Button variant="outline" mr={3} onClick={handleClose}>
                      Cancel
                    </Button>
                    <Button type="submit" colorScheme="blue">
                      Save
                    </Button>
                  </Flex>
                </Stack>
              )}
            </Formik>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default EmployeesGeneralDrawer;
