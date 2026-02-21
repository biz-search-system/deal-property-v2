"use client";

import {
  DOCUMENT_STATUS_COLORS,
  DOCUMENT_STATUS_LABELS,
  DOCUMENT_ITEM_STATUS_LABELS,
  DOCUMENT_ITEM_STATUS_COLORS,
} from "@workspace/utils";
import { documentStatus, documentItemStatus } from "@workspace/drizzle/schemas";
import BadgeSelectForm from "../form/badge-select-form";
import { usePropertyForm } from "../property-form-provider";
import { usePropertyOptional } from "../property-provider";
import SectionCard from "../section-card";

export default function DocumentProgressTab() {
  const form = usePropertyForm();
  const property = usePropertyOptional();

  return (
    <div className="space-y-3">
      {/* 書類ステータス（全体） */}
      <SectionCard title="書類ステータス（全体）" className="md:w-1/2 w-full">
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
          required={true}
        />
      </SectionCard>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* 賃貸関連書類 */}
        <SectionCard title="賃貸関連書類">
          <div className="space-y-4 w-full">
            <BadgeSelectForm
              form={form}
              name="documentItem_rental_contract"
              label="賃貸借契約書"
              options={documentItemStatus.map((status) => ({
                value: status,
                label: DOCUMENT_ITEM_STATUS_LABELS[status],
                color: DOCUMENT_ITEM_STATUS_COLORS[status],
              }))}
              updatedAt={
                property?.documentItems?.find(
                  (item) => item.itemType === "rental_contract",
                )?.updatedAt
              }
              updatedByUser={
                property?.documentItems?.find(
                  (item) => item.itemType === "rental_contract",
                )?.updatedByUser
              }
              required={true}
            />
            <BadgeSelectForm
              form={form}
              name="documentItem_management_contract"
              label="管理委託契約書"
              options={documentItemStatus.map((status) => ({
                value: status,
                label: DOCUMENT_ITEM_STATUS_LABELS[status],
                color: DOCUMENT_ITEM_STATUS_COLORS[status],
              }))}
              updatedAt={
                property?.documentItems?.find(
                  (item) => item.itemType === "management_contract",
                )?.updatedAt
              }
              updatedByUser={
                property?.documentItems?.find(
                  (item) => item.itemType === "management_contract",
                )?.updatedByUser
              }
              required={true}
            />
            <BadgeSelectForm
              form={form}
              name="documentItem_move_in_application"
              label="入居申込書"
              options={documentItemStatus.map((status) => ({
                value: status,
                label: DOCUMENT_ITEM_STATUS_LABELS[status],
                color: DOCUMENT_ITEM_STATUS_COLORS[status],
              }))}
              updatedAt={
                property?.documentItems?.find(
                  (item) => item.itemType === "move_in_application",
                )?.updatedAt
              }
              updatedByUser={
                property?.documentItems?.find(
                  (item) => item.itemType === "move_in_application",
                )?.updatedByUser
              }
              required={true}
            />
          </div>
        </SectionCard>

        {/* 建物管理書類 */}
        <SectionCard title="建物管理書類">
          <div className="space-y-4 w-full">
            <BadgeSelectForm
              form={form}
              name="documentItem_important_matters_report"
              label="重要事項調査報告書"
              options={documentItemStatus.map((status) => ({
                value: status,
                label: DOCUMENT_ITEM_STATUS_LABELS[status],
                color: DOCUMENT_ITEM_STATUS_COLORS[status],
              }))}
              updatedAt={
                property?.documentItems?.find(
                  (item) => item.itemType === "important_matters_report",
                )?.updatedAt
              }
              updatedByUser={
                property?.documentItems?.find(
                  (item) => item.itemType === "important_matters_report",
                )?.updatedByUser
              }
              required={true}
            />
            <BadgeSelectForm
              form={form}
              name="documentItem_management_rules"
              label="管理規約"
              options={documentItemStatus.map((status) => ({
                value: status,
                label: DOCUMENT_ITEM_STATUS_LABELS[status],
                color: DOCUMENT_ITEM_STATUS_COLORS[status],
              }))}
              updatedAt={
                property?.documentItems?.find(
                  (item) => item.itemType === "management_rules",
                )?.updatedAt
              }
              updatedByUser={
                property?.documentItems?.find(
                  (item) => item.itemType === "management_rules",
                )?.updatedByUser
              }
              required={true}
            />
            <BadgeSelectForm
              form={form}
              name="documentItem_long_term_repair_plan"
              label="長期修繕計画書"
              options={documentItemStatus.map((status) => ({
                value: status,
                label: DOCUMENT_ITEM_STATUS_LABELS[status],
                color: DOCUMENT_ITEM_STATUS_COLORS[status],
              }))}
              updatedAt={
                property?.documentItems?.find(
                  (item) => item.itemType === "long_term_repair_plan",
                )?.updatedAt
              }
              updatedByUser={
                property?.documentItems?.find(
                  (item) => item.itemType === "long_term_repair_plan",
                )?.updatedByUser
              }
              required={true}
            />
            <BadgeSelectForm
              form={form}
              name="documentItem_general_meeting_minutes"
              label="総会議事録"
              options={documentItemStatus.map((status) => ({
                value: status,
                label: DOCUMENT_ITEM_STATUS_LABELS[status],
                color: DOCUMENT_ITEM_STATUS_COLORS[status],
              }))}
              updatedAt={
                property?.documentItems?.find(
                  (item) => item.itemType === "general_meeting_minutes",
                )?.updatedAt
              }
              updatedByUser={
                property?.documentItems?.find(
                  (item) => item.itemType === "general_meeting_minutes",
                )?.updatedByUser
              }
              required={true}
            />
            <BadgeSelectForm
              form={form}
              name="documentItem_pamphlet"
              label="パンフレット"
              options={documentItemStatus.map((status) => ({
                value: status,
                label: DOCUMENT_ITEM_STATUS_LABELS[status],
                color: DOCUMENT_ITEM_STATUS_COLORS[status],
              }))}
              updatedAt={
                property?.documentItems?.find(
                  (item) => item.itemType === "pamphlet",
                )?.updatedAt
              }
              updatedByUser={
                property?.documentItems?.find(
                  (item) => item.itemType === "pamphlet",
                )?.updatedByUser
              }
              required={true}
            />
            <BadgeSelectForm
              form={form}
              name="documentItem_bank_transfer_form"
              label="口座振替用紙"
              options={documentItemStatus.map((status) => ({
                value: status,
                label: DOCUMENT_ITEM_STATUS_LABELS[status],
                color: DOCUMENT_ITEM_STATUS_COLORS[status],
              }))}
              updatedAt={
                property?.documentItems?.find(
                  (item) => item.itemType === "bank_transfer_form",
                )?.updatedAt
              }
              updatedByUser={
                property?.documentItems?.find(
                  (item) => item.itemType === "bank_transfer_form",
                )?.updatedByUser
              }
              required={true}
            />
            <BadgeSelectForm
              form={form}
              name="documentItem_owner_change_notification"
              label="所有者変更届"
              options={documentItemStatus.map((status) => ({
                value: status,
                label: DOCUMENT_ITEM_STATUS_LABELS[status],
                color: DOCUMENT_ITEM_STATUS_COLORS[status],
              }))}
              updatedAt={
                property?.documentItems?.find(
                  (item) => item.itemType === "owner_change_notification",
                )?.updatedAt
              }
              updatedByUser={
                property?.documentItems?.find(
                  (item) => item.itemType === "owner_change_notification",
                )?.updatedByUser
              }
              required={true}
            />
          </div>
        </SectionCard>

        {/* 役所書類 */}
        <SectionCard title="役所書類">
          <div className="space-y-4 w-full">
            <BadgeSelectForm
              form={form}
              name="documentItem_tax_certificate"
              label="公課証明"
              options={documentItemStatus.map((status) => ({
                value: status,
                label: DOCUMENT_ITEM_STATUS_LABELS[status],
                color: DOCUMENT_ITEM_STATUS_COLORS[status],
              }))}
              updatedAt={
                property?.documentItems?.find(
                  (item) => item.itemType === "tax_certificate",
                )?.updatedAt
              }
              updatedByUser={
                property?.documentItems?.find(
                  (item) => item.itemType === "tax_certificate",
                )?.updatedByUser
              }
              required={true}
            />
            <BadgeSelectForm
              form={form}
              name="documentItem_building_plan_overview"
              label="建築計画概要書"
              options={documentItemStatus.map((status) => ({
                value: status,
                label: DOCUMENT_ITEM_STATUS_LABELS[status],
                color: DOCUMENT_ITEM_STATUS_COLORS[status],
              }))}
              updatedAt={
                property?.documentItems?.find(
                  (item) => item.itemType === "building_plan_overview",
                )?.updatedAt
              }
              updatedByUser={
                property?.documentItems?.find(
                  (item) => item.itemType === "building_plan_overview",
                )?.updatedByUser
              }
              required={true}
            />
            <BadgeSelectForm
              form={form}
              name="documentItem_ledger_certificate"
              label="台帳記載事項証明書"
              options={documentItemStatus.map((status) => ({
                value: status,
                label: DOCUMENT_ITEM_STATUS_LABELS[status],
                color: DOCUMENT_ITEM_STATUS_COLORS[status],
              }))}
              updatedAt={
                property?.documentItems?.find(
                  (item) => item.itemType === "ledger_certificate",
                )?.updatedAt
              }
              updatedByUser={
                property?.documentItems?.find(
                  (item) => item.itemType === "ledger_certificate",
                )?.updatedByUser
              }
              required={true}
            />
            <BadgeSelectForm
              form={form}
              name="documentItem_zoning_district"
              label="用途地域"
              options={documentItemStatus.map((status) => ({
                value: status,
                label: DOCUMENT_ITEM_STATUS_LABELS[status],
                color: DOCUMENT_ITEM_STATUS_COLORS[status],
              }))}
              updatedAt={
                property?.documentItems?.find(
                  (item) => item.itemType === "zoning_district",
                )?.updatedAt
              }
              updatedByUser={
                property?.documentItems?.find(
                  (item) => item.itemType === "zoning_district",
                )?.updatedByUser
              }
              required={true}
            />
            <BadgeSelectForm
              form={form}
              name="documentItem_road_ledger"
              label="道路台帳"
              options={documentItemStatus.map((status) => ({
                value: status,
                label: DOCUMENT_ITEM_STATUS_LABELS[status],
                color: DOCUMENT_ITEM_STATUS_COLORS[status],
              }))}
              updatedAt={
                property?.documentItems?.find(
                  (item) => item.itemType === "road_ledger",
                )?.updatedAt
              }
              updatedByUser={
                property?.documentItems?.find(
                  (item) => item.itemType === "road_ledger",
                )?.updatedByUser
              }
              required={true}
            />
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
