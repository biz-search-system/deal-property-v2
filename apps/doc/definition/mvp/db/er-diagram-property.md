# 案件管理スキーマ ER図

## バージョン情報

- **作成日**: 2025-12-12
- **バージョン**: 1.0
- **対象ファイル**: `packages/drizzle/schemas/property.ts`

---

## ER図（案件関連テーブル）

```mermaid
erDiagram
    %% 外部テーブル（auth.ts）
    organizations ||--o{ properties : "has"
    users ||--o{ properties : "creates"
    users ||--o{ property_staff : "assigned"
    users ||--o{ contract_progress : "updates"
    users ||--o{ document_progress : "updates"
    users ||--o{ property_document_items : "updates"
    users ||--o{ settlement_progress : "updates"
    users ||--o{ property_progress_history : "changes"

    %% 案件と関連テーブル
    properties ||--o{ property_staff : "has staff"
    properties ||--|| contract_progress : "has"
    properties ||--|| document_progress : "has"
    properties ||--o{ property_document_items : "has items"
    properties ||--|| settlement_progress : "has"
    properties ||--o{ property_progress_history : "has history"

    %% 外部テーブル（簡略）
    organizations {
        text id PK
        text name
        text slug
    }

    users {
        text id PK
        text name
        text email
        text image
    }

    %% 案件テーブル
    properties {
        text id PK
        text organization_id FK
        text property_name
        text room_number
        text owner_name
        real amount_a
        real amount_exit
        real commission
        real profit
        real bc_deposit
        timestamp contract_date_a
        timestamp contract_date_a_updated_at
        text contract_date_a_updated_by FK
        timestamp contract_date_bc
        timestamp contract_date_bc_updated_at
        text contract_date_bc_updated_by FK
        timestamp settlement_date
        timestamp settlement_date_updated_at
        text settlement_date_updated_by FK
        text contract_type
        text company_b
        text broker_company
        text buyer_company
        text mortgage_bank
        text list_type
        text progress_status
        timestamp progress_status_updated_at
        text progress_status_updated_by FK
        text document_status
        timestamp document_status_updated_at
        text document_status_updated_by FK
        text notes
        text account_company
        text bank_account
        text created_by FK
        text updated_by FK
        timestamp created_at
        timestamp updated_at
    }

    %% 案件担当者中間テーブル
    property_staff {
        text id PK
        text property_id FK
        text user_id FK
        timestamp created_at
    }

    %% 契約進捗テーブル
    contract_progress {
        text id PK
        text property_id UK
        text maisoku_distribution
        timestamp maisoku_distribution_at
        text maisoku_distribution_by
        boolean ab_contract_saved
        timestamp ab_contract_saved_at
        text ab_contract_saved_by
        boolean ab_authorization_saved
        timestamp ab_authorization_saved_at
        text ab_authorization_saved_by
        boolean ab_seller_id_saved
        timestamp ab_seller_id_saved_at
        text ab_seller_id_saved_by
        boolean bc_contract_created
        timestamp bc_contract_created_at
        text bc_contract_created_by
        boolean bc_description_created
        timestamp bc_description_created_at
        text bc_description_created_by
        boolean bc_contract_sent
        timestamp bc_contract_sent_at
        text bc_contract_sent_by
        boolean bc_description_sent
        timestamp bc_description_sent_at
        text bc_description_sent_by
        boolean bc_contract_cb_done
        timestamp bc_contract_cb_done_at
        text bc_contract_cb_done_by
        boolean bc_description_cb_done
        timestamp bc_description_cb_done_at
        text bc_description_cb_done_by
        timestamp created_at
        timestamp updated_at
    }

    %% 書類進捗テーブル（※廃止予定：propertiesに移行済み）
    document_progress {
        text id PK
        text property_id FK_UK
        text status
        text updated_by FK
        timestamp created_at
        timestamp updated_at
    }

    %% 書類項目テーブル
    property_document_items {
        text id PK
        text property_id FK
        text item_type
        text status
        timestamp updated_at
        text updated_by FK
    }

    %% 決済進捗テーブル
    settlement_progress {
        text id PK
        text property_id FK_UK
        text bc_settlement_status
        text ab_settlement_status
        boolean loan_calculation_saved
        timestamp loan_calculation_saved_at
        text loan_calculation_saved_by FK
        boolean lawyer_requested
        timestamp lawyer_requested_at
        text lawyer_requested_by FK
        boolean documents_shared
        timestamp documents_shared_at
        text documents_shared_by FK
        text identity_verification
        boolean documents_complete
        timestamp documents_complete_at
        text documents_complete_by FK
        text mortgage_bank_status
        boolean bank_documents_complete
        timestamp bank_documents_complete_at
        text bank_documents_complete_by FK
        boolean loan_saved
        timestamp loan_saved_at
        text loan_saved_by FK
        boolean seller_payment_done
        timestamp seller_payment_done_at
        text seller_payment_done_by FK
        text management_cancel
        text guarantee_transfer
        text key_status
        text account_transfer
        boolean ledger_entry
        timestamp ledger_entry_at
        text ledger_entry_by FK
        timestamp created_at
        timestamp updated_at
    }

    %% 案件進捗履歴テーブル
    property_progress_history {
        text id PK
        text property_id FK
        text from_status
        text to_status
        text changed_by FK
        timestamp changed_at
    }
```

