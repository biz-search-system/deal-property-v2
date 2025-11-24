"use client";

import { Table } from "@tanstack/react-table";
import { X, SlidersHorizontal, Download, Search } from "lucide-react";

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
import {
  PROGRESS_STATUS_LABELS,
  DOCUMENT_STATUS_LABELS,
  CONTRACT_TYPE_LABELS,
  ORGANIZATION_LABELS,
} from "@workspace/utils";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  // CSVエクスポート機能
  const handleExport = () => {
    const headers = table
      .getAllColumns()
      .filter((column) => column.getIsVisible() && column.id !== "actions")
      .map((column) => {
        const header = column.columnDef.header;
        if (typeof header === "string") return header;
        return column.id;
      });

    const rows = table.getFilteredRowModel().rows.map((row) => {
      return headers.map((_, index) => {
        const cell = row.getVisibleCells()[index];
        const value = cell?.getValue();
        if (value === null || value === undefined) return "";
        return String(value);
      });
    });

    // CSV形式に変換
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    // ダウンロード
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `properties_${new Date().toISOString()}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 検索バー */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="物件名、オーナー名で検索..."
            value={table.getState().globalFilter ?? ""}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            className="pl-8 h-8"
          />
        </div>
      </div>

      {/* フィルターとアクション */}
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center gap-2">
          {/* 組織フィルター */}
          <Select
            value={
              (table.getColumn("organization")?.getFilterValue() as string) ??
              "all"
            }
            onValueChange={(value) =>
              table
                .getColumn("organization")
                ?.setFilterValue(value === "all" ? undefined : value)
            }
          >
            <SelectTrigger className="h-8 w-[150px]">
              <SelectValue placeholder="組織" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              {Object.values(ORGANIZATION_LABELS).map((org) => (
                <SelectItem key={org} value={org}>
                  {org}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* 進捗フィルター */}
          <Select
            value={
              (table.getColumn("progressStatus")?.getFilterValue() as string) ??
              "all"
            }
            onValueChange={(value) =>
              table
                .getColumn("progressStatus")
                ?.setFilterValue(value === "all" ? undefined : value)
            }
          >
            <SelectTrigger className="h-8 w-[150px]">
              <SelectValue placeholder="進捗" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              {Object.entries(PROGRESS_STATUS_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* 書類フィルター */}
          <Select
            value={
              (table.getColumn("documentStatus")?.getFilterValue() as string) ??
              "all"
            }
            onValueChange={(value) =>
              table
                .getColumn("documentStatus")
                ?.setFilterValue(value === "all" ? undefined : value)
            }
          >
            <SelectTrigger className="h-8 w-[150px]">
              <SelectValue placeholder="書類" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              {Object.entries(DOCUMENT_STATUS_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* 契約形態フィルター */}
          <Select
            value={
              (table.getColumn("contractType")?.getFilterValue() as string) ??
              "all"
            }
            onValueChange={(value) =>
              table
                .getColumn("contractType")
                ?.setFilterValue(value === "all" ? undefined : value)
            }
          >
            <SelectTrigger className="h-8 w-[150px]">
              <SelectValue placeholder="契約形態" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              {Object.entries(CONTRACT_TYPE_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* フィルターをクリア */}
          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => table.resetColumnFilters()}
              className="h-8 px-2 lg:px-3"
            >
              リセット
              <X className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>

        {/* 右側のアクション */}
        <div className="flex items-center gap-2">
          {/* エクスポート */}
          <Button
            variant="outline"
            size="sm"
            className="h-8"
            onClick={handleExport}
          >
            <Download className="mr-2 h-4 w-4" />
            CSV出力
          </Button>

          {/* カラム表示制御 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
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
                  const header = column.columnDef.header;
                  const displayName =
                    typeof header === "string" ? header : column.id;
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
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

      {/* 選択中のフィルター表示 */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>
          {table.getFilteredRowModel().rows.length} 件 /{" "}
          {table.getCoreRowModel().rows.length} 件中
        </span>
      </div>
    </div>
  );
}
