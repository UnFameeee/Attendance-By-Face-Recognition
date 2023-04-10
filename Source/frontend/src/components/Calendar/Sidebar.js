import React from "react";
import CreateEventButton from "./CreateEventButton";
import SmallCalendar from "./SmallCalendar";
import Labels from "./Labels";
import ListEmployee from "./ListEmployee";
import { Box, Flex } from "@chakra-ui/react";
export default function Sidebar() {
  return (
    <aside className="border p-5 w-64">
      <CreateEventButton />
      <SmallCalendar />
      <Labels />
      {/* <ListEmployee /> */}
    </aside>
  );
}
