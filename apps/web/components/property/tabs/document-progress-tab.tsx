"use client";

import {
  DOCUMENT_STATUS_COLORS,
  DOCUMENT_STATUS_LABELS,
  DOCUMENT_ITEM_STATUS_LABELS,
} from "@workspace/utils";
import { documentStatus, documentItemStatus } from "@workspace/drizzle/schemas";
import BadgeSelectForm from "../form/badge-select-form";
import SelectForm from "../form/select-form";
import { usePropertyForm } from "../property-form-provider";
import { usePropertyOptional } from "../property-provider";
import SectionCard from "../section-card";

/** 書類項目ステータスの選択肢 */
const DOCUMENT_ITEM_STATUS_OPTIONS = documentItemStatus.map((status) => ({
  value: status,
  label: DOCUMENT_ITEM_STATUS_LABELS[status],
}));

export default function DocumentProgressTab() {
  const form = usePropertyForm();
  const property = usePropertyOptional();

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
              updatedAt={property?.documentStatusUpdatedAt}
              updatedByUser={property?.documentStatusUpdatedByUser}
            />
          </div>
        </SectionCard>

        {/* 銀行関係 */}
        <SectionCard title="銀行関係">
          <div className="space-y-4 w-full">
            <SelectForm
              form={form}
              name="documentItem_loan_calculation"
              label="ローン計算書"
              options={DOCUMENT_ITEM_STATUS_OPTIONS}
              updatedAt={
                property?.documentItems?.find(
                  (item) => item.itemType === "loan_calculation"
                )?.updatedAt
              }
              updatedByUser={
                property?.documentItems?.find(
                  (item) => item.itemType === "loan_calculation"
                )?.updatedByUser
              }
            />
          </div>
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* 賃貸管理関係 */}
        <SectionCard title="賃貸管理関係">
          <div className="space-y-4 w-full">
            <SelectForm
              form={form}
              name="documentItem_rental_contract"
              label="賃貸借契約書"
              options={DOCUMENT_ITEM_STATUS_OPTIONS}
              updatedAt={
                property?.documentItems?.find(
                  (item) => item.itemType === "rental_contract"
                )?.updatedAt
              }
              updatedByUser={
                property?.documentItems?.find(
                  (item) => item.itemType === "rental_contract"
                )?.updatedByUser
              }
            />
            <SelectForm
              form={form}
              name="documentItem_management_contract"
              label="管理委託契約書"
              options={DOCUMENT_ITEM_STATUS_OPTIONS}
              updatedAt={
                property?.documentItems?.find(
                  (item) => item.itemType === "management_contract"
                )?.updatedAt
              }
              updatedByUser={
                property?.documentItems?.find(
                  (item) => item.itemType === "management_contract"
                )?.updatedByUser
              }
            />
            <SelectForm
              form={form}
              name="documentItem_move_in_application"
              label="入居申込書"
              options={DOCUMENT_ITEM_STATUS_OPTIONS}
              updatedAt={
                property?.documentItems?.find(
                  (item) => item.itemType === "move_in_application"
                )?.updatedAt
              }
              updatedByUser={
                property?.documentItems?.find(
                  (item) => item.itemType === "move_in_application"
                )?.updatedByUser
              }
            />
          </div>
        </SectionCard>

        {/* 建物管理関係 */}
        <SectionCard title="建物管理関係">
          <div className="space-y-4 w-full">
            <SelectForm
              form={form}
              name="documentItem_important_matters_report"
              label="重要事項調査報告書"
              options={DOCUMENT_ITEM_STATUS_OPTIONS}
              updatedAt={
                property?.documentItems?.find(
                  (item) => item.itemType === "important_matters_report"
                )?.updatedAt
              }
              updatedByUser={
                property?.documentItems?.find(
                  (item) => item.itemType === "important_matters_report"
                )?.updatedByUser
              }
            />
            <SelectForm
              form={form}
              name="documentItem_management_rules"
              label="管理規約"
              options={DOCUMENT_ITEM_STATUS_OPTIONS}
              updatedAt={
                property?.documentItems?.find(
                  (item) => item.itemType === "management_rules"
                )?.updatedAt
              }
              updatedByUser={
                property?.documentItems?.find(
                  (item) => item.itemType === "management_rules"
                )?.updatedByUser
              }
            />
            <SelectForm
              form={form}
              name="documentItem_long_term_repair_plan"
              label="長期修繕計画書"
              options={DOCUMENT_ITEM_STATUS_OPTIONS}
              updatedAt={
                property?.documentItems?.find(
                  (item) => item.itemType === "long_term_repair_plan"
                )?.updatedAt
              }
              updatedByUser={
                property?.documentItems?.find(
                  (item) => item.itemType === "long_term_repair_plan"
                )?.updatedByUser
              }
            />
            <SelectForm
              form={form}
              name="documentItem_general_meeting_minutes"
              label="総会議事録"
              options={DOCUMENT_ITEM_STATUS_OPTIONS}
              updatedAt={
                property?.documentItems?.find(
                  (item) => item.itemType === "general_meeting_minutes"
                )?.updatedAt
              }
              updatedByUser={
                property?.documentItems?.find(
                  (item) => item.itemType === "general_meeting_minutes"
                )?.updatedByUser
              }
            />
            <SelectForm
              form={form}
              name="documentItem_pamphlet"
              label="パンフレット"
              options={DOCUMENT_ITEM_STATUS_OPTIONS}
              updatedAt={
                property?.documentItems?.find(
                  (item) => item.itemType === "pamphlet"
                )?.updatedAt
              }
              updatedByUser={
                property?.documentItems?.find(
                  (item) => item.itemType === "pamphlet"
                )?.updatedByUser
              }
            />
            <SelectForm
              form={form}
              name="documentItem_bank_transfer_form"
              label="口座振替用紙"
              options={DOCUMENT_ITEM_STATUS_OPTIONS}
              updatedAt={
                property?.documentItems?.find(
                  (item) => item.itemType === "bank_transfer_form"
                )?.updatedAt
              }
              updatedByUser={
                property?.documentItems?.find(
                  (item) => item.itemType === "bank_transfer_form"
                )?.updatedByUser
              }
            />
            <SelectForm
              form={form}
              name="documentItem_owner_change_notification"
              label="所有者変更届"
              options={DOCUMENT_ITEM_STATUS_OPTIONS}
              updatedAt={
                property?.documentItems?.find(
                  (item) => item.itemType === "owner_change_notification"
                )?.updatedAt
              }
              updatedByUser={
                property?.documentItems?.find(
                  (item) => item.itemType === "owner_change_notification"
                )?.updatedByUser
              }
            />
          </div>
        </SectionCard>

        {/* 役所関係 */}
        <SectionCard title="役所関係">
          <div className="space-y-4 w-full">
            <SelectForm
              form={form}
              name="documentItem_tax_certificate"
              label="公課証明"
              options={DOCUMENT_ITEM_STATUS_OPTIONS}
              updatedAt={
                property?.documentItems?.find(
                  (item) => item.itemType === "tax_certificate"
                )?.updatedAt
              }
              updatedByUser={
                property?.documentItems?.find(
                  (item) => item.itemType === "tax_certificate"
                )?.updatedByUser
              }
            />
            <SelectForm
              form={form}
              name="documentItem_building_plan_overview"
              label="建築計画概要書"
              options={DOCUMENT_ITEM_STATUS_OPTIONS}
              updatedAt={
                property?.documentItems?.find(
                  (item) => item.itemType === "building_plan_overview"
                )?.updatedAt
              }
              updatedByUser={
                property?.documentItems?.find(
                  (item) => item.itemType === "building_plan_overview"
                )?.updatedByUser
              }
            />
            <SelectForm
              form={form}
              name="documentItem_ledger_certificate"
              label="台帳記載事項証明書"
              options={DOCUMENT_ITEM_STATUS_OPTIONS}
              updatedAt={
                property?.documentItems?.find(
                  (item) => item.itemType === "ledger_certificate"
                )?.updatedAt
              }
              updatedByUser={
                property?.documentItems?.find(
                  (item) => item.itemType === "ledger_certificate"
                )?.updatedByUser
              }
            />
            <SelectForm
              form={form}
              name="documentItem_zoning_district"
              label="用途地域"
              options={DOCUMENT_ITEM_STATUS_OPTIONS}
              updatedAt={
                property?.documentItems?.find(
                  (item) => item.itemType === "zoning_district"
                )?.updatedAt
              }
              updatedByUser={
                property?.documentItems?.find(
                  (item) => item.itemType === "zoning_district"
                )?.updatedByUser
              }
            />
            <SelectForm
              form={form}
              name="documentItem_road_ledger"
              label="道路台帳"
              options={DOCUMENT_ITEM_STATUS_OPTIONS}
              updatedAt={
                property?.documentItems?.find(
                  (item) => item.itemType === "road_ledger"
                )?.updatedAt
              }
              updatedByUser={
                property?.documentItems?.find(
                  (item) => item.itemType === "road_ledger"
                )?.updatedByUser
              }
            />
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
