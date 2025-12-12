"use client";

import { progressStatus } from "@workspace/drizzle/schemas";
import {
  PROGRESS_STATUS_COLORS,
  PROGRESS_STATUS_LABELS,
} from "@workspace/utils";
import BadgeSelectForm from "../form/badge-select-form";
import CheckboxForm from "../form/checkbox-form";
import DatePickerForm from "../form/date-picker-form";
import SelectForm from "../form/select-form";
import { usePropertyForm } from "../property-form-provider";
import SectionCard from "../section-card";
import { usePropertyOptional } from "../property-provider";

export default function ContractProgressTab() {
  const property = usePropertyOptional();
  const contractProgress = property?.contractProgress;
  const form = usePropertyForm();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <SectionCard title="業務進捗">
        <div className="space-y-4 w-full">
          <SelectForm
            form={form}
            name="maisokuDistribution"
            label="マイソク配布"
            options={[
              { value: "not_distributed", label: "未配布" },
              { value: "distributed", label: "配布済" },
            ]}
            updatedAt={contractProgress?.maisokuDistributionAt}
            updatedByUser={contractProgress?.maisokuDistributionByUser}
          />
          <BadgeSelectForm
            form={form}
            name="progressStatus"
            label="進捗"
            options={progressStatus.map((type) => ({
              value: type,
              label: PROGRESS_STATUS_LABELS[type],
              color: PROGRESS_STATUS_COLORS[type],
            }))}
            updatedAt={property?.progressStatusUpdatedAt}
            updatedByUser={property?.progressStatusUpdatedByUser}
          />
        </div>
      </SectionCard>

      <SectionCard title="AB関係">
        <div className="space-y-1 w-full">
          <CheckboxForm
            form={form}
            name="abContractSaved"
            label="契約書 保存完了"
            updatedAt={contractProgress?.abContractSavedAt}
            updatedByUser={contractProgress?.abContractSavedByUser}
          />
          <CheckboxForm
            form={form}
            name="abAuthorizationSaved"
            label="委任状関係 保存完了"
            updatedAt={contractProgress?.abAuthorizationSavedAt}
            updatedByUser={contractProgress?.abAuthorizationSavedByUser}
          />
          <CheckboxForm
            form={form}
            name="abSellerIdSaved"
            label="売主身分証 保存完了"
            updatedAt={contractProgress?.abSellerIdSavedAt}
            updatedByUser={contractProgress?.abSellerIdSavedByUser}
          />
        </div>
      </SectionCard>

      <SectionCard title="スケジュール">
        <div className="space-y-4 w-full">
          <DatePickerForm
            form={form}
            name="contractDateA"
            label="A契約日"
            updatedAt={property?.contractDateAUpdatedAt}
            updatedByUser={property?.contractDateAUpdatedByUser}
          />
          <DatePickerForm
            form={form}
            name="contractDateBc"
            label="BC契約日"
            updatedAt={property?.contractDateBcUpdatedAt}
            updatedByUser={property?.contractDateBcUpdatedByUser}
          />
          <DatePickerForm
            form={form}
            name="settlementDate"
            label="決済日"
            updatedAt={property?.settlementDateUpdatedAt}
            updatedByUser={property?.settlementDateUpdatedByUser}
          />
        </div>
      </SectionCard>

      <SectionCard title="BC関係">
        <div className="space-y-1 w-full">
          <CheckboxForm
            form={form}
            name="bcContractCreated"
            label="BC売契作成"
            updatedAt={contractProgress?.bcContractCreatedAt}
            updatedByUser={contractProgress?.bcContractCreatedByUser}
          />
          <CheckboxForm
            form={form}
            name="bcDescriptionCreated"
            label="重説作成"
            updatedAt={contractProgress?.bcDescriptionCreatedAt}
            updatedByUser={contractProgress?.bcDescriptionCreatedByUser}
          />
          <CheckboxForm
            form={form}
            name="bcContractSent"
            label="BC売契送付"
            updatedAt={contractProgress?.bcContractSentAt}
            updatedByUser={contractProgress?.bcContractSentByUser}
          />
          <CheckboxForm
            form={form}
            name="bcDescriptionSent"
            label="重説送付"
            updatedAt={contractProgress?.bcDescriptionSentAt}
            updatedByUser={contractProgress?.bcDescriptionSentByUser}
          />
          <CheckboxForm
            form={form}
            name="bcContractCbDone"
            label="BC売契CB完了"
            updatedAt={contractProgress?.bcContractCbDoneAt}
            updatedByUser={contractProgress?.bcContractCbDoneByUser}
          />
          <CheckboxForm
            form={form}
            name="bcDescriptionCbDone"
            label="重説CB完了"
            updatedAt={contractProgress?.bcDescriptionCbDoneAt}
            updatedByUser={contractProgress?.bcDescriptionCbDoneByUser}
          />
        </div>
      </SectionCard>
    </div>
  );
}
