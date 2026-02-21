# 案件管理 - 変更要求（2026-01-17）実装仕様書

## 概要

本仕様書は、[09-change-request-20260117-confirmed.md](./09-change-request-20260117-confirmed.md)で確定した変更要求を実装するための技術仕様を定義する。

## 変更対象

| カテゴリ | 変更項目数 | 主な変更内容 |
| --- | --- | --- |
| 銀行関連 | 1項目 | 抵当権抹消ステータスの追加 |
| 司法書士関連 | 6項目 | 権利証、住所変更、氏名変更、本人確認方法、本人確認電話、本人確認ステータス |
| 手出し関係 | 1項目 | 手出し状況ステータス |
| 賃管関係 | 3項目 | サブリース承継、賃契原本＆鍵、保証会社承継 |

---

## 1. データベーススキーマ

### 1.1 実装済みスキーマ

以下のスキーマは `packages/drizzle/schemas/property.ts` の `settlementProgress` テーブルに追加済み。

#### 銀行関連

```typescript
// 抵当権抹消
mortgageCancellation: text("mortgage_cancellation", {
  enum: mortgageCancellation,
}).default("not_requested"),
mortgageCancellationAt: integer("mortgage_cancellation_at", { mode: "timestamp_ms" }),
mortgageCancellationBy: text("mortgage_cancellation_by").references(() => users.id, { onDelete: "set null" }),
```

#### 司法書士関連

```typescript
// 権利証（Boolean: 有/無）
propertyTitle: integer("property_title", { mode: "boolean" }),
propertyTitleAt: integer("property_title_at", { mode: "timestamp_ms" }),
propertyTitleBy: text("property_title_by").references(() => users.id, { onDelete: "set null" }),

// 住所変更（Boolean: 有/無）
addressChange: integer("address_change", { mode: "boolean" }),
addressChangeAt: integer("address_change_at", { mode: "timestamp_ms" }),
addressChangeBy: text("address_change_by").references(() => users.id, { onDelete: "set null" }),

// 氏名変更（Boolean: 有/無）
nameChange: integer("name_change", { mode: "boolean" }),
nameChangeAt: integer("name_change_at", { mode: "timestamp_ms" }),
nameChangeBy: text("name_change_by").references(() => users.id, { onDelete: "set null" }),

// 本人確認方法
identityVerificationMethod: text("identity_verification_method", {
  enum: identityVerificationMethod,
}),
identityVerificationMethodAt: integer("identity_verification_method_at", { mode: "timestamp_ms" }),
identityVerificationMethodBy: text("identity_verification_method_by").references(() => users.id, { onDelete: "set null" }),

// 本人確認電話
identityVerificationCall: text("identity_verification_call", {
  enum: identityVerificationCall,
}).default("not_requested"),
identityVerificationCallAt: integer("identity_verification_call_at", { mode: "timestamp_ms" }),
identityVerificationCallBy: text("identity_verification_call_by").references(() => users.id, { onDelete: "set null" }),

// 本人確認電話日時
identityVerificationCallSchedule: text("identity_verification_call_schedule"),
identityVerificationCallScheduleAt: integer("identity_verification_call_schedule_at", { mode: "timestamp_ms" }),
identityVerificationCallScheduleBy: text("identity_verification_call_schedule_by").references(() => users.id, { onDelete: "set null" }),

// 本人確認ステータス
identityVerificationStatus: text("identity_verification_status", {
  enum: identityVerificationStatus,
}).default("not_started"),
identityVerificationStatusAt: integer("identity_verification_status_at", { mode: "timestamp_ms" }),
identityVerificationStatusBy: text("identity_verification_status_by").references(() => users.id, { onDelete: "set null" }),
```

#### 手出し関係

```typescript
// 手出し状況
sellerFundingStatus: text("seller_funding_status", {
  enum: sellerFundingStatus,
}).default("not_required"),
sellerFundingStatusAt: integer("seller_funding_status_at", { mode: "timestamp_ms" }),
sellerFundingStatusBy: text("seller_funding_status_by").references(() => users.id, { onDelete: "set null" }),
```

