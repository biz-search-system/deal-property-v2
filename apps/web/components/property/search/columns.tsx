"use client";

import { ColumnDef } from "@tanstack/react-table";
import type { PropertyWithRelations } from "@/lib/types/property";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { OrganizationNameType } from "@workspace/utils";
import ContractTypeBadge from "@/components/property/badge/contract-type-badge";
import CompanyBBadge from "@/components/property/badge/company-b-badge";
import BrokerCompanyBadge from "@/components/property/badge/broker-company-badge";
import OrganizationBadge from "@/components/property/badge/organization-badge";
import { ProgressStatusInlineEdit } from "@/components/property/inline-edit/progress-status-inline-edit";
import { DocumentStatusInlineEdit } from "@/components/property/inline-edit/document-status-inline-edit";
import { NotesPopoverEdit } from "@/components/property/inline-edit/notes-popover-edit";
import { SettlementDatePopoverEdit } from "@/components/property/inline-edit/settlement-date-popover-edit";
import { PropertyNameCell } from "../property-name-cell";
import { DataTableColumnHeader } from "./data-table-column-header";

// フォーマット関数
const formatCurrency = (value: number | null | undefined) => {
  if (value === null || value === undefined) return "-";
  // 1万円未満の場合は円単位で表示
  if (value < 10000) {
    return `${value.toLocaleString()}円`;
  }
  // 1万円以上の場合は万円単位で表示
  return `${(value / 10000).toFixed(0)}万`;
};

const formatDateWithDay = (dateString: string | Date | null): string => {
  if (!dateString) return "-";
  const date: Date =
    typeof dateString === "string" ? new Date(dateString) : dateString;
  const days = ["日", "月", "火", "水", "木", "金", "土"];
  return `${date.getMonth() + 1}/${date.getDate()}(${days[date.getDay()]})`;
};

const truncateText = (
  text: string | null | undefined,
  maxLength: number = 5
) => {
  if (!text) return "-";
  return text.length > maxLength ? text.substring(0, maxLength) : text;
};

export const columns: ColumnDef<PropertyWithRelations>[] = [
  {
    accessorKey: "organization",
    header: "管理組織",
    cell: ({ row }) => {
      const organization = row.original.organization;
      return (
        <OrganizationBadge
          organization={organization.name as OrganizationNameType}
        />
      );
    },
    filterFn: (row, id, value) => {
      return row.original.organization.name === value;
    },
  },
  {
    accessorKey: "staff",
    header: "担当",
    cell: ({ row }) => {
      const staff = row.original.staff;
      return (
        <div className="flex gap-1 flex-wrap">
          {staff.map((staffMember, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="text-[9px] px-1 py-0"
            >
              {staffMember.user?.name || "担当者"}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "propertyName",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="物件名" />;
    },
    cell: ({ row }) => {
      return <PropertyNameCell propertyName={row.original.propertyName} />;
    },
  },
  {
    accessorKey: "roomNumber",
    header: "号室",
    cell: ({ row }) => row.original.roomNumber || "-",
  },
  {
    accessorKey: "ownerName",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="オーナー" />;
    },
    cell: ({ row }) => row.original.ownerName || "-",
  },
  {
    accessorKey: "amountA",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="A金額" />;
    },
    cell: ({ row }) => {
      return (
        <div className="text-right">{formatCurrency(row.original.amountA)}</div>
      );
    },
  },
  {
    accessorKey: "amountExit",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="出口" />;
    },
    cell: ({ row }) => {
      return (
        <div className="text-right">
          {formatCurrency(row.original.amountExit)}
        </div>
      );
    },
  },
  {
    accessorKey: "commission",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="仲手等" />;
    },
    cell: ({ row }) => {
      return (
        <div className="text-right">
          {formatCurrency(row.original.commission)}
        </div>
      );
    },
  },
  {
    accessorKey: "profit",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="利益" />;
    },
    cell: ({ row }) => {
      return (
        <div className="text-right font-semibold text-green-600 dark:text-green-400">
          {formatCurrency(row.original.profit)}
        </div>
      );
    },
  },
  {
    accessorKey: "bcDeposit",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="BC手付" />;
    },
    cell: ({ row }) => {
      return (
        <div className="text-right">
          {formatCurrency(row.original.bcDeposit)}
        </div>
      );
    },
  },
  {
    accessorKey: "settlementDate",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="決済日" />;
    },
    cell: ({ row }) => {
      return (
        <SettlementDatePopoverEdit
          propertyId={row.original.id}
          currentDate={row.original.settlementDate}
          formatDisplay={formatDateWithDay}
        />
      );
    },
  },
  {
    accessorKey: "buyerCompany",
    header: "買取",
    cell: ({ row }) => {
      return (
        <Badge variant="outline" className="text-[9px] px-1 py-0">
          {truncateText(row.original.buyerCompany)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "contractType",
    header: "契約形態",
    cell: ({ row }) => {
      return <ContractTypeBadge contractType={row.original.contractType} />;
    },
    filterFn: (row, id, value) => {
      return row.original.contractType === value;
    },
  },
  {
    accessorKey: "companyB",
    header: "B会社",
    cell: ({ row }) => {
      return <CompanyBBadge companyB={row.original.companyB} />;
    },
  },
  {
    accessorKey: "brokerCompany",
    header: "仲介",
    cell: ({ row }) => {
      return (
        <BrokerCompanyBadge brokerCompany={row.original.brokerCompany} />
      );
    },
  },
  {
    accessorKey: "progressStatus",
    header: "進捗",
    cell: ({ row }) => {
      return (
        <ProgressStatusInlineEdit
          propertyId={row.original.id}
          currentStatus={row.original.progressStatus}
        />
      );
    },
    filterFn: (row, id, value) => {
      return row.original.progressStatus === value;
    },
  },
  {
    accessorKey: "documentStatus",
    header: "書類",
    cell: ({ row }) => {
      return (
        <DocumentStatusInlineEdit
          propertyId={row.original.id}
          currentStatus={row.original.documentStatus}
        />
      );
    },
    filterFn: (row, id, value) => {
      return row.original.documentStatus === value;
    },
  },
  {
    accessorKey: "notes",
    header: "備考",
    cell: ({ row }) => {
      return (
        <NotesPopoverEdit
          propertyId={row.original.id}
          currentNotes={row.original.notes}
        />
      );
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const property = row.original;
      const meta = table.options.meta as {
        onView?: (property: PropertyWithRelations) => void;
        onEdit?: (property: PropertyWithRelations) => void;
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
              <MoreHorizontal className="h-3 w-3" />
              <span className="sr-only">操作メニュー</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => meta?.onView?.(property)}>
              詳細
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => meta?.onEdit?.(property)}>
              編集
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];