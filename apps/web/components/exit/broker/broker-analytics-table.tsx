"use client";

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Card } from "@workspace/ui/components/card";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import type { BrokerAnalytics } from "@/lib/types/broker";
import { useState, useMemo } from "react";
import { brokerAnalyticsColumns } from "./broker-analytics-columns";

interface BrokerAnalyticsTableProps {
  analytics: BrokerAnalytics[];
}

type SortOption =
  | "responseRate"
  | "contractRate"
  | "upperCount"
  | "averageResponseDays"
  | "distributionCount";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "responseRate", label: "回答率順" },
  { value: "contractRate", label: "成約率順" },
  { value: "upperCount", label: "アッパー獲得順" },
  { value: "averageResponseDays", label: "回答速度順" },
  { value: "distributionCount", label: "配布数順" },
];

export function BrokerAnalyticsTable({ analytics }: BrokerAnalyticsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "contractRate", desc: true },
  ]);
  const [sortOption, setSortOption] = useState<SortOption>("contractRate");
  const [brokerTypeFilter, setBrokerTypeFilter] = useState<string>("all");

  // フィルタリング
  const filteredAnalytics = useMemo(() => {
    if (brokerTypeFilter === "all") return analytics;
    return analytics.filter((a) => a.brokerType === brokerTypeFilter);
  }, [analytics, brokerTypeFilter]);

  const handleSortChange = (value: SortOption) => {
    setSortOption(value);
    const desc = value !== "averageResponseDays"; // 回答日数は昇順
    setSorting([{ id: value, desc }]);
  };

  const table = useReactTable({
    data: filteredAnalytics,
    columns: brokerAnalyticsColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  return (
    <div className="flex h-full flex-col gap-3">
      {/* ツールバー */}
      <div className="shrink-0 flex items-center gap-2">
        {/* ソート */}
        <Select value={sortOption} onValueChange={handleSortChange}>
          <SelectTrigger className="h-8 w-[150px]">
            <SelectValue placeholder="並び順" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* 業者種別フィルター */}
        <Select value={brokerTypeFilter} onValueChange={setBrokerTypeFilter}>
          <SelectTrigger className="h-8 w-[130px]">
            <SelectValue placeholder="種別" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべての種別</SelectItem>
            <SelectItem value="buyer">買取業者</SelectItem>
            <SelectItem value="broker">買取仲介</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* テーブル */}
      <Card className="overflow-hidden px-3 py-2">
        <ScrollArea className="min-h-0 flex-1 overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="text-xs">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="hover:bg-muted/50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="text-xs py-2">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={brokerAnalyticsColumns.length}
                    className="h-24 text-center"
                  >
                    データがありません
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </Card>

      {/* 件数表示 */}
      <div className="shrink-0 text-sm text-muted-foreground">
        {filteredAnalytics.length} 件
      </div>
    </div>
  );
}
