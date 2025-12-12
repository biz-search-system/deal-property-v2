"use client";

import {
  bcSettlementStatus,
  abSettlementStatus,
} from "@workspace/drizzle/types";
import {
  BC_SETTLEMENT_STATUS_LABELS,
  BC_SETTLEMENT_STATUS_COLORS,
  AB_SETTLEMENT_STATUS_LABELS,
  AB_SETTLEMENT_STATUS_COLORS,
} from "@workspace/utils";
import BadgeToggleForm from "../form/badge-toggle-form";
import CheckboxForm from "../form/checkbox-form";
import SectionCard from "../section-card";
import { usePropertyOptional } from "../property-provider";
import { usePropertyForm } from "../property-form-provider";
import { BankAccountFormCard } from "../bank-account-form-card";
import DatePickerForm from "../form/date-picker-form";

export default function SettlementProgressTab() {
  const property = usePropertyOptional();
  const settlementProgress = property?.settlementProgress;
  const form = usePropertyForm();

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* 左側: 決済進捗 */}
        <div className="space-y-3">
          {/* 精算書関係 */}
          <SectionCard title="精算書関係">
            <div className="space-y-1 w-full">
              <BadgeToggleForm
                form={form}
                name="bcSettlementStatus"
                label="BC精算書"
                options={bcSettlementStatus.map((status) => ({
                  value: status,
                  label: BC_SETTLEMENT_STATUS_LABELS[status],
                  color: BC_SETTLEMENT_STATUS_COLORS[status],
                }))}
                updatedAt={settlementProgress?.bcSettlementStatusAt}
                updatedByUser={settlementProgress?.bcSettlementStatusByUser}
              />
              <BadgeToggleForm
                form={form}
                name="abSettlementStatus"
                label="AB精算書"
                options={abSettlementStatus.map((status) => ({
                  value: status,
                  label: AB_SETTLEMENT_STATUS_LABELS[status],
                  color: AB_SETTLEMENT_STATUS_COLORS[status],
                }))}
                updatedAt={settlementProgress?.abSettlementStatusAt}
                updatedByUser={settlementProgress?.abSettlementStatusByUser}
              />
            </div>
          </SectionCard>

          {/* 司法書士関係 */}
          <SectionCard title="司法書士関係">
            <div className="space-y-1 w-full">
              <CheckboxForm
                form={form}
                name="lawyerRequested"
                label="司法書士依頼"
                updatedAt={settlementProgress?.lawyerRequestedAt}
                updatedByUser={settlementProgress?.lawyerRequestedByUser}
              />
              <CheckboxForm
                form={form}
                name="documentsShared"
                label="必要書類共有"
                updatedAt={settlementProgress?.documentsSharedAt}
                updatedByUser={settlementProgress?.documentsSharedByUser}
              />
            </div>
          </SectionCard>

          {/* 賃貸管理関係 */}
          <SectionCard title="賃貸管理関係">
            <div className="space-y-2 w-full">
              <DatePickerForm
                form={form}
                name="managementCancelScheduledMonth"
                label="管理解約予定月"
                updatedAt={settlementProgress?.managementCancelScheduledMonthAt}
                updatedByUser={
                  settlementProgress?.managementCancelScheduledMonthByUser
                }
              />
              <DatePickerForm
                form={form}
                name="managementCancelRequestedDate"
                label="管理解約依頼日"
                updatedAt={settlementProgress?.managementCancelRequestedDateAt}
                updatedByUser={
                  settlementProgress?.managementCancelRequestedDateByUser
                }
              />
              <DatePickerForm
                form={form}
                name="managementCancelCompletedDate"
                label="管理解約完了日"
                updatedAt={settlementProgress?.managementCancelCompletedDateAt}
                updatedByUser={
                  settlementProgress?.managementCancelCompletedDateByUser
                }
              />
            </div>
          </SectionCard>
        </div>

        {/* 右側: 口座関係 */}
        <div className="space-y-3">
          <BankAccountFormCard propertyId={property?.id} />
        </div>
      </div>
    </div>
  );
}
