"use client";

import { usePropertyForm } from "../property-form-provider";
import { useEffect } from "react";

import {
  ACCOUNT_COMPANY_COLORS,
  ACCOUNT_COMPANY_LABELS,
  BANK_ACCOUNT_COLORS,
  BANK_ACCOUNT_LABELS,
  getBankAccountsByCompany,
} from "@workspace/utils";
import BadgeSelectForm from "../form/badge-select-form";
import { accountCompany } from "@workspace/drizzle/schemas";
import type { AccountCompany } from "@workspace/drizzle/types";

export default function SettlementProgressTab() {
  const form = usePropertyForm();
  const selectedCompany = form.watch("accountCompany");

  // 口座会社が変更されたら、銀行口座を必ずリセット
  useEffect(() => {
    // 銀行口座を無条件でリセット（口座会社が変更された場合）
    form.setValue("bankAccount", undefined);
  }, [selectedCompany, form]);

  // 選択された口座会社に基づいて銀行口座の選択肢を取得
  const availableBankAccounts = getBankAccountsByCompany(
    selectedCompany as AccountCompany
  );

  return (
    <div className="space-y-6">
      {/* 口座情報 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">口座情報</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BadgeSelectForm
            form={form}
            name="accountCompany"
            label="使用口座会社"
            placeholder="使用口座会社を選択"
            options={accountCompany.map((type) => ({
              value: type,
              label: ACCOUNT_COMPANY_LABELS[type],
              color: ACCOUNT_COMPANY_COLORS[type],
            }))}
          />
          <BadgeSelectForm
            form={form}
            name="bankAccount"
            label="使用銀行口座"
            placeholder={
              selectedCompany
                ? "使用銀行口座を選択"
                : "先に使用口座会社を選択してください"
            }
            disabled={!selectedCompany}
            options={availableBankAccounts.map((type) => ({
              value: type,
              label: BANK_ACCOUNT_LABELS[type],
              color: BANK_ACCOUNT_COLORS[type],
            }))}
          />
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        決済の詳細ステータスは別途、決済進捗テーブルで管理されます。
      </div>
    </div>
  );
}
