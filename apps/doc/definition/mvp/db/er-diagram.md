# 案件管理システム データベース定義書

## バージョン情報

- **作成日**: 2025-10-25
- **バージョン**: 1.0
- **対象フェーズ**: MVP（最小限の機能を実装した初期バージョン）

---

## ER図

ER図は [er-diagram-visual.md](./er-diagram-visual.md) を参照してください。

---

## 1. テーブル定義

### 1.1 ユーザー関連テーブル (Better Auth管理)

ユーザー認証と組織管理は Better Auth により管理されています。
詳細は `packages/drizzle/schemas/auth.ts` を参照してください。

#### 認証方式

- **メールアドレス＋パスワード認証**

#### 主要テーブル

- **user**: ユーザー情報
- **session**: セッション管理
  - `activeOrganizationId`: 現在作業対象の組織ID（Active Organization）
- **account**: 外部プロバイダー連携
- **organization**: 組織情報（レイジット、エスク、TOUSEI）
- **member**: 組織メンバー情報
  - `role`: ユーザーの権限（owner / admin / member）
- **invitation**: 組織への招待情報

**MVPの組織・権限設計**:

- **組織（organization）**: 会社単位（レイジット、エスク、TOUSEI）
- **チーム**: Better Auth の Team 機能を使用（営業チーム、事務チーム）
- **権限（member.role）**:
  - `owner`: システムオーナー（経営者）。全組織のデータにアクセス可能
  - `admin`: 管理者。チームメンバーの招待・削除が可能
  - `member`: 一般メンバー。案件の作成・編集が可能
- **Active Organization**: ユーザーが現在作業対象としている組織（`session.activeOrganizationId`）
  - システムオーナー（owner）は「全社」表示（`activeOrganizationId = null`）または特定組織を選択可能
  - 一般ユーザー（admin/member）は所属組織から選択
- **データアクセス制御**:
  - 案件（properties）は `organization_id` で組織に紐付けられます
  - ユーザーは Active Organization で選択中の組織の案件のみ閲覧・編集可能
  - システムオーナー（owner）は Active Organization が null の場合、全組織の案件を閲覧可能

---

### 1.2 案件関連テーブル

#### 1.2.1 properties (案件)

案件の基本情報を管理するテーブル。

1R投資用不動産の売買案件を管理します。A（オーナー）→ B（グループ会社）→ C（買主）の取引フローにおける、物件情報、金額、契約日、進捗状況などを一元管理します。

| カラム名         | 型        | NULL     | 説明                                         |
| ---------------- | --------- | -------- | -------------------------------------------- |
| id               | string    | NOT NULL | 案件ID (PK)                                  |
| organization_id  | string    | NOT NULL | 管理組織ID (FK)                              |
| property_name    | string    | NOT NULL | 物件名                                       |
| room_number      | string    | NULL     | 号室                                         |
| owner_name       | string    | NOT NULL | オーナー名                                   |
| amount_a         | decimal   | NULL     | A金額(万円)                                  |
| amount_exit      | decimal   | NULL     | 出口金額(万円)                               |
| commission       | decimal   | NULL     | 仲手等(万円)                                 |
| profit           | decimal   | NULL     | 利益(万円・自動計算)                         |
| bc_deposit       | decimal   | NULL     | BC手付(万円)                                 |
| contract_date_a  | date      | NULL     | A契約日                                      |
| contract_date_bc | date      | NULL     | BC契約日                                     |
| settlement_date  | date      | NULL     | 決済予定日                                   |
| contract_type    | string    | NULL     | 契約形態                                     |
| company_b        | string    | NULL     | B会社                                        |
| broker_company   | string    | NULL     | 仲介会社                                     |
| buyer_company    | string    | NULL     | 買取業者                                     |
| mortgage_bank    | string    | NULL     | 抵当銀行                                     |
| list_type        | string    | NULL     | 名簿種別                                     |
| progress_status  | string    | NOT NULL | 進捗ステータス (初期値: bc_before_confirmed) |
| document_status  | string    | NOT NULL | 書類ステータス (初期値: waiting_request)     |
| notes            | text      | NULL     | 備考                                         |
| account_company  | string    | NULL     | 使用口座会社                                 |
| bank_account     | string    | NULL     | 使用銀行口座                                 |
| created_by       | string    | NOT NULL | 作成者ID                                     |
| updated_by       | string    | NOT NULL | 更新者ID                                     |
| created_at       | timestamp | NOT NULL | 作成日時                                     |
| updated_at       | timestamp | NOT NULL | 更新日時                                     |

