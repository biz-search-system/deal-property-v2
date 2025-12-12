import {
  PROGRESS_STATUS_COLORS,
  PROGRESS_STATUS_LABELS,
} from "@workspace/utils";
import { Badge } from "@workspace/ui/components/badge";
import { cn } from "@workspace/utils";
import { truncateText } from "@/lib/property";
import { ProgressStatus } from "@workspace/drizzle/types";

interface ProgressStatusBadgeProps {
  progressStatus: ProgressStatus;
  onClick?: () => void;
  maxLength?: number;
  className?: string;
  size?: "small" | "medium";
}

export default function ProgressStatusBadge({
  progressStatus,
  onClick,
  maxLength = 6,
  className,
  size = "small",
}: ProgressStatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        size === "small" && "text-[9px] px-1 py-0 border",
        size === "medium" && "text-xs",
        onClick && "cursor-pointer",
        PROGRESS_STATUS_COLORS[progressStatus],
        className
      )}
      onClick={onClick}
    >
      {truncateText(PROGRESS_STATUS_LABELS[progressStatus], maxLength)}
    </Badge>
  );
}
