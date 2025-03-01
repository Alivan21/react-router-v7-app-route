import { BarChart3, Calendar, Home, Settings, Users } from "lucide-react";
import { ROUTES } from "./routes";

export const SIDEBAR_ITEMS = [
  {
    title: "Dashboard",
    href: ROUTES.DASHBOARD,
    icon: Home,
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
  {
    title: "Customers",
    href: "#",
    icon: Users,
    items: [
      {
        title: "All Customers",
        href: ROUTES.CUSTOMERS.ALL,
      },
      {
        title: "Active Customers",
        href: ROUTES.CUSTOMERS.ACTIVE,
      },
    ],
  },
  {
    title: "Calendar",
    href: ROUTES.CALENDAR,
    icon: Calendar,
  },
  {
    title: "Settings",
    href: ROUTES.SETTINGS,
    icon: Settings,
  },
];
