import { HiUserGroup } from "react-icons/hi";
import { MdAvTimer } from "react-icons/md";
import { FaUserCog } from "react-icons/fa";
import { GiPayMoney } from "react-icons/gi";
import { SlOrganization } from "react-icons/sl";
import { MdWork } from "react-icons/md";
import { RiUserVoiceFill } from "react-icons/ri";
import { TbReportMoney } from "react-icons/tb";

const iconFontSize = "80px";
export const DashBoardDataTop = [
  {
    title: "People",
    content: "34 Employees",
    icon: <HiUserGroup style={{ fontSize: iconFontSize }} />,
    link: "/home/employees/general-employees",
    linkTitle: "Manage Employees",
    bgColor: "#38bfee",
  },
  {
    title: "Organization",
    content: "4 Department",
    icon: <SlOrganization style={{ fontSize: iconFontSize }} />,
    link: "/home/organization/general-organization",
    linkTitle: "Manage Organization",
    bgColor: "#29a65a",
  },
  {
    title: "Leave Request",
    content: "Request",
    icon: <RiUserVoiceFill style={{ fontSize: iconFontSize }} />,
    link: "/home/leave-request",
    linkTitle: "Manage Leave Request",
    bgColor: "#f39c14",
  },
  {
    title: "Work Shift",
    content: "Management",
    icon: <MdWork style={{ fontSize: iconFontSize }} />,
    link: "/home/work-shift",
    linkTitle: "Manage Work Shift",
    bgColor: "#dd4b39",
  },
];

export const DashBoardDataBottom = [
  {
    title: "Attendance",
    content: "0 Entries Last Week",
    icon: <MdAvTimer style={{ fontSize: iconFontSize }} />,
    link: "/home/attendance",
    linkTitle: "Manage Attendance",
    bgColor: "#626ebf",
  },
  {
    title: "Setting",
    content: "Setting profile",
    icon: <FaUserCog style={{ fontSize: iconFontSize }} />,
    link: "/home/setting/profile",
    linkTitle: "Manage Setting",
    bgColor: "#6aa7ad",
  },
  {
    title: "Gross and Net",
    content: "View / Download Reports",
    icon: <TbReportMoney style={{ fontSize: iconFontSize }} />,
    link: "/home/payroll/gross-net",
    linkTitle: "Manage Gross and Net",
    bgColor: "#75ba57",
  },
  {
    title: "Payslip",
    content: "View / Download Reports",
    icon: <GiPayMoney style={{ fontSize: iconFontSize }} />,
    link: "/home/payroll/payslip",
    linkTitle: "Manage Leave Request",
    bgColor: "#abad65",
  },
];
