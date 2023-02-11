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
import { DashBoardData } from "../../../Utils/DashBoardData";
import { BsArrowRightCircle } from "react-icons/bs";
import ReactDOM from "react-dom";
import { Pie } from "@ant-design/plots";
import PieChart from "../../../components/PieChart";
import ColumnChart from "../../../components/ColumnChart";
function Dashboard() {
  return (
    <Stack spacing={5} paddingX={5} paddingY={4}>
      <SimpleGrid
        spacing={4}
        gridTemplateColumns="repeat(auto-fit, minmax(350px,1fr))"
      >
        {DashBoardData &&
          DashBoardData.map((item, index) => (
            <Card key={index} bgColor={item.bgColor}>
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
                    <Button width="100%" display="flex" gap={2}>
                      <Text>{item.linkTitle}</Text>
                      <Icon as={BsArrowRightCircle} boxSize={5} />
                    </Button>
                  </Link>
                </Center>
              </CardFooter>
            </Card>
          ))}
      </SimpleGrid>
      <Flex className="chart-section" justifyContent='space-between' gap={5}>
        <Box width="49%">
          <PieChart />
        </Box>
        <Box width="49%">
          <ColumnChart />
        </Box>
      </Flex>
      <SimpleGrid
        spacing={4}
        gridTemplateColumns="repeat(auto-fit, minmax(350px,1fr))"
      >
        {DashBoardData &&
          DashBoardData.map((item, index) => (
            <Card key={index} bgColor={item.bgColor}>
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
                    <Button width="100%" display="flex" gap={2}>
                      <Text>{item.linkTitle}</Text>
                      <Icon as={BsArrowRightCircle} boxSize={5} />
                    </Button>
                  </Link>
                </Center>
              </CardFooter>
            </Card>
          ))}
      </SimpleGrid>
    </Stack>
  );
}

export default Dashboard;