#### 利益の計算式

```
profit = amount_exit - amount_a + commission
```

#### contract_type (契約形態) の値

| 値          | 表示名     | 説明               |
| ----------- | ---------- | ------------------ |
| ab_bc       | AB・BC     | 通常の取引パターン |
| ac          | AC         | 直接取引パターン   |
| iyaku       | 違約       | 違約金確定案件     |
| hakushi     | 白紙       | 白紙解約           |
| mitei       | 未定       | 契約形態未定       |
| jisha       | 自社仕入れ | 自社で仕入れ       |
| bengoshi    | 弁護士     | 弁護士案件         |
| kaichu      | 買仲       | 買取仲介案件       |
| iyaku_yotei | 違約予定   | 違約予定案件       |

#### company_b (B会社) の値

| 値     | 表示名     |
| ------ | ---------- |
| ms     | エムズ     |
| life   | ライフ     |
| legit  | レイジット |
| esc    | エスク     |
| trader | 取引業者   |
| shine  | シャイン   |
| second | セカンド   |

#### broker_company (仲介会社) の値

| 値     | 表示名     |
| ------ | ---------- |
| legit  | レイジット |
| tousei | TOUSEI     |
| esc    | エスク     |
| shine  | シャイン   |
| nbf    | NBF        |
| rd     | RD         |
| ms     | エムズ     |

#### progress_status (進捗ステータス) の値

| 値                      | 表示名     | 説明                                           |
| ----------------------- | ---------- | ---------------------------------------------- |
| bc_before_confirmed     | BC確定前   | BC業者が確定していない状態                     |
| waiting_contract_cb     | 契約CB待ち | BC業者確定、重説・BC契約書のチェックバック待ち |
| waiting_bc_contract     | BC契約待ち | チェックバック完了、BC契約待ち                 |
| waiting_settlement_date | 決済日待ち | BC契約完了、決済日未確定                       |
| waiting_settlement_cb   | 精算CB待ち | 決済日確定、精算書作成中                       |
| waiting_settlement      | 決済待ち   | 精算書完了、決済待ち                           |
| settlement_completed    | 決済完了   | 決済完了                                       |

#### document_status (書類ステータス) の値

| 値              | 表示名         | 説明                       |
| --------------- | -------------- | -------------------------- |
| waiting_request | 営業依頼待ち   | 書類取得の依頼前           |
| in_progress     | 書類取得中     | 書類取得の依頼済み、取得中 |
| completed       | 全書類取得完了 | 全ての必要書類の取得完了   |

#### account_company (使用口座会社) の値

| 値    | 表示名     |
| ----- | ---------- |
| legit | レイジット |
| life  | ライフ     |
| ms    | エムズ     |

#### bank_account (使用銀行口座) の値

口座会社により選択肢が変わります。

**レイジット (legit)**:

- gmo_main: GMOメイン
- gmo_sub: GMOサブ
- kinsan: 近産

**ライフ (life)**:

- main_1727088: メイン1727088
- sub_1728218: サブ1728218
- new_main_2309414: 新メイン2309414

**エムズ (ms)**:

- sumi_shin: 住信
- gmo_main: GMOメイン
- gmo_sub: GMOサブ
- rakuten: 楽天
- paypay_1: PayPay①
- paypay_2: PayPay②
- paypay_3: PayPay③

