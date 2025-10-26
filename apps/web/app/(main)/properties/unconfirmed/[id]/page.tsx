import { getPropertyById } from "@/lib/data/property";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Separator } from "@workspace/ui/components/separator";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import {
  ArrowLeft,
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
import Link from "next/link";

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

  const formatCurrency = (value: number | null | undefined) => {
    if (!value) return "-";
    return `${value.toLocaleString()}万円`;
  };

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "-";
    try {
      const dateObj = typeof date === "string" ? new Date(date) : date;
      return format(dateObj, "yyyy年M月d日(E)", { locale: ja });
    } catch {
      return "-";
    }
  };

  const formatDateTime = (date: Date | string | null | undefined) => {
    if (!date) return "-";
    try {
      const dateObj = typeof date === "string" ? new Date(date) : date;
      return format(dateObj, "yyyy/MM/dd HH:mm", { locale: ja });
    } catch {
      return "-";
    }
  };

  // 利益計算（出口 - A金額 - 仲手等）
  const profit =
    (property.amountExit || 0) -
    (property.amountA || 0) -
    (property.commission || 0);

  // ステータスのラベル取得
  const getProgressStatusLabel = (status: string | null) => {
    const labels: Record<string, string> = {
      bc_before_confirmed: "BC確定前",
      contract_cb_waiting: "契約CB待ち",
      bc_contract_waiting: "BC契約待ち",
      settlement_date_waiting: "決済日待ち",
      settlement_cb_waiting: "精算CB待ち",
      settlement_waiting: "決済待ち",
      settlement_completed: "決済完了",
    };
    return status ? labels[status] || status : "-";
  };

  const getDocumentStatusLabel = (status: string | null) => {
    const labels: Record<string, string> = {
      waiting_request: "営業依頼待ち",
      in_progress: "書類取得中",
      all_completed: "全書類取得完了",
    };
    return status ? labels[status] || status : "-";
  };

  const getContractTypeLabel = (type: string | null) => {
    const labels: Record<string, string> = {
      ab_bc: "AB・BC",
      ac: "AC",
      iyaku: "違約",
      shirahaku: "白紙",
      mitei: "未定",
      jisha: "自社仕入れ",
      bengoshi: "弁護士",
      kaichu: "買仲",
      iyaku_yotei: "違約予定",
    };
    return type ? labels[type] || type : "-";
  };

  const getCompanyBLabel = (company: string | null) => {
    const labels: Record<string, string> = {
      ms: "エムズ",
      life: "ライフ",
      legit: "レイジット",
      esc: "エスク",
      trader: "取引業者",
      shine: "シャイン",
      second: "セカンド",
    };
    return company ? labels[company] || company : "-";
  };

  const getBrokerCompanyLabel = (company: string | null) => {
    const labels: Record<string, string> = {
      legit: "レイジット",
      tousei: "TOUSEI",
      esc: "エスク",
      shine: "シャイン",
      nbf: "NBF",
      rd: "RD",
      ms: "エムズ",
    };
    return company ? labels[company] || company : "-";
  };

  const getAccountCompanyLabel = (company: string | null) => {
    const labels: Record<string, string> = {
      legit: "レイジット",
      life: "ライフ",
      ms: "エムズ",
    };
    return company ? labels[company] || company : "-";
  };

  const getBankAccountLabel = (account: string | null) => {
    const labels: Record<string, string> = {
      gmo_main: "GMOメイン",
      gmo_sub: "GMOサブ",
      rakuten: "楽天",
      gmo: "GMO",
      mizuho: "みずほ",
    };
    return account ? labels[account] || account : "-";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" asChild className="gap-2">
              <Link href="/properties/unconfirmed">
                <ArrowLeft className="h-4 w-4" />
                一覧に戻る
              </Link>
            </Button>
            <div className="flex gap-2">
              <Badge>{getProgressStatusLabel(property.progressStatus)}</Badge>
              <Badge variant="secondary">
                {getDocumentStatusLabel(property.documentStatus)}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-2">
            {property.propertyName}
          </h1>
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

        {/* 管理組織タイプは現在のスキーマに存在しないためコメントアウト
        <div className="mb-8 flex items-center gap-2">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">管理組織:</span>
          <Badge variant="outline">
            {getManagementOrgTypeLabel(property.managementOrgType)}
          </Badge>
        </div>
        */}

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
                        {formatCurrency(profit)}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      出口金額 - 入口金額 - 仲介手数料
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
                      {formatDate(property.contractDateA)}
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      BC契約日
                    </div>
                    <div className="text-lg font-medium">
                      {formatDate(property.contractDateBc)}
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      決済予定日
                    </div>
                    <div className="text-lg font-medium">
                      {formatDate(property.settlementDate)}
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
                      checked={property.contractProgress?.abContractSaved || false}
                      date={property.contractProgress?.abContractSavedAt ?
                        formatDateTime(property.contractProgress.abContractSavedAt) : null}
                    />
                    <ProgressItem
                      label="委任状関係 保存完了"
                      checked={property.contractProgress?.abAuthorizationSaved || false}
                      date={property.contractProgress?.abAuthorizationSavedAt ?
                        formatDateTime(property.contractProgress.abAuthorizationSavedAt) : null}
                    />
                    <ProgressItem
                      label="売主身分証 保存完了"
                      checked={property.contractProgress?.abSellerIdSaved || false}
                      date={property.contractProgress?.abSellerIdSavedAt ?
                        formatDateTime(property.contractProgress.abSellerIdSavedAt) : null}
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
                      checked={property.contractProgress?.bcContractCreated || false}
                      date={property.contractProgress?.bcContractCreatedAt ?
                        formatDateTime(property.contractProgress.bcContractCreatedAt) : null}
                    />
                    <ProgressItem
                      label="重説作成"
                      checked={property.contractProgress?.bcDescriptionCreated || false}
                      date={property.contractProgress?.bcDescriptionCreatedAt ?
                        formatDateTime(property.contractProgress.bcDescriptionCreatedAt) : null}
                    />
                    <ProgressItem
                      label="BC売契送付"
                      checked={property.contractProgress?.bcContractSent || false}
                      date={property.contractProgress?.bcContractSentAt ?
                        formatDateTime(property.contractProgress.bcContractSentAt) : null}
                    />
                    <ProgressItem
                      label="重説送付"
                      checked={property.contractProgress?.bcDescriptionSent || false}
                      date={property.contractProgress?.bcDescriptionSentAt ?
                        formatDateTime(property.contractProgress.bcDescriptionSentAt) : null}
                    />
                    <ProgressItem
                      label="BC売契CB完了"
                      checked={property.contractProgress?.bcContractCbDone || false}
                      date={property.contractProgress?.bcContractCbDoneAt ?
                        formatDateTime(property.contractProgress.bcContractCbDoneAt) : null}
                    />
                    <ProgressItem
                      label="重説CB完了"
                      checked={property.contractProgress?.bcDescriptionCbDone || false}
                      date={property.contractProgress?.bcDescriptionCbDoneAt ?
                        formatDateTime(property.contractProgress.bcDescriptionCbDoneAt) : null}
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
                      {getContractTypeLabel(property.contractType)}
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
                      {getCompanyBLabel(property.companyB)}
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      仲介会社
                    </div>
                    <div className="font-medium">
                      {getBrokerCompanyLabel(property.brokerCompany)}
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
                      {getAccountCompanyLabel(property.accountCompany)}
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      使用銀行口座
                    </div>
                    <div className="font-medium">
                      {getBankAccountLabel(property.bankAccount)}
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
  date: string | null;
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
        <div className="text-xs text-muted-foreground text-right">{date}</div>
      )}
    </div>
  );
}
