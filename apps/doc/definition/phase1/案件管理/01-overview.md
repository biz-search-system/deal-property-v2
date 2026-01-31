# 案件管理機能 仕様書

## バージョン情報

- **作成日**: 2026-01-17
- **バージョン**: 1.0
- **対象フェーズ**: Phase 1（現在の実装状態）

---

## 1. 機能概要

### 1.1 目的

1R投資用マンションの物上げ業務における案件管理を効率化し、案件の登録・進捗管理・決済までの追跡を一元管理するシステムです。

### 1.2 主要機能

| 機能 | 説明 |
|------|------|
| 案件新規登録 | 新しい案件を登録する |
| 案件検索 | 全案件を検索・フィルタリングする |
| BC確定前案件一覧 | BC確定前の案件を一覧表示し管理する |
| 月次案件一覧 | 月ごとの決済予定案件を管理する |
| 案件詳細表示 | 案件の全情報を閲覧する |
| 案件編集 | 案件情報を編集する |
| インライン編集 | 一覧画面から直接編集する |

### 1.3 画面構成

```
/properties
├── /new                           # 案件新規登録
├── /search                        # 案件検索一覧
│   └── /[id]                      # 案件詳細（検索結果から）
├── /unconfirmed                   # BC確定前案件一覧
│   └── /[id]                      # BC確定前案件詳細
│       └── /edit                  # BC確定前案件編集
└── /monthly/[year]/[month]        # 月次案件一覧
    └── /[id]                      # 月次案件詳細
```

---

## 2. データモデル

### 2.1 主要テーブル

| テーブル名 | 説明 |
|-----------|------|
| properties | 案件の基本情報 |
| propertyStaff | 案件と担当者の紐付け（多対多） |
| contractProgress | 契約進捗情報 |
| documentProgress | 書類進捗情報（全体ステータス） |
| propertyDocumentItems | 個別書類のステータス（16種類） |
| settlementProgress | 決済進捗情報 |
| propertyProgressHistory | 進捗変更履歴（監査用） |

### 2.2 案件の基本情報（properties）

#### 基本項目

| 項目名 | 項目ID | 型 | 必須 | 説明 |
|--------|--------|-----|------|------|
| ID | id | string | ○ | 一意識別子 |
| 組織ID | organizationId | string | ○ | 管理組織 |
| 物件名 | propertyName | string | ○ | 物件の名称 |
| 号室 | roomNumber | string | - | 部屋番号 |
| オーナー名 | ownerName | string | ○ | オーナー名 |

#### 金額項目（円単位で保存）

| 項目名 | 項目ID | 型 | 必須 | 説明 |
|--------|--------|-----|------|------|
| A金額 | amountA | integer | - | 入口金額（円） |
| 出口金額 | amountExit | integer | - | BC間売買代金（円） |
| 仲手等 | commission | integer | - | 仲介手数料等（円） |
| BC手付 | bcDeposit | integer | - | BC手付金額（円） |
| 利益 | profit | integer | - | 自動計算（円） |

**利益の計算式**:

```
利益 = 出口金額 - A金額 + 仲手等
```

**注意**: 契約形態が「違約」の場合、利益は自動計算されません（手動入力）

#### 日付項目

| 項目名 | 項目ID | 型 | 説明 |
|--------|--------|-----|------|
| A契約日 | contractDateA | timestamp | AB間の契約日 |
| BC契約日 | contractDateBc | timestamp | BC間の契約日 |
| 決済日 | settlementDate | timestamp | 決済予定日（月のみ指定可） |

#### 契約関係

| 項目名 | 項目ID | 型 | 選択肢 |
|--------|--------|-----|--------|
| 契約形態 | contractType | enum | ab_bc, ac, iyaku, hakushi, mitei, jisha, bengoshi, kaichu, iyaku_yotei |
| B会社 | companyB | enum | ms, life, legit, esc, trader, shine, second |
| 仲介会社 | brokerCompany | enum | legit, tousei, esc, shine, nbf, rd, ms, iilife |
| 買取業者 | buyerCompany | string | 自由入力 |
| 抵当銀行 | mortgageBank | string | 自由入力 |
| 名簿種別 | listType | string | 自由入力 |

