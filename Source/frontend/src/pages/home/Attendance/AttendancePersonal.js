import React from "react";
import {
  Box,
  Heading,
  Stack,
  Image,
  Avatar,
  Text,
  HStack,
  VStack,
  Icon,
  Center,
  SimpleGrid,
  Badge,
  Flex,
  Button,
} from "@chakra-ui/react";
import {
  AiFillCheckCircle,
  AiOutlineLogin,
  AiOutlineLogout,
  AiFillClockCircle,
} from "react-icons/ai";
import { BsFillPersonLinesFill } from "react-icons/bs";
import test_img from "../../../assets/ta.jpeg";
function AttendancePersonal() {
  return (
    <Stack spacing={5}>
      <VStack
        paddingX={5}
        paddingY={4}
        bg="white"
        rounded="xl"
        alignItems="start"
        spacing="15px"
      >
        <Flex gap="10px">
          <Box w="10px" bg="blue.700" borderRadius="5px"></Box>
          <Heading fontSize="2rem" fontWeight="medium">
            Detail Employee
          </Heading>
        </Flex>
        <HStack
          w="100%"
          justifyContent="start"
          spacing="30px"
          gap={{
            base: "5px",
            md: "30px",
          }}
          flexDirection={{
            base: "column",
            md: "row",
          }}
        >
          <Avatar boxSize="120px" src={test_img} />
          <VStack
            ml="0 !important"
            w="100%"
            alignItems={{
              base: "center",
              md: "start",
            }}
          >
            <Heading fontSize="1.7rem">User Name</Heading>
            <HStack
              w="100%"
              spacing="3rem"
              flexDirection={{
                base: "column",
                md: "row",
              }}
              gap={{
                base: "5px",
                md: "30px",
              }}
            >
              <Flex
                alignItems={{
                  base: "center",
                  md: "start",
                }}
                flexDirection="column"
              >
                <Text fontSize="1.2rem">Role</Text>
                <Heading fontWeight="medium" fontSize="2xl">
                  Admin
                </Heading>
              </Flex>
              <Flex
                alignItems={{
                  base: "center",
                  md: "start",
                }}
                flexDirection="column"
                ml="0 !important"
              >
                <Text fontSize="1.2rem">Phone Number</Text>
                <Heading fontWeight="medium" fontSize="2xl">
                  213124643
                </Heading>
              </Flex>
              <Flex
                alignItems={{
                  base: "center",
                  md: "start",
                }}
                flexDirection="column"
                ml="0 !important"
              >
                <Text fontSize="1.2rem">Email Address</Text>
                <Heading fontWeight="medium" fontSize="2xl">
                  Admin@gmail.com
                </Heading>
              </Flex>
            </HStack>
          </VStack>
        </HStack>
        <SimpleGrid
          w="100%"
          spacing={4}
          gridTemplateColumns="repeat(auto-fit, minmax(240px,1fr))"
        >
          <HStack bg="blue.500" rounded="xl" p="15px" shadow="lg">
            <Center bg="blue.300" rounded="50%" boxSize="3rem">
              <Icon color="white" boxSize="30px" as={AiFillCheckCircle} />
            </Center>
            <Box color="white">
              <Heading fontSize="2xl">308</Heading>
              <Text fontSize="xl">Total Attendance</Text>
            </Box>
          </HStack>
          <HStack bg="green.500" rounded="xl" p="15px" shadow="lg">
            <Center bg="green.300" rounded="50%" boxSize="3rem">
              <Icon color="white" boxSize="30px" as={AiOutlineLogin} />
            </Center>
            <Box color="white">
              <Heading fontSize="2xl">08:46</Heading>
              <Text fontSize="xl">Avg Check in Time</Text>
            </Box>
          </HStack>
          <HStack bg="pink.500" rounded="xl" p="15px" shadow="lg">
            <Center bg="pink.300" rounded="50%" boxSize="3rem">
              <Icon color="white" boxSize="30px" as={AiOutlineLogout} />
            </Center>
            <Box color="white">
              <Heading fontSize="2xl">17:04</Heading>
              <Text fontSize="xl">Avg Check out Time</Text>
            </Box>
          </HStack>
          <HStack bg="orange.500" rounded="xl" p="15px" shadow="lg">
            <Center bg="orange.300" rounded="50%" boxSize="3rem">
              <Icon color="white" boxSize="30px" as={BsFillPersonLinesFill} />
            </Center>
            <Box color="white">
              <Heading fontSize="2xl">Role</Heading>
              <Text fontSize="xl">Admin</Text>
            </Box>
          </HStack>
        </SimpleGrid>
      </VStack>
      <VStack
        paddingX={5}
        paddingY={4}
        bg="white"
        rounded="xl"
        alignItems="start"
        justifyContent="center"
        spacing="15px"
      >
        <Flex gap="10px">
          <Box w="10px" bg="blue.700" borderRadius="5px"></Box>
          <Heading fontWeight="medium" fontSize="2rem">
            Attendance
          </Heading>
        </Flex>

        <HStack
          w="100%"
          alignItems="center"
          justifyContent="center"
          flexDirection={{
            base: "column",
            md: "row",
          }}
          gap="10px"
        >
          <HStack
            as={Button}
            h="100%"
            cursor="pointer"
            w={{
              base: "85%",
              sm: "60%",
              md: "50%",
              lg: "40%",
              xl: "30%",
            }}
            bg="green.400"
            rounded="xl"
            p="15px"
            shadow="lg"
          >
            <Center bg="green.300" rounded="50%" boxSize="3rem">
              <Icon color="white" boxSize="30px" as={AiOutlineLogin} />
            </Center>
            <Box color="white">
              <Heading fontSize="2xl">Check In &shy; &shy; &shy;</Heading>
            </Box>
          </HStack>
          <HStack
            ml="0 !important"
            as={Button}
            h="100%"
            cursor="pointer"
            w={{
              base: "85%",
              sm: "60%",
              md: "50%",
              lg: "40%",
              xl: "30%",
            }}
            bg="pink.400"
            rounded="xl"
            p="15px"
            shadow="lg"
          >
            <Center bg="pink.300" rounded="50%" boxSize="3rem">
              <Icon color="white" boxSize="30px" as={AiOutlineLogout} />
            </Center>
            <Box color="white">
              <Heading fontSize="2xl">Check Out</Heading>
            </Box>
          </HStack>
        </HStack>
      </VStack>
      <VStack
        paddingX={5}
        paddingY={4}
        bg="white"
        rounded="xl"
        alignItems="start"
        spacing="15px"
      >
        <Flex gap="10px">
          <Box w="10px" bg="blue.700" borderRadius="5px"></Box>
          <Heading fontWeight="medium" fontSize="2rem">
            Attendance History
          </Heading>
        </Flex>
        <SimpleGrid
          w="100%"
          spacing={3}
          gridTemplateColumns="repeat(auto-fit, minmax(285px,1fr))"
        >
          {Array.from({ length: 24 }, (_, index) => {
            return (
              <VStack
                color="white"
                alignItems="start"
                bg="gray.500"
                rounded="xl"
                p="20px"
                key={index}
                shadow="lg"
              >
                <HStack w="100%">
                  <HStack w="100%" flex="1" spacing="5px">
                    <Icon as={AiFillClockCircle} />
                    <Text fontSize="xl" fontWeight="bold">
                      3/27/2023
                    </Text>
                  </HStack>
                  {index % 2 == 0 ? (
                    <Badge rounded="md" colorScheme="green" fontSize="md">
                      On Time
                    </Badge>
                  ) : (
                    <Badge rounded="md" colorScheme="yellow" fontSize="md">
                      Late
                    </Badge>
                  )}
                </HStack>
                <HStack w="100%" spacing="50px">
                  <VStack alignItems="start">
                    <Text fontSize="xl">Check in</Text>
                    <Text fontSize="2xl" fontWeight="bold">
                      08:53
                    </Text>
                  </VStack>
                  <VStack alignItems="start">
                    <Text fontSize="xl">Check out</Text>
                    <Text fontSize="2xl" fontWeight="bold">
                      18:53
                    </Text>
                  </VStack>
                </HStack>
              </VStack>
            );
          })}
        </SimpleGrid>
      </VStack>
    </Stack>
  );
}

export default AttendancePersonal;
