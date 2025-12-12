# 案件管理システム ER図

## バージョン情報

- **作成日**: 2025-10-25
- **更新日**: 2025-12-12
- **バージョン**: 1.1
- **対象フェーズ**: MVP（最小限の機能を実装した初期バージョン）

---

## ER図

```mermaid
erDiagram
    %% ユーザー関連 (Better Auth管理)
    users ||--o{ property_staff : "manages"
    organization ||--o{ properties : "has"

    %% 案件関連
    properties ||--o{ property_staff : "assigned to"
    properties ||--|| contract_progress : "has"
    properties ||--|| document_progress : "has"
    properties ||--o{ property_document_items : "has"
    properties ||--|| settlement_progress : "has"
    properties ||--o{ property_progress_history : "has"

    %% 書類項目とユーザーの関係
    users ||--o{ property_document_items : "updates"

    %% ユーザーテーブル (Better Auth)
    users {
        string id PK "ユーザーID"
        string name "氏名"
        string email UK "メールアドレス"
        timestamp created_at "作成日時"
    }

    %% 組織テーブル (Better Auth)
    organization {
        string id PK "組織ID"
        string name "組織名"
        string slug UK "組織スラッグ"
        timestamp created_at "作成日時"
    }

    %% 案件テーブル
    properties {
        string id PK "案件ID"
        string organization_id FK "管理組織ID"
        string property_name "物件名"
        string room_number "号室"
        string owner_name "オーナー名"
        decimal amount_a "A金額(万円)"
        decimal amount_exit "出口金額(万円)"
        decimal commission "仲手等(万円)"
        decimal profit "利益(万円・自動計算)"
        decimal bc_deposit "BC手付(万円)"
        date contract_date_a "A契約日"
        date contract_date_bc "BC契約日"
        date settlement_date "決済予定日"
        string contract_type "契約形態"
        string company_b "B会社"
        string broker_company "仲介会社"
        string buyer_company "買取業者"
        string mortgage_bank "抵当銀行"
        string list_type "名簿種別"
        string progress_status "進捗ステータス"
        timestamp progress_status_updated_at "進捗更新日時"
        string progress_status_updated_by FK "進捗更新者ID"
        string document_status "書類ステータス"
        timestamp document_status_updated_at "書類ステータス更新日時"
        string document_status_updated_by FK "書類ステータス更新者ID"
        text notes "備考"
        string account_company "使用口座会社"
        string bank_account "使用銀行口座"
        string created_by "作成者ID"
        string updated_by "更新者ID"
        timestamp created_at "作成日時"
        timestamp updated_at "更新日時"
    }

    %% 案件担当者中間テーブル
    property_staff {
        string id PK "ID"
        string property_id FK "案件ID"
        string user_id "ユーザーID"
        timestamp created_at "作成日時"
    }

    %% 契約進捗テーブル
    contract_progress {
        string id PK "ID"
        string property_id FK "案件ID(UK)"
        string maisoku_distribution "マイソク配布"
        timestamp maisoku_distribution_at "配布日時"
        string maisoku_distribution_by FK "配布更新者ID"
        boolean ab_contract_saved "契約書保存完了"
        timestamp ab_contract_saved_at "保存日時"
        string ab_contract_saved_by "この項目を更新したユーザーID"
        boolean ab_authorization_saved "委任状関係保存完了"
        timestamp ab_authorization_saved_at "保存日時"
        string ab_authorization_saved_by "この項目を更新したユーザーID"
        boolean ab_seller_id_saved "売主身分証保存完了"
        timestamp ab_seller_id_saved_at "保存日時"
        string ab_seller_id_saved_by "この項目を更新したユーザーID"
        boolean bc_contract_created "BC売契作成"
        timestamp bc_contract_created_at "作成日時"
        string bc_contract_created_by "この項目を更新したユーザーID"
        boolean bc_description_created "重説作成"
        timestamp bc_description_created_at "作成日時"
        string bc_description_created_by "この項目を更新したユーザーID"
        boolean bc_contract_sent "BC売契送付"
        timestamp bc_contract_sent_at "送付日時"
        string bc_contract_sent_by "この項目を更新したユーザーID"
        boolean bc_description_sent "重説送付"
        timestamp bc_description_sent_at "送付日時"
        string bc_description_sent_by "この項目を更新したユーザーID"
        boolean bc_contract_cb_done "BC売契CB完了"
        timestamp bc_contract_cb_done_at "完了日時"
        string bc_contract_cb_done_by "この項目を更新したユーザーID"
        boolean bc_description_cb_done "重説CB完了"
        timestamp bc_description_cb_done_at "完了日時"
        string bc_description_cb_done_by "この項目を更新したユーザーID"
        timestamp created_at "作成日時"
        timestamp updated_at "更新日時"
    }

    %% 書類進捗テーブル(MVP簡易版) ※廃止予定
    document_progress {
        string id PK "ID"
        string property_id FK "案件ID(UK)"
        string status "書類ステータス"
        timestamp created_at "作成日時"
        timestamp updated_at "更新日時"
        string updated_by "最終更新者ID"
    }

    %% 書類項目テーブル(個別書類管理)
    property_document_items {
        string id PK "ID"
        string property_id FK "案件ID"
        string item_type "書類項目種別"
        string status "ステータス"
        timestamp updated_at "更新日時"
        string updated_by FK "更新者ID"
    }

    %% 決済進捗テーブル
    settlement_progress {
        string id PK "ID"
        string property_id FK "案件ID(UK)"
        string bc_settlement_status "BC精算書"
        string ab_settlement_status "AB精算書"
        boolean loan_calculation_saved "ローン計算書保存"
        timestamp loan_calculation_saved_at "保存日時"
        string loan_calculation_saved_by "この項目を更新したユーザーID"
        boolean lawyer_requested "司法書士依頼"
        timestamp lawyer_requested_at "依頼日時"
        string lawyer_requested_by "この項目を更新したユーザーID"
        boolean documents_shared "必要書類共有"
        timestamp documents_shared_at "共有日時"
        string documents_shared_by "この項目を更新したユーザーID"
        string identity_verification "本人確認書類"
        boolean documents_complete "書類不備なし"
        timestamp documents_complete_at "確認日時"
        string documents_complete_by "この項目を更新したユーザーID"
        string mortgage_bank_status "抵当銀行"
        boolean bank_documents_complete "書類不備なし"
        timestamp bank_documents_complete_at "確認日時"
        string bank_documents_complete_by "この項目を更新したユーザーID"
        boolean loan_saved "ローン計算書保存"
        timestamp loan_saved_at "保存日時"
        string loan_saved_by "この項目を更新したユーザーID"
        boolean seller_payment_done "売主手出し完了"
        timestamp seller_payment_done_at "完了日時"
        string seller_payment_done_by "この項目を更新したユーザーID"
        string management_cancel "管理解約依頼"
        string guarantee_transfer "保証会社承継"
        string key_status "鍵"
        string account_transfer "管積口座振替手続き"
        boolean ledger_entry "取引台帳記入"
        timestamp ledger_entry_at "記入日時"
        string ledger_entry_by "この項目を更新したユーザーID"
        timestamp created_at "作成日時"
        timestamp updated_at "更新日時"
    }

    %% 案件進捗履歴テーブル
    property_progress_history {
        string id PK "ID"
        string property_id FK "案件ID"
        string from_status "変更前ステータス"
        string to_status "変更後ステータス"
        string changed_by "変更者ID"
        timestamp changed_at "変更日時"
    }
```

