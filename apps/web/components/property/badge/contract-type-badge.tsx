import { CONTRACT_TYPE_COLORS, CONTRACT_TYPE_LABELS } from "@workspace/utils";
import { Badge } from "@workspace/ui/components/badge";
import { cn } from "@workspace/utils";
import { truncateText } from "@/lib/property";
import { ContractType } from "@workspace/drizzle/types";

export default function ContractTypeBadge({
  contractType,
}: {
  contractType: ContractType | null;
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-[9px] px-1 py-0",
        contractType && CONTRACT_TYPE_COLORS[contractType]
      )}
    >
      {truncateText(
        (contractType && CONTRACT_TYPE_LABELS[contractType]) || null
      )}
    </Badge>
  );
}
