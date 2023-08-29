import { FaTh, FaRegChartBar, FaCommentAlt } from "react-icons/fa";
import { BiImageAdd } from "react-icons/bi";
import { RiFolderReceivedLine } from "react-icons/ri";
import { HiDocumentReport, IconName } from "react-icons/hi";
const menu = [
  {
    title: "Dashboard",
    icon: <FaTh />,
    path: "/dashboard",
  },
  {
    title: "Add Product",
    icon: <BiImageAdd />,
    path: "/add-product",
  },
  {
    title: "Recieve/Issue Material",
    icon: <RiFolderReceivedLine />,
    path: "/issue-material",
  },
  {
    title: "Report",
    icon: <HiDocumentReport />,
    path: "/report",
  },
  {
    title: "Account",
    icon: <FaRegChartBar />,
    path: "/profile",
    // childrens: [
    //   {
    //     title: "Profile",
    //     path: "/profile",
    //   },
    //   {
    //     title: "Edit Profile",
    //     path: "/edit-profile",
    //   },
    // ],
  },
  {
    title: "Report Bug",
    icon: <FaCommentAlt />,
    path: "/contact-us",
  },
];

export default menu;
