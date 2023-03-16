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
import {
  DashBoardDataTop,
  DashBoardDataBottom,
} from "../../../Utils/DashBoardData";
import { BsArrowRightCircle } from "react-icons/bs";
import ReactDOM from "react-dom";
import { Pie } from "@ant-design/plots";
import PieChart from "../../../components/PieChart";
import ColumnChart from "../../../components/ColumnChart";
import DashboardCardGrid from "../../../components/DashboardCardGrid";
function Dashboard() {
  return (
    <Stack spacing={5} paddingX={5} paddingY={4}>
      <DashboardCardGrid dashboardData={DashBoardDataTop} />
      <Flex className="chart-section" justifyContent="space-between" gap={5} flexDirection={{base:'column', sm:'column',md:'row' ,lg:'row',xl:'row'}}>
        <Box width={{ sm:'100%%',md:'50%' ,lg:'50%',xl:'50%'}}>
          <PieChart />
        </Box>
        <Box width={{ sm:'100%',md:'50%' ,lg:'50%',xl:'50%'}}>
          <ColumnChart />
        </Box>
      </Flex>
      <DashboardCardGrid dashboardData={DashBoardDataBottom} />
    </Stack>
  );
}

export default Dashboard;
