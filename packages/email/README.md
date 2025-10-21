# @workspace/email

Turborepo用のシンプルなメールパッケージです。React Emailでテンプレートを作成し、Resend APIで送信します。

## 開発

メールテンプレートのプレビューサーバーを起動：

```bash
pnpm dev
```

<http://localhost:3333> でプレビューが表示されます。

## 使い方

### メール送信

```typescript
import { resend } from "@workspace/email/resend";
import { InvitationEmail } from "@workspace/email/templates/invitation";

// Resend APIを直接使用
await resend.emails.send({
  from: "noreply@biz-search.tech",
  to: "user@example.com",
  subject: "組織への招待",
  react: InvitationEmail({
    organizationName: "株式会社サンプル",
    inviterName: "山田太郎",
    inviterEmail: "yamada@example.com",
    inviteLink: "https://example.com/invite/abc123",
  }),
});
```

### 利用可能なテンプレート

- `InvitationEmail` - 組織招待メール
- `BizSearchInviteEmail` - Biz Search招待メール
- `BizSearchMagicLinkEmail` - マジックリンクメール
- `BizSearchPasswordResetEmail` - パスワードリセットメール

### 新しいテンプレートの作成

`src/templates/` にReactコンポーネントを作成：

```tsx
import { Html, Body, Container, Text, Button } from "@react-email/components";

interface MyEmailProps {
  name: string;
  actionUrl: string;
}

export function MyEmail({ name, actionUrl }: MyEmailProps) {
  return (
    <Html>
      <Body>
        <Container>
          <Text>こんにちは、{name}さん！</Text>
          <Button href={actionUrl}>クリック</Button>
        </Container>
      </Body>
    </Html>
  );
}
```

使用例：

```typescript
import { resend } from "@workspace/email/resend";
import { MyEmail } from "@workspace/email/templates/my-email";

await resend.emails.send({
  from: "noreply@example.com",
  to: "user@example.com",
  subject: "件名",
  react: MyEmail({ name: "太郎", actionUrl: "https://example.com" }),
});
```

## 環境変数

```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

## パッケージ構造

```text
src/
├── resend.ts           # Resendクライアント
└── templates/          # メールテンプレート
    ├── invitation.tsx
    └── ...
```

## 参考

- [React Email ドキュメント](https://react.email/docs/introduction)
- [Resend API ドキュメント](https://resend.com/docs/send-with-nodejs)