#### 賃管関係

```typescript
// サブリース承継
subleaseSuccession: text("sublease_succession", {
  enum: subleaseSuccession,
}).default("not_required"),
subleaseSuccessionAt: integer("sublease_succession_at", { mode: "timestamp_ms" }),
subleaseSuccessionBy: text("sublease_succession_by").references(() => users.id, { onDelete: "set null" }),

// 賃契原本＆鍵
rentalContractAndKey: text("rental_contract_and_key", {
  enum: rentalContractAndKey,
}).default("not_requested"),
rentalContractAndKeyAt: integer("rental_contract_and_key_at", { mode: "timestamp_ms" }),
rentalContractAndKeyBy: text("rental_contract_and_key_by").references(() => users.id, { onDelete: "set null" }),

// 保証会社承継
guaranteeCompanySuccession: text("guarantee_company_succession", {
  enum: guaranteeCompanySuccession,
}).default("not_required"),
guaranteeCompanySuccessionAt: integer("guarantee_company_succession_at", { mode: "timestamp_ms" }),
guaranteeCompanySuccessionBy: text("guarantee_company_succession_by").references(() => users.id, { onDelete: "set null" }),
```

---

## 2. 型定義

### 2.1 Enum定義

`packages/drizzle/types/property.ts` に以下のEnum定義が追加済み。

```typescript
// 抵当権抹消ステータス
export const mortgageCancellation = [
  "not_requested",  // 未依頼
  "confirming",     // 確認中
  "in_progress",    // 対応中
  "completed",      // 完了
  "not_required",   // 不要
] as const;

// 本人確認方法
export const identityVerificationMethod = [
  "not_confirmed",  // 未確認
  "confirming",     // 確認中
  "limited_mail",   // 限定郵便
  "in_person",      // 立会
] as const;

// 本人確認電話ステータス
export const identityVerificationCall = [
  "not_requested",  // 未依頼
  "confirming",     // 日時確認中
  "in_progress",    // 対応中
  "completed",      // 完了
  "not_required",   // 不要
] as const;

// 本人確認ステータス
export const identityVerificationStatus = [
  "not_started",       // 未対応
  "document_sent",     // 書類発送
  "document_received", // 書類受取
  "document_returned", // 書類返送
  "completed",         // 完了
  "not_required",      // 不要
] as const;

// 手出し状況ステータス
export const sellerFundingStatus = [
  "not_required",       // 不要
  "preliminary_review", // 仮審査中
  "final_review",       // 本審査中
  "review_completed",   // 審査完了
  "funds_ready",        // 用意完了
] as const;

// サブリース承継ステータス
export const subleaseSuccession = [
  "not_required", // 不要
  "confirming",   // 確認中
  "in_progress",  // 対応中
  "completed",    // 完了
] as const;

// 賃契原本＆鍵ステータス
export const rentalContractAndKey = [
  "not_requested", // 未依頼
  "confirming",    // 確認中
  "in_progress",   // 対応中
  "completed",     // 完了
  "not_required",  // 不要
] as const;

// 保証会社承継ステータス
export const guaranteeCompanySuccession = [
  "not_required", // 不要
  "confirming",   // 確認中
  "in_progress",  // 対応中
  "completed",    // 完了
] as const;
```

---

## 3. 定数定義

### 3.1 ラベルとカラー定義

`packages/utils/src/constants/settlement-progress.ts` に以下の定数が追加済み。

#### Badgeスタイル定義

```typescript
const STATUS_BADGE_STYLES = {
  initial: "border-slate-400 bg-slate-50 text-slate-700 dark:bg-slate-950 dark:text-slate-300",
  preparing: "border-amber-400 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  inProgress: "border-sky-400 bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
  processing: "border-blue-400 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  finalizing: "border-indigo-400 bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
  completed: "border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  notRequired: "border-purple-400 bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
};
```

#### 各項目のラベル・カラーマッピング

