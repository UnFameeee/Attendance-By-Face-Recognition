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
} from "@chakra-ui/react";
import { Sidebar, SubMenu, Menu, MenuItem } from "react-pro-sidebar";
import { SideBarData } from "../../Utils/SideBarData";
import { Link, NavLink } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { RiRadioButtonLine } from "react-icons/ri";
import avt_user from "../../assets/ta.jpeg";
import { useSelector, useDispatch } from 'react-redux'
function HomeSidebar() {
  const sideBarWidth = useSelector((state) => state.responsive.homeSideBarWidth)
  return (
    <div style={{ display: "flex", height: "100%" }}>
      <Sidebar collapsedWidth="57px" width="250px">
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
          <Flex alignItems="center" justifyContent="start" gap="2" padding="2">
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
                      <Box flex="80%">{parentItem.title}</Box>
                    </Flex>
                  }
                >
                  {parentItem.children &&
                    parentItem.children.map((childItem, index) => (
                      <MenuItem
                        key={index}
                        component={<NavLink to={`${parentItem.url}/${childItem.url}`} />}
                      >
                        <Flex alignItems="center">
                          <Box flex="20%" display="grid" placeItems="start">
                            {childItem.icon}
                          </Box>
                          <Box flex="80%">{childItem.title}</Box>
                        </Flex>
                      </MenuItem>
                    ))}
                </SubMenu>
              ) : (
                <MenuItem key={index} component={<NavLink to={parentItem.url} />}>
                  <Flex alignItems="center">
                    <Box flex="20%" display="grid" placeItems="start">
                      {parentItem.icon}
                    </Box>
                    <Box flex="80%">{parentItem.title}</Box>
                  </Flex>
                </MenuItem>
              )
            )}
          </Menu>
        </Menu>
      </Sidebar>
      <Box className="Main-content" width={`calc(100vw - ${sideBarWidth})`} >
        <Outlet />
      </Box>
    </div>
  );
}

export default HomeSidebar;
