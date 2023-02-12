import {
  MdSpaceDashboard,
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
import { GrUserSettings, GrMapLocation } from "react-icons/gr";
import { MdAvTimer } from "react-icons/md";
import { HiBuildingOffice2 } from "react-icons/hi2";
import { SlOrganization } from "react-icons/sl";
import { RiUserVoiceFill } from "react-icons/ri";
import {GoReport} from 'react-icons/go'
import {IoNotifications} from 'react-icons/io5'
export const SideBarData = [
  {
    title: "Admin",
    url: "admin",
    icon: <MdSpaceDashboard />,
    children: [
      {
        title: "Dashboard",
        url: "dashboard",
        icon: <MdOutlineMonitor />,
      },
    ],
  },
  {
    title: "Organization ",
    url: "organization",
    icon: <SlOrganization />,
    children: [
      {
        title: "General",
        url: "general-organization",
        icon: <SiMagento />,
      },
      {
        title: "Location",
        url: "location",
        icon: <GrMapLocation />,
      },
      {
        title: "Department",
        url: "department",
        icon: <HiBuildingOffice2 />,
      },
    ],
  },
  {
    title: "Employees",
    url: "employees",
    icon: <FaHouseUser />,
    children: [
      {
        title: "General",
        url: "general-employees",
        icon: <SiMagento />,
      },
      {
        title: "Work Experience",
        url: "work-experience",
        icon: <FaUserClock />,
      },
      {
        title: "Education",
        url: "education",
        icon: <FaUserGraduate />,
      },
      {
        title: "Skill",
        url: "skill",
        icon: <FaUserAstronaut />,
      },
    ],
  },
  {
    title: "Payroll",
    url: "payroll",
    icon: <MdPayments />,
    children: [
      {
        title: "Gross and Net",
        url: "gross-net",
        icon: <TbReportMoney />,
      },
      {
        title: "Payslip",
        url: "payslip",
        icon: <GiPayMoney />,
      },
    ],
  },
  {
    title: "Work Shift",
    url: "work-shift",
    icon: <MdWork />,
  },
  {
    title: "Notification",
    url: "notification",
    icon: <IoNotifications />,
  },
  {
    title: "Report",
    url: "report",
    icon: <GoReport />,
  },
  {
    title: "Leave Request",
    url: "leave-request",
    icon: <RiUserVoiceFill />,
  },
  {
    title: "Attendance",
    url: "attendance",
    icon: <MdAvTimer />,
  },
  {
    title: "Setting",
    url: "setting",
    icon: <AiTwotoneSetting />,
    children: [
      {
        title: "Profile",
        url: "profile",
        icon: <GrUserSettings />,
      },
    ],
  },
];
