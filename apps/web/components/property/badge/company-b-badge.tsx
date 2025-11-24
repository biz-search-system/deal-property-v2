import { COMPANY_B_COLORS, COMPANY_B_LABELS } from "@workspace/utils";
import { Badge } from "@workspace/ui/components/badge";
import { cn } from "@workspace/utils";
import { truncateText } from "@/lib/property";
import { CompanyB } from "@workspace/drizzle/types";

export default function CompanyBBadge({
  companyB,
}: {
  companyB: CompanyB | null;
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-[9px] px-1 py-0",
        companyB && COMPANY_B_COLORS[companyB],
      )}
    >
      {truncateText((companyB && COMPANY_B_LABELS[companyB]) || null)}
    </Badge>
  );
}
