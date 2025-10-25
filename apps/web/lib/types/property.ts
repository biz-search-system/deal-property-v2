import type { getProperties, getPropertyById } from "@/lib/data/property";

export type PropertyWithRelations = Awaited<
  ReturnType<typeof getProperties>
>[number];
export type PropertyDetail = Awaited<ReturnType<typeof getPropertyById>>;
