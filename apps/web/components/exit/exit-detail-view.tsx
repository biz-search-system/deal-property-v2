"use client";

import type { ExitListItem } from "@/lib/types/exit";
import { Button } from "@workspace/ui/components/button";
import { Separator } from "@workspace/ui/components/separator";
import { format } from "date-fns";
import { ArrowLeft, Pencil, Send } from "lucide-react";
import Link from "next/link";
import { ExitStatusBadge } from "./exit-status-badge";
import { SituationBadge } from "./situation-badge";

interface ExitDetailViewProps {
  exit: ExitListItem;
}

function formatCurrency(value: number | null, unit: string = "円"): string {
  if (value === null) return "-";
  return `${value.toLocaleString()}${unit}`;
}

function formatPercent(value: number | null): string {
  if (value === null) return "-";
  return `${value.toFixed(2)}%`;
}

function formatDate(date: Date | null): string {
  if (!date) return "-";
  return format(date, "yyyy/MM/dd");
}

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{children}</span>
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <h3 className="pb-2 pt-6 text-xs font-medium uppercase tracking-wider text-muted-foreground">
      {title}
    </h3>
  );
}

export function ExitDetailView({ exit }: ExitDetailViewProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="flex-1 overflow-auto">
        <div className="mx-auto max-w-2xl px-4 py-6 lg:px-6">
          {/* ヘッダー */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold tracking-tight">
                  {exit.propertyName}
                  {exit.roomNumber && ` ${exit.roomNumber}`}
                </h1>
                <ExitStatusBadge status={exit.status} />
              </div>
              <p className="text-sm text-muted-foreground">{exit.address}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/exits/${exit.id}/distribute`}>
                  <Send className="size-4" />
                  <span className="hidden sm:inline">業者配布</span>
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link href={`/exits/${exit.id}/edit`}>
                  <Pencil className="size-4" />
                  <span className="hidden sm:inline">編集</span>
                </Link>
              </Button>
            </div>
          </div>

          {/* 物件情報 */}
          <SectionHeader title="物件情報" />
          <div className="divide-y">
            <DetailRow label="物件名">{exit.propertyName}</DetailRow>
            <DetailRow label="号室">{exit.roomNumber || "-"}</DetailRow>
            <DetailRow label="住所">{exit.address || "-"}</DetailRow>
            <DetailRow label="築年月">{formatDate(exit.builtDate)}</DetailRow>
            <DetailRow label="面積">
              {exit.area ? `${exit.area}㎡` : "-"}
            </DetailRow>
            <DetailRow label="構造">{exit.structure || "-"}</DetailRow>
            <DetailRow label="階数">{exit.floor || "-"}</DetailRow>
            <DetailRow label="担当者">{exit.staff?.name || "-"}</DetailRow>
          </div>

          {/* 現況情報 */}
          <SectionHeader title="現況情報" />
          <div className="divide-y">
            <DetailRow label="現況">
              {exit.situation ? (
                <SituationBadge situation={exit.situation} />
              ) : (
                "-"
              )}
            </DetailRow>
            <DetailRow label="家賃">{formatCurrency(exit.rent)}</DetailRow>
            <DetailRow label="管積">
              {formatCurrency(exit.managementFee)}
            </DetailRow>
          </div>

          {/* 金額情報 */}
          <SectionHeader title="金額情報" />
          <div className="divide-y">
            <DetailRow label="仕入れ金額">
              {formatCurrency(exit.purchasePrice, "万円")}
            </DetailRow>
            <DetailRow label="マイソク価格">
              {formatCurrency(exit.maisokuPrice, "万円")}
            </DetailRow>
            <DetailRow label="想定利回り">
              {formatPercent(exit.expectedYield)}
            </DetailRow>
          </div>

          {/* 確定情報 */}
          {exit.confirmedPrice && (
            <>
              <SectionHeader title="確定情報" />
              <div className="divide-y">
                <DetailRow label="確定業者">
                  {exit.rankedResponses?.find((r) => r.rank === 1)
                    ?.brokerName || "-"}
                </DetailRow>
                <DetailRow label="確定金額">
                  <span className="text-primary">
                    {formatCurrency(exit.confirmedPrice, "万円")}
                  </span>
                </DetailRow>
                <DetailRow label="確定利回り">
                  <span className="text-primary">
                    {formatPercent(exit.confirmedYield)}
                  </span>
                </DetailRow>
                <DetailRow label="確定日">
                  {formatDate(exit.confirmedAt)}
                </DetailRow>
              </div>
            </>
          )}

          {/* 回答ランキング */}
          {exit.rankedResponses && exit.rankedResponses.length > 0 && (
            <>
              <SectionHeader title="回答ランキング" />
              <div className="divide-y">
                {exit.rankedResponses.map((response) => (
                  <div
                    key={response.brokerId}
                    className="flex items-center justify-between py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex size-6 items-center justify-center rounded-full bg-muted text-xs font-medium">
                        {response.rank}
                      </span>
                      <span className="text-sm font-medium">
                        {response.brokerName}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span>{formatCurrency(response.price, "万円")}</span>
                      <span className="text-muted-foreground">
                        {formatPercent(response.yield)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* 備考 */}
          {exit.notes && (
            <>
              <SectionHeader title="備考" />
              <p className="whitespace-pre-wrap py-3 text-sm">{exit.notes}</p>
            </>
          )}
        </div>
      </div>

      {/* フッター */}
      <Separator />
      <div className="flex items-center px-4 py-3 lg:px-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/exits">
            <ArrowLeft className="size-4" />
            一覧に戻る
          </Link>
        </Button>
      </div>
    </div>
  );
}
