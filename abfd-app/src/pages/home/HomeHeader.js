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
} from "@chakra-ui/react";
import { useProSidebar } from "react-pro-sidebar";
import { Link } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoNotifications } from "react-icons/io5";
import { HiUserCircle } from "react-icons/hi";
import { MdKeyboardArrowDown } from "react-icons/md";
import { collapsedHomeSideBar } from "../../store/Slice/responsiveSlice";
function HomeHeader() {
  const { collapseSidebar } = useProSidebar();
  const dispatch = useDispatch();
  const sideBarWidth = useSelector(
    (state) => state.responsive.homeSideBarWidth
  );
  const handleCollapseSidebar = () => {
    if (sideBarWidth === "250px") dispatch(collapsedHomeSideBar("56px"));
    else {
      dispatch(collapsedHomeSideBar("250px"));
    }
    collapseSidebar();
  };
  return (
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
      zIndex="sticky"
    >
      <Flex
        className="header-nav-left"
        gap={5}
        alignItems="center"
        width="241.2px"
      >
        <Flex flex={1} justifyContent="center">
          <Heading fontSize="2xl">Home</Heading>
        </Flex>
        <Flex justifyContent="flex-end">
          <Icon
            onClick={() => {
              handleCollapseSidebar();
            }}
            as={GiHamburgerMenu}
            boxSize={8}
            _hover={{
              cursor: "pointer",
            }}
          />
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
        <Link to="/home/notification">
          <Box display="flex" alignItems="center" position="relative">
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
                <Text fontSize='1.2rem'>Admin123</Text>
                <Icon as={MdKeyboardArrowDown} boxSize={8} />
              </Flex>
            </MenuButton>
            <MenuList color="black">
              <Link to="/home/setting/profile">
                <MenuItem>Profile</MenuItem>
              </Link>
              <Link to="/sign-out">
                <MenuItem>Sign Out</MenuItem>
              </Link>
            </MenuList>
          </Menu>
        </div>
      </div>
    </Flex>
  );
}

export default HomeHeader;