#### ステータス

| 項目名 | 項目ID | 型 | 選択肢 |
|--------|--------|-----|--------|
| 業務ステータス | progressStatus | enum | 7段階（下記参照） |
| 書類ステータス | documentStatus | enum | 3段階（下記参照） |
| マイソク配布 | maisokuDistributed | boolean | true/false |

#### 口座情報

| 項目名 | 項目ID | 型 | 選択肢 |
|--------|--------|-----|--------|
| 使用口座会社 | accountCompany | enum | legit, life, ms |
| 使用銀行口座 | bankAccount | enum | 会社により動的変更（下記参照） |

#### その他

| 項目名 | 項目ID | 型 | 説明 |
|--------|--------|-----|------|
| 備考 | notes | text | メモ・注意事項 |

### 2.3 業務ステータス（progressStatus）

| 値 | 表示名 | 短縮表示 | 説明 |
|----|--------|----------|------|
| bc_before_confirmed | BC確定前 | BC確定前 | BC業者が確定していない状態 |
| bc_confirmed_cb_waiting | 契約CB待ち | 契約CB待ち | BC業者確定、チェックバック待ち |
| bc_confirmed_contract_waiting | BC契約待ち | BC契約待ち | チェックバック完了、BC契約待ち |
| bc_completed_settlement_waiting | 決済日待ち | 決済日待ち | BC契約完了、決済日未確定 |
| settlement_confirmed_statement_waiting | 精算CB待ち | 精算CB待ち | 決済日確定、精算書作成中 |
| statement_completed_settlement_waiting | 決済待ち | 決済待ち | 精算書完了、決済待ち |
| settlement_completed | 決済完了 | 決済完了 | 決済完了 |

### 2.4 書類ステータス（documentStatus）

| 値 | 表示名 | 説明 |
|----|--------|------|
| waiting_request | 営業依頼待ち | 書類取得の依頼前 |
| in_progress | 書類取得中 | 書類取得の依頼済み、取得中 |
| completed | 書類取得完了 | 全ての必要書類の取得完了 |

### 2.5 契約形態（contractType）

| 値 | 表示名 | 説明 |
|----|--------|------|
| ab_bc | AB・BC | 通常の取引パターン |
| ac | AC | 直接取引パターン |
| iyaku | 違約 | 違約金入金済み/確定 |
| hakushi | 白紙 | 白紙解除 |
| mitei | 未定 | 契約形態未定 |
| jisha | 自社仕入れ | 自社での仕入れ |
| bengoshi | 弁護士 | 弁護士案件 |
| kaichu | 買仲 | 販売促進部の案件 |
| iyaku_yotei | 違約予定 | 違約になる可能性が高い |

### 2.6 B会社（companyB）

| 値 | 表示名 |
|----|--------|
| ms | エムズ |
| life | ライフ |
| legit | レイジット |
| esc | エスク |
| trader | 取引業者 |
| shine | シャイン |
| second | セカンド |

### 2.7 仲介会社（brokerCompany）

| 値 | 表示名 |
|----|--------|
| legit | レイジット |
| tousei | TOUSEI |
| esc | エスク |
| shine | シャイン |
| nbf | NBF |
| rd | RD |
| ms | エムズ |
| iilife | イーライフ |

### 2.8 銀行口座（bankAccount）

| 口座会社 | 値 | 表示名 |
|----------|-----|--------|
| レイジット | legit_gmo_main | GMOメイン |
| レイジット | legit_gmo_sub | GMOサブ |
| レイジット | legit_kinsan | 近産 |
| ライフ | life_main_1727088 | メイン1727088 |
| ライフ | life_sub_1728218 | サブ1728218 |
| ライフ | life_new_main_2309414 | 新メイン2309414 |
| エムズ | ms_sumishin | 住信 |
| エムズ | ms_gmo_main | GMOメイン |
| エムズ | ms_gmo_sub | GMOサブ |
| エムズ | ms_rakuten | 楽天 |
| エムズ | ms_paypay_1 | PayPay(1) |

---

