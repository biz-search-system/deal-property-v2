import { verifySession } from "@/lib/better-auth/sesstion";

export type VerifiedSession = Awaited<ReturnType<typeof verifySession>>;

export interface VerifiedSessionResponse {
  verifiedSession?: VerifiedSession;
  error?: string;
}
