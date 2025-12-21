import { Badge } from "@workspace/ui/components/badge";
import { Separator } from "@workspace/ui/components/separator";
import { Building2, Calendar, DollarSign, FileText, Users } from "lucide-react";
import {
  formatDateWithDay,
  PROGRESS_STATUS_LABELS,
  DOCUMENT_STATUS_LABELS,
  CONTRACT_TYPE_LABELS,
  COMPANY_B_LABELS,
  BROKER_COMPANY_LABELS,
  ACCOUNT_COMPANY_LABELS,
  BANK_ACCOUNT_LABELS,
  cn,
  PROGRESS_STATUS_COLORS,
  DOCUMENT_STATUS_COLORS,
} from "@workspace/utils";
import type { PropertyDetail } from "@/lib/types/property";
import { ProgressCheckItem } from "./progress-check-item";

interface PropertyDetailViewProps {
  property: NonNullable<PropertyDetail>;
}

/** 金額を円単位でフォーマット */
function formatCurrency(value: number | null | undefined): string {
  if (value == null) return "-";
  return `${value.toLocaleString()}円`;
}

export function PropertyDetailView({ property }: PropertyDetailViewProps) {
  return (
    <div className="container max-w-6xl mx-auto px-6 py-8">
      {/* ヘッダー */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold mb-2">
            {property.propertyName}
          </h1>
          <div className="flex gap-2">
            <Badge
              variant="outline"
              className={cn(PROGRESS_STATUS_COLORS[property.progressStatus])}
            >
              {property.progressStatus
                ? PROGRESS_STATUS_LABELS[property.progressStatus]
                : "-"}
            </Badge>
            <Badge
              variant="outline"
              className={cn(DOCUMENT_STATUS_COLORS[property.documentStatus])}
            >
              {property.documentStatus
                ? DOCUMENT_STATUS_LABELS[property.documentStatus]
                : "-"}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-4 text-muted-foreground">
          <span className="text-lg">{property.roomNumber}</span>
          <Separator orientation="vertical" className="h-4" />
          <span>オーナー: {property.ownerName}</span>
        </div>
      </div>

      {/* 担当者 */}
      <div className="mb-4 flex items-center gap-2">
        <Users className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">担当:</span>
        <div className="flex gap-2">
          {property.staff
            ?.filter((staffMember) => staffMember.user !== null)
            .map((staffMember) => (
              <Badge key={staffMember.user!.id} variant="secondary">
                {staffMember.user!.name}
              </Badge>
            ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 左側エリア（メイン情報） */}
        <div className="lg:col-span-2 space-y-8">
          {/* 金額情報 */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-xl font-semibold">金額情報</h2>
            </div>
            <div className="rounded-lg border bg-card">
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      入口金額（A金額）
                    </div>
                    <div className="text-2xl font-semibold">
                      {formatCurrency(property.amountA)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      出口金額
                    </div>
                    <div className="text-2xl font-semibold">
                      {formatCurrency(property.amountExit)}
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      仲介手数料
                    </div>
                    <div className="text-lg font-medium">
                      {formatCurrency(property.commission)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      BC手付
                    </div>
                    <div className="text-lg font-medium">
                      {formatCurrency(property.bcDeposit)}
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">利益見込み</div>
                    <div className="text-3xl font-bold text-green-600">
                      {formatCurrency(property.profit)}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    出口金額 - 入口金額 + 仲介手数料
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 契約スケジュール */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-xl font-semibold">契約スケジュール</h2>
            </div>
            <div className="rounded-lg border bg-card">
              <div className="p-6 space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">
                    A契約日（AB契約日）
                  </div>
                  <div className="text-lg font-medium">
                    {formatDateWithDay(property.contractDateA)}
                  </div>
                </div>
                <Separator />
                <div>
                  <div className="text-sm text-muted-foreground mb-1">
                    BC契約日
                  </div>
                  <div className="text-lg font-medium">
                    {formatDateWithDay(property.contractDateBc)}
                  </div>
                </div>
                <Separator />
                <div>
                  <div className="text-sm text-muted-foreground mb-1">
                    決済予定日
                  </div>
                  <div className="text-lg font-medium">
                    {formatDateWithDay(property.settlementDate)}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 契約進捗 */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-xl font-semibold">契約進捗</h2>
            </div>
            <div className="space-y-4">
              <div className="rounded-lg border bg-card">
                <div className="p-4 border-b bg-muted/30">
                  <h3 className="font-medium">AB関係</h3>
                </div>
                <div className="p-4 space-y-3">
                  <ProgressCheckItem
                    label="契約書 保存完了"
                    checked={
                      property.contractProgress?.abContractSaved || false
                    }
                    date={property.contractProgress?.abContractSavedAt}
                    user={property.contractProgress?.abContractSavedByUser}
                  />
                  <ProgressCheckItem
                    label="委任状関係 保存完了"
                    checked={
                      property.contractProgress?.abAuthorizationSaved || false
                    }
                    date={property.contractProgress?.abAuthorizationSavedAt}
                    user={property.contractProgress?.abAuthorizationSavedByUser}
                  />
                  <ProgressCheckItem
                    label="売主身分証 保存完了"
                    checked={
                      property.contractProgress?.abSellerIdSaved || false
                    }
                    date={property.contractProgress?.abSellerIdSavedAt}
                    user={property.contractProgress?.abSellerIdSavedByUser}
                  />
                </div>
              </div>

              <div className="rounded-lg border bg-card">
                <div className="p-4 border-b bg-muted/30">
                  <h3 className="font-medium">BC関係</h3>
                </div>
                <div className="p-4 space-y-3">
                  <ProgressCheckItem
                    label="BC売契作成"
                    checked={
                      property.contractProgress?.bcContractCreated || false
                    }
                    date={property.contractProgress?.bcContractCreatedAt}
                    user={property.contractProgress?.bcContractCreatedByUser}
                  />
                  <ProgressCheckItem
                    label="重説作成"
                    checked={
                      property.contractProgress?.bcDescriptionCreated || false
                    }
                    date={property.contractProgress?.bcDescriptionCreatedAt}
                    user={property.contractProgress?.bcDescriptionCreatedByUser}
                  />
                  <ProgressCheckItem
                    label="BC売契送付"
                    checked={property.contractProgress?.bcContractSent || false}
                    date={property.contractProgress?.bcContractSentAt}
                    user={property.contractProgress?.bcContractSentByUser}
                  />
                  <ProgressCheckItem
                    label="重説送付"
                    checked={
                      property.contractProgress?.bcDescriptionSent || false
                    }
                    date={property.contractProgress?.bcDescriptionSentAt}
                    user={property.contractProgress?.bcDescriptionSentByUser}
                  />
                  <ProgressCheckItem
                    label="BC売契CB完了"
                    checked={
                      property.contractProgress?.bcContractCbDone || false
                    }
                    date={property.contractProgress?.bcContractCbDoneAt}
                    user={property.contractProgress?.bcContractCbDoneByUser}
                  />
                  <ProgressCheckItem
                    label="重説CB完了"
                    checked={
                      property.contractProgress?.bcDescriptionCbDone || false
                    }
                    date={property.contractProgress?.bcDescriptionCbDoneAt}
                    user={property.contractProgress?.bcDescriptionCbDoneByUser}
                  />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* 右側エリア（補足情報） */}
        <div className="space-y-8">
          {/* 関係者情報 */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-xl font-semibold">関係者</h2>
            </div>
            <div className="rounded-lg border bg-card">
              <div className="p-6 space-y-4">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">
                    契約形態
                  </div>
                  <div className="font-medium">
                    {property.contractType
                      ? CONTRACT_TYPE_LABELS[property.contractType]
                      : "-"}
                  </div>
                </div>
                <Separator />
                <div>
                  <div className="text-xs text-muted-foreground mb-1">
                    買取業者
                  </div>
                  <div className="font-medium">
                    {property.buyerCompany || "-"}
                  </div>
                </div>
                <Separator />
                <div>
                  <div className="text-xs text-muted-foreground mb-1">
                    B会社
                  </div>
                  <div className="font-medium">
                    {property.companyB
                      ? COMPANY_B_LABELS[property.companyB]
                      : "-"}
                  </div>
                </div>
                <Separator />
                <div>
                  <div className="text-xs text-muted-foreground mb-1">
                    仲介会社
                  </div>
                  <div className="font-medium">
                    {property.brokerCompany
                      ? BROKER_COMPANY_LABELS[property.brokerCompany]
                      : "-"}
                  </div>
                </div>
                <Separator />
                <div>
                  <div className="text-xs text-muted-foreground mb-1">
                    抵当銀行
                  </div>
                  <div className="font-medium">
                    {property.mortgageBank || "-"}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 口座情報 */}
          <section>
            <h3 className="text-lg font-semibold mb-4">口座情報</h3>
            <div className="rounded-lg border bg-card">
              <div className="p-6 space-y-4">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">
                    使用口座会社
                  </div>
                  <div className="font-medium">
                    {property.accountCompany
                      ? ACCOUNT_COMPANY_LABELS[property.accountCompany]
                      : "-"}
                  </div>
                </div>
                <Separator />
                <div>
                  <div className="text-xs text-muted-foreground mb-1">
                    使用銀行口座
                  </div>
                  <div className="font-medium">
                    {property.bankAccount
                      ? BANK_ACCOUNT_LABELS[property.bankAccount]
                      : "-"}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* その他 */}
          <section>
            <h3 className="text-lg font-semibold mb-4">その他</h3>
            <div className="rounded-lg border bg-card">
              <div className="p-6 space-y-4">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">
                    名簿種別
                  </div>
                  <div className="font-medium">{property.listType || "-"}</div>
                </div>
                {property.notes && (
                  <>
                    <Separator />
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">
                        備考
                      </div>
                      <div className="text-sm leading-relaxed">
                        {property.notes}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
