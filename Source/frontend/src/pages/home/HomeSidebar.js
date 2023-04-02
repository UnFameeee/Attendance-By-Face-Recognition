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
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  Sidebar,
  SubMenu,
  Menu,
  MenuItem,
  useProSidebar,
  sidebarClasses,
} from "react-pro-sidebar";
import { SideBarData } from "../../data/SideBarData";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
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
import jwtDecode from "jwt-decode";
import { Helper } from "../../Utils/Helper";
import ChakraAlertDialog from "../../components/ChakraAlertDialog";
function HomeSidebar() {
  const { collapseSidebar, toggleSidebar, collapsed, toggled } =
    useProSidebar();
  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cookies = new Cookies();
  const location = useLocation();
  const {
    isOpen: isSignOutAlertOpen,
    onOpen: onSignOutAlertOpen,
    onClose: onSignOutAlertClose,
  } = useDisclosure();
  const useLogoutMutation = useMutation(logout, {
    onSuccess: (data) => {
      dispatch(setUser(null));
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
    useLogoutMutation.mutate();
  };
  const accessTokenJSON = localStorage.getItem("accessToken");
  const accessToken = JSON.parse(accessTokenJSON);
  var decoded = jwtDecode(accessToken);
  let userEmail = decoded.email;
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "rgb(249, 249, 249, 0.7)",
      }}
    >
      <Box>
        <Sidebar
          rootStyles={{ overflowY: "overlay" }}
          customBreakPoint="1005px"
          collapsedWidth="64px"
          width="250px"
        >
          <Menu>
            <Flex
              alignItems="center"
              justifyContent="start"
              gap="2"
              padding="2"
              bg="primary2"
            >
              <Flex flex="8" alignItems="center" gap="2">
                <Avatar border="2px solid white" src={avt_user} />
                <Box display="flex" flexDirection="column">
                  <Heading
                    fontSize="large"
                    color="white"
                    overflow="hidden"
                    width="124px"
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                  >
                    {userEmail}
                  </Heading>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Icon as={RiRadioButtonLine} color="green" boxSize={6} />
                    <Text color="white">Signed in</Text>
                  </Box>
                </Box>
              </Flex>
              <Flex flex="2">
                <Icon
                  onClick={() => collapseSidebar()}
                  cursor="pointer"
                  fontSize="23px"
                  color="white"
                  as={BsLayoutSidebarInset}
                />
              </Flex>
            </Flex>
            {collapsed && (
              <Flex pb="10px" bg="primary2" justifyContent="center" w="100%">
                <Icon
                  onClick={() => collapseSidebar()}
                  cursor="pointer"
                  fontSize="23px"
                  color="white"
                  as={BsLayoutSidebarInsetReverse}
                />
              </Flex>
            )}

            <Menu
              menuItemStyles={{
                button: ({ level, active, disabled }) => {
                  // console.log("active", active);
                  // console.log("level", level);

                  // only apply styles on first level elements of the tree
                  if (level === 0)
                    return {
                      backgroundColor: active ? "#004F94" : undefined,
                      color: active ? "white" : undefined,
                    };
                  if (level === 1)
                    return {
                      backgroundColor: active ? "#004F94" : undefined,
                      color: active ? "white" : undefined,
                    };
                },
              }}
            >
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
                          active={
                            location.pathname ==
                            `/${parentItem.url}/${childItem.url}`
                              ? true
                              : false
                          }
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
                    active={
                      location.pathname == `/${parentItem.url}` ? true : false
                    }
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
              <MenuItem onClick={onSignOutAlertOpen} key="sign-out">
                <Flex alignItems="center">
                  <Box flex="20%" display="grid" placeItems="start">
                    <MdLogout fontSize="23px" />
                  </Box>
                  <Box flex="80%" fontSize="1.2rem" fontWeight="medium">
                    Sign out
                  </Box>
                </Flex>
              </MenuItem>
              <ChakraAlertDialog
                title="Sign out account"
                message="Are you sure? This action will sign out your account."
                isOpen={isSignOutAlertOpen}
                onClose={onSignOutAlertClose}
                onAccept={handleLogout}
                acceptButtonLabel="Accept"
              />
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
        padding='2rem'
      >
        <Outlet />
      </Box>
    </div>
  );
}

export default HomeSidebar;
