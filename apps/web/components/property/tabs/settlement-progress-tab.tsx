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
import SectionCard from "../section-card";
import { DocumentRow } from "../property-detail-modal";
import { CheckItemRow } from "../check-item-row";
import { BankAccountCard } from "../bank-account-card";
import { Badge } from "@workspace/ui/components/badge";

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
    <div className="grid grid-cols-2 gap-6">
      {/* 左側: 決済進捗 */}
      <div className="space-y-6">
        <div className="rounded-lg border bg-card">
          <div className="p-4 border-b bg-muted/30">
            <h3 className="font-semibold">精算書関係</h3>
          </div>
          <div className="p-4 space-y-3">
            <StageProgressRow
              label="BC精算書"
              stages={["作成", "送付", "CB完了"]}
            />
            <CheckItemRow
              label="ローン計算書 保存"
              checked={false}
              onChange={(checked) => {
                console.log(checked);
              }}
            />
            <StageProgressRow
              label="AB精算書"
              stages={["作成", "送付", "CR完了"]}
            />
          </div>
        </div>

        <div className="rounded-lg border bg-card">
          <div className="p-4 border-b bg-muted/30">
            <h3 className="font-semibold">司法書士関係</h3>
          </div>
          <div className="p-4 space-y-1">
            <CheckItemRow
              label="司法書士依頼"
              checked={false}
              onChange={(checked) => console.log(checked)}
            />
            <CheckItemRow
              label="必要書類共有"
              checked={false}
              onChange={(checked) => console.log(checked)}
            />
            <StageProgressRow
              label="本人確認書類"
              stages={["発送", "受取", "返送"]}
            />
            <CheckItemRow
              label="書類不備なし"
              checked={false}
              onChange={(checked) => console.log(checked)}
            />
          </div>
        </div>

        <div className="rounded-lg border bg-card">
          <div className="p-4 border-b bg-muted/30">
            <h3 className="font-semibold">抵当銀行関係</h3>
          </div>
          <div className="p-4 space-y-3">
            <StageProgressRow label="抵当銀行" stages={["依頼", "受付完了"]} />
            <CheckItemRow
              label="書類不備なし"
              checked={false}
              onChange={(checked) => console.log(checked)}
            />
            <CheckItemRow
              label="ローン計算書 保存"
              checked={false}
              onChange={(checked) => console.log(checked)}
            />
            <CheckItemRow
              label="売主手出し完了"
              checked={false}
              onChange={(checked) => console.log(checked)}
            />
          </div>
        </div>

        <div className="rounded-lg border bg-card">
          <div className="p-4 border-b bg-muted/30">
            <h3 className="font-semibold">賃貸管理・決済後関係</h3>
          </div>
          <div className="p-4 space-y-3">
            <StageProgressRow label="管理解約依頼" stages={["依頼", "完了"]} />
            <StageProgressRow label="保証会社承継" stages={["依頼", "完了"]} />
            <StageProgressRow label="鍵" stages={["受取", "発送"]} />
            <StageProgressRow
              label="管積 口座振替手続き"
              stages={["受取", "発送"]}
            />
            <CheckItemRow
              label="取引台帳記入"
              checked={false}
              onChange={(checked) => console.log(checked)}
            />
          </div>
        </div>
      </div>

      {/* 右側: 口座関係 */}
      <div className="space-y-6">
        {/* <BankAccountCard
          propertyId={property.id}
          settlementDate={property.settlementDate}
          amountExit={property.amountExit}
          initialAccountCompany={property.accountCompany}
          initialBankAccount={property.bankAccount}
        /> */}
      </div>
    </div>
  );
}

function StageProgressRow({
  label,
  stages,
}: {
  label: string;
  stages: string[];
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm">{label}</span>
      <div className="flex gap-2">
        {stages.map((stage) => (
          <Badge
            key={stage}
            variant="outline"
            className="text-xs cursor-pointer hover:bg-muted"
          >
            {stage}
          </Badge>
        ))}
      </div>
    </div>
  );
}
