import {
  Stack,
  Box,
  Flex,
  useToast,
  Link,
  Button,
  Text,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import PieChart from "../../../components/chart/PieChart";
import ColumnChart from "../../../components/chart/ColumnChart";
import DashboardCardGrid from "../../../components/DashboardCardGrid";
import {
  DashBoardDataBottom,
  DashBoardDataTop,
} from "../../../data/DashBoardData";
import { employeeService } from "../../../services/employee/employee";
import { Helper } from "../../../Utils/Helper";
import { useNavigate } from "react-router-dom";
import { attendanceService } from "../../../services/attendance/attendance";
import LoadingSpinner from "../../../components/LoadingSpinner";
function Dashboard() {
  const toast = useToast();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(Helper.getUseDecodeInfor());
  const validateUserRetrain = async () => {
    const result = await employeeService.validateRetrain(userInfo.id);
    return result;
  };
  // const {data: pieChartData, isLoading: isLoadingPieChartData} = attendanceService.useGetAttendanceStatistic(userInfo.id)
  // const {data: columnChartData, isLoading: isLoadingColumnChartData} = attendanceService.useGetYearlyAttendanceStatistic(userInfo.id)

  useEffect(async () => {
    toast.closeAll();
    const data = await validateUserRetrain();
    if (data.result) {
      toast({
        title: (
          <Box
            cursor="pointer"
            onClick={() => {
              navigate("training-qr");
              toast.closeAll();
            }}
          >
            <Text>Requesting to re-scan your face!</Text>
            <Text>Click here to perform the action!</Text>
          </Box>
        ),
        position: "bottom-right",
        status: "warning",
        isClosable: true,
        duration: 50000,
      });
    }
  }, []);
  // if(isLoadingColumnChartData || isLoadingPieChartData ) return <LoadingSpinner />
  return (
    <Stack spacing={5}>
      <DashboardCardGrid dashboardData={DashBoardDataTop} />
      {/* <Flex
        className="chart-section"
        justifyContent="space-between"
        gap={5}
        flexDirection={{ base: "column", md: "row" }}
      >
        <Box width={{ sm: "100%%", md: "50%" }}>
          <PieChart data={pieChartData} />
        </Box>
        <Box width={{ sm: "100%", md: "50%" }}>
          <ColumnChart data={columnChartData} />
        </Box>
      </Flex> */}
      {/* <DashboardCardGrid dashboardData={DashBoardDataBottom} /> */}
    </Stack>
  );
}

export default Dashboard;
