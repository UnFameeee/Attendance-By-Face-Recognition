import React, { useContext } from "react";
import GlobalContext from "../../pages/home/WorkShift/context/GlobalContext";
import { RiCheckboxBlankFill } from "react-icons/ri";
import { Flex, Icon, Box } from "@chakra-ui/react";
const labelsClasses = ["indigo", "gray", "green", "blue", "red", "purple"];

function ListEmployee() {
  const { labels, updateLabel } = useContext(GlobalContext);
  return (
    <Box mt='20px'>
      <p className="text-gray-500 font-bold mb-3 ">List Employee</p>
      <Box h='170px' overflowY='scroll'>
        {labelsClasses.map((item, idx) => (
          <Flex key={idx} className="items-center mt-3 block cursor-pointer">
            <RiCheckboxBlankFill className={`text-${item}-400 text-xl`} />
            <span className="ml-2 text-gray-700 capitalize">{item}</span>
          </Flex>
        ))}
      </Box>
    </Box>
  );
}

export default ListEmployee;
