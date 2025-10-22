import "server-only";

import { headers } from "next/headers";
import { auth } from "./auth";
import { redirect } from "next/navigation";

export const verifySession = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }
  return session;
};
