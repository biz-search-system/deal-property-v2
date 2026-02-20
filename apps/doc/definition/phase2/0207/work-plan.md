# 作業計画書 - 2026年2月7日 ミーティング対応

## バージョン情報

- **作成日**: 2026-02-21
- **ミーティング日**: 2026-02-07
- **参照**: [会議メモ](./_2026_02_07%2011_57%20JST%20に開始した会議%20-%20Gemini%20によるメモ.md)
- **ステータス**: 完了（作業1〜11全完了）

---

## 作業一覧

| # | カテゴリ | 作業内容 | 優先度 | 影響範囲 | 工数目安 |
|---|---------|---------|--------|---------|---------|
| 1 | 全体改修 | 選択項目の解除（空白に戻す）機能の追加 | 高 | UI（全体） | 中 |
| 2 | 進捗画面改修 | 権利証：チェックボックス → 「有/無」選択式に変更 | 高 | スキーマ + UI | 小 |
| 3 | 進捗画面改修 | 住所変更：チェックボックス → 「なし/1回/2回以上」選択式に変更 | 高 | スキーマ + UI | 小 |
| 4 | 出口管理 | 一覧に「組織」カラムを先頭に追加 | 中 | UI | 小 |
| 5 | 出口管理 | 「家賃」カラムの一覧表示追加 | 中 | UI | 小 |
| 6 | 出口管理 | 担当者（物件を仕入れた営業担当）の一覧表示 | 中 | UI | 小 |
| 7 | 出口管理 | 「仲手（仲介手数料）」入力フィールドの追加 | 中 | スキーマ + UI | 小 |
| 8 | 出口管理 | 一覧に「利益」（アッパー − 仕入れ金額）カラムを追加 | 中 | UI | 小 |
| 9 | 出口管理 | 金額の万表記対応（仕入れ・マイソク・仲手は万表記、家賃は円表記） | 中 | UI | 小 |
| 10 | 出口管理 | 築年月の和暦表示対応 | 中 | UI | 小 |
| 11 | 出口管理 | 新規登録フロー：物件情報入力 → マイソク作成への遷移 | 中 | UI + ルーティング | 中 |

---

## 作業詳細

### 作業1: 選択項目の解除（空白に戻す）機能

**現状**: 一度選択した項目を空白（未選択）に戻すことができない

**対象画面**:

- 基本情報の編集画面（管理組織、大業者、抵当銀行など）
- 進捗タブの各項目（レイジなど）

**変更内容**:

- `BadgeSelectForm` に選択解除機能を追加
- `SelectForm` に選択解除機能を追加
- `ComboboxForm` は既に削除機能あり（`field.onChange("")` パターン）

**実装方針**:

- 選択済みの場合にクリアボタン（×）を表示
- クリアボタン押下で `field.onChange("")` or `field.onChange(null)` を実行
- 全体のセレクト系コンポーネントに一括適用

**UIイメージ**:

```text
抵当銀行:  [SBJ銀行  ×]    ← ×ボタンで空白に戻せる
```

---

### 作業2: 権利証のUI変更

**現状**: `CheckboxForm` でチェックボックス表示（ON/OFF）

**変更後**: 「有」「無」の選択式（ラジオボタンまたはプルダウン）

**変更理由**: チェックボックスだと「チェック済み = 有」なのか「チェック済み = 確認済み」なのか判断が難しい

**影響ファイル**:

- `packages/drizzle/schemas/property.ts` - `propertyTitle` フィールドの型変更（boolean → enum）
- `apps/web/components/property/tabs/settlement-progress-tab.tsx` - UI変更
- `apps/web/components/property/form/` - 必要に応じてフォームコンポーネント追加

**スキーマ変更案**:

```text
propertyTitle: boolean → text enum ("available" | "unavailable")
```

**UIイメージ**:

```text
権利証:  [有]  [無]    ← どちらかしか押せないボタン or プルダウン
```

---

### 作業3: 住所変更のUI変更

**現状**: `CheckboxForm` でチェックボックス表示（ON/OFF）