## 3. リレーション

### 3.1 ERダイアグラム

```
organization (1) ─────────── (N) properties
                                    │
                                    ├── (N) propertyStaff ── (1) user
                                    │
                                    ├── (1) contractProgress
                                    │
                                    ├── (1) documentProgress
                                    │
                                    ├── (N) propertyDocumentItems
                                    │
                                    ├── (1) settlementProgress
                                    │
                                    └── (N) propertyProgressHistory
```

### 3.2 担当者（propertyStaff）

案件と担当者の多対多リレーション。

| 項目名 | 項目ID | 型 | 説明 |
|--------|--------|-----|------|
| 案件ID | propertyId | string | 案件への参照 |
| ユーザーID | userId | string | 担当者への参照 |

---

## 4. 契約進捗（contractProgress）

### 4.1 AB関係チェック項目

| 項目名 | 項目ID | 型 | 説明 |
|--------|--------|-----|------|
| 契約書保存完了 | abContractSaved | boolean | AB契約書のスキャン・保存完了 |
| 契約書保存日時 | abContractSavedAt | timestamp | チェック日時 |
| 契約書保存者 | abContractSavedBy | string | チェックした人のID |
| 委任状関係保存完了 | abAuthorizationSaved | boolean | 委任状関係書類の保存完了 |
| 委任状関係保存日時 | abAuthorizationSavedAt | timestamp | チェック日時 |
| 委任状関係保存者 | abAuthorizationSavedBy | string | チェックした人のID |
| 売主身分証保存完了 | abSellerIdSaved | boolean | 売主の身分証明書の保存完了 |
| 売主身分証保存日時 | abSellerIdSavedAt | timestamp | チェック日時 |
| 売主身分証保存者 | abSellerIdSavedBy | string | チェックした人のID |

### 4.2 BC関係チェック項目

| 項目名 | 項目ID | 型 | 説明 |
|--------|--------|-----|------|
| BC売契作成 | bcContractCreated | boolean | BC売買契約書の作成完了 |
| BC売契作成日時 | bcContractCreatedAt | timestamp | チェック日時 |
| BC売契作成者 | bcContractCreatedBy | string | チェックした人のID |
| 重説作成 | bcDescriptionCreated | boolean | 重要事項説明書の作成完了 |
| 重説作成日時 | bcDescriptionCreatedAt | timestamp | チェック日時 |
| 重説作成者 | bcDescriptionCreatedBy | string | チェックした人のID |
| BC売契送付 | bcContractSent | boolean | BC売買契約書の業者への送付完了 |
| BC売契送付日時 | bcContractSentAt | timestamp | チェック日時 |
| BC売契送付者 | bcContractSentBy | string | チェックした人のID |
| 重説送付 | bcDescriptionSent | boolean | 重要事項説明書の業者への送付完了 |
| 重説送付日時 | bcDescriptionSentAt | timestamp | チェック日時 |
| 重説送付者 | bcDescriptionSentBy | string | チェックした人のID |
| BC売契CB完了 | bcContractCbDone | boolean | BC売買契約書のチェックバック完了 |
| BC売契CB完了日時 | bcContractCbDoneAt | timestamp | チェック日時 |
| BC売契CB完了者 | bcContractCbDoneBy | string | チェックした人のID |
| 重説CB完了 | bcDescriptionCbDone | boolean | 重要事項説明書のチェックバック完了 |
| 重説CB完了日時 | bcDescriptionCbDoneAt | timestamp | チェック日時 |
| 重説CB完了者 | bcDescriptionCbDoneBy | string | チェックした人のID |

---

## 5. 書類進捗（documentProgress / propertyDocumentItems）

### 5.1 全体ステータス（documentProgress）

| 項目名 | 項目ID | 型 | 説明 |
|--------|--------|-----|------|
| 案件ID | propertyId | string | 案件への参照 |
| ステータス | status | enum | waiting_request, in_progress, completed |

### 5.2 個別書類（propertyDocumentItems）

16種類の書類をそれぞれ管理。

