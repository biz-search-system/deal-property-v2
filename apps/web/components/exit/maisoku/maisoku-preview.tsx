"use client";

import type { ExitListItem } from "@/lib/types/exit";
import { SITUATION_LABELS } from "@/lib/types/exit";
import { FileImage } from "lucide-react";
import Image from "next/image";
import { Rnd } from "react-rnd";
import type {
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
}

/** A4プレビューサイズ */
const PREVIEW_WIDTH = 595;
const PREVIEW_HEIGHT = 842;

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

/** 未設定画像のプレースホルダー（テンプレートレイアウト用） */
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

export function MaisokuPreview({
  exit,
  template,
  images,
  positions,
  onPositionChange,
}: MaisokuPreviewProps) {
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

  /** 物件情報テーブルの配置 */
  const tableStyle =
    template === "template-a"
      ? { position: "absolute" as const, top: 16, left: 272, right: 16 }
      : { position: "absolute" as const, top: 16, left: 16, right: 16 };

  return (
    <div className="flex justify-center">
      <div
        className="relative border bg-white shadow-sm rounded"
        style={{ width: PREVIEW_WIDTH, height: PREVIEW_HEIGHT }}
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

        {/* 画像レイヤー */}
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
  );
}
