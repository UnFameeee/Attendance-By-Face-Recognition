import React, { useContext } from "react";
import GlobalContext from "../../pages/home/WorkShift/context/GlobalContext";
import { Box, Checkbox } from "@chakra-ui/react";

export default function Labels() {
  const { labels, updateLabel } = useContext(GlobalContext);
  // console.log("labels", labels);
  return (
    <Box>
      <p className="text-gray-500 font-bold mt-10">Assigned Employee</p>
      <Box overflowY="scroll" maxH="370px">
        {labels.map(({ color, checked, title, name, id }, idx) => {
          // console.log(labels[idx]);
          return (
            <label key={idx} className="items-center mt-3 block">
              {/* <Checkbox
                isChecked={checked}
                onChange={() =>
                  updateLabel({
                    color: color,
                    title: title,
                    name: name,
                    id:id,
                    checked: !checked,
                  })
                }
              >
                <Box bg={color} p='5px' rounded='md'>{name}</Box>
              </Checkbox> */}
              <Box bg={color} p="5px" rounded="md">
                {name}
              </Box>
            </label>
          );
        })}
      </Box>
    </Box>
  );
}
