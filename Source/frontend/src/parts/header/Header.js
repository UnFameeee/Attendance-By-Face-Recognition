import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Show,
  Hide,
  Avatar,
} from "@chakra-ui/react";
import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import webLogo from '../../assets/favicon.ico';
function Header() {
  const location = useLocation();
  return (
    <Box paddingX="5" paddingY="5" height="80px" width="100vw">
      <Flex alignItems="center">
        <Hide below="sm">
          <Flex alignItems='center' gap='5px' bg="white" p="3" rounded="md">
            <Avatar boxSize='40px' src={webLogo} />
            <Heading fontSize="lg">Attendance By Face Recognition</Heading>
          </Flex>
        </Hide>
        <Box flex="1">
          <nav>
            {/* <Center justifyContent="flex-end" flexDirection="row" gap="2">
              <NavLink
                to="sign-in"
                className="auth-header-nav"
                style={{
                  background:
                    location.pathname == "/sign-in" || location.pathname == "/"
                      ? "#2b6cb0"
                      : "aliceblue",
                  borderRadius: "0.4rem",
                  color:
                    location.pathname == "/sign-in" || location.pathname == "/"
                      ? "white"
                      : "black",
                }}
              >
                <Box className="nav-wrapper" p="10px">
                  Sign in
                </Box>
              </NavLink>
              <NavLink
                to="sign-up"
                className="auth-header-nav"
                style={{
                  background:
                    location.pathname == "/sign-up" ? "#2b6cb0" : "aliceblue",
                  borderRadius: "0.4rem",
                  color: location.pathname == "/sign-up" ? "white" : "black",
                }}
              >
                <Box className="nav-wrapper" p="10px">
                  Sign up
                </Box>
              </NavLink>
            </Center> */}
          </nav>
        </Box>
      </Flex>
    </Box>
  );
}

export default Header;
