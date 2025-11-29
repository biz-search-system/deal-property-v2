"use client";

import { useRouter } from "next/navigation";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { BreadcrumbConfig, type BreadCrumbItem } from "@/components/breadcrumb-provider";

interface MonthlyBreadcrumbProps {
  year: string;
  month: string;
}

/** 年の選択肢を生成（現在年の前後2年） */
const getYears = () => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
};

/** 月の選択肢（1〜12） */
const months = Array.from({ length: 12 }, (_, i) => i + 1);

/** 年セレクター */
function YearSelector({ year, month }: { year: string; month: string }) {
  const router = useRouter();
  const years = getYears();

  return (
    <div className="flex items-center gap-1">
      <span className="text-foreground">{year}年</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-auto w-auto p-0 hover:bg-accent"
          >
            <ChevronsUpDown className="size-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuRadioGroup
            value={year}
            onValueChange={(value) => {
              router.push(`/properties/monthly/${value}/${month}`);
            }}
          >
            {years.map((y) => (
              <DropdownMenuRadioItem key={y} value={String(y)}>
                {y}年
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

/** 月セレクター */
function MonthSelector({ year, month }: { year: string; month: string }) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-1">
      <span className="text-foreground">{parseInt(month)}月</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-auto w-auto p-0 hover:bg-accent"
          >
            <ChevronsUpDown className="size-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuRadioGroup
            value={month}
            onValueChange={(value) => {
              router.push(`/properties/monthly/${year}/${value}`);
            }}
          >
            {months.map((m) => (
              <DropdownMenuRadioItem
                key={m}
                value={String(m).padStart(2, "0")}
              >
                {m}月
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export function MonthlyBreadcrumb({ year, month }: MonthlyBreadcrumbProps) {
  const breadcrumbItems: BreadCrumbItem[] = [
    { label: "案件管理" },
    { label: "月別案件" },
    {
      label: `${year}年`,
      render: () => <YearSelector year={year} month={month} />,
    },
    {
      label: `${parseInt(month)}月`,
      render: () => <MonthSelector year={year} month={month} />,
    },
  ];

  return <BreadcrumbConfig items={breadcrumbItems} />;
}
