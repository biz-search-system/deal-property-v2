"use client";

import { Button } from "@workspace/ui/components/button";
import { Slider } from "@workspace/ui/components/slider";
import { cn } from "@workspace/utils";
import { ImagePlus, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import AvatarEditor from "react-avatar-editor";
import { useDropzone } from "react-dropzone";

// ============================================================================
// ImageCropper - クロップ UI コンポーネント
// ============================================================================

type ImageCropperProps = {
  /**
   * クロップする画像ファイル
   */
  image: File | string;
  /**
   * キャンバスの横幅（ピクセル）
   * @default 400
   */
  canvasWidth?: number;
  /**
   * 画像のアスペクト比
   * @default 1
   */
  aspectRatio?: number;
  /**
   * クロップ後の横幅（ピクセル）
   */
  resultWidth: number;
  /**
   * 円形でクロップするか
   * @default false
   */
  circular?: boolean;
  /**
   * クロップ完了時のコールバック
   * @param dataUrl - JPEG形式のData URL
   * @param blob - JPEG形式のBlob
   */
  onCrop?: (dataUrl: string, blob: Blob) => void;
  /**
   * キャンセル時のコールバック
   */
  onCancel?: () => void;
};

export function ImageCropper({
  image,
  canvasWidth = 400,
  aspectRatio = 1,
  resultWidth,
  circular = false,
  onCrop,
  onCancel,
}: ImageCropperProps) {
  const editor = useRef<AvatarEditor>(null);
  const [scale, setScale] = useState(1.0);

  const cropImage = async () => {
    const canvas = editor.current?.getImage();
    if (!canvas) return;

    const dataUrl = canvas.toDataURL("image/jpeg");

    canvas.toBlob((blob) => {
      if (blob) {
        onCrop?.(dataUrl, blob);
      }
    }, "image/jpeg");
  };

  const canvasHeight = canvasWidth / aspectRatio;
  const borderRadius = circular ? canvasWidth / 2 : 0;

  return (
    <div className="w-full">
      <div
        className={cn(
          "border relative overflow-hidden mx-auto",
          circular && "rounded-full"
        )}
        style={{
          aspectRatio,
          maxWidth: canvasWidth,
        }}
      >
        <AvatarEditor
          className="absolute max-w-full max-h-full inset-0"
          scale={scale}
          ref={editor}
          width={canvasWidth}
          height={canvasHeight}
          image={image}
          borderRadius={borderRadius}
        />
      </div>

      <div className="my-4">
        <Slider
          max={2}
          step={0.01}
          min={1}
          defaultValue={[1]}
          onValueChange={([value]) => setScale(value ?? 1)}
        />
      </div>

      <div className="flex gap-2 justify-end">
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            閉じる
          </Button>
        )}
        <Button autoFocus onClick={cropImage}>
          切り取る
        </Button>
      </div>
    </div>
  );
}

// ============================================================================
// ImageCropperFileSelector - ファイル選択コンポーネント
// ============================================================================

type ImageCropperFileSelectorProps = {
  /**
   * ファイルが選択された時のコールバック
   */
  onFileSelect: (file: File) => void;
  /**
   * 入力画像の最大サイズ（バイト）
   * @default 4MB
   */
  maxSize?: number;
  /**
   * カスタムクラス名（width と aspect-ratio を含む）
   */
  className?: string;
  /**
   * 無効化フラグ
   */
  disabled?: boolean;
  /**
   * 子要素（プレビューなど）
   */
  children?: React.ReactNode;
};

export function ImageCropperFileSelector({
  onFileSelect,
  maxSize = 1024 * 1024 * 4, // 4MB
  className,
  disabled = false,
  children,
}: ImageCropperFileSelectorProps) {
  const { getRootProps, getInputProps, isDragAccept } = useDropzone({
    maxSize,
    multiple: false,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/webp": [],
    },
    useFsAccessApi: false,
    disabled,
    onDropAccepted: (dropped) => {
      if (dropped[0]) {
        onFileSelect(dropped[0]);
      }
    },
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border rounded-md cursor-pointer relative overflow-hidden",
        "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:outline-none ring-offset-background",
        "w-full aspect-square", // デフォルトのサイズとアスペクト比
        isDragAccept ? "border-primary bg-primary/10" : "bg-muted",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {children || (
        <div className="grid place-content-center h-full">
          <ImagePlus className="size-8 text-muted-foreground opacity-30" />
        </div>
      )}

      <input {...getInputProps()} />
      <span className="sr-only">画像を選択</span>
    </div>
  );
}

// ============================================================================
// ImageCropperPreview - プレビュー表示コンポーネント
// ============================================================================

type ImageCropperPreviewProps = {
  /**
   * プレビュー画像のURL
   */
  src: string;
  /**
   * 代替テキスト
   */
  alt?: string;
  /**
   * 削除ボタンが押された時のコールバック
   */
  onRemove?: () => void;
  /**
   * 削除ボタンを表示するか
   * @default true
   */
  showRemoveButton?: boolean;
};

export function ImageCropperPreview({
  src,
  alt = "",
  onRemove,
  showRemoveButton = true,
}: ImageCropperPreviewProps) {
  return (
    <div className="relative w-full h-full ">
      <Image unoptimized className="object-cover" fill src={src} alt={alt} />

      {showRemoveButton && onRemove && (
        <Button
          type="button"
          variant="outline"
          className="absolute top-2 right-2 size-8 text-muted-foreground"
          size="icon"
          onClick={(e) => {
            e.stopPropagation(); // Dropzone のクリックを防ぐ
            onRemove();
          }}
        >
          <X size={20} />
          <span className="sr-only">イメージを削除</span>
        </Button>
      )}
    </div>
  );
}
