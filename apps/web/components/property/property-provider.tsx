"use client";

import { createContext, useContext } from "react";
import type { PropertyDetail } from "@/lib/types/property";

type PropertyContextValue = NonNullable<PropertyDetail>;

const PropertyContext = createContext<PropertyContextValue | null>(null);

interface PropertyProviderProps {
  children: React.ReactNode;
  property: PropertyContextValue;
}

export function PropertyProvider({
  children,
  property,
}: PropertyProviderProps) {
  return <PropertyContext value={property}>{children}</PropertyContext>;
}

export function useProperty() {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error("useProperty must be used within a PropertyProvider");
  }
  return context;
}
