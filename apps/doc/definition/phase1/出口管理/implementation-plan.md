# 出口管理機能 実装計画書

## バージョン情報

- **作成日**: 2026-01-31
- **フェーズ**: Phase 1 - UIファースト実装
- **参照**: [要件定義書](./exit-management.md)

---

## 1. 実装方針

### 1.1 UIファーストアプローチ

DBスキーマ作成は後回しにし、まずUIを先行実装する。

- モックデータを使用してUIコンポーネントを開発
- 型定義は先行して作成（後でDrizzleスキーマと統合）
- UIが確定した段階でDBスキーマを作成

### 1.2 ディレクトリ構造

```text
apps/web/
├── app/(main)/
│   ├── exits/                          # 出口管理
│   │   ├── page.tsx                    # 一覧画面
│   │   ├── new/
│   │   │   └── page.tsx                # 新規作成
│   │   └── [exitId]/
│   │       ├── page.tsx                # 詳細画面
│   │       ├── edit/
│   │       │   └── page.tsx            # 編集画面
│   │       └── distribute/
│   │           └── page.tsx            # 業者配布画面
│   └── brokers/                        # 業者マスタ
│       ├── page.tsx                    # 一覧画面
│       ├── new/
│       │   └── page.tsx                # 新規登録
│       ├── analytics/
│       │   └── page.tsx                # 業者分析
│       └── [brokerId]/
│           ├── page.tsx                # 詳細画面
│           └── edit/
│               └── page.tsx            # 編集画面
├── components/
│   └── exit/                           # 出口管理コンポーネント
│       ├── exit-list.tsx               # 一覧テーブル
│       ├── exit-list-columns.tsx       # テーブルカラム定義
│       ├── exit-detail-view.tsx        # 詳細表示
│       ├── exit-form-provider.tsx      # フォームプロバイダー
│       ├── exit-form-tabs.tsx          # フォームタブ
│       ├── exit-status-badge.tsx       # ステータスバッジ
│       ├── maisoku-preview.tsx         # マイソクプレビュー
│       ├── response-ranking.tsx        # 回答順位表示
│       ├── tabs/
│       │   ├── maisoku-info-tab.tsx    # マイソク情報タブ
│       │   ├── distribution-tab.tsx    # 配布管理タブ
│       │   └── responses-tab.tsx       # 回答一覧タブ
│       ├── broker/
│       │   ├── broker-list.tsx         # 業者一覧
│       │   ├── broker-list-columns.tsx # テーブルカラム定義
│       │   ├── broker-form.tsx         # 業者フォーム
│       │   ├── broker-select.tsx       # 業者選択
│       │   └── broker-group-select.tsx # グループ選択
│       └── distribution/
│           ├── distribution-form.tsx   # 配布フォーム
│           ├── broker-checklist.tsx    # 業者チェックリスト
│           └── email-preview.tsx       # メールプレビュー
└── lib/
    ├── types/
    │   ├── exit.ts                     # 出口管理型定義
    │   └── broker.ts                   # 業者型定義
    └── mocks/
        ├── exits.ts                    # 出口管理モックデータ
        └── brokers.ts                  # 業者モックデータ
```

---

## 2. 実装フェーズ

### Phase 1-A: 型定義・モックデータ作成

#### 作業内容

1. 出口管理の型定義作成
2. 業者マスタの型定義作成
3. モックデータ作成（一覧表示用）

#### 成果物

- `apps/web/lib/types/exit.ts`
- `apps/web/lib/types/broker.ts`
- `apps/web/lib/mocks/exits.ts`
- `apps/web/lib/mocks/brokers.ts`

---

### Phase 1-B: 出口管理一覧画面

#### 作業内容

1. 一覧ページ作成（`/exits`）
2. テーブルコンポーネント作成
3. ステータスバッジコンポーネント作成
4. 順位表示（アッパー、2番手、3番手）
5. フィルタ・ソート機能

#### UI仕様

