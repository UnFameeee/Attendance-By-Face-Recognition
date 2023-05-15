import React from "react";
import { Pie } from "@ant-design/plots";
import { Box } from "@chakra-ui/react";

function PieChart() {
  const data = [
    {
      type: "Check In",
      value: 27,
    },
    {
      type: "Check Out",
      value: 25,
    },
    {
      type: "Not Started",
      value: 15,
    },
  ];

  const checkInColor = "#61daab";
  const checkOutColor = "#6395f9 ";
  const notStartedColor = "#657798 ";

  const config = {
    appendPadding: 10,
    data,
    angleField: "value",
    colorField: "type",
    radius: 0.8,
    color: ({ type }) => {
      if (type === "Check In") {
        return checkInColor;
      }
      if (type === "Check Out") {
        return checkOutColor;
      }
      return notStartedColor;
    },
    label: {
      type: "outer",
      content: "{name} {percentage}", //{value}
    },
    interactions: [
      {
        type: "pie-legend-active",
      },
      {
        type: "element-active",
      },
    ],
  };
  return (
    <Box bg='white' shadow='2xl' rounded='md' p={3}>
      <Pie {...config} />
    </Box>
  );
}

export default PieChart;
