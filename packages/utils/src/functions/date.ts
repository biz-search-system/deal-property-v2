import {
  format,
  formatDistanceToNow,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
} from "date-fns";
import { ja } from "date-fns/locale/ja";

export const formatToJapaneseDate = (
  timestamp: number | string | Date = Date.now()
) => {
  const formattedDate = format(timestamp, "yyyy年MM月dd日(E)", {
    locale: ja,
  });
  return formattedDate;
};

export const formatToJapaneseDateTime = (
  timestamp: Date | number | string = Date.now(),
  formatString = "yyyy年MM月dd日  HH時mm分ss秒（E）"
) => {
  return format(new Date(timestamp), formatString, {
    locale: ja,
  });
};

/**
 * 相対時間を日本語フォーマットで返す
 * @param timestamp 日付を表す数値、文字列、またはDateオブジェクト
 * @returns フォーマットされた相対時間文字列
 * @example
 * // 1時間前
 * formatRelativeTime(new Date(Date.now() - 60 * 60 * 1000)); // "1時間前"
 * // 2日前
 * formatRelativeTime(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)); // "2日前"
 * // 7日以上前
 * formatRelativeTime(new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)); // "1月10日"
 */
export const formatRelativeTime = (
  timestamp: Date | number | string | null | undefined
): string => {
  if (!timestamp) return "-";

  const date = new Date(timestamp);
  const now = new Date();
  const minutesAgo = differenceInMinutes(now, date);
  const hoursAgo = differenceInHours(now, date);
  const daysAgo = differenceInDays(now, date);

  // 5分未満
  if (minutesAgo < 5) {
    return "たった今";
  }

  // 1時間未満
  if (minutesAgo < 60) {
    return `${minutesAgo}分前`;
  }

  // 24時間未満
  if (hoursAgo < 24) {
    return `${hoursAgo}時間前`;
  }

  // 7日未満
  if (daysAgo < 7) {
    return `${daysAgo}日前`;
  }

  // 7日以上
  // 同じ年の場合は月日のみ、違う年の場合は年も含める
  const isSameYear = date.getFullYear() === now.getFullYear();
  return format(date, isSameYear ? "M月d日" : "yyyy年M月d日", { locale: ja });
};