| 項目 | 説明 |
|------|------|
| ステータス | バッジ表示（色分け） |
| 物件名 | テキスト + リンク |
| 号室 | テキスト |
| 築年 | 日付フォーマット |
| 担当 | ユーザー名 |
| 現況 | バッジ（賃貸中/サブリース/空室） |
| 仕入れ金額 | 通貨フォーマット（万円） |
| マイソク価格 | 通貨フォーマット（万円） |
| 家賃 | 通貨フォーマット（円） |
| 管積 | 通貨フォーマット（円） |
| アッパー | 業者名・金額・利回り |
| 2番手 | 業者名・金額・利回り |
| 3番手 | 業者名・金額・利回り |

#### 成果物

- `apps/web/app/(main)/exits/page.tsx`
- `apps/web/components/exit/exit-list.tsx`
- `apps/web/components/exit/exit-list-columns.tsx`
- `apps/web/components/exit/exit-status-badge.tsx`
- `apps/web/components/exit/response-ranking.tsx`

---

### Phase 1-C: 出口管理詳細・編集画面

#### 作業内容

1. 詳細ページ作成（`/exits/[exitId]`）
2. 編集ページ作成（`/exits/[exitId]/edit`）
3. 新規作成ページ作成（`/exits/new`）
4. フォームプロバイダー作成
5. タブ構成コンポーネント作成

#### タブ構成

| タブ | 内容 |
|------|------|
| マイソク情報 | 物件基本情報、金額、現況等 |
| 配布管理 | 配布履歴、追いメール状況 |
| 回答一覧 | 業者回答、順位、履歴 |

#### 成果物

- `apps/web/app/(main)/exits/[exitId]/page.tsx`
- `apps/web/app/(main)/exits/[exitId]/edit/page.tsx`
- `apps/web/app/(main)/exits/new/page.tsx`
- `apps/web/components/exit/exit-detail-view.tsx`
- `apps/web/components/exit/exit-form-provider.tsx`
- `apps/web/components/exit/exit-form-tabs.tsx`
- `apps/web/components/exit/tabs/maisoku-info-tab.tsx`
- `apps/web/components/exit/tabs/distribution-tab.tsx`
- `apps/web/components/exit/tabs/responses-tab.tsx`

---

### Phase 1-D: マイソク機能

#### 作業内容

1. マイソクプレビューコンポーネント作成
2. PDF出力機能（react-pdf使用）
3. 印刷レイアウト最適化

#### 成果物

- `apps/web/components/exit/maisoku-preview.tsx`
- `apps/web/components/exit/maisoku-pdf.tsx`（PDF生成用）

---

### Phase 1-E: 業者マスタ画面

#### 作業内容

1. 業者一覧ページ作成（`/brokers`）
2. 業者詳細ページ作成（`/brokers/[brokerId]`）
3. 業者登録・編集フォーム作成
4. CSVインポート/エクスポート機能

#### 成果物

- `apps/web/app/(main)/brokers/page.tsx`
- `apps/web/app/(main)/brokers/new/page.tsx`
- `apps/web/app/(main)/brokers/[brokerId]/page.tsx`
- `apps/web/app/(main)/brokers/[brokerId]/edit/page.tsx`
- `apps/web/components/exit/broker/broker-list.tsx`
- `apps/web/components/exit/broker/broker-list-columns.tsx`
- `apps/web/components/exit/broker/broker-form.tsx`

---

### Phase 1-F: 業者配布画面

#### 作業内容

1. 配布ページ作成（`/exits/[exitId]/distribute`）
2. 業者選択チェックリスト
3. グループ選択機能
4. メッセージテンプレート
5. 配布プレビュー

#### 成果物

- `apps/web/app/(main)/exits/[exitId]/distribute/page.tsx`
- `apps/web/components/exit/distribution/distribution-form.tsx`
- `apps/web/components/exit/distribution/broker-checklist.tsx`
- `apps/web/components/exit/distribution/email-preview.tsx`

---

### Phase 1-G: 回答フォーム（業者向け公開ページ）

#### 作業内容

1. 回答フォームページ作成（`/r/[token]`）
2. 物件情報表示（読み取り専用）
3. 金額入力フォーム
4. 回答完了画面
5. 再回答機能

