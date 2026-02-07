# 案件新規登録・編集画面 仕様書

## バージョン情報

- **作成日**: 2026-01-17
- **バージョン**: 1.0
- **対象フェーズ**: Phase 1（現在の実装状態）

---

## 1. 画面概要

### 1.1 画面の目的

案件の新規登録および既存案件の編集を行う画面です。4つのタブで情報を整理し、段階的に入力・更新できるようにします。

### 1.2 想定利用者

- 営業担当者（新規登録・編集）
- 事務担当者（新規登録・編集）
- 経営者（新規登録・編集）

### 1.3 画面のURL

| モード | URL | 説明 |
|--------|-----|------|
| 新規登録 | `/properties/new` | 新しい案件を登録 |
| 編集 | `/properties/unconfirmed/[id]/edit` | BC確定前案件の編集 |

### 1.4 表示形式

- 通常ページ形式（モーダルではない）
- スクロール可能
- SidebarProviderによる3層構造を採用

---

## 2. 画面構成

### 2.1 レイアウト構造

```
┌────────────────────────────────────────────────────────────────────┐
│ サイドバー │ ヘッダー（SiteHeader）                                 │
│           │ [≡] | 案件管理 / 新規案件登録      [キャンセル] [保存]  │
│           ├───────────────────────────────────────────────────────│
│           │ メインコンテンツエリア                                  │
│           │                                                        │
│  ・案件管理 │  ┌────────────────────────────────────────────────┐  │
│  ・組織管理 │  │ タブナビゲーション                               │  │
│  ・設定    │  │ [基本情報] [契約進捗] [書類進捗] [決済進捗]        │  │
│           │  ├────────────────────────────────────────────────┤  │
│           │  │ タブコンテンツエリア（Card内）                      │  │
│           │  │                                                    │  │
│           │  │ ┌──────────────────┬───────────────────┐    │  │
│           │  │ │ 左側エリア（60%）    │ 右側エリア（40%）    │    │  │
│           │  │ │                      │                      │    │  │
│           │  │ │ ■ 物件基本情報       │ ■ 契約関係          │    │  │
│           │  │ │  ・担当              │  ・契約形態          │    │  │
│           │  │ │  ・物件名            │  ・B会社             │    │  │
│           │  │ │  ・号室              │  ・仲介会社          │    │  │
│           │  │ │  ・オーナー名         │  ・買取業者          │    │  │
│           │  │ │                      │  ・抵当銀行          │    │  │
│           │  │ │ ■ 金額情報          │                      │    │  │
│           │  │ │  ・A金額             │ ■ その他            │    │  │
│           │  │ │  ・出口金額          │  ・名簿種別          │    │  │
│           │  │ │  ・仲手等            │  ・備考              │    │  │
│           │  │ │  ・利益（自動計算）    │                      │    │  │
│           │  │ │  ・BC手付            │                      │    │  │
│           │  │ └──────────────────┴───────────────────┘    │  │
│           │  └────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────┘
```

### 2.2 共通要素

#### 2.2.1 ヘッダー（SiteHeader）

**構成要素**:

- **左側エリア**:
  - サイドバートグル（≡ アイコン）
  - セパレーター（|）
  - パンくずリスト（例: 案件管理 / 新規案件登録）

- **右側エリア**:
  - キャンセルボタン（Secondary variant）
  - 保存ボタン（Primary variant）

#### 2.2.2 タブナビゲーション

| タブ名 | 説明 | 新規登録時 | 編集時 |
|--------|------|------------|--------|
| 基本情報 | 物件・金額・契約情報 | ○ | ○ |
| 契約進捗 | 契約関連のチェック項目 | ○ | ○ |
| 書類進捗 | 書類取得状況 | ○ | ○ |
| 決済進捗 | 決済関連のチェック項目 | ○ | ○ |

**実装**:

- Tabsコンポーネント（shadcn/ui）
- デフォルトで「基本情報」タブを選択

#### 2.2.3 アクションボタン

| ボタン | 機能 | ショートカット | 配置 |
|--------|------|----------------|------|
| キャンセル | 変更を破棄して前画面に戻る | Esc | SiteHeader右側 |
| 保存 | 入力内容を保存 | Ctrl+S / Cmd+S | SiteHeader右側 |

---

## 3. タブ1: 基本情報

### 3.1 レイアウト

2カラム構成（左側60%、右側40%）

### 3.2 入力項目（左側）

#### 3.2.1 物件基本情報

