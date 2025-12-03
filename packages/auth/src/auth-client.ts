import { getBaseURL } from "@workspace/utils";
import {
  adminClient,
  anonymousClient,
  inferAdditionalFields,
  organizationClient,
  usernameClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { auth } from "./auth";

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    anonymousClient(),
    inferAdditionalFields<typeof auth>(),
    organizationClient({
      teams: {
        enabled: true,
      },
    }),
    usernameClient(),
    adminClient(),
  ],
});
