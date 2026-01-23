# 案件管理機能 変更仕様書

## バージョン情報

- **作成日**: 2026-01-17
- **バージョン**: 1.0
- **対象**: 案件編集画面（決済進捗タブ）

---

## 1. 変更概要

案件管理の編集画面（決済進捗タブ）において、以下のカテゴリの項目を追加・変更します。

| カテゴリ | 変更内容 |
|---------|---------|
| 銀行関連 | 項目追加、画面位置移動 |
| 司法書士関連 | 項目追加 |
| 手出し関係 | 新規カテゴリ追加 |
| 賃管関係 | 項目追加 |

---

## 2. 銀行関連

### 2.1 変更内容

1. **新規項目追加**: 「抵当権抹消依頼」
2. **画面位置移動**: 書類進捗タブ → 決済進捗タブ

### 2.2 抵当権抹消依頼（mortgageCancellationRequest）

| 項目 | 値 |
|------|-----|
| 項目ID | mortgageCancellationRequest |
| 項目名 | 抵当権抹消依頼 |
| 型 | enum |
| 必須 | - |
| デフォルト | not_requested |

#### 選択肢

| 値 | 表示名 | 説明 |
|----|--------|------|
| not_requested | 未依頼 | まだ依頼していない |
| requesting | 依頼中 | 依頼済み、手続き待ち |
| completed | 手続き完了 | 手続き完了 |
| not_required | 不要 | この案件では不要 |

### 2.3 銀行関係の移動

書類進捗タブにある以下の項目を決済進捗タブに移動:

- ローン計算書（loan_calculation）
- **抵当権抹消依頼（mortgageCancellationRequest）** ※新規追加

---

## 3. 司法書士関連

### 3.1 変更内容

決済進捗タブの司法書士関連セクションに以下の項目を追加します。

### 3.2 権利証（propertyTitle）

| 項目 | 値 |
|------|-----|
| 項目ID | propertyTitle |
| 項目名 | 権利証 |
| 型 | boolean (nullable) |
| 必須 | - |
| デフォルト | null |

#### 値

| 値 | 表示名 |
|----|--------|
| true | 有 |
| false | 無 |
| null | 未設定 |

### 3.3 住所変更（addressChange）

| 項目 | 値 |
|------|-----|
| 項目ID | addressChange |
| 項目名 | 住所変更 |
| 型 | boolean (nullable) |
| 必須 | - |
| デフォルト | null |

#### 値

| 値 | 表示名 |
|----|--------|
| true | 有 |
| false | 無 |
| null | 未設定 |

### 3.4 氏名変更（nameChange）

| 項目 | 値 |
|------|-----|
| 項目ID | nameChange |
| 項目名 | 氏名変更 |
| 型 | boolean (nullable) |
| 必須 | - |
| デフォルト | null |

#### 値

| 値 | 表示名 |
|----|--------|
| true | 有 |
| false | 無 |
| null | 未設定 |

### 3.5 本人確認方法（identityVerificationMethod）

| 項目 | 値 |
|------|-----|
| 項目ID | identityVerificationMethod |
| 項目名 | 本人確認方法 |
| 型 | enum |
| 必須 | - |
| デフォルト | null |

#### 選択肢

| 値 | 表示名 | 説明 |
|----|--------|------|
| limited_mail | 本人限定郵便 | 本人限定郵便で確認 |
| in_person | 立会 | 直接立会で確認 |

### 3.6 本人確認電話（identityVerificationCall）

| 項目 | 値 |
|------|-----|
| 項目ID | identityVerificationCall |
| 項目名 | 本人確認電話 |
| 型 | enum |
| 必須 | - |
| デフォルト | not_requested |

#### 選択肢

| 値 | 表示名 | 説明 |
|----|--------|------|
| not_requested | 未依頼 | まだ依頼していない |
| scheduled | 期日設定済み | 電話の期日を設定済み |
| completed | 対応完了 | 電話対応完了 |
| not_required | 不要 | この案件では不要 |

### 3.7 本人確認（identityVerificationStatus）

