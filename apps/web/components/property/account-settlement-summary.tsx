"use client";

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
import { ACCOUNT_COMPANY_LABELS } from "@workspace/utils";

interface AccountSettlementSummaryItem {
  date: string;
  total: number;
  count: number;
  percentage: number;
}

interface AccountSettlementSummaryProps {
  selectedAccount: string;
  setSelectedAccount: (value: string) => void;
  accountSettlementSummary: AccountSettlementSummaryItem[];
}

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

export function AccountSettlementSummary({
  selectedAccount,
  setSelectedAccount,
  accountSettlementSummary,
}: AccountSettlementSummaryProps) {
  return (
    <>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm font-semibold">口座別集計</span>
        <Select value={selectedAccount} onValueChange={setSelectedAccount}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="legit">
              {ACCOUNT_COMPANY_LABELS.legit}
            </SelectItem>
            <SelectItem value="life">{ACCOUNT_COMPANY_LABELS.life}</SelectItem>
            <SelectItem value="ms">{ACCOUNT_COMPANY_LABELS.ms}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {/* 口座別決済日集計 */}
      <div className="mb-4">
        <div className="rounded-lg border p-4 bg-muted/30">
          <Table className="text-xs">
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">決済日</TableHead>
                <TableHead className="text-xs text-right">
                  出口金額合計
                </TableHead>
                <TableHead className="text-xs text-right">件数</TableHead>
                <TableHead className="text-xs text-right">上限比率</TableHead>
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
                    <TableCell className="text-right">{item.count}件</TableCell>
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
                            item.percentage >= 80 ? "text-destructive" : ""
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
    </>
  );
}
