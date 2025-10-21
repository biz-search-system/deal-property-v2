import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface InvitationEmailProps {
  organizationName?: string;
  inviterName?: string;
  inviterEmail?: string;
  inviteLink?: string;
}

export const InvitationEmail = ({
  organizationName = "サンプル組織",
  inviterName = "山田太郎",
  inviterEmail = "inviter@example.com",
  inviteLink = "https://example.com/invite/abc123",
}: InvitationEmailProps) => {
  const previewText = `${organizationName}への招待`;

  return (
    <Html lang="ja">
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-[#eaeaea] border-solid p-[20px]">
            <Heading className="mx-0 my-[30px] p-0 text-center font-normal text-[24px] text-black">
              <strong>{organizationName}</strong>への招待
            </Heading>

            <Text className="text-[14px] text-black leading-[24px]">
              <Link
                href={`mailto:${inviterEmail}`}
                className="text-blue-600 no-underline"
              >
                {inviterName} ({inviterEmail})
              </Link>
              さんから、<strong>{organizationName}</strong>の組織メンバーとして招待されました。
            </Text>

            <Text className="text-[14px] text-black leading-[24px]">
              下記のボタンをクリックして、招待を受け入れてください。
            </Text>

            <Section className="mt-[32px] mb-[32px] text-center">
              <Button
                className="rounded bg-[#000000] px-5 py-3 text-center font-semibold text-[12px] text-white no-underline"
                href={inviteLink}
              >
                招待を受け入れる
              </Button>
            </Section>

            <Text className="text-[#666666] text-[12px] leading-[24px]">
              このメールに心当たりがない場合は、無視していただいて構いません。
              招待リンクの有効期限は48時間です。
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

InvitationEmail.PreviewProps = {
  organizationName: "株式会社サンプル",
  inviterName: "山田太郎",
  inviterEmail: "yamada@example.com",
  inviteLink: "https://example.com/invite/abc123",
} as InvitationEmailProps;

export default InvitationEmail;
