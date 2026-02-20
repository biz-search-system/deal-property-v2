"use client";

import type { ExitListItem } from "@/lib/types/exit";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { ArrowLeft, Download } from "lucide-react";
import Link from "next/link";
import { useCallback, useState } from "react";
import { MaisokuImageUploader } from "./maisoku-image-uploader";
import { MaisokuPreview } from "./maisoku-preview";
import { MaisokuTemplateSelector } from "./maisoku-template-selector";

export type MaisokuTemplate = "template-a" | "template-b";

/** 画像スロットのキー */
export type ImageSlotKey = "exterior" | "entrance" | "floorPlan";

/** 画像の位置・サイズ */
export interface ImagePosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** 画像スロット定義 */
export interface ImageSlot {
  key: ImageSlotKey;
  label: string;
  url: string | null;
}

/** テンプレートごとの画像スロット */
const TEMPLATE_SLOTS: Record<MaisokuTemplate, ImageSlotKey[]> = {
  "template-a": ["exterior", "floorPlan"],
  "template-b": ["exterior", "entrance", "floorPlan"],
};

const SLOT_LABELS: Record<ImageSlotKey, string> = {
  exterior: "外観",
  entrance: "エントランス",
  floorPlan: "間取り",
};

/** テンプレートごとの初期位置 */
const INITIAL_POSITIONS: Record<
  MaisokuTemplate,
  Record<ImageSlotKey, ImagePosition>
> = {
  "template-a": {
    exterior: { x: 16, y: 16, width: 240, height: 200 },
    floorPlan: { x: 16, y: 224, width: 240, height: 200 },
    entrance: { x: 0, y: 0, width: 0, height: 0 },
  },
  "template-b": {
    exterior: { x: 16, y: 340, width: 180, height: 180 },
    entrance: { x: 204, y: 340, width: 180, height: 180 },
    floorPlan: { x: 392, y: 340, width: 180, height: 180 },
  },
};

interface MaisokuEditorProps {
  exit: ExitListItem;
}

export function MaisokuEditor({ exit }: MaisokuEditorProps) {
  const [template, setTemplate] = useState<MaisokuTemplate>("template-a");
  const [images, setImages] = useState<Record<ImageSlotKey, string | null>>({
    exterior: null,
    entrance: null,
    floorPlan: null,
  });
  const [positions, setPositions] = useState<
    Record<ImageSlotKey, ImagePosition>
  >(INITIAL_POSITIONS["template-a"]);

  const activeSlots: ImageSlot[] = TEMPLATE_SLOTS[template].map((key) => ({
    key,
    label: SLOT_LABELS[key],
    url: images[key],
  }));

  const handleImageSet = useCallback(
    (key: ImageSlotKey, url: string | null) => {
      setImages((prev) => ({ ...prev, [key]: url }));

      if (!url) return;

      // 画像の元サイズを取得して、スロットの初期枠にアスペクト比を合わせる
      const img = new window.Image();
      img.onload = () => {
        const basePos = INITIAL_POSITIONS[template][key];
        if (basePos.width === 0 || basePos.height === 0) return;

        const maxW = basePos.width;
        const maxH = basePos.height;
        const ratio = img.naturalWidth / img.naturalHeight;

        let w: number;
        let h: number;
        if (ratio > maxW / maxH) {
          // 横長 → 幅基準
          w = maxW;
          h = Math.round(maxW / ratio);
        } else {
          // 縦長 → 高さ基準
          h = maxH;
          w = Math.round(maxH * ratio);
        }

        setPositions((prev) => ({
          ...prev,
          [key]: { x: basePos.x, y: basePos.y, width: w, height: h },
        }));
      };
      img.src = url;
    },
    [template]
  );

  const handleTemplateChange = (t: MaisokuTemplate) => {
    setTemplate(t);
    setPositions(INITIAL_POSITIONS[t]);
  };

  const handlePositionChange = useCallback(
    (key: ImageSlotKey, pos: ImagePosition) => {
      setPositions((prev) => ({ ...prev, [key]: pos }));
    },
    []
  );

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex flex-1 gap-4 overflow-auto p-4 lg:p-6">
        {/* 左パネル: 設定 */}
        <div className="w-[320px] shrink-0 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">テンプレート選択</CardTitle>
              <CardDescription className="text-xs">
                マイソクのレイアウトを選択
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MaisokuTemplateSelector
                value={template}
                onChange={handleTemplateChange}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">画像設定</CardTitle>
              <CardDescription className="text-xs">
                各スロットに画像を設定（プレビュー上でドラッグ移動・リサイズ可能）
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MaisokuImageUploader
                slots={activeSlots}
                onImageSet={handleImageSet}
              />
            </CardContent>
          </Card>
        </div>

        {/* 右パネル: プレビュー */}
        <div className="flex-1 overflow-auto">
          <MaisokuPreview
            exit={exit}
            template={template}
            images={activeSlots}
            positions={positions}
            onPositionChange={handlePositionChange}
          />
        </div>
      </div>

      {/* フッター */}
      <div className="flex items-center justify-between border-t bg-background px-4 py-3 lg:px-6">
        <Button variant="outline" asChild>
          <Link href={`/exits/${exit.id}`}>
            <ArrowLeft className="size-4" />
            物件詳細に戻る
          </Link>
        </Button>
        <Button disabled>
          <Download className="size-4" />
          PDF出力
        </Button>
      </div>
    </div>
  );
}
