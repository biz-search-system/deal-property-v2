"use client";

import type { AccountCompany, BankAccount } from "@workspace/drizzle/types";
import { Alert, AlertDescription } from "@workspace/ui/components/alert";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Field, FieldLabel } from "@workspace/ui/components/field";
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
import { AlertCircle, Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { usePropertyForm } from "./property-form-provider";
import SectionCard from "./section-card";

interface BankAccountFormCardProps {
  propertyId?: string;
}

export function BankAccountFormCard({ propertyId }: BankAccountFormCardProps) {
  const form = usePropertyForm();
  const selectedAccountCompany = form.watch("accountCompany");
  const selectedBankAccount = form.watch("bankAccount");
  const settlementDate = form.watch("settlementDate");
  const amountExit = form.watch("amountExit");

  // APIから取得した他案件の合計金額（円単位）
  const [totalAmountYen, setTotalAmountYen] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  // フォームの値は万円単位なのでそのまま使用
  const amountExitManyen = amountExit ?? 0;
  // APIからの合計金額（円）を万円に変換
  const totalAmountManyen = totalAmountYen / 10000;
  // 合計（万円単位）
  const totalWithCurrentManyen = totalAmountManyen + amountExitManyen;

  // 同日同口座の合計金額を取得
  useEffect(() => {
    if (!settlementDate || !selectedAccountCompany || !selectedBankAccount) {
      setTotalAmountYen(0);
      return;
    }

    const fetchTotalAmount = async () => {
      setIsLoading(true);
      try {
        const dateValue = new Date(settlementDate).toISOString();
        const params = new URLSearchParams({
          date: dateValue,
          company: selectedAccountCompany,
          account: selectedBankAccount,
        });
        if (propertyId) {
          params.append("excludeId", propertyId);
        }
        const response = await fetch(
          `/api/properties/bank-account-total?${params.toString()}`,
        );

        if (response.ok) {
          const data = await response.json();
          setTotalAmountYen(data.total || 0);
        }
      } catch (error) {
        console.error("Failed to fetch total amount:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTotalAmount();
  }, [settlementDate, selectedAccountCompany, selectedBankAccount, propertyId]);

  // 上限金額を取得（万円単位）
  const accountLimit = getBankAccountLimit(
    selectedAccountCompany as AccountCompany,
    selectedBankAccount as BankAccount,
  );

  // isOverLimit/isNearLimitは万円単位を期待
  const isOverLimitFlag = isOverLimit(totalWithCurrentManyen, accountLimit);
  const isNearLimitFlag = isNearLimit(totalWithCurrentManyen, accountLimit);

  return (
    <SectionCard title="口座情報">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <Controller
          control={form.control}
          name="accountCompany"
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor={field.name} className="select-text">
                使用口座会社
              </FieldLabel>
              <div className="flex items-center gap-1">
                <Select
                  name={field.name}
                  value={field.value || ""}
                  onValueChange={(value) => {
                    field.onChange(value);
                    form.setValue("bankAccount", "");
                  }}
                >
                  <SelectTrigger id={field.name} className="w-full">
                    <SelectValue placeholder="選択してください">
                      {field.value && (
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs",
                            ACCOUNT_COMPANY_COLORS[
                              field.value as AccountCompany
                            ],
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
                              ACCOUNT_COMPANY_COLORS[key as AccountCompany],
                            )}
                          >
                            {label}
                          </Badge>
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    field.onChange("");
                    form.setValue("bankAccount", "");
                  }}
                  className={cn(!field.value && "hidden")}
                  aria-label="選択を解除"
                >
                  <X />
                </Button>
              </div>
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="bankAccount"
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor={field.name} className="select-text">
                使用銀行口座
              </FieldLabel>
              <div className="flex items-center gap-1">
                <Select
                  name={field.name}
                  value={field.value || ""}
                  onValueChange={field.onChange}
                  disabled={!selectedAccountCompany}
                >
                  <SelectTrigger id={field.name} className="w-full">
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
                            BANK_ACCOUNT_COLORS[field.value as BankAccount],
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
                        selectedAccountCompany as AccountCompany,
                      ).map((account) => (
                        <SelectItem key={account} value={account}>
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-xs",
                              BANK_ACCOUNT_COLORS[account],
                            )}
                          >
                            {BANK_ACCOUNT_LABELS[account]}
                          </Badge>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => field.onChange("")}
                  disabled={!selectedAccountCompany}
                  className={cn(!field.value && "hidden")}
                  aria-label="選択を解除"
                >
                  <X />
                </Button>
              </div>
            </Field>
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
                {formatAmountInYen(totalWithCurrentManyen)}
              </p>
              <p className="text-xs text-muted-foreground">
                (他案件: {formatAmountInYen(totalAmountManyen)} + 当案件:{" "}
                {formatAmountInYen(amountExitManyen)})
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
                使用率:{" "}
                {((totalWithCurrentManyen / accountLimit) * 100).toFixed(1)}%
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
