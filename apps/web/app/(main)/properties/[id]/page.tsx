import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Separator } from "@workspace/ui/components/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  ArrowLeft,
  Building2,
  Calendar,
  DollarSign,
  FileText,
  Users,
  Check,
  X,
  Edit,
} from "lucide-react";
import { getPropertyById } from "@/lib/data/property";
import type { Metadata } from "next";
import { BreadcrumbConfig } from "@/components/breadcrumb-provider";
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
}: PageProps<"/properties/[id]">): Promise<Metadata> {
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
}: PageProps<"/properties/[id]">) {
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
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" asChild className="gap-2">
              <Link href="/properties/unconfirmed">
                <ArrowLeft className="h-4 w-4" />
                業者確定前一覧に戻る
              </Link>
            </Button>
            <div className="flex gap-2">
              <Button size="sm" asChild>
                <Link href={`/properties/${property.id}/edit`}>
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">編集</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-2">
            {property.propertyName}
            {property.roomNumber && (
              <span className="text-muted-foreground">
                {" "}
                - {property.roomNumber}
              </span>
            )}
          </h1>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">担当:</span>
              <div className="flex gap-1">
                {property.staff.map((s) => (
                  <Badge key={s.userId} variant="secondary">
                    {s.user.name}
                  </Badge>
                ))}
              </div>
            </div>
            <Badge variant="outline">
              {getLabel(
                property.progressStatus as ProgressStatus,
                PROGRESS_STATUS_LABELS
              )}
            </Badge>
            <Badge variant="outline">
              {getLabel(
                property.documentStatus as DocumentStatus,
                DOCUMENT_STATUS_LABELS
              )}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左側エリア（メイン情報） */}
          <div className="lg:col-span-2 space-y-6">
            {/* 利益情報 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  利益見込み
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-green-600">
                  {formatCurrency(property.profit)}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  出口金額 - A金額 + 仲介手数料
                </p>
              </CardContent>
            </Card>

            {/* 金額情報 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  金額情報
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      A金額
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      仲介手数料等
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
              </CardContent>
            </Card>

            {/* 契約スケジュール */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  契約スケジュール
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
              </CardContent>
            </Card>

            {/* 契約進捗 */}
            {property.contractProgress && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    契約進捗
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* AB関係 */}
                  <div>
                    <h3 className="font-medium mb-3">AB関係</h3>
                    <div className="space-y-2">
                      <ProgressItem
                        label="契約書 保存完了"
                        checked={property.contractProgress.abContractSaved}
                        date={property.contractProgress.abContractSavedAt}
                      />
                      <ProgressItem
                        label="委任状関係 保存完了"
                        checked={property.contractProgress.abAuthorizationSaved}
                        date={property.contractProgress.abAuthorizationSavedAt}
                      />
                      <ProgressItem
                        label="売主身分証 保存完了"
                        checked={property.contractProgress.abSellerIdSaved}
                        date={property.contractProgress.abSellerIdSavedAt}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* BC関係 */}
                  <div>
                    <h3 className="font-medium mb-3">BC関係</h3>
                    <div className="space-y-2">
                      <ProgressItem
                        label="BC売契作成"
                        checked={property.contractProgress.bcContractCreated}
                        date={property.contractProgress.bcContractCreatedAt}
                      />
                      <ProgressItem
                        label="重説作成"
                        checked={property.contractProgress.bcDescriptionCreated}
                        date={property.contractProgress.bcDescriptionCreatedAt}
                      />
                      <ProgressItem
                        label="BC売契送付"
                        checked={property.contractProgress.bcContractSent}
                        date={property.contractProgress.bcContractSentAt}
                      />
                      <ProgressItem
                        label="重説送付"
                        checked={property.contractProgress.bcDescriptionSent}
                        date={property.contractProgress.bcDescriptionSentAt}
                      />
                      <ProgressItem
                        label="BC売契CB完了"
                        checked={property.contractProgress.bcContractCbDone}
                        date={property.contractProgress.bcContractCbDoneAt}
                      />
                      <ProgressItem
                        label="重説CB完了"
                        checked={property.contractProgress.bcDescriptionCbDone}
                        date={property.contractProgress.bcDescriptionCbDoneAt}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 書類進捗 */}
            {property.documentProgress && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    書類進捗
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      書類ステータス
                    </div>
                    <Badge variant="outline">
                      {getLabel(
                        property.documentProgress.status as DocumentStatus,
                        DOCUMENT_STATUS_LABELS
                      )}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* 右側エリア（補足情報） */}
          <div className="space-y-6">
            {/* 基本情報 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  基本情報
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">
                    オーナー名
                  </div>
                  <div className="font-medium">{property.ownerName}</div>
                </div>
              </CardContent>
            </Card>

            {/* 関係者情報 */}
            <Card>
              <CardHeader>
                <CardTitle>関係者情報</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">
                    契約形態
                  </div>
                  <div className="font-medium">
                    {getLabel(
                      property.contractType as ContractType,
                      CONTRACT_TYPE_LABELS
                    )}
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
                    {getLabel(
                      property.brokerCompany as BrokerCompany,
                      BROKER_COMPANY_LABELS
                    )}
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
              </CardContent>
            </Card>

            {/* 口座情報 */}
            <Card>
              <CardHeader>
                <CardTitle>口座情報</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">
                    使用口座会社
                  </div>
                  <div className="font-medium">
                    {getLabel(
                      property.accountCompany as AccountCompany,
                      ACCOUNT_COMPANY_LABELS
                    )}
                  </div>
                </div>
                <Separator />
                <div>
                  <div className="text-xs text-muted-foreground mb-1">
                    使用銀行口座
                  </div>
                  <div className="font-medium">
                    {getLabel(
                      property.bankAccount as BankAccount,
                      BANK_ACCOUNT_LABELS
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* その他 */}
            <Card>
              <CardHeader>
                <CardTitle>その他</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
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
                      <div className="text-sm whitespace-pre-wrap">
                        {property.notes}
                      </div>
                    </div>
                  </>
                )}
                <Separator />
                <div>
                  <div className="text-xs text-muted-foreground mb-1">
                    作成日時
                  </div>
                  <div className="text-sm">
                    {formatDateTimeShort(property.createdAt)}
                  </div>
                </div>
                <Separator />
                <div>
                  <div className="text-xs text-muted-foreground mb-1">
                    更新日時
                  </div>
                  <div className="text-sm">
                    {formatDateTimeShort(property.updatedAt)}
                  </div>
                </div>
              </CardContent>
            </Card>
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
          <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
        ) : (
          <X className="h-4 w-4 text-muted-foreground flex-shrink-0" />
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
