"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Label } from "@workspace/ui/components/label";
import { Button } from "@workspace/ui/components/button";
import { Alert, AlertDescription } from "@workspace/ui/components/alert";
import { Separator } from "@workspace/ui/components/separator";
import { AlertCircle, Loader2 } from "lucide-react";
import { updatePropertyBankAccount } from "@/lib/actions/property-bank-account";
import { toast } from "sonner";
import {
  ACCOUNT_COMPANY_LABELS,
  BANK_ACCOUNT_LABELS,
  getBankAccountsByCompany,
  getBankAccountLimit,
  isNearLimit,
  isOverLimit,
  formatAmountInYen,
} from "@workspace/utils";
import type { AccountCompany } from "@workspace/drizzle/types";
import { accountCompany, bankAccount } from "@workspace/drizzle/schemas";

interface BankAccountCardProps {
  propertyId: string;
  settlementDate?: Date | null;
  amountExit?: number | null;
  initialAccountCompany?: string | null;
  initialBankAccount?: string | null;
}

export function BankAccountCard({
  propertyId,
  settlementDate,
  amountExit,
  initialAccountCompany,
  initialBankAccount,
}: BankAccountCardProps) {
  const [selectedAccountCompany, setSelectedAccountCompany] = useState<string>(
    initialAccountCompany || "",
  );
  const [selectedBankAccount, setSelectedBankAccount] = useState<string>(
    initialBankAccount || "",
  );
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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
          `/api/properties/bank-account-total?date=${settlementDate.toISOString()}&company=${selectedAccountCompany}&account=${selectedBankAccount}&excludeId=${propertyId}`,
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
    selectedBankAccount as any,
  );

  const isOverLimitFlag = isOverLimit(totalWithCurrent, accountLimit);
  const isNearLimitFlag = isNearLimit(totalWithCurrent, accountLimit);

  // 保存処理
  const handleSave = async () => {
    if (!selectedAccountCompany || !selectedBankAccount) {
      toast.error("口座会社と銀行口座を選択してください");
      return;
    }

    if (isOverLimitFlag) {
      toast.error("決済上限を超えているため保存できません");
      return;
    }

    // 型の検証
    if (!accountCompany.includes(selectedAccountCompany as any)) {
      toast.error("無効な口座会社が選択されています");
      return;
    }

    if (!bankAccount.includes(selectedBankAccount as any)) {
      toast.error("無効な銀行口座が選択されています");
      return;
    }

    setIsSaving(true);
    try {
      await updatePropertyBankAccount({
        propertyId,
        accountCompany: selectedAccountCompany as AccountCompany,
        bankAccount: selectedBankAccount as any,
      });

      toast.success("口座情報を保存しました");
    } catch (error) {
      console.error("Failed to save bank account:", error);
      toast.error("口座情報の保存に失敗しました");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="p-0 overflow-hidden">
      <CardHeader className="m-0 border-b [.border-b]:py-5 bg-muted/30 flex items-center">
        <CardTitle className="">口座情報</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="account-company">使用口座会社</Label>
          <Select
            value={selectedAccountCompany}
            onValueChange={(value) => {
              setSelectedAccountCompany(value);
              setSelectedBankAccount(""); // 口座会社変更時に銀行口座をリセット
            }}
          >
            <SelectTrigger id="account-company">
              <SelectValue placeholder="選択してください" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(ACCOUNT_COMPANY_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bank-account">使用銀行口座</Label>
          <Select
            value={selectedBankAccount}
            onValueChange={setSelectedBankAccount}
            disabled={!selectedAccountCompany}
          >
            <SelectTrigger id="bank-account">
              <SelectValue
                placeholder={
                  selectedAccountCompany
                    ? "銀行口座を選択してください"
                    : "先に口座会社を選択してください"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {selectedAccountCompany &&
                getBankAccountsByCompany(
                  selectedAccountCompany as AccountCompany,
                ).map((account) => (
                  <SelectItem key={account} value={account}>
                    {BANK_ACCOUNT_LABELS[account]}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        {selectedBankAccount && settlementDate && (
          <>
            <Separator />

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
                      使用率:{" "}
                      {((totalWithCurrent / accountLimit) * 100).toFixed(1)}%
                    </span>
                  </div>
                </>
              )}
            </div>

            {isOverLimitFlag && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  決済上限（{formatAmountInYen(accountLimit)}）を超えています。
                  他の口座を選択してください。
                </AlertDescription>
              </Alert>
            )}

            {!isOverLimitFlag && isNearLimitFlag && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  決済上限の80%を超えています。
                  可能であれば他の口座の利用も検討してください。
                </AlertDescription>
              </Alert>
            )}
          </>
        )}

        {!settlementDate && selectedBankAccount && (
          <Alert>
            <AlertDescription>
              決済日が設定されていないため、同日の合計金額を計算できません。
            </AlertDescription>
          </Alert>
        )}
      </CardContent>

      <CardFooter className="border-t [.border-t]:py-3 flex justify-between">
        <CardDescription>
          決済に使用する銀行口座を選択してください
        </CardDescription>
        <Button
          onClick={handleSave}
          disabled={
            !selectedAccountCompany ||
            !selectedBankAccount ||
            isOverLimitFlag ||
            isSaving
          }
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              保存中...
            </>
          ) : (
            "保存"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
