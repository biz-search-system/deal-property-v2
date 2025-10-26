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
import { teams } from "@workspace/drizzle/schemas/auth";

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
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "sign-in") {
          // Send the OTP for sign in
          // const resetPasswordLink = `${getBaseURL()}/api/auth/forget-password?otp=${otp}&email=${email}&type=${type}`;
          // await resend.emails.send({
          //   from: "noreply@biz-search.tech",
          //   to: email,
          //   subject: `パスワードリセットのご案内`,
          //   react: PasswordResetEmail({
          //     email: email,
          //     resetUrl: resetPasswordLink,
          //   }),
          // });
        } else if (type === "email-verification") {
          // Send the OTP for email verification
        } else if (type === "forget-password") {
          // Send the OTP for password reset
          const resetPasswordLink = `${getBaseURL()}/api/auth/forget-password?otp=${otp}&email=${email}&type=${type}`;
          await resend.emails.send({
            from: "noreply@biz-search.tech",
            to: email,
            subject: `パスワードリセットのご案内`,
            react: PasswordResetEmail({
              email: email,
              resetUrl: resetPasswordLink,
            }),
          });
        }
      },
    }),
    magicLink({
      sendMagicLink: async ({ email, token, url }, request) => {
        // send email to user
      },
    }),
    admin(),
  ],
});
