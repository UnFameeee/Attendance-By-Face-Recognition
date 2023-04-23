import { HiUserGroup } from "react-icons/hi";
import { MdAvTimer } from "react-icons/md";
import { FaUserCog } from "react-icons/fa";
import { GiPayMoney } from "react-icons/gi";
import { SlOrganization } from "react-icons/sl";
import { MdWork } from "react-icons/md";
import { RiUserVoiceFill } from "react-icons/ri";
import { TbReportMoney } from "react-icons/tb";
import {GoReport} from 'react-icons/go'

const iconFontSize = "80px";
export const DashBoardDataTop = [
  {
    title: "People",
    content: "34 Employees",
    icon: <HiUserGroup style={{ fontSize: iconFontSize }} />,
    link: "/employees/employees-management",
    linkTitle: "Manage Employees",
    bgColor: "#38bfee",
    roleCanAccess:['manager','admin']
  },
  {
    title: "Organization",
    content: "4 Department",
    icon: <SlOrganization style={{ fontSize: iconFontSize }} />,
    link: "/organization/general-organization",
    linkTitle: "Manage Organization",
    bgColor: "#29a65a",
    roleCanAccess:['admin']
  },
  {
    title: "Leave Request",
    content: "Request",
    icon: <RiUserVoiceFill style={{ fontSize: iconFontSize }} />,
    link: "/leave-request",
    linkTitle: "Manage Leave Request",
    bgColor: "#da8909",
  },
  {
    title: "Work Shift",
    content: "Management",
    icon: <MdWork style={{ fontSize: iconFontSize }} />,
    link: "/work-shift",
    linkTitle: "Manage Work Shift",
    bgColor: "#da4c3b",
  },
];

export const DashBoardDataBottom = [
  {
    title: "Attendance",
    content: "0 Entries Last Week",
    icon: <MdAvTimer style={{ fontSize: iconFontSize }} />,
    link: "/attendance/attendance-management",
    linkTitle: "Manage Attendance",
    bgColor: "#626ebf",
  },
  {
    title: "Setting",
    content: "Setting profile",
    icon: <FaUserCog style={{ fontSize: iconFontSize }} />,
    link: "/setting/profile",
    linkTitle: "Manage Setting",
    bgColor: "#6aa7ad",
  },
  {
    title: "Gross and Net",
    content: "Management",
    icon: <TbReportMoney style={{ fontSize: iconFontSize }} />,
    link: "/payroll/gross-net",
    linkTitle: "Manage Gross and Net",
    bgColor: "#75ba57",
  },
  {
    title: "Payslip",
    content: "Management",
    icon: <GiPayMoney style={{ fontSize: iconFontSize }} />,
    link: "/payroll/payslip",
    linkTitle: "Manage Leave Request",
    bgColor: "#abad65",
  },
  {
    title: "Report",
    content: "View / Download Reports",
    icon: <GoReport style={{ fontSize: iconFontSize }} />,
    link: "/report",
    linkTitle: "Manage Report",
    bgColor: "#b46eb0",
  },
];
