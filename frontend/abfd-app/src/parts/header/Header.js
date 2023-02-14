import { Box, Button, Center, Flex, Heading } from "@chakra-ui/react";
import React from "react";
import { Link, NavLink } from "react-router-dom";

function Header() {
  return (
    <Box
      paddingX="5"
      paddingY="5"
      position="absolute"
      zIndex="1000"
      width="100vw"
    >
      <Flex alignItems="center">
        <Box>
          <Heading fontSize="lg">Attendance By Face Recognition</Heading>
        </Box>
        <Box flex="1">
          <nav>
            <Center justifyContent="flex-end" flexDirection="row" gap="2">
              <Link to="home">
                <Button
                  bgColor="blue.600"
                  color="whitesmoke"
                  _hover={{
                    color: "black",
                    background: "whitesmoke",
                  }}
                >
                  Home
                </Button>
              </Link>
              <NavLink to="sign-in" className="auth-header-nav">
                <Box className="nav-wrapper" p="10px">
                  Sign in
                </Box>
              </NavLink>

              <NavLink to="sign-up" className="auth-header-nav">
                <Box className="nav-wrapper" p="10px">
                  Sign up
                </Box>
              </NavLink>
            </Center>
          </nav>
        </Box>
      </Flex>
    </Box>
  );
}

export default Header;
