import React, { useEffect, useState } from "react";
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
} from "@chakra-ui/react";
import { Sidebar, SubMenu, Menu, MenuItem } from "react-pro-sidebar";
import { SideBarData } from "../../Utils/SideBarData";
import { Link, NavLink } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { RiRadioButtonLine } from "react-icons/ri";
import avt_user from "../../assets/ta.jpeg";
import { useSelector, useDispatch } from "react-redux";
import { useRef } from "react";
function HomeSidebar() {
 
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {true && (
        <Sidebar collapsedWidth="64px" width="250px">
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
              <Flex alignItems="center" gap="2">
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
            </Flex>
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
            </Menu>
          </Menu>
        </Sidebar>
      )}
      <Box
        className="Main-content"
        flex="1"
        minWidth="0"
        minHeight="100vh"
        bgColor="#d7e2e978"
      >
        <Outlet />
      </Box>
    </div>
  );
}

export default HomeSidebar;
