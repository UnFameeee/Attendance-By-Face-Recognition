import React, { useState } from "react";
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
import { BiWorld } from "react-icons/bi";
import { HiUserCircle } from "react-icons/hi";
import { MdKeyboardArrowDown } from "react-icons/md";
function HomeHeader() {
  const { collapseSidebar } = useProSidebar();
  const [hideHeadingLogo, setHideHeadingLogo] = useState(false);
  return (
    <Flex
      className="home-header"
      paddingX={2}
      paddingY={1}
      bgColor="#224562"
      color="white"
      flexDirection="row"
      alignContent="center"
      position='sticky'
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
              collapseSidebar();
              setHideHeadingLogo((prev) => !prev);
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
        <Icon as={BiWorld} boxSize={6} _hover={{ cursor: "pointer" }} />
        <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
          <Menu>
            <MenuButton>
              <Flex _hover={{ cursor: "pointer" }}>
                <Icon as={HiUserCircle} boxSize={6} />
                <Text>Admin123</Text>
                <Icon as={MdKeyboardArrowDown} boxSize={6} />
              </Flex>
            </MenuButton>
            <MenuList color="black">
              <Link to="profile">
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
