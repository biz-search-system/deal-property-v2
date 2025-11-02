/**
 * テキストを指定された最大長で切り詰める
 * @param text 切り詰めるテキスト
 * @param maxLength 最大長
 * @returns 切り詰めたテキスト
 * デフォルトでは5文字で切り詰める
 */
export const truncateText = (text: string | null, maxLength: number = 5) => {
  if (!text) return "-";
  return text.length > maxLength ? text.substring(0, maxLength) : text;
};
