import { db } from "@workspace/drizzle/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import {
  anonymous,
  organization,
  username,
  emailOTP,
  admin,
  magicLink,
} from "better-auth/plugins";
import { getBaseURL, customNanoid } from "@workspace/utils";
import { resend } from "@workspace/email/resend";
import InvitationEmail from "@workspace/email/templates/invitation";
import PasswordResetEmail from "@workspace/email/templates/password-reset";
import { eq } from "drizzle-orm";
import { teams } from "@workspace/drizzle/schemas";

/**
 * チーム名を取得
 * @param teamId - チームID
 * @returns - チーム名
 */
export async function getTeamName(teamId: string) {
  const team = await db.query.teams.findFirst({
    where: eq(teams.id, teamId),
  });
  if (!team) {
    throw new Error("Team not found");
  }

  return team.name;
}

export const auth = betterAuth({
  baseURL: getBaseURL(),
  database: drizzleAdapter(db, {
    provider: "sqlite",
    usePlural: true,
  }),
  advanced: {
    database: {
      generateId: () => customNanoid(10),
    },
  },
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      const email = user.email;
      const resetPasswordLink = `${getBaseURL()}/reset-password?token=${token}`;
      const result = await resend.emails.send({
        from: "Password-Reset@biz-search.tech",
        to: email,
        subject: `パスワードリセットのご案内`,
        react: PasswordResetEmail({
          email: email,
          resetUrl: resetPasswordLink,
        }),
      });
      console.log(result);
    },
    onPasswordReset: async ({ user }, request) => {
      // your logic here
      console.log(`Password for user ${user.email} has been reset.`);
    },
  },
  plugins: [
    anonymous(),
    username(),
    nextCookies(),
    organization({
      // チーム機能を有効化
      teams: {
        enabled: true,
        // デフォルトチームの自動作成を無効化（必要に応じて有効化）
        defaultTeam: {
          enabled: false, // true にすると組織作成時に同名のチームが自動作成される
        },
      },
      async sendInvitationEmail(data) {
        const invitationId = data.id;
        const inviterEmail = data.inviter.user.email;
        // サインアップページへの直接リンク（組織名を含む）
        const inviteLink = `${getBaseURL()}/signup?id=${invitationId}&email=${encodeURIComponent(
          data.email
        )}&org=${encodeURIComponent(data.organization.name)}`;
        const teamId = data.invitation?.teamId;
        const teamName = teamId ? await getTeamName(teamId) : null;
        await resend.emails.send({
          from: "noreply@biz-search.tech",
          to: data.email,
          subject: `${data.organization.name}への招待`,
          react: InvitationEmail({
            organizationName: data.organization.name,
            inviterName: data.inviter.user.name,
            inviterEmail,
            inviteLink,
            recipientEmail: data.email,
            teamName: teamName,
          }),
        });
      },
    }),
    admin(),
  ],
});
