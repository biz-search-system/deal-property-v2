"use client";

import { PropertyDetailModal } from "@/components/property/property-detail-modal";
import { AccountSettlementSummary } from "@/components/property/account-settlement-summary";
import type { PropertyWithRelations } from "@/lib/types/property";
import { Card, CardContent } from "@workspace/ui/components/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { useMemo, useState } from "react";
import { PropertiesTable } from "./properties-table";

interface MonthlyPropertiesClientProps {
  year: string;
  month: string;
  properties: PropertyWithRelations[];
}

export function MonthlyPropertiesClient({
  year,
  month,
  properties,
}: MonthlyPropertiesClientProps) {
  const [selectedAccount, setSelectedAccount] = useState<string>("legit");
  const [selectedProperty, setSelectedProperty] =
    useState<PropertyWithRelations | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

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
  const calculateTotals = (properties: PropertyWithRelations[]) => {
    return {
      profit: properties.reduce((sum, p) => sum + (p.profit || 0), 0),
      bcDeposit: properties.reduce((sum, p) => sum + (p.bcDeposit || 0), 0),
      count: properties.length,
    };
  };

  // 口座別決済日集計
  const accountSettlementSummary = useMemo(() => {
    const filteredProperties = categorizedProperties.confirmed.filter(
      (p) => p.accountCompany === selectedAccount
    );

    // 決済日ごとにグループ化
    const grouped: { [key: string]: { total: number; count: number } } = {};

    filteredProperties.forEach((p) => {
      // DateをISO文字列に変換、nullの場合は空文字列
      const dateKey = p.settlementDate
        ? p.settlementDate instanceof Date
          ? p.settlementDate.toISOString()
          : new Date(p.settlementDate).toISOString()
        : "";

      if (!grouped[dateKey]) {
        grouped[dateKey] = { total: 0, count: 0 };
      }
      grouped[dateKey].total += p.amountExit || 0;
      grouped[dateKey].count += 1;
    });

    // ソートして配列に変換
    return Object.entries(grouped)
      .filter(([date]) => date !== "") // 空の日付を除外
      .map(([date, data]) => ({
        date,
        total: data.total,
        count: data.count,
        percentage: (data.total / 100000000) * 100, // 1億円に対する割合
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [categorizedProperties.confirmed, selectedAccount]);

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

  const handlePropertyClick = (property: PropertyWithRelations) => {
    setSelectedProperty(property);
    setModalOpen(true);
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex flex-col gap-3 p-4 lg:p-3">
        {/* タブ */}
        <Tabs defaultValue="confirmed" className="flex-1">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="confirmed">
              業者確定後 ({categorizedProperties.confirmed.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              決済完了 ({categorizedProperties.completed.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="confirmed">
            {/* 集計表示 */}
            <div className="grid grid-cols-3 gap-4 mb-4">
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
            <AccountSettlementSummary
              selectedAccount={selectedAccount}
              setSelectedAccount={setSelectedAccount}
              accountSettlementSummary={accountSettlementSummary}
            />
            <Card>
              <CardContent className="">
                {/* 案件一覧テーブル */}
                <PropertiesTable
                  properties={categorizedProperties.confirmed}
                  handlePropertyClick={handlePropertyClick}
                  formatCurrency={formatCurrency}
                  formatDateWithDay={formatDateWithDay}
                  truncateText={truncateText}
                  year={year}
                  month={month}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed">
            <Card>
              <CardContent className="pt-6">
                {/* 集計表示 */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="rounded-lg bg-muted/50 p-3 border">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        利益合計
                      </span>
                      <p className="text-sm font-bold">
                        {formatCurrency(
                          calculateTotals(categorizedProperties.completed)
                            .profit
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
                          calculateTotals(categorizedProperties.completed)
                            .bcDeposit
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3 border">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        件数
                      </span>
                      <p className="text-sm font-bold">
                        {categorizedProperties.completed.length}件
                      </p>
                    </div>
                  </div>
                </div>

                {/* 案件一覧テーブル */}
                <PropertiesTable
                  properties={categorizedProperties.completed}
                  handlePropertyClick={handlePropertyClick}
                  formatCurrency={formatCurrency}
                  formatDateWithDay={formatDateWithDay}
                  truncateText={truncateText}
                  year={year}
                  month={month}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* 案件詳細モーダル */}
        <PropertyDetailModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          property={selectedProperty}
        />
      </div>
    </div>
  );
}
