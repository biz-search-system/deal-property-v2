import { db } from "@workspace/drizzle/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { anonymous, organization, username } from "better-auth/plugins";
import { getBaseURL } from "@/lib/get-base-url";
import { nanoid } from "nanoid";

export function generateId() {
  return nanoid(10);
}

export const auth = betterAuth({
  baseURL: getBaseURL(),
  database: drizzleAdapter(db, {
    provider: "sqlite",
    usePlural: true,
  }),
  advanced: {
    database: {
      generateId: generateId,
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  plugins: [anonymous(), username(), nextCookies(), organization()],
});
