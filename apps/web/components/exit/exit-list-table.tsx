"use client";

import type { ExitListItem, ExitStatus, Situation } from "@/lib/types/exit";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Card } from "@workspace/ui/components/card";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import Fuse from "fuse.js";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { exitListColumns } from "./exit-list-columns";
import { ExitListPagination } from "./exit-list-pagination";
import { ExitStatusBadge } from "./exit-status-badge";
import { SituationBadge } from "./situation-badge";

/** 出口管理一覧で使用するステータス */
const EXIT_STATUSES: ExitStatus[] = [
  "confirmed",
  "negotiating",
  "waiting_purchase",
  "not_purchased",
  "breach",
  "troubled",
];

/** 現況の配列 */
const SITUATIONS: Situation[] = ["renting", "sublease", "vacant"];

interface ExitListTableProps {
  exits: ExitListItem[];
}

export function ExitListTable({ exits }: ExitListTableProps) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ExitStatus | "">("");
  const [situationFilter, setSituationFilter] = useState<Situation | "">("");

  // fuse.jsでファジー検索 + フィルター
  const filteredData = useMemo(() => {
    let result = exits;

    // ステータスフィルター
    if (statusFilter) {
      result = result.filter((exit) => exit.status === statusFilter);
    }

    // 現況フィルター
    if (situationFilter) {
      result = result.filter((exit) => exit.situation === situationFilter);
    }

    // fuse.jsでファジー検索（複数キーワードAND検索対応）
    if (search) {
      const keywords = search.trim().split(/\s+/).filter(Boolean);

      if (keywords.length > 0) {
        const keys = [
          "propertyName",
          "roomNumber",
          "address",
          "staff.name",
          "notes",
        ];

        const fuse = new Fuse(result, {
          keys,
          threshold: 0.3,
          ignoreLocation: true,
          useExtendedSearch: true,
        });

        // $and オペレータで複数キーワードのAND検索
        const query = {
          $and: keywords.map((keyword) => ({
            $or: keys.map((key) => ({ [key]: keyword })),
          })),
        };

        result = fuse.search(query).map((r) => r.item);
      }
    }

    return result;
  }, [exits, search, statusFilter, situationFilter]);

  const handleView = (exit: ExitListItem) => {
    router.push(`/exits/${exit.id}`);
  };

  const handleEdit = (exit: ExitListItem) => {
    router.push(`/exits/${exit.id}/edit`);
  };

  const handleDistribute = (exit: ExitListItem) => {
    router.push(`/exits/${exit.id}/distribute`);
  };

  const table = useReactTable({
    data: filteredData,
    columns: exitListColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
    initialState: {
      pagination: {
        pageSize: 50,
      },
    },
    meta: {
      onView: handleView,
      onEdit: handleEdit,
      onDistribute: handleDistribute,
    },
  });

  const hasFilters = statusFilter || situationFilter;

  return (
    <div className="flex h-full flex-col gap-3">
      {/* 検索バー・フィルター */}
      <div className="shrink-0 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        {/* 検索バー */}
        <div className="flex items-center gap-2">
          <div className="relative w-full lg:w-64">
            <Search className="absolute left-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="物件名、号室、担当者名で検索"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="pl-8"
            />
          </div>
          {search && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearch("")}
              className="h-8 px-2"
            >
              <X className="size-4" />
              <span className="sr-only">検索をクリア</span>
            </Button>
          )}
        </div>

        {/* フィルター */}
        <div className="flex items-center gap-2">
          {/* ステータスフィルター */}
          <Select
            value={statusFilter || "all"}
            onValueChange={(value) =>
              setStatusFilter(value === "all" ? "" : (value as ExitStatus))
            }
          >
            <SelectTrigger className="h-8 w-[140px] text-xs">
              <SelectValue placeholder="ステータス">
                {statusFilter ? (
                  <ExitStatusBadge status={statusFilter} size="medium" />
                ) : (
                  "ステータス"
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              {EXIT_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  <ExitStatusBadge status={status} size="medium" />
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* 現況フィルター */}
          <Select
            value={situationFilter || "all"}
            onValueChange={(value) =>
              setSituationFilter(value === "all" ? "" : (value as Situation))
            }
          >
            <SelectTrigger className="h-8 w-[140px] text-xs">
              <SelectValue placeholder="現況">
                {situationFilter ? (
                  <SituationBadge situation={situationFilter} size="medium" />
                ) : (
                  "現況"
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              {SITUATIONS.map((situation) => (
                <SelectItem key={situation} value={situation}>
                  <SituationBadge situation={situation} size="medium" />
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* フィルターをクリア */}
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setStatusFilter("");
                setSituationFilter("");
              }}
              className="h-8 px-2 text-xs"
            >
              リセット
              <X className="ml-1 size-3" />
            </Button>
          )}
        </div>
      </div>

      {/* テーブル */}
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
                      className="text-[10px] p-1 text-center"
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
                      <TableCell key={cell.id} className="p-1 text-center">
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
                    colSpan={exitListColumns.length}
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
      <div className="shrink-0">
        <ExitListPagination table={table} />
      </div>
    </div>
  );
}