| 項目名 | 項目ID | 型 | 説明 |
|--------|--------|-----|------|
| 案件ID | propertyId | string | 案件への参照 |
| 書類種別 | itemType | enum | 下記参照 |
| ステータス | status | enum | not_requested, requesting, acquired, not_required |
| 更新者 | updatedBy | string | 最終更新者のID |
| 更新日時 | updatedAt | timestamp | 最終更新日時 |

### 5.3 書類種別（itemType）

#### 賃貸管理関係

| 値 | 表示名 |
|----|--------|
| rental_contract | 賃貸借契約書 |
| management_contract | 管理委託契約書 |
| move_in_application | 入居申込書 |

#### 建物管理関係

| 値 | 表示名 |
|----|--------|
| important_matter_report | 重要事項調査報告書 |
| management_rules | 管理規約 |
| long_term_repair_plan | 長期修繕計画書 |
| general_meeting_minutes | 総会議事録 |
| pamphlet | パンフレット |
| account_transfer_form | 口座振替用紙 |
| owner_change_notification | 所有者変更届 |

#### 役所関係

| 値 | 表示名 |
|----|--------|
| tax_certificate | 公課証明 |
| building_plan_overview | 建築計画概要書 |
| register_certification | 台帳記載事項証明書 |
| zoning | 用途地域 |
| road_register | 道路台帳 |

#### 銀行関係

| 値 | 表示名 |
|----|--------|
| loan_calculation | ローン計算書 |

### 5.4 書類ステータス（個別）

| 値 | 表示名 | 説明 |
|----|--------|------|
| not_requested | 未依頼 | まだ依頼していない |
| requesting | 依頼中 | 依頼済み、取得待ち |
| acquired | 取得済 | 書類を取得完了 |
| not_required | 不要 | この案件では不要 |

---

## 6. 決済進捗（settlementProgress）

### 6.1 精算書関係

| 項目名 | 項目ID | 型 | 説明 |
|--------|--------|-----|------|
| BC精算書作成 | bcStatementCreated | boolean | BC精算書の作成完了 |
| BC精算書作成日時 | bcStatementCreatedAt | timestamp | - |
| BC精算書作成者 | bcStatementCreatedBy | string | - |
| BC精算書送付 | bcStatementSent | boolean | BC精算書の業者への送付完了 |
| BC精算書送付日時 | bcStatementSentAt | timestamp | - |
| BC精算書送付者 | bcStatementSentBy | string | - |
| BC精算書CB完了 | bcStatementCbDone | boolean | BC精算書のチェックバック完了 |
| BC精算書CB完了日時 | bcStatementCbDoneAt | timestamp | - |
| BC精算書CB完了者 | bcStatementCbDoneBy | string | - |
| AB精算書作成 | abStatementCreated | boolean | AB精算書（売主用）の作成完了 |
| AB精算書作成日時 | abStatementCreatedAt | timestamp | - |
| AB精算書作成者 | abStatementCreatedBy | string | - |
| AB精算書送付 | abStatementSent | boolean | AB精算書の営業への送付完了 |
| AB精算書送付日時 | abStatementSentAt | timestamp | - |
| AB精算書送付者 | abStatementSentBy | string | - |
| AB精算書CR完了 | abStatementCrDone | boolean | AB精算書のチェックリスト完了 |
| AB精算書CR完了日時 | abStatementCrDoneAt | timestamp | - |
| AB精算書CR完了者 | abStatementCrDoneBy | string | - |

### 6.2 司法書士関係

| 項目名 | 項目ID | 型 | 説明 |
|--------|--------|-----|------|
| 司法書士依頼 | lawyerRequested | boolean | 司法書士への依頼完了 |
| 司法書士依頼日時 | lawyerRequestedAt | timestamp | - |
| 司法書士依頼者 | lawyerRequestedBy | string | - |
| 必要書類共有 | documentsShared | boolean | 司法書士への必要書類の共有完了 |
| 必要書類共有日時 | documentsSharedAt | timestamp | - |
| 必要書類共有者 | documentsSharedBy | string | - |
| 本人確認書類 | identityVerification | enum | not_sent, sent, received, returned |
| 本人確認書類更新日時 | identityVerificationAt | timestamp | - |
| 本人確認書類更新者 | identityVerificationBy | string | - |
| 書類不備なし | documentsComplete | boolean | - |
| 書類不備なし日時 | documentsCompleteAt | timestamp | - |
| 書類不備なし者 | documentsCompleteBy | string | - |

