import "server-only";

import { headers } from "next/headers";

import { redirect } from "next/navigation";
import { auth } from "@workspace/auth";

export const verifySession = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }
  return session;
};
