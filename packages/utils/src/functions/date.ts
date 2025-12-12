import {
  format,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
} from "date-fns";
import { ja } from "date-fns/locale/ja";

type DateInput = Date | string | number | null | undefined;

/**
 * 日付を「yyyy年M月d日(E)」形式でフォーマット
 * @example formatToJapaneseDate(new Date()) // "2024年1月15日(月)"
 */
export const formatToJapaneseDate = (
  timestamp: number | string | Date = Date.now()
): string => {
  const formattedDate = format(timestamp, "yyyy年M月d日(E)", {
    locale: ja,
  });
  return formattedDate;
};

/**
 * 日時を日本語フォーマットで返す
 * @param timestamp 日付を表す値
 * @param formatString フォーマット文字列（デフォルト: "yyyy年MM月dd日 HH時mm分ss秒（E）"）
 */
export const formatToJapaneseDateTime = (
  timestamp: Date | number | string = Date.now(),
  formatString = "yyyy年MM月dd日 HH時mm分ss秒（E）"
): string => {
  return format(new Date(timestamp), formatString, {
    locale: ja,
  });
};

/**
 * 日付を曜日付きでフォーマット（nullの場合は"-"を返す）
 * @param date 日付
 * @returns フォーマットされた日付文字列（例: "2024年1月15日(月)"）
 */
export const formatDateWithDay = (date: DateInput): string => {
  if (!date) return "-";
  try {
    const dateObj =
      typeof date === "string" || typeof date === "number"
        ? new Date(date)
        : date;
    if (isNaN(dateObj.getTime())) return "-";
    return format(dateObj, "yyyy年M月d日(E)", { locale: ja });
  } catch {
    return "-";
  }
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
