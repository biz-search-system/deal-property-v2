"use client";

import { progressStatus } from "@workspace/drizzle/schemas";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import {
  PROGRESS_STATUS_COLORS,
  PROGRESS_STATUS_LABELS,
} from "@workspace/utils";
import { useState } from "react";
import { CheckItemRow } from "../check-item-row";
import BadgeSelectForm from "../form/badge-select-form";
import { usePropertyForm } from "../property-form-provider";
import SectionCard from "../section-card";

export default function ContractProgressTab() {
  const form = usePropertyForm();
  const { control } = form;
  // 契約進捗のチェック状態
  const [contractChecks, setContractChecks] = useState({
    // AB関係
    contractSaved: false,
    powerOfAttorneySaved: false,
    sellerIdSaved: false,
    // BC関係
    bcContractCreated: false,
    importantMattersCreated: false,
    bcContractSent: false,
    importantMattersSent: false,
    bcContractCBCompleted: false,
    importantMattersCBCompleted: false,
  });

  return (
    <div className="space-y-6">
      {/* 進捗ステータス */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">進捗ステータス</h3>
        <BadgeSelectForm
          form={form}
          name="progressStatus"
          label="進捗ステータス"
          options={progressStatus.map((type) => ({
            value: type,
            label: PROGRESS_STATUS_LABELS[type],
            color: PROGRESS_STATUS_COLORS[type],
          }))}
        />
      </div>

      {/* 日付情報 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">日付情報</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={control}
            name="contractDateA"
            render={({ field }) => (
              <FormItem>
                <FormLabel>契約日A</FormLabel>
                <FormControl>
                  <Input
                    id="contractDateA"
                    type="date"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="contractDateBc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>契約日BC</FormLabel>
                <FormControl>
                  <Input
                    id="contractDateBc"
                    type="date"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="settlementDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>決済日</FormLabel>
                <FormControl>
                  <Input
                    id="settlementDate"
                    type="date"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">契約進捗チェックリスト</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SectionCard title="AB関係">
            <div className="space-y-1">
              <CheckItemRow
                label="契約書 保存完了"
                checked={contractChecks.contractSaved}
                date={
                  contractChecks.contractSaved ? "2025/01/10 14:30" : undefined
                }
                user={contractChecks.contractSaved ? "田中" : undefined}
                onChange={(checked) =>
                  setContractChecks({
                    ...contractChecks,
                    contractSaved: checked,
                  })
                }
              />
              <CheckItemRow
                label="委任状関係 保存完了"
                checked={contractChecks.powerOfAttorneySaved}
                date={
                  contractChecks.powerOfAttorneySaved
                    ? "2025/01/11 10:15"
                    : undefined
                }
                user={contractChecks.powerOfAttorneySaved ? "山田" : undefined}
                onChange={(checked) =>
                  setContractChecks({
                    ...contractChecks,
                    powerOfAttorneySaved: checked,
                  })
                }
              />
              <CheckItemRow
                label="売主身分証 保存完了"
                checked={contractChecks.sellerIdSaved}
                onChange={(checked) =>
                  setContractChecks({
                    ...contractChecks,
                    sellerIdSaved: checked,
                  })
                }
              />
            </div>
          </SectionCard>

          <SectionCard title="BC関係">
            <div className="space-y-1">
              <CheckItemRow
                label="BC売契作成"
                checked={contractChecks.bcContractCreated}
                date={
                  contractChecks.bcContractCreated
                    ? "2025/01/15 09:00"
                    : undefined
                }
                user={contractChecks.bcContractCreated ? "鈴木" : undefined}
                onChange={(checked) =>
                  setContractChecks({
                    ...contractChecks,
                    bcContractCreated: checked,
                  })
                }
              />
              <CheckItemRow
                label="重説作成"
                checked={contractChecks.importantMattersCreated}
                date={
                  contractChecks.importantMattersCreated
                    ? "2025/01/15 11:30"
                    : undefined
                }
                user={
                  contractChecks.importantMattersCreated ? "鈴木" : undefined
                }
                onChange={(checked) =>
                  setContractChecks({
                    ...contractChecks,
                    importantMattersCreated: checked,
                  })
                }
              />
              <CheckItemRow
                label="BC売契送付"
                checked={contractChecks.bcContractSent}
                onChange={(checked) =>
                  setContractChecks({
                    ...contractChecks,
                    bcContractSent: checked,
                  })
                }
              />
              <CheckItemRow
                label="重説送付"
                checked={contractChecks.importantMattersSent}
                onChange={(checked) =>
                  setContractChecks({
                    ...contractChecks,
                    importantMattersSent: checked,
                  })
                }
              />
              <CheckItemRow
                label="BC売契CB完了"
                checked={contractChecks.bcContractCBCompleted}
                onChange={(checked) =>
                  setContractChecks({
                    ...contractChecks,
                    bcContractCBCompleted: checked,
                  })
                }
              />
              <CheckItemRow
                label="重説CB完了"
                checked={contractChecks.importantMattersCBCompleted}
                onChange={(checked) =>
                  setContractChecks({
                    ...contractChecks,
                    importantMattersCBCompleted: checked,
                  })
                }
              />
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
