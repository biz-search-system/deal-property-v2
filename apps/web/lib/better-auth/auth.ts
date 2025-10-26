import { db } from "@workspace/drizzle/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { anonymous, organization, username } from "better-auth/plugins";
import { getBaseURL, customNanoid } from "@workspace/utils";
import { resend } from "@workspace/email/resend";
import InvitationEmail from "@workspace/email/templates/invitation";
import { getTeamName } from "../data/team";

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
  ],
});