---

## Enum定義

### 進捗ステータス (progress_status)

| 値                      | 表示名     |
| ----------------------- | ---------- |
| bc_before_confirmed     | BC確定前   |
| waiting_contract_cb     | 契約CB待ち |
| waiting_bc_contract     | BC契約待ち |
| waiting_settlement_date | 決済日待ち |
| waiting_settlement_cb   | 精算CB待ち |
| waiting_settlement      | 決済待ち   |
| settlement_completed    | 決済完了   |

### 書類ステータス (document_status)

| 値              | 表示名         |
| --------------- | -------------- |
| waiting_request | 営業依頼待ち   |
| in_progress     | 書類取得中     |
| completed       | 全書類取得完了 |

### 契約形態 (contract_type)

| 値          | 表示名     |
| ----------- | ---------- |
| ab_bc       | AB・BC     |
| ac          | AC         |
| iyaku       | 違約       |
| hakushi     | 白紙       |
| mitei       | 未定       |
| jisha       | 自社仕入れ |
| bengoshi    | 弁護士     |
| kaichu      | 買仲       |
| iyaku_yotei | 違約予定   |

### B会社 (company_b)

| 値     | 表示名     |
| ------ | ---------- |
| legit  | レイジット |
| life   | ライフ     |
| ms     | エムズ     |
| second | セカンド   |
| trader | 取引業者   |
| esc    | エスク     |

### 仲介会社 (broker_company)

| 値     | 表示名     |
| ------ | ---------- |
| legit  | レイジット |
| tousei | TOUSEI     |
| ms     | エムズ     |
| rd     | RD         |
| nbf    | NBF        |
| shine  | シャイン   |
| esc    | エスク     |

### 使用口座会社 (account_company)

| 値    | 表示名     |
| ----- | ---------- |
| legit | レイジット |
| life  | ライフ     |
| ms    | エムズ     |

### 使用銀行口座 (bank_account)

| 値               | 表示名          | 会社       |
| ---------------- | --------------- | ---------- |
| gmo_main         | GMOメイン       | レイジット |
| gmo_sub          | GMOサブ         | レイジット |
| kinsan           | 近産            | レイジット |
| main_1727088     | メイン1727088   | ライフ     |
| sub_1728218      | サブ1728218     | ライフ     |
| new_main_2309414 | 新メイン2309414 | ライフ     |
| sumi_shin        | 住信            | エムズ     |
| rakuten          | 楽天            | エムズ     |
| paypay_1         | PayPay①         | エムズ     |
| paypay_2         | PayPay②         | エムズ     |
| paypay_3         | PayPay③         | エムズ     |

### マイソク配布ステータス (maisoku_distribution)

| 値              | 表示名 |
| --------------- | ------ |
| not_distributed | 未配布 |
| distributed     | 配布済 |

---

## 書類項目テーブル Enum

### 書類項目種別 (item_type)

#### 銀行関係

| 値               | 表示名       |
| ---------------- | ------------ |
| loan_calculation | ローン計算書 |

#### 賃貸管理関係

| 値                  | 表示名         |
| ------------------- | -------------- |
| rental_contract     | 賃貸借契約書   |
| management_contract | 管理委託契約書 |
| move_in_application | 入居申込書     |

#### 建物管理関係

| 値                        | 表示名             |
| ------------------------- | ------------------ |
| important_matters_report  | 重要事項調査報告書 |
| management_rules          | 管理規約           |
| long_term_repair_plan     | 長期修繕計画書     |
| general_meeting_minutes   | 総会議事録         |
| pamphlet                  | パンフレット       |
| bank_transfer_form        | 口座振替用紙       |
| owner_change_notification | 所有者変更届       |

#### 役所関係

