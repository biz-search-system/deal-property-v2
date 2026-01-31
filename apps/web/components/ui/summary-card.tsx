import { cn } from "@workspace/ui/lib/utils";

export interface SummaryItem {
  label: string;
  value: number | string;
  unit?: string;
  className?: string;
}

interface SummaryCardGridProps {
  items: SummaryItem[];
  columns?: 4 | 5;
}

export function SummaryCardGrid({ items, columns = 4 }: SummaryCardGridProps) {
  return (
    <div
      className={cn(
        "grid shrink-0 gap-2",
        columns === 5 ? "grid-cols-5" : "grid-cols-4"
      )}
    >
      {items.map((item, index) => (
        <SummaryCard key={index} {...item} />
      ))}
    </div>
  );
}

function SummaryCard({ label, value, unit = "件", className }: SummaryItem) {
  return (
    <div className="rounded-lg bg-muted/50 px-3 py-2 border">
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className={cn("text-sm font-bold", className)}>
          {value}
          {unit}
        </span>
      </div>
    </div>
  );
}
