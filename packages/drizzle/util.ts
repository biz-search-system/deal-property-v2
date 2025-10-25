import { integer, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { customNanoid } from "@workspace/utils";

export function customTimestamp(columnName: string) {
  return integer(columnName, { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull();
}

export function customTimestampNullable(columnName: string) {
  return integer(columnName, { mode: "timestamp_ms" });
}

export const timestamps = () => ({
  createdAt: customTimestamp("created_at"),
  updatedAt: customTimestamp("updated_at").$onUpdate(() => /* @__PURE__ */ new Date()),
});

export const id = text("id")
  .primaryKey()
  .$defaultFn(() => customNanoid(10));