### 6.3 抵当銀行関係

| 項目名 | 項目ID | 型 | 説明 |
|--------|--------|-----|------|
| 抵当銀行ステータス | mortgageBankStatus | enum | not_requested, requested, accepted |
| 抵当銀行更新日時 | mortgageBankStatusAt | timestamp | - |
| 抵当銀行更新者 | mortgageBankStatusBy | string | - |
| 銀行書類不備なし | bankDocumentsComplete | boolean | - |
| 銀行書類不備なし日時 | bankDocumentsCompleteAt | timestamp | - |
| 銀行書類不備なし者 | bankDocumentsCompleteBy | string | - |
| ローン計算書保存 | loanSaved | boolean | - |
| ローン計算書保存日時 | loanSavedAt | timestamp | - |
| ローン計算書保存者 | loanSavedBy | string | - |
| 売主手出し完了 | sellerPaymentDone | boolean | - |
| 売主手出し完了日時 | sellerPaymentDoneAt | timestamp | - |
| 売主手出し完了者 | sellerPaymentDoneBy | string | - |

### 6.4 賃貸管理解約関係

| 項目名 | 項目ID | 型 | 説明 |
|--------|--------|-----|------|
| 管理解約予定月 | managementCancelScheduledMonth | timestamp | 解約予定月 |
| 管理解約依頼 | managementCancelRequested | boolean | - |
| 管理解約依頼日時 | managementCancelRequestedAt | timestamp | - |
| 管理解約依頼者 | managementCancelRequestedBy | string | - |
| 管理解約完了 | managementCancelDone | boolean | - |
| 管理解約完了日時 | managementCancelDoneAt | timestamp | - |
| 管理解約完了者 | managementCancelDoneBy | string | - |

### 6.5 決済後処理関係

| 項目名 | 項目ID | 型 | 説明 |
|--------|--------|-----|------|
| 保証会社承継ステータス | guaranteeTransferStatus | enum | not_requested, requested, completed |
| 保証会社承継更新日時 | guaranteeTransferStatusAt | timestamp | - |
| 保証会社承継更新者 | guaranteeTransferStatusBy | string | - |
| 鍵ステータス | keyStatus | enum | not_received, received, sent |
| 鍵更新日時 | keyStatusAt | timestamp | - |
| 鍵更新者 | keyStatusBy | string | - |
| 口座振替手続きステータス | accountTransferStatus | enum | not_received, received, sent |
| 口座振替手続き更新日時 | accountTransferStatusAt | timestamp | - |
| 口座振替手続き更新者 | accountTransferStatusBy | string | - |
| 取引台帳記入 | ledgerEntry | boolean | - |
| 取引台帳記入日時 | ledgerEntryAt | timestamp | - |
| 取引台帳記入者 | ledgerEntryBy | string | - |

---

## 7. 権限

### 7.1 アクセス制御

| ロール | 閲覧範囲 | 作成 | 編集 | 削除 |
|--------|----------|------|------|------|
| owner（経営者） | 全組織 | ○ | ○ | ○ |
| admin（管理者） | 所属組織 | ○ | ○ | 所属組織のみ |
| member（メンバー） | 所属組織 | ○ | ○ | 自分が作成した案件のみ |

### 7.2 データフィルタリング

- Active Organizationに基づいてデータをフィルタリング
- owner は「全社」を選択して全組織のデータを表示可能
- 一般ユーザーは所属組織のデータのみ表示

---

## 8. 関連ドキュメント

- [案件新規登録・編集画面](./02-property-form.md)
- [BC確定前案件一覧](./03-unconfirmed-list.md)
- [月次案件一覧](./04-monthly-list.md)
- [案件検索](./05-search.md)
- [案件詳細](./06-property-detail.md)
- [インライン編集](./07-inline-edit.md)

---

最終更新: 2026-01-17