#### インデックス

- `idx_properties_organization_id` ON (organization_id)
- `idx_properties_progress_status` ON (progress_status)
- `idx_properties_document_status` ON (document_status)
- `idx_properties_settlement_date` ON (settlement_date)
- `idx_properties_created_at` ON (created_at)

---

#### 1.2.2 property_staff (案件担当者)

案件と担当者の紐付けを管理する中間テーブル。

1つの案件に複数の営業担当や事務担当を割り当てることができます。担当者を紐付けることで、案件詳細画面や一覧画面で「自分が担当している案件」をフィルタリングして表示できます。

| カラム名    | 型        | NULL     | 説明        |
| ----------- | --------- | -------- | ----------- |
| id          | string    | NOT NULL | ID (PK)     |
| property_id | string    | NOT NULL | 案件ID (FK) |
| user_id     | string    | NOT NULL | ユーザーID  |
| created_at  | timestamp | NOT NULL | 作成日時    |

#### インデックス

- `idx_property_staff_property_id` ON (property_id)
- `idx_property_staff_user_id` ON (user_id)
- UNIQUE `uk_property_staff_property_user` ON (property_id, user_id)

---

#### 1.2.3 contract_progress (契約進捗)

契約関連のチェック項目を管理するテーブル。

AB契約（オーナーとの契約）とBC契約（買主との契約）それぞれの契約書作成・送付・チェックバックの進捗を管理します。各チェック項目には、チェックした日時と実行者を記録し、誰がいつ作業を完了したかを追跡できます。案件と1対1の関係。

| カラム名                  | 型        | NULL     | 説明                         |
| ------------------------- | --------- | -------- | ---------------------------- |
| id                        | string    | NOT NULL | ID (PK)                      |
| property_id               | string    | NOT NULL | 案件ID (FK, UK)              |
| ab_contract_saved         | boolean   | NOT NULL | 契約書保存完了               |
| ab_contract_saved_at      | timestamp | NULL     | 保存日時                     |
| ab_contract_saved_by      | string    | NULL     | この項目を更新したユーザーID |
| ab_authorization_saved    | boolean   | NOT NULL | 委任状関係保存完了           |
| ab_authorization_saved_at | timestamp | NULL     | 保存日時                     |
| ab_authorization_saved_by | string    | NULL     | この項目を更新したユーザーID |
| ab_seller_id_saved        | boolean   | NOT NULL | 売主身分証保存完了           |
| ab_seller_id_saved_at     | timestamp | NULL     | 保存日時                     |
| ab_seller_id_saved_by     | string    | NULL     | この項目を更新したユーザーID |
| bc_contract_created       | boolean   | NOT NULL | BC売契作成                   |
| bc_contract_created_at    | timestamp | NULL     | 作成日時                     |
| bc_contract_created_by    | string    | NULL     | この項目を更新したユーザーID |
| bc_description_created    | boolean   | NOT NULL | 重説作成                     |
| bc_description_created_at | timestamp | NULL     | 作成日時                     |
| bc_description_created_by | string    | NULL     | この項目を更新したユーザーID |
| bc_contract_sent          | boolean   | NOT NULL | BC売契送付                   |
| bc_contract_sent_at       | timestamp | NULL     | 送付日時                     |
| bc_contract_sent_by       | string    | NULL     | この項目を更新したユーザーID |
| bc_description_sent       | boolean   | NOT NULL | 重説送付                     |
| bc_description_sent_at    | timestamp | NULL     | 送付日時                     |
| bc_description_sent_by    | string    | NULL     | この項目を更新したユーザーID |
| bc_contract_cb_done       | boolean   | NOT NULL | BC売契CB完了                 |
| bc_contract_cb_done_at    | timestamp | NULL     | 完了日時                     |
| bc_contract_cb_done_by    | string    | NULL     | この項目を更新したユーザーID |
| bc_description_cb_done    | boolean   | NOT NULL | 重説CB完了                   |
| bc_description_cb_done_at | timestamp | NULL     | 完了日時                     |
| bc_description_cb_done_by | string    | NULL     | この項目を更新したユーザーID |
| created_at                | timestamp | NOT NULL | 作成日時                     |
| updated_at                | timestamp | NOT NULL | 更新日時                     |

