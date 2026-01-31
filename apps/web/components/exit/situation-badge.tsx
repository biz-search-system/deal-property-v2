"use client";

import type { Situation } from "@/lib/types/exit";
import { SITUATION_COLORS, SITUATION_LABELS } from "@/lib/types/exit";
import { Badge } from "@workspace/ui/components/badge";
import { cn } from "@workspace/utils";

interface SituationBadgeProps {
  situation: Situation | null;
  onClick?: () => void;
  className?: string;
  size?: "small" | "medium";
}

export function SituationBadge({
  situation,
  onClick,
  className,
  size = "small",
}: SituationBadgeProps) {
  if (!situation) return <span className="text-muted-foreground">-</span>;

  return (
    <Badge
      variant="outline"
      className={cn(
        size === "small" && "text-[9px] px-1 py-0 border",
        size === "medium" && "text-xs",
        onClick && "cursor-pointer",
        SITUATION_COLORS[situation],
        className
      )}
      onClick={onClick}
    >
      {SITUATION_LABELS[situation]}
    </Badge>
  );
}
