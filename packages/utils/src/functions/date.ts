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

/**
 * 日付を日本時間のYYYY-MM-DD形式の文字列に変換
 * @param date 日付
 * @returns 日本時間でのYYYY-MM-DD形式の文字列
 * @example toJstDateKey(new Date()) // "2025-01-15"
 */
export const toJstDateKey = (date: DateInput): string => {
  if (!date) return "";
  const dateObj =
    typeof date === "string" || typeof date === "number"
      ? new Date(date)
      : date;
  if (isNaN(dateObj.getTime())) return "";

  return dateObj
    .toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "Asia/Tokyo",
    })
    .replace(/\//g, "-");
};

/**
 * YYYY-MM-DD形式の日付文字列をM/D形式に変換
 * @param dateKey YYYY-MM-DD形式の日付文字列
 * @returns M/D形式の文字列
 * @example formatShortDate("2025-01-15") // "1/15"
 */
export const formatShortDate = (dateKey: string): string => {
  const [, month, day] = dateKey.split("-");
  if (!month || !day) return "";
  return `${Number(month)}/${Number(day)}`;
};

/**
 * 日本時間（JST）基準で月末予定かどうかを判定
 * 月末日かつ午前0時0分10秒（JST）の場合は月末予定
 * @param date 判定する日付
 * @returns 月末予定かどうか
 */
export const isMonthEndScheduled = (date: Date): boolean => {
  // JSTに変換して判定（UTC+9）
  const jstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  const year = jstDate.getUTCFullYear();
  const month = jstDate.getUTCMonth();
  const lastDayOfMonth = new Date(Date.UTC(year, month + 1, 0));

  return (
    jstDate.getUTCHours() === 0 &&
    jstDate.getUTCMinutes() === 0 &&
    jstDate.getUTCSeconds() === 10 &&
    jstDate.getUTCMilliseconds() === 0 &&
    jstDate.getUTCDate() === lastDayOfMonth.getUTCDate()
  );
};

/**
 * 月末予定用の日付を生成（日本時間で午前0時0分10秒）
 * @param date 基準となる日付（この月の月末を生成）
 * @returns 月末予定の日付（Date）- ISO文字列に変換するとJST 00:00:10がUTCで保存される
 */
export const createMonthEndDate = (date: Date): Date => {
  const year = date.getFullYear();
  const month = date.getMonth();
  // 月末日を取得
  const lastDay = new Date(year, month + 1, 0).getDate();
  // JST基準で月末日の00:00:10を設定（UTC-9時間 = 前日15:00:10）
  return new Date(Date.UTC(year, month, lastDay - 1, 15, 0, 10, 0));
};

/**
 * 日付を月末予定を考慮してフォーマット（日本時間基準）
 * 月末予定の場合は「○月末予定」、通常は「M/D(曜日)」形式
 * @param dateValue 日付
 * @returns フォーマットされた文字列
 */
export const formatDateWithMonthEnd = (
  dateValue: Date | string | null
): string => {
  if (!dateValue) return "-";
  const date = typeof dateValue === "string" ? new Date(dateValue) : dateValue;

  if (isNaN(date.getTime())) return "-";

  if (isMonthEndScheduled(date)) {
    // JSTに変換して月を取得
    const jstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
    return `${jstDate.getUTCMonth() + 1}月末予定`;
  }

  // JSTで表示
  const jstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  const days = ["日", "月", "火", "水", "木", "金", "土"];
  return `${jstDate.getUTCMonth() + 1}/${jstDate.getUTCDate()}(${days[jstDate.getUTCDay()]})`;
};
