"use client";

import { usePropertyForm } from "../property-form-provider";

import {
  ACCOUNT_COMPANY_COLORS,
  ACCOUNT_COMPANY_LABELS,
  accountCompany,
  BANK_ACCOUNT_COLORS,
  BANK_ACCOUNT_LABELS,
  bankAccount,
} from "@workspace/drizzle/constants";
import BadgeSelectForm from "../form/badge-select-form";

export default function SettlementProgressTab() {
  const form = usePropertyForm();

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
            placeholder="使用銀行口座を選択"
            options={bankAccount.map((type) => ({
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
