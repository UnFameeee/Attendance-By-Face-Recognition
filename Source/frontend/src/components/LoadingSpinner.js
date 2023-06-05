import { Center, Spinner } from "@chakra-ui/react";
import React from "react";

function LoadingSpinner() {
  return (
    <Center h="100%" >
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />
    </Center>
  );
}

export default LoadingSpinner;