| 項目 | 値 |
|------|-----|
| 項目ID | identityVerificationStatus |
| 項目名 | 本人確認 |
| 型 | enum |
| 必須 | - |
| デフォルト | not_started |

#### 選択肢

| 値 | 表示名 | 説明 |
|----|--------|------|
| not_started | 未対応 | まだ対応していない |
| lawyer_sent | 司法書士 書類発送 | 司法書士が書類を発送済み |
| owner_received | 所有者 書類受取 | 所有者が書類を受け取った |
| owner_returned | 所有者 書類返送 | 所有者が書類を返送した |
| completed | 完了 | 本人確認完了 |
| not_required | 不要 | この案件では不要 |

---

## 4. 手出し関係（新規カテゴリ）

### 4.1 変更内容

決済進捗タブに「手出し関係」セクションを新規追加します。

### 4.2 手出し状況（sellerFundingStatus）

| 項目 | 値 |
|------|-----|
| 項目ID | sellerFundingStatus |
| 項目名 | 手出し状況 |
| 型 | enum |
| 必須 | - |
| デフォルト | not_required |

#### 選択肢

| 値 | 表示名 | 説明 |
|----|--------|------|
| not_required | 不要 | 手出し不要 |
| loan_preliminary_review | ローン仮審査中 | ローンの仮審査中 |
| loan_final_review | ローン本審査中 | ローンの本審査中 |
| review_completed | 審査完了 | ローン審査完了 |
| funds_ready | 用意完了 | 資金の用意完了 |

---

## 5. 賃管関係

### 5.1 変更内容

決済進捗タブの賃管関係セクションに以下の項目を追加します。

### 5.2 サブリース承継（subleaseSuccession）

| 項目 | 値 |
|------|-----|
| 項目ID | subleaseSuccession |
| 項目名 | サブリース承継 |
| 型 | enum |
| 必須 | - |
| デフォルト | not_required |

#### 選択肢

| 値 | 表示名 | 説明 |
|----|--------|------|
| not_required | 不要 | サブリース承継不要 |
| confirming_method | 継承方法確認中 | 継承方法を確認中 |
| in_progress | 対応中 | 承継対応中 |
| completed | 手続き完了 | 承継手続き完了 |

### 5.3 賃契原本＆鍵（rentalContractAndKey）

| 項目 | 値 |
|------|-----|
| 項目ID | rentalContractAndKey |
| 項目名 | 賃契原本＆鍵 |
| 型 | enum |
| 必須 | - |
| デフォルト | not_requested |

#### 選択肢

| 値 | 表示名 | 説明 |
|----|--------|------|
| not_requested | 未依頼 | まだ依頼していない |
| requesting | 依頼中 | 依頼済み、取得待ち |
| acquired | 取得済 | 取得完了 |
| not_required | 不要 | この案件では不要 |

### 5.4 保証会社承継（guaranteeCompanySuccession）

| 項目 | 値 |
|------|-----|
| 項目ID | guaranteeCompanySuccession |
| 項目名 | 保証会社承継 |
| 型 | enum |
| 必須 | - |
| デフォルト | not_required |

#### 選択肢

| 値 | 表示名 | 説明 |
|----|--------|------|
| not_required | 不要 | 保証会社承継不要 |
| confirming_method | 継承方法確認中 | 継承方法を確認中 |
| in_progress | 対応中 | 承継対応中 |
| completed | 手続き完了 | 承継手続き完了 |

---

## 6. 画面レイアウト（決済進捗タブ）

### 6.1 セクション構成（変更後）

