import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Icon,
  IconButton,
  Image,
  Text,
  useToast,
} from "@chakra-ui/react";
import {
  Sidebar,
  SubMenu,
  Menu,
  MenuItem,
  useProSidebar,
} from "react-pro-sidebar";
import { SideBarData } from "../../Utils/SideBarData";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { RiRadioButtonLine } from "react-icons/ri";
import avt_user from "../../assets/ta.jpeg";
import { useMutation } from "react-query";
import { logout } from "../../services/auth/auth";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/Slice/authSlice";
import Cookies from "universal-cookie";
import { MdLogout } from "react-icons/md";
import {
  TbLayoutSidebarRightExpand,
  TbLayoutSidebarLeftExpand,
} from "react-icons/tb";
import {
  BsLayoutSidebarInsetReverse,
  BsLayoutSidebarInset,
} from "react-icons/bs";
function HomeSidebar() {
  const { collapseSidebar, toggleSidebar, collapsed, toggled } =
    useProSidebar();
  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cookies = new Cookies();
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
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Box>
        <Sidebar rootStyles={{overflowY:'overlay'}} customBreakPoint="1005px" collapsedWidth="64px" width="250px">
          <Menu
            menuItemStyles={{
              button: ({ level, active, disabled }) => {
                // only apply styles on first level elements of the tree
                if (level === 0)
                  return {
                    color: disabled ? "#f5d9ff" : "#d359ff",
                    backgroundColor: active ? "#eecef9" : undefined,
                  };
              },
            }}
          >
            <Flex
              alignItems="center"
              justifyContent="start"
              gap="2"
              padding="2"
            >
              <Flex flex="8" alignItems="center" gap="2">
                <Avatar src={avt_user} />
                <Box display="flex" flexDirection="column">
                  <Heading fontSize="large" color="black">
                    Admin123
                  </Heading>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Icon as={RiRadioButtonLine} color="green" boxSize={6} />
                    <Text>Signed in</Text>
                  </Box>
                </Box>
              </Flex>
              <Flex flex="2">
                <Icon
                  onClick={() => collapseSidebar()}
                  cursor="pointer"
                  fontSize="23px"
                  color="black"
                  as={BsLayoutSidebarInset}
                />
              </Flex>
            </Flex>
            {collapsed && (
              <Flex justifyContent="center" w="100%" mb="10px">
                <Icon
                  onClick={() => collapseSidebar()}
                  cursor="pointer"
                  fontSize="23px"
                  color="black"
                  as={BsLayoutSidebarInsetReverse}
                />
              </Flex>
            )}
            <Divider />
            <Menu>
              {SideBarData.map((parentItem, index) =>
                parentItem.children ? (
                  <SubMenu
                    key={index}
                    label={
                      <Flex alignItems="center">
                        <Box flex="20%" display="grid" placeItems="start">
                          {parentItem.icon}
                        </Box>
                        <Box flex="80%" fontSize="1.2rem" fontWeight="medium">
                          {parentItem.title}
                        </Box>
                      </Flex>
                    }
                  >
                    {parentItem.children &&
                      parentItem.children.map((childItem, index) => (
                        <MenuItem
                          key={index}
                          component={
                            <NavLink
                              to={`${parentItem.url}/${childItem.url}`}
                            />
                          }
                        >
                          <Flex alignItems="center">
                            <Box flex="20%" display="grid" placeItems="start">
                              {childItem.icon}
                            </Box>
                            <Box
                              flex="80%"
                              fontSize="1.1rem"
                              fontWeight="medium"
                            >
                              {childItem.title}
                            </Box>
                          </Flex>
                        </MenuItem>
                      ))}
                  </SubMenu>
                ) : (
                  <MenuItem
                    key={index}
                    component={<NavLink to={parentItem.url} />}
                  >
                    <Flex alignItems="center">
                      <Box flex="20%" display="grid" placeItems="start">
                        {parentItem.icon}
                      </Box>
                      <Box flex="80%" fontSize="1.2rem" fontWeight="medium">
                        {parentItem.title}
                      </Box>
                    </Flex>
                  </MenuItem>
                )
              )}
              <MenuItem onClick={handleLogout} key="sign-out">
                <Flex alignItems="center">
                  <Box flex="20%" display="grid" placeItems="start">
                    <MdLogout fontSize="23px" />
                  </Box>
                  <Box flex="80%" fontSize="1.2rem" fontWeight="medium">
                    Sign out
                  </Box>
                </Flex>
              </MenuItem>
            </Menu>
          </Menu>
        </Sidebar>
      </Box>
      <Box
        className="Main-content"
        flex="1"
        minWidth="0"
        minHeight="100vh"
        bgColor="mainBg"
      >
        <Outlet />
      </Box>
    </div>
  );
}

export default HomeSidebar;
