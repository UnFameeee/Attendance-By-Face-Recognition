import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  SimpleGrid,
  Stack,
  Text,
  Icon,
  Center,
  Box,
  Flex,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BsArrowRightCircle } from "react-icons/bs";
function DashboardCardGrid({dashboardData}) {
  return (
    <SimpleGrid
      spacing={4}
      gridTemplateColumns="repeat(auto-fit, minmax(350px,1fr))"
    >
      {dashboardData &&
        dashboardData.map((item, index) => (
          <Card shadow='lg' key={index} bgColor={item.bgColor}>
            <CardBody color="white" paddingBottom={0}>
              <Flex alignItems="center">
                <Box display="flex" gap={2} flexDirection="column">
                  <Heading size="md"> {item.title}</Heading>
                  <Text>{item.content}</Text>
                </Box>
                <Flex justifyContent="flex-end" flex="1">
                  {item.icon}
                </Flex>
              </Flex>
            </CardBody>
            <CardFooter>
              <Center width="100%">
                <Link style={{ width: "100%" }} to={item.link}>
                  <Button
                    width="100%"
                    display="flex"
                    gap={2}
                    _hover={{
                      backgroundColor: "white",
                    }}
                  >
                    <Text>{item.linkTitle}</Text>
                    <Icon as={BsArrowRightCircle} boxSize={5} />
                  </Button>
                </Link>
              </Center>
            </CardFooter>
          </Card>
        ))}
    </SimpleGrid>
  );
}

export default DashboardCardGrid;