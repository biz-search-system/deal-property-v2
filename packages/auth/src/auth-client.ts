import { createAuthClient } from "better-auth/react";
import { getBaseURL } from "@workspace/utils";
import {
  anonymousClient,
  emailOTPClient,
  inferAdditionalFields,
  organizationClient,
  usernameClient,
  adminClient,
  magicLinkClient,
} from "better-auth/client/plugins";
import type { auth } from "./auth";

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
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
