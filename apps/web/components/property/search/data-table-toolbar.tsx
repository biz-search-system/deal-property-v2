"use client";

import { Table } from "@tanstack/react-table";
import { X, SlidersHorizontal, Search } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { organizationSlugs, OrganizationSlugType } from "@workspace/utils";
import {
  ContractType,
  DocumentStatus,
  ProgressStatus,
} from "@workspace/drizzle/types";
import ProgressStatusBadge from "../badge/progress-status-badge";
import {
  contractType,
  documentStatus,
  progressStatus,
} from "@workspace/drizzle/schemas";
import OrganizationBadge from "../badge/organization-badge";
import DocumentStatusBadge from "../badge/document-status-badge";
import ContractTypeBadge from "../badge/contract-type-badge";

/** カラムIDから日本語表示名へのマッピング */
const COLUMN_LABELS: Record<string, string> = {
  organization: "管理組織",
  staff: "担当",
  propertyName: "物件名",
  roomNumber: "号室",
  ownerName: "オーナー",
  amountA: "A金額",
  amountExit: "出口",
  commission: "仲手等",
  profit: "利益",
  bcDeposit: "BC手付",
  settlementDate: "決済日",
  buyerCompany: "買取",
  contractType: "契約形態",
  companyB: "B会社",
  brokerCompany: "仲介",
  progressStatus: "進捗",
  documentStatus: "書類",
  notes: "備考",
};

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  // metaから検索値とフィルター値を取得
  const meta = table.options.meta as
    | {
        search?: string;
        onSearchChange?: (value: string) => void;
        organizationFilter?: OrganizationSlugType;
        onOrganizationFilterChange?: (value: string) => void;
        progressStatusFilter?: ProgressStatus;
        onProgressStatusFilterChange?: (value: string) => void;
        documentStatusFilter?: DocumentStatus;
        onDocumentStatusFilterChange?: (value: string) => void;
        contractTypeFilter?: ContractType;
        onContractTypeFilterChange?: (value: string) => void;
      }
    | undefined;
  const search = meta?.search ?? "";
  const onSearchChange = meta?.onSearchChange;
  const organizationFilter = meta?.organizationFilter;
  const onOrganizationFilterChange = meta?.onOrganizationFilterChange;
  const progressStatusFilter = meta?.progressStatusFilter;
  const onProgressStatusFilterChange = meta?.onProgressStatusFilterChange;
  const documentStatusFilter = meta?.documentStatusFilter;
  const onDocumentStatusFilterChange = meta?.onDocumentStatusFilterChange;
  const contractTypeFilter = meta?.contractTypeFilter;
  const onContractTypeFilterChange = meta?.onContractTypeFilterChange;

  return (
    <div className="flex flex-col gap-3">
      {/* 検索バー */}
      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="物件名、オーナー名、号室、備考、担当者名を入力して検索"
            value={search}
            onChange={(event) => onSearchChange?.(event.target.value)}
            className="pl-8 h-9 w-[664px]"
          />
        </div>
        {search && (
          <Button
            variant="ghost"
            onClick={() => onSearchChange?.("")}
            className="px-2 lg:px-3"
          >
            リセット
            <X className="ml-2 size-4" />
          </Button>
        )}
      </div>

      {/* フィルターとアクション */}
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center gap-2">
          {/* 組織フィルター */}
          <Select
            value={organizationFilter ?? "all"}
            onValueChange={(value) =>
              onOrganizationFilterChange?.(value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="h-8 w-[160px]">
              <SelectValue placeholder="組織">
                {organizationFilter ? (
                  <OrganizationBadge
                    organizationSlug={organizationFilter}
                    size="medium"
                  />
                ) : (
                  "管理組織"
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              {organizationSlugs.map((orgSlug) => (
                <SelectItem key={orgSlug} value={orgSlug}>
                  <OrganizationBadge organizationSlug={orgSlug} size="medium" />
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* 進捗フィルター */}
          <Select
            value={progressStatusFilter ?? "all"}
            onValueChange={(value) =>
              onProgressStatusFilterChange?.(value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="h-8 w-[160px]">
              <SelectValue placeholder="進捗">
                {progressStatusFilter ? (
                  <ProgressStatusBadge
                    progressStatus={progressStatusFilter}
                    size="medium"
                  />
                ) : (
                  "契約ステータス"
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              {progressStatus.map((status) => (
                <SelectItem key={status} value={status}>
                  <ProgressStatusBadge progressStatus={status} size="medium" />
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* 書類フィルター */}
          <Select
            value={documentStatusFilter ?? "all"}
            onValueChange={(value) =>
              onDocumentStatusFilterChange?.(value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="h-8 w-[160px]">
              <SelectValue placeholder="書類">
                {documentStatusFilter ? (
                  <DocumentStatusBadge
                    documentStatus={documentStatusFilter}
                    size="medium"
                  />
                ) : (
                  "書類ステータス"
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              {documentStatus.map((status) => (
                <SelectItem key={status} value={status}>
                  <DocumentStatusBadge documentStatus={status} size="medium" />
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* 契約形態フィルター */}
          <Select
            value={contractTypeFilter ?? "all"}
            onValueChange={(value) =>
              onContractTypeFilterChange?.(value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="h-8 w-[160px]">
              <SelectValue placeholder="契約形態">
                {contractTypeFilter ? (
                  <ContractTypeBadge
                    contractType={contractTypeFilter}
                    size="medium"
                  />
                ) : (
                  "契約形態"
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              {contractType.map((type) => (
                <SelectItem key={type} value={type}>
                  <ContractTypeBadge contractType={type} size="medium" />
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* フィルターをクリア */}
          {(organizationFilter ||
            progressStatusFilter ||
            documentStatusFilter ||
            contractTypeFilter) && (
            <Button
              variant="ghost"
              onClick={() => {
                onOrganizationFilterChange?.("");
                onProgressStatusFilterChange?.("");
                onDocumentStatusFilterChange?.("");
                onContractTypeFilterChange?.("");
              }}
              className="px-2 lg:px-3"
            >
              リセット
              <X className="ml-2 size-4" />
            </Button>
          )}
        </div>

        {/* 右側のアクション */}
        <div className="flex items-center gap-2">
          {/* カラム表示制御 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <SlidersHorizontal className="mr-2 size-4" />
                表示項目
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>表示する項目</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide(),
                )
                .map((column) => {
                  const displayName = COLUMN_LABELS[column.id] || column.id;
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {displayName}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
