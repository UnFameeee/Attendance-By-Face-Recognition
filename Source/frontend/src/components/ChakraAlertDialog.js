import React from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";

function ChakraAlertDialog(props) {
  const {
    isOpen,
    onClose,
    onAccept,
    message,
    type,
    title,
    acceptButtonLabel,
    acceptButtonColor,
    closeOnOverlayClick,
    isNoCancel,
    isLoading,
  } = props;
  const cancelRef = React.useRef();

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      closeOnOverlayClick={closeOnOverlayClick}
      isCentered
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {title || ""}
          </AlertDialogHeader>

          <AlertDialogBody>
            {message || "Are you sure? You can't undo this action afterwards."}
          </AlertDialogBody>
          <AlertDialogFooter>
            {!isNoCancel && (
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
            )}
            <Button
              type={type ?? "none"}
              colorScheme={acceptButtonColor ?? "red"}
              onClick={onAccept}
              ml={3}
            >
              {acceptButtonLabel ?? "Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}

export default ChakraAlertDialog;
