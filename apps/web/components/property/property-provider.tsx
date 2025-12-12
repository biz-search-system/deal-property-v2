"use client";

import { createContext, useContext } from "react";
import type { PropertyDetail } from "@/lib/types/property";

type PropertyContextValue = NonNullable<PropertyDetail>;

const PropertyContext = createContext<PropertyContextValue | null>(null);

interface PropertyProviderProps {
  children: React.ReactNode;
  property?: PropertyContextValue | null;
}

export function PropertyProvider({
  children,
  property,
}: PropertyProviderProps) {
  return <PropertyContext value={property ?? null}>{children}</PropertyContext>;
}

// /**
//  * 必須でPropertyを取得する（編集画面用）
//  * PropertyProviderの外で使用するとエラーを投げる
//  */
// export function useProperty() {
//   const context = useContext(PropertyContext);
//   if (!context) {
//     throw new Error("useProperty must be used within a PropertyProvider");
//   }
//   return context;
// }

/**
 * オプショナルでPropertyを取得する（新規登録画面用）
 * PropertyProviderの外でも使用可能（nullを返す）
 */
export function usePropertyOptional() {
  return useContext(PropertyContext);
}
