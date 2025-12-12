"use client";

import { AccountSettlementSummary } from "@/components/property/account-settlement-summary";
import type { PropertyWithRelations } from "@/lib/types/property";
import { Card } from "@workspace/ui/components/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { useQueryState } from "nuqs";
import { useMemo } from "react";
import { MonthlyPropertiesTable } from "./monthly-properties-table";

interface MonthlyPropertiesProps {
  year: string;
  month: string;
  properties: PropertyWithRelations[];
}

export function MonthlyProperties({
  year,
  month,
  properties,
}: MonthlyPropertiesProps) {
  const [activeTab, setActiveTab] = useQueryState("tab", {
    defaultValue: "confirmed",
  });

  // 業者確定後と決済完了で分類
  const categorizedProperties = useMemo(() => {
    return {
      confirmed: properties.filter(
        (p) => p.progressStatus !== "settlement_completed"
      ),
      completed: properties.filter(
        (p) => p.progressStatus === "settlement_completed"
      ),
    };
  }, [properties]);

  // 集計計算
  const calculateTotals = (props: PropertyWithRelations[]) => {
    return {
      profit: props.reduce((sum, p) => sum + (p.profit || 0), 0),
      bcDeposit: props.reduce((sum, p) => sum + (p.bcDeposit || 0), 0),
      count: props.length,
    };
  };

  const formatCurrency = (value: number | null | undefined) => {
    if (value === null || value === undefined) return "-";
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
        {/* タブ */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex h-full flex-col"
        >
          <TabsList className="grid w-full shrink-0 grid-cols-2">
            <TabsTrigger value="confirmed">
              業者確定後 ({categorizedProperties.confirmed.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              決済完了 ({categorizedProperties.completed.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="confirmed"
            className="flex flex-1 flex-col gap-3 overflow-hidden"
          >
            {/* 集計表示 */}
            <div className="grid shrink-0 grid-cols-3 gap-4">
              <div className="rounded-lg bg-muted/50 p-3 border">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    利益合計
                  </span>
                  <p className="text-sm font-bold">
                    {formatCurrency(
                      calculateTotals(categorizedProperties.confirmed).profit
                    )}
                  </p>
                </div>
              </div>
              <div className="rounded-lg bg-muted/50 p-3 border">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    BC手付合計
                  </span>
                  <p className="text-sm font-bold">
                    {formatCurrency(
                      calculateTotals(categorizedProperties.confirmed).bcDeposit
                    )}
                  </p>
                </div>
              </div>
              <div className="rounded-lg bg-muted/50 p-3 border">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">件数</span>
                  <p className="text-sm font-bold">
                    {categorizedProperties.confirmed.length}件
                  </p>
                </div>
              </div>
            </div>
            <div className="shrink-0">
              <AccountSettlementSummary
                properties={categorizedProperties.confirmed}
              />
            </div>
            <Card className="flex flex-1 flex-col overflow-hidden px-3 py-2">
              {/* 案件一覧テーブル */}
              <MonthlyPropertiesTable
                properties={categorizedProperties.confirmed}
                year={year}
                month={month}
              />
            </Card>
          </TabsContent>

          <TabsContent
            value="completed"
            className="flex flex-1 flex-col gap-3 overflow-hidden"
          >
            {/* 集計表示 */}
            <div className="grid shrink-0 grid-cols-3 gap-4">
              <div className="rounded-lg bg-muted/50 p-3 border">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    利益合計
                  </span>
                  <p className="text-sm font-bold">
                    {formatCurrency(
                      calculateTotals(categorizedProperties.completed).profit
                    )}
                  </p>
                </div>
              </div>
              <div className="rounded-lg bg-muted/50 p-3 border">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    BC手付合計
                  </span>
                  <p className="text-sm font-bold">
                    {formatCurrency(
                      calculateTotals(categorizedProperties.completed).bcDeposit
                    )}
                  </p>
                </div>
              </div>
              <div className="rounded-lg bg-muted/50 p-3 border">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">件数</span>
                  <p className="text-sm font-bold">
                    {categorizedProperties.completed.length}件
                  </p>
                </div>
              </div>
            </div>

            <Card className="flex flex-1 flex-col overflow-hidden px-3 py-2">
              {/* 案件一覧テーブル */}
              <MonthlyPropertiesTable
                properties={categorizedProperties.completed}
                year={year}
                month={month}
              />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
