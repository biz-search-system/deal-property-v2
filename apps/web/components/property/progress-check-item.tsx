import { Check, X } from "lucide-react";
import { UserActionBadge } from "./user-action-badge";

interface UserInfo {
  name: string | null;
  email: string;
  image: string | null;
}

interface ProgressCheckItemProps {
  label: string;
  checked: boolean;
  date?: Date | string | null;
  user?: UserInfo | null;
}

export function ProgressCheckItem({
  label,
  checked,
  date,
  user,
}: ProgressCheckItemProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-center gap-2">
        {checked ? (
          <Check className="h-4 w-4 text-green-600 shrink-0" />
        ) : (
          <X className="h-4 w-4 text-muted-foreground shrink-0" />
        )}
        <span className={checked ? "text-foreground" : "text-muted-foreground"}>
          {label}
        </span>
      </div>
      {checked && date && (
        <UserActionBadge timestamp={new Date(date)} user={user} />
      )}
    </div>
  );
}
