import { pets } from "@/db/schemas/pet";

export type Pet = typeof pets.$inferSelect;
