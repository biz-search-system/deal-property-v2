"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ContractType,
  DocumentStatus,
  ProgressStatus,
} from "@workspace/drizzle/types";
import { Card } from "@workspace/ui/components/card";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { OrganizationSlugType } from "@workspace/utils";
import { useState } from "react";
import {
  getHeaderColumnClass,
  getCellColumnClass,
} from "../table/column-class-helpers";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onView?: (data: TData) => void;
  onEdit?: (data: TData) => void;
  onDelete?: (data: TData) => void;
  /** 検索文字列 */
  search?: string;
  /** 検索文字列変更時のコールバック */
  onSearchChange?: (value: string) => void;
  /** 組織フィルター */
  organizationFilter?: OrganizationSlugType;
  /** 組織フィルター変更時のコールバック */
  onOrganizationFilterChange?: (value: string) => void;
  /** 進捗ステータスフィルター */
  progressStatusFilter?: ProgressStatus;
  /** 進捗ステータスフィルター変更時のコールバック */
  onProgressStatusFilterChange?: (value: string) => void;
  /** 書類ステータスフィルター */
  documentStatusFilter?: DocumentStatus;
  /** 書類ステータスフィルター変更時のコールバック */
  onDocumentStatusFilterChange?: (value: string) => void;
  /** 契約形態フィルター */
  contractTypeFilter?: ContractType;
  /** 契約形態フィルター変更時のコールバック */
  onContractTypeFilterChange?: (value: string) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onView,
  onEdit,
  onDelete,
  search = "",
  onSearchChange,
  organizationFilter,
  onOrganizationFilterChange,
  progressStatusFilter,
  onProgressStatusFilterChange,
  documentStatusFilter,
  onDocumentStatusFilterChange,
  contractTypeFilter,
  onContractTypeFilterChange,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    meta: {
      onView,
      onEdit,
      onDelete,
      search,
      onSearchChange,
      organizationFilter,
      onOrganizationFilterChange,
      progressStatusFilter,
      onProgressStatusFilterChange,
      documentStatusFilter,
      onDocumentStatusFilterChange,
      contractTypeFilter,
      onContractTypeFilterChange,
    },
    initialState: {
      pagination: {
        pageSize: 100,
      },
    },
  });

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="shrink-0">
        <DataTableToolbar table={table} />
      </div>
      <Card className="overflow-hidden px-3 py-2">
        <ScrollArea className="min-h-0 flex-1 overflow-auto">
          <Table className="text-[10px]">
            <TableHeader className="sticky top-0 bg-background z-10 [&_tr]:border-b-0">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="hover:bg-transparent relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-border"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className={`text-[10px] p-1 text-center ${getHeaderColumnClass(header.column.id)}`}
                    >
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
                      <TableCell
                        key={cell.id}
                        className={getCellColumnClass(cell.column.id)}
                      >
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
                    colSpan={columns.length}
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
      <div className="shrink-0">
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
