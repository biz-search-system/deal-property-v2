import { sqliteTable, text, index } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { id, timestamps } from "../util";
import { users } from "./auth";

/**
 * セレクトオプションのカテゴリ
 * - buyer_company: 買取業者
 * - mortgage_bank: 抵当銀行
 */
export const selectOptionCategory = [
  "buyer_company",
  "mortgage_bank",
] as const;

export type SelectOptionCategory = (typeof selectOptionCategory)[number];

/**
 * セレクトオプションテーブル
 * 買取業者、抵当銀行などの動的選択肢を管理
 * 全組織共通で使用される
 */
export const selectOptions = sqliteTable(
  "select_options",
  {
    id,
    category: text("category").notNull(),
    value: text("value").notNull(),
    createdBy: text("created_by").references(() => users.id, {
      onDelete: "set null",
    }),
    ...timestamps,
  },
  (table) => [index("select_options_category_idx").on(table.category)]
);

export const selectOptionsRelations = relations(selectOptions, ({ one }) => ({
  createdByUser: one(users, {
    fields: [selectOptions.createdBy],
    references: [users.id],
  }),
}));
