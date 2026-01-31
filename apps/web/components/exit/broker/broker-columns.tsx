"use client";

import { ColumnDef } from "@tanstack/react-table";
import type { Broker } from "@/lib/types/broker";
import { BROKER_TYPE_LABELS, BROKER_TYPE_COLORS } from "@/lib/types/broker";
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
import { DataTableColumnHeader } from "@/components/property/search/data-table-column-header";
import { cn } from "@workspace/ui/lib/utils";

export const brokerColumns: ColumnDef<Broker>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="業者名" />;
    },
    cell: ({ row }) => {
      return (
        <span className="font-medium whitespace-nowrap">
          {row.original.name}
        </span>
      );
    },
  },
  {
    accessorKey: "brokerType",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="種別" />;
    },
    cell: ({ row }) => {
      const brokerType = row.original.brokerType;
      return (
        <Badge
          variant="secondary"
          className={cn("text-[10px] px-1.5 py-0", BROKER_TYPE_COLORS[brokerType])}
        >
          {BROKER_TYPE_LABELS[brokerType]}
        </Badge>
      );
    },
  },
  {
    accessorKey: "contactName",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="担当者" />;
    },
    cell: ({ row }) => {
      return (
        <span className="text-muted-foreground">
          {row.original.contactName || "-"}
        </span>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="メール" />;
    },
    cell: ({ row }) => {
      return (
        <span className="text-muted-foreground text-xs">
          {row.original.email}
        </span>
      );
    },
  },
  {
    accessorKey: "phone",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="電話番号" />;
    },
    cell: ({ row }) => {
      return (
        <span className="text-muted-foreground">
          {row.original.phone || "-"}
        </span>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="ステータス" />;
    },
    cell: ({ row }) => {
      const isActive = row.original.isActive;
      return (
        <Badge
          variant={isActive ? "default" : "secondary"}
          className={cn(
            "text-[10px] px-1.5 py-0",
            isActive
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
              : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
          )}
        >
          {isActive ? "有効" : "無効"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const broker = row.original;
      const meta = table.options.meta as {
        onView?: (broker: Broker) => void;
        onEdit?: (broker: Broker) => void;
        onDelete?: (broker: Broker) => void;
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
                <MoreHorizontal className="size-4" />
                <span className="sr-only">操作メニュー</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[100px]">
              <DropdownMenuItem onClick={() => meta?.onView?.(broker)}>
                <Eye className="size-3" />
                詳細
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => meta?.onEdit?.(broker)}>
                <Edit className="size-3" />
                編集
              </DropdownMenuItem>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem className="text-destructive focus:text-destructive">
                  <Trash2 className="size-3" />
                  削除
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>業者を削除しますか？</AlertDialogTitle>
              <AlertDialogDescription>
                「{broker.name}」を削除します。この操作は取り消せません。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>キャンセル</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => meta?.onDelete?.(broker)}
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
