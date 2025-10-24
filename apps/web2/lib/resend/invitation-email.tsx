import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface InvitationEmailProps {
  organizationName: string;
  inviterName: string;
  inviterEmail: string;
  inviteLink: string;
}

export function InvitationEmail({
  organizationName,
  inviterName,
  inviterEmail,
  inviteLink,
}: InvitationEmailProps) {
  const previewText = `${organizationName}への招待`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={box}>
            <Text style={heading}>組織への招待</Text>

            <Text style={paragraph}>
              <strong>{inviterName}</strong> ({inviterEmail}) さんからあなたを
              <strong> {organizationName} </strong>
              の組織メンバーとして招待されました。
            </Text>

            <Text style={paragraph}>
              以下のボタンをクリックして、招待を受け入れてください：
            </Text>

            <Button style={button} href={inviteLink}>
              招待を受け入れる
            </Button>

            <Text style={paragraph}>
              または、以下のリンクをブラウザにコピー＆ペーストしてください：
            </Text>

            <Text style={link}>{inviteLink}</Text>

            <Hr style={hr} />

            <Text style={footer}>
              このメールに心当たりがない場合は、無視していただいて構いません。
              招待リンクの有効期限は48時間です。
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const box = {
  padding: "0 48px",
};

const heading = {
  fontSize: "28px",
  fontWeight: "bold",
  marginTop: "48px",
  color: "#1a1a1a",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "#525252",
};

const button = {
  backgroundColor: "#000000",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "100%",
  padding: "10px",
  marginTop: "26px",
  marginBottom: "26px",
};

const link = {
  fontSize: "14px",
  color: "#2754C5",
  textDecoration: "underline",
  wordBreak: "break-all" as const,
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
};
