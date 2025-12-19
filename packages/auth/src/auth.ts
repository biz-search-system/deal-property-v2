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
import { eq, sql } from "drizzle-orm";
import { teams, organizations } from "@workspace/drizzle/schemas";

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
      const resendDomain = process.env.RESEND_DOMAIN!;
      const result = await resend.emails.send({
        from: `パスワードリセット <password-reset@${resendDomain}>`,
        to: email,
        subject: `パスワードリセットのご案内`,
        react: PasswordResetEmail({
          email: email,
          resetUrl: resetPasswordLink,
          domain: resendDomain,
        }),
      });
      // console.log(result);
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
      schema: {
        organization: {
          additionalFields: {
            sortOrder: {
              type: "number",
              input: false,
              required: false,
            },
          },
        },
      },
      organizationHooks: {
        beforeCreateOrganization: async ({ organization }) => {
          // 現在の最大sortOrderを取得して+1
          const maxResult = await db
            .select({ max: sql<number>`COALESCE(MAX(sort_order), 0)` })
            .from(organizations)
            .get();

          const nextOrder = (maxResult?.max ?? 0) + 1;

          return {
            data: {
              ...organization,
              sortOrder: nextOrder,
            },
          };
        },
      },
      async sendInvitationEmail(data) {
        const invitationId = data.id;
        const inviterEmail = data.inviter.user.email;
        // サインアップページへの直接リンク（組織名を含む）
        const inviteLink = `${getBaseURL()}/signup?id=${invitationId}`;
        const teamId = data.invitation?.teamId;
        const teamName = teamId ? await getTeamName(teamId) : null;
        const resendDomain = process.env.RESEND_DOMAIN!;
        await resend.emails.send({
          from: `Deal Property <invitation@${resendDomain}>`,
          to: data.email,
          subject: `${data.organization.name}への招待`,
          react: InvitationEmail({
            organizationName: data.organization.name,
            inviterName: data.inviter.user.name,
            inviterEmail,
            inviteLink,
            recipientEmail: data.email,
            teamName: teamName,
            domain: resendDomain,
          }),
        });
      },
    }),
    admin(),
  ],
});