#### 成果物

- `apps/web/app/(public)/r/[token]/page.tsx`
- `apps/web/components/exit/response/response-form.tsx`
- `apps/web/components/exit/response/property-summary.tsx`

---

### Phase 1-H: ナビゲーション・レイアウト

#### 作業内容

1. サイドバーに出口管理メニュー追加
2. パンくずリスト設定
3. アクセス権限設定（middleware）

#### 成果物

- `apps/web/components/nav/app-sidebar.tsx`（更新）
- `apps/web/middleware.ts`（更新）

---

## 3. コンポーネント詳細設計

### 3.1 ExitStatusBadge

ステータスに応じた色分けバッジ

```tsx
type ExitStatus =
  | "not_purchased"    // 未仕入れ - グレー
  | "waiting_purchase" // 仕入待ち（😭）- 黄色
  | "negotiating"      // 交渉中（▲）- オレンジ
  | "confirmed"        // 確定（〇）- 緑
  | "cancelled"        // キャンセル（✖）- 赤
  | "breach"           // 違約 - 赤
  | "troubled";        // 要注意 - 紫
```

### 3.2 ResponseRanking

アッパー・2番手・3番手の表示コンポーネント

```tsx
interface ResponseRankingProps {
  responses: ExitResponse[];
  maxDisplay?: number; // デフォルト3
}
```

### 3.3 BrokerChecklist

配布先業者選択用チェックリスト

```tsx
interface BrokerChecklistProps {
  brokers: Broker[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  groupFilter?: string;
}
```

---

## 4. 型定義（先行作成）

### 4.1 Exit型

```typescript
// apps/web/lib/types/exit.ts

export type ExitStatus =
  | "not_purchased"
  | "waiting_purchase"
  | "negotiating"
  | "confirmed"
  | "cancelled"
  | "breach"
  | "troubled";

export type Situation = "renting" | "sublease" | "vacant";

export interface Exit {
  id: string;
  organizationId: string;
  propertyId: string | null;
  propertyName: string;
  roomNumber: string | null;
  address: string | null;
  builtDate: Date | null;
  area: number | null;
  structure: string | null;
  floor: string | null;
  situation: Situation | null;
  rent: number | null;
  managementFee: number | null;
  purchasePrice: number | null;
  maisokuPrice: number | null;
  expectedYield: number | null;
  staffId: string | null;
  notes: string | null;
  status: ExitStatus;
  confirmedBrokerId: string | null;
  confirmedPrice: number | null;
  confirmedYield: number | null;
  confirmedAt: Date | null;
  confirmedBy: string | null;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExitWithRelations extends Exit {
  staff: { id: string; name: string } | null;
  confirmedBroker: { id: string; name: string } | null;
  responses: ExitResponse[];
  distributions: ExitDistribution[];
}

export interface ExitResponse {
  id: string;
  distributionId: string;
  price: number;
  yield: number | null;
  responderName: string;
  responderContact: string | null;
  conditions: string | null;
  validUntil: Date | null;
  status: "pending" | "responded" | "declined";
  respondedAt: Date;
  broker: { id: string; name: string };
}

export interface ExitDistribution {
  id: string;
  exitId: string;
  brokerId: string;
  token: string;
  message: string | null;
  expiresAt: Date;
  distributedBy: string;
  distributedAt: Date;
  reminderCount: number;
  lastReminderAt: Date | null;
  broker: { id: string; name: string };
  response: ExitResponse | null;
}
```

### 4.2 Broker型

```typescript
// apps/web/lib/types/broker.ts

export type BrokerType = "buyer" | "broker";

export interface Broker {
  id: string;
  organizationId: string;
  name: string;
  brokerType: BrokerType;
  contactName: string | null;
  email: string;
  phone: string | null;
  address: string | null;
  startedAt: Date | null;
  groupId: string | null;
  notes: string | null;
  isActive: boolean;
  displayOrder: number | null;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BrokerGroup {
  id: string;
  organizationId: string;
  name: string;
  description: string | null;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BrokerWithGroup extends Broker {
  group: BrokerGroup | null;
}
```

