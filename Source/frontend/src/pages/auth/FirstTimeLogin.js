import React from "react";
import {
  Text,
  Stack,
  Center,
  Avatar,
  VStack,
  HStack,
  Select,
  Image,
  Button,
  Heading,
  Flex,
  Box,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Highlight,
} from "@chakra-ui/react";
import firstTimeLogin from "../../assets/firstTimeLogin.jpg";
import Profile from "../home/Setting/Profile";

function FirstTimeLogin() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Stack bgColor="gray.200" h="100vh">
        <Center m="auto" p={5} rounded="md" bg="white">
          <VStack spacing="15px">
            <Flex w="100%" gap="10px">
              <Box w="10px" bg="blue.700" borderRadius="5px"></Box>
              <Heading fontSize="1.5rem">First Time Login</Heading>
            </Flex>
            <Box>
              <Image src={firstTimeLogin} height="350px" />
            </Box>
            <Box textAlign="center">
              <Text fontSize="2xl" fontWeight="bold">
                Welcome to the system!{" "}
              </Text>
              <Text fontSize="xl">
                Please take a moment to fill out your profile information.
              </Text>
            </Box>
            <Button colorScheme="blue" onClick={onOpen}>
              Click here{" "}
            </Button>
          </VStack>
        </Center>
      </Stack>
      <Modal size="6xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Highlight
              query="First Time Update Profile Information"
              styles={{ px: "2", py: "1", rounded: "md", bg: "red.100" }}
            >
              First Time Update Profile Information
            </Highlight>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Profile />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default FirstTimeLogin;