| 項目名 | 項目ID | 入力タイプ | 必須 | バリデーション |
|--------|--------|------------|------|----------------|
| 担当 | staffIds | 複数選択（Combobox） | ○ | 最低1名選択 |
| 物件名 | propertyName | テキスト | ○ | 最大100文字 |
| 号室 | roomNumber | テキスト | - | 最大20文字 |
| オーナー名 | ownerName | テキスト | ○ | 最大100文字 |

**担当者選択の仕様**:

- 組織のセールスチームメンバーから選択
- 複数選択可能（Combobox + Badge表示）
- 選択済みの担当者はバッジで表示、×で削除可能

#### 3.2.2 金額情報

| 項目名 | 項目ID | 入力タイプ | 必須 | バリデーション |
|--------|--------|------------|------|----------------|
| A金額 | amountA | 数値（万円） | - | 0以上の整数 |
| 出口金額 | amountExit | 数値（万円） | - | 0以上の整数 |
| 仲手等 | commission | 数値（万円） | - | 0以上の整数 |
| 利益 | profit | 表示のみ | - | 自動計算 |
| BC手付 | bcDeposit | 数値（万円） | - | 0以上の整数 |

**利益の自動計算**:

```
利益 = 出口金額 - A金額 + 仲手等
```

**注意**: 契約形態が「違約」の場合、利益は自動計算されない（手動入力）

**金額入力の仕様**:

- 万円単位で入力
- 保存時に円単位に変換（× 10,000）
- 3桁ごとのカンマ表示

### 3.3 入力項目（右側）

#### 3.3.1 契約関係

| 項目名 | 項目ID | 入力タイプ | 必須 | 選択肢/バリデーション |
|--------|--------|------------|------|----------------------|
| 契約形態 | contractType | Select | - | 下記参照 |
| B会社 | companyB | Select | - | 下記参照 |
| 仲介会社 | brokerCompany | Select | - | 下記参照 |
| 買取業者 | buyerCompany | Combobox | - | サジェスト付き、最大100文字 |
| 抵当銀行 | mortgageBank | テキスト | - | 最大100文字 |

#### 3.3.2 日付情報

| 項目名 | 項目ID | 入力タイプ | 必須 | バリデーション |
|--------|--------|------------|------|----------------|
| A契約日 | contractDateA | DatePicker | - | - |
| BC契約日 | contractDateBc | DatePicker | - | - |

#### 3.3.3 その他

| 項目名 | 項目ID | 入力タイプ | 必須 | バリデーション |
|--------|--------|------------|------|----------------|
| 名簿種別 | listType | テキスト | - | 最大50文字 |
| 備考 | notes | テキストエリア | - | 最大1000文字 |

---

## 4. タブ2: 契約進捗

### 4.1 レイアウト

2カラム構成（左側50%、右側50%）

### 4.2 スケジュール（上部）

| 項目名 | 項目ID | 入力タイプ | 説明 |
|--------|--------|------------|------|
| 決済予定日 | settlementDate | MonthPicker | 月単位で選択可能 |

### 4.3 進捗ステータス

| 項目名 | 項目ID | 入力タイプ | 選択肢 |
|--------|--------|------------|--------|
| マイソク配布 | maisokuDistributed | Badge Toggle | 未配布 / 配布済 |
| 業務ステータス | progressStatus | Select | 7段階（下記参照） |
| 書類ステータス | documentStatus | Select | 3段階（下記参照） |

### 4.4 AB関係（左側）

| チェック項目 | 項目ID | 表示内容 |
|--------------|--------|----------|
| 契約書 保存完了 | abContractSaved | □ チェックボックス |
| 委任状関係 保存完了 | abAuthorizationSaved | □ チェックボックス |
| 売主身分証 保存完了 | abSellerIdSaved | □ チェックボックス |

**チェック済みの場合の表示**:

```
✓ 契約書 保存完了
  2025/01/15 14:30 田中太郎
```

### 4.5 BC関係（右側）

| チェック項目 | 項目ID | 表示内容 |
|--------------|--------|----------|
| BC売契作成 | bcContractCreated | □ チェックボックス |
| 重説作成 | bcDescriptionCreated | □ チェックボックス |
| BC売契送付 | bcContractSent | □ チェックボックス |
| 重説送付 | bcDescriptionSent | □ チェックボックス |
| BC売契CB完了 | bcContractCbDone | □ チェックボックス |
| 重説CB完了 | bcDescriptionCbDone | □ チェックボックス |

---

## 5. タブ3: 書類進捗

### 5.1 レイアウト

全幅でカテゴリごとにグループ化

### 5.2 各書類のステータス

各書類について4段階のステータスを選択。

#### 5.2.1 賃貸管理関係

