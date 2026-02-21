"use client";

import type { ExitListItem } from "@/lib/types/exit";
import { SITUATION_LABELS } from "@/lib/types/exit";
import { FileImage } from "lucide-react";
import Image from "next/image";
import { Rnd } from "react-rnd";
import type {
  CompanyInfo,
  ImagePosition,
  ImageSlot,
  ImageSlotKey,
  MaisokuTemplate,
} from "./maisoku-editor";

interface MaisokuPreviewProps {
  exit: ExitListItem;
  template: MaisokuTemplate;
  images: ImageSlot[];
  positions: Record<ImageSlotKey, ImagePosition>;
  onPositionChange: (key: ImageSlotKey, pos: ImagePosition) => void;
  companyInfo: CompanyInfo;
  bodyWidth: number;
  bodyHeight: number;
}

/** A4横向きプレビューサイズ */
const PREVIEW_WIDTH = 842;
const PREVIEW_HEIGHT = 595;
const HEADER_HEIGHT = 50;
const FOOTER_HEIGHT = 40;
const BODY_TOP = HEADER_HEIGHT;

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
      <td className="bg-muted/50 px-2 py-1 text-[9px] font-medium whitespace-nowrap w-[72px] border-r">
        {label}
      </td>
      <td className="px-2 py-1 text-[9px]">{value}</td>
    </tr>
  );
}

/** テンプレートA ヘッダー: 左に物件名、右に価格 */
function HeaderTemplateA({ exit }: { exit: ExitListItem }) {
  const displayName = [exit.propertyName, exit.roomNumber]
    .filter(Boolean)
    .join(" ");
  return (
    <div
      className="absolute inset-x-0 top-0 flex items-center justify-between border-b bg-slate-800 px-4"
      style={{ height: HEADER_HEIGHT }}
    >
      <div className="flex items-baseline gap-2">
        <span className="text-[9px] text-slate-400">物件名</span>
        <span className="text-[13px] font-bold text-white">{displayName}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-[9px] text-slate-400">価格</span>
        <span className="text-[22px] font-bold leading-none text-white">
          {exit.maisokuPrice ? exit.maisokuPrice.toLocaleString() : "-"}
        </span>
        <span className="text-[10px] text-slate-300">万円</span>
      </div>
    </div>
  );
}

/** テンプレートB ヘッダー: 左に価格、右に最寄駅・名称・所在 */
function HeaderTemplateB({ exit }: { exit: ExitListItem }) {
  return (
    <div
      className="absolute inset-x-0 top-0 flex items-center border-b bg-slate-800 px-4"
      style={{ height: HEADER_HEIGHT }}
    >
      {/* 左: 価格 */}
      <div className="flex items-baseline gap-1">
        <span className="text-[22px] font-bold leading-none text-white">
          {exit.maisokuPrice ? exit.maisokuPrice.toLocaleString() : "-"}
        </span>
        <span className="text-[10px] text-slate-300">万円</span>
        <span className="text-[8px] text-slate-400 ml-1">税込み</span>
      </div>

      {/* 中央〜右: 物件情報 */}
      <div className="ml-auto grid grid-cols-[auto_1fr] gap-x-2 gap-y-0.5 text-white">
        <span className="text-[8px] text-slate-400">最寄駅</span>
        <span className="text-[8px]">
          {exit.nearestStation || "-"}
          {exit.nearestStation2 ? ` / ${exit.nearestStation2}` : ""}
        </span>
        <span className="text-[8px] text-slate-400">名称</span>
        <span className="text-[8px] font-medium">
          {exit.propertyName}
          {exit.roomNumber ? ` ${exit.roomNumber}` : ""}
        </span>
        <span className="text-[8px] text-slate-400">所在</span>
        <span className="text-[8px]">{exit.address || "-"}</span>
      </div>
    </div>
  );
}

