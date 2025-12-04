"use server";

import { auth } from "@workspace/auth";
import { ForgotPassword } from "@/lib/types/auth";

export async function forgotPasswordAction(data: ForgotPassword) {
  return await auth.api.requestPasswordReset({
    body: {
      email: data.email,
    },
  });
}
