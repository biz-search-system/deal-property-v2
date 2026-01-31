"use client";

import {
  bcSettlementStatus,
  abSettlementStatus,
  mortgageCancellation,
  identityVerificationMethod,
  identityVerificationCall,
  identityVerificationStatus,
  sellerFundingStatus,
  subleaseSuccession,
  rentalContractAndKey,
  guaranteeCompanySuccession,
} from "@workspace/drizzle/types";
import {
  BC_SETTLEMENT_STATUS_LABELS,
  BC_SETTLEMENT_STATUS_COLORS,
  AB_SETTLEMENT_STATUS_LABELS,
  AB_SETTLEMENT_STATUS_COLORS,
  MORTGAGE_CANCELLATION_LABELS,
  MORTGAGE_CANCELLATION_COLORS,
  IDENTITY_VERIFICATION_METHOD_LABELS,
  IDENTITY_VERIFICATION_METHOD_COLORS,
  IDENTITY_VERIFICATION_CALL_LABELS,
  IDENTITY_VERIFICATION_CALL_COLORS,
  IDENTITY_VERIFICATION_STATUS_LABELS,
  IDENTITY_VERIFICATION_STATUS_COLORS,
  SELLER_FUNDING_STATUS_LABELS,
  SELLER_FUNDING_STATUS_COLORS,
  SUBLEASE_SUCCESSION_LABELS,
  SUBLEASE_SUCCESSION_COLORS,
  RENTAL_CONTRACT_AND_KEY_LABELS,
  RENTAL_CONTRACT_AND_KEY_COLORS,
  GUARANTEE_COMPANY_SUCCESSION_LABELS,
  GUARANTEE_COMPANY_SUCCESSION_COLORS,
} from "@workspace/utils";
import BadgeSelectForm from "../form/badge-select-form";
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
        {/* 左側 */}
        <div className="space-y-3">
          {/* 精算書関係 */}
          <SectionCard title="精算書関係">
            <div className="space-y-3 w-full">
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
            <div className="space-y-2 w-full">
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
              <CheckboxForm
                form={form}
                name="propertyTitle"
                label="権利証"
                updatedAt={settlementProgress?.propertyTitleAt}
                updatedByUser={settlementProgress?.propertyTitleByUser}
              />
              <CheckboxForm
                form={form}
                name="addressChange"
                label="住所変更"
                updatedAt={settlementProgress?.addressChangeAt}
                updatedByUser={settlementProgress?.addressChangeByUser}
              />
              <CheckboxForm
                form={form}
                name="nameChange"
                label="氏名変更"
                updatedAt={settlementProgress?.nameChangeAt}
                updatedByUser={settlementProgress?.nameChangeByUser}
              />
              <BadgeSelectForm
                form={form}
                name="identityVerificationMethod"
                label="本人確認方法"
                placeholder="選択してください"
                options={identityVerificationMethod.map((method) => ({
                  value: method,
                  label: IDENTITY_VERIFICATION_METHOD_LABELS[method],
                  color: IDENTITY_VERIFICATION_METHOD_COLORS[method],
                }))}
                updatedAt={settlementProgress?.identityVerificationMethodAt}
                updatedByUser={
                  settlementProgress?.identityVerificationMethodByUser
                }
              />
              <BadgeSelectForm
                form={form}
                name="identityVerificationCall"
                label="本人確認電話"
                placeholder="選択してください"
                options={identityVerificationCall.map((status) => ({
                  value: status,
                  label: IDENTITY_VERIFICATION_CALL_LABELS[status],
                  color: IDENTITY_VERIFICATION_CALL_COLORS[status],
                }))}
                updatedAt={settlementProgress?.identityVerificationCallAt}
                updatedByUser={
                  settlementProgress?.identityVerificationCallByUser
                }
              />
              <DatePickerForm
                form={form}
                name="identityVerificationCallSchedule"
                label="本人確認電話日時"
                updatedAt={
                  settlementProgress?.identityVerificationCallScheduleAt
                }
                updatedByUser={
                  settlementProgress?.identityVerificationCallScheduleByUser
                }
              />
              <BadgeSelectForm
                form={form}
                name="identityVerificationStatus"
                label="本人確認"
                placeholder="選択してください"
                options={identityVerificationStatus.map((status) => ({
                  value: status,
                  label: IDENTITY_VERIFICATION_STATUS_LABELS[status],
                  color: IDENTITY_VERIFICATION_STATUS_COLORS[status],
                }))}
                updatedAt={settlementProgress?.identityVerificationStatusAt}
                updatedByUser={
                  settlementProgress?.identityVerificationStatusByUser
                }
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
              <BadgeSelectForm
                form={form}
                name="subleaseSuccession"
                label="サブリース承継"
                placeholder="選択してください"
                options={subleaseSuccession.map((status) => ({
                  value: status,
                  label: SUBLEASE_SUCCESSION_LABELS[status],
                  color: SUBLEASE_SUCCESSION_COLORS[status],
                }))}
                updatedAt={settlementProgress?.subleaseSuccessionAt}
                updatedByUser={settlementProgress?.subleaseSuccessionByUser}
              />
              <BadgeSelectForm
                form={form}
                name="rentalContractAndKey"
                label="賃契原本＆鍵"
                placeholder="選択してください"
                options={rentalContractAndKey.map((status) => ({
                  value: status,
                  label: RENTAL_CONTRACT_AND_KEY_LABELS[status],
                  color: RENTAL_CONTRACT_AND_KEY_COLORS[status],
                }))}
                updatedAt={settlementProgress?.rentalContractAndKeyAt}
                updatedByUser={settlementProgress?.rentalContractAndKeyByUser}
              />
              <BadgeSelectForm
                form={form}
                name="guaranteeCompanySuccession"
                label="保証会社承継"
                placeholder="選択してください"
                options={guaranteeCompanySuccession.map((status) => ({
                  value: status,
                  label: GUARANTEE_COMPANY_SUCCESSION_LABELS[status],
                  color: GUARANTEE_COMPANY_SUCCESSION_COLORS[status],
                }))}
                updatedAt={settlementProgress?.guaranteeCompanySuccessionAt}
                updatedByUser={
                  settlementProgress?.guaranteeCompanySuccessionByUser
                }
              />
            </div>
          </SectionCard>
        </div>

        {/* 右側 */}
        <div className="space-y-3">
          {/* 銀行関係 */}
          <SectionCard title="銀行関係">
            <div className="space-y-2 w-full">
              <BadgeSelectForm
                form={form}
                name="mortgageCancellation"
                label="抵当権抹消"
                placeholder="選択してください"
                options={mortgageCancellation.map((status) => ({
                  value: status,
                  label: MORTGAGE_CANCELLATION_LABELS[status],
                  color: MORTGAGE_CANCELLATION_COLORS[status],
                }))}
                className="pb-2"
                updatedAt={settlementProgress?.mortgageCancellationAt}
                updatedByUser={settlementProgress?.mortgageCancellationByUser}
              />
              <CheckboxForm
                form={form}
                name="loanCalculationSaved"
                label="ローン計算書保存"
                updatedAt={settlementProgress?.loanCalculationSavedAt}
                updatedByUser={settlementProgress?.loanCalculationSavedByUser}
              />
            </div>
          </SectionCard>

          {/* 手出し関係 */}
          <SectionCard title="手出し関係">
            <div className="space-y-2 w-full">
              <BadgeSelectForm
                form={form}
                name="sellerFundingStatus"
                label="手出し状況"
                placeholder="選択してください"
                options={sellerFundingStatus.map((status) => ({
                  value: status,
                  label: SELLER_FUNDING_STATUS_LABELS[status],
                  color: SELLER_FUNDING_STATUS_COLORS[status],
                }))}
                updatedAt={settlementProgress?.sellerFundingStatusAt}
                updatedByUser={settlementProgress?.sellerFundingStatusByUser}
              />
            </div>
          </SectionCard>

          {/* 口座関係 */}
          <BankAccountFormCard propertyId={property?.id} />
        </div>
      </div>
    </div>
  );
}
