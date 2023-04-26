import {
  MdOutlineMonitor,
  MdPayments,
  MdWork,
  MdTouchApp,
  MdAssignmentInd,
} from "react-icons/md";
import { TbReportMoney, TbFaceId } from "react-icons/tb";
import { AiTwotoneSetting } from "react-icons/ai";
import { FaHouseUser } from "react-icons/fa";
import { GiPayMoney } from "react-icons/gi";
import { SiMagento } from "react-icons/si";
import { MdAvTimer } from "react-icons/md";
import { HiBuildingOffice2 } from "react-icons/hi2";
import { SlOrganization } from "react-icons/sl";
import { RiUserVoiceFill } from "react-icons/ri";
import { GoReport } from "react-icons/go";
import { IoNotifications } from "react-icons/io5";
import { BsCalendar3 } from "react-icons/bs";
import { ImProfile } from "react-icons/im";
import {IoCreateSharp} from 'react-icons/io5'
const iconSize = "23px";
export const SideBarData = [
  {
    title: "Dashboard",
    url: "dashboard",
    icon: <MdOutlineMonitor fontSize={iconSize} />,
    // roleCanAccess: ["manager", "admin"],
  },
  {
    title: "Organization ",
    url: "organization",
    icon: <SlOrganization fontSize={iconSize} />,
    roleCanAccess: ["manager", "admin"],
    children: [
      {
        title: "Management",
        url: "general-organization",
        icon: <SiMagento fontSize={iconSize} />,
        roleCanAccess: ["admin"],
      },
      {
        title: "Department",
        url: "department-management",
        icon: <HiBuildingOffice2 fontSize={iconSize} />,
        roleCanAccess: ["admin"],
      },
      {
        title: "Assigning",
        url: "assign-department",
        icon: <MdAssignmentInd fontSize={iconSize} />,
        roleCanAccess: ["manager", "admin"],
      },
    ],
  },
  {
    title: "Employees",
    url: "employees",
    icon: <FaHouseUser fontSize={iconSize} />,
    roleCanAccess: ["manager", "admin"],
    children: [
      {
        title: "Management",
        url: "employees-management",
        icon: <SiMagento fontSize={iconSize} />,
        roleCanAccess: ["manager", "admin"],
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
    icon: <BsCalendar3 fontSize={iconSize} />,
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
    children: [
      {
        title: "Create & Details",
        url: "leave-request-personal",
        icon: <IoCreateSharp fontSize={iconSize} />,
      },
      {
        title: "Management",
        url: "leave-request-management",
        icon: <SiMagento fontSize={iconSize} />,
        roleCanAccess: ["manager", "admin"],
      },
    ],
  },

  {
    title: "Attendance",
    url: "attendance",
    icon: <MdAvTimer fontSize={iconSize} />,
    children: [
      {
        title: "Face Attendance",
        url: "face-attendance",
        icon: <TbFaceId fontSize={iconSize} />,
      },
      {
        title: "Attendance",
        url: "attendance-management",
        icon: <MdTouchApp fontSize={iconSize} />,
      },
    ],
  },
  {
    title: "Setting",
    url: "setting",
    icon: <AiTwotoneSetting fontSize={iconSize} />,
    children: [
      {
        title: "Profile",
        url: "profile",
        icon: <ImProfile fontSize={iconSize} />,
      },
    ],
  },
];
