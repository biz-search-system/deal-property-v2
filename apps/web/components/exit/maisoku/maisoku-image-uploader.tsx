"use client";

import { Button } from "@workspace/ui/components/button";
import { FileImage, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useCallback, useRef } from "react";
import type { ImageSlot, ImageSlotKey } from "./maisoku-editor";

interface MaisokuImageUploaderProps {
  slots: ImageSlot[];
  onImageSet: (key: ImageSlotKey, url: string | null) => void;
}

export function MaisokuImageUploader({
  slots,
  onImageSet,
}: MaisokuImageUploaderProps) {
  return (
    <div className="space-y-3">
      {slots.map((slot) => (
        <ImageSlotItem
          key={slot.key}
          slot={slot}
          onImageSet={onImageSet}
        />
      ))}
    </div>
  );
}

function ImageSlotItem({
  slot,
  onImageSet,
}: {
  slot: ImageSlot;
  onImageSet: (key: ImageSlotKey, url: string | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const url = URL.createObjectURL(file);
      onImageSet(slot.key, url);
    },
    [slot.key, onImageSet]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFileSelect(file);
      // inputをリセットして同じファイルを再選択可能にする
      e.target.value = "";
    },
    [handleFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleRemove = useCallback(() => {
    onImageSet(slot.key, null);
  }, [slot.key, onImageSet]);

  return (
    <div className="space-y-1.5">
      <p className="text-xs font-medium">{slot.label}</p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleInputChange}
      />

      {slot.url ? (
        <div className="group relative overflow-hidden rounded-md border">
          <Image
            src={slot.url}
            alt={slot.label}
            width={280}
            height={160}
            className="h-[120px] w-full object-cover"
            unoptimized
          />
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => inputRef.current?.click()}
            >
              <Upload className="size-3" />
              差替え
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleRemove}
            >
              <Trash2 className="size-3" />
              削除
            </Button>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => inputRef.current?.click()}
          className="flex cursor-pointer flex-col items-center gap-1.5 rounded-md border border-dashed p-4 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          <FileImage className="size-6" />
          <p className="text-[10px]">クリックまたはドラッグ＆ドロップ</p>
        </div>
      )}
    </div>
  );
}
