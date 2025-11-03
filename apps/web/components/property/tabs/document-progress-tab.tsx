"use client";

import {
  DOCUMENT_STATUS_COLORS,
  DOCUMENT_STATUS_LABELS,
  documentStatus,
} from "@workspace/drizzle/constants";
import BadgeSelectForm from "../form/badge-select-form";
import { usePropertyForm } from "../property-form-provider";

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

      <div className="text-sm text-muted-foreground">
        書類の詳細ステータスは別途、書類進捗テーブルで管理されます。
      </div>
    </div>
  );
}
