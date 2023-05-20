import { Stack, useToast, useDisclosure } from "@chakra-ui/react";
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
import ChakraAlertDialog from "../../../components/ChakraAlertDialog";
function Dashboard() {
  const toast = useToast();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(Helper.getUseDecodeInfor());
  const validateUserRetrain = async () => {
    const result = await employeeService.validateRetrain(userInfo.id);
    return result;
  };
  const { isOpen: isOpen, onOpen: onOpen, onClose: onClose } = useDisclosure();
  // const {data: pieChartData, isLoading: isLoadingPieChartData} = attendanceService.useGetAttendanceStatistic(userInfo.id)
  // const {data: columnChartData, isLoading: isLoadingColumnChartData} = attendanceService.useGetYearlyAttendanceStatistic(userInfo.id)
  function handleAccept() {
    navigate("/training-qr");
  }
  useEffect(() => {
    const fetchData = async () => {
      toast.closeAll();
      const data = await validateUserRetrain();
      if (!data.result) {
        onOpen();
      }
    };
    fetchData();
    return () => {
      // Clean up any resources or subscriptions here
      // (e.g., cancel ongoing requests, clear timers, etc.)
    };
  }, []);
  // if(isLoadingColumnChartData || isLoadingPieChartData ) return <LoadingSpinner />
  return (
    <Stack spacing={5}>
      <DashboardCardGrid dashboardData={DashBoardDataTop} />
      <ChakraAlertDialog
        title="Requiring to re-scan"
        message="We apologize for the inconvenience, but there was an error during the scanning procedure. Please attempt another scan."
        acceptButtonLabel="Accept"
        acceptButtonColor="blue"
        isOpen={isOpen}
        onClose={onClose}
        closeOnOverlayClick={false}
        onAccept={handleAccept}
        isNoCancel={true}
      />
    </Stack>
  );
}

export default Dashboard;
