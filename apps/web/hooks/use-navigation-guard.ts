"use client";

import { useEffect } from "react";

/**
 * フォームの未保存変更がある場合にページ離脱を防止するフック
 * - ブラウザのタブを閉じる/リロード時に確認ダイアログを表示
 * - リンククリック時に確認ダイアログを表示
 */
export const useNavigationGuard = (isDirty: boolean) => {
  useEffect(() => {
    // リンククリック時の離脱防止
    const handleClick = (event: MouseEvent) => {
      if (
        isDirty &&
        event.target instanceof Element &&
        event.target.closest('a:not([target="_blank"])')
      ) {
        if (!window.confirm("変更が保存されていません。ページを離れますか？")) {
          event.preventDefault();
          event.stopPropagation();
        }
      }
    };

    // タブを閉じる/リロード時の離脱防止
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isDirty) {
        event.preventDefault();
        return (event.returnValue = "");
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("click", handleClick, true);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("click", handleClick, true);
    };
  }, [isDirty]);
};
