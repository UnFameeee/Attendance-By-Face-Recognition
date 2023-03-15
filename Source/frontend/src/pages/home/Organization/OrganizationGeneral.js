import React from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel, Box, Stack } from "@chakra-ui/react";

function OrganizationGeneral() {
  return (
    <Stack minHeight="100vh" spacing={4} padding={2}>
      <Tabs>
        <TabList>
          <Tab>One</Tab>
          <Tab>Two</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <p>one!</p>
          </TabPanel>
          <TabPanel>
            <p>two!</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Stack>
  );
}

export default OrganizationGeneral;
