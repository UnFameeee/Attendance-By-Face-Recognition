import {
  Avatar,
  Box,
  Center,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Stack,
  Text,
  Icon,
  Textarea,
  Image,
  HStack,
  Button,
  ButtonGroup,
} from "@chakra-ui/react";
import React from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { BsCheckCircleFill, BsTelephone } from "react-icons/bs";
import { AiOutlineCloudUpload } from "react-icons/ai";
import ta_test_avt from "../../../assets/ta.jpeg";
import google_logo from "../../../assets/google-ar21-removebg-preview.png";
function Profile() {
  return (
    <Stack minHeight="100vh" spacing={3} paddingX={20} paddingY={8}>
      <Flex justifyContent="space-between">
        <Box>
          <Heading>General Details</Heading>
          <Text>Update your photo and personal details here.</Text>
        </Box>
        <HStack>
          <Button variant="outline" bgColor="white" size="lg">
            Cancel
          </Button>
          <Button size="lg" colorScheme="blue">
            Save
          </Button>
        </HStack>
      </Flex>
      <Flex gap={8}>
        <Stack
          bgColor="white"
          flex="1"
          border="0.5px solid #cfd3df"
          rounded="lg"
        >
          <Box p={4} px={8}>
            <Heading fontSize="xl">Personal Information</Heading>
          </Box>
          <Divider />
          <Stack spacing={3} p={4} px={8}>
            <Flex gap={8}>
              <FormControl>
                <FormLabel>Full Name</FormLabel>
                <InputGroup>
                  <InputLeftElement
                    pl={2}
                    children={
                      <FaRegUserCircle color="#999" fontSize="1.5rem" />
                    }
                  />
                  <Input type="text" placeholder="Enter First name" />
                </InputGroup>
              </FormControl>
              <FormControl>
                <FormLabel>Last Name</FormLabel>
                <InputGroup>
                  <InputLeftElement
                    pl={2}
                    children={
                      <FaRegUserCircle color="#999" fontSize="1.5rem" />
                    }
                  />
                  <Input type="text" placeholder="Enter Last name" />
                </InputGroup>
              </FormControl>
            </Flex>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <InputGroup>
                <InputLeftElement
                  pl={2}
                  children={
                    <MdOutlineAlternateEmail color="#999" fontSize="1.5rem" />
                  }
                />
                <InputRightElement
                  pr={2}
                  children={
                    <BsCheckCircleFill color="#999" fontSize="1.5rem" />
                  }
                />
                <Input type="email" placeholder="Enter your email" />
              </InputGroup>
            </FormControl>
            <FormControl>
              <FormLabel>Phone number</FormLabel>
              <InputGroup>
                <InputLeftElement
                  pl={2}
                  children={<BsTelephone color="#999" fontSize="1.4rem" />}
                />
                <InputRightElement
                  pr={2}
                  children={
                    <BsCheckCircleFill color="#999" fontSize="1.5rem" />
                  }
                />
                <Input type="number" placeholder="Enter your number" />
              </InputGroup>
            </FormControl>
            <FormControl>
              <FormLabel>Birth Date</FormLabel>
              <InputGroup>
                <Input type="date" placeholder="Select Date and Time" />
              </InputGroup>
            </FormControl>
            <FormControl>
              <FormLabel>About</FormLabel>
              <Textarea resize="none" placeholder="Describe yourself..." />
            </FormControl>
          </Stack>
        </Stack>
        <Stack
          bgColor="white"
          flex="1"
          border="0.5px solid #cfd3df"
          rounded="lg"
        >
          <Box p={4} px={8}>
            <Heading fontSize="xl">Your Photo</Heading>
          </Box>
          <Divider />
          <Flex height='100%' p={4} px={8} gap={10}>
            <Flex flex={1} gap={7} py={2} flexDirection="column">
              <Flex gap={4} flexDirection="row" alignItems="center">
                <Avatar src={ta_test_avt} boxSize="80px" />
                <Box
                  display="flex"
                  flexDirection="column"
                  gap={3}
                  fontSize="large"
                >
                  <Text fontWeight="bold">Edit your photo</Text>
                  <Flex gap={2}>
                    <Text cursor="pointer" color="#999">
                      Delete
                    </Text>
                    <Text cursor="pointer" color='link'>
                      Update
                    </Text>
                  </Flex>
                </Box>
              </Flex>
              <Center display='flex' flexDirection='column' flex={1}
                cursor="pointer"
                boxSizing="border-box"
                rounded="lg"
                border="2px dashed #999"
                height="100%"
              >
                <Center pt={10} pb={5}>
                  <Icon boxSize={20} color="#999" as={AiOutlineCloudUpload} />
                </Center>
                <Center>
                  <Text color="#4374e3" mr={1}>
                    Click to upload
                  </Text>
                  <Text>or drag and drop</Text>
                </Center>
                <Center display="flex" flexDirection="column">
                  <Text>SVG, PNG, JPEG or GIF</Text>
                  <Text>(max. 800x400px)</Text>
                </Center>
              </Center>
            </Flex>
            <Box mt={2} flex={1}>
              <Flex alignItems="center" justifyContent="space-between">
                <Image src={google_logo} width="150px" />
                <Box p={2} rounded="md" bgColor="#d8ffee">
                  <Text fontWeight="bold" color="#54c793">
                    Connected
                  </Text>
                </Box>
              </Flex>
              <Box mt={7} pl={2} fontSize="1.3rem">
                <Text fontWeight="bold">Google</Text>
                <Text>Use Google to sign in your account.</Text>
                <Text color='link' cursor="pointer">
                  Click here to learn more.
                </Text>
              </Box>
            </Box>
          </Flex>
        </Stack>
      </Flex>
    </Stack>
  );
}

export default Profile;
