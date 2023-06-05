import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  Avatar,
  Box,
  Flex,
  Heading,
  Icon,
  Text,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useToast,
  Show,
  Tooltip,
  Wrap,
  Hide,
  useDisclosure,
} from "@chakra-ui/react";
import { useProSidebar } from "react-pro-sidebar";
import { Link, useNavigate } from "react-router-dom";
import { BsLayoutSidebarInsetReverse } from "react-icons/bs";
import { IoNotifications } from "react-icons/io5";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useMutation } from "react-query";
import Cookies from "universal-cookie";
import { authService } from "../../services/auth/auth";
import { setUser } from "../../store/Slice/authSlice";
import { Helper } from "../../Utils/Helper";
import { useGetProfileDetail } from "../../services/setting/profile";
import dayjs from "dayjs";
import AvatarWithPreview from "../../components/AvatarWithPreview";
import ChakraAlertDialog from "../../components/ChakraAlertDialog";
import background from '../../assets/bg2.jpg'
import LoadingSpinner from "../../components/LoadingSpinner";
function HomeHeader() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const cookies = new Cookies();
  var decoded = Helper.getUseDecodeInfor();
  const [userAvatar, setUserAvatar] = useState();
  const { data: profileDetailData, isFetching: isFetchingProfileDetailData } =
    useGetProfileDetail(decoded.id);
  const { collapseSidebar, toggleSidebar, toggled } = useProSidebar();
  const {
    isOpen: isSignOutAlertOpen,
    onOpen: onSignOutAlertOpen,
    onClose: onSignOutAlertClose,
  } = useDisclosure();
  const handleCollapseSidebar = () => {
    collapseSidebar();
    // console.log("collapsed", collapsed, " toggled", toggled);
    if (!toggled) {
      toggleSidebar();
    }
  };
  const useLogoutMutation = useMutation(authService.logout, {
    onSuccess: (data) => {
      dispatch(setUser(null));
      navigate("/sign-in");
      toast({
        title: "Sign Out Successfully",
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
  const userData = Helper.getUseDecodeInfor();
  useEffect(() => {
    if (profileDetailData?.result?.image) {
      setUserAvatar(profileDetailData?.result?.image + "?" + dayjs());
    }
  }, [isFetchingProfileDetailData]);
  if (useLogoutMutation.isLoading)
    return (
      <Box h="100vh" w="100vw" backgroundImage={background}>
        <LoadingSpinner />
      </Box>
    );
  return (
    <>
      <Show breakpoint="(max-width: 1005px)">
        <Flex
          className="home-header"
          paddingX={2}
          paddingY={3}
          bgColor="primary2"
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
              <Tooltip placement="bottom" hasArrow label="Go to dashboard page">
                <Heading
                  cursor="pointer"
                  onClick={() => navigate("/dashboard")}
                  fontSize="2xl"
                >
                  Dashboard
                </Heading>
              </Tooltip>
            </Flex>
          </Flex>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              flex: "1",
              gap: "10px",
            }}
          >
            <Tooltip placement="bottom" hasArrow label="Showing the side bar">
              <Wrap>
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
              </Wrap>
            </Tooltip>
            {/* <Tooltip
              placement="bottom"
              hasArrow
              label="Go to Notification page"
            >
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
            </Tooltip> */}
            <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
              <Menu>
                <MenuButton>
                  <Flex
                    _hover={{ cursor: "pointer" }}
                    alignItems="center"
                    gap="4px"
                  >
                    <Avatar
                      size="sm"
                      border="2px solid white"
                      src={userAvatar}
                    />
                    <Hide below="sm">
                      <Text fontSize="1.2rem">{userData.email}</Text>
                    </Hide>
                    <Icon as={MdKeyboardArrowDown} boxSize={8} />
                  </Flex>
                </MenuButton>
                <MenuList color="black">
                  <Link to="/setting/profile">
                    <MenuItem>Profile</MenuItem>
                  </Link>
                  <MenuItem onClick={onSignOutAlertOpen}>Sign Out</MenuItem>
                </MenuList>
              </Menu>
              <ChakraAlertDialog
                title="Sign out account"
                message="Are you sure? This action will sign out your account."
                isOpen={isSignOutAlertOpen}
                onClose={onSignOutAlertClose}
                onAccept={handleLogout}
                acceptButtonLabel="Accept"
                acceptButtonColor="blue"
              />
            </div>
          </div>
        </Flex>
      </Show>
    </>
  );
}

export default HomeHeader;
