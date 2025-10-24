"use client";

import { use } from "react";
import { notFound, useRouter } from "next/navigation";
import { properties } from "../../data/property";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Building2,
  Calendar,
  DollarSign,
  FileText,
  Users,
  Check,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import type { CheckItem } from "../../data/property";

export default function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const property = properties.find((p) => p.id === Number(resolvedParams.id));

  if (!property) {
    notFound();
  }

  const formatCurrency = (value: number) => {
    return `¥${(value / 10000).toLocaleString()}万`;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return format(date, "yyyy年M月d日(E)", { locale: ja });
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status: string) => {
    if (status.includes("完了")) return "default";
    if (status.includes("確定")) return "secondary";
    return "outline";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/properties/unconfirmed")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              一覧に戻る
            </Button>
            <div className="flex gap-2">
              <Badge variant={getStatusColor(property.businessStatus)}>
                {property.businessStatus}
              </Badge>
              <Badge variant={getStatusColor(property.documentStatus)}>
                {property.documentStatus}
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

        <div className="mb-8 flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">担当:</span>
          <div className="flex gap-2">
            {property.assignee.map((person, index) => (
              <Badge key={index} variant="secondary">
                {person}
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
                        {formatCurrency(property.aAmount)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">
                        出口金額
                      </div>
                      <div className="text-2xl font-semibold">
                        {formatCurrency(property.exitAmount)}
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
                      {formatDate(property.aContractDate)}
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      BC契約日
                    </div>
                    <div className="text-lg font-medium">
                      {formatDate(property.bcContractDate)}
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
                      item={property.contractProgress.ab.contractSaved}
                    />
                    <ProgressItem
                      label="委任状関係 保存完了"
                      item={property.contractProgress.ab.proxyCompleted}
                    />
                    <ProgressItem
                      label="売主身分証 保存完了"
                      item={property.contractProgress.ab.sellerIdSaved}
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
                      item={property.contractProgress.bc.bcContractCreated}
                    />
                    <ProgressItem
                      label="重説作成"
                      item={
                        property.contractProgress.bc.importantMattersCreated
                      }
                    />
                    <ProgressItem
                      label="BC売契送付"
                      item={property.contractProgress.bc.bcContractSent}
                    />
                    <ProgressItem
                      label="重説送付"
                      item={property.contractProgress.bc.importantMattersSent}
                    />
                    <ProgressItem
                      label="BC売契CB完了"
                      item={property.contractProgress.bc.bcContractCbCompleted}
                    />
                    <ProgressItem
                      label="重説CB完了"
                      item={
                        property.contractProgress.bc.importantMattersCbCompleted
                      }
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
                    <div className="font-medium">{property.contractType}</div>
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
                    <div className="font-medium">{property.bCompany}</div>
                  </div>
                  <Separator />
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      仲介会社
                    </div>
                    <div className="font-medium">
                      {property.brokerCompany || "-"}
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      抵当銀行
                    </div>
                    <div className="font-medium">{property.mortgageBank}</div>
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
                      {property.account || "-"}
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      使用銀行口座
                    </div>
                    <div className="font-medium">
                      {property.bankAccount || "-"}
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
                    <div className="font-medium">{property.leadType}</div>
                  </div>
                  {property.memo && (
                    <>
                      <Separator />
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">
                          備考
                        </div>
                        <div className="text-sm leading-relaxed">
                          {property.memo}
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
  item,
}: {
  label: string;
  item: CheckItem;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-center gap-2">
        {item.checked ? (
          <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
        ) : (
          <X className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        )}
        <span
          className={
            item.checked ? "text-foreground" : "text-muted-foreground"
          }
        >
          {label}
        </span>
      </div>
      {item.checked && (item.date || item.user) && (
        <div className="text-xs text-muted-foreground text-right">
          {item.date && <div>{item.date}</div>}
          {item.user && <div>{item.user}</div>}
        </div>
      )}
    </div>
  );
}
