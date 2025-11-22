"use client";

import { SearchPropertiesTable } from "@/components/property/search/search-properties-table";
import type { PropertyWithRelations } from "@/lib/types/property";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { useMemo } from "react";

interface SearchPropertiesClientProps {
  properties: PropertyWithRelations[];
}

export function SearchPropertiesClient({
  properties,
}: SearchPropertiesClientProps) {
  // 集計計算
  const totals = useMemo(() => {
    return {
      profit: properties.reduce((sum, p) => sum + (p.profit || 0), 0),
      amountA: properties.reduce((sum, p) => sum + (p.amountA || 0), 0),
      amountExit: properties.reduce((sum, p) => sum + (p.amountExit || 0), 0),
      commission: properties.reduce((sum, p) => sum + (p.commission || 0), 0),
      bcDeposit: properties.reduce((sum, p) => sum + (p.bcDeposit || 0), 0),
      count: properties.length,
    };
  }, [properties]);

  const formatCurrency = (value: number | null | undefined) => {
    if (value === null || value === undefined) return "-";
    // 1万円未満の場合は円単位で表示
    if (value < 10000) {
      return `${value.toLocaleString()}円`;
    }
    // 1万円以上の場合は万円単位で表示
    return `${(value / 10000).toFixed(0)}万`;
  };

  const formatDateWithDay = (dateString: string | Date | null): string => {
    if (!dateString) return "-";
    const date: Date =
      typeof dateString === "string" ? new Date(dateString) : dateString;
    const days = ["日", "月", "火", "水", "木", "金", "土"];
    return `${date.getMonth() + 1}/${date.getDate()}(${days[date.getDay()]})`;
  };

  const truncateText = (
    text: string | null | undefined,
    maxLength: number = 5
  ) => {
    if (!text) return "-";
    return text.length > maxLength ? text.substring(0, maxLength) : text;
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex flex-col gap-3 p-4 lg:p-3">
        {/* テーブル */}
        <Card className="flex-1">
          <CardContent className="p-0">
            <SearchPropertiesTable
              properties={properties}
              formatCurrency={formatCurrency}
              formatDateWithDay={formatDateWithDay}
              truncateText={truncateText}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
