import { BreadcrumbConfig } from "@/components/breadcrumb-provider";
import { getPropertyById } from "@/lib/data/property";
import { Badge } from "@workspace/ui/components/badge";
import { Separator } from "@workspace/ui/components/separator";
import {
  Building2,
  Calendar,
  Check,
  DollarSign,
  FileText,
  Users,
  X,
} from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  formatDateWithDay,
  formatDateTimeShort,
  PROGRESS_STATUS_LABELS,
  DOCUMENT_STATUS_LABELS,
  CONTRACT_TYPE_LABELS,
  COMPANY_B_LABELS,
  BROKER_COMPANY_LABELS,
  ACCOUNT_COMPANY_LABELS,
  BANK_ACCOUNT_LABELS,
} from "@workspace/utils";
import type {
  ProgressStatus,
  DocumentStatus,
  ContractType,
  CompanyB,
  BrokerCompany,
  AccountCompany,
  BankAccount,
} from "@workspace/drizzle/types";

export async function generateMetadata({
  params,
}: PageProps<"/properties/unconfirmed/[id]">): Promise<Metadata> {
  const { id } = await params;
  const property = await getPropertyById(id);

  if (!property) {
    return {
      title: "案件が見つかりません",
    };
  }

  return {
    title: `${property.propertyName} - 案件詳細`,
  };
}

export default async function PropertyDetailPage({
  params,
}: PageProps<"/properties/unconfirmed/[id]">) {
  const { id } = await params;
  const property = await getPropertyById(id);

  if (!property) {
    notFound();
  }

  /** 金額を円単位でフォーマット */
  const formatCurrency = (value: number | null | undefined): string => {
    if (value == null) return "-";
    return `${value.toLocaleString()}円`;
  };

  /** ラベル取得ヘルパー */
  const getLabel = <T extends string>(
    value: T | null | undefined,
    labels: Record<T, string>
  ): string => {
    if (!value) return "-";
    return labels[value] ?? value;
  };

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <BreadcrumbConfig
        items={[
          { label: "案件管理" },
          { label: "業者確定前", href: "/properties/unconfirmed" },
          { label: "案件詳細" },
        ]}
      />

      <div className="min-h-0 flex-1 overflow-auto">
        <div className="container max-w-6xl mx-auto px-6 py-8">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-semibold mb-2">
                {property.propertyName}
              </h1>
              <div className="flex gap-2">
                <Badge>
                  {getLabel(property.progressStatus as ProgressStatus, PROGRESS_STATUS_LABELS)}
                </Badge>
                <Badge variant="secondary">
                  {getLabel(property.documentStatus as DocumentStatus, DOCUMENT_STATUS_LABELS)}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-4 text-muted-foreground">
              <span className="text-lg">{property.roomNumber}</span>
              <Separator orientation="vertical" className="h-4" />
              <span>オーナー: {property.ownerName}</span>
            </div>
          </div>

          <div className="mb-4 flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">担当:</span>
            <div className="flex gap-2">
              {property.staff?.map((staffMember) => (
                <Badge key={staffMember.user.id} variant="secondary">
                  {staffMember.user.name}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
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
                      <ProgressItem
                        label="契約書 保存完了"
                        checked={
                          property.contractProgress?.abContractSaved || false
                        }
                        date={property.contractProgress?.abContractSavedAt}
                      />
                      <ProgressItem
                        label="委任状関係 保存完了"
                        checked={
                          property.contractProgress?.abAuthorizationSaved ||
                          false
                        }
                        date={property.contractProgress?.abAuthorizationSavedAt}
                      />
                      <ProgressItem
                        label="売主身分証 保存完了"
                        checked={
                          property.contractProgress?.abSellerIdSaved || false
                        }
                        date={property.contractProgress?.abSellerIdSavedAt}
                      />
                    </div>
                  </div>

                  <div className="rounded-lg border bg-card">
                    <div className="p-4 border-b bg-muted/30">
                      <h3 className="font-medium">BC関係</h3>
                    </div>
                    <div className="p-4 space-y-3">
                      <ProgressItem
                        label="BC売契作成"
                        checked={
                          property.contractProgress?.bcContractCreated || false
                        }
                        date={property.contractProgress?.bcContractCreatedAt}
                      />
                      <ProgressItem
                        label="重説作成"
                        checked={
                          property.contractProgress?.bcDescriptionCreated ||
                          false
                        }
                        date={property.contractProgress?.bcDescriptionCreatedAt}
                      />
                      <ProgressItem
                        label="BC売契送付"
                        checked={
                          property.contractProgress?.bcContractSent || false
                        }
                        date={property.contractProgress?.bcContractSentAt}
                      />
                      <ProgressItem
                        label="重説送付"
                        checked={
                          property.contractProgress?.bcDescriptionSent || false
                        }
                        date={property.contractProgress?.bcDescriptionSentAt}
                      />
                      <ProgressItem
                        label="BC売契CB完了"
                        checked={
                          property.contractProgress?.bcContractCbDone || false
                        }
                        date={property.contractProgress?.bcContractCbDoneAt}
                      />
                      <ProgressItem
                        label="重説CB完了"
                        checked={
                          property.contractProgress?.bcDescriptionCbDone ||
                          false
                        }
                        date={property.contractProgress?.bcDescriptionCbDoneAt}
                      />
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <div className="space-y-8">
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
                        {getLabel(property.contractType as ContractType, CONTRACT_TYPE_LABELS)}
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
                        {getLabel(property.companyB as CompanyB, COMPANY_B_LABELS)}
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">
                        仲介会社
                      </div>
                      <div className="font-medium">
                        {getLabel(property.brokerCompany as BrokerCompany, BROKER_COMPANY_LABELS)}
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

              <section>
                <h3 className="text-lg font-semibold mb-4">口座情報</h3>
                <div className="rounded-lg border bg-card">
                  <div className="p-6 space-y-4">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">
                        使用口座会社
                      </div>
                      <div className="font-medium">
                        {getLabel(property.accountCompany as AccountCompany, ACCOUNT_COMPANY_LABELS)}
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">
                        使用銀行口座
                      </div>
                      <div className="font-medium">
                        {getLabel(property.bankAccount as BankAccount, BANK_ACCOUNT_LABELS)}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-4">その他</h3>
                <div className="rounded-lg border bg-card">
                  <div className="p-6 space-y-4">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">
                        名簿種別
                      </div>
                      <div className="font-medium">
                        {property.listType || "-"}
                      </div>
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
      </div>
    </div>
  );
}

function ProgressItem({
  label,
  checked,
  date,
}: {
  label: string;
  checked: boolean;
  date: Date | string | null | undefined;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-center gap-2">
        {checked ? (
          <Check className="h-4 w-4 text-green-600 shrink-0" />
        ) : (
          <X className="h-4 w-4 text-muted-foreground shrink-0" />
        )}
        <span className={checked ? "text-foreground" : "text-muted-foreground"}>
          {label}
        </span>
      </div>
      {checked && date && (
        <div className="text-xs text-muted-foreground text-right">
          {formatDateTimeShort(date)}
        </div>
      )}
    </div>
  );
}
