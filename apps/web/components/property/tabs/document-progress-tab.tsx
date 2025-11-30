"use client";

import {
  DOCUMENT_STATUS_COLORS,
  DOCUMENT_STATUS_LABELS,
} from "@workspace/utils";
import { documentStatus } from "@workspace/drizzle/schemas";
import BadgeSelectForm from "../form/badge-select-form";
import { usePropertyForm } from "../property-form-provider";
import SectionCard from "../section-card";
import { DocumentRow } from "../property-detail-modal";

export default function DocumentProgressTab() {
  const form = usePropertyForm();

  return (
    <div className="space-y-6">
      {/* 書類ステータス */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">書類ステータス</h3>
        <BadgeSelectForm
          form={form}
          name="documentStatus"
          label="書類ステータス"
          options={documentStatus.map((type) => ({
            value: type,
            label: DOCUMENT_STATUS_LABELS[type],
            color: DOCUMENT_STATUS_COLORS[type],
          }))}
        />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">契約進捗チェックリスト</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SectionCard title="賃貸管理関係 ">
            <div className="space-y-1 w-full">
              <DocumentRow
                label="賃貸借契約書"
                status="取得完了"
                date="2025/01/12"
                user="佐藤"
              />
              <DocumentRow
                label="管理委託契約書"
                status="依頼"
                date="2025/01/13"
                user="田中"
              />
            </div>
          </SectionCard>
          <SectionCard title="賃貸管理関係 ">
            <div className="space-y-1 w-full">
              <DocumentRow
                label="賃貸借契約書"
                status="取得完了"
                date="2025/01/12"
                user="佐藤"
              />
              <DocumentRow
                label="管理委託契約書"
                status="依頼"
                date="2025/01/13"
                user="田中"
              />
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