#### インデックス

- UNIQUE `uk_contract_progress_property_id` ON (property_id)

---

#### 1.2.4 document_progress (書類進捗)

書類取得の進捗を管理するテーブル。

オーナーから取得が必要な各種書類（登記簿謄本、固定資産税評価証明書など）の取得状況を管理します。MVPでは「営業依頼待ち」「書類取得中」「全書類取得完了」の3段階で簡易的に管理します。案件と1対1の関係。

| カラム名    | 型        | NULL     | 説明            |
| ----------- | --------- | -------- | --------------- |
| id          | string    | NOT NULL | ID (PK)         |
| property_id | string    | NOT NULL | 案件ID (FK, UK) |
| status      | string    | NOT NULL | 書類ステータス  |
| created_at  | timestamp | NOT NULL | 作成日時        |
| updated_at  | timestamp | NOT NULL | 更新日時        |
| updated_by  | string    | NOT NULL | 最終更新者ID    |

#### status (書類ステータス) の値

| 値              | 表示名         | 説明                       |
| --------------- | -------------- | -------------------------- |
| waiting_request | 営業依頼待ち   | 書類取得の依頼前           |
| in_progress     | 書類取得中     | 書類取得の依頼済み、取得中 |
| completed       | 全書類取得完了 | 全ての必要書類の取得完了   |

#### インデックス

- UNIQUE `uk_document_progress_property_id` ON (property_id)

#### 将来の拡張予定

Phase 1で書類ごとの詳細なステータス管理を実装予定。

---

#### 1.2.5 settlement_progress (決済進捗)

決済関連のチェック項目を管理するテーブル。

不動産取引の最終段階である決済に向けた準備作業の進捗を管理します。精算書の作成・送付、司法書士への依頼、抵当銀行との調整、管理会社の解約手続き、鍵の受け渡しなど、決済完了までに必要な全ての作業項目をチェックリスト形式で管理します。各チェック項目には実行日時と実行者を記録します。案件と1対1の関係。

| カラム名                   | 型        | NULL     | 説明                         |
| -------------------------- | --------- | -------- | ---------------------------- |
| id                         | string    | NOT NULL | ID (PK)                      |
| property_id                | string    | NOT NULL | 案件ID (FK, UK)              |
| bc_settlement_status       | string    | NOT NULL | BC精算書                     |
| ab_settlement_status       | string    | NOT NULL | AB精算書                     |
| loan_calculation_saved     | boolean   | NOT NULL | ローン計算書保存             |
| loan_calculation_saved_at  | timestamp | NULL     | 保存日時                     |
| loan_calculation_saved_by  | string    | NULL     | この項目を更新したユーザーID |
| lawyer_requested           | boolean   | NOT NULL | 司法書士依頼                 |
| lawyer_requested_at        | timestamp | NULL     | 依頼日時                     |
| lawyer_requested_by        | string    | NULL     | この項目を更新したユーザーID |
| documents_shared           | boolean   | NOT NULL | 必要書類共有                 |
| documents_shared_at        | timestamp | NULL     | 共有日時                     |
| documents_shared_by        | string    | NULL     | この項目を更新したユーザーID |
| identity_verification      | string    | NOT NULL | 本人確認書類                 |
| documents_complete         | boolean   | NOT NULL | 書類不備なし                 |
| documents_complete_at      | timestamp | NULL     | 確認日時                     |
| documents_complete_by      | string    | NULL     | この項目を更新したユーザーID |
| mortgage_bank_status       | string    | NOT NULL | 抵当銀行                     |
| bank_documents_complete    | boolean   | NOT NULL | 書類不備なし                 |
| bank_documents_complete_at | timestamp | NULL     | 確認日時                     |
| bank_documents_complete_by | string    | NULL     | この項目を更新したユーザーID |
| loan_saved                 | boolean   | NOT NULL | ローン計算書��存             |
| loan_saved_at              | timestamp | NULL     | 保存日時                     |
| loan_saved_by              | string    | NULL     | この項目を更新したユーザーID |
| seller_payment_done        | boolean   | NOT NULL | 売主手出し完了               |
| seller_payment_done_at     | timestamp | NULL     | 完了日時                     |
| seller_payment_done_by     | string    | NULL     | この項目を更新したユーザーID |
| management_cancel          | string    | NOT NULL | 管理解約依頼                 |
| guarantee_transfer         | string    | NOT NULL | 保証会社承継                 |
| key_status                 | string    | NOT NULL | 鍵                           |
| account_transfer           | string    | NOT NULL | 管積口座振替手続き           |
| ledger_entry               | boolean   | NOT NULL | 取引台帳記入                 |
| ledger_entry_at            | timestamp | NULL     | 記入日時                     |
| ledger_entry_by            | string    | NULL     | この項目を更新したユーザーID |
| created_at                 | timestamp | NOT NULL | 作成日時                     |
| updated_at                 | timestamp | NOT NULL | 更新日時                     |

