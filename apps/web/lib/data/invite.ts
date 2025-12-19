import "server-only";

import { db } from "@workspace/drizzle/db";
import { invitations } from "@workspace/drizzle/schemas";
import { and, eq } from "drizzle-orm";

/**
 * invitationsテーブルからinviter_idを検索して、メールアドレスのみを取得
 * @param inviterId - inviter_id
 * @returns - メールアドレス, 組織名
 */
export async function getInvitationByInvitationId(invitationId: string) {
  const data = await db.query.invitations.findFirst({
    columns: { email: true },
    with: {
      organizations: {
        columns: { name: true },
      },
    },
    where: and(
      eq(invitations.id, invitationId),
      eq(invitations.status, "pending")
    ),
  });

  return data;
}