| 書類名 | 項目ID |
|--------|--------|
| 賃貸借契約書 | rental_contract |
| 管理委託契約書 | management_contract |
| 入居申込書 | move_in_application |

#### 5.2.2 建物管理関係

| 書類名 | 項目ID |
|--------|--------|
| 重要事項調査報告書 | important_matter_report |
| 管理規約 | management_rules |
| 長期修繕計画書 | long_term_repair_plan |
| 総会議事録 | general_meeting_minutes |
| パンフレット | pamphlet |
| 口座振替用紙 | account_transfer_form |
| 所有者変更届 | owner_change_notification |

#### 5.2.3 役所関係

| 書類名 | 項目ID |
|--------|--------|
| 公課証明 | tax_certificate |
| 建築計画概要書 | building_plan_overview |
| 台帳記載事項証明書 | register_certification |
| 用途地域 | zoning |
| 道路台帳 | road_register |

#### 5.2.4 銀行関係

| 書類名 | 項目ID |
|--------|--------|
| ローン計算書 | loan_calculation |

### 5.3 書類ステータス選択肢

| 値 | 表示名 | 色 |
|----|--------|-----|
| not_requested | 未依頼 | グレー |
| requesting | 依頼中 | 黄色 |
| acquired | 取得済 | 緑 |
| not_required | 不要 | 青 |

---

## 6. タブ4: 決済進捗

### 6.1 レイアウト

2カラム構成（左側60%、右側40%）

### 6.2 左側エリア

#### 6.2.1 精算書関係

| 項目名 | 項目ID | 入力タイプ |
|--------|--------|------------|
| BC精算書作成 | bcStatementCreated | チェックボックス |
| BC精算書送付 | bcStatementSent | チェックボックス |
| BC精算書CB完了 | bcStatementCbDone | チェックボックス |
| AB精算書作成 | abStatementCreated | チェックボックス |
| AB精算書送付 | abStatementSent | チェックボックス |
| AB精算書CR完了 | abStatementCrDone | チェックボックス |

#### 6.2.2 司法書士関係

| 項目名 | 項目ID | 入力タイプ |
|--------|--------|------------|
| 司法書士依頼 | lawyerRequested | チェックボックス |
| 必要書類共有 | documentsShared | チェックボックス |
| 本人確認書類 | identityVerification | Badge Toggle（発送/受取/返送） |
| 書類不備なし | documentsComplete | チェックボックス |

#### 6.2.3 抵当銀行関係

| 項目名 | 項目ID | 入力タイプ |
|--------|--------|------------|
| 抵当銀行 | mortgageBankStatus | Badge Toggle（依頼/受付完了） |
| 銀行書類不備なし | bankDocumentsComplete | チェックボックス |
| ローン計算書保存 | loanSaved | チェックボックス |
| 売主手出し完了 | sellerPaymentDone | チェックボックス |

#### 6.2.4 賃貸管理関係

| 項目名 | 項目ID | 入力タイプ |
|--------|--------|------------|
| 管理解約予定月 | managementCancelScheduledMonth | MonthPicker |
| 管理解約依頼 | managementCancelRequested | チェックボックス |
| 管理解約完了 | managementCancelDone | チェックボックス |

#### 6.2.5 決済後処理関係

| 項目名 | 項目ID | 入力タイプ |
|--------|--------|------------|
| 保証会社承継 | guaranteeTransferStatus | Badge Toggle（依頼/完了） |
| 鍵 | keyStatus | Badge Toggle（受取/発送） |
| 口座振替手続き | accountTransferStatus | Badge Toggle（受取/発送） |
| 取引台帳記入 | ledgerEntry | チェックボックス |

### 6.3 右側エリア

#### 6.3.1 口座情報

| 項目名 | 項目ID | 入力タイプ | 選択肢 |
|--------|--------|------------|--------|
| 使用口座会社 | accountCompany | Select | レイジット/ライフ/エムズ |
| 使用銀行口座 | bankAccount | Select | 会社により動的変更 |

**銀行口座の選択肢**:

| 口座会社 | 銀行口座選択肢 |
|----------|----------------|
| レイジット | GMOメイン / GMOサブ / 近産 |
| ライフ | メイン1727088 / サブ1728218 / 新メイン2309414 |
| エムズ | 住信 / GMOメイン / GMOサブ / 楽天 / PayPay(1) |

#### 6.3.2 口座カード表示

選択した口座会社・銀行口座の組み合わせをカード形式で表示。

---

## 7. バリデーション

### 7.1 必須項目チェック

新規登録時の必須項目:

- 担当（最低1名）
- 物件名
- オーナー名

### 7.2 数値項目

