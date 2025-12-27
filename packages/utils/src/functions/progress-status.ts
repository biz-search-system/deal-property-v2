import {
  MONTH_END_RESTRICTED_STATUSES,
  SETTLEMENT_DATE_REQUIRED_STATUSES,
} from "../constants/progress-status";

/**
 * 月末予定かどうかを判定するヘルパー関数
 * 月末日かつ午前0時0分10秒の場合は月末予定
 */
export function isMonthEndScheduled(date: Date): boolean {
  const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return (
    date.getHours() === 0 &&
    date.getMinutes() === 0 &&
    date.getSeconds() === 10 &&
    date.getMilliseconds() === 0 &&
    date.getDate() === lastDayOfMonth.getDate()
  );
}

/**
 * 進捗ステータスと決済日の整合性をチェック
 * - 決済日がnullの場合、BC確定前以外は設定不可
 * - 決済日が月末予定の場合、精算CB待ち/決済待ち/決済完了は設定不可
 * @returns エラーメッセージ（問題なければnull）
 */
export function validateProgressStatusWithSettlementDate(
  progressStatus: string | undefined,
  settlementDate: Date | string | null | undefined
): string | null {
  if (!progressStatus) return null;

  // 決済日がnull/undefined/空文字の場合
  if (!settlementDate || settlementDate === "") {
    // BC確定前以外のステータスは設定不可
    const requiresSettlementDate = (
      SETTLEMENT_DATE_REQUIRED_STATUSES as readonly string[]
    ).includes(progressStatus);

    if (requiresSettlementDate) {
      return "決済日を設定してから進捗を更新してください";
    }
    return null;
  }

  // 決済日をDateオブジェクトに変換
  const settlementDateObj =
    typeof settlementDate === "string"
      ? new Date(settlementDate)
      : settlementDate;

  // 無効な日付の場合
  if (isNaN(settlementDateObj.getTime())) {
    const requiresSettlementDate = (
      SETTLEMENT_DATE_REQUIRED_STATUSES as readonly string[]
    ).includes(progressStatus);

    if (requiresSettlementDate) {
      return "決済日を設定してから進捗を更新してください";
    }
    return null;
  }

  // 月末予定の場合は制限対象のステータスへの変更を制限
  if (isMonthEndScheduled(settlementDateObj)) {
    const isMonthEndRestricted = (
      MONTH_END_RESTRICTED_STATUSES as readonly string[]
    ).includes(progressStatus);

    if (isMonthEndRestricted) {
      return "決済日の月末予定を確定させてから進捗を更新してください";
    }
  }

  return null;
}
