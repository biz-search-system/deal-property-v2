"use client";

import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@workspace/ui/components/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@workspace/ui/components/hover-card";
import { formatRelativeTime, formatToJapaneseDateTime } from "@workspace/utils";

interface UserInfo {
  name: string | null;
  email: string;
  image: string | null;
}

interface UserActionBadgeProps {
  timestamp: Date | null;
  user?: UserInfo | null;
}

export function UserActionBadge({ timestamp, user }: UserActionBadgeProps) {
  if (!timestamp) return null;

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
          <span>{formatRelativeTime(timestamp)}</span>
          {user?.name && <span>{user.name}</span>}
          <Avatar className="size-6">
            <AvatarImage src={user?.image ?? undefined} />
            <AvatarFallback className="text-[9px]">
              {user?.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-auto">
        <div className="flex gap-3">
          <Avatar className="size-10">
            <AvatarImage src={user?.image ?? undefined} />
            <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            {user?.name && (
              <p className="text-sm font-medium leading-none">{user.name}</p>
            )}
            {user?.email && (
              <p className="text-sm text-muted-foreground">{user.email}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {formatToJapaneseDateTime(timestamp)}
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
