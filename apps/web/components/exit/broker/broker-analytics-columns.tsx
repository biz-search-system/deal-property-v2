"use client";

import { ColumnDef } from "@tanstack/react-table";
import type { BrokerAnalytics } from "@/lib/types/broker";
import { BROKER_TYPE_LABELS, BROKER_TYPE_COLORS } from "@/lib/types/broker";
import { Badge } from "@workspace/ui/components/badge";
import { cn } from "@workspace/ui/lib/utils";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Trophy, Medal, Award } from "lucide-react";

export const brokerAnalyticsColumns: ColumnDef<BrokerAnalytics>[] = [
  {
    accessorKey: "brokerName",
    header: "業者名",
    cell: ({ row }) => {
      const brokerType = row.original.brokerType;
      return (
        <div className="flex items-center gap-2">
          <span className="font-medium">{row.original.brokerName}</span>
          <Badge
            variant="secondary"
            className={cn("text-[10px]", BROKER_TYPE_COLORS[brokerType])}
          >
            {BROKER_TYPE_LABELS[brokerType]}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "distributionCount",
    header: "配布数",
    cell: ({ row }) => (
      <span className="tabular-nums">{row.original.distributionCount}件</span>
    ),
  },
  {
    accessorKey: "responseCount",
    header: "回答数",
    cell: ({ row }) => (
      <span className="tabular-nums">{row.original.responseCount}件</span>
    ),
  },
  {
    accessorKey: "responseRate",
    header: "回答率",
    cell: ({ row }) => {
      const rate = row.original.responseRate;
      return (
        <span
          className={cn(
            "tabular-nums font-medium",
            rate >= 80
              ? "text-green-600"
              : rate >= 60
                ? "text-yellow-600"
                : "text-red-600"
          )}
        >
          {rate.toFixed(1)}%
        </span>
      );
    },
  },
  {
    accessorKey: "contractCount",
    header: "成約数",
    cell: ({ row }) => (
      <span className="tabular-nums">{row.original.contractCount}件</span>
    ),
  },
  {
    accessorKey: "contractRate",
    header: "成約率",
    cell: ({ row }) => {
      const rate = row.original.contractRate;
      return (
        <span
          className={cn(
            "tabular-nums font-medium",
            rate >= 30
              ? "text-green-600"
              : rate >= 20
                ? "text-yellow-600"
                : "text-muted-foreground"
          )}
        >
          {rate.toFixed(1)}%
        </span>
      );
    },
  },
  {
    accessorKey: "averageResponsePrice",
    header: "平均回答金額",
    cell: ({ row }) => {
      const price = row.original.averageResponsePrice;
      if (price === null) return <span className="text-muted-foreground">-</span>;
      return <span className="tabular-nums">{price.toLocaleString()}万円</span>;
    },
  },
  {
    accessorKey: "averageResponseDays",
    header: "平均回答日数",
    cell: ({ row }) => {
      const days = row.original.averageResponseDays;
      if (days === null) return <span className="text-muted-foreground">-</span>;
      return (
        <span
          className={cn(
            "tabular-nums",
            days <= 2 ? "text-green-600" : days <= 3 ? "text-yellow-600" : ""
          )}
        >
          {days.toFixed(1)}日
        </span>
      );
    },
  },
  {
    accessorKey: "upperCount",
    header: "アッパー獲得",
    cell: ({ row }) => {
      const count = row.original.upperCount;
      return (
        <div className="flex items-center gap-1">
          {count >= 10 ? (
            <Trophy className="size-4 text-yellow-500" />
          ) : count >= 5 ? (
            <Medal className="size-4 text-gray-400" />
          ) : count >= 3 ? (
            <Award className="size-4 text-amber-600" />
          ) : null}
          <span className="tabular-nums font-medium">{count}回</span>
        </div>
      );
    },
  },
  {
    accessorKey: "lastTransactionAt",
    header: "直近取引日",
    cell: ({ row }) => {
      const date = row.original.lastTransactionAt;
      if (!date) return <span className="text-muted-foreground">-</span>;
      return (
        <span className="text-muted-foreground">
          {format(date, "yyyy/MM/dd", { locale: ja })}
        </span>
      );
    },
  },
];
