"use client";

import {
  DOCUMENT_STATUS_COLORS,
  DOCUMENT_STATUS_LABELS,
} from "@workspace/utils";
import { documentStatus } from "@workspace/drizzle/schemas";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Label } from "@workspace/ui/components/label";
import BadgeSelectForm from "../form/badge-select-form";
import { usePropertyForm } from "../property-form-provider";
import SectionCard from "../section-card";
import { UserActionBadge } from "../user-action-badge";

/** 書類ステータスの選択肢 */
const DOCUMENT_ITEM_STATUS_OPTIONS = [
  { value: "not_requested", label: "未依頼" },
  { value: "requesting", label: "依頼中" },
  { value: "acquired", label: "取得済" },
  { value: "not_required", label: "不要" },
];

interface UserInfo {
  name: string | null;
  email: string;
  image: string | null;
}

/** 書類項目の行コンポーネント（サンプルUI） */
function DocumentItemRow({
  label,
  updatedAt,
  updatedByUser,
}: {
  label: string;
  updatedAt?: Date | null;
  updatedByUser?: UserInfo | null;
}) {
  return (
    <div className="flex flex-col gap-1">
      <Label>{label}</Label>
      <div className="grid grid-cols-2 gap-4">
        <Select defaultValue="not_requested">
          <SelectTrigger className="w-full">
            <SelectValue placeholder="選択してください" />
          </SelectTrigger>
          <SelectContent>
            {DOCUMENT_ITEM_STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {updatedAt && (
          <div className="flex justify-end">
            <UserActionBadge timestamp={updatedAt} user={updatedByUser} />
          </div>
        )}
      </div>
    </div>
  );
}

// サンプルデータ（将来的にDBから取得）
const sampleUser: UserInfo = {
  name: "佐藤 太郎",
  email: "sato@example.com",
  image: null,
};

const sampleDate = new Date("2025-01-15T10:30:00");

export default function DocumentProgressTab() {
  const form = usePropertyForm();

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* 書類ステータス（全体） */}
        <SectionCard title="書類ステータス（全体）">
          <div className="w-full">
            <BadgeSelectForm
              form={form}
              name="documentStatus"
              label="書類ステータス"
              options={documentStatus.map((type) => ({
                value: type,
                label: DOCUMENT_STATUS_LABELS[type],
                color: DOCUMENT_STATUS_COLORS[type],
              }))}
              updatedAt={new Date()}
              updatedByUser={{
                name: "山田 太郎",
                email: "yamada@example.com",
                image: null,
              }}
            />
          </div>
        </SectionCard>

        {/* 銀行関係 */}
        <SectionCard title="銀行関係">
          <div className="space-y-4 w-full">
            <DocumentItemRow label="ローン計算書" />
          </div>
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* 賃貸管理関係 */}
        <SectionCard title="賃貸管理関係">
          <div className="space-y-4 w-full">
            <DocumentItemRow
              label="賃貸借契約書"
              updatedAt={sampleDate}
              updatedByUser={sampleUser}
            />
            <DocumentItemRow label="管理委託契約書" />
            <DocumentItemRow label="入居申込書" />
          </div>
        </SectionCard>

        {/* 建物管理関係 */}
        <SectionCard title="建物管理関係">
          <div className="space-y-4 w-full">
            <DocumentItemRow label="重要事項調査報告書" />
            <DocumentItemRow
              label="管理規約"
              updatedAt={new Date("2025-01-14T14:00:00")}
              updatedByUser={{
                name: "田中 花子",
                email: "tanaka@example.com",
                image: null,
              }}
            />
            <DocumentItemRow label="長期修繕計画書" />
            <DocumentItemRow label="総会議事録" />
            <DocumentItemRow label="パンフレット" />
            <DocumentItemRow label="口座振替用紙" />
            <DocumentItemRow label="所有者変更届" />
          </div>
        </SectionCard>

        {/* 役所関係 */}
        <SectionCard title="役所関係">
          <div className="space-y-4 w-full">
            <DocumentItemRow
              label="公課証明"
              updatedAt={new Date("2025-01-17T09:15:00")}
              updatedByUser={{
                name: "小林 次郎",
                email: "kobayashi@example.com",
                image: null,
              }}
            />
            <DocumentItemRow label="建築計画概要書" />
            <DocumentItemRow label="台帳記載事項証明書" />
            <DocumentItemRow label="用途地域" />
            <DocumentItemRow label="道路台帳" />
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