```
決済進捗タブ
├── 精算書関係（既存）
│   ├── BC精算書作成
│   ├── BC精算書送付
│   ├── BC精算書CB完了
│   ├── AB精算書作成
│   ├── AB精算書送付
│   └── AB精算書CR完了
│
├── 司法書士関係（拡張）
│   ├── 司法書士依頼（既存）
│   ├── 必要書類共有（既存）
│   ├── 権利証 ★新規
│   ├── 住所変更 ★新規
│   ├── 氏名変更 ★新規
│   ├── 本人確認方法 ★新規
│   ├── 本人確認電話 ★新規
│   ├── 本人確認（identityVerificationStatus） ★新規
│   ├── 書類不備なし（既存）
│   └── 本人確認書類（既存）※既存のidentityVerification
│
├── 銀行関係 ★移動
│   ├── 抵当銀行ステータス（既存）
│   ├── 銀行書類不備なし（既存）
│   ├── ローン計算書保存（既存）
│   ├── 抵当権抹消依頼 ★新規
│   ├── 売主手出し完了（既存）
│   └── 手出し状況 ★新規
│
├── 手出し関係 ★新規セクション
│   └── 手出し状況
│
├── 賃貸管理解約関係（拡張）
│   ├── 管理解約予定月（既存）
│   ├── 管理解約依頼（既存）
│   ├── 管理解約完了（既存）
│   ├── サブリース承継 ★新規
│   ├── 賃契原本＆鍵 ★新規
│   └── 保証会社承継 ★新規
│
└── 決済後処理関係（既存）
    ├── 保証会社承継ステータス（既存）※guaranteeTransferStatus
    ├── 鍵ステータス（既存）
    ├── 口座振替手続きステータス（既存）
    └── 取引台帳記入（既存）
```

---

## 7. データベース変更

### 7.1 settlementProgress テーブルへの追加カラム

| カラム名 | 型 | デフォルト | 説明 |
|---------|-----|-----------|------|
| mortgageCancellationRequest | text (enum) | 'not_requested' | 抵当権抹消依頼 |
| propertyTitle | integer (boolean) | null | 権利証（有/無） |
| addressChange | integer (boolean) | null | 住所変更（有/無） |
| nameChange | integer (boolean) | null | 氏名変更（有/無） |
| identityVerificationMethod | text (enum) | null | 本人確認方法 |
| identityVerificationCall | text (enum) | 'not_requested' | 本人確認電話 |
| identityVerificationStatus | text (enum) | 'not_started' | 本人確認ステータス |
| sellerFundingStatus | text (enum) | 'not_required' | 手出し状況 |
| subleaseSuccession | text (enum) | 'not_required' | サブリース承継 |
| rentalContractAndKey | text (enum) | 'not_requested' | 賃契原本＆鍵 |
| guaranteeCompanySuccession | text (enum) | 'not_required' | 保証会社承継 |

### 7.2 各カラムの更新日時・更新者（任意）

必要に応じて、各項目に対して以下のカラムを追加:

- `{カラム名}At` (timestamp) - 更新日時
- `{カラム名}By` (text) - 更新者ID

---

## 8. 実装時の注意事項

### 8.1 既存項目との整合性

- 既存の `identityVerification` は「本人確認書類」として残す
- 新規の `identityVerificationStatus` は「本人確認」として追加
- 既存の `guaranteeTransferStatus` は「保証会社承継ステータス」として残す
- 新規の `guaranteeCompanySuccession` は「保証会社承継」として追加

### 8.2 書類進捗タブからの移動

- ローン計算書（loan_calculation）を書類進捗タブから削除
- 決済進捗タブの銀行関係セクションに追加

### 8.3 UI実装

- 新規項目はSelect コンポーネントで実装
- 有/無の選択は Badge Toggle パターンも検討可能
- 既存のインライン編集パターンに準拠

---

## 9. 追加項目一覧（サマリ）

| カテゴリ | 項目名 | 項目ID |
|---------|--------|--------|
| 銀行関連 | 抵当権抹消依頼 | mortgageCancellationRequest |
| 司法書士関連 | 権利証 | propertyTitle |
| 司法書士関連 | 住所変更 | addressChange |
| 司法書士関連 | 氏名変更 | nameChange |
| 司法書士関連 | 本人確認方法 | identityVerificationMethod |
| 司法書士関連 | 本人確認電話 | identityVerificationCall |
| 司法書士関連 | 本人確認 | identityVerificationStatus |
| 手出し関係 | 手出し状況 | sellerFundingStatus |
| 賃管関係 | サブリース承継 | subleaseSuccession |
| 賃管関係 | 賃契原本＆鍵 | rentalContractAndKey |
| 賃管関係 | 保証会社承継 | guaranteeCompanySuccession |

**合計**: 11項目追加

---

最終更新: 2026-01-17