| 定数名 | 説明 |
| --- | --- |
| `MORTGAGE_CANCELLATION_LABELS` / `MORTGAGE_CANCELLATION_COLORS` | 抵当権抹消 |
| `IDENTITY_VERIFICATION_METHOD_LABELS` / `IDENTITY_VERIFICATION_METHOD_COLORS` | 本人確認方法 |
| `IDENTITY_VERIFICATION_CALL_LABELS` / `IDENTITY_VERIFICATION_CALL_COLORS` | 本人確認電話 |
| `IDENTITY_VERIFICATION_STATUS_LABELS` / `IDENTITY_VERIFICATION_STATUS_COLORS` | 本人確認ステータス |
| `SELLER_FUNDING_STATUS_LABELS` / `SELLER_FUNDING_STATUS_COLORS` | 手出し状況 |
| `SUBLEASE_SUCCESSION_LABELS` / `SUBLEASE_SUCCESSION_COLORS` | サブリース承継 |
| `RENTAL_CONTRACT_AND_KEY_LABELS` / `RENTAL_CONTRACT_AND_KEY_COLORS` | 賃契原本＆鍵 |
| `GUARANTEE_COMPANY_SUCCESSION_LABELS` / `GUARANTEE_COMPANY_SUCCESSION_COLORS` | 保証会社承継 |
| `NULLABLE_BOOLEAN_LABELS` / `NULLABLE_BOOLEAN_COLORS` | 有/無/未設定（Boolean型項目用） |

---

## 4. UIコンポーネント

### 4.1 フォームコンポーネント

決済進捗タブ（`settlement-progress-tab.tsx`）に以下のフォームフィールドを実装。

#### セレクトボックス形式

| フィールド名 | コンポーネント | 選択肢 |
| --- | --- | --- |
| 抵当権抹消 | `SelectFormField` | 未依頼/確認中/対応中/完了/不要 |
| 本人確認方法 | `SelectFormField` | 未確認/確認中/限定郵便/立会 |
| 本人確認電話 | `SelectFormField` | 未依頼/日時確認中/対応中/完了/不要 |
| 本人確認ステータス | `SelectFormField` | 未対応/書類発送/書類受取/書類返送/完了/不要 |
| 手出し状況 | `SelectFormField` | 不要/仮審査中/本審査中/審査完了/用意完了 |
| サブリース承継 | `SelectFormField` | 不要/確認中/対応中/完了 |
| 賃契原本＆鍵 | `SelectFormField` | 未依頼/確認中/対応中/完了/不要 |
| 保証会社承継 | `SelectFormField` | 不要/確認中/対応中/完了 |

#### チェックボックス形式（Nullable Boolean）

| フィールド名 | コンポーネント | 選択肢 |
| --- | --- | --- |
| 権利証 | `NullableBooleanFormField` | 有/無 |
| 住所変更 | `NullableBooleanFormField` | 有/無 |
| 氏名変更 | `NullableBooleanFormField` | 有/無 |

#### テキスト入力形式

| フィールド名 | コンポーネント | 形式 |
| --- | --- | --- |
| 本人確認電話日時 | `TextInputFormField` | 自由入力（例: 「2026/01/20 14:00」） |

### 4.2 Nullable Boolean コンポーネント

`nullable-boolean-form.tsx` を新規作成。

- `null`（未設定）/ `true`（有）/ `false`（無）の3状態を管理
- セレクトボックスUIで実装
- デフォルト値は `null`

---

## 5. UI配置

### 5.1 決済進捗タブ セクション構成

```
決済進捗タブ
├── 精算書関係（既存）
├── 司法書士関係（既存 + 新規追加）
│   ├── 司法書士依頼済
│   ├── 書類共有
│   ├── 権利証 ← 新規
│   ├── 住所変更 ← 新規
│   ├── 氏名変更 ← 新規
│   ├── 本人確認方法 ← 新規
│   ├── 本人確認電話 ← 新規
│   ├── 本人確認電話日時 ← 新規
│   └── 本人確認ステータス ← 新規
├── 銀行関係（既存 + 新規追加）
│   ├── 銀行書類整理完了
│   ├── ローン計算書
│   ├── 売主入金完了
│   └── 抵当権抹消 ← 新規
├── 手出し関係 ← 新規セクション
│   └── 手出し状況
├── 賃貸管理関係（既存 + 新規追加）
│   ├── 管理解約予定月
│   ├── 管理解約依頼日
│   ├── 管理解約完了日
│   ├── サブリース承継 ← 新規
│   ├── 賃契原本＆鍵 ← 新規
│   └── 保証会社承継 ← 新規
└── その他（既存）
```

