"use client";

import type { PropertyWithRelations } from "@/lib/types/property";
import { Card } from "@workspace/ui/components/card";
import { UnconfirmedPropertiesTable } from "./unconfirmed-properties-table";

interface UnconfirmedPropertiesProps {
  properties: PropertyWithRelations[];
  totals: {
    profitEstimate: number;
    count: number;
  };
}

export function UnconfirmedProperties({
  properties,
  totals,
}: UnconfirmedPropertiesProps) {
  const formatCurrency = (value: number) => {
    if (!value) return "0円";
    // 1万円未満の場合は円単位で表示
    if (value < 10000) {
      return `${value.toLocaleString()}円`;
    }
    // 1万円以上の場合は万円単位で表示
    return `${(value / 10000).toFixed(0)}万`;
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex flex-1 flex-col gap-3 overflow-hidden p-4 lg:p-3">
        {/* 集計表示（2カラム） */}
        <div className="grid shrink-0 grid-cols-2 gap-4">
          <div className="rounded-lg bg-muted/50 p-3 border">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                利益見込み合計
              </span>
              <p className="text-sm font-bold">
                {formatCurrency(totals.profitEstimate)}
              </p>
            </div>
          </div>
          <div className="rounded-lg bg-muted/50 p-3 border">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">件数</span>
              <p className="text-sm font-bold">{totals.count}件</p>
            </div>
          </div>
        </div>

        {/* 案件一覧テーブル */}
        <Card className="flex flex-1 flex-col overflow-hidden px-3 py-2">
          <UnconfirmedPropertiesTable properties={properties} />
        </Card>
      </div>
    </div>
  );
}