#### bc_settlement_status (BC精算書) の値

| 値          | 表示名 |
| ----------- | ------ |
| not_created | 未作成 |
| created     | 作成   |
| sent        | 送付   |
| cb_done     | CB完了 |

#### ab_settlement_status (AB精算書) の値

| 値          | 表示名 |
| ----------- | ------ |
| not_created | 未作成 |
| created     | 作成   |
| sent        | 送付   |
| cr_done     | CR完了 |

#### identity_verification (本人確認書類) の値

| 値       | 表示名 |
| -------- | ------ |
| none     | 未対応 |
| sent     | 発送   |
| received | 受取   |
| returned | 返送   |

#### mortgage_bank_status (抵当銀行) の値

| 値        | 表示名   |
| --------- | -------- |
| none      | 未対応   |
| requested | 依頼     |
| accepted  | 受付完了 |

#### management_cancel (管理解約依頼) の値

| 値        | 表示名 |
| --------- | ------ |
| none      | 未対応 |
| requested | 依頼   |
| completed | 完了   |

#### guarantee_transfer (保証会社承継) の値

| 値        | 表示名 |
| --------- | ------ |
| none      | 未対応 |
| requested | 依頼   |
| completed | 完了   |

#### key_status (鍵) の値

| 値       | 表示名 |
| -------- | ------ |
| none     | 未対応 |
| received | 受取   |
| sent     | 発送   |

#### account_transfer (管積口座振替手続き) の値

| 値       | 表示名 |
| -------- | ------ |
| none     | 未対応 |
| received | 受取   |
| sent     | 発送   |

#### インデックス

- UNIQUE `uk_settlement_progress_property_id` ON (property_id)

---

#### 1.2.6 property_progress_history (案件進捗履歴)

案件の進捗ステータス変更履歴を記録するテーブル。

案件のメイン進捗ステータス（BC確定前 → 契約CB待ち → ... → 決済完了）が変更された際に、変更前・変更後のステータス、変更日時、変更者を自動的に記録します。これにより、案件がいつどの段階を通過したか、誰が変更したかを時系列で追跡でき、将来的に活動履歴画面で表示することができます。

| カラム名    | 型        | NULL     | 説明             |
| ----------- | --------- | -------- | ---------------- |
| id          | string    | NOT NULL | ID (PK)          |
| property_id | string    | NOT NULL | 案件ID (FK)      |
| from_status | string    | NULL     | 変更前ステータス |
| to_status   | string    | NOT NULL | 変更後ステータス |
| changed_by  | string    | NOT NULL | 変更者ID         |
| changed_at  | timestamp | NOT NULL | 変更日時         |