---

## 6. ビジネスロジック

### 6.1 権利証（propertyTitle）

| 値 | 意味 | 影響 |
| --- | --- | --- |
| `null` | 未確認 | - |
| `true` | 売主が権利証を所持 | 通常の登記手続き |
| `false` | 売主が権利証を紛失 | 司法書士との立会本人確認が必要 |

### 6.2 住所変更（addressChange）

| 値 | 意味 | 影響 |
| --- | --- | --- |
| `null` | 未確認 | - |
| `true` | 売主が登記住所から住所変更済み | 別途住所変更手続きが必要 |
| `false` | 住所変更なし | 追加手続き不要 |

### 6.3 氏名変更（nameChange）

| 値 | 意味 | 影響 |
| --- | --- | --- |
| `null` | 未確認 | - |
| `true` | 売主が登記氏名から氏名変更済み | 別途氏名変更手続きが必要 |
| `false` | 氏名変更なし | 追加手続き不要 |

### 6.4 本人確認電話フロー

```
営業 → 売主: 電話可能日時をヒアリング
営業 → 事務員: 日時を共有
事務員 → 司法書士: 日時を連携、本人確認依頼
司法書士 → 売主: 電話で本人確認実施
```

ステータス遷移:

```
未依頼 → 日時確認中 → 対応中 → 完了
         ↓
        不要（本人確認電話が不要な場合）
```

### 6.5 手出し状況フロー

ローン残債 > 売却金額 の場合、差額（手出し金）が必要。

```
不要: 自己資金で完結可能
仮審査中: 金融機関の仮審査中
本審査中: 金融機関の本審査中
審査完了: 借入可能額が確定
用意完了: 手出し金の用意完了
```

---

## 7. マイグレーション

### 7.1 実行済みマイグレーション

以下のマイグレーションファイルで対応済み:

- `packages/drizzle/migrations/0022_overconfident_mantis.sql`
- `packages/drizzle/migrations/0023_gray_jubilee.sql`
- `packages/drizzle/migrations/0024_tearful_absorbing_man.sql`

### 7.2 既存データの扱い

- 新規追加フィールドはすべて `nullable` または `default` 値を設定
- 既存データへの影響なし
- 既存の案件は新規フィールドが初期値で表示される

---

## 8. 実装チェックリスト

### データベース層

- [x] `settlementProgress` テーブルに新規カラム追加
- [x] Enum定義の追加（`packages/drizzle/types/property.ts`）
- [x] リレーション定義の追加
- [x] マイグレーションファイル生成・適用

### 定数・型

- [x] ラベル定数の追加（`settlement-progress.ts`）
- [x] カラー定数の追加（Badge用）
- [x] Nullable Boolean用の定数追加

### UIコンポーネント

- [x] `NullableBooleanFormField` コンポーネント作成
- [ ] 決済進捗タブへのフォームフィールド追加
- [ ] 手出し関係セクションの新規作成
- [ ] 検索フィルターへの新規項目追加（必要に応じて）

### Server Actions

- [ ] `updateSettlementProgress` アクションの更新
- [ ] Zodスキーマの更新

### テスト

- [ ] フォーム入力・保存の動作確認
- [ ] 既存データへの影響確認
- [ ] ダークモード対応確認

---

## 9. 参考資料

- 変更要求書: [09-change-request-20260117-confirmed.md](./09-change-request-20260117-confirmed.md)
- スキーマ定義: [packages/drizzle/schemas/property.ts](../../../../packages/drizzle/schemas/property.ts)
- 型定義: [packages/drizzle/types/property.ts](../../../../packages/drizzle/types/property.ts)
- 定数定義: [packages/utils/src/constants/settlement-progress.ts](../../../../packages/utils/src/constants/settlement-progress.ts)
