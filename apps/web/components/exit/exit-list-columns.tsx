"use client";

import type { ExitListItem, RankedResponse } from "@/lib/types/exit";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { type OrganizationSlugType } from "@workspace/utils";
import { Edit, Eye, MoreHorizontal, Send } from "lucide-react";
import OrganizationBadge from "../property/badge/organization-badge";
import { DataTableColumnHeader } from "../property/search/data-table-column-header";
import { ExitStatusBadge } from "./exit-status-badge";
import { SituationBadge } from "./situation-badge";

/** 日付フォーマット（和暦） */
const formatDateWareki = (date: Date | null): string => {
  if (!date) return "-";
  return new Intl.DateTimeFormat("ja-JP-u-ca-japanese", {
    era: "long",
    year: "numeric",
    month: "long",
  }).format(date);
};

/** 金額フォーマット（万円） */
const formatPriceMan = (value: number | null): string => {
  if (value == null) return "-";
  return `${value.toLocaleString()}万`;
};

/** 金額フォーマット（円） */
const formatPriceYen = (value: number | null): string => {
  if (value == null) return "-";
  return `${value.toLocaleString()}円`;
};

/** 利回りフォーマット */
const formatYield = (value: number | null): string => {
  if (value == null) return "-";
  return `${value.toFixed(2)}%`;
};

/** 順位表示コンポーネント */
function RankingCell({ response }: { response: RankedResponse | undefined }) {
  if (!response) {
    return <span className="text-muted-foreground text-center block">-</span>;
  }

  return (
    <div className="flex flex-col items-center text-[9px] leading-tight">
      <span className="font-medium truncate max-w-[60px]">
        {response.brokerName}
      </span>
      <span>{formatPriceMan(response.price)}</span>
      <span className="text-muted-foreground">{formatYield(response.yield)}</span>
    </div>
  );
}

export const exitListColumns: ColumnDef<ExitListItem>[] = [
  {
    accessorKey: "organizationSlug",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="組織" />
    ),
    cell: ({ row }) => (
      <OrganizationBadge
        organizationSlug={row.original.organizationSlug as OrganizationSlugType}
      />
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="状態" />
    ),
    cell: ({ row }) => <ExitStatusBadge status={row.original.status} />,
    filterFn: (row, id, value) => row.original.status === value,
  },
  {
    accessorKey: "propertyName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="物件名" />
    ),
    cell: ({ row }) => (
      <span className="font-medium truncate max-w-[120px] block">
        {row.original.propertyName}
      </span>
    ),
  },
  {
    accessorKey: "roomNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="号室" />
    ),
    cell: ({ row }) => (
      <span className="text-center block">{row.original.roomNumber || "-"}</span>
    ),
  },
  {
    accessorKey: "builtDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="築年" />
    ),
    cell: ({ row }) => (
      <span className="text-center block">{formatDateWareki(row.original.builtDate)}</span>
    ),
  },
  {
    accessorKey: "staff",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="担当" />
    ),
    cell: ({ row }) => {
      const staff = row.original.staff;
      if (!staff) return <span className="text-muted-foreground">-</span>;
      return (
        <Badge variant="secondary" className="text-[9px] px-1 py-0">
          {staff.name}
        </Badge>
      );
    },
  },
  {
    accessorKey: "situation",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="現況" />
    ),
    cell: ({ row }) => <SituationBadge situation={row.original.situation} />,
  },
  {
    accessorKey: "purchasePrice",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="仕入" />
    ),
    cell: ({ row }) => (
      <span className="text-right block tabular-nums">
        {formatPriceMan(row.original.purchasePrice)}
      </span>
    ),
  },
  {
    accessorKey: "maisokuPrice",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="マイソク" />
    ),
    cell: ({ row }) => (
      <span className="text-right block tabular-nums">
        {formatPriceMan(row.original.maisokuPrice)}
      </span>
    ),
  },
  {
    accessorKey: "brokerageFee",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="仲手" />
    ),
    cell: ({ row }) => (
      <span className="text-right block tabular-nums">
        {formatPriceMan(row.original.brokerageFee)}
      </span>
    ),
  },
  {
    accessorKey: "rent",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="家賃" />
    ),
    cell: ({ row }) => (
      <span className="text-right block tabular-nums">
        {formatPriceYen(row.original.rent)}
      </span>
    ),
  },
  {
    accessorKey: "managementFee",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="管積" />
    ),
    cell: ({ row }) => (
      <span className="text-right block tabular-nums">
        {formatPriceYen(row.original.managementFee)}
      </span>
    ),
  },
  {
    id: "upper",
    header: () => <span className="text-center block">アッパー</span>,
    cell: ({ row }) => (
      <RankingCell response={row.original.rankedResponses[0]} />
    ),
  },
  {
    id: "second",
    header: () => <span className="text-center block">2番手</span>,
    cell: ({ row }) => (
      <RankingCell response={row.original.rankedResponses[1]} />
    ),
  },
  {
    id: "third",
    header: () => <span className="text-center block">3番手</span>,
    cell: ({ row }) => (
      <RankingCell response={row.original.rankedResponses[2]} />
    ),
  },
  {
    id: "profit",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="利益" />
    ),
    cell: ({ row }) => {
      const upperPrice = row.original.confirmedPrice ?? row.original.rankedResponses[0]?.price ?? null;
      const purchasePrice = row.original.purchasePrice;
      if (upperPrice == null || purchasePrice == null) {
        return <span className="text-muted-foreground text-right block">-</span>;
      }
      const profit = upperPrice - purchasePrice;
      return (
        <span className={`text-right block tabular-nums ${profit < 0 ? "text-destructive" : ""}`}>
          {formatPriceMan(profit)}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const exit = row.original;
      const meta = table.options.meta as {
        onView?: (exit: ExitListItem) => void;
        onEdit?: (exit: ExitListItem) => void;
        onDistribute?: (exit: ExitListItem) => void;
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-6 p-0 hover:bg-transparent hover:ring-ring/50 hover:ring-[3px]"
            >
              <MoreHorizontal className="size-4" />
              <span className="sr-only">操作メニュー</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[100px]">
            <DropdownMenuItem onClick={() => meta?.onView?.(exit)}>
              <Eye className="h-3 w-3" />
              詳細
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => meta?.onEdit?.(exit)}>
              <Edit className="h-3 w-3" />
              編集
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => meta?.onDistribute?.(exit)}>
              <Send className="h-3 w-3" />
              配布
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