---

## 5. モックデータ

### 5.1 業者初期データ（46社）

要件定義書に記載の業者リストをモックデータとして作成。

### 5.2 出口管理サンプルデータ

- 5件程度のサンプル案件
- 各ステータスを網羅
- 回答データを含む

---

## 6. 既存コンポーネント参照ガイド

実装時は既存の案件管理（property）コンポーネントを参考にする。

### 6.1 テーブル系コンポーネント

一覧画面のテーブル実装は以下を参照：

| 参照先 | 用途 | パス |
|--------|------|------|
| DataTable | テーブル基盤（ソート、フィルタ、ページネーション） | `components/property/search/data-table.tsx` |
| DataTableToolbar | ツールバー（検索、フィルタ） | `components/property/search/data-table-toolbar.tsx` |
| DataTablePagination | ページネーション | `components/property/search/data-table-pagination.tsx` |
| DataTableColumnHeader | ソート可能カラムヘッダー | `components/property/search/data-table-column-header.tsx` |
| columns.tsx | カラム定義の実装例 | `components/property/search/columns.tsx` |
| UnconfirmedPropertiesTable | シンプルなテーブル実装例 | `components/property/unconfirmed/unconfirmed-properties-table.tsx` |
| MonthlyPropertiesTable | 月別一覧テーブル | `components/property/monthly/monthly-properties-table.tsx` |

### 6.2 バッジ系コンポーネント

ステータス表示のバッジ実装は以下を参照：

| 参照先 | 用途 | パス |
|--------|------|------|
| ProgressStatusBadge | 進捗ステータスバッジ | `components/property/badge/progress-status-badge.tsx` |
| DocumentStatusBadge | 書類ステータスバッジ | `components/property/badge/document-status-badge.tsx` |
| ContractTypeBadge | 契約形態バッジ | `components/property/badge/contract-type-badge.tsx` |
| CompanyBBadge | B会社バッジ | `components/property/badge/company-b-badge.tsx` |
| BrokerCompanyBadge | 仲介会社バッジ | `components/property/badge/broker-company-badge.tsx` |
| OrganizationBadge | 組織バッジ | `components/property/badge/organization-badge.tsx` |

### 6.3 フォーム系コンポーネント

フォーム入力の実装は以下を参照：

| 参照先 | 用途 | パス |
|--------|------|------|
| InputForm | テキスト入力 | `components/property/form/input-form.tsx` |
| AmountInputForm | 金額入力 | `components/property/form/amount-input-form.tsx` |
| TextareaForm | テキストエリア | `components/property/form/textarea-form.tsx` |
| SelectForm | セレクト | `components/property/form/select-form.tsx` |
| ComboboxForm | コンボボックス | `components/property/form/combobox-form.tsx` |
| DatePickerForm | 日付選択 | `components/property/form/date-picker-form.tsx` |
| CheckboxForm | チェックボックス | `components/property/form/checkbox-form.tsx` |
| BadgeSelectForm | バッジ選択 | `components/property/form/badge-select-form.tsx` |
| BadgeToggleForm | バッジトグル | `components/property/form/badge-toggle-form.tsx` |
| StaffSelectForm | 担当者選択 | `components/property/form/staff-select-form.tsx` |
| OrganizationSelectForm | 組織選択 | `components/property/form/organization-select-form.tsx` |

### 6.4 インライン編集コンポーネント

テーブル内でのインライン編集は以下を参照：

| 参照先 | 用途 | パス |
|--------|------|------|
| TextPopoverEdit | テキスト編集ポップオーバー | `components/property/inline-edit/text-popover-edit.tsx` |
| CurrencyPopoverEdit | 金額編集ポップオーバー | `components/property/inline-edit/currency-popover-edit.tsx` |
| BadgeDropdownEdit | バッジドロップダウン編集 | `components/property/inline-edit/badge-dropdown-edit.tsx` |
| ComboboxPopoverEdit | コンボボックス編集 | `components/property/inline-edit/combobox-popover-edit.tsx` |
| SettlementDatePopoverEdit | 日付編集ポップオーバー | `components/property/inline-edit/settlement-date-popover-edit.tsx` |
| ProgressStatusInlineEdit | 進捗ステータス編集 | `components/property/inline-edit/progress-status-inline-edit.tsx` |
| DocumentStatusInlineEdit | 書類ステータス編集 | `components/property/inline-edit/document-status-inline-edit.tsx` |
| BuyerCompanyComboboxEdit | 買取業者コンボボックス | `components/property/inline-edit/buyer-company-combobox-edit.tsx` |

