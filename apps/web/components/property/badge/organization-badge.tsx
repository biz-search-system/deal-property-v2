import {
  ORGANIZATION_COLORS,
  ORGANIZATION_LABELS,
  OrganizationNameType,
} from "@workspace/utils";
import { Badge } from "@workspace/ui/components/badge";
import { cn } from "@workspace/utils";
import { truncateText } from "@/lib/property";

export default function OrganizationBadge({
  organization,
  className,
  size = "small",
}: {
  organization: OrganizationNameType | null;
  className?: string;
  size?: "small" | "medium";
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        size === "small" && "text-[9px] px-1 py-0",
        size === "medium" && "text-xs",
        organization && ORGANIZATION_COLORS[organization],
        className
      )}
    >
      {truncateText(
        (organization && ORGANIZATION_LABELS[organization]) || null
      )}
    </Badge>
  );
}
