import {
  Stack,
  Box,
  Flex,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import PieChart from "../../../components/chart/PieChart";
import ColumnChart from "../../../components/chart/ColumnChart";
import DashboardCardGrid from "../../../components/DashboardCardGrid";
import { DashBoardDataBottom, DashBoardDataTop } from "../../../data/DashBoardData";
function Dashboard() {
  return (
    <Stack spacing={5} >
      <DashboardCardGrid dashboardData={DashBoardDataTop} />
      <Flex className="chart-section" justifyContent="space-between" gap={5} flexDirection={{base:'column',md:'row'}}>
        <Box width={{ sm:'100%%',md:'50%'}}>
          <PieChart />
        </Box>
        <Box width={{ sm:'100%',md:'50%'}}>
          <ColumnChart />
        </Box>
      </Flex>
      <DashboardCardGrid dashboardData={DashBoardDataBottom} />
    </Stack>
  );
}

export default Dashboard;