---

## 書類項目種別 (item_type) の値

### 銀行関係

| 値               | 表示名       |
| ---------------- | ------------ |
| loan_calculation | ローン計算書 |

### 賃貸管理関係

| 値                  | 表示名       |
| ------------------- | ------------ |
| rental_contract     | 賃貸借契約書 |
| management_contract | 管理委託契約書 |
| move_in_application | 入居申込書   |

### 建物管理関係

| 値                        | 表示名           |
| ------------------------- | ---------------- |
| important_matters_report  | 重要事項調査報告書 |
| management_rules          | 管理規約         |
| long_term_repair_plan     | 長期修繕計画書   |
| general_meeting_minutes   | 総会議事録       |
| pamphlet                  | パンフレット     |
| bank_transfer_form        | 口座振替用紙     |
| owner_change_notification | 所有者変更届     |

### 役所関係

| 値                     | 表示名           |
| ---------------------- | ---------------- |
| tax_certificate        | 公課証明         |
| building_plan_overview | 建築計画概要書   |
| ledger_certificate     | 台帳記載事項証明書 |
| zoning_district        | 用途地域         |
| road_ledger            | 道路台帳         |

---

## 書類項目ステータス (status) の値

| 値            | 表示名 |
| ------------- | ------ |
| not_requested | 未依頼 |
| requesting    | 依頼中 |
| acquired      | 取得済 |
| not_required  | 不要   |

---

## 参照ドキュメント

- [テーブル定義詳細](./er-diagram.md)
- [Better Auth スキーマ](../../../../packages/drizzle/schemas/auth.ts)

---

最終更新: 2025-12-12
