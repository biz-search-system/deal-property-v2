"use client";

import { ColumnDef } from "@tanstack/react-table";
import type { PropertyWithRelations } from "@/lib/types/property";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import {
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
  OrganizationSlugType,
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
import { DataTableColumnHeader } from "@/components/property/search/data-table-column-header";
import {
  updatePropertyAmount,
  updatePropertyName,
  updatePropertyNotes,
  updatePropertyOwnerName,
  updatePropertyEnumField,
  updatePropertyProgressStatus,
  updatePropertyDocumentStatus,
} from "@/lib/actions/property";
import { TextPopoverEdit } from "../inline-edit/text-popover-edit";
import { CurrencyPopoverEdit } from "../inline-edit/currency-popover-edit";
import { BadgeDropdownEdit } from "../inline-edit/badge-dropdown-edit";
import { RoomNumberPopoverEdit } from "../inline-edit/room-number-popover-edit";
import { BuyerCompanyComboboxEdit } from "../inline-edit/buyer-company-combobox-edit";
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

  if (isNaN(date.getTime())) return "-";

  const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const isMonthEnd =
    date.getHours() === 0 &&
    date.getMinutes() === 0 &&
    date.getSeconds() === 10 &&
    date.getMilliseconds() === 0 &&
    date.getDate() === lastDayOfMonth.getDate();

  if (isMonthEnd) {
    return `${date.getMonth() + 1}月末予定`;
  }

  const days = ["日", "月", "火", "水", "木", "金", "土"];
  return `${date.getMonth() + 1}/${date.getDate()}(${days[date.getDay()]})`;
};

export const monthlyColumns: ColumnDef<PropertyWithRelations>[] = [
  {
    accessorKey: "organization",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="管理組織" />;
    },
    cell: ({ row }) => {
      const organization = row.original.organization;
      return (
        <OrganizationBadge
          organizationSlug={organization.slug as OrganizationSlugType}
        />
      );
    },
  },
  {
    accessorKey: "staff",
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
          key={`${row.original.id}-${row.original.propertyName}`}
          id={row.original.id}
          currentValue={row.original.propertyName}
          onSave={async (id, value) => {
            await updatePropertyName({ id, propertyName: value });
          }}
          required
          maxLength={400}
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
    cell: ({ row }) => {
      return (
        <RoomNumberPopoverEdit
          key={`${row.original.id}-${row.original.roomNumber}`}
          propertyId={row.original.id}
          currentValue={row.original.roomNumber}
        />
      );
    },
  },
  {
    accessorKey: "ownerName",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="オーナー" />;
    },
    cell: ({ row }) => {
      return (
        <TextPopoverEdit
          key={`${row.original.id}-${row.original.ownerName}`}
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
          key={`${row.original.id}-${row.original.amountA}`}
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
          key={`${row.original.id}-${row.original.amountExit}`}
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
          key={`${row.original.id}-${row.original.commission}`}
          id={row.original.id}
          currentValue={row.original.commission}
          onSave={async (id, value) => {
            await updatePropertyAmount({ id, field: "commission", value });
          }}
          title="仲手等編集"
          description="仲手等を編集できます"
          successMessage="仲手等を更新しました"
          errorMessage="仲手等の更新に失敗しました"
          step="0.01"
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
          key={`${row.original.id}-${row.original.profit}`}
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
          key={`${row.original.id}-${row.original.bcDeposit}`}
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
          key={`${row.original.id}-${row.original.settlementDate}`}
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
        <BuyerCompanyComboboxEdit
          key={`${row.original.id}-${row.original.buyerCompany}`}
          propertyId={row.original.id}
          currentValue={row.original.buyerCompany}
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
          key={`${row.original.id}-${row.original.contractType}`}
          id={row.original.id}
          currentValue={row.original.contractType}
          options={contractType}
          labels={CONTRACT_TYPE_LABELS}
          colors={CONTRACT_TYPE_COLORS}
          onSave={async (id, value) => {
            return await updatePropertyEnumField({
              id,
              field: "contractType",
              value,
            });
          }}
          successMessage="契約形態を更新しました"
          errorMessage="契約形態の更新に失敗しました"
          allowNull
        />
      );
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
          key={`${row.original.id}-${row.original.companyB}`}
          id={row.original.id}
          currentValue={row.original.companyB}
          options={companyB}
          labels={COMPANY_B_LABELS}
          colors={COMPANY_B_COLORS}
          onSave={async (id, value) => {
            return await updatePropertyEnumField({
              id,
              field: "companyB",
              value,
            });
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
          key={`${row.original.id}-${row.original.brokerCompany}`}
          id={row.original.id}
          currentValue={row.original.brokerCompany}
          options={brokerCompany}
          labels={BROKER_COMPANY_LABELS}
          colors={BROKER_COMPANY_COLORS}
          onSave={async (id, value) => {
            return await updatePropertyEnumField({
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
          key={`${row.original.id}-${row.original.progressStatus}`}
          id={row.original.id}
          currentValue={row.original.progressStatus}
          options={progressStatus}
          labels={PROGRESS_STATUS_LABELS}
          colors={PROGRESS_STATUS_COLORS}
          onSave={async (id, value) => {
            return await updatePropertyProgressStatus({
              id,
              progressStatus: value,
            });
          }}
          successMessage="進捗ステータスを更新しました"
          errorMessage="進捗ステータスの更新に失敗しました"
        />
      );
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
          key={`${row.original.id}-${row.original.documentStatus}`}
          id={row.original.id}
          currentValue={row.original.documentStatus}
          options={documentStatus}
          labels={DOCUMENT_STATUS_LABELS}
          colors={DOCUMENT_STATUS_COLORS}
          onSave={async (id, value) => {
            return await updatePropertyDocumentStatus({
              id,
              documentStatus: value,
            });
          }}
          successMessage="書類ステータスを更新しました"
          errorMessage="書類ステータスの更新に失敗しました"
        />
      );
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
          key={`${row.original.id}-${row.original.notes}`}
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
        onDelete?: (property: PropertyWithRelations) => void;
      };

      return (
        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-6 p-0 hover:bg-transparent hover:ring-ring/50 hover:ring-[3px]"
              >
                <MoreHorizontal className="size-5" />
                <span className="sr-only">操作メニュー</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[100px]">
              <DropdownMenuItem onClick={() => meta?.onView?.(property)}>
                <Eye className="h-3 w-3 mr-2" />
                詳細
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => meta?.onEdit?.(property)}>
                <Edit className="h-3 w-3 mr-2" />
                編集
              </DropdownMenuItem>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem className="text-destructive focus:text-destructive">
                  <Trash2 className="h-3 w-3 mr-2" />
                  削除
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>物件を削除しますか？</AlertDialogTitle>
              <AlertDialogDescription>
                「{property.propertyName}」を削除します。この操作は取り消せません。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>キャンセル</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => meta?.onDelete?.(property)}
                className="bg-destructive text-white hover:bg-destructive/90 dark:bg-destructive/60"
              >
                削除
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    },
  },
];