- 金額項目: 0以上の整数、カンマ自動挿入
- 日付項目: 有効な日付形式

### 7.3 文字数制限

| 項目 | 最大文字数 |
|------|------------|
| 物件名 | 100 |
| 号室 | 20 |
| オーナー名 | 100 |
| 買取業者 | 100 |
| 抵当銀行 | 100 |
| 名簿種別 | 50 |
| 備考 | 1000 |

### 7.4 相関チェック

- 決済日が設定されている場合、進捗ステータスは「BC確定前」以外である必要がある
- 進捗ステータスが「BC確定前」の場合、決済日は設定不可

---

## 8. データフロー

### 8.1 新規登録時

```
[フォーム入力]
    ↓
[PropertyFormProvider]
    ↓
[バリデーション（Zod）]
    ↓
[Server Action: createProperty]
    ↓
[トランザクション処理]
    - properties INSERT
    - propertyStaff INSERT（担当者分）
    - contractProgress INSERT
    - documentProgress INSERT
    - settlementProgress INSERT
    ↓
[revalidatePath('/properties/unconfirmed')]
    ↓
[成功トースト + リダイレクト]
```

### 8.2 編集時

```
[フォーム入力]
    ↓
[PropertyFormProvider]
    ↓
[変更検出]
    ↓
[バリデーション（Zod）]
    ↓
[Server Action: updateProperty]
    ↓
[トランザクション処理]
    - properties UPDATE
    - propertyStaff DELETE + INSERT（差分更新）
    - contractProgress UPDATE
    - documentProgress UPDATE
    - propertyDocumentItems UPSERT
    - settlementProgress UPDATE
    ↓
[revalidatePath('/properties')]
    ↓
[成功トースト]
```

---

## 9. コンポーネント構成

### 9.1 主要コンポーネント

| コンポーネント | ファイル | 説明 |
|---------------|----------|------|
| PropertyFormProvider | property-form-provider.tsx | フォーム状態管理 |
| PropertyFormTabs | property-form-tabs.tsx | タブナビゲーション |
| PropertyFormActions | property-form-actions.tsx | 保存・キャンセルボタン |
| BasicInfoTab | tabs/basic-info-tab.tsx | 基本情報タブ |
| ContractProgressTab | tabs/contract-progress-tab.tsx | 契約進捗タブ |
| DocumentProgressTab | tabs/document-progress-tab.tsx | 書類進捗タブ |
| SettlementProgressTab | tabs/settlement-progress-tab.tsx | 決済進捗タブ |

### 9.2 フォームフィールドコンポーネント

| コンポーネント | ファイル | 説明 |
|---------------|----------|------|
| StaffCombobox | form/staff-combobox.tsx | 担当者選択 |
| OrganizationSelect | form/organization-select.tsx | 組織選択 |
| ContractTypeSelect | form/contract-type-select.tsx | 契約形態選択 |
| CompanyBSelect | form/company-b-select.tsx | B会社選択 |
| BrokerCompanySelect | form/broker-company-select.tsx | 仲介会社選択 |
| BuyerCompanyCombobox | form/buyer-company-combobox.tsx | 買取業者選択 |
| CurrencyInput | form/currency-input.tsx | 金額入力 |
| SettlementDatePicker | form/settlement-date-picker.tsx | 決済日選択 |
| ProgressCheckItem | form/progress-check-item.tsx | チェック項目 |

---

## 10. 権限による制御

### 10.1 新規登録権限

| ロール | 新規登録 |
|--------|----------|
| owner（経営者） | ○ |
| admin（管理者） | ○ |
| member（メンバー） | ○ |

### 10.2 編集権限

| ロール | 全項目編集 |
|--------|------------|
| owner（経営者） | ○ |
| admin（管理者） | ○ |
| member（メンバー） | ○ |

---

## 11. 関連ファイル

### 11.1 ページ

- `apps/web/app/(main)/properties/new/page.tsx`
- `apps/web/app/(main)/properties/unconfirmed/[id]/edit/page.tsx`

### 11.2 コンポーネント

- `apps/web/components/property/property-form-provider.tsx`
- `apps/web/components/property/property-form-tabs.tsx`
- `apps/web/components/property/tabs/*.tsx`
- `apps/web/components/property/form/*.tsx`

### 11.3 サーバーアクション

- `apps/web/lib/actions/property.ts`

### 11.4 データ取得

- `apps/web/lib/data/property.ts`

### 11.5 型定義

- `packages/drizzle/types/property.ts`

### 11.6 Zodスキーマ

- `packages/drizzle/zod-schemas/property.ts`

---

最終更新: 2026-01-17
