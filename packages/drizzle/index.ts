import { drizzle } from "drizzle-orm/libsql/web";
// まだ存在しない場合コメントアウト
import * as authSchema from "./schemas/auth";
import * as propertySchema from "./schemas/property";

export const db = drizzle({
  connection: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
  schema: {
    ...authSchema,
    ...propertySchema,
  },
});

export * from "./types/property";
export * from "./schemas/property";
