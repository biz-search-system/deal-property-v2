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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import { PopoverProvider } from "../property-name-cell";
import { useState } from "react";

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
  });

  return (
    <div className="space-y-4">
      <DataTableToolbar table={table} />
      <div className="overflow-auto max-h-[calc(100vh-400px)]">
        <PopoverProvider>
          <Table className="text-[10px]">
            <TableHeader className="sticky top-0 bg-background z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    // カラム幅とstickyクラスを設定
                    const getColumnClass = () => {
                      const id = header.column.id;
                      switch (id) {
                        case "organization":
                          return "sticky left-0 bg-background z-20 w-[70px]";
                        case "staff":
                          return "sticky left-[70px] bg-background z-20 min-w-[45px] w-[70px]";
                        case "propertyName":
                          return "sticky left-[140px] bg-background z-20 min-w-[65px]";
                        case "roomNumber":
                          return "sticky left-[205px] bg-background z-20 w-[40px]";
                        case "ownerName":
                          return "min-w-[55px]";
                        case "amountA":
                        case "amountExit":
                        case "commission":
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
                          return "sticky right-0 bg-background z-20 w-[50px]";
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
                            return `${base} sticky left-0 bg-background`;
                          case "staff":
                            return `${base} sticky left-[70px] bg-background`;
                          case "propertyName":
                            return `${base} sticky max-w-[120px]`;
                          case "roomNumber":
                            return `${base} sticky left-[205px] bg-background`;
                          case "notes":
                            return `${base} sticky max-w-[100px]`;
                          case "actions":
                            return `${base} sticky right-0`;
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
        </PopoverProvider>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
