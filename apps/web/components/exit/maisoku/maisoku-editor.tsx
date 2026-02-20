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
import { useState } from "react";
import { MaisokuImageUploader } from "./maisoku-image-uploader";
import { MaisokuPreview } from "./maisoku-preview";
import { MaisokuTemplateSelector } from "./maisoku-template-selector";

export type MaisokuTemplate = "template-a" | "template-b";

/** 画像スロットのキー */
export type ImageSlotKey = "exterior" | "entrance" | "floorPlan";

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

  const activeSlots: ImageSlot[] = TEMPLATE_SLOTS[template].map((key) => ({
    key,
    label: SLOT_LABELS[key],
    url: images[key],
  }));

  const handleImageSet = (key: ImageSlotKey, url: string | null) => {
    setImages((prev) => ({ ...prev, [key]: url }));
  };

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
                onChange={setTemplate}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">画像設定</CardTitle>
              <CardDescription className="text-xs">
                各スロットに画像を設定
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
