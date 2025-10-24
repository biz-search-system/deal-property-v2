import { db } from "@/db"; // your drizzle instance
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { anonymous, organization, username } from "better-auth/plugins";
import { getBaseURL } from "./get-base-url";
import { InvitationEmail } from "./resend/invitation-email";
import { resend } from "./resend/resend";
import { generateId } from "./utils";

export const auth = betterAuth({
  baseURL: getBaseURL(),
  database: drizzleAdapter(db, {
    provider: "sqlite", // or "mysql", "sqlite"
    usePlural: true, // use plural for table names
  }),
  advanced: {
    database: {
      generateId: generateId,
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
      async sendInvitationEmail(data) {
        const invitationId = data.id;
        const inviterEmail = data.inviter.user.email;
        // サインアップページへの直接リンク（組織名を含む）
        const inviteLink = `${getBaseURL()}/signup?id=${invitationId}&email=${encodeURIComponent(
          data.email
        )}&org=${encodeURIComponent(data.organization.name)}`;

        await resend.emails.send({
          from: "noreply@biz-search.tech",
          to: data.email,
          subject: `${data.organization.name}への招待`,
          react: InvitationEmail({
            organizationName: data.organization.name,
            inviterName: data.inviter.user.name,
            inviterEmail,
            inviteLink,
          }),
        });
      },
    }),
  ],
});
