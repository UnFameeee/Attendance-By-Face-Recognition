import { Box, Heading, HStack, Stack } from "@chakra-ui/react";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import PieChart from "../../../components/PieChart";
import ColumnChart from "../../../components/ColumnChart";
import ReactTableWithCharka from "../../../components/ReactTableWithCharka";
import AntdTable from "../../../components/AntdTable";

function General() {
  const sideBarWidth = useSelector(
    (state) => state.responsive.homeSideBarWidth
  );
  const screenPadding = "2rem";
  return (
    <Box
      minHeight="100vh"
    //   maxWidth={`calc(100vw - ${sideBarWidth}- ${screenPadding})`}
    >
      <Stack spacing={4} padding={screenPadding}>
        <Heading fontSize="3xl" fontWeight="semibold">
          Employees Overview
        </Heading>
        <HStack>
          <Box flex="1">
            <PieChart />
          </Box>
          <Box flex="1">
            <ColumnChart />
          </Box>
        </HStack>
        <AntdTable />
      </Stack>
    </Box>
  );
}

export default General;
