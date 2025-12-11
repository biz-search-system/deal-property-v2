import { sqliteTable, text, index } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { id, timestamps } from "../util";
import { organizations, users } from "./auth";

/**
 * マスタオプションのカテゴリ
 * - buyer_company: 買取業者
 * - mortgage_bank: 抵当銀行
 */
export const masterOptionCategory = [
  "buyer_company",
  "mortgage_bank",
] as const;

export type MasterOptionCategory = (typeof masterOptionCategory)[number];

/**
 * マスタオプションテーブル
 * 買取業者、抵当銀行などの動的選択肢を管理
 */
export const masterOptions = sqliteTable(
  "master_options",
  {
    id,
    category: text("category").notNull(),
    value: text("value").notNull(),
    organizationId: text("organization_id").references(() => organizations.id, {
      onDelete: "cascade",
    }),
    createdBy: text("created_by").references(() => users.id),
    ...timestamps,
  },
  (table) => [
    index("master_options_category_idx").on(table.category),
    index("master_options_org_idx").on(table.organizationId),
    index("master_options_category_org_idx").on(
      table.category,
      table.organizationId
    ),
  ]
);

export const masterOptionsRelations = relations(masterOptions, ({ one }) => ({
  organization: one(organizations, {
    fields: [masterOptions.organizationId],
    references: [organizations.id],
  }),
  createdByUser: one(users, {
    fields: [masterOptions.createdBy],
    references: [users.id],
  }),
}));
