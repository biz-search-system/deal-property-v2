"use client";

import type { AccountCompany, BankAccount } from "@workspace/drizzle/types";
import { Alert, AlertDescription } from "@workspace/ui/components/alert";
import { Badge } from "@workspace/ui/components/badge";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@workspace/ui/components/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Separator } from "@workspace/ui/components/separator";
import {
  ACCOUNT_COMPANY_COLORS,
  ACCOUNT_COMPANY_LABELS,
  BANK_ACCOUNT_COLORS,
  BANK_ACCOUNT_LABELS,
  cn,
  formatAmountInYen,
  getBankAccountLimit,
  getBankAccountsByCompany,
  isNearLimit,
  isOverLimit,
} from "@workspace/utils";
import { AlertCircle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { usePropertyForm } from "./property-form-provider";
import SectionCard from "./section-card";

interface BankAccountFormCardProps {
  propertyId: string;
  settlementDate?: Date | null;
  amountExit?: number | null;
}

export function BankAccountFormCard({
  propertyId,
  settlementDate,
  amountExit,
}: BankAccountFormCardProps) {
  const form = usePropertyForm();
  const selectedAccountCompany = form.watch("accountCompany");
  const selectedBankAccount = form.watch("bankAccount");

  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  // 同日同口座の合計金額を取得
  useEffect(() => {
    if (!settlementDate || !selectedAccountCompany || !selectedBankAccount) {
      setTotalAmount(0);
      return;
    }

    const fetchTotalAmount = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/properties/bank-account-total?date=${settlementDate.toISOString()}&company=${selectedAccountCompany}&account=${selectedBankAccount}&excludeId=${propertyId}`
        );

        if (response.ok) {
          const data = await response.json();
          setTotalAmount(data.total || 0);
        }
      } catch (error) {
        console.error("Failed to fetch total amount:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTotalAmount();
  }, [settlementDate, selectedAccountCompany, selectedBankAccount, propertyId]);

  // 現在の案件を含めた合計金額
  const totalWithCurrent = totalAmount + (amountExit || 0);

  // 上限金額を取得
  const accountLimit = getBankAccountLimit(
    selectedAccountCompany as AccountCompany,
    selectedBankAccount as BankAccount
  );

  const isOverLimitFlag = isOverLimit(totalWithCurrent, accountLimit);
  const isNearLimitFlag = isNearLimit(totalWithCurrent, accountLimit);

  return (
    <SectionCard title="口座情報">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <FormField
          control={form.control}
          name="accountCompany"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>使用口座会社</FormLabel>
              <FormControl>
                <Select
                  value={field.value || ""}
                  onValueChange={(value) => {
                    field.onChange(value);
                    form.setValue("bankAccount", ""); // 口座会社変更時に銀行口座をリセット
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="選択してください">
                      {field.value && (
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs",
                            ACCOUNT_COMPANY_COLORS[
                              field.value as AccountCompany
                            ]
                          )}
                        >
                          {
                            ACCOUNT_COMPANY_LABELS[
                              field.value as AccountCompany
                            ]
                          }
                        </Badge>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(ACCOUNT_COMPANY_LABELS).map(
                      ([key, label]) => (
                        <SelectItem key={key} value={key}>
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-xs",
                              ACCOUNT_COMPANY_COLORS[key as AccountCompany]
                            )}
                          >
                            {label}
                          </Badge>
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bankAccount"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>使用銀行口座</FormLabel>
              <FormControl>
                <Select
                  value={field.value || ""}
                  onValueChange={field.onChange}
                  disabled={!selectedAccountCompany}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        selectedAccountCompany
                          ? "銀行口座を選択してください"
                          : "先に口座会社を選択してください"
                      }
                    >
                      {field.value && (
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs",
                            BANK_ACCOUNT_COLORS[field.value as BankAccount]
                          )}
                        >
                          {BANK_ACCOUNT_LABELS[field.value as BankAccount]}
                        </Badge>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {selectedAccountCompany &&
                      getBankAccountsByCompany(
                        selectedAccountCompany as AccountCompany
                      ).map((account) => (
                        <SelectItem key={account} value={account}>
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-xs",
                              BANK_ACCOUNT_COLORS[account]
                            )}
                          >
                            {BANK_ACCOUNT_LABELS[account]}
                          </Badge>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      <Separator className="my-4" />

      <div
        className={`p-4 rounded-lg space-y-2 ${
          isOverLimitFlag
            ? "bg-destructive/10"
            : isNearLimitFlag
              ? "bg-yellow-500/10"
              : "bg-muted"
        }`}
      >
        <p className="text-sm text-muted-foreground">
          同日同口座の出口金額合計
        </p>

        {isLoading ? (
          <div className="flex items-center">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            <span className="text-sm">計算中...</span>
          </div>
        ) : (
          <>
            <div className="space-y-1">
              <p className="text-2xl font-semibold">
                {formatAmountInYen(totalWithCurrent)}
              </p>
              <p className="text-xs text-muted-foreground">
                (他案件: {formatAmountInYen(totalAmount)} + 当案件:{" "}
                {formatAmountInYen(amountExit || 0)})
              </p>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span>上限: {formatAmountInYen(accountLimit)}</span>
              <span
                className={
                  isOverLimitFlag
                    ? "text-destructive font-semibold"
                    : isNearLimitFlag
                      ? "text-yellow-600 font-semibold"
                      : "text-muted-foreground"
                }
              >
                使用率: {((totalWithCurrent / accountLimit) * 100).toFixed(1)}%
              </span>
            </div>
          </>
        )}
      </div>

      {isOverLimitFlag && (
        <Alert variant="destructive" className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            決済上限（{formatAmountInYen(accountLimit)}）を超えています。
            他の口座を選択してください。
          </AlertDescription>
        </Alert>
      )}

      {!isOverLimitFlag && isNearLimitFlag && (
        <Alert className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            決済上限の80%を超えています。
            可能であれば他の口座の利用も検討してください。
          </AlertDescription>
        </Alert>
      )}

      {!settlementDate && selectedBankAccount && (
        <Alert className="mt-2">
          <AlertDescription>
            決済日が設定されていないため、同日の合計金額を計算できません。
          </AlertDescription>
        </Alert>
      )}
    </SectionCard>
  );
}