#### from_status / to_status の値

progress_status (進捗ステータス) と同じ値:

| 値                      | 表示名     |
| ----------------------- | ---------- |
| bc_before_confirmed     | BC確定前   |
| waiting_contract_cb     | 契約CB待ち |
| waiting_bc_contract     | BC契約待ち |
| waiting_settlement_date | 決済日待ち |
| waiting_settlement_cb   | 精算CB待ち |
| waiting_settlement      | 決済待ち   |
| settlement_completed    | 決済完了   |

#### 用途

- 案件の進捗変更履歴を時系列で追跡
- 誰がいつステータスを変更したかを記録
- 将来的に活動履歴画面で表示

#### 記録タイミング

`properties.progress_status` が変更されたタイミングで自動的にレコードを挿入します。

- 新規作成時: `from_status` は NULL、`to_status` は初期ステータス
- 更新時: `from_status` は変更前の値、`to_status` は変更後の値

#### インデックス

- `idx_property_progress_history_property_id` ON (property_id)
- `idx_property_progress_history_changed_at` ON (changed_at)

---

## 2. リレーション

### 2.1 案件関連

#### 2.1.1 organization → properties (1対多)

1つの組織（会社）は複数の案件を管理できます。案件は必ず1つの組織に所属します。

#### 2.1.2 properties → property_staff (1対多)

1つの案件に対して複数の担当者を紐付けることができます。

#### 2.1.3 users → property_staff (1対多)

1人のユーザーは複数の案件を担当できます。

#### 2.1.4 properties → contract_progress (1対1)

1つの案件に対して1つの契約進捗レコードが存在します。

#### 2.1.5 properties → document_progress (1対1)

1つの案件に対して1つの書類進捗レコードが存在します。

#### 2.1.6 properties → settlement_progress (1対1)

1つの案件に対して1つの決済進捗レコードが存在します。

#### 2.1.7 properties → property_progress_history (1対多)

1つの案件に対して複数の進捗履歴レコードが存在します。進捗ステータスが変更されるたびに履歴が記録されます。

---

## 3. データの整合性

### 3.1 カスケード削除

#### 3.1.1 案件削除時

案件(properties)が削除された場合、以下のテーブルのレコードも削除されます：

- property_staff (担当者紐付け)
- contract_progress (契約進捗)
- document_progress (書類進捗)
- settlement_progress (決済進捗)
- property_progress_history (進捗履歴)

### 3.2 チェック項目の記録

すべてのチェック項目(boolean型)について、チェックされた場合に以下を記録します：

- チェック日時 (`_at` サフィックス)
- チェック実行者 (`_by` サフィックス)

チェックが外された場合、これらの値はNULLに戻されます。

### 3.3 利益の自動計算

`properties.profit` は以下の計算式で自動的に算出されます：

```
profit = amount_exit - amount_a + commission
```

アプリケーション側で計算し、DBには計算結果を保存します。

---

## 4. 命名規則

### 4.1 テーブル名

- 小文字のスネークケース
- 複数形 (例: properties, not property)

### 4.2 カラム名

- 小文字のスネークケース
- 日時カラム: `_at` サフィックス
- 実行者カラム: `_by` サフィックス
- ステータスカラム: `_status` サフィックス

### 4.3 Enum値

- 小文字のスネークケース
- 単語の区切りにアンダースコア

---

## 5. 今後の拡張予定

### 5.1 Phase 1

- 書類テーブルの詳細化
  - 書類ごとの個別管理
  - 5段階のステータス管理
  - 書類アップロード機能

### 5.2 Phase 2

- マイソク配布管理テーブル
  - 配布先業者
  - 配布日時
  - 金額回答管理

### 5.3 Phase 3以降

- 活動履歴テーブル
- コメント機能
- ファイル添付管理

---

最終更新: 2025-10-25
