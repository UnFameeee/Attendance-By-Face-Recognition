import {
  MdOutlineMonitor,
  MdPayments,
  MdWork,
} from "react-icons/md";
import { TbReportMoney } from "react-icons/tb";
import { AiTwotoneSetting } from "react-icons/ai";
import {
  FaHouseUser,
  FaUserAstronaut,
  FaUserClock,
  FaUserGraduate,
} from "react-icons/fa";
import { GiPayMoney } from "react-icons/gi";
import { SiMagento } from "react-icons/si";
import { GrUserSettings, GrMapLocation, GrLogout } from "react-icons/gr";
import { MdAvTimer } from "react-icons/md";
import { HiBuildingOffice2 } from "react-icons/hi2";
import { SlOrganization } from "react-icons/sl";
import { RiUserVoiceFill } from "react-icons/ri";
import {GoReport} from 'react-icons/go'
import {IoNotifications} from 'react-icons/io5'

const iconSize ='23px'
export const SideBarData = [
  {
    title: "Dashboard",
    url: "dashboard",
    icon: <MdOutlineMonitor fontSize={iconSize} />,
  },
  {
    title: "Organization ",
    url: "organization",
    icon: <SlOrganization fontSize={iconSize} />,
    children: [
      {
        title: "General",
        url: "general-organization",
        icon: <SiMagento fontSize={iconSize} />,
      },
      {
        title: "Location",
        url: "location",
        icon: <GrMapLocation fontSize={iconSize} />,
      },
      {
        title: "Department",
        url: "department",
        icon: <HiBuildingOffice2 fontSize={iconSize} />,
      },
    ],
  },
  {
    title: "Employees",
    url: "employees",
    icon: <FaHouseUser fontSize={iconSize} />,
    children: [
      {
        title: "General",
        url: "general-employees",
        icon: <SiMagento fontSize={iconSize} />,
      },
      {
        title: "Work Experience",
        url: "work-experience",
        icon: <FaUserClock fontSize={iconSize} />,
      },
    ],
  },
  {
    title: "Payroll",
    url: "payroll",
    icon: <MdPayments fontSize={iconSize} />,
    children: [
      {
        title: "Gross and Net",
        url: "gross-net",
        icon: <TbReportMoney fontSize={iconSize} />,
      },
      {
        title: "Payslip",
        url: "payslip",
        icon: <GiPayMoney fontSize={iconSize} />,
      },
    ],
  },
  {
    title: "Work Shift",
    url: "work-shift",
    icon: <MdWork fontSize={iconSize} />,
  },
  {
    title: "Notification",
    url: "notification",
    icon: <IoNotifications fontSize={iconSize} />,
  },
  {
    title: "Report",
    url: "report",
    icon: <GoReport fontSize={iconSize} />,
  },
  {
    title: "Leave Request",
    url: "leave-request",
    icon: <RiUserVoiceFill fontSize={iconSize} />,
  },
  {
    title: "Attendance",
    url: "attendance",
    icon: <MdAvTimer fontSize={iconSize} />,
  },
  {
    title: "Setting",
    url: "setting",
    icon: <AiTwotoneSetting fontSize={iconSize} />,
    children: [
      {
        title: "Profile",
        url: "profile",
        icon: <GrUserSettings fontSize={iconSize} />,
      },
    ],
  },
];
