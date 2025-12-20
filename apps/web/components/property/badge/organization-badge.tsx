import {
  ORGANIZATION_COLORS,
  ORGANIZATION_LABELS,
  OrganizationSlugType,
} from "@workspace/utils";
import { Badge } from "@workspace/ui/components/badge";
import { cn } from "@workspace/utils";
import { truncateText } from "@/lib/property";

export default function OrganizationBadge({
  organizationSlug,
  className,
  size = "small",
}: {
  organizationSlug: OrganizationSlugType | null;
  className?: string;
  size?: "small" | "medium";
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        size === "small" && "text-[9px] px-1 py-0",
        size === "medium" && "text-xs",
        organizationSlug && ORGANIZATION_COLORS[organizationSlug],
        className
      )}
    >
      {truncateText(
        (organizationSlug && ORGANIZATION_LABELS[organizationSlug]) || null
      )}
    </Badge>
  );
}
