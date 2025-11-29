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
import { useState } from "react";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onView?: (data: TData) => void;
  onEdit?: (data: TData) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onView,
  onEdit,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState("");

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
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
    meta: {
      onView,
      onEdit,
    },
    initialState: {
      pagination: {
        pageSize: 100,
      },
    },
  });

  return (
    <div className="flex h-full flex-col gap-3 overflow-hidden">
      <div className="shrink-0">
        <DataTableToolbar table={table} />
      </div>
      <Card className="overflow-hidden p-2">
        <ScrollArea className="min-h-0 flex-1 overflow-auto">
          <Table className="text-[10px]">
            <TableHeader className="sticky top-0 bg-background z-10 [&_tr]:border-b-0">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="hover:bg-transparent relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-border"
                >
                  {headerGroup.headers.map((header) => {
                    // カラム幅とstickyクラスを設定
                    const getColumnClass = () => {
                      const id = header.column.id;
                      switch (id) {
                        case "organization":
                          return "";
                        case "staff":
                          return "w-[50px]";
                        case "propertyName":
                          return "";
                        case "roomNumber":
                          return "w-[40px]";
                        case "ownerName":
                          return "min-w-[55px]";
                        case "amountA":
                          return "w-[50px]";
                        case "amountExit":
                          return "w-[50px]";
                        case "commission":
                          return "w-[100px]";
                        case "profit":
                          return "w-[50px]";
                        case "bcDeposit":
                          return "w-[50px]";
                        case "settlementDate":
                          return "w-[60px]";
                        case "buyerCompany":
                          return "min-w-[50px]";
                        case "contractType":
                        case "companyB":
                        case "brokerCompany":
                        case "progressStatus":
                        case "documentStatus":
                          return "w-[70px]";
                        case "notes":
                          return "min-w-[65px] w-[120px]";
                        case "actions":
                          return "sticky right-0 bg-background w-[50px]";
                        default:
                          return "";
                      }
                    };

                    return (
                      <TableHead
                        key={header.id}
                        className={`text-[10px] p-1 ${getColumnClass()}`}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
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
                    {row.getVisibleCells().map((cell) => {
                      // セルのクラスを設定（ヘッダーと同じ）
                      const getCellClass = () => {
                        const id = cell.column.id;
                        const base = "text-[10px] p-1";
                        switch (id) {
                          case "organization":
                            return `${base} bg-background`;
                          case "staff":
                            return `${base} bg-background w-[50px]`;
                          case "propertyName":
                            return `${base} max-w-[120px]`;
                          case "roomNumber":
                            return `${base}`;
                          case "ownerName":
                            return `${base} max-w-[120px] `;
                          case "notes":
                            return `${base} max-w-[100px]`;
                          case "actions":
                            return `${base} sticky right-2`;
                          default:
                            return base;
                        }
                      };

                      return (
                        <TableCell key={cell.id} className={getCellClass()}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      );
                    })}
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
