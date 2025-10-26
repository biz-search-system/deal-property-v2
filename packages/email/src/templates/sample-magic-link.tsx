import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface BizSearchMagicLinkEmailProps {
  email?: string;
  magicLinkUrl?: string;
}

export const BizSearchMagicLinkEmail = ({
  email = "{{ .Email }}",
  magicLinkUrl = "{{ .SiteURL }}/api/auth/invite?token_hash={{ .TokenHash }}&type=email&next={{ .RedirectTo }}",
}: BizSearchMagicLinkEmailProps) => {
  const previewText = "BizSearchへのログインリンク";

  return (
    <Html lang="ja">
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-[#eaeaea] border-solid p-[20px]">
            <Section className="mt-[32px]">
              <Img
                src="https://www.biz-search.tech/logo.png"
                width="80"
                height="80"
                alt="BizSearch"
                className="mx-auto my-0"
              />
            </Section>
            <Heading className="mx-0 my-[30px] p-0 text-center font-normal text-[24px] text-black">
              <strong>BizSearch</strong>へのログイン
            </Heading>
            <Text className="text-[14px] text-black leading-[24px]">
              {email}様
            </Text>
            <Text className="text-[14px] text-black leading-[24px]">
              下記のボタンをクリックして、<strong>BizSearch</strong>
              にログインしてください。
            </Text>
            <Text className="text-[14px] text-black leading-[24px]">
              このリンクは60分間有効です。
            </Text>
            <Section className="mt-[32px] mb-[32px] text-center">
              <Button
                className="rounded bg-[#000000] px-5 py-3 text-center font-semibold text-[12px] text-white no-underline"
                href={magicLinkUrl}
              >
                ログインする
              </Button>
            </Section>
            <Text className="text-[#666666] text-[12px] leading-[24px]">
              このログインリンクは<span className="text-black">{email}</span>
              様宛に送信されました。心当たりがない場合は、このメールを無視してください。
            </Text>
            <Text className="text-[#666666] text-[12px] leading-[24px]">
              セキュリティのため、このリンクは一度のみ使用可能です。
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

BizSearchMagicLinkEmail.PreviewProps = {
  email: "user@example.com",
  magicLinkUrl:
    "https://www.biz-search.tech/api/auth/confirm?token_hash=example&type=email",
} as BizSearchMagicLinkEmailProps;

export default BizSearchMagicLinkEmail;
