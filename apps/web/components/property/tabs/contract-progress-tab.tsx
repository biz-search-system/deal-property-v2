"use client";

import { progressStatus } from "@workspace/drizzle/schemas";
import { FormField } from "@workspace/ui/components/form";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Label } from "@workspace/ui/components/label";
import {
  PROGRESS_STATUS_COLORS,
  PROGRESS_STATUS_LABELS,
} from "@workspace/utils";
import BadgeSelectForm from "../form/badge-select-form";
import DatePickerForm from "../form/date-picker-form";
import SelectForm from "../form/select-form";
import { usePropertyForm } from "../property-form-provider";
import SectionCard from "../section-card";
import { UserActionBadge } from "../user-action-badge";
import { useProperty } from "../property-provider";

export default function ContractProgressTab() {
  const property = useProperty();
  const contractProgress = property.contractProgress;
  const form = usePropertyForm();
  const { control } = form;

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
            updatedAt={property.progressStatusUpdatedAt}
            updatedByUser={property.progressStatusUpdatedByUser}
          />
        </div>
      </SectionCard>

      <SectionCard title="AB関係">
        <div className="space-y-1 w-full">
          <FormField
            control={control}
            name="abContractSaved"
            render={({ field }) => (
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={field.value ?? false}
                    onCheckedChange={field.onChange}
                  />
                  <Label className="cursor-pointer">契約書 保存完了</Label>
                </div>
                {contractProgress?.abContractSavedAt && (
                  <UserActionBadge
                    timestamp={contractProgress.abContractSavedAt}
                    user={contractProgress.abContractSavedByUser}
                  />
                )}
              </div>
            )}
          />
          <FormField
            control={control}
            name="abAuthorizationSaved"
            render={({ field }) => (
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={field.value ?? false}
                    onCheckedChange={field.onChange}
                  />
                  <Label className="cursor-pointer">委任状関係 保存完了</Label>
                </div>
                {contractProgress?.abAuthorizationSavedAt && (
                  <UserActionBadge
                    timestamp={contractProgress.abAuthorizationSavedAt}
                    user={contractProgress.abAuthorizationSavedByUser}
                  />
                )}
              </div>
            )}
          />
          <FormField
            control={control}
            name="abSellerIdSaved"
            render={({ field }) => (
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={field.value ?? false}
                    onCheckedChange={field.onChange}
                  />
                  <Label className="cursor-pointer">売主身分証 保存完了</Label>
                </div>
                {contractProgress?.abSellerIdSavedAt && (
                  <UserActionBadge
                    timestamp={contractProgress.abSellerIdSavedAt}
                    user={contractProgress.abSellerIdSavedByUser}
                  />
                )}
              </div>
            )}
          />
        </div>
      </SectionCard>

      <SectionCard title="スケジュール">
        <div className="space-y-4 w-full">
          <DatePickerForm
            form={form}
            name="contractDateA"
            label="A契約日"
            updatedAt={property.contractDateAUpdatedAt}
            updatedByUser={property.contractDateAUpdatedByUser}
          />
          <DatePickerForm
            form={form}
            name="contractDateBc"
            label="BC契約日"
            updatedAt={property.contractDateBcUpdatedAt}
            updatedByUser={property.contractDateBcUpdatedByUser}
          />
          <DatePickerForm
            form={form}
            name="settlementDate"
            label="決済日"
            updatedAt={property.settlementDateUpdatedAt}
            updatedByUser={property.settlementDateUpdatedByUser}
          />
        </div>
      </SectionCard>

      <SectionCard title="BC関係">
        <div className="space-y-1 w-full">
          <FormField
            control={control}
            name="bcContractCreated"
            render={({ field }) => (
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={field.value ?? false}
                    onCheckedChange={field.onChange}
                  />
                  <Label className="cursor-pointer">BC売契作成</Label>
                </div>
                {contractProgress?.bcContractCreatedAt && (
                  <UserActionBadge
                    timestamp={contractProgress.bcContractCreatedAt}
                    user={contractProgress.bcContractCreatedByUser}
                  />
                )}
              </div>
            )}
          />
          <FormField
            control={control}
            name="bcDescriptionCreated"
            render={({ field }) => (
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={field.value ?? false}
                    onCheckedChange={field.onChange}
                  />
                  <Label className="cursor-pointer">重説作成</Label>
                </div>
                {contractProgress?.bcDescriptionCreatedAt && (
                  <UserActionBadge
                    timestamp={contractProgress.bcDescriptionCreatedAt}
                    user={contractProgress.bcDescriptionCreatedByUser}
                  />
                )}
              </div>
            )}
          />
          <FormField
            control={control}
            name="bcContractSent"
            render={({ field }) => (
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={field.value ?? false}
                    onCheckedChange={field.onChange}
                  />
                  <Label className="cursor-pointer">BC売契送付</Label>
                </div>
                {contractProgress?.bcContractSentAt && (
                  <UserActionBadge
                    timestamp={contractProgress.bcContractSentAt}
                    user={contractProgress.bcContractSentByUser}
                  />
                )}
              </div>
            )}
          />
          <FormField
            control={control}
            name="bcDescriptionSent"
            render={({ field }) => (
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={field.value ?? false}
                    onCheckedChange={field.onChange}
                  />
                  <Label className="cursor-pointer">重説送付</Label>
                </div>
                {contractProgress?.bcDescriptionSentAt && (
                  <UserActionBadge
                    timestamp={contractProgress.bcDescriptionSentAt}
                    user={contractProgress.bcDescriptionSentByUser}
                  />
                )}
              </div>
            )}
          />
          <FormField
            control={control}
            name="bcContractCbDone"
            render={({ field }) => (
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={field.value ?? false}
                    onCheckedChange={field.onChange}
                  />
                  <Label className="cursor-pointer">BC売契CB完了</Label>
                </div>
                {contractProgress?.bcContractCbDoneAt && (
                  <UserActionBadge
                    timestamp={contractProgress.bcContractCbDoneAt}
                    user={contractProgress.bcContractCbDoneByUser}
                  />
                )}
              </div>
            )}
          />
          <FormField
            control={control}
            name="bcDescriptionCbDone"
            render={({ field }) => (
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={field.value ?? false}
                    onCheckedChange={field.onChange}
                  />
                  <Label className="cursor-pointer">重説CB完了</Label>
                </div>
                {contractProgress?.bcDescriptionCbDoneAt && (
                  <UserActionBadge
                    timestamp={contractProgress.bcDescriptionCbDoneAt}
                    user={contractProgress.bcDescriptionCbDoneByUser}
                  />
                )}
              </div>
            )}
          />
        </div>
      </SectionCard>
    </div>
  );
}
