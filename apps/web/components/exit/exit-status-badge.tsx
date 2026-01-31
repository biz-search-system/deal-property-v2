"use client";

import type { ExitStatus } from "@/lib/types/exit";
import { EXIT_STATUS_COLORS, EXIT_STATUS_LABELS } from "@/lib/types/exit";
import { Badge } from "@workspace/ui/components/badge";
import { cn } from "@workspace/utils";

interface ExitStatusBadgeProps {
  status: ExitStatus;
  onClick?: () => void;
  className?: string;
  size?: "small" | "medium";
}

export function ExitStatusBadge({
  status,
  onClick,
  className,
  size = "small",
}: ExitStatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        size === "small" && "text-[9px] px-1 py-0 border",
        size === "medium" && "text-xs",
        onClick && "cursor-pointer",
        EXIT_STATUS_COLORS[status],
        className
      )}
      onClick={onClick}
    >
      {EXIT_STATUS_LABELS[status]}
    </Badge>
  );
}