**変更後**: 「なし」「1回」「2回以上」の3択選択式

**変更理由**: 住所変更回数によって司法書士への提出書類が変わるため

- なし → 書類提出不要
- 1回 → 住民票が必要
- 2回以上 → 住民票 + 戸籍の附票が必要

**影響ファイル**:

- `packages/drizzle/schemas/property.ts` - `addressChange` フィールドの型変更（boolean → enum）
- `apps/web/components/property/tabs/settlement-progress-tab.tsx` - UI変更

**スキーマ変更案**:

```text
addressChange: boolean → text enum ("none" | "once" | "twice_or_more")
```

**UIイメージ**:

```text
住所変更:  [なし]  [1回]  [2回以上]    ← どれか1つしか押せない
```

---

### 作業4: 出口管理一覧に「組織」カラム追加

**変更内容**: テーブルの先頭カラムに「組織」を追加

**影響ファイル**:

- `apps/web/components/exit/exit-list-columns.tsx` - カラム定義の追加

**UIイメージ**:

```text
| 組織 | ステータス | 物件名 | 仕入れ金額 | ... |
| レイジ | 交渉中 | ○○マンション | 990万 | ... |
```

---

### 作業5: 出口管理一覧に「家賃」カラム追加

**変更内容**: 一覧テーブルに家賃カラムを追加

**表記**: 円表記（例: 51,800円）

**影響ファイル**:

- `apps/web/components/exit/exit-list-columns.tsx` - カラム定義の追加

---

### 作業6: 担当者の一覧表示

**変更内容**: 出口管理一覧に担当者（物件を仕入れた営業担当）カラムを表示

**用途**: 出口管理を行う担当者が、物件を仕入れた営業に確認を取る際の参照情報

**影響ファイル**:

- `apps/web/components/exit/exit-list-columns.tsx` - カラム定義の追加

---

### 作業7: 「仲手（仲介手数料）」フィールド追加

**変更内容**: 出口管理に仲手（仲介手数料）の入力フィールドを追加

**背景**: 仕入れ金額とは別に仲介手数料が存在し、個別に管理が必要。現状のExcelでは仕入れ金額と仲手を1セルにまとめて表記している（例: 2500万/89.1万）

**影響ファイル**:

- Exit 型定義 - `brokerageFee` フィールド追加
- 出口管理スキーマ（将来） - `brokerage_fee` カラム追加
- `apps/web/components/exit/form/exit-form-fields.tsx` - 入力フィールド追加
- `apps/web/components/exit/exit-list-columns.tsx` - 一覧表示追加

**表記**: 万表記

---

### 作業8: 出口管理一覧に「利益」カラム追加

**変更内容**: アッパー金額 − 仕入れ金額 = 利益 を表示するカラムの追加

**計算式**:

```text
利益 = アッパー金額(confirmedPrice or maisokuPrice) − 仕入れ金額(purchasePrice)
```

**影響ファイル**:

- `apps/web/components/exit/exit-list-columns.tsx` - カラム定義の追加

**UIイメージ**:

```text
| ... | 仕入れ金額 | アッパー | 利益 | ... |
| ... | 990万 | 1,480万 | 490万 | ... |
```

---

### 作業9: 金額の万表記対応

**表記ルール**:

| 項目 | 表記 | 例 |
| ---- | ---- | --- |
| 仕入れ金額 | 万表記 | 990万 |
| マイソク価格 | 万表記 | 1,500万 |
| 仲手（仲介手数料） | 万表記 | 89.1万 |
| アッパー | 万表記 | 1,480万 |
| 利益 | 万表記 | 490万 |
| 家賃 | 円表記 | 51,800円 |

**影響ファイル**:

- `apps/web/components/exit/exit-list-columns.tsx` - フォーマット適用
- `apps/web/components/exit/form/exit-form-fields.tsx` - 入力時の単位表示

---

### 作業10: 築年月の和暦表示対応

**変更内容**: 出口管理・マイソクにおける築年月の表示を和暦にする

