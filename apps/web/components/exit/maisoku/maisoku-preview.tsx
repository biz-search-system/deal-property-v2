"use client";

import type { ExitListItem } from "@/lib/types/exit";
import { SITUATION_LABELS } from "@/lib/types/exit";
import type { MaisokuTemplate } from "./maisoku-editor";

interface MaisokuPreviewProps {
  exit: ExitListItem;
  template: MaisokuTemplate;
}

/** 和暦フォーマット */
function formatWareki(date: Date | null): string {
  if (!date) return "-";
  return new Intl.DateTimeFormat("ja-JP-u-ca-japanese", {
    era: "long",
    year: "numeric",
    month: "long",
  }).format(date);
}

/** 物件情報テーブル行 */
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <tr className="border-b last:border-b-0">
      <td className="bg-muted px-2 py-1 text-[10px] font-medium whitespace-nowrap w-[80px]">
        {label}
      </td>
      <td className="px-2 py-1 text-[10px]">{value}</td>
    </tr>
  );
}

export function MaisokuPreview({ exit, template }: MaisokuPreviewProps) {
  const infoRows = [
    { label: "物件名", value: exit.propertyName },
    { label: "号室", value: exit.roomNumber || "-" },
    { label: "所在地", value: exit.address || "-" },
    { label: "築年月", value: formatWareki(exit.builtDate) },
    { label: "構造", value: exit.structure || "-" },
    { label: "面積", value: exit.area ? `${exit.area}㎡` : "-" },
    { label: "階数", value: exit.floor || "-" },
    {
      label: "現況",
      value: exit.situation ? SITUATION_LABELS[exit.situation] : "-",
    },
    {
      label: "家賃",
      value: exit.rent ? `${exit.rent.toLocaleString()}円` : "-",
    },
    {
      label: "管理費等",
      value: exit.managementFee
        ? `${exit.managementFee.toLocaleString()}円`
        : "-",
    },
    {
      label: "価格",
      value: exit.maisokuPrice
        ? `${exit.maisokuPrice.toLocaleString()}万円`
        : "-",
    },
    {
      label: "想定利回り",
      value: exit.expectedYield ? `${exit.expectedYield.toFixed(2)}%` : "-",
    },
  ];

  return (
    <div className="flex justify-center">
      {/* A4比率のプレビュー枠 */}
      <div className="w-[595px] min-h-[842px] border bg-white shadow-sm rounded">
        {template === "template-a" ? (
          <TemplateA infoRows={infoRows} />
        ) : (
          <TemplateB infoRows={infoRows} />
        )}
      </div>
    </div>
  );
}

/** テンプレートA: 左に画像2枚（縦並び）、右に物件情報テーブル */
function TemplateA({
  infoRows,
}: {
  infoRows: { label: string; value: string }[];
}) {
  return (
    <div className="flex h-full gap-2 p-4">
      {/* 左: 画像エリア */}
      <div className="flex w-[240px] shrink-0 flex-col gap-2">
        <div className="flex h-[200px] items-center justify-center rounded border border-dashed bg-muted text-[10px] text-muted-foreground">
          外観画像
        </div>
        <div className="flex h-[200px] items-center justify-center rounded border border-dashed bg-muted text-[10px] text-muted-foreground">
          間取り画像
        </div>
      </div>

      {/* 右: 物件情報 */}
      <div className="flex-1">
        <table className="w-full border text-foreground">
          <tbody>
            {infoRows.map((row) => (
              <InfoRow key={row.label} label={row.label} value={row.value} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** テンプレートB: 上部に物件情報、下部に画像3枚（横並び） */
function TemplateB({
  infoRows,
}: {
  infoRows: { label: string; value: string }[];
}) {
  return (
    <div className="flex h-full flex-col gap-2 p-4">
      {/* 上: 物件情報 */}
      <div>
        <table className="w-full border text-foreground">
          <tbody>
            {infoRows.map((row) => (
              <InfoRow key={row.label} label={row.label} value={row.value} />
            ))}
          </tbody>
        </table>
      </div>

      {/* 下: 画像エリア */}
      <div className="flex gap-2">
        <div className="flex h-[180px] flex-1 items-center justify-center rounded border border-dashed bg-muted text-[10px] text-muted-foreground">
          外観画像
        </div>
        <div className="flex h-[180px] flex-1 items-center justify-center rounded border border-dashed bg-muted text-[10px] text-muted-foreground">
          エントランス画像
        </div>
        <div className="flex h-[180px] flex-1 items-center justify-center rounded border border-dashed bg-muted text-[10px] text-muted-foreground">
          間取り画像
        </div>
      </div>
    </div>
  );
}
