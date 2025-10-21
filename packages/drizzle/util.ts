import { integer, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { customNanoid } from "@workspace/utils";

export const timestamps = {
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
};

export const id = text("id")
  .primaryKey()
  .$defaultFn(() => customNanoid(10));
