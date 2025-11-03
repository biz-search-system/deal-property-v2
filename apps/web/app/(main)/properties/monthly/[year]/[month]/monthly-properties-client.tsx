"use client";

import { PropertyDetailModal } from "@/components/property/property-detail-modal";
import type { PropertyWithRelations } from "@/lib/types/property";
import { Card, CardContent } from "@workspace/ui/components/card";
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
  const [selectedAccount, setSelectedAccount] =
    useState<string>("サンプル企業C");
  const [editingMemo, setEditingMemo] = useState<{
    id: string;
    value: string;
  } | null>(null);
  const [editingBusinessStatus, setEditingBusinessStatus] = useState<{
    id: string;
    value: string;
  } | null>(null);
  const [editingDocumentStatus, setEditingDocumentStatus] = useState<{
    id: string;
    value: string;
  } | null>(null);
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

  const getProgressStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      bc_before_confirmed: "BC確定前",
      contract_cb_waiting: "契約CB待ち",
      bc_contract_waiting: "BC契約待ち",
      settlement_date_waiting: "決済日待ち",
      settlement_cb_waiting: "精算CB待ち",
      settlement_waiting: "決済待ち",
      settlement_completed: "決済完了",
    };
    return labels[status] || status;
  };

  const getDocumentStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      waiting_request: "営業依頼待ち",
      in_progress: "書類取得中",
      all_completed: "全書類取得完了",
      completed: "取得完了",
    };
    return labels[status] || status;
  };

  const getProgressStatusColor = (status: string) => {
    if (status === "settlement_completed") return "default";
    if (status === "settlement_waiting" || status === "settlement_cb_waiting")
      return "secondary";
    return "outline";
  };

  const getDocumentStatusColor = (status: string) => {
    if (status === "all_completed" || status === "completed") return "default";
    if (status === "in_progress") return "secondary";
    return "outline";
  };

  const getContractTypeLabel = (type: string | null) => {
    if (!type) return "-";
    const labels: Record<string, string> = {
      ab_bc: "AB・BC",
      ac: "AC",
      iyaku: "違約",
      hakushi: "白紙",
      mitei: "未定",
      jisha: "自社仕入れ",
      bengoshi: "弁護士",
      kaichu: "買仲",
      iyaku_yotei: "違約予定",
    };
    return labels[type] || type;
  };

  const getCompanyBLabel = (company: string | null) => {
    if (!company) return "-";
    const labels: Record<string, string> = {
      ms: "エムズ",
      life: "ライフ",
      legit: "レイジット",
      esc: "エスク",
      trader: "取引業者",
      shine: "シャイン",
      second: "セカンド",
    };
    return labels[company] || company;
  };

  const getBrokerCompanyLabel = (company: string | null) => {
    if (!company) return "-";
    const labels: Record<string, string> = {
      legit: "レイジット",
      tousei: "TOUSEI",
      esc: "エスク",
      shine: "シャイン",
      nbf: "NBF",
      rd: "RD",
      ms: "エムズ",
    };
    return labels[company] || company;
  };

  const handlePropertyClick = (property: PropertyWithRelations) => {
    setSelectedProperty(property);
    setModalOpen(true);
  };

  const handleMemoSave = (propertyId: string) => {
    console.log("Saving memo for property", propertyId, editingMemo?.value);
    setEditingMemo(null);
  };

  const handleBusinessStatusSave = (propertyId: string) => {
    console.log(
      "Saving business status",
      propertyId,
      editingBusinessStatus?.value
    );
    setEditingBusinessStatus(null);
  };

  const handleDocumentStatusSave = (propertyId: string) => {
    console.log(
      "Saving document status",
      propertyId,
      editingDocumentStatus?.value
    );
    setEditingDocumentStatus(null);
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex flex-col gap-4 p-4 lg:p-6">
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
            <Card>
              <CardContent className="">
                {/* 集計表示 */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="rounded-lg bg-muted/50 p-3 border">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        利益合計
                      </span>
                      <p className="text-sm font-bold">
                        {formatCurrency(
                          calculateTotals(categorizedProperties.confirmed)
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
                          calculateTotals(categorizedProperties.confirmed)
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
                        {categorizedProperties.confirmed.length}件
                      </p>
                    </div>
                  </div>
                </div>

                {/* 口座別決済日集計 */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold">口座別集計</span>
                    <Select
                      value={selectedAccount}
                      onValueChange={setSelectedAccount}
                    >
                      <SelectTrigger className="w-[150px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="サンプル企業C">
                          サンプル企業C
                        </SelectItem>
                        <SelectItem value="サンプル企業B">
                          サンプル企業B
                        </SelectItem>
                        <SelectItem value="サンプル企業A">
                          サンプル企業A
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="rounded-lg border p-4 bg-muted/30">
                    <Table className="text-xs">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs">決済日</TableHead>
                          <TableHead className="text-xs text-right">
                            出口金額合計
                          </TableHead>
                          <TableHead className="text-xs text-right">
                            件数
                          </TableHead>
                          <TableHead className="text-xs text-right">
                            上限比率
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {accountSettlementSummary.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center">
                              該当する案件がありません
                            </TableCell>
                          </TableRow>
                        ) : (
                          accountSettlementSummary.map((item) => (
                            <TableRow key={item.date}>
                              <TableCell className="font-medium">
                                {formatDateWithDay(item.date)}
                              </TableCell>
                              <TableCell className="text-right">
                                {formatCurrency(item.total)}
                              </TableCell>
                              <TableCell className="text-right">
                                {item.count}件
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <div className="w-20 h-4 bg-muted rounded-full overflow-hidden">
                                    <div
                                      className={`h-full ${
                                        item.percentage >= 80
                                          ? "bg-destructive"
                                          : item.percentage >= 50
                                            ? "bg-yellow-500"
                                            : "bg-primary"
                                      }`}
                                      style={{
                                        width: `${Math.min(item.percentage, 100)}%`,
                                      }}
                                    />
                                  </div>
                                  <span
                                    className={`font-semibold ${
                                      item.percentage >= 80
                                        ? "text-destructive"
                                        : ""
                                    }`}
                                  >
                                    {item.percentage.toFixed(0)}%
                                  </span>
                                  {item.percentage >= 80 && (
                                    <span className="text-destructive">⚠️</span>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* 案件一覧テーブル */}
                <PropertiesTable
                  properties={categorizedProperties.confirmed}
                  editingMemo={editingMemo}
                  editingBusinessStatus={editingBusinessStatus}
                  editingDocumentStatus={editingDocumentStatus}
                  setEditingMemo={setEditingMemo}
                  setEditingBusinessStatus={setEditingBusinessStatus}
                  setEditingDocumentStatus={setEditingDocumentStatus}
                  handleMemoSave={handleMemoSave}
                  handleBusinessStatusSave={handleBusinessStatusSave}
                  handleDocumentStatusSave={handleDocumentStatusSave}
                  handlePropertyClick={handlePropertyClick}
                  formatCurrency={formatCurrency}
                  formatDateWithDay={formatDateWithDay}
                  truncateText={truncateText}
                  getProgressStatusLabel={getProgressStatusLabel}
                  getDocumentStatusLabel={getDocumentStatusLabel}
                  getProgressStatusColor={getProgressStatusColor}
                  getDocumentStatusColor={getDocumentStatusColor}
                  getContractTypeLabel={getContractTypeLabel}
                  getCompanyBLabel={getCompanyBLabel}
                  getBrokerCompanyLabel={getBrokerCompanyLabel}
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
                  editingMemo={editingMemo}
                  editingBusinessStatus={editingBusinessStatus}
                  editingDocumentStatus={editingDocumentStatus}
                  setEditingMemo={setEditingMemo}
                  setEditingBusinessStatus={setEditingBusinessStatus}
                  setEditingDocumentStatus={setEditingDocumentStatus}
                  handleMemoSave={handleMemoSave}
                  handleBusinessStatusSave={handleBusinessStatusSave}
                  handleDocumentStatusSave={handleDocumentStatusSave}
                  handlePropertyClick={handlePropertyClick}
                  formatCurrency={formatCurrency}
                  formatDateWithDay={formatDateWithDay}
                  truncateText={truncateText}
                  getProgressStatusLabel={getProgressStatusLabel}
                  getDocumentStatusLabel={getDocumentStatusLabel}
                  getProgressStatusColor={getProgressStatusColor}
                  getDocumentStatusColor={getDocumentStatusColor}
                  getContractTypeLabel={getContractTypeLabel}
                  getCompanyBLabel={getCompanyBLabel}
                  getBrokerCompanyLabel={getBrokerCompanyLabel}
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
