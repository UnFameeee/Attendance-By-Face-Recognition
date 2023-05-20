import React from "react";
import { Column } from "@ant-design/plots";
import { Box, Text } from "@chakra-ui/react";
import NoDataToDisplay from "../NoDataToDisplay";
function ColumnChart(props) {
  // const data = [
  //   {
  //     action: "test 1",
  //     pv: 50000,
  //   },
  //   {
  //     action: "test 2",
  //     pv: 35000,
  //   },
  //   {
  //     action: "test 3",
  //     pv: 25000,
  //   },
  //   {
  //     action: "test 4",
  //     pv: 15000,
  //   },
  //   {
  //     action: "test 5",
  //     pv: 8500,
  //   },
  // ];
  const { data } = props;
  const config = {
    data,
    xField: "action",
    yField: "pv",
    conversionTag: {},
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
  };
  return (
    <Box bg="white" shadow="2xl" rounded="md" p={3}>
      {data ? (
        <Column {...config} />
      ) : (
        <Box h='350px'  position='relative'>
          <Text position='absolute' fontSize='1.5rem' fontWeight='bold'>Column Chart</Text>
          <NoDataToDisplay />
        </Box>
      )}
    </Box>
  );
}

export default ColumnChart;
