import {
  IconBuilding,
  IconListDetails,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";

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
          {
            title: "案件検索",
            url: `/properties/search`,
          },
        ],
      },
      {
        title: "出口管理",
        url: "#",
        icon: IconBuilding,
        items: [
          {
            title: "出口一覧",
            url: "/exits",
          },
          {
            title: "業者マスタ",
            url: "/brokers",
          },
          {
            title: "業者分析",
            url: "/brokers/analytics",
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
