"use client";

import { Column } from "@tanstack/react-table";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="p-0 font-normal hover:bg-transparent hover:bg-muted group "
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      <span className="group-hover:hidden text-[10px]">{title}</span>
      {column.getIsSorted() === "desc" ? (
        <ArrowDown className="h-3 w-3 hidden group-hover:block" />
      ) : column.getIsSorted() === "asc" ? (
        <ArrowUp className="h-3 w-3 hidden group-hover:block" />
      ) : (
        <ArrowUpDown className="h-3 w-3 hidden group-hover:block" />
      )}
    </Button>
  );
}
