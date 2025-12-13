"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import {
  ACCOUNT_COMPANY_LABELS,
  BANK_ACCOUNT_BY_COMPANY,
  BANK_ACCOUNT_LABELS,
  formatAmountInYen,
  formatShortDate,
  getBankAccountLimit,
  toJstDateKey,
} from "@workspace/utils";
import type { AccountCompany } from "@workspace/drizzle/types";
import type { PropertyWithRelations } from "@/lib/types/property";

interface AccountSettlementSummaryProps {
  properties: PropertyWithRelations[];
}

const accountCompanies: AccountCompany[] = ["legit", "life", "ms"];

/** 最初に表示する行数 */
const INITIAL_VISIBLE_ROWS = 3;

export function AccountSettlementSummary({
  properties,
}: AccountSettlementSummaryProps) {
  const [selectedCompany, setSelectedCompany] =
    useState<AccountCompany>("legit");

  // 選択した会社の物件をフィルタ
  const filteredProperties = properties.filter(
    (p) => p.accountCompany === selectedCompany
  );

  // 選択した会社の銀行口座リスト
  const bankAccounts = BANK_ACCOUNT_BY_COMPANY[selectedCompany];

  // 決済日の一覧を取得（ソート済み）
  const settlementDates = [
    ...new Set(
      filteredProperties
        .filter((p) => p.settlementDate)
        .map((p) => toJstDateKey(p.settlementDate))
    ),
  ].sort();

  // 銀行口座 × 日付 のデータを集計
  const dataByBankAccount = bankAccounts.map((bankAccount) => {
    const accountProperties = filteredProperties.filter(
      (p) => p.bankAccount === bankAccount
    );

    // 日別集計
    const dailyTotals = new Map<string, number>();
    for (const p of accountProperties) {
      if (p.settlementDate) {
        const dateKey = toJstDateKey(p.settlementDate);
        const current = dailyTotals.get(dateKey) || 0;
        dailyTotals.set(dateKey, current + (p.amountExit || 0));
      }
    }

    // 日上限（万円単位）
    const dailyLimit = getBankAccountLimit(selectedCompany, bankAccount);

    // 日別使用率を計算
    const dailyData = settlementDates.map((date) => {
      const total = dailyTotals.get(date) || 0;
      const totalInMan = total / 10000;
      const percentage = dailyLimit > 0 ? (totalInMan / dailyLimit) * 100 : 0;
      return { date, total, percentage };
    });

    return {
      bankAccount,
      label: BANK_ACCOUNT_LABELS[bankAccount],
      dailyLimit: dailyLimit * 10000, // 円に戻す
      dailyData,
    };
  });

  const hasMoreRows = dataByBankAccount.length > INITIAL_VISIBLE_ROWS;

  return (
    <TooltipProvider>
      <div className="rounded-lg border overflow-hidden">
        <div className={hasMoreRows ? "h-[135px] overflow-y-auto" : undefined}>
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow className="hover:bg-transparent">
                <TableHead className="h-8 text-xs font-medium w-[100px]">
                  <Select
                    value={selectedCompany}
                    onValueChange={(v) =>
                      setSelectedCompany(v as AccountCompany)
                    }
                  >
                    <SelectTrigger className="h-6 text-xs border-0 bg-transparent p-0 focus:ring-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {accountCompanies.map((company) => (
                        <SelectItem key={company} value={company}>
                          {ACCOUNT_COMPANY_LABELS[company]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableHead>
                {settlementDates.map((date) => (
                  <TableHead
                    key={date}
                    className="h-8 text-xs font-medium text-right w-[70px]"
                  >
                    {formatShortDate(date)}
                  </TableHead>
                ))}
                <TableHead className="h-8 text-xs font-medium text-right w-[70px]">
                  日上限
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dataByBankAccount.map((item) => (
                <TableRow key={item.bankAccount} className="hover:bg-muted/50">
                  <TableCell className="py-2 text-xs font-medium">
                    {item.label}
                  </TableCell>
                  {item.dailyData.map((day) => (
                    <TableCell
                      key={day.date}
                      className={`py-2 text-xs text-right tabular-nums ${
                        day.percentage >= 100
                          ? "bg-destructive/10 text-destructive font-medium"
                          : day.percentage >= 80
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                            : ""
                      }`}
                    >
                      {day.total > 0 ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="cursor-help">
                              {formatAmountInYen(day.total / 10000)}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{day.percentage.toFixed(0)}%使用</p>
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  ))}
                  <TableCell className="py-2 text-xs text-right tabular-nums text-muted-foreground">
                    {formatAmountInYen(item.dailyLimit / 10000)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </TooltipProvider>
  );
}
