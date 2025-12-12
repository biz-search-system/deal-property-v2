import {
  DOCUMENT_STATUS_COLORS,
  DOCUMENT_STATUS_LABELS,
} from "@workspace/utils";

import { Badge } from "@workspace/ui/components/badge";
import { cn } from "@workspace/utils";
import { truncateText } from "@/lib/property";
import { DocumentStatus } from "@workspace/drizzle/types";

interface DocumentStatusBadgeProps {
  documentStatus: DocumentStatus;
  onClick?: () => void;
  maxLength?: number;
  className?: string;
  size?: "small" | "medium";
}

export default function DocumentStatusBadge({
  documentStatus,
  onClick,
  maxLength = 8,
  className,
  size = "small",
}: DocumentStatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        size === "small" && "text-[9px] px-1 py-0 border",
        size === "medium" && "text-xs",
        onClick && "cursor-pointer",
        DOCUMENT_STATUS_COLORS[documentStatus],
        className
      )}
      onClick={onClick}
    >
      {truncateText(DOCUMENT_STATUS_LABELS[documentStatus], maxLength)}
    </Badge>
  );
}