| 値                     | 表示名             |
| ---------------------- | ------------------ |
| tax_certificate        | 公課証明           |
| building_plan_overview | 建築計画概要書     |
| ledger_certificate     | 台帳記載事項証明書 |
| zoning_district        | 用途地域           |
| road_ledger            | 道路台帳           |

### 書類項目ステータス (status)

| 値            | 表示名 |
| ------------- | ------ |
| not_requested | 未依頼 |
| requesting    | 依頼中 |
| acquired      | 取得済 |
| not_required  | 不要   |

---

## 決済進捗テーブル Enum

### BC精算書 (bc_settlement_status)

| 値          | 表示名 |
| ----------- | ------ |
| not_created | 未作成 |
| created     | 作成   |
| sent        | 送付   |
| cb_done     | CB完了 |

### AB精算書 (ab_settlement_status)

| 値          | 表示名 |
| ----------- | ------ |
| not_created | 未作成 |
| created     | 作成   |
| sent        | 送付   |
| cr_done     | CR完了 |

### 本人確認書類 (identity_verification)

| 値       | 表示名 |
| -------- | ------ |
| none     | 未対応 |
| sent     | 発送   |
| received | 受取   |
| returned | 返送   |

### 抵当銀行 (mortgage_bank_status)

| 値        | 表示名   |
| --------- | -------- |
| none      | 未対応   |
| requested | 依頼     |
| accepted  | 受付完了 |

### 管理解約依頼 (management_cancel)

| 値        | 表示名 |
| --------- | ------ |
| none      | 未対応 |
| requested | 依頼   |
| completed | 完了   |

### 保証会社承継 (guarantee_transfer)

| 値        | 表示名 |
| --------- | ------ |
| none      | 未対応 |
| requested | 依頼   |
| completed | 完了   |

### 鍵 (key_status)

| 値       | 表示名 |
| -------- | ------ |
| none     | 未対応 |
| received | 受取   |
| sent     | 発送   |

### 管積口座振替手続き (account_transfer)

| 値       | 表示名 |
| -------- | ------ |
| none     | 未対応 |
| received | 受取   |
| sent     | 発送   |

---

## インデックス一覧

### properties

| インデックス名                   | カラム          |
| -------------------------------- | --------------- |
| idx_properties_organization_id   | organization_id |
| idx_properties_progress_status   | progress_status |
| idx_properties_document_status   | document_status |
| idx_properties_settlement_date   | settlement_date |
| idx_properties_created_at        | created_at      |

### property_staff

| インデックス名                   | カラム                |
| -------------------------------- | --------------------- |
| idx_property_staff_property_id   | property_id           |
| idx_property_staff_user_id       | user_id               |
| uk_property_staff_property_user  | property_id, user_id  |

### contract_progress

| インデックス名                   | カラム      |
| -------------------------------- | ----------- |
| uk_contract_progress_property_id | property_id |

### document_progress

| インデックス名                   | カラム      |
| -------------------------------- | ----------- |
| uk_document_progress_property_id | property_id |

### property_document_items

| インデックス名                          | カラム                 |
| --------------------------------------- | ---------------------- |
| idx_property_document_items_property_id | property_id            |
| uk_property_document_items_property_item| property_id, item_type |

### settlement_progress

| インデックス名                     | カラム      |
| ---------------------------------- | ----------- |
| uk_settlement_progress_property_id | property_id |

### property_progress_history

| インデックス名                           | カラム      |
| ---------------------------------------- | ----------- |
| idx_property_progress_history_property_id| property_id |
| idx_property_progress_history_changed_at | changed_at  |

---

## リレーション定義

| 親テーブル   | 子テーブル               | 関係  | 説明                       |
| ------------ | ------------------------ | ----- | -------------------------- |
| organizations| properties               | 1:N   | 組織は複数の案件を持つ     |
| properties   | property_staff           | 1:N   | 案件は複数の担当者を持つ   |
| properties   | contract_progress        | 1:1   | 案件は1つの契約進捗を持つ  |
| properties   | document_progress        | 1:1   | 案件は1つの書類進捗を持つ  |
| properties   | property_document_items  | 1:N   | 案件は複数の書類項目を持つ |
| properties   | settlement_progress      | 1:1   | 案件は1つの決済進捗を持つ  |
| properties   | property_progress_history| 1:N   | 案件は複数の進捗履歴を持つ |
| users        | property_staff           | 1:N   | ユーザーは複数案件を担当   |

---

## 参照ドキュメント

- [スキーマファイル](../../../../packages/drizzle/schemas/property.ts)
- [型定義](../../../../packages/drizzle/types/property.ts)
- [全体ER図](./er-diagram-visual.md)

---

最終更新: 2025-12-12