**表示例**: `平成17年3月`（西暦 2005年3月）

**実装方針**: `Intl.DateTimeFormat` を使用する

```typescript
new Intl.DateTimeFormat("ja-JP-u-ca-japanese", {
  era: "long",
  year: "numeric",
  month: "long",
}).format(date);
// → "平成17年3月"
```

**影響ファイル**:

- `apps/web/components/exit/exit-list-columns.tsx` - 一覧の築年月フォーマット
- `apps/web/components/exit/form/exit-form-fields.tsx` - 入力フォームの表示
- マイソクプレビュー・PDF出力（将来）

---

### 作業11: 新規登録フロー（物件情報入力 → マイソク作成）

**変更内容**: 出口管理の新規登録後、そのままマイソク作成画面に遷移するフローを構築

**フロー**:

```text
[出口管理一覧] → [新規登録] → 物件情報入力 → [保存してマイソク作成へ] → [マイソク作成画面（画像設定）]
```

**ステップ1: 物件情報入力（`/exits/new`）**

マイソクに必要な物件情報・金額情報を入力する。

- 物件名、号室、所在地、築年月、専有面積、構造、階数
- 最寄駅、家賃、管理費、修繕積立金
- 仕入れ金額、マイソク価格、仲手
- 現況、担当者、備考

**ステップ2: マイソク作成（`/exits/{exitId}/maisoku`）**

マイソクに掲載する画像を設定する。

- テンプレート選択（複数種類のレイアウトから選択）
- 画像アップロード（最大3枚以上）
- `react-rnd` による画像の配置・リサイズ調整
- プレビュー確認 → PDF出力

**マイソクテンプレート（参考サンプル）**:

- **テンプレートA**: 左に画像2枚（外観+間取り）縦並び、右に物件情報テーブル
- **テンプレートB**: 上部に物件情報、下部に画像3枚（外観+エントランス+間取り）横並び

**補足**:

- マイソク作成は必須（案件登録 = マイソク作成のタイミング）
- 移行期間中は、マイソクを作成せず案件だけ登録するケースも考慮（ただし一旦は必須フローで進める）
- 「ブランク」対応：金額を空欄にして業者に配布するケースあり

**影響ファイル**:

- `apps/web/app/(main)/exits/new/page.tsx` - フォーム送信後のリダイレクト先変更
- `apps/web/components/exit/exit-new-form.tsx` - ボタンラベル変更（「保存」→「マイソク作成へ進む」）
- `apps/web/app/(main)/exits/[exitId]/maisoku/page.tsx` - マイソク作成画面（画像設定）
- `apps/web/components/exit/maisoku/` - マイソク関連コンポーネント群

---

## 実装順序

### Phase A: 既存画面の改修（優先度高）

即座に運用改善できる項目を先に対応する。

1. **作業1** - 選択項目の解除機能（全体に影響するため最初に対応）
2. **作業2** - 権利証のUI変更
3. **作業3** - 住所変更のUI変更

### Phase B: 出口管理一覧の拡充

出口管理の一覧画面を要望に合わせてブラッシュアップする。

1. **作業4** - 組織カラム追加
2. **作業5** - 家賃カラム追加
3. **作業6** - 担当者カラム追加
4. **作業7** - 仲手フィールド追加
5. **作業8** - 利益カラム追加
6. **作業9** - 万表記対応
7. **作業10** - 築年月の和暦表示

### Phase C: 登録フロー構築

マイソク機能との連携を含む登録フローの構築。

1. **作業11** - 新規登録 → マイソク作成への遷移フロー

---

## スキーマ変更まとめ

### settlementProgress テーブル（既存変更）

| フィールド | 変更前 | 変更後 |
|-----------|--------|--------|
| `propertyTitle` | `boolean` | `text` enum ("available", "unavailable") |
| `addressChange` | `boolean` | `text` enum ("none", "once", "twice_or_more") |

### exits テーブル（新規追加）

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `brokerageFee` | `integer` | 中点・仲介手数料（万円） |

---

## マイソク画像配置の技術方針

