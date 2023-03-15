import React from "react";
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Flex,
  Box,
  Stack,Button,
} from "@chakra-ui/react";
import { Formik } from "formik";
import FormTextField from "./FormTextField";

function DynamicDrawer(props) {
  const {
    isAddEditOpen,
    onAddEditClose,
    editData,
    setEditData,
    initialValues,
    validationSchema,
    drawerFieldData,
    position,
    size,
  } = props;
  const btnRef = React.useRef();
  const handleClose = () => {
    setEditData({});
    onAddEditClose();
  };
  return (
    <Drawer
      isOpen={isAddEditOpen}
      placement={position ?? "right"}
      onClose={handleClose}
      finalFocusRef={btnRef}
      size={size ?? "md"}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>
          {Object.keys(editData).length > 0 ? "Edit" : "Add"}
        </DrawerHeader>

        <DrawerBody>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, actions) => {
              console.log("actions", actions);
              alert(JSON.stringify(values, null, 2));
              actions.resetForm();
              setEditData({});
              onAddEditClose();
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
                  {drawerFieldData &&
                    drawerFieldData.map((item) => (
                      <FormTextField key={item.name}
                        {...item}
                      />
                    ))}
                </Box>
                <Flex justifyContent="flex-end" marginTop="auto">
                  <Button variant="outline" mr={3} onClick={onAddEditClose}>
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
  );
}

export default DynamicDrawer;
