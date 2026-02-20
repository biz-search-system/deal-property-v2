"use client";

import type { MaisokuTemplate } from "./maisoku-editor";
import { cn } from "@workspace/ui/lib/utils";

interface MaisokuTemplateSelectorProps {
  value: MaisokuTemplate;
  onChange: (value: MaisokuTemplate) => void;
}

const templates: { id: MaisokuTemplate; label: string; description: string }[] =
  [
    {
      id: "template-a",
      label: "テンプレートA",
      description: "左に画像2枚（縦並び）、右に物件情報テーブル",
    },
    {
      id: "template-b",
      label: "テンプレートB",
      description: "上部に物件情報、下部に画像3枚（横並び）",
    },
  ];

export function MaisokuTemplateSelector({
  value,
  onChange,
}: MaisokuTemplateSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {templates.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onChange(t.id)}
          className={cn(
            "flex flex-col items-center gap-1 rounded-lg border p-3 text-left transition-colors",
            value === t.id
              ? "border-primary bg-primary/5"
              : "hover:border-muted-foreground/50"
          )}
        >
          <span className="text-xs font-medium">{t.label}</span>
          <span className="text-[10px] text-muted-foreground leading-tight text-center">
            {t.description}
          </span>
        </button>
      ))}
    </div>
  );
}
