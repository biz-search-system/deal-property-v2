"use client";

import { Clock } from "lucide-react";
import { formatToJapaneseDateTime } from "@workspace/utils";
import type { Maintenance } from "@/lib/types/maintenance";

interface MaintenanceTimerProps {
  maintenance: Maintenance | null | undefined;
}

export function MaintenanceTimer({ maintenance }: MaintenanceTimerProps) {
  return (
    <div className="rounded-lg bg-muted/50 p-4 space-y-2">
      <div className="flex items-center justify-center gap-2 text-sm">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium">メンテナンス時間</span>
      </div>
      <p className="text-sm text-muted-foreground">
        {maintenance?.startTime && maintenance?.endTime ? (
          <>
            {formatToJapaneseDateTime(
              new Date(maintenance.startTime + ":00+09:00"),
              "M月d日 HH:mm"
            )}
            {" 〜 "}
            {formatToJapaneseDateTime(
              new Date(maintenance.endTime + ":00+09:00"),
              "HH:mm"
            )}
            {" 頃"}
          </>
        ) : maintenance?.endTime ? (
          <>
            {formatToJapaneseDateTime(
              new Date(maintenance.endTime + ":00+09:00"),
              "M月d日 HH:mm"
            )}
            {" 頃まで"}
          </>
        ) : (
          "完了までしばらくお待ちください"
        )}
      </p>
    </div>
  );
}
