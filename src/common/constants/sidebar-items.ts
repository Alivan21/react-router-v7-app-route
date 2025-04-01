import { BarChart3, Home, Users2 } from "lucide-react";
import { ROUTES } from "./routes";

export const SIDEBAR_ITEMS = [
  {
    title: "Dashboard",
    href: ROUTES.DASHBOARD,
    icon: Home,
  },
  {
    title: "Users",
    href: ROUTES.USERS.LIST,
    icon: Users2,
  },
  {
    title: "Analytics",
    href: "#",
    icon: BarChart3,
    items: [
      {
        title: "Overview",
        href: ROUTES.ANALYTICS.OVERVIEW,
      },
      {
        title: "Reports",
        href: ROUTES.ANALYTICS.REPORTS,
      },
    ],
  },
];
