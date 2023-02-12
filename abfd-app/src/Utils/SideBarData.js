import { MdSpaceDashboard, MdOutlineMonitor } from "react-icons/md";
import { TbHeartRateMonitor } from "react-icons/tb";
import { AiFillProject } from "react-icons/ai";
import { FaHouseUser, FaUsers, FaCalculator } from "react-icons/fa";
import { GiPayMoney, GiReceiveMoney } from "react-icons/gi";
import { GoReport } from "react-icons/go";
import { SiSuperuser } from "react-icons/si";
export const SideBarData = [
  {
    title: "Admin",
    icon: <MdSpaceDashboard />,
    children: [
      {
        title: "Dashboard",
        link: "dashboard",
        icon: <MdOutlineMonitor />,
      },
      {
        title: "Project",
        link: "project",
        icon: <AiFillProject />,
      },
    ],
  },
  {
    title: "Employees",
    icon: <FaHouseUser />,
    children: [
      {
        title: "Employees",
        link: "employees",
        icon: <FaUsers />,
      },
    ],
  },
  {
    title: "Finance",
    icon: <FaCalculator />,
    children: [
      {
        title: "Salary",
        link: "salary",
        icon: <GiPayMoney />,
      },
      {
        title: "Loans",
        link: "loan",
        icon: <GiReceiveMoney />,
      },
    ],
  },
  {
    title: "Admin Reports",
    icon: <SiSuperuser />,
    children: [
      {
        title: "Reports",
        link: "reports",
        icon: <GoReport />,
      },
    ],
  },
  {
    title: "Test",
    icon: <SiSuperuser />,
    link: "test",
  },
];