画像のインポート・配置には `react-rnd` を使用する。

| ライブラリ | 特徴 | 採用 |
| ---- | ---- | ---- |
| [react-rnd](https://github.com/bokuweb/react-rnd) | ドラッグ＆リサイズを1コンポーネントで実現、ピクセル単位の自由配置 | ○ |
| react-grid-layout | グリッド単位の配置、ダッシュボード向き | × |

**採用理由**:

- A4固定レイアウト上にピクセル単位で画像を自由配置できる
- ドラッグ（移動）とリサイズが1つのコンポーネントで完結する
- 座標情報をそのままPDF出力（@react-pdf/renderer）に反映しやすい

---

## 注意事項

- スキーマ変更後は `pnpm drizzle:gm` の実行が必要
- 既存データのマイグレーション対応が必要（boolean → enum への変換）
  - `propertyTitle`: `true` → `"available"`, `false` → `"unavailable"`（またはNULL）
  - `addressChange`: `true` → `"once"`（暫定）, `false` → `"none"`（またはNULL）
- 選択解除機能は全画面に一括適用するため、共通コンポーネントレベルでの改修が効率的

---

## 次回ミーティング

- **日時**: 2026年2月21日（土）12:00〜
- **確認事項**: 上記作業の進捗報告

---

## 作業記録

### 作業1: 選択項目の解除（空白に戻す）機能 - 完了

**完了日**: 2026-02-21

**変更ファイル**:

- `apps/web/components/property/form/badge-select-form.tsx` - ×クリアボタン追加、`hidden` で表示制御
- `apps/web/components/property/form/select-form.tsx` - ×クリアボタン追加、`required` prop追加
- `apps/web/components/property/form/organization-select-form.tsx` - ×クリアボタン追加
- `apps/web/components/property/form/company-b-select-form.tsx` - ×クリアボタン追加
- `apps/web/components/property/form/combobox-form.tsx` - ×クリアボタン追加
- `apps/web/components/property/bank-account-form-card.tsx` - ×クリアボタン追加、shadcn最新パターン（Controller + Field/FieldLabel）に書き換え
- `apps/web/components/property/tabs/basic-info-tab.tsx` - `OrganizationSelectForm` に `required={true}` 追加
- `apps/web/components/property/tabs/contract-progress-tab.tsx` - 各項目に `required={true}` 追加
- `apps/web/components/property/tabs/document-progress-tab.tsx` - 各項目に `required={true}` 追加
- `apps/web/components/property/tabs/settlement-progress-tab.tsx` - 各項目に `required={true}` 追加

**実装仕様**:

- `Button variant="ghost" size="icon"` + `X` アイコンで統一
- `required` が `true` または値が未選択の場合は `hidden` でボタン非表示（幅確保せず広がる）
- `required` が `false` かつ値が選択済みの場合のみ×ボタン表示
- `bank-account-form-card.tsx` を `FormField` / `FormItem` / `FormLabel` / `FormControl` から `Controller` + `Field` / `FieldLabel` に移行

### 作業2: 権利証のUI変更（チェックボックス → 有/無/未確認 選択式） - 完了

**完了日**: 2026-02-21

**変更ファイル**:

- `packages/drizzle/schemas/property.ts` - `propertyTitle` を `integer(boolean)` → `text` に変更、デフォルト `"unconfirmed"`
- `packages/drizzle/types/property.ts` - `propertyTitleStatus` enum 追加（`"unconfirmed"` | `"available"` | `"unavailable"`）
- `packages/drizzle/zod-schemas/property.ts` - `z.boolean()` → `z.string()` に変更
- `packages/utils/src/constants/settlement-status.ts` - `PROPERTY_TITLE_STATUS_LABELS` / `PROPERTY_TITLE_STATUS_COLORS` 追加
- `apps/web/components/property/tabs/settlement-progress-tab.tsx` - `CheckboxForm` → `BadgeSelectForm` に変更
- `apps/web/components/property/property-form-provider.tsx` - デフォルト値を `false` → `"unconfirmed"` に変更
- `apps/web/lib/actions/property.ts` - CREATE/UPDATE ロジックを boolean → string 比較に変更
- `packages/drizzle/migrations/0024_melodic_santa_claus.sql` - データ変換SQL追記

**選択肢**:

| 値 | ラベル | 説明 |
| --- | --- | --- |
| `"unconfirmed"` | 未確認 | デフォルト |
| `"available"` | 有 | 持っている |
| `"unavailable"` | 無 | 持っていない |

**既存データ変換**:

- `true`（`1`）→ `"available"`（有）
- `false`（`0`）→ `"unavailable"`（無）
- 空 / NULL → `"unconfirmed"`（未確認）

### 作業3: 住所変更・氏名変更のUI変更 - 完了

**完了日**: 2026-02-21

**住所変更の変更ファイル**:

- `packages/drizzle/schemas/property.ts` - `addressChange` を `integer(boolean)` → `text` に変更、デフォルト `"unconfirmed"`
- `packages/drizzle/types/property.ts` - `addressChangeStatus` enum 追加
- `packages/drizzle/zod-schemas/property.ts` - `z.boolean()` → `z.string()` に変更
- `packages/utils/src/constants/settlement-status.ts` - `ADDRESS_CHANGE_STATUS_LABELS` / `ADDRESS_CHANGE_STATUS_COLORS` 追加
- `apps/web/components/property/tabs/settlement-progress-tab.tsx` - `CheckboxForm` → `BadgeSelectForm` に変更
- `apps/web/components/property/property-form-provider.tsx` - デフォルト値を `false` → `"unconfirmed"` に変更
- `apps/web/lib/actions/property.ts` - CREATE/UPDATE ロジックを boolean → string 比較に変更
- `packages/drizzle/migrations/0025_smart_mattie_franklin.sql` - データ変換SQL追記

**住所変更の選択肢**:

| 値 | ラベル |
| --- | --- |
| `"unconfirmed"` | 未確認（デフォルト） |
| `"none"` | なし |
| `"once"` | 1回 |
| `"twice_or_more"` | 2回以上 |

**住所変更の既存データ変換**:

- `true`（`1`）→ `"once"`（1回）
- `false`（`0`）/ 空 / NULL → `"unconfirmed"`（未確認）

**氏名変更の変更ファイル**:

- `packages/drizzle/schemas/property.ts` - `nameChange` を `integer(boolean)` → `text` に変更、デフォルト `"unconfirmed"`
- `packages/drizzle/types/property.ts` - `nameChangeStatus` enum 追加
- `packages/drizzle/zod-schemas/property.ts` - `z.boolean()` → `z.string()` に変更
- `packages/utils/src/constants/settlement-status.ts` - `NAME_CHANGE_STATUS_LABELS` / `NAME_CHANGE_STATUS_COLORS` 追加
- `apps/web/components/property/tabs/settlement-progress-tab.tsx` - `CheckboxForm` → `BadgeSelectForm` に変更
- `apps/web/components/property/property-form-provider.tsx` - デフォルト値を `false` → `"unconfirmed"` に変更
- `apps/web/lib/actions/property.ts` - CREATE/UPDATE ロジックを boolean → string 比較に変更
- `packages/drizzle/migrations/0026_perpetual_nemesis.sql` - データ変換SQL追記

**氏名変更の選択肢**:

| 値 | ラベル |
| --- | --- |
| `"unconfirmed"` | 未確認（デフォルト） |
| `"available"` | 有 |
| `"unavailable"` | 無 |

**氏名変更の既存データ変換**:

- `true`（`1`）→ `"available"`（有）
- `false`（`0`）→ `"unavailable"`（無）
- 空 / NULL → `"unconfirmed"`（未確認）

### 作業4: 出口管理一覧に「組織」カラム追加 - 完了

**完了日**: 2026-02-21

**変更ファイル**:

- `apps/web/lib/types/exit.ts` - `ExitListItem` に `organizationSlug` フィールド追加
- `apps/web/components/exit/exit-list-columns.tsx` - 先頭に「組織」カラム追加、`OrganizationBadge` コンポーネントを共通利用
- `apps/web/lib/mocks/exits.ts` - 全モックデータに `organizationSlug: "reygit"` 追加

**実装方針**:

- 物件管理一覧で使用中の `OrganizationBadge` コンポーネントを共通利用
- `organizationSlug` を使用して組織名・カラーを自動表示

### 作業5-6: 家賃・担当者カラム - 対応不要（実装済み）

**確認日**: 2026-02-21

既に `exit-list-columns.tsx` に家賃（`rent`）カラムと担当者（`staff`）カラムが実装済みのため、追加作業なし。

### 作業7: 仲手（仲介手数料）フィールド追加 - 完了

**完了日**: 2026-02-21

**変更ファイル**:

- `apps/web/lib/types/exit.ts` - `Exit` インターフェースに `brokerageFee: number | null` 追加
- `apps/web/lib/mocks/exits.ts` - 全モックデータに `brokerageFee` 値追加
- `apps/web/components/exit/exit-list-columns.tsx` - マイソク価格の後ろに「仲手」カラム追加

### 作業8: 利益カラム追加 - 完了

**完了日**: 2026-02-21

**変更ファイル**:

- `apps/web/components/exit/exit-list-columns.tsx` - 3番手の後ろに「利益」計算カラム追加

**計算ロジック**:

- 利益 = `confirmedPrice`（確定金額） ?? `rankedResponses[0]?.price`（アッパー） − `purchasePrice`（仕入れ金額）
- マイナスの場合は `text-destructive` で赤字表示

### 作業9: 金額の万表記対応 - 完了

**完了日**: 2026-02-21

**変更ファイル**:

- `apps/web/components/exit/exit-list-columns.tsx` - `formatPriceMan` に「万」、`formatPriceYen` に「円」サフィックス追加、`RankingCell` の重複「万」を削除

### 作業10: 築年月の和暦表示対応 - 完了

**完了日**: 2026-02-21

**変更ファイル**:

- `apps/web/components/exit/exit-list-columns.tsx` - `formatDate` → `formatDateWareki` に変更、`Intl.DateTimeFormat("ja-JP-u-ca-japanese")` を使用、`formatDateWithMonthEnd` インポート削除

**表示例**: `令和2年10月`（2020年10月）

### 作業11: 新規登録フロー構築 - 完了

**完了日**: 2026-02-21

**変更ファイル**:

- `apps/web/lib/zod/schemas/exit.ts` - `brokerageFee` フィールド追加
- `apps/web/components/exit/exit-form-provider.tsx` - `brokerageFee` デフォルト値追加、作成後の遷移先を `/exits/${exitId}/maisoku` に変更
- `apps/web/components/exit/exit-new-form.tsx` - ボタンラベル「保存」→「マイソク作成へ進む」、ArrowRightアイコン追加
- `apps/web/components/exit/form/exit-form-fields.tsx` - 仲手（万円）入力フィールド追加
- `apps/web/app/(main)/exits/[exitId]/maisoku/page.tsx` - マイソク作成ページ新規作成
- `apps/web/components/exit/maisoku/maisoku-editor.tsx` - マイソクエディターコンポーネント（テンプレート選択・画像設定・プレビュー）
- `apps/web/components/exit/maisoku/maisoku-template-selector.tsx` - テンプレートA/B選択コンポーネント
- `apps/web/components/exit/maisoku/maisoku-preview.tsx` - マイソクプレビュー（A4比率、物件情報テーブル、画像プレースホルダー）

**実装内容**:

- 新規登録フロー: `/exits/new` → 保存 → `/exits/{exitId}/maisoku` への遷移
- テンプレートA: 左に画像2枚（外観+間取り）、右に物件情報テーブル
- テンプレートB: 上部に物件情報テーブル、下部に画像3枚（横並び）
- 画像アップロード・react-rnd配置・PDF出力は将来実装（UIプレースホルダー配置済み）

---

最終更新: 2026-02-21
