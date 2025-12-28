import { drizzle } from "drizzle-orm/libsql/web";
import * as schemas from "./schemas/index";

// Drizzle インスタンスの初期化
export const db = drizzle({
  connection: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
  schema: {
    ...schemas,
  },
});
