import { mutate } from "swr";

/**
 * プレフィックスベースでキャッシュを一括更新
 * @param prefix - 更新対象のURLプレフィックス（文字列または配列）
 */
export const mutatePrefix = (prefix: string | string[]) =>
  mutate(
    (key) =>
      typeof key === "string" &&
      (Array.isArray(prefix)
        ? prefix.some((p) => key.startsWith(p))
        : key.startsWith(prefix)),
    undefined,
    { revalidate: true },
  );

/**
 * 認証関連データの一括更新
 * ログイン後や組織切り替え時に使用
 */
export const refreshAuthenticatedData = async () => {
  await Promise.all([
    mutate("/api/session"),
    mutatePrefix("/api/organization"),
    mutatePrefix("/api/team"),
  ]);
};

/**
 * 特定組織のデータを一括更新
 * @param orgId - 組織ID
 */
export const refreshOrganizationData = async (orgId: string) => {
  await mutatePrefix(`/api/organization/${orgId}`);
};

/**
 * 全キャッシュをクリア
 * ログアウト時に使用
 */
export const clearAllCache = async () => {
  await mutate(() => true, undefined, { revalidate: false });
};
