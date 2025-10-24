import { IconListDetails, IconSettings, IconUsers } from "@tabler/icons-react";

export const navItems = () => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = String(now.getMonth() + 1).padStart(2, "0");

  const navItems = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: "案件管理",
        url: "#",
        icon: IconListDetails,
        items: [
          {
            title: "業者確定前",
            url: "/properties/unconfirmed",
          },
          {
            title: "月別管理",
            url: `/properties/monthly/${currentYear}/${currentMonth}`,
          },
        ],
      },
      {
        title: "組織管理",
        url: "/organization",
        icon: IconUsers,
      },
    ],
    navSecondary: [
      {
        title: "設定",
        url: "/settings",
        icon: IconSettings,
      },
    ],
  };
  return navItems;
};
