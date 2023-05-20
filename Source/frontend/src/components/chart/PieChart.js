import React from "react";
import { Pie } from "@ant-design/plots";
import { Box, Text } from "@chakra-ui/react";
import NoDataToDisplay from "../NoDataToDisplay";

function PieChart(props) {
  // const data = [
  //   {
  //     type: "Attendance Day",
  //     value: 20,
  //   },
  //   {
  //     type: "Leave Day",
  //     value: 2,
  //   },
  // ];
  const { data } = props;
  const color1 = "#61daab";
  const color2 = "#6395f9 ";
  const color3 = "#657798 ";

  const config = {
    appendPadding: 10,
    data,
    angleField: "value",
    colorField: "type",
    radius: 0.8,
    color: ({ type }) => {
      if (type === "Attendance Day") {
        return color2;
      }
      if (type === "Leave Day") {
        return color3;
      }
      return color3;
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
    <Box bg="white" shadow="2xl" rounded="md" p={3}>
      {data ? (
        <Pie {...config} />
      ) : (
        <Box h="350px" position='relative'>
          <Text position='absolute' fontSize='1.5rem' fontWeight='bold'>Pie Chart</Text>
          <NoDataToDisplay />
        </Box>
      )}
    </Box>
  );
}

export default PieChart;