### 6.5 フォームタブ・詳細表示

タブ構成や詳細表示は以下を参照：

| 参照先 | 用途 | パス |
|--------|------|------|
| PropertyFormTabs | フォームタブ構成 | `components/property/property-form-tabs.tsx` |
| PropertyFormProvider | フォームプロバイダー | `components/property/property-form-provider.tsx` |
| PropertyDetailView | 詳細表示 | `components/property/property-detail-view.tsx` |
| SectionCard | セクションカード | `components/property/section-card.tsx` |
| BasicInfoTab | 基本情報タブ | `components/property/tabs/basic-info-tab.tsx` |
| ContractProgressTab | 契約進捗タブ | `components/property/tabs/contract-progress-tab.tsx` |
| DocumentProgressTab | 書類進捗タブ | `components/property/tabs/document-progress-tab.tsx` |
| SettlementProgressTab | 決済進捗タブ | `components/property/tabs/settlement-progress-tab.tsx` |

### 6.6 その他ユーティリティ

| 参照先 | 用途 | パス |
|--------|------|------|
| column-class-helpers | テーブルカラムのスタイル定義 | `components/property/table/column-class-helpers.ts` |
| MonthPicker | 月選択 | `components/property/month-picker.tsx` |
| SettlementDatePicker | 決済日選択 | `components/property/settlement-date-picker.tsx` |

---

## 7. 依存関係

### 7.1 使用ライブラリ

| ライブラリ | 用途 |
|-----------|------|
| @tanstack/react-table | テーブル表示 |
| react-hook-form | フォーム管理 |
| zod | バリデーション |
| @react-pdf/renderer | PDF生成（検討中） |
| nuqs | URLクエリ状態管理 |
| sonner | トースト通知 |

### 7.2 既存コンポーネント再利用

- `SectionCard` - セクション区切り
- `Badge` - ステータス表示
- `DataTable` - テーブル基盤
- `Form` 系コンポーネント - フォーム入力

---

## 8. 実装優先順位

| 優先度 | フェーズ | 画面/機能 | 理由 |
|--------|----------|-----------|------|
| 1 | 1-A | 型定義・モック | 全実装の基盤 |
| 2 | 1-B | 出口管理一覧 | メイン画面 |
| 3 | 1-E | 業者マスタ | 配布に必要 |
| 4 | 1-C | 詳細・編集 | CRUD基本機能 |
| 5 | 1-F | 業者配布 | コア機能 |
| 6 | 1-G | 回答フォーム | 外部連携 |
| 7 | 1-D | マイソクPDF | 付加価値 |
| 8 | 1-H | ナビ・権限 | 仕上げ |

---

## 8. 次フェーズ（DB実装後）

Phase 2以降で実装予定：

1. Drizzleスキーマ作成（`packages/drizzle/schemas/exit.ts`等）
2. Server Actions作成
3. SWRフック作成
4. ルートハンドラー作成（セッション依存データ用）
5. メール送信機能（Resend連携）
6. 業者分析機能

---

## 9. テスト計画

### 9.1 UIテスト

- 各コンポーネントのStorybookストーリー作成
- フォームバリデーションテスト

### 9.2 E2Eテスト

- 一覧→詳細→編集フロー
- 配布→回答フロー
- 権限制御テスト

---

## 10. 備考

- 既存の `PropertyFormTabs` パターンを参考にタブ構成を実装
- 既存の `unconfirmed-properties-table.tsx` を参考にテーブル実装
- モバイル対応は後フェーズで検討

---

最終更新: 2026-01-31
