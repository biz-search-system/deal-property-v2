import { Checkbox } from "@workspace/ui/components/checkbox";
import { Label } from "@workspace/ui/components/label";

interface CheckItemRowProps {
  label: string;
  checked: boolean;
  date?: string;
  user?: string;
  onChange?: (checked: boolean) => void;
}

export function CheckItemRow({
  label,
  checked,
  date,
  user,
  onChange,
}: CheckItemRowProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2">
        <Checkbox checked={checked} onCheckedChange={onChange} />
        <Label className="cursor-pointer">{label}</Label>
      </div>
      {checked && (date || user) && (
        <div className="text-xs text-muted-foreground">
          {date && <span>{date}</span>}
          {user && <span className="ml-2">{user}</span>}
        </div>
      )}
    </div>
  );
}