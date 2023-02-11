import { HiUserGroup } from "react-icons/hi";
import { AiFillProject } from "react-icons/ai";
import { GoReport } from "react-icons/go";
import { MdAvTimer } from "react-icons/md";
const iconFontSize = "80px";
export const DashBoardData = [
  {
    title: "People",
    content: "34 Employees",
    icon: <HiUserGroup style={{ fontSize: iconFontSize }} />,
    link: "employees",
    linkTitle: "Manage Employees",
    bgColor: "#38bfee",
  },
  {
    title: "Projects",
    content: "4 Active Projects",
    icon: <AiFillProject style={{ fontSize: iconFontSize }} />,
    link: "project",
    linkTitle: "Manage Projects",
    bgColor: "#29a65a",
  },
  {
    title: "Attendance",
    content: "0 Entries Last Week",
    icon: <MdAvTimer style={{ fontSize: iconFontSize }} />,
    link: "attendance",
    linkTitle: "Manage Attendance",
    bgColor: "#f39c14",
  },
  {
    title: "Reports",
    content: "View / Download Reports",
    icon: <GoReport style={{ fontSize: iconFontSize }} />,
    link: "reports",
    linkTitle: "Manage Reports",
    bgColor: "#dd4b39",
  },
];
