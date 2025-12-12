"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import {
  ACCOUNT_COMPANY_LABELS,
  BANK_ACCOUNT_LIMITS,
  formatAmountInYen,
} from "@workspace/utils";
import type { AccountCompany } from "@workspace/drizzle/types";
import type { PropertyWithRelations } from "@/lib/types/property";

interface AccountSettlementSummaryProps {
  properties: PropertyWithRelations[];
}

const accountCompanies: AccountCompany[] = ["legit", "life", "ms"];

export function AccountSettlementSummary({
  properties,
}: AccountSettlementSummaryProps) {
  // 口座会社ごとの集計を計算
  const summaryByAccount = accountCompanies.map((account) => {
    const filtered = properties.filter((p) => p.accountCompany === account);
    const total = filtered.reduce((sum, p) => sum + (p.amountExit || 0), 0);
    const count = filtered.length;

    // 口座の上限金額を取得（万円単位）
    const limits = BANK_ACCOUNT_LIMITS[account];
    const totalLimit = limits
      ? Object.values(limits).reduce((sum, limit) => sum + (limit || 0), 0)
      : 0;

    // 万円に変換して比率計算
    const totalInMan = total / 10000;
    const percentage = totalLimit > 0 ? (totalInMan / totalLimit) * 100 : 0;

    return {
      account,
      label: ACCOUNT_COMPANY_LABELS[account],
      total,
      count,
      totalLimit: totalLimit * 10000, // 円に戻す
      percentage,
    };
  });

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="h-8 text-xs font-medium">口座</TableHead>
            <TableHead className="h-8 text-xs font-medium text-right">
              出口合計
            </TableHead>
            <TableHead className="h-8 text-xs font-medium text-right">
              件数
            </TableHead>
            <TableHead className="h-8 text-xs font-medium text-right">
              上限
            </TableHead>
            <TableHead className="h-8 text-xs font-medium w-[140px]">
              使用率
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {summaryByAccount.map((item) => (
            <TableRow key={item.account} className="hover:bg-muted/50">
              <TableCell className="py-2 text-xs font-medium">
                {item.label}
              </TableCell>
              <TableCell className="py-2 text-xs text-right tabular-nums">
                {formatAmountInYen(item.total / 10000)}
              </TableCell>
              <TableCell className="py-2 text-xs text-right tabular-nums">
                {item.count}件
              </TableCell>
              <TableCell className="py-2 text-xs text-right tabular-nums text-muted-foreground">
                {formatAmountInYen(item.totalLimit / 10000)}
              </TableCell>
              <TableCell className="py-2">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        item.percentage >= 80
                          ? "bg-destructive"
                          : item.percentage >= 50
                            ? "bg-amber-500"
                            : "bg-primary"
                      }`}
                      style={{ width: `${Math.min(item.percentage, 100)}%` }}
                    />
                  </div>
                  <span
                    className={`text-xs tabular-nums w-10 text-right ${
                      item.percentage >= 80
                        ? "text-destructive font-medium"
                        : "text-muted-foreground"
                    }`}
                  >
                    {item.percentage.toFixed(0)}%
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
