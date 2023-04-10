import React, { useContext } from "react";
import GlobalContext from "../../pages/home/WorkShift/context/GlobalContext";
import { Box } from "@chakra-ui/react";

export default function Labels() {
  const { labels, updateLabel } = useContext(GlobalContext);
  return (
    <Box>
      <p className="text-gray-500 font-bold mt-10">Assigned Employee</p>
      <Box overflowY="scroll" maxH="370px">
        {labels.map(({ label: lbl, checked }, idx) => (
          <label key={idx} className="items-center mt-3 block">
            <input
              type="checkbox"
              checked={checked}
              onChange={() => updateLabel({ label: lbl, checked: !checked })}
              className={`form-checkbox h-5 w-5 text-${lbl}-400 rounded focus:ring-0 cursor-pointer`}
            />
            <span className="ml-2 text-gray-700 capitalize">{lbl}</span>
          </label>
        ))}
      </Box>
    </Box>
  );
}
