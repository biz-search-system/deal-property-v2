import { verifySession } from "@/lib/data/sesstion";
import { contractType } from "@workspace/drizzle/types/property";

export type VerifiedSession = Awaited<ReturnType<typeof verifySession>>;

export interface VerifiedSessionResponse {
  verifiedSession?: VerifiedSession;
  error?: string;
}
