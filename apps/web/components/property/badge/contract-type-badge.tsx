import { CONTRACT_TYPE_COLORS, CONTRACT_TYPE_LABELS } from "@workspace/utils";
import { Badge } from "@workspace/ui/components/badge";
import { cn } from "@workspace/utils";
import { truncateText } from "@/lib/property";
import { ContractType } from "@workspace/drizzle/types";

export default function ContractTypeBadge({
  contractType,
  size = "small",
}: {
  contractType: ContractType | null;
  size?: "small" | "medium";
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        size === "small" && "text-[9px] px-1 py-0",
        size === "medium" && "text-xs",
        contractType && CONTRACT_TYPE_COLORS[contractType]
      )}
    >
      {truncateText(
        (contractType && CONTRACT_TYPE_LABELS[contractType]) || null
      )}
    </Badge>
  );
}
