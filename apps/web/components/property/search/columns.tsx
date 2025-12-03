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
import {
  OrganizationNameType,
  CONTRACT_TYPE_LABELS,
  CONTRACT_TYPE_COLORS,
  COMPANY_B_LABELS,
  COMPANY_B_COLORS,
  BROKER_COMPANY_LABELS,
  BROKER_COMPANY_COLORS,
  PROGRESS_STATUS_LABELS,
  PROGRESS_STATUS_COLORS,
  DOCUMENT_STATUS_LABELS,
  DOCUMENT_STATUS_COLORS,
} from "@workspace/utils";
import {
  contractType,
  companyB,
  brokerCompany,
  progressStatus,
  documentStatus,
} from "@workspace/drizzle/schemas";
import OrganizationBadge from "@/components/property/badge/organization-badge";
import { SettlementDatePopoverEdit } from "@/components/property/inline-edit/settlement-date-popover-edit";
import { DataTableColumnHeader } from "./data-table-column-header";
import {
  updatePropertyAmount,
  updatePropertyName,
  updatePropertyNotes,
  updatePropertyOwnerName,
  updatePropertyEnumField,
  updatePropertyBuyerCompany,
  updatePropertyProgressStatus,
  updatePropertyDocumentStatus,
} from "@/lib/actions/property";
import { TextPopoverEdit } from "../inline-edit/text-popover-edit";
import { CurrencyPopoverEdit } from "../inline-edit/currency-popover-edit";
import { BadgeDropdownEdit } from "../inline-edit/badge-dropdown-edit";
import type {
  ContractType,
  CompanyB,
  BrokerCompany,
  ProgressStatus,
  DocumentStatus,
} from "@workspace/drizzle/types";

const formatDateWithDay = (dateString: string | Date | null): string => {
  if (!dateString) return "-";
  const date: Date =
    typeof dateString === "string" ? new Date(dateString) : dateString;

  // 無効な日付チェック
  if (isNaN(date.getTime())) return "-";

  // 月末判定（午前0時0分10秒かつ月末日の場合）
  const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const isMonthEnd =
    date.getHours() === 0 &&
    date.getMinutes() === 0 &&
    date.getSeconds() === 10 &&
    date.getMilliseconds() === 0 &&
    date.getDate() === lastDayOfMonth.getDate();

  if (isMonthEnd) {
    // 月末表示（例: 11月末）
    return `${date.getMonth() + 1}月末予定`;
  }

  // 通常の曜日付きフォーマット
  const days = ["日", "月", "火", "水", "木", "金", "土"];
  return `${date.getMonth() + 1}/${date.getDate()}(${days[date.getDay()]})`;
};

