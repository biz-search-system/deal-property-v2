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
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import type { Metadata } from "next";
import { BreadcrumbConfig } from "@/components/breadcrumb-provider";

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

  // 利益計算
  const profit =
    (property.amountExit || 0) -
    (property.amountA || 0) +
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
      hakushi: "白紙",
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
        <div className="container max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" asChild className="gap-2">
              <Link href="/properties/unconfirmed">
                <ArrowLeft className="h-4 w-4" />
                一覧に戻る
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
              {getProgressStatusLabel(property.progressStatus)}
            </Badge>
            <Badge variant="outline">
              {getDocumentStatusLabel(property.documentStatus)}
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
                  {formatCurrency(profit)}
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
                      {getDocumentStatusLabel(property.documentProgress.status)}
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
                    {formatDateTime(property.createdAt)}
                  </div>
                </div>
                <Separator />
                <div>
                  <div className="text-xs text-muted-foreground mb-1">
                    更新日時
                  </div>
                  <div className="text-sm">
                    {formatDateTime(property.updatedAt)}
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
  const formatDate = (d: Date | string | null | undefined) => {
    if (!d) return "";
    try {
      const dateObj = typeof d === "string" ? new Date(d) : d;
      return format(dateObj, "yyyy/MM/dd HH:mm", { locale: ja });
    } catch {
      return "";
    }
  };

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
          {formatDate(date)}
        </div>
      )}
    </div>
  );
}
