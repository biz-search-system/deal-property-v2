"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Eye, Edit } from "lucide-react";
import { PropertyDetailModal } from "@/components/property-detail-modal";
import {
  BUSINESS_STATUS,
  DOCUMENT_STATUS,
  Property,
} from "../../../data/property";
import { MonthPicker } from "@/components/month-picker";

interface MonthlyPropertiesClientProps {
  year: string;
  month: string;
  properties: Property[];
}

export function MonthlyPropertiesClient({
  year,
  month,
  properties,
}: MonthlyPropertiesClientProps) {
  const router = useRouter();
  const [selectedAccount, setSelectedAccount] = useState<string>("サンプル企業C");
  const [editingMemo, setEditingMemo] = useState<{
    id: number;
    value: string;
  } | null>(null);
  const [editingBusinessStatus, setEditingBusinessStatus] = useState<{
    id: number;
    value: string;
  } | null>(null);
  const [editingDocumentStatus, setEditingDocumentStatus] = useState<{
    id: number;
    value: string;
  } | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);

  // 選択月の日付
  const selectedDate = useMemo(() => {
    return new Date(Number(year), Number(month) - 1);
  }, [year, month]);

  // 業者確定後と決済完了で分類
  const categorizedProperties = useMemo(() => {
    return {
      confirmed: properties.filter(
        (p) => p.businessStatus !== BUSINESS_STATUS.SETTLEMENT_COMPLETED
      ),
      completed: properties.filter(
        (p) => p.businessStatus === BUSINESS_STATUS.SETTLEMENT_COMPLETED
      ),
    };
  }, [properties]);

  // 集計計算
  const calculateTotals = (properties: Property[]) => {
    return {
      profit: properties.reduce((sum, p) => sum + p.profit, 0),
      bcDeposit: properties.reduce((sum, p) => sum + p.bcDeposit, 0),
      count: properties.length,
    };
  };

  // 口座別決済日集計
  const accountSettlementSummary = useMemo(() => {
    const filteredProperties = categorizedProperties.confirmed.filter(
      (p) => p.account === selectedAccount
    );

    // 決済日ごとにグループ化
    const grouped: { [key: string]: { total: number; count: number } } = {};

    filteredProperties.forEach((p) => {
      const date = p.settlementDate || "";
      if (!grouped[date]) {
        grouped[date] = { total: 0, count: 0 };
      }
      grouped[date].total += p.exitAmount;
      grouped[date].count += 1;
    });

    // ソートして配列に変換
    return Object.entries(grouped)
      .map(([date, data]) => ({
        date,
        total: data.total,
        count: data.count,
        percentage: (data.total / 100000000) * 100, // 1億円に対する割合
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [categorizedProperties.confirmed, selectedAccount]);

  const formatCurrency = (value: number) => {
    return value ? `${(value / 10000).toFixed(0)}万` : "-";
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const formatDateWithDay = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const days = ["日", "月", "火", "水", "木", "金", "土"];
    return `${date.getMonth() + 1}/${date.getDate()}(${days[date.getDay()]})`;
  };

  const truncateText = (text: string, maxLength: number = 5) => {
    if (!text) return "-";
    return text.length > maxLength ? text.substring(0, maxLength) : text;
  };

  const getBusinessStatusColor = (status: string) => {
    if (status === BUSINESS_STATUS.SETTLEMENT_COMPLETED) return "default";
    if (
      status === BUSINESS_STATUS.STATEMENT_COMPLETED_SETTLEMENT_WAITING ||
      status === BUSINESS_STATUS.SETTLEMENT_CONFIRMED_STATEMENT_WAITING
    )
      return "secondary";
    return "outline";
  };

  const getDocumentStatusColor = (status: string) => {
    if (status === DOCUMENT_STATUS.ALL_ACQUIRED) return "default";
    if (status === DOCUMENT_STATUS.ACQUIRING) return "secondary";
    return "outline";
  };

  const handleMonthChange = (date: Date) => {
    const newYear = date.getFullYear();
    const newMonth = String(date.getMonth() + 1).padStart(2, "0");
    router.push(`/properties/monthly/${newYear}/${newMonth}`);
  };

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
    setModalOpen(true);
  };

  const handleMemoSave = (propertyId: number) => {
    console.log("Saving memo for property", propertyId, editingMemo?.value);
    setEditingMemo(null);
  };

  const handleBusinessStatusSave = (propertyId: number) => {
    console.log(
      "Saving business status",
      propertyId,
      editingBusinessStatus?.value
    );
    setEditingBusinessStatus(null);
  };

  const handleDocumentStatusSave = (propertyId: number) => {
    console.log(
      "Saving document status",
      propertyId,
      editingDocumentStatus?.value
    );
    setEditingDocumentStatus(null);
  };

  // テーブルコンポーネント
  const PropertiesTable = ({ properties }: { properties: Property[] }) => (
    <div className="overflow-auto max-h-[calc(100vh-500px)]">
      <Table className="text-[10px]">
        <TableHeader className="sticky top-0 bg-background z-10">
          <TableRow>
            <TableHead className="text-[10px] p-1 sticky left-0 bg-background z-20 min-w-[45px]">
              担当
            </TableHead>
            <TableHead className="text-[10px] p-1 min-w-[65px]">
              物件名
            </TableHead>
            <TableHead className="text-[10px] p-1 w-[40px]">号室</TableHead>
            <TableHead className="text-[10px] p-1 min-w-[55px]">
              オーナー
            </TableHead>
            <TableHead className="text-[10px] p-1 w-[50px]">A金額</TableHead>
            <TableHead className="text-[10px] p-1 w-[50px]">出口</TableHead>
            <TableHead className="text-[10px] p-1 w-[50px]">仲手等</TableHead>
            <TableHead className="text-[10px] p-1 w-[50px]">利益</TableHead>
            <TableHead className="text-[10px] p-1 w-[50px]">BC手付</TableHead>
            <TableHead className="text-[10px] p-1 min-w-[50px]">
              決済日
            </TableHead>
            <TableHead className="text-[10px] p-1 min-w-[50px]">買取</TableHead>
            <TableHead className="text-[10px] p-1 min-w-[45px]">
              契約形態
            </TableHead>
            <TableHead className="text-[10px] p-1 min-w-[45px]">
              B会社
            </TableHead>
            <TableHead className="text-[10px] p-1 min-w-[45px]">仲介</TableHead>
            <TableHead className="text-[10px] p-1 min-w-[50px]">進捗</TableHead>
            <TableHead className="text-[10px] p-1 min-w-[50px]">書類</TableHead>
            <TableHead className="text-[10px] p-1 w-[120px]">備考</TableHead>
            <TableHead className="text-[10px] p-1 sticky right-0 bg-background z-20 min-w-[35px]">
              操作
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {properties.map((property) => (
            <TableRow key={property.id} className="hover:bg-muted/50">
              <TableCell className="text-[10px] p-1 sticky left-0 bg-background">
                <div className="flex gap-1 flex-wrap">
                  {property.assignee.map((person, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-[9px] px-1 py-0"
                    >
                      {person}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell className="text-[10px] p-1">
                {property.propertyName}
              </TableCell>
              <TableCell className="text-[10px] p-1">
                {property.roomNumber}
              </TableCell>
              <TableCell className="text-[10px] p-1">
                {property.ownerName}
              </TableCell>
              <TableCell className="text-[10px] p-1 text-right">
                {formatCurrency(property.aAmount)}
              </TableCell>
              <TableCell className="text-[10px] p-1 text-right">
                {formatCurrency(property.exitAmount)}
              </TableCell>
              <TableCell className="text-[10px] p-1 text-right">
                {formatCurrency(property.commission)}
              </TableCell>
              <TableCell className="text-[10px] p-1 text-right font-semibold">
                {formatCurrency(property.profit)}
              </TableCell>
              <TableCell className="text-[10px] p-1 text-right">
                {formatCurrency(property.bcDeposit)}
              </TableCell>
              <TableCell className="text-[10px] p-1">
                {formatDate(property.settlementDate || "")}
              </TableCell>
              <TableCell className="text-[10px] p-1">
                <Badge variant="outline" className="text-[9px] px-1 py-0">
                  {truncateText(property.buyerCompany)}
                </Badge>
              </TableCell>
              <TableCell className="text-[10px] p-1">
                <Badge variant="outline" className="text-[9px] px-1 py-0">
                  {truncateText(property.contractType)}
                </Badge>
              </TableCell>
              <TableCell className="text-[10px] p-1">
                <Badge variant="outline" className="text-[9px] px-1 py-0">
                  {truncateText(property.bCompany)}
                </Badge>
              </TableCell>
              <TableCell className="text-[10px] p-1">
                <Badge variant="outline" className="text-[9px] px-1 py-0">
                  {truncateText(property.brokerCompany)}
                </Badge>
              </TableCell>
              <TableCell className="text-[10px] p-1">
                {editingBusinessStatus?.id === property.id ? (
                  <Select
                    value={editingBusinessStatus.value}
                    onValueChange={(value) => {
                      setEditingBusinessStatus({
                        ...editingBusinessStatus,
                        value,
                      });
                      handleBusinessStatusSave(property.id);
                    }}
                  >
                    <SelectTrigger className="h-5 text-[10px] p-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(BUSINESS_STATUS)
                        .filter((s) => s !== BUSINESS_STATUS.BC_UNCONFIRMED)
                        .map((status) => (
                          <SelectItem
                            key={status}
                            value={status}
                            className="text-[10px]"
                          >
                            {status}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge
                    variant={getBusinessStatusColor(property.businessStatus)}
                    className="text-[9px] cursor-pointer px-1 py-0"
                    onClick={() =>
                      setEditingBusinessStatus({
                        id: property.id,
                        value: property.businessStatus,
                      })
                    }
                  >
                    {truncateText(property.businessStatus, 6)}
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-[10px] p-1">
                {editingDocumentStatus?.id === property.id ? (
                  <Select
                    value={editingDocumentStatus.value}
                    onValueChange={(value) => {
                      setEditingDocumentStatus({
                        ...editingDocumentStatus,
                        value,
                      });
                      handleDocumentStatusSave(property.id);
                    }}
                  >
                    <SelectTrigger className="h-5 text-[10px] p-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(DOCUMENT_STATUS).map((status) => (
                        <SelectItem
                          key={status}
                          value={status}
                          className="text-[10px]"
                        >
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge
                    variant={getDocumentStatusColor(property.documentStatus)}
                    className="text-[9px] cursor-pointer px-1 py-0"
                    onClick={() =>
                      setEditingDocumentStatus({
                        id: property.id,
                        value: property.documentStatus,
                      })
                    }
                  >
                    {truncateText(property.documentStatus, 6)}
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-[10px] p-1">
                {editingMemo?.id === property.id ? (
                  <Input
                    value={editingMemo.value}
                    onChange={(e) =>
                      setEditingMemo({ ...editingMemo, value: e.target.value })
                    }
                    className="h-5 text-[10px] p-1"
                    onBlur={() => handleMemoSave(property.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleMemoSave(property.id);
                      }
                    }}
                    autoFocus
                  />
                ) : (
                  <div
                    className="cursor-pointer hover:bg-muted px-1 rounded text-[10px] truncate break-all max-w-[120px]"
                    onClick={() =>
                      setEditingMemo({ id: property.id, value: property.memo })
                    }
                    title={property.memo}
                  >
                    {property.memo || (
                      <span className="text-muted-foreground">入力</span>
                    )}
                  </div>
                )}
              </TableCell>
              <TableCell className="text-[10px] p-1 sticky right-0 bg-background">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0"
                    >
                      <MoreVertical className="h-3 w-3" />
                      <span className="sr-only">操作メニュー</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        router.push(`/properties/monthly/${year}/${month}/${property.id}`);
                      }}
                    >
                      <Eye className="h-3 w-3" />
                      詳細
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handlePropertyClick(property)}
                    >
                      <Edit className="h-3 w-3" />
                      編集
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

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
                        <SelectItem value="サンプル企業C">サンプル企業C</SelectItem>
                        <SelectItem value="サンプル企業B">サンプル企業B</SelectItem>
                        <SelectItem value="サンプル企業A">サンプル企業A</SelectItem>
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
                <PropertiesTable properties={categorizedProperties.confirmed} />
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
                <PropertiesTable properties={categorizedProperties.completed} />
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
