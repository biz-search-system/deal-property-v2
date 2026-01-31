"use client";

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  SortingState,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import type { Broker } from "@/lib/types/broker";
import { BROKER_TYPE_LABELS } from "@/lib/types/broker";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { brokerColumns } from "./broker-columns";
import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import Fuse from "fuse.js";

interface BrokerTableProps {
  brokers: Broker[];
}

export function BrokerTable({ brokers }: BrokerTableProps) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [brokerTypeFilter, setBrokerTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Fuse.js の設定
  const fuse = useMemo(() => {
    return new Fuse(brokers, {
      keys: ["name", "contactName", "email", "phone", "address", "notes"],
      threshold: 0.3,
      ignoreLocation: true,
    });
  }, [brokers]);

  // フィルタリングされたデータ
  const filteredBrokers = useMemo(() => {
    // まず検索でフィルタリング
    let results = searchQuery
      ? fuse.search(searchQuery).map((result) => result.item)
      : brokers;

    // 業者種別フィルター
    if (brokerTypeFilter !== "all") {
      results = results.filter(
        (broker) => broker.brokerType === brokerTypeFilter
      );
    }

    // ステータスフィルター
    if (statusFilter === "active") {
      results = results.filter((broker) => broker.isActive);
    } else if (statusFilter === "inactive") {
      results = results.filter((broker) => !broker.isActive);
    }

    return results;
  }, [brokers, searchQuery, fuse, brokerTypeFilter, statusFilter]);

  const handleViewDetails = (broker: Broker) => {
    router.push(`/brokers/${broker.id}`);
  };

  const handleEdit = (broker: Broker) => {
    router.push(`/brokers/${broker.id}/edit`);
  };

  const handleDelete = async (broker: Broker) => {
    // TODO: 実際の削除処理を実装
    toast.success(`「${broker.name}」を削除しました`);
  };

  const table = useReactTable({
    data: filteredBrokers,
    columns: brokerColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
    meta: {
      onView: handleViewDetails,
      onEdit: handleEdit,
      onDelete: handleDelete,
    },
    initialState: {
      pagination: {
        pageSize: 20,
      },
    },
  });

  return (
    <div className="flex h-full flex-col gap-3">
      {/* ツールバー */}
      <div className="shrink-0 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        {/* 検索バー */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="業者名、担当者、メール、電話番号で検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-9 w-[400px]"
              autoComplete="off"
            />
          </div>
          {searchQuery && (
            <Button
              variant="ghost"
              onClick={() => setSearchQuery("")}
              className="px-2 lg:px-3"
            >
              リセット
              <X className="ml-2 size-4" />
            </Button>
          )}
        </div>

        {/* フィルター */}
        <div className="flex items-center gap-2">
          {/* 業者種別フィルター */}
          <Select value={brokerTypeFilter} onValueChange={setBrokerTypeFilter}>
            <SelectTrigger className="h-8 w-[130px]">
              <SelectValue placeholder="種別" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべての種別</SelectItem>
              <SelectItem value="buyer">{BROKER_TYPE_LABELS.buyer}</SelectItem>
              <SelectItem value="broker">
                {BROKER_TYPE_LABELS.broker}
              </SelectItem>
            </SelectContent>
          </Select>

          {/* ステータスフィルター */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-8 w-[120px]">
              <SelectValue placeholder="ステータス" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              <SelectItem value="active">有効のみ</SelectItem>
              <SelectItem value="inactive">無効のみ</SelectItem>
            </SelectContent>
          </Select>

          {/* フィルターリセットボタン */}
          {(brokerTypeFilter !== "all" || statusFilter !== "all") && (
            <Button
              variant="ghost"
              onClick={() => {
                setBrokerTypeFilter("all");
                setStatusFilter("all");
              }}
              className="px-2 lg:px-3"
            >
              リセット
              <X className="ml-2 size-4" />
            </Button>
          )}
        </div>
      </div>

      {/* テーブル */}
      <Card className="overflow-hidden px-3 py-2">
        <ScrollArea className="min-h-0 flex-1 overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="text-xs">
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
                      <TableCell key={cell.id} className="text-xs py-2">
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
                    colSpan={brokerColumns.length}
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

      {/* ページネーション */}
      <div className="flex shrink-0 items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} 件
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">表示件数</span>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 50, 100].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-center text-sm">
            {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}{" "}
            ページ
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">最初のページ</span>
              <ChevronsLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">前のページ</span>
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">次のページ</span>
              <ChevronRight className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">最後のページ</span>
              <ChevronsRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