export const columns: ColumnDef<PropertyWithRelations>[] = [
  {
    accessorKey: "organization",
    // header: "管理組織",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="管理組織" />;
    },
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
    // header: "担当",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="担当" />;
    },
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
      return (
        <TextPopoverEdit
          id={row.original.id}
          currentValue={row.original.propertyName}
          onSave={async (id, value) => {
            await updatePropertyName({ id, propertyName: value });
          }}
          required
          maxLength={200}
          title="物件名編集"
          description="物件名を編集できます"
          placeholder="物件名を入力してください"
          successMessage="物件名を更新しました"
          errorMessage="物件名の更新に失敗しました"
          requiredErrorMessage="物件名は必須です"
        />
      );
    },
  },
  {
    accessorKey: "roomNumber",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="号室" />;
    },
    cell: ({ row }) => row.original.roomNumber || "-",
  },
  {
    accessorKey: "ownerName",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="オーナー" />;
    },
    cell: ({ row }) => {
      return (
        <TextPopoverEdit
          id={row.original.id}
          currentValue={row.original.ownerName}
          onSave={async (id, value) => {
            await updatePropertyOwnerName({ id, ownerName: value });
          }}
          maxLength={100}
          title="オーナー名編集"
          description="オーナー名を編集できます"
          placeholder="オーナー名を入力してください"
          successMessage="オーナー名を更新しました"
          errorMessage="オーナー名の更新に失敗しました"
        />
      );
    },
  },
  {
    accessorKey: "amountA",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="A金額" />;
    },
    cell: ({ row }) => {
      return (
        <CurrencyPopoverEdit
          id={row.original.id}
          currentValue={row.original.amountA}
          onSave={async (id, value) => {
            await updatePropertyAmount({ id, field: "amountA", value });
          }}
          title="A金額編集"
          description="A金額を編集できます"
          successMessage="A金額を更新しました"
          errorMessage="A金額の更新に失敗しました"
        />
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
        <CurrencyPopoverEdit
          id={row.original.id}
          currentValue={row.original.amountExit}
          onSave={async (id, value) => {
            await updatePropertyAmount({ id, field: "amountExit", value });
          }}
          title="出口金額編集"
          description="出口金額を編集できます"
          successMessage="出口金額を更新しました"
          errorMessage="出口金額の更新に失敗しました"
        />
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
        <CurrencyPopoverEdit
          id={row.original.id}
          currentValue={row.original.commission}
          onSave={async (id, value) => {
            await updatePropertyAmount({ id, field: "commission", value });
          }}
          title="仲手等編集"
          description="仲手等を編集できます"
          successMessage="仲手等を更新しました"
          errorMessage="仲手等の更新に失敗しました"
        />
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
        <CurrencyPopoverEdit
          id={row.original.id}
          currentValue={row.original.profit}
          editable={false}
          title="利益"
          highlight
        />
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
        <CurrencyPopoverEdit
          id={row.original.id}
          currentValue={row.original.bcDeposit}
          onSave={async (id, value) => {
            await updatePropertyAmount({ id, field: "bcDeposit", value });
          }}
          title="BC手付編集"
          description="BC手付金額を編集できます"
          successMessage="BC手付を更新しました"
          errorMessage="BC手付の更新に失敗しました"
        />
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
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="買取" />;
    },
    cell: ({ row }) => {
      return (
        <TextPopoverEdit
          id={row.original.id}
          currentValue={row.original.buyerCompany}
          onSave={async (id, value) => {
            await updatePropertyBuyerCompany({
              id,
              buyerCompany: value || null,
            });
          }}
          maxLength={100}
          title="買取会社編集"
          description="買取会社を編集できます"
          placeholder="買取会社を入力してください"
          successMessage="買取会社を更新しました"
          errorMessage="買取会社の更新に失敗しました"
        />
      );
    },
  },
  {
    accessorKey: "contractType",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="契約形態" />;
    },
    cell: ({ row }) => {
      return (
        <BadgeDropdownEdit<ContractType>
          id={row.original.id}
          currentValue={row.original.contractType}
          options={contractType}
          labels={CONTRACT_TYPE_LABELS}
          colors={CONTRACT_TYPE_COLORS}
          onSave={async (id, value) => {
            await updatePropertyEnumField({ id, field: "contractType", value });
          }}
          successMessage="契約形態を更新しました"
          errorMessage="契約形態の更新に失敗しました"
          allowNull
        />
      );
    },
    filterFn: (row, id, value) => {
      return row.original.contractType === value;
    },
  },
  {
    accessorKey: "companyB",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="B会社" />;
    },
    cell: ({ row }) => {
      return (
        <BadgeDropdownEdit<CompanyB>
          id={row.original.id}
          currentValue={row.original.companyB}
          options={companyB}
          labels={COMPANY_B_LABELS}
          colors={COMPANY_B_COLORS}
          onSave={async (id, value) => {
            await updatePropertyEnumField({ id, field: "companyB", value });
          }}
          successMessage="B会社を更新しました"
          errorMessage="B会社の更新に失敗しました"
          allowNull
        />
      );
    },
  },
  {
    accessorKey: "brokerCompany",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="仲介" />;
    },
    cell: ({ row }) => {
      return (
        <BadgeDropdownEdit<BrokerCompany>
          id={row.original.id}
          currentValue={row.original.brokerCompany}
          options={brokerCompany}
          labels={BROKER_COMPANY_LABELS}
          colors={BROKER_COMPANY_COLORS}
          onSave={async (id, value) => {
            await updatePropertyEnumField({
              id,
              field: "brokerCompany",
              value,
            });
          }}
          successMessage="仲介会社を更新しました"
          errorMessage="仲介会社の更新に失敗しました"
          allowNull
        />
      );
    },
  },
  {
    accessorKey: "progressStatus",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="進捗" />;
    },
    cell: ({ row }) => {
      return (
        <BadgeDropdownEdit<ProgressStatus>
          id={row.original.id}
          currentValue={row.original.progressStatus}
          options={progressStatus}
          labels={PROGRESS_STATUS_LABELS}
          colors={PROGRESS_STATUS_COLORS}
          onSave={async (id, value) => {
            if (value) {
              await updatePropertyProgressStatus({ id, progressStatus: value });
            }
          }}
          successMessage="進捗ステータスを更新しました"
          errorMessage="進捗ステータスの更新に失敗しました"
        />
      );
    },
    filterFn: (row, id, value) => {
      return row.original.progressStatus === value;
    },
  },
  {
    accessorKey: "documentStatus",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="書類" />;
    },
    cell: ({ row }) => {
      return (
        <BadgeDropdownEdit<DocumentStatus>
          id={row.original.id}
          currentValue={row.original.documentStatus}
          options={documentStatus}
          labels={DOCUMENT_STATUS_LABELS}
          colors={DOCUMENT_STATUS_COLORS}
          onSave={async (id, value) => {
            if (value) {
              await updatePropertyDocumentStatus({ id, documentStatus: value });
            }
          }}
          successMessage="書類ステータスを更新しました"
          errorMessage="書類ステータスの更新に失敗しました"
        />
      );
    },
    filterFn: (row, id, value) => {
      return row.original.documentStatus === value;
    },
  },
  {
    accessorKey: "notes",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="備考" />;
    },
    cell: ({ row }) => {
      return (
        <TextPopoverEdit
          id={row.original.id}
          currentValue={row.original.notes}
          onSave={async (id, value) => {
            await updatePropertyNotes({ id, notes: value });
          }}
          title="備考編集"
          description="物件に関する備考を編集できます"
          placeholder="備考を入力してください"
          successMessage="備考を更新しました"
          errorMessage="備考の更新に失敗しました"
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
