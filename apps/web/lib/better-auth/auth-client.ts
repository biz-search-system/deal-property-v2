import { getBaseURL } from "@workspace/utils";
import {
  adminClient,
  anonymousClient,
  emailOTPClient,
  inferAdditionalFields,
  organizationClient,
  usernameClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
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
    emailOTPClient(),
    adminClient(),
    // magicLinkClient(),
  ],
});
