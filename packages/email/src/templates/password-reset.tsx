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

interface PasswordResetEmailProps {
  email?: string;
  resetUrl?: string;
}

export const PasswordResetEmail = ({
  email = "user@example.com",
  resetUrl = "https://example.com/reset-password",
}: PasswordResetEmailProps) => {
  const previewText = "パスワードリセットのご案内";

  return (
    <Html lang="ja">
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-[#eaeaea] border-solid p-[20px]">
            <Section className="mt-[32px]">
              <Img
                src="https://www.deal-property.space/logo.svg"
                width="80"
                height="80"
                alt="Logo"
                className="mx-auto my-0"
              />
            </Section>
            <Heading className="mx-0 my-[30px] p-0 text-center font-normal text-[24px] text-black">
              パスワードリセットのご案内
            </Heading>
            <Text className="text-[14px] text-black leading-[24px]">
              {email}様
            </Text>
            <Text className="text-[14px] text-black leading-[24px]">
              パスワードリセットのリクエストを受け付けました。
            </Text>
            <Text className="text-[14px] text-black leading-[24px]">
              下記のボタンをクリックして、新しいパスワードを設定してください。
            </Text>
            <Text className="text-[14px] text-black leading-[24px]">
              このリンクは60分間有効です。
            </Text>
            <Section className="mt-[32px] mb-[32px] text-center">
              <Button
                className="rounded bg-[#000000] px-5 py-3 text-center font-semibold text-[12px] text-white no-underline"
                href={resetUrl}
              >
                パスワードをリセットする
              </Button>
            </Section>
            <Text className="text-[#666666] text-[12px] leading-[24px]">
              このパスワードリセットリンクは
              <span className="text-black">{email}</span>
              様宛に送信されました。
            </Text>
            <Text className="text-[#666666] text-[12px] leading-[24px]">
              心当たりがない場合は、このメールを無視してください。お客様のアカウントは安全に保護されています。
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

PasswordResetEmail.PreviewProps = {
  email: "user@example.com",
  resetUrl: "https://www.deal-property.space/reset-password?token=example",
} as PasswordResetEmailProps;

export default PasswordResetEmail;