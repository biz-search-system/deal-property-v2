import {
  CONTRACT_TYPE_COLORS,
  CONTRACT_TYPE_LABELS,
  ContractType,
} from "@workspace/drizzle/constants";
import { Badge } from "@workspace/ui/components/badge";
import { cn } from "@workspace/utils";

export default function ContractTypeBadge({
  contractType,
}: {
  contractType: ContractType;
}) {
  const truncateText = (text: string | null, maxLength: number = 5) => {
    if (!text) return "-";
    return text.length > maxLength ? text.substring(0, maxLength) : text;
  };

  // const getContractTypeColor = (type: ContractType) => {
  //   // return CONTRACT_TYPE_COLORS[type];
  //   switch (type) {
  //     case "ab_bc":
  //       return "border-blue-400 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300";
  //     case "ac":
  //       return "border-green-400 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300";
  //     case "iyaku":
  //       return "border-red-400 bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300";
  //     case "hakushi":
  //       return "border-gray-400 bg-gray-50 text-gray-700 dark:bg-gray-950 dark:text-gray-300";
  //     case "mitei":
  //       return "border-slate-400 bg-slate-50 text-slate-700 dark:bg-slate-950 dark:text-slate-300";
  //     case "jisha":
  //       return "border-purple-400 bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300";
  //     case "bengoshi":
  //       return "border-amber-400 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300";
  //     case "kaichu":
  //       return "border-cyan-400 bg-cyan-50 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300";
  //     case "iyaku_yotei":
  //       return "border-orange-400 bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300";
  //   }
  // };

  return (
    <Badge
      variant="outline"
      // className={cn("text-[9px] px-1 py-0", getContractTypeColor(contractType))}
      className={cn("text-[9px] px-1 py-0", CONTRACT_TYPE_COLORS[contractType])}
    >
      {truncateText(CONTRACT_TYPE_LABELS[contractType])}
    </Badge>
  );
}
