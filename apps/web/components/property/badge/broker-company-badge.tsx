import { BROKER_COMPANY_COLORS, BROKER_COMPANY_LABELS } from "@workspace/utils";
import { Badge } from "@workspace/ui/components/badge";
import { cn } from "@workspace/utils";
import { truncateText } from "@/lib/property";
import { BrokerCompany } from "@workspace/drizzle/types";

export default function BrokerCompanyBadge({
  brokerCompany,
}: {
  brokerCompany: BrokerCompany | null;
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-[9px] px-1 py-0",
        brokerCompany && BROKER_COMPANY_COLORS[brokerCompany]
      )}
    >
      {truncateText(
        (brokerCompany && BROKER_COMPANY_LABELS[brokerCompany]) || null
      )}
    </Badge>
  );
}
