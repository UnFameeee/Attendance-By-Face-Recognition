import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Icon,
  Image,
  Text,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useToast,
  Show,
} from "@chakra-ui/react";
import { useProSidebar } from "react-pro-sidebar";
import { Link, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import {
  BsLayoutSidebarInsetReverse,
  BsLayoutSidebarInset,
} from "react-icons/bs";
import { IoNotifications } from "react-icons/io5";
import { HiUserCircle } from "react-icons/hi";
import { MdKeyboardArrowDown } from "react-icons/md";
import { collapsedHomeSideBar } from "../../store/Slice/responsiveSlice";
import { useMutation } from "react-query";
import Cookies from "universal-cookie";
import { logout } from "../../services/auth/auth";
import { setUser } from "../../store/Slice/authSlice";
function HomeHeader() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const cookies = new Cookies();
  const { collapseSidebar, toggleSidebar, collapsed, toggled } =
    useProSidebar();

  const handleCollapseSidebar = () => {
    collapseSidebar();
    console.log("collapsed", collapsed, " toggled", toggled);
    if (!toggled) {
      toggleSidebar();
    }
  };
  const useLogoutMutation = useMutation(logout, {
    onSuccess: (data) => {
      dispatch(setUser(null));
      localStorage.removeItem("accessToken");
      navigate("/sign-in");
      toast({
        title: "Sign out successfully",
        position: "bottom-right",
        status: "success",
        isClosable: true,
        duration: 5000,
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const handleLogout = () => {
    const accessTokenJSON = localStorage.getItem("accessToken");
    const accessToken = JSON.parse(accessTokenJSON);
    const refreshToken = cookies.get("jwt_authentication");
    useLogoutMutation.mutate({ accessToken, refreshToken });
  };

  return (
    <>
      <Show breakpoint="(max-width: 1005px)">
        <Flex
          className="home-header"
          paddingX={2}
          paddingY={3}
          bgColor="#224562"
          color="white"
          flexDirection="row"
          alignContent="center"
          position="sticky"
          inset={0}
          zIndex="100"
        >
          <Flex
            className="header-nav-left"
            gap={5}
            alignItems="center"
            width="241.2px"
          >
            <Flex flex={1} justifyContent="center">
              <Heading
                cursor="pointer"
                onClick={() => navigate("/dashboard")}
                fontSize="2xl"
              >
                Home
              </Heading>
            </Flex>
          </Flex>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              flex: "1",
              gap: "5px",
            }}
          >
            <Icon
              onClick={() => {
                handleCollapseSidebar();
              }}
              as={BsLayoutSidebarInsetReverse}
              boxSize={8}
              _hover={{
                cursor: "pointer",
              }}
            />
            <Link to="/notification">
              <Box
                display="flex"
                alignItems="center"
                position="relative"
                ml="8px"
              >
                <Icon
                  as={IoNotifications}
                  boxSize={8}
                  _hover={{ cursor: "pointer" }}
                />
                <Box
                  position="absolute"
                  right="18px"
                  bottom="12px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  className="notify-count"
                  bgColor="#eb8e2c"
                  boxSize={6}
                  rounded="full"
                >
                  <Text color="black" fontWeight="bold">
                    5
                  </Text>
                </Box>
              </Box>
            </Link>
            <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
              <Menu>
                <MenuButton>
                  <Flex _hover={{ cursor: "pointer" }}>
                    <Icon as={HiUserCircle} boxSize={8} />
                    <Text fontSize="1.2rem">Admin123</Text>
                    <Icon as={MdKeyboardArrowDown} boxSize={8} />
                  </Flex>
                </MenuButton>
                <MenuList color="black">
                  <Link to="/setting/profile">
                    <MenuItem>Profile</MenuItem>
                  </Link>
                  <MenuItem onClick={handleLogout}>Sign Out</MenuItem>
                </MenuList>
              </Menu>
            </div>
          </div>
        </Flex>
      </Show>
    </>
  );
}

export default HomeHeader;