/** フッター: 企業ロゴ・会社情報・注記 */
function MaisokuFooter({ companyInfo }: { companyInfo: CompanyInfo }) {
  return (
    <div
      className="absolute inset-x-0 bottom-0 flex items-center gap-3 border-t bg-slate-50 px-4"
      style={{ height: FOOTER_HEIGHT }}
    >
      {/* ロゴ */}
      {companyInfo.logoUrl ? (
        <Image
          src={companyInfo.logoUrl}
          alt={companyInfo.name}
          width={60}
          height={28}
          className="object-contain"
          unoptimized
        />
      ) : (
        <div className="flex h-7 w-[60px] items-center justify-center rounded border bg-muted text-[8px] text-muted-foreground">
          LOGO
        </div>
      )}

      {/* 会社情報 */}
      <div className="flex-1 space-y-0.5">
        <div className="flex items-center gap-2 text-[8px]">
          {companyInfo.licenseNumber && (
            <span className="text-muted-foreground">
              {companyInfo.licenseNumber}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-[8px]">
          <span className="font-medium">{companyInfo.name}</span>
          <span>
            〒{companyInfo.postalCode} {companyInfo.address}
          </span>
          <span>TEL {companyInfo.tel}</span>
          {companyInfo.fax && <span>FAX {companyInfo.fax}</span>}
          {companyInfo.transactionType && (
            <span>取引態様: {companyInfo.transactionType}</span>
          )}
          {companyInfo.staffName && <span>担当: {companyInfo.staffName}</span>}
        </div>
      </div>

      {/* 注記 */}
      <p className="text-[7px] text-muted-foreground whitespace-nowrap">
        ※図面と現況が異なる場合は、現況優先となります。
      </p>
    </div>
  );
}

/** ドラッグ・リサイズ可能な画像 */
function RndImage({
  slot,
  position,
  onPositionChange,
}: {
  slot: ImageSlot;
  position: ImagePosition;
  onPositionChange: (key: ImageSlotKey, pos: ImagePosition) => void;
}) {
  if (!slot.url) return null;

  return (
    <Rnd
      size={{ width: position.width, height: position.height }}
      position={{ x: position.x, y: position.y }}
      onDragStop={(_e, d) => {
        onPositionChange(slot.key, {
          ...position,
          x: d.x,
          y: d.y,
        });
      }}
      onResizeStop={(_e, _direction, ref, _delta, pos) => {
        onPositionChange(slot.key, {
          x: pos.x,
          y: pos.y,
          width: parseInt(ref.style.width, 10),
          height: parseInt(ref.style.height, 10),
        });
      }}
      bounds="parent"
      minWidth={60}
      minHeight={60}
      className="group"
    >
      <div className="relative h-full w-full overflow-hidden rounded border border-black transition-colors group-hover:border-primary">
        <Image
          src={slot.url}
          alt={slot.label}
          fill
          className="pointer-events-none object-cover"
          unoptimized
        />
        <div className="absolute inset-x-0 bottom-0 bg-black/60 px-1.5 py-0.5 text-[9px] text-white opacity-0 transition-opacity group-hover:opacity-100">
          {slot.label}
        </div>
      </div>
    </Rnd>
  );
}

/** 未設定画像のプレースホルダー */
function StaticPlaceholder({
  slot,
  position,
}: {
  slot: ImageSlot;
  position: ImagePosition;
}) {
  if (position.width === 0 || position.height === 0) return null;

  return (
    <div
      className="absolute flex items-center justify-center rounded border border-dashed bg-muted text-muted-foreground"
      style={{
        left: position.x,
        top: position.y,
        width: position.width,
        height: position.height,
      }}
    >
      <div className="flex flex-col items-center gap-1">
        <FileImage className="size-5" />
        <span className="text-[10px]">{slot.label}画像</span>
      </div>
    </div>
  );
}

/** テンプレート別の物件情報行を取得 */
function getInfoRows(
  exit: ExitListItem,
  template: MaisokuTemplate,
): { label: string; value: string }[] {
  if (template === "template-a") {
    return [
      { label: "所在", value: exit.address || "-" },
      { label: "最寄駅①", value: exit.nearestStation || "-" },
      { label: "最寄駅②", value: exit.nearestStation2 || "-" },
      {
        label: "家賃",
        value: exit.rent ? `${exit.rent.toLocaleString()}円` : "-",
      },
      {
        label: "修繕積立金",
        value: exit.managementFee
          ? `管理費に含む`
          : "-",
      },
      { label: "専有面積", value: exit.area ? `${exit.area}㎡` : "-" },
      { label: "構造", value: exit.structure || "-" },
      { label: "階数", value: exit.floor || "-" },
      { label: "間取り", value: exit.roomType || "-" },
      { label: "築年月", value: formatWareki(exit.builtDate) },
      {
        label: "総戸数",
        value: exit.totalUnits ? `${exit.totalUnits}戸` : "-",
      },
      {
        label: "現況",
        value: exit.situation ? SITUATION_LABELS[exit.situation] : "-",
      },
      {
        label: "想定利回り",
        value: exit.expectedYield
          ? `${exit.expectedYield.toFixed(2)}%`
          : "-",
      },
      { label: "備考", value: "" },
    ];
  }

  // テンプレートB
  return [
    {
      label: "家賃",
      value: exit.rent ? `${exit.rent.toLocaleString()}円` : "-",
    },
    {
      label: "管理費",
      value: exit.managementFee
        ? `${exit.managementFee.toLocaleString()}円`
        : "-",
    },
    { label: "修繕積立金", value: "-" },
    { label: "専有面積", value: exit.area ? `${exit.area}㎡` : "-" },
    { label: "構造", value: exit.structure || "-" },
    { label: "間取り", value: exit.roomType || "-" },
    { label: "築年月", value: formatWareki(exit.builtDate) },
    { label: "総戸数", value: exit.totalUnits ? `${exit.totalUnits}戸` : "-" },
    {
      label: "現況",
      value: exit.situation ? SITUATION_LABELS[exit.situation] : "-",
    },
    { label: "階数", value: exit.floor || "-" },
    {
      label: "想定利回り",
      value: exit.expectedYield ? `${exit.expectedYield.toFixed(2)}%` : "-",
    },
    { label: "備考", value: "" },
  ];
}

export function MaisokuPreview({
  exit,
  template,
  images,
  positions,
  onPositionChange,
  companyInfo,
  bodyWidth,
  bodyHeight,
}: MaisokuPreviewProps) {
  const infoRows = getInfoRows(exit, template);

  /** テンプレート別のテーブル配置 */
  const tableStyle =
    template === "template-a"
      ? {
          position: "absolute" as const,
          top: 8,
          left: 420,
          right: 8,
        }
      : {
          position: "absolute" as const,
          top: 8,
          left: 8,
          width: 404,
        };

  return (
    <div className="flex justify-center">
      <div
        className="relative border bg-white shadow-sm rounded"
        style={{ width: PREVIEW_WIDTH, height: PREVIEW_HEIGHT }}
      >
        {/* ヘッダー */}
        {template === "template-a" ? (
          <HeaderTemplateA exit={exit} />
        ) : (
          <HeaderTemplateB exit={exit} />
        )}

        {/* ボディエリア（画像のbounds制約用コンテナ） */}
        <div
          className="absolute"
          style={{
            top: BODY_TOP,
            left: 0,
            width: bodyWidth,
            height: bodyHeight,
          }}
        >
          {/* 物件情報テーブル */}
          <div style={tableStyle}>
            <table className="w-full border text-foreground">
              <tbody>
                {infoRows.map((row) => (
                  <InfoRow key={row.label} label={row.label} value={row.value} />
                ))}
              </tbody>
            </table>
          </div>

          {/* 画像レイヤー（ボディコンテナ相対座標） */}
          <div className="relative" style={{ width: bodyWidth, height: bodyHeight }}>
            {images.map((slot) => {
              const pos = positions[slot.key];
              if (!pos || (pos.width === 0 && pos.height === 0)) return null;

              return slot.url ? (
                <RndImage
                  key={slot.key}
                  slot={slot}
                  position={pos}
                  onPositionChange={onPositionChange}
                />
              ) : (
                <StaticPlaceholder key={slot.key} slot={slot} position={pos} />
              );
            })}
          </div>
        </div>

        {/* フッター */}
        <MaisokuFooter companyInfo={companyInfo} />
      </div>
    </div>
  );
}
