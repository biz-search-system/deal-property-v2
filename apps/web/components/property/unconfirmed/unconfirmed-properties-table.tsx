"use client";

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import type { PropertyWithRelations } from "@/lib/types/property";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { unconfirmedColumns } from "./unconfirmed-columns";

interface UnconfirmedPropertiesTableProps {
  properties: PropertyWithRelations[];
}

export function UnconfirmedPropertiesTable({
  properties,
}: UnconfirmedPropertiesTableProps) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);

  const handleViewDetails = (property: PropertyWithRelations) => {
    router.push(`/properties/unconfirmed/${property.id}`);
  };

  const handleEdit = (property: PropertyWithRelations) => {
    router.push(`/properties/unconfirmed/${property.id}/edit`);
  };

  const table = useReactTable({
    data: properties,
    columns: unconfirmedColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
    meta: {
      onView: handleViewDetails,
      onEdit: handleEdit,
    },
  });

  const getHeaderColumnClass = (columnId: string) => {
    switch (columnId) {
      case "organization":
        return "";
      case "staff":
        return "w-[50px]";
      case "propertyName":
        return "max-w-[120px]";
      case "roomNumber":
        return "w-[40px]";
      case "ownerName":
        return "min-w-[55px]";
      case "amountA":
      case "amountExit":
      case "profit":
      case "bcDeposit":
        return "w-[50px]";
      case "commission":
        return "w-[100px]";
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
        return "min-w-[65px] max-w-[120px]";
      case "actions":
        return "sticky right-0 bg-background w-[50px]";
      default:
        return "";
    }
  };

  const getCellColumnClass = (columnId: string) => {
    const base = "text-[10px] p-1";
    switch (columnId) {
      case "organization":
        return base;
      case "staff":
        return `${base} w-[50px]`;
      case "propertyName":
        return `${base} max-w-[140px]`;
      case "roomNumber":
        return base;
      case "ownerName":
        return `${base} max-w-[60px]`;
      case "notes":
        return `${base} max-w-[80px]`;
      case "actions":
        return `${base} sticky right-2`;
      default:
        return base;
    }
  };

  return (
    <>
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
                    className={`text-[10px] p-1 ${getHeaderColumnClass(header.column.id)}`}
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
                  colSpan={unconfirmedColumns.length}
                  className="h-24 text-center"
                >
                  データがありません
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </>
  );
}
