# shadcn/ui Monorepo

このプロジェクトは、shadcn/ui と Turborepo を使用した Next.js モノレポテンプレートです。

## 技術スタック

- **モノレポ管理**: Turborepo
- **パッケージマネージャー**: pnpm
- **フレームワーク**: Next.js 15 (App Router)
- **UI ライブラリ**: shadcn/ui + Radix UI
- **スタイリング**: Tailwind CSS v4
- **言語**: TypeScript
- **フォント**: Geist (Sans & Mono)

## プロジェクト構造

```text
deal-property-monorepo/
├── apps/
│   └── web/                 # メインのNext.jsアプリケーション
│       ├── app/             # App Router
│       └── components/      # アプリ固有のコンポーネント
│
├── packages/
│   ├── ui/                  # 共有UIコンポーネントライブラリ
│   ├── eslint-config/       # 共有ESLint設定
│   └── typescript-config/   # 共有TypeScript設定
```

## セットアップ

### 前提条件

- Node.js >= 20
- pnpm >= 10.18.0

### インストール

```bash
# 依存関係のインストール
pnpm install
```

## 開発

### 開発サーバーの起動

```bash
# すべてのアプリを開発モードで起動
pnpm dev

# 特定のアプリのみ起動
pnpm dev --filter=web
```

### ビルド

```bash
# すべてのアプリをビルド
pnpm build

# 特定のアプリのみビルド
pnpm build --filter=web
```

### リンティング

```bash
# すべてのパッケージをリント
pnpm lint

# コードフォーマット
pnpm format
```

## shadcn/ui コンポーネントの追加

webアプリにshadcn/uiコンポーネントを追加するには、プロジェクトルートから以下のコマンドを実行します：

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

これにより、UIコンポーネントが `packages/ui/src/components` ディレクトリに配置されます。

## コンポーネントの使用

アプリ内でコンポーネントを使用するには、`@workspace/ui` パッケージからインポートします：

```tsx
import { Button } from "@workspace/ui/components/button";

export default function Page() {
  return <Button>クリック</Button>;
}
```

## パッケージ管理

### 新しいパッケージのインストール

#### ルートプロジェクトにインストール

```bash
# 開発依存としてインストール
pnpm add -D -w <package-name>

# 通常の依存としてインストール
pnpm add -w <package-name>
```

#### 特定のワークスペースにインストール

```bash
# webアプリにインストール
pnpm add <package-name> --filter=web

# UIパッケージにインストール
pnpm add <package-name> --filter=@workspace/ui
pnpm add <package-name> --filter=@workspace/drizzle

# 開発依存としてインストール
pnpm add -D <package-name> --filter=web
```

#### すべてのワークスペースにインストール

```bash
# すべてのワークスペースに同じパッケージをインストール
pnpm add <package-name> -r
```

### 依存関係の更新

#### すべてのパッケージを最新バージョンに更新

```bash
# 1. 更新可能なパッケージを確認
pnpm outdated

# 2. すべてのパッケージを最新バージョンに更新
pnpm up --latest -r

# 3. ビルドで動作確認
pnpm build
```

#### 特定のパッケージのみ更新

```bash
# 特定のパッケージを更新
pnpm up next --latest

# 複数のパッケージを更新
pnpm up react react-dom --latest

# 特定のワークスペース内のパッケージを更新
pnpm up next --latest --filter=web
```

### セキュリティ監査

```bash
# 脆弱性のチェック
pnpm audit

# 自動修正可能な脆弱性を修正
pnpm audit --fix
```

### クリーンインストール（トラブルシューティング）

依存関係の問題が発生した場合：

```bash
# node_modulesとロックファイルを削除
rm -rf node_modules pnpm-lock.yaml

# すべてのワークスペースのnode_modulesを削除
rm -rf apps/*/node_modules packages/*/node_modules

# 再インストール
pnpm install
```

## Tailwind CSS

`tailwind.config.ts` と `globals.css` は、`ui` パッケージのコンポーネントを使用するように設定済みです。

## ワークスペースコマンド

```bash
# 特定のワークスペースでコマンドを実行
pnpm --filter=web dev
pnpm --filter=@workspace/ui lint

# すべてのワークスペースで実行
pnpm -r build
pnpm -r lint
```

## トラブルシューティング

### ビルドエラーが発生する場合

1. 依存関係を再インストール：

   ```bash
   rm -rf node_modules pnpm-lock.yaml
   pnpm install
   ```

2. Next.jsのキャッシュをクリア：

   ```bash
   rm -rf apps/web/.next
   pnpm build
   ```

3. Turboのキャッシュをクリア：

   ```bash
   rm -rf .turbo
   pnpm build
   ```

### TypeScriptエラーが発生する場合

```bash
# 型チェックを実行
pnpm --filter=web typecheck

# TypeScriptを再インストール
pnpm up typescript --latest -r
```

## ライセンス

MIT
