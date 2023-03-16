import React from "react";
import { Column } from "@ant-design/plots";
import { Box } from "@chakra-ui/react";

function ColumnChart() {
  const data = [
    {
      action: "test 1",
      pv: 50000,
    },
    {
      action: "test 2",
      pv: 35000,
    },
    {
      action: "test 3",
      pv: 25000,
    },
    {
      action: "test 4",
      pv: 15000,
    },
    {
      action: "test 5",
      pv: 8500,
    },
  ];
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
    <Box bg='white' shadow='lg' rounded='md' p={3} >
      <Column {...config} />
    </Box>
  );
}

export default ColumnChart;
