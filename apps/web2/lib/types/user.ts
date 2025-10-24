import { verifySession } from "@/lib/sesstion";

export type VerifiedSession = Awaited<ReturnType<typeof verifySession>>;

export interface VerifiedSessionResponse {
  verifiedSession?: VerifiedSession;
  error?: string;
}
