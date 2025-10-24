import { users } from "./auth";
import { relations } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { id } from "@/db/column-helper";

export const petType = ["dog", "cat"] as const;
export type PetType = (typeof petType)[number];

// ペットテーブルの定義
export const pets = sqliteTable("pets", {
  id,
  name: text("name").notNull(),
  type: text("type", { enum: petType }).notNull(),
  hp: integer("hp").notNull().default(50),
  ownerId: text("owner_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const petRelations = relations(pets, ({ one }) => ({
  owner: one(users, {
    fields: [pets.ownerId],
    references: [users.id],
  }),
}));
