/**
 * アバター画像生成のユーティリティ関数
 */

/**
 * アバター表示用のテキストを生成
 * @param name - ユーザー名またはメールアドレス
 * @returns 大文字2文字のアバターテキスト
 */
export function getAvatarText(name: string | null | undefined): string {
  const displayName = name || "";
  return displayName.substring(0, 2).toUpperCase();
}

/**
 * Vercel Avatar APIのURLを生成
 * @param options - アバター生成オプション
 * @returns アバター画像のURL
 */
export function getAvatarUrl(options: {
  username?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
}) {
  const { username, email, avatarUrl } = options;

  // 表示名の決定（username優先）
  const displayName = username || email || "";

  // URLエンコード用の識別子を生成
  // emailの場合は@より前の部分を使用し、ドットを除去
  let identifier = displayName;
  if (!username && email) {
    identifier = email.split("@")[0].replace(/\./g, "");
  }

  const encodedIdentifier = encodeURIComponent(identifier);
  const avatarText = getAvatarText(displayName);

  return {
    text: avatarText,
    url:
      avatarUrl ??
      `https://avatar.vercel.sh/${encodedIdentifier}.svg?text=${avatarText}`,
  };
}
